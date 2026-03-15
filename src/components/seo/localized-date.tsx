"use client";

const LABELS: Record<string, { lastUpdated: string; reviewedBy: string }> = {
  en: { lastUpdated: "Last updated", reviewedBy: "Reviewed by" },
  es: { lastUpdated: "Última actualización", reviewedBy: "Revisado por" },
  pt: { lastUpdated: "Última atualização", reviewedBy: "Revisado por" },
  fr: { lastUpdated: "Dernière mise à jour", reviewedBy: "Révisé par" },
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
  };
  return map[lang] || "en-US";
}

export function LocalizedDate({
  date,
  reviewerName,
}: {
  date: string;
  reviewerName: string;
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
      {labels.lastUpdated}: {formatted} • {labels.reviewedBy} {reviewerName}
    </>
  );
}
