# Static OG images: evidence (2026-11-18)

**Build:** local `next build` (Next 15.5.29, Node 22.23, macOS) of branch `t3/cf701295`.
**Before:** the same build of `main` at `eaa2b7a`, served by `next start`, with every OG URL its prerendered HTML linked (260 distinct URLs) fetched from `/og` and `/og/[slug]`.
**After:** the same 260 URLs fetched from this branch's `next start`. English ones redirect (307) to `/og/t/<id>.png`.

## Result

- 252 of 260 images are pixel-identical to before. All 240 Latin-script images are byte-identical.
- 8 Japanese titles differ by about 1 px of horizontal glyph position. They are visually indistinguishable (see `ja-worst-case-zoom.png`).
  Cause: at request time `@vercel/og` fetched a Noto Sans JP subset from Google Fonts for each title. Kerning in opentype.js depends on which glyphs are in the subset, and one vendored font cannot reproduce every per-title subset. See `assets/og-fonts/README.md`.
- Two production samples (`/og?title=Free+Breathing+Visualizer…` and `/og/box`) were pixel-identical to the new static files. That confirms the local baseline matches production.

| Sample | Diff pixels | File |
|---|---|---|
| English home | 0 | `en-home.png` |
| `/breathe/box` | 0 | `breathe-box.png` |
| `/breathe/4-7-8` | 0 | `breathe-4-7-8.png` |
| Japanese home | 0 | `ja-home.png` |
| Long title, clamped to 72 characters (es) | 0 | `long-title-es.png` |
| Worst Japanese case | 4,649 | `ja-worst-case.png`, `ja-worst-case-zoom.png` |

Each image shows before, after, and a diff mask (white = any channel changed).

## Route table (`next build`)

```
├ ƒ /og                                    180 B         103 kB
├ ○ /og-preview                            180 B         103 kB
├ ƒ /og/[slug]                             180 B         103 kB
├ ● /og/t/[file]                           180 B         103 kB
├   ├ /og/t/00cgzg9ux8l.png
├   ├ /og/t/00d2ya3cpzq.png
├   ├ /og/t/013qhisnbid.png
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

`/og/t/[file]` is `●` with `fallback: false` and `initialRevalidateSeconds: false` in `prerender-manifest.json`. Its 260 PNGs are build output, not a runtime function.

## HTTP checks (`next start`)

```
$ curl -s localhost:3101<page> | grep og:image   (next start, final build)
/ -> https://deepbreathingexercises.com/og/t/0ib7kwl33rk.png
/ja -> https://deepbreathingexercises.com/og/t/19kw9pi0xjc.png
/breathe/box -> https://deepbreathingexercises.com/og/t/2ej6oetr05q.png
/ja/breathe/box -> https://deepbreathingexercises.com/og/t/2ej6oetr05q.png
/es/for/anxiety -> https://deepbreathingexercises.com/og/t/0zb4n90i1pz.png
/fr/for -> http://localhost:3000/og/t/0ih4ata1ftq.png
/stats -> https://deepbreathingexercises.com/og/t/0ib7kwl33rk.png
/recommend -> https://deepbreathingexercises.com/og/t/0ib7kwl33rk.png

$ curl -sI localhost:3101/og/t/0ib7kwl33rk.png
HTTP/1.1 200 OK
x-nextjs-cache: HIT
cache-control: s-maxage=31536000
content-type: image/png
x-robots-tag: noindex

$ legacy URLs: status, content-type, bytes, redirect target
/og?title=Free+Breathing+Visualizer%3A+Calm+Anxiety+in+60+Seconds 307  0 /og/t/0ib7kwl33rk.png
/og?title=Box+Breathing&color=ef4444                           200 image/png 107574 
/og/box                                                        307  0 /og/t/2ej6oetr05q.png
/og/box?cb=123                                                 307  0 /og/t/2ej6oetr05q.png
/og/box?lang=ja                                                200 image/png 131217 
/og?title=Free+Online+Box+Breathing+Timer&lang=es              200 image/png 134025 
/og?title=Some+Unregistered+Title                              200 image/png 125409 
/og/t/notregistered.png                                        404 text/html; charset=utf-8 5416 
```

`/fr/for` prints `localhost:3000` because the localized `/for` index sets no `metadataBase` and the local build has no `VERCEL_URL`. Production serves `https://deepbreathingexercises.com/og?title=…` for it today, and this change does not touch that behavior.
