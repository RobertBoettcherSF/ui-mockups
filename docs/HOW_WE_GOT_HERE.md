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
12. English = United Kingdom. Robert chose that 🇬🇧 means the UK: EN centres on
    London (Europe/London), uses the bundled UK regions, 24 h clocks, metric
    units with UK miles/mph. From v1.12.1 English deliberately no longer
    matches the v1.11.0 US maps (Lincoln, Nebraska).

## v1.12.2 — every screen follows the flag

Robert found coastal-monitor still showing a Pacific webcam, palm trees and UTC
under 🇬🇧. All 20 screens were audited for region-specific content. Local
details now come from the Ada core (`ada/src/uim-places.adb`: locale, time-zone
labels, coast type, seas, camera names, sea temperature, crops, a fictional
phone number) and are translated through `ada/data/texts.tsv`. Pages only draw
what the core names; there is no country logic in JavaScript.

| Screen | Found | 🇬🇧 EN (UK) | 🇩🇪 DE | 🇪🇸 ES | 🇫🇷 FR |
|---|---|---|---|---|---|
| coastal-monitor | Pacific webcam, palms, Pacific/Atlantic/Indian buoys, UTC, US date 11/2, "18.4 C" | North Sea webcam, Atlantic chalk-cliff cam with grass; buoys North Sea / Atlantic / English Channel; GMT/BST; 2/11; °C | Baltic webcam, North Sea grass-dune cam; Baltic / North Sea / Wadden Sea; CET/CEST | Mediterranean webcam, Balearic palm beach; Mediterranean / Balearic / Alborán; CET/CEST | Atlantic webcam, Mediterranean pine coast with rocks; Atlantic / Biscay / Mediterranean; CET/CEST |
| drone-console, aether-os | UTC "Z" clock, Lincoln NE | local clock + GMT/BST, London | CET/CEST, Berlin | CET/CEST, Madrid | CET/CEST, Paris |
| farm-weather-console, verdant-os | Corn/Soybean/Sorghum/Alfalfa, "borders us-atlas", US map | wheat, barley, oilseed rape, potatoes, grass ley; UK regions | wheat, barley, rape, maize, sugar beet | wheat, barley, olives, sunflower, vines | wheat, maize, rape, sugar beet, vines |
| voicemail-desktop | +1 555-0100, 12 h clock | +44 20 7946 0100 (fictional range), 24 h | +49 30 23125 100 (fictional range) | +34 910 000 100 | +33 1 99 00 01 00 (fictional range) |
| secure-comms-portal | US date "November 2, 2026", unlabelled time | "2 November 2026", time + GMT | local date, CET | local date, CET | local date, CET |
| public-broadcast-channel | US date order | date in the flag's locale | ← | ← | ← |
| global-ops-hub | en-US weekday, unlabelled clock | clock + zone label in the flag's zone | ← | ← | ← |

Left region-fixed on purpose: `ops-centre-berlin` (Berlin, CET), `ops-centre-france`
(Paris), `ops-centre-europe` (Brussels; its world map keeps ocean names);
the drone/aether route destination Delhi and the crew roster (the scenario is a
transit to India); `secure-video-call` "Harbourton" (fictional name);
public-broadcast-channel stays bilingual EN/FR by design; marine VHF 156.800 MHz
(international). Screens with no place reference (biometric-scan, cockpit,
craft, conference-grid, field-data-viewer, sdr-console, self-organizing,
gallery) are unchanged.

## v1.12.3
- Zone labels and offsets come from one Ada source (uim_zone): EU DST rule (last Sunday March to last Sunday October, 01:00 UTC). Winter GMT/MEZ/CET/HNEC, summer BST/MESZ/CEST/HAEC, by the displayed date.
- All clocks and dates are built in the flag zone and marked data-notr, so number formatting never touches them (fixes DE "2,11.").
- Replaced system-time clocks: public-broadcast-channel (was "LT"), field-data-viewer, farm-weather-console log, verdant-os clock and log, voicemail weekday.

## v1.13.0: the three ops-centre screens follow the flag
- `ops-centre-europe` -> `continental-ops-centre`: globe and world map centred on the flag's capital, red link lines from it.
- `ops-centre-france` -> `national-ops-centre`: the flag's country with its regions (data-regions-eu.js), capital plus two cities as red triangles, further city nodes; all coordinates from the Ada core (`home`, `nodes`).
- `ops-centre-berlin` -> `capital-air-patrol`: local satellite image of the capital's government district (EOxCloudless 2016, Sentinel-2, CC BY 4.0, vendor/imagery/LICENSE), flag badge and district name from the core (`gov`, `img`, `district`, `flag`): BUNDESTAG (DE), GOVERNMENT DISTRICT LONDON / MADRID / PARIS elsewhere. Notes use the uim_zone label.
- Old folders are redirect pages that keep `?lang`, `?v` and the hash.
- field-data-viewer: sample times show the flag's zone label instead of "LT".

| Flag | Continental HQ | National map | Air patrol |
|---|---|---|---|
| EN | London | UK regions, London, Manchester, Birmingham | Westminster, Government District London |
| DE | Berlin | Länder, Berlin, Hamburg, Munich | Bundestag |
| ES | Madrid | Comunidades, Madrid, Barcelona, Valencia | Government District Madrid |
| FR | Paris | Régions, Paris, Lyon, Bordeaux | Government District Paris |

## v1.13.1: QC fixes and a strict stray-English scan

- Full-phrase rows in `ada/data/texts.tsv` for the ops screens (RELATED ACTIVE FILES, RECORDED COMMUNICATION, RESTRICTED // CENTRAL DESK, YES, HOLD), the Voice button (on/off/unsupported), solar-sustained, SIDE, the farm trend line, Region A/B, the Copernicus attribution and the map projection captions.
- Word fixes: DE `NET` → NETZ (ES RED, FR RÉSEAU), DE `LOG` tab → PROTOKOLL, DE standalone "online" → verfügbar, ES "sys" → sis.
- `CC BY 4.0` and `EOxCloudless 2016 · CC BY 4.0` are literal rows, so the version is not turned into "4,0"; dotted versions (1.13.0, v3.2) were already left alone.
- Big titles on the three ops screens no longer slide under the top bar (`#wrap` starts 24 px down).
- The public-broadcast word ticker is now `data-notr`, so it stays the same English/French mix in every language.
- New `tools/strict_scan.py`: every visible DE/FR/ES string is split into words; a word counts as a hit if it occurs in the EN harvest, is not in that language's column of texts.tsv and is not in UNTRANSLATED.md. Names, slugs, machine tables, the French half of the broadcast and shared loanwords (Bus, Zoom, Sensor, nominal, regional …) are reported separately as allowed.
