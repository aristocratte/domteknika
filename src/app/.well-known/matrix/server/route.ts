import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    "m.server": "matrix.domteknika.ch:443",
  });
}
