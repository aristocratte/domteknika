import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(
    {
      "m.homeserver": {
        base_url: "https://matrix.domteknika.ch",
      },
      "org.matrix.msc4143.rtc_foci": [
        {
          type: "livekit",
          livekit_service_url: "https://rtc.domteknika.ch/livekit/jwt",
        },
      ],
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, Content-Type, Authorization",
      },
    },
  );
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, Content-Type, Authorization",
    },
  });
}

