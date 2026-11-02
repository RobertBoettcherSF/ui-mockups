# How to: languages, the Ada core and the maps (v1.13.1)

## Use it

* Open the gallery and click a flag (🇩🇪 🇬🇧 🇪🇸 🇫🇷). The choice is saved
  (localStorage `uim-lang`) and every mockup opens in that language.
* Or add `?lang=de`, `?lang=es`, `?lang=fr` or `?lang=en` to any page URL,
  e.g. `drone-console/?lang=fr`. This also saves the choice.
* Works from `file://` too: the compiled core is embedded as base64, nothing
  is fetched.
* English (the default) is British: London maps, UK regions, 24 h clocks, metric units with miles/mph.

## Test it (5 minutes)

1. Gallery → 🇫🇷. Titles, descriptions and the previews switch to French
   (previews show France).
2. Open `farm-weather-console`: map over France with French regions, header
   `BASSIN PARISIEN · SECTEUR CENTRE`, numbers like `31,4°C`.
3. Open `drone-console`: the drone starts circling near Paris
   (`ATTENTE · champs près de Paris`) and flies to Delhi.
4. `verdant-os`: "Surface irriguée 502 ha" (English: "Irrigated acres 1,240").
5. Press **Debug**: the report contains `uiLanguage`, `coreVersion` and a
   `state.language` block (core size, load time, place).
6. Back to 🇬🇧: maps centre on London with the UK regions.

If the core cannot load, a red bar at the bottom says so, the page stays
English and the Debug report has `coreError`.

## How it fits together

```
ada/data/texts.tsv      one row per English text: en  de  es  fr  ("#" = a number)
tools/gen_texts.py      texts.tsv  ->  ada/src/uim-texts.ads   (plain Ada constants)
ada/src/*.ads|adb       the core: texts, number/clock/unit formats, places
ada/build.sh            Ada -> WebAssembly (GNAT-LLVM + wasm-ld) -> vendor/uim-core.js
vendor/uim-core.js      generated: the .wasm as base64 (about 86 KB)
vendor/lang.js          loads the core, sends page text through it
vendor/regions.js       region outlines for the map screens (geometry only)
vendor/data-regions-eu.js  offline regions of DE, FR, ES (TopoJSON)
```

Every page loads, in `<head>`, `uim-core.js` then `lang.js`, before its own
scripts. `lang.js` then:

* sets `<html lang>`;
* walks the page and translates every text node and the `placeholder`,
  `title` and `aria-label` attributes, plus `document.title`;
* watches the page (MutationObserver), so text the mockup writes later is
  translated too;
* wraps canvas `fillText` / `strokeText` / `measureText`, so canvas labels
  follow the language;
* skips `<script>`, `<style>`, `<code>`, anything marked `data-dbg` (Debug,
  version stamp, top bar) or `data-notr`.

Mockup code can call the core directly:

| Call | Result |
|---|---|
| `UIM.t("Battery")` | `"Akku"` in German |
| `UIM.num("1,234.5")` | `"1.234,5"` (DE/ES), `"1 234,5"` (FR) |
| `UIM.qty("1,240", "acres")` | `"1,240"` in English, `"502 ha"` otherwise (also `F`, `mi`, `mph`, `ft`) |
| `UIM.place()` | `{code, country, capital, home:[lat,lon], center, zoom, tz}` |
| `UIM.lang`, `UIM.version`, `UIM.ok`, `UIM.error`, `UIM.loadMs`, `UIM.size` | state |
| `UIM.setLang("de")` | switch live (used by the gallery) |

## How the core translates a text (ada/src/uim-translate.adb)

1. English: the text comes back unchanged.
2. `5:47 PM` style times become `17:47`.
3. Going left to right, at every word start the core looks for the longest
   row of `texts.tsv` that matches here. In a row, `#` matches a number and a
   space matches any run of spaces. A row that ends in a letter must end at a
   word end. The match is replaced by the row in the chosen language, and
   the numbers are put back in the same order, formatted for that language.
4. Numbers not inside a row are formatted too (`44.4` → `44,4`). Group marks
   are only added where English had commas (`12,345` → `12.345`, but buoy
   number `47205` stays). Numbers
   glued to letters (`0x4A2`, `2h`) and texts with two dots (`v1.11.0`,
   addresses) are left alone.
5. Everything else is copied as it is.

So a log line like `10:44:16 Wind gust 71 km/h at NW mast` needs only the row
`Wind gust # km/h at NW mast`.

## Add or change a text

1. Find the English text on screen (or in the page source).
2. Add a row to `ada/data/texts.tsv`: English, TAB, German, TAB, Spanish,
   TAB, French. Use `#` for numbers that change. Lines starting with `#` and
   without a TAB are comments.
3. Run `ada/build.sh` (needs the toolchain, see below). It regenerates
   `ada/src/uim-texts.ads` and `vendor/uim-core.js`.
4. Reload the page with `?lang=de`.

## Add a language

1. Add it to `type Language` in `ada/src/uim.ads` (after the others).
2. Add a column to `texts.tsv` and to the `Start`/`Size` tuples in
   `tools/gen_texts.py`.
3. Add its line in `ada/src/uim-places.ads` and its group/decimal mark in
   `Put_Number` (`ada/src/uim-format.adb`).
4. Add the code to `CODES` in `vendor/lang.js` and a flag button in
   `index.html`; regions to `vendor/data-regions-eu.js` if it has a map.

## Build the core

```sh
tools/get-toolchain.sh        # once: AdaWebPack 24 (GNAT-LLVM) into ada/toolchain
ada/build.sh                  # about 10 s; prints the .wasm size
```

`wasm-ld` comes from `lld` (any version 16+). Set `WASM_LD=/path/to/wasm-ld`
if it is not on the PATH, and `UIM_TOOLCHAIN=...` to use a toolchain
elsewhere. The build is deterministic: the same sources give the same bytes
(the sha256 is written into `vendor/uim-core.js`).

## Previews

`<slug>/preview.png` is the English preview; `preview-de.png`,
`preview-es.png`, `preview-fr.png` are the same screen with `?lang=`. The
gallery swaps them when the flag changes. Regenerate them with headless
Chromium at 1600×900 after visible changes.

## Version

`version.txt`, `APPV` in `vendor/debug-cover.js`, `Version` in
`ada/src/uim.ads` and the `?v=` in links must match (currently 1.13.1).
