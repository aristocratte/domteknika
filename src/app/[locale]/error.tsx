"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { ErrorPageContent } from "@/components/sections/error-page-content";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorPageContent statusCode={500} locale={locale} resetAction={reset} />;
}
