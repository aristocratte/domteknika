import type { Metadata } from "next";

import "./globals.css";
import { domtekSans } from "./domtek-font";
import { ErrorPageContent } from "@/components/sections/error-page-content";

export const metadata: Metadata = {
  title: "DOMTEKNIKA - Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootNotFound() {
  return (
    <html lang="en" className={`${domtekSans.variable} h-full antialiased`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ErrorPageContent statusCode={404} locale="en" standalone />
      </body>
    </html>
  );
}
