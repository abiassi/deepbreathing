# OG image fonts

The build draws `/og/t/*.png` with these files (`src/lib/og-fonts-static.ts`).
They reproduce the fonts `/og` fetched from Google Fonts at request time, so
the static images match the old ones.

| File | Source |
|---|---|
| `Inter-Regular.ttf`, `Inter-Bold.ttf` | Google Fonts `Inter` v20, weights 400 and 700, unmodified |
| `NotoSansJP-Regular-NoInter.ttf` | Google Fonts `Noto Sans JP` v57, weight 400, subset (below) |

## Why Noto Sans JP is subset

For a Japanese title, `@vercel/og` fetched Noto Sans JP with `text=` set to
the characters Inter lacks. Satori picks one font per word from its first
character, so in a word like `：60秒` the digits came from Inter only because
that subset had no digits. The vendored font therefore keeps only the code
points Inter does not cover, plus the space Google always adds, and the
layout features Google's subsets carry:

```sh
pyftsubset NotoSansJP-Regular.ttf \
  --unicodes-file=<code points in Noto Sans JP's cmap and in neither Inter file, plus U+0020> \
  --layout-features='halt,palt,vert,vhal,vpal,vrt2' \
  --name-IDs='*' --name-languages='*' --notdef-outline \
  --output-file=NotoSansJP-Regular-NoInter.ttf
```

Google subsets per request, and its kerning data depends on which glyphs are
in the subset, so some Japanese titles can still land about 1 px apart from
the old images.

Both families are licensed under the SIL Open Font License 1.1; see
`Inter-OFL.txt` and `NotoSansJP-OFL.txt`.
