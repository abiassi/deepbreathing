"use client";

import { useEffect, useState } from "react";

interface MTConfig {
  supportedLocales: string[];
  defaultLang: string;
  urlMode: string;
  lang: string;
  path: string;
}

declare global {
  interface Window {
    __MT_CONFIG__?: MTConfig;
  }
}

const LOCALE_LABELS: Record<string, string> = {
  "es-es": "ES",
  "pt-br": "PT",
  "fr-fr": "FR",
};

const LOCALE_FULL_LABELS: Record<string, string> = {
  en: "English",
  "es-es": "Español",
  "pt-br": "Português",
  "fr-fr": "Français",
};

function getPrefix(locale: string): string {
  return locale.split("-")[0];
}

/** Compact language switcher for the Resonance header (next to Settings). */
export function LanguageSwitcherCompact() {
  const [config, setConfig] = useState<MTConfig | null>(null);

  useEffect(() => {
    // __MT_CONFIG__ is injected by the edge proxy on translated pages
    if (window.__MT_CONFIG__) {
      setConfig(window.__MT_CONFIG__);
    }
  }, []);

  if (!config) return null;

  const currentPrefix = getPrefix(config.lang);

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/80 px-2 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-sm backdrop-blur dark:border-border/40 dark:bg-card/40">
      <a
        href={config.path}
        className={`rounded-full px-2 py-0.5 transition-colors ${
          config.lang === config.defaultLang
            ? "bg-primary/15 text-foreground"
            : "hover:text-foreground"
        }`}
      >
        EN
      </a>
      {config.supportedLocales.map((loc) => {
        const prefix = getPrefix(loc);
        const isActive = prefix === currentPrefix;
        return (
          <a
            key={loc}
            href={`/${prefix}${config.path}`}
            className={`rounded-full px-2 py-0.5 transition-colors ${
              isActive
                ? "bg-primary/15 text-foreground"
                : "hover:text-foreground"
            }`}
          >
            {LOCALE_LABELS[loc] || prefix.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}

/** Footer-style language switcher with full language names. */
export function LanguageSwitcherFooter() {
  const [config, setConfig] = useState<MTConfig | null>(null);

  useEffect(() => {
    if (window.__MT_CONFIG__) {
      setConfig(window.__MT_CONFIG__);
    }
  }, []);

  if (!config) return null;

  const currentPrefix = getPrefix(config.lang);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
      <span className="text-[10px] uppercase tracking-wider opacity-60">🌐</span>
      <a
        href={config.path}
        className={`transition-colors ${
          config.lang === config.defaultLang
            ? "font-medium text-foreground"
            : "underline underline-offset-2 hover:text-foreground"
        }`}
      >
        {LOCALE_FULL_LABELS.en}
      </a>
      {config.supportedLocales.map((loc) => {
        const prefix = getPrefix(loc);
        const isActive = prefix === currentPrefix;
        return (
          <a
            key={loc}
            href={`/${prefix}${config.path}`}
            className={`transition-colors ${
              isActive
                ? "font-medium text-foreground"
                : "underline underline-offset-2 hover:text-foreground"
            }`}
          >
            {LOCALE_FULL_LABELS[loc] || loc}
          </a>
        );
      })}
    </div>
  );
}
