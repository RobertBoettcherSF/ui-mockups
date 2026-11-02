# What stays untranslated (v1.13.2)

The language flags (🇩🇪 🇬🇧 🇪🇸 🇫🇷) switch every on-screen text, number format,
clock format, unit and map place through the Ada core (`ada/`). The things
below stay as they are **on purpose**.

## Kept in every language

| What | Where | Why |
|---|---|---|
| Folder names / slugs (`drone-console` …), the mockup list in the top bar | gallery, top bar | They are file names and URLs. |
| Person and call-sign names (M. Venn, Station A, Garuda …) | call screens, drone, SDR | Names are not translated. |
| Fictional place names on voice screens follow the flag (Westmarrow / Talmersbrück / Valmorena del Mar / Port-Saumelle, from `texts.tsv`) | secure-video-call | Invented, not real places. |
| Codes and IDs (`ADMIN*00001`, `OPS-CH5`, `SP-04`, `DX-14`, `IMG_SP04_0512.jpg`, frequencies) | comms, field data, farm | Identifiers; only their numbers get the local decimal comma where they are measurements. |
| Hex dumps and code panes | self-organizing-system (code mode), cockpit/craft data blocks | Machine output. Only the menu labels and the mode hint are translated. |
| Terminal command words (`help`, `status`, `radar` …) and file names (`config.yml`) | verdant-os, aether-os | They are what you type. The sentences around them are translated. |
| Brand / product names (VerdantOS, AetherOS, Leaflet, Esri, OpenStreetMap, RainViewer, GitHub) | maps, terminals | Names. |
| Units that are already international (km/h, °C, hPa, µg/m³, NTU, MHz, dBZ, kt for air speed) | everywhere | Already metric / standard. |
| The **Debug** button, its prompt and the version stamp | every page | Kept English so the debug files are easy to read; the report records the language. |
| Machine process tables (`PID MODULE ADDR LOAD ST`, `0x… SYNC.L …` rows, module names and their `io.flush :: map` tags) | self-organizing-system | Generated machine output, like a hex dump. Its status words (OK/BUSY/IDLE/SYNC/MOVE/WAIT/DONE) now translate through Ada `texts.tsv` (since v1.13.2); its labels, hint and console lines (`Loading module... COMPLETE`, `> verify OK` …) are translated. |
| Shell prompt `agri@verdant:~$` | verdant-os | It is a user@host prompt. |
| `(C) 2025 Example Systems`, `EOxCloudless 2016 · CC BY 4.0` | secure-comms-portal, capital-air-patrol | Copyright / map attribution names. |
| The French half of the word ticker (`NOUVELLES RESEAU METEO DIFFUSION`) | public-broadcast-channel | Bilingual by design: the English half (INFORMATION, NETWORK, ADVISORY …) follows the flag through Ada `texts.tsv`; the French half stays French. |
| The Devanagari character rain on the gallery | gallery | Decoration, not text. |

## Screens with a fixed place

| Screen | Behaviour |
|---|---|
| `capital-air-patrol` | District name `BUNDESTAG` under DE is a proper name (allowed), not translated. |
| `global-ops-hub` | World view; no country to swap. |
| `public-broadcast-channel` | Bilingual English/French by design. The English half follows the flag, the French half stays French. |

## English is the United Kingdom (since v1.12.1)

By Robert's choice, 🇬🇧 English now means the United Kingdom: map screens
centre on London, region outlines are the 12 UK regions (bundled offline in
`vendor/data-regions-eu.js`), clocks are 24 h, acres/°F/ft are shown metric
while miles and mph stay (UK road convention). English therefore no longer
matches the v1.11.0 US maps. The US states file stays only as a fallback.

## Time zones

Berlin, Madrid and Paris are all on Central European Time, the same zone as
the browser clock the mockups use, so clocks show the browser's local time in
24 h format. English (UK, Europe/London) uses 24 h too; the clocks follow the browser's local time.

## Text that is generated at random

Some screens make up log lines and labels at random. Every fixed part of
those lines is in `ada/data/texts.tsv`; if a new random combination shows up
in English, add a row there and run `ada/build.sh`.
