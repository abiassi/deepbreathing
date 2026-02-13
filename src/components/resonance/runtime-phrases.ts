export type RuntimePhraseKey =
  | 'session.ready_to_start'
  | 'session.paused'
  | 'session.tap_enable_sound'
  | 'session.complete'
  | 'instruction.inhale_slowly'
  | 'instruction.inhale_again'
  | 'instruction.exhale'
  | 'instruction.exhale_fully'
  | 'instruction.inhale'
  | 'instruction.hold_your_breath'
  | 'instruction.deep_breath_in'
  | 'instruction.hold'
  | 'phase.ready'
  | 'phase.hold'
  | 'phase.inhale_again'
  | 'phase.inhale'
  | 'phase.exhale'
  | 'protocol.power_breathe'
  | 'protocol.round_complete'
  | 'protocol.complete'
  | 'ui.power_breath'
  | 'ui.round_of'
  | 'ui.breath_of'
  | 'ui.end_hold_recovery'
  | 'ui.sound_hint_no_audio';

type LocaleTable = Record<RuntimePhraseKey, string>;

type ResolveSource = 'locale' | 'fallback_en';

export interface ResolvedPhrase {
  text: string;
  source: ResolveSource;
}

const EN: LocaleTable = {
  'session.ready_to_start': 'Ready to start?',
  'session.paused': 'Paused',
  'session.tap_enable_sound': 'Tap once to enable sound',
  'session.complete': 'Session complete',
  'instruction.inhale_slowly': 'Inhale slowly...',
  'instruction.inhale_again': 'Inhale again...',
  'instruction.exhale': 'Exhale...',
  'instruction.exhale_fully': 'Exhale fully...',
  'instruction.inhale': 'Inhale...',
  'instruction.hold_your_breath': 'Hold your breath...',
  'instruction.deep_breath_in': 'Deep breath in',
  'instruction.hold': 'Hold',
  'phase.ready': 'Ready',
  'phase.hold': 'Hold',
  'phase.inhale_again': 'Inhale Again',
  'phase.inhale': 'Inhale',
  'phase.exhale': 'Exhale',
  'protocol.power_breathe': 'Power breathe',
  'protocol.round_complete': 'Round {round} complete',
  'protocol.complete': 'Protocol complete!',
  'ui.power_breath': 'Power breath',
  'ui.round_of': 'Round {current} of {total}',
  'ui.breath_of': 'Breath {current} of {total}',
  'ui.end_hold_recovery': 'End Hold -> Recovery Breath',
  'ui.sound_hint_no_audio': 'If you do not hear any sound, make sure your phone is not on silent.'
};

const ES: LocaleTable = {
  'session.ready_to_start': 'Listo para comenzar?',
  'session.paused': 'En pausa',
  'session.tap_enable_sound': 'Toca una vez para activar el sonido',
  'session.complete': 'Sesion completada',
  'instruction.inhale_slowly': 'Inhala lentamente...',
  'instruction.inhale_again': 'Inhala de nuevo...',
  'instruction.exhale': 'Exhala...',
  'instruction.exhale_fully': 'Exhala por completo...',
  'instruction.inhale': 'Inhala...',
  'instruction.hold_your_breath': 'Aguanta la respiracion...',
  'instruction.deep_breath_in': 'Inhala profundo',
  'instruction.hold': 'Mantener',
  'phase.ready': 'Listo',
  'phase.hold': 'Mantener',
  'phase.inhale_again': 'Inhala de nuevo',
  'phase.inhale': 'Inhala',
  'phase.exhale': 'Exhala',
  'protocol.power_breathe': 'Respiracion intensa',
  'protocol.round_complete': 'Ronda {round} completada',
  'protocol.complete': 'Protocolo completado!',
  'ui.power_breath': 'Respiracion intensa',
  'ui.round_of': 'Ronda {current} de {total}',
  'ui.breath_of': 'Respiracion {current} de {total}',
  'ui.end_hold_recovery': 'Terminar pausa -> Respiracion de recuperacion',
  'ui.sound_hint_no_audio': 'Si no escuchas sonido, asegurate de que tu telefono no este en silencio.'
};

const FR: LocaleTable = {
  'session.ready_to_start': 'Pret a commencer?',
  'session.paused': 'En pause',
  'session.tap_enable_sound': 'Touchez une fois pour activer le son',
  'session.complete': 'Session terminee',
  'instruction.inhale_slowly': 'Inspirez lentement...',
  'instruction.inhale_again': 'Inspirez encore...',
  'instruction.exhale': 'Expirez...',
  'instruction.exhale_fully': 'Expirez completement...',
  'instruction.inhale': 'Inspirez...',
  'instruction.hold_your_breath': 'Retenez votre souffle...',
  'instruction.deep_breath_in': 'Grande inspiration',
  'instruction.hold': 'Retenez',
  'phase.ready': 'Pret',
  'phase.hold': 'Retenez',
  'phase.inhale_again': 'Inspirez encore',
  'phase.inhale': 'Inspirez',
  'phase.exhale': 'Expirez',
  'protocol.power_breathe': 'Respiration puissante',
  'protocol.round_complete': 'Cycle {round} termine',
  'protocol.complete': 'Protocole termine!',
  'ui.power_breath': 'Respiration puissante',
  'ui.round_of': 'Cycle {current} sur {total}',
  'ui.breath_of': 'Souffle {current} sur {total}',
  'ui.end_hold_recovery': 'Fin de retention -> Souffle de recuperation',
  'ui.sound_hint_no_audio': 'Si vous n entendez aucun son, verifiez que votre telephone n est pas en mode silencieux.'
};

const DE: LocaleTable = {
  'session.ready_to_start': 'Bereit zum Start?',
  'session.paused': 'Pausiert',
  'session.tap_enable_sound': 'Einmal tippen, um Sound zu aktivieren',
  'session.complete': 'Sitzung abgeschlossen',
  'instruction.inhale_slowly': 'Langsam einatmen...',
  'instruction.inhale_again': 'Noch einmal einatmen...',
  'instruction.exhale': 'Ausatmen...',
  'instruction.exhale_fully': 'Vollstandig ausatmen...',
  'instruction.inhale': 'Einatmen...',
  'instruction.hold_your_breath': 'Atem anhalten...',
  'instruction.deep_breath_in': 'Tief einatmen',
  'instruction.hold': 'Halten',
  'phase.ready': 'Bereit',
  'phase.hold': 'Halten',
  'phase.inhale_again': 'Nochmals einatmen',
  'phase.inhale': 'Einatmen',
  'phase.exhale': 'Ausatmen',
  'protocol.power_breathe': 'Kraftatmung',
  'protocol.round_complete': 'Runde {round} abgeschlossen',
  'protocol.complete': 'Protokoll abgeschlossen!',
  'ui.power_breath': 'Kraftatmung',
  'ui.round_of': 'Runde {current} von {total}',
  'ui.breath_of': 'Atemzug {current} von {total}',
  'ui.end_hold_recovery': 'Halten beenden -> Erholungsatemzug',
  'ui.sound_hint_no_audio': 'Wenn du keinen Ton horst, stelle sicher, dass dein Telefon nicht stumm ist.'
};

const PT: LocaleTable = {
  'session.ready_to_start': 'Pronto para comecar?',
  'session.paused': 'Pausado',
  'session.tap_enable_sound': 'Toque uma vez para ativar o som',
  'session.complete': 'Sessao concluida',
  'instruction.inhale_slowly': 'Inspire devagar...',
  'instruction.inhale_again': 'Inspire novamente...',
  'instruction.exhale': 'Expire...',
  'instruction.exhale_fully': 'Expire completamente...',
  'instruction.inhale': 'Inspire...',
  'instruction.hold_your_breath': 'Prenda a respiracao...',
  'instruction.deep_breath_in': 'Respire fundo',
  'instruction.hold': 'Segure',
  'phase.ready': 'Pronto',
  'phase.hold': 'Segure',
  'phase.inhale_again': 'Inspire novamente',
  'phase.inhale': 'Inspire',
  'phase.exhale': 'Expire',
  'protocol.power_breathe': 'Respiracao intensa',
  'protocol.round_complete': 'Rodada {round} concluida',
  'protocol.complete': 'Protocolo concluido!',
  'ui.power_breath': 'Respiracao intensa',
  'ui.round_of': 'Rodada {current} de {total}',
  'ui.breath_of': 'Respiracao {current} de {total}',
  'ui.end_hold_recovery': 'Encerrar pausa -> Respiracao de recuperacao',
  'ui.sound_hint_no_audio': 'Se voce nao ouvir som, confira se o telefone nao esta no silencioso.'
};

const CATALOG: Record<string, LocaleTable> = {
  en: EN,
  es: ES,
  fr: FR,
  de: DE,
  pt: PT
};

const NEUTRAL_FALLBACKS: Record<RuntimePhraseKey, string> = {
  'session.ready_to_start': '...',
  'session.paused': '...',
  'session.tap_enable_sound': '...',
  'session.complete': '...',
  'instruction.inhale_slowly': '...',
  'instruction.inhale_again': '...',
  'instruction.exhale': '...',
  'instruction.exhale_fully': '...',
  'instruction.inhale': '...',
  'instruction.hold_your_breath': '...',
  'instruction.deep_breath_in': '...',
  'instruction.hold': '...',
  'phase.ready': '...',
  'phase.hold': '...',
  'phase.inhale_again': '...',
  'phase.inhale': '...',
  'phase.exhale': '...',
  'protocol.power_breathe': '...',
  'protocol.round_complete': '...',
  'protocol.complete': '...',
  'ui.power_breath': '...',
  'ui.round_of': '...',
  'ui.breath_of': '...',
  'ui.end_hold_recovery': '...',
  'ui.sound_hint_no_audio': '...'
};

const TEMPLATE_VAR_RE = /\{(\w+)\}/g;

function applyTemplate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(TEMPLATE_VAR_RE, (_match, key: string) => String(vars[key] ?? ''));
}

function normalizeLocale(locale: string): string {
  const lower = locale.toLowerCase();
  if (CATALOG[lower]) return lower;
  const base = lower.split('-')[0];
  return CATALOG[base] ? base : 'en';
}

export function detectRuntimeLocale(): string {
  if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.lang?.trim();
    if (htmlLang) return normalizeLocale(htmlLang);
  }
  if (typeof navigator !== 'undefined') {
    const nav = navigator.language?.trim();
    if (nav) return normalizeLocale(nav);
  }
  return 'en';
}

export function createRuntimePhraseResolver(locale: string) {
  const normalized = normalizeLocale(locale);
  const localeTable = CATALOG[normalized] ?? EN;

  const resolve = (key: RuntimePhraseKey, vars?: Record<string, string | number>): ResolvedPhrase => {
    const template = localeTable[key];
    if (template) {
      return { text: applyTemplate(template, vars), source: 'locale' };
    }
    return { text: applyTemplate(EN[key], vars), source: 'fallback_en' };
  };

  const neutral = (key: RuntimePhraseKey) => NEUTRAL_FALLBACKS[key];

  return {
    locale: normalized,
    resolve,
    neutral
  };
}
