import type { Metadata } from "next";

import { ErrorPageContent } from "@/components/sections/error-page-content";

export const metadata: Metadata = {
  title: "DOMTEKNIKA - Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LocaleNotFound() {
  return <ErrorPageContent statusCode={404} />;
}
