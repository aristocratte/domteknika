"use client";

import { useEffect } from "react";

import "./globals.css";
import { domtekSans } from "./domtek-font";
import { ErrorPageContent } from "@/components/sections/error-page-content";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${domtekSans.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ErrorPageContent
          statusCode={500}
          locale="en"
          standalone
          resetAction={reset}
        />
      </body>
    </html>
  );
}
