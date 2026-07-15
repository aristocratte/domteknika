import { createHash } from "node:crypto";

import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

const CONTACT_ADDRESS = "contact@domteknika.ch";
const CONTACT_FROM = `DOMTEKNIKA Website <${CONTACT_ADDRESS}>`;
const MAX_BODY_BYTES = 16 * 1024;
const RESEND_TIMEOUT_MS = 8_000;
const RATE_LIMIT_MAX_KEYS = 5_000;
const RATE_LIMIT_RULES = [
  { limit: 5, windowMs: 10 * 60 * 1_000 },
  { limit: 20, windowMs: 24 * 60 * 60 * 1_000 },
] as const;
const MAX_RATE_LIMIT_WINDOW_MS = Math.max(
  ...RATE_LIMIT_RULES.map((rule) => rule.windowMs),
);
const ALLOWED_LOCALES = new Set(["de", "en", "es", "fr", "ko", "zh"]);
const ALLOWED_FIELDS = new Set([
  "company",
  "email",
  "firstName",
  "lastName",
  "locale",
  "message",
  "phone",
  "submissionId",
  "website",
]);
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;
const MESSAGE_CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u;
const EMAIL_PATTERN = /^[A-Z0-9.!#$%&'*+/=?^_{}|~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/iu;
const PHONE_PATTERN = /^[+()\d\s./-]+$/u;
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

type ContactPayload = {
  company: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
  message: string;
  phone: string;
  submissionId: string;
};

type ContactResponseCode =
  | "invalid"
  | "rate_limited"
  | "unavailable";

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

type RateLimitGlobal = typeof globalThis & {
  __domtekContactRateLimit?: Map<string, number[]>;
};

const rateLimitGlobal = globalThis as RateLimitGlobal;
const rateLimitStore =
  rateLimitGlobal.__domtekContactRateLimit ?? new Map<string, number[]>();

rateLimitGlobal.__domtekContactRateLimit = rateLimitStore;

export async function POST(request: Request) {
  if (!isTrustedBrowserRequest(request)) {
    return errorResponse("invalid", 403);
  }

  if (
    request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      ?.trim()
      .toLowerCase() !== "application/json"
  ) {
    return errorResponse("invalid", 415);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_BODY_BYTES
  ) {
    return errorResponse("invalid", 413);
  }

  const bodyResult = await readBoundedRequestBody(request);
  if (!bodyResult.ok) return errorResponse("invalid", bodyResult.status);
  const rawBody = bodyResult.body;

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return errorResponse("invalid", 400);
  }

  if (isRecord(parsedBody) && hasFilledHoneypot(parsedBody)) {
    return successResponse();
  }

  const payload = parseContactPayload(parsedBody);
  if (!payload) {
    return errorResponse("invalid", 422);
  }

  const rateLimit = checkRateLimit(getClientFingerprint(request));
  if (!rateLimit.allowed) {
    return errorResponse("rate_limited", 429, {
      "Retry-After": String(rateLimit.retryAfterSeconds),
    });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not configured");
    return errorResponse("unavailable", 503);
  }

  const resend = new Resend(apiKey);
  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    RESEND_TIMEOUT_MS,
  );

  try {
    const requestOptions = {
      idempotencyKey: `contact-form/${payload.submissionId}`,
      signal: abortController.signal,
    } as Parameters<typeof resend.emails.send>[1] & {
      signal: AbortSignal;
    };

    const { data, error } = await resend.emails.send(
      {
        from: CONTACT_FROM,
        to: [CONTACT_ADDRESS],
        replyTo: payload.email,
        subject: "Nouveau message du site DOMTEKNIKA",
        text: buildPlainTextEmail(payload),
        html: buildHtmlEmail(payload),
        tags: [
          { name: "source", value: "contact_form" },
          { name: "locale", value: payload.locale },
        ],
      },
      requestOptions,
    );

    if (error || !data?.id) {
      console.error("[contact] Resend delivery failed", {
        name: error?.name ?? "unknown",
        statusCode: error?.statusCode ?? null,
      });
      return errorResponse("unavailable", 502);
    }

    return successResponse();
  } catch {
    console.error("[contact] Resend request failed");
    return errorResponse("unavailable", 502);
  } finally {
    clearTimeout(timeout);
  }
}

function parseContactPayload(value: unknown): ContactPayload | null {
  if (!isRecord(value)) return null;
  if (Object.keys(value).some((key) => !ALLOWED_FIELDS.has(key))) return null;

  const firstName = parseSingleLine(value.firstName, 1, 80);
  const lastName = parseSingleLine(value.lastName, 1, 80);
  const company = parseSingleLine(value.company, 0, 120);
  const rawEmail = parseSingleLine(value.email, 3, 254);
  const phone = parseSingleLine(value.phone, 0, 40);
  const message = parseMessage(value.message);
  const rawLocale = parseSingleLine(value.locale, 2, 2);
  const rawSubmissionId = parseSingleLine(value.submissionId, 36, 36);

  if (
    !firstName ||
    !lastName ||
    company === null ||
    !rawEmail ||
    phone === null ||
    !message ||
    !rawLocale ||
    !rawSubmissionId
  ) {
    return null;
  }

  const email = rawEmail.toLowerCase();
  const locale = rawLocale.toLowerCase();
  const submissionId = rawSubmissionId.toLowerCase();

  if (
    !EMAIL_PATTERN.test(email) ||
    (phone && !PHONE_PATTERN.test(phone)) ||
    !ALLOWED_LOCALES.has(locale) ||
    !UUID_V4_PATTERN.test(submissionId)
  ) {
    return null;
  }

  return {
    company,
    email,
    firstName,
    lastName,
    locale,
    message,
    phone,
    submissionId,
  };
}

async function readBoundedRequestBody(request: Request) {
  if (!request.body) {
    return { ok: true as const, body: "" };
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let body = "";
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return { ok: false as const, status: 413 };
      }

      body += decoder.decode(value, { stream: true });
    }

    body += decoder.decode();
    return { ok: true as const, body };
  } catch {
    return { ok: false as const, status: 400 };
  } finally {
    reader.releaseLock();
  }
}

function parseSingleLine(value: unknown, minLength: number, maxLength: number) {
  if (typeof value !== "string") return null;

  const normalized = value.trim().normalize("NFC");
  if (
    normalized.length < minLength ||
    normalized.length > maxLength ||
    CONTROL_CHARACTERS.test(normalized)
  ) {
    return null;
  }

  return normalized;
}

function parseMessage(value: unknown) {
  if (typeof value !== "string") return "";

  const normalized = value
    .replace(/\r\n?/gu, "\n")
    .trim()
    .normalize("NFC");

  if (
    normalized.length < 10 ||
    normalized.length > 5_000 ||
    MESSAGE_CONTROL_CHARACTERS.test(normalized)
  ) {
    return "";
  }

  return normalized;
}

function hasFilledHoneypot(value: Record<string, unknown>) {
  return typeof value.website === "string" && value.website.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTrustedBrowserRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;

  const originHeader = request.headers.get("origin");
  if (!originHeader) return false;

  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return false;
  }

  if (process.env.NODE_ENV !== "production" && isLocalDevelopmentOrigin(origin)) {
    return true;
  }

  const allowedOrigins = new Set([
    "https://domteknika.ch",
    "https://test.domteknika.ch",
    "https://www.domteknika.ch",
  ]);

  return allowedOrigins.has(origin.origin);
}

function isLocalDevelopmentOrigin(origin: URL) {
  return (
    (origin.protocol === "http:" || origin.protocol === "https:") &&
    ["127.0.0.1", "[::1]", "localhost"].includes(origin.hostname)
  );
}

function getClientFingerprint(request: Request) {
  const ip =
    getLastHeaderValue(request.headers.get("x-forwarded-for")) ||
    getLastHeaderValue(request.headers.get("x-real-ip"));
  const fallback = [
    request.headers.get("user-agent")?.slice(0, 256) ?? "unknown",
    request.headers.get("accept-language")?.slice(0, 128) ?? "unknown",
  ].join("\n");

  return createHash("sha256")
    .update(ip || fallback)
    .digest("hex")
    .slice(0, 40);
}

function getLastHeaderValue(value: string | null) {
  return value?.split(",").at(-1)?.trim().slice(0, 128) ?? "";
}

function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  pruneRateLimitStore(now);

  const previousAttempts = rateLimitStore.get(key) ?? [];
  const attempts = previousAttempts.filter(
    (timestamp) => timestamp > now - MAX_RATE_LIMIT_WINDOW_MS,
  );

  for (const rule of RATE_LIMIT_RULES) {
    const windowStart = now - rule.windowMs;
    const attemptsInWindow = attempts.filter(
      (timestamp) => timestamp > windowStart,
    );

    if (attemptsInWindow.length >= rule.limit) {
      const retryAfterMs = attemptsInWindow[0] + rule.windowMs - now;
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1_000)),
      };
    }
  }

  attempts.push(now);
  rateLimitStore.set(key, attempts);
  return { allowed: true };
}

function pruneRateLimitStore(now: number) {
  const oldestAllowedTimestamp = now - MAX_RATE_LIMIT_WINDOW_MS;

  for (const [key, timestamps] of rateLimitStore) {
    if (!timestamps.some((timestamp) => timestamp > oldestAllowedTimestamp)) {
      rateLimitStore.delete(key);
    }
  }

  while (rateLimitStore.size >= RATE_LIMIT_MAX_KEYS) {
    const oldestKey = rateLimitStore.keys().next().value;
    if (typeof oldestKey !== "string") break;
    rateLimitStore.delete(oldestKey);
  }
}

function buildPlainTextEmail(payload: ContactPayload) {
  return [
    "Nouveau message depuis le formulaire DOMTEKNIKA",
    "",
    `Nom : ${payload.firstName} ${payload.lastName}`,
    `Entreprise : ${payload.company || "Non renseignée"}`,
    `E-mail : ${payload.email}`,
    `Téléphone : ${payload.phone || "Non renseigné"}`,
    `Langue du formulaire : ${payload.locale.toUpperCase()}`,
    "",
    "Message :",
    payload.message,
  ].join("\n");
}

function buildHtmlEmail(payload: ContactPayload) {
  const rows = [
    ["Nom", `${payload.firstName} ${payload.lastName}`],
    ["Entreprise", payload.company || "Non renseignée"],
    ["E-mail", payload.email],
    ["Téléphone", payload.phone || "Non renseigné"],
    ["Langue", payload.locale.toUpperCase()],
  ];

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#f5f5f5;color:#161616;font-family:Arial,sans-serif;">
    <div style="max-width:680px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;padding:28px;">
        <p style="margin:0 0 8px;color:#e30613;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Formulaire du site</p>
        <h1 style="margin:0 0 24px;font-size:24px;line-height:1.2;">Nouveau message DOMTEKNIKA</h1>
        <table role="presentation" style="width:100%;border-collapse:collapse;">
          ${rows
            .map(
              ([label, value]) => `<tr>
                <td style="width:130px;padding:8px 12px 8px 0;border-bottom:1px solid #eeeeee;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td>
                <td style="padding:8px 0;border-bottom:1px solid #eeeeee;vertical-align:top;">${escapeHtml(value)}</td>
              </tr>`,
            )
            .join("")}
        </table>
        <h2 style="margin:28px 0 10px;font-size:16px;">Message</h2>
        <div style="white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.55;">${escapeHtml(payload.message)}</div>
      </div>
    </div>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/gu, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "'": "&#39;",
      '"': "&quot;",
      "<": "&lt;",
      ">": "&gt;",
    };

    return entities[character] ?? character;
  });
}

function successResponse() {
  return jsonResponse({ ok: true }, 200);
}

function errorResponse(
  code: ContactResponseCode,
  status: number,
  headers?: HeadersInit,
) {
  return jsonResponse({ ok: false, code }, status, headers);
}

function jsonResponse(
  body: { ok: true } | { ok: false; code: ContactResponseCode },
  status: number,
  extraHeaders?: HeadersInit,
) {
  const headers = new Headers(extraHeaders);
  headers.set("Cache-Control", "no-store, max-age=0");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Vary", "Origin");
  headers.set("X-Content-Type-Options", "nosniff");

  return Response.json(body, { status, headers });
}
