# How we got here: the language core (v1.11.0 → v1.12.0)

## The problem

v1.11.0 had four flags, but language was handled in three different places:
a table in the gallery page, a table in `vendor/top-bar.js` and the spoken
lines in `vendor/voice-cover.js`. The mockups themselves were English only,
and the maps always showed the US Great Plains. Picking 🇫🇷 gave French card
titles above previews of Nebraska.

Robert's asks:

* the language must be consistent: French means France everywhere, German
  means Germany, including the previews;
* move as much logic as possible into plain Ada, simple and compact, so it
  can be studied;
* the entry stays an HTML file opened in a browser; some JSON is fine.

## Decisions

1. **One Ada core for everything that depends on language.** Texts, number
   formats, the 12/24 h clock, units and the place behind each flag. The
   JavaScript is a pipe: bytes in, bytes out. No translation tables or
   format rules remain in JS.
2. **WebAssembly, embedded as base64.** The same toolchain as
   murmuration-spark (AdaWebPack 24 = GNAT-LLVM, plus `wasm-ld`). Base64 in a
   `<script>` works from `file://`, where `fetch` of a `.wasm` file does
   not. The fallback (Ada writing committed JSON) was not needed.
3. **Translate on screen, not in each page.** Changing 20 pages by hand
   would touch thousands of strings and risk breaking English. Instead
   `lang.js` reads the text the page shows and asks the core. Pages did not
   need their strings rewritten; only the five map pages got small changes
   (centre, home point, region outlines) and `verdant-os` got one unit call.
4. **Rows with `#` for numbers, matched inside longer texts.** Many lines
   are built at run time (`Wind gust 71 km/h at NW mast`, log lines with
   clocks in front). A row with `#` covers every number, and longest-match
   inside the text covers concatenations. About 600 rows cover all 20 screens.
5. **English is untouched.** For English the core returns its input, and
   `lang.js` does not even walk the page. That is how "EN matches v1.11.0" is
   kept, and why English still shows the US (see UNTRANSLATED.md).
6. **Offline regions.** Germany's 16 Länder, France's 12 mainland regions and
   Spain's mainland communities, simplified and bundled
   (`vendor/data-regions-eu.js`, 43 KB), so maps work without a CDN.
7. **Plain Ada.** No generics, no tagged types, no heap, no exceptions, no
   secondary stack (the WebAssembly runtime does not have one; the build
   fails if code needs it, which is a useful check). Integers in thousandths
   instead of floating point for the unit conversions.

## Steps

1. Took a copy of v1.11.0 and English screenshots of all 20 screens as the
   baseline.
2. Opened every screen in headless Chromium four times, two seconds apart,
   and collected every text node, attribute, canvas text and title
   (668 distinct texts once numbers were replaced by `#`). Added texts found
   only in the source (terminal answers, error paths, phase names).
3. Wrote `ada/data/texts.tsv` (English, German, Spanish, French).
4. Wrote the core: `uim.ads` (languages, version), `uim-format` (numbers,
   clock, units), `uim-translate` (the matcher), `uim-places` (country,
   capital, map centre, time zone), `uim-api` (exports for JS), and
   `tools/gen_texts.py` to turn the TSV into Ada constants.
5. First build failed on `system__secondary_stack__*`: a function returning
   an unconstrained `String` needs the secondary stack. Rewrote it as a
   procedure that writes into the output buffer. Result: 86 KB of
   WebAssembly, loads in about 2 ms.
6. Wrote `vendor/lang.js`, added it to every page head, fixed the two pages
   without `<html lang>`, moved the gallery, top bar and voice tables to the
   core.
7. Map pages: centre and home point from `UIM.place()`, outlines from
   `vendor/regions.js` (US states for English, the flag's country
   otherwise).
8. Regression: English text sets of all screens equal v1.11.0 (only random
   content differs); English screenshots differ only in live radar tiles,
   random code panes and the version stamp.
9. Smoke and clipping: every screen in DE/ES/FR at 1280 px and DE/FR at
   390 px; fixed texts that were too long (e.g. the verdant-os terminal hint).
10. Previews per language, version 1.12.0, docs.

## Where to start reading

1. `ada/src/uim.ads` (20 lines)
2. `ada/src/uim-translate.adb` (the whole idea in one page)
3. `ada/src/uim-format.adb`
4. `vendor/lang.js`
5. `ada/data/texts.tsv`

## v1.12.1

11. Randomly generated English (login progress lines, schematic labels, the
    self-organizing console lines, relay headers) now come from rows in
    `ada/data/texts.tsv` with `#` placeholders, so DE/ES/FR never show them in
    English. A full smoke (20 screens + gallery, DE/ES/FR at 1280 px, DE/FR at
    390 px) was run on the final core; English previews were re-shot with the
    current stamp.
