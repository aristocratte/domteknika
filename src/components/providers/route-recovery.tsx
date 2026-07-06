"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const RECOVERY_PREFIX = "domtek-route-recovery:";
const BLANK_RECOVERY_PREFIX = "domtek-blank-route-recovery:";

function getErrorText(reason: unknown) {
  if (reason instanceof Error) {
    return `${reason.name} ${reason.message} ${reason.stack ?? ""}`;
  }
  if (typeof reason === "string") return reason;
  if (reason && typeof reason === "object") {
    const record = reason as { message?: unknown; name?: unknown; stack?: unknown };
    return [record.name, record.message, record.stack]
      .filter((value): value is string => typeof value === "string")
      .join(" ");
  }
  return "";
}

function isRecoverableRouteLoadError(reason: unknown) {
  const text = getErrorText(reason).toLowerCase();

  return [
    "chunkloaderror",
    "loading chunk",
    "loading css chunk",
    "failed to fetch dynamically imported module",
    "error loading dynamically imported module",
    "importing a module script failed",
    "failed to fetch rsc payload",
    "server components payload",
    "next-flight",
    "/_next/static/",
  ].some((needle) => text.includes(needle));
}

function recoveryKey() {
  return `${RECOVERY_PREFIX}${window.location.pathname}${window.location.search}`;
}

function blankRecoveryKey() {
  return `${BLANK_RECOVERY_PREFIX}${window.location.pathname}${window.location.search}`;
}

function recoverFromStaleRouteChunk(reason: unknown) {
  if (!isRecoverableRouteLoadError(reason)) return;

  const key = recoveryKey();
  if (window.sessionStorage.getItem(key) === "done") return;

  window.sessionStorage.setItem(key, "done");
  window.location.reload();
}

function isRouteVisiblyBlank() {
  const main = document.querySelector("main");
  if (!main) return true;

  const mainRect = main.getBoundingClientRect();
  const mainStyle = window.getComputedStyle(main);
  const mainText = main.textContent?.trim() ?? "";

  return (
    document.readyState === "complete" &&
    mainRect.width > 0 &&
    mainStyle.display !== "none" &&
    mainStyle.visibility !== "hidden" &&
    mainText.length < 20
  );
}

function recoverFromBlankRoute() {
  if (!isRouteVisiblyBlank()) return;

  const key = blankRecoveryKey();
  if (window.sessionStorage.getItem(key) === "done") return;

  window.sessionStorage.setItem(key, "done");
  window.location.reload();
}

export function RouteRecovery() {
  const pathname = usePathname();

  useEffect(() => {
    const clearSuccessfulRecovery = window.setTimeout(() => {
      if (!isRouteVisiblyBlank()) {
        window.sessionStorage.removeItem(recoveryKey());
        window.sessionStorage.removeItem(blankRecoveryKey());
      }
    }, 1800);
    const blankRouteCheck = window.setTimeout(recoverFromBlankRoute, 3200);

    const handleError = (event: ErrorEvent) => {
      const target = event.target;
      const source =
        target instanceof HTMLScriptElement
          ? target.src
          : target instanceof HTMLLinkElement
            ? target.href
            : "";

      recoverFromStaleRouteChunk(
        event.error ?? [event.message, event.filename, source].join(" "),
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      recoverFromStaleRouteChunk(event.reason);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.clearTimeout(clearSuccessfulRecovery);
      window.clearTimeout(blankRouteCheck);
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [pathname]);

  return null;
}
