"use client";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <html lang="fr">
      <body className="min-h-screen bg-background font-sans text-foreground">
        <main className="grid min-h-screen place-items-center px-6">
          <div className="max-w-[520px] text-center">
            <div className="mx-auto mb-7 grid size-14 place-items-center rounded-[8px] bg-brand text-[32px] font-extrabold leading-none text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
              !
            </div>
            <p className="text-[12px] font-extrabold uppercase tracking-wide text-brand">
              DOMTEKNIKA
            </p>
            <h1 className="domtek-text-shadow mt-4 text-[38px] font-extrabold leading-none text-foreground sm:text-[50px]">
              La page n&apos;a pas fini de charger
              <span className="text-brand">.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[420px] text-[15px] font-medium leading-[1.45] text-muted-foreground">
              Une erreur de chargement est survenue. Réessayez ou rechargez la page.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-[7px] bg-brand px-5 text-[14px] font-extrabold text-white shadow-[0_4px_10px_rgba(0,0,0,0.24)]"
                onClick={reset}
              >
                Réessayer
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-[7px] border border-border bg-white px-5 text-[14px] font-extrabold text-foreground"
                onClick={() => window.location.reload()}
              >
                Recharger
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
