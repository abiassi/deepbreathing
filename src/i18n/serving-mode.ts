import type { NativeLinkMode } from "./route-manifest";

export const NATIVE_I18N_MODES = ["native-preview", "native"] as const;

export type NativeI18nMode = NativeLinkMode;

export function resolveNativeI18nMode(
  value: string | undefined = process.env.NATIVE_I18N_MODE,
): NativeI18nMode {
  const mode = value || "native";
  if ((NATIVE_I18N_MODES as readonly string[]).includes(mode)) {
    return mode as NativeI18nMode;
  }

  throw new Error(`Unsupported NATIVE_I18N_MODE: ${mode}`);
}
