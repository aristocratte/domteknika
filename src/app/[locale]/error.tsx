"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const ERROR_COPY = {
  fr: {
    title: "La page n'a pas fini de charger",
    body: "La navigation n'a pas abouti correctement. Réessayez, ou rechargez la page si le serveur local vient d'être mis à jour.",
    retry: "Réessayer",
    reload: "Recharger",
  },
  en: {
    title: "Page loading issue",
    body: "The page did not finish loading correctly. Try again, or reload the page if the local server was just updated.",
    retry: "Try again",
    reload: "Reload page",
  },
  de: {
    title: "Die Seite wurde nicht vollständig geladen",
    body: "Die Navigation wurde nicht korrekt abgeschlossen. Versuchen Sie es erneut oder laden Sie die Seite neu, falls der lokale Server gerade aktualisiert wurde.",
    retry: "Erneut versuchen",
    reload: "Neu laden",
  },
  es: {
    title: "La página no terminó de cargar",
    body: "La navegación no se completó correctamente. Inténtalo de nuevo o recarga la página si el servidor local acaba de actualizarse.",
    retry: "Intentar de nuevo",
    reload: "Recargar",
  },
  ko: {
    title: "페이지 로딩이 완료되지 않았습니다",
    body: "탐색이 정상적으로 완료되지 않았습니다. 다시 시도하거나 로컬 서버가 방금 업데이트된 경우 페이지를 새로고침하세요.",
    retry: "다시 시도",
    reload: "새로고침",
  },
  zh: {
    title: "页面未完成加载",
    body: "导航未正确完成。请重试；如果本地服务器刚刚更新，请刷新页面。",
    retry: "重试",
    reload: "刷新页面",
  },
};

function getErrorCopy(pathname: string) {
  const locale = pathname.split("/")[1] as keyof typeof ERROR_COPY;
  return ERROR_COPY[locale] ?? ERROR_COPY.en;
}

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const copy = getErrorCopy(pathname);

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
