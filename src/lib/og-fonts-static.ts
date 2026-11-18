import { readFile } from "node:fs/promises";
import path from "node:path";

// Build-time fonts for the static OG images, read from assets/og-fonts.
// Japanese titles fall back to a Noto Sans JP subset that matches what
// @vercel/og fetched from Google Fonts at request time (see the README there).
// Satori parses every font it is given, so the 5 MB Japanese font is only
// passed when a title needs it.

const FONT_DIR = path.join(process.cwd(), "assets", "og-fonts");
const JAPANESE_TEXT = /\p{scx=Hira}|\p{scx=Kana}|\p{scx=Han}|[\u3000]|[\uFF00-\uFFEF]/u;

const cache = new Map<string, Promise<ArrayBuffer>>();

function readFont(file: string) {
  let font = cache.get(file);
  if (!font) {
    font = readFile(path.join(FONT_DIR, file)).then((data) =>
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer,
    );
    cache.set(file, font);
  }
  return font;
}

export async function loadStaticOgFonts(text: string) {
  const [regular, bold] = await Promise.all([readFont("Inter-Regular.ttf"), readFont("Inter-Bold.ttf")]);
  const fonts = [
    { name: "Inter", data: regular, weight: 400, style: "normal" },
    { name: "Inter", data: bold, weight: 700, style: "normal" },
  ] as Array<{ name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }>;
  if (JAPANESE_TEXT.test(text)) {
    fonts.push({
      name: "Noto Sans JP",
      data: await readFont("NotoSansJP-Regular-NoInter.ttf"),
      weight: 400,
      style: "normal",
    });
  }
  return fonts;
}
