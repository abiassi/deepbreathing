"use client";

import Link from "next/link";

const LABELS: Record<string, {
  lastUpdated: string;
  writtenBy: string;
  reviewedBy: string;
  methodology: string;
  methodologyLink: string;
}> = {
  en: { lastUpdated: "Last updated", writtenBy: "Written by", reviewedBy: "Reviewed by", methodology: "Our content follows evidence-based guidelines.", methodologyLink: "Learn about our methodology →" },
  es: { lastUpdated: "Última actualización", writtenBy: "Escrito por", reviewedBy: "Revisado por", methodology: "Nuestro contenido sigue pautas basadas en evidencia.", methodologyLink: "Conozca nuestra metodología →" },
  pt: { lastUpdated: "Última atualização", writtenBy: "Escrito por", reviewedBy: "Revisado por", methodology: "Nosso conteúdo segue diretrizes baseadas em evidências.", methodologyLink: "Conheça nossa metodologia →" },
  fr: { lastUpdated: "Dernière mise à jour", writtenBy: "Écrit par", reviewedBy: "Révisé par", methodology: "Notre contenu suit des directives fondées sur des preuves.", methodologyLink: "Découvrez notre méthodologie →" },
};

function getLang(): string {
  if (typeof document !== "undefined") {
    return (document.documentElement.lang || "en").split("-")[0];
  }
  return "en";
}

interface ContentCredentialsProps {
  lastUpdated: string;
  author?: string;
  reviewedBy?: string;
  compact?: boolean;
}

/**
 * ContentCredentials component for E-E-A-T signals
 * Displays last updated date, author, and reviewer info
 */
export function ContentCredentials({
  lastUpdated,
  author = "Resonance Editorial Team",
  reviewedBy,
  compact = false
}: ContentCredentialsProps) {
  const lang = getLang();
  const l = LABELS[lang] || LABELS.en;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>{l.lastUpdated}: {lastUpdated}</span>
        <span className="text-border">•</span>
        <span>{l.writtenBy} {author}</span>
        {reviewedBy && (
          <>
            <span className="text-border">•</span>
            <span>{l.reviewedBy} {reviewedBy}</span>
          </>
        )}
        <span className="text-border">•</span>
        <Link href="/about/methodology" className="text-primary hover:underline">
          {l.methodologyLink}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 text-sm">
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
        <div>
          <span className="font-medium text-card-foreground">{l.lastUpdated}:</span> {lastUpdated}
        </div>
        <div>
          <span className="font-medium text-card-foreground">{l.writtenBy}:</span> {author}
        </div>
        {reviewedBy && (
          <div>
            <span className="font-medium text-card-foreground">{l.reviewedBy}:</span> {reviewedBy}
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {l.methodology}{" "}
        <Link href="/about/methodology" className="text-primary hover:underline">
          {l.methodologyLink}
        </Link>
      </p>
    </div>
  );
}
