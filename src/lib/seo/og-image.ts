const DEFAULT_TITLE = "Deep Breathing Exercises";

export function createOgImagePath(title: string, options?: { subtitle?: string; color?: string }) {
  const params = new URLSearchParams();
  params.set("title", title || DEFAULT_TITLE);

  if (options?.subtitle) {
    params.set("subtitle", options.subtitle);
  }

  if (options?.color) {
    params.set("color", options.color);
  }

  return `/og?${params.toString()}`;
}
