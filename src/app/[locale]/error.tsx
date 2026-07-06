"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const isFrench = pathname.startsWith("/fr");
  const copy = isFrench
    ? {
        title: "La page n'a pas fini de charger",
        body: "La navigation n'a pas abouti correctement. Réessayez, ou rechargez la page si le serveur local vient d'être mis à jour.",
        retry: "Réessayer",
        reload: "Recharger",
      }
    : {
        title: "Page loading issue",
        body: "The page did not finish loading correctly. Try again, or reload the page if the local server was just updated.",
        retry: "Try again",
        reload: "Reload page",
      };

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="grid min-h-screen place-items-center bg-background px-6 pt-[112px]">
      <div className="max-w-[520px] text-center">
        <div className="mx-auto mb-7 grid size-14 place-items-center rounded-[8px] bg-brand text-[32px] font-extrabold leading-none text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
          !
        </div>
        <p className="text-[12px] font-extrabold uppercase tracking-wide text-brand">
          DOMTEKNIKA
        </p>
        <h1 className="domtek-text-shadow mt-4 text-[38px] font-extrabold leading-none text-foreground sm:text-[50px]">
          {copy.title}
          <span className="text-brand">.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[420px] text-[15px] font-medium leading-[1.45] text-muted-foreground">
          {copy.body}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            className="h-10 rounded-[7px] px-5 font-extrabold"
            onClick={reset}
          >
            {copy.retry}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-[7px] px-5 font-extrabold"
            onClick={() => window.location.reload()}
          >
            {copy.reload}
          </Button>
        </div>
      </div>
    </section>
  );
}
