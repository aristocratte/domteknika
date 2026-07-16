import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const size = {
  width: 1200,
  height: 630,
};

export async function GET() {
  const logo = await readFile(
    join(process.cwd(), "public/assets/logo_DOMTEKNIKA_2023-alpha.png"),
    "base64",
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#ffffff",
          color: "#161616",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(135deg, rgba(227,6,19,0.06), rgba(255,255,255,0) 52%), radial-gradient(circle at 86% 22%, rgba(227,6,19,0.09), rgba(255,255,255,0) 26%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            display: "flex",
            background: "#e30613",
          }}
        />
        <div
          style={{
            width: "100%",
            padding: "76px 86px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* ImageResponse requires a plain img element; next/image is not supported by Satori. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${logo}`}
            width={300}
            height={121}
            alt=""
            style={{ objectFit: "contain" }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                maxWidth: 900,
                display: "flex",
                fontSize: 58,
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Engineering. Prototyping. Producing.
            </div>
            <div
              style={{
                marginTop: 26,
                display: "flex",
                alignItems: "center",
                gap: 18,
                fontSize: 25,
                color: "#555555",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 4,
                  display: "flex",
                  background: "#e30613",
                }}
              />
              Swiss engineering for real-world solutions
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
