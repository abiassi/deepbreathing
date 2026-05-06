"use client";

const LABELS: Record<string, { lastUpdated: string; reviewedBy: string }> = {
  en: { lastUpdated: "Last updated", reviewedBy: "Reviewed by" },
  es: { lastUpdated: "Última actualización", reviewedBy: "Revisado por" },
  pt: { lastUpdated: "Última atualização", reviewedBy: "Revisado por" },
  fr: { lastUpdated: "Dernière mise à jour", reviewedBy: "Révisé par" },
  de: { lastUpdated: "Zuletzt aktualisiert", reviewedBy: "Überprüft von" },
  ja: { lastUpdated: "最終更新", reviewedBy: "レビュー担当" },
};

function getLocale(): string {
  if (typeof document !== "undefined") {
    return document.documentElement.lang || "en";
  }
  return "en";
}

function getDateLocale(lang: string): string {
  const map: Record<string, string> = {
    en: "en-US",
    es: "es-ES",
    pt: "pt-BR",
    fr: "fr-FR",
    de: "de-DE",
    ja: "ja-JP",
  };
  return map[lang] || "en-US";
}

export function LocalizedDate({
  date,
  reviewerName,
}: {
  date: string;
  reviewerName?: string | null;
}) {
  const lang = getLocale().split("-")[0];
  const labels = LABELS[lang] || LABELS.en;
  const dateLocale = getDateLocale(lang);
  const formatted = new Date(date).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {labels.lastUpdated}: {formatted}
      {reviewerName ? <> • {labels.reviewedBy} {reviewerName}</> : null}
    </>
  );
}
