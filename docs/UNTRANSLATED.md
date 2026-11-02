# What stays untranslated (v1.12.0)

The language flags (🇩🇪 🇬🇧 🇪🇸 🇫🇷) switch every on-screen text, number format,
clock format, unit and map place through the Ada core (`ada/`). The things
below stay as they are **on purpose**.

## Kept in every language

| What | Where | Why |
|---|---|---|
| Folder names / slugs (`drone-console` …), the mockup list in the top bar | gallery, top bar | They are file names and URLs. |
| Person and call-sign names (Mara Venn, Station A, Garuda, Harbourton …) | call screens, drone, SDR | Names are not translated. |
| Codes and IDs (`ADMIN*00001`, `OPS-CH5`, `SP-04`, `DX-14`, `IMG_SP04_0512.jpg`, frequencies) | comms, field data, farm | Identifiers; only their numbers get the local decimal comma where they are measurements. |
| Hex dumps and code panes | self-organizing-system (code mode), cockpit/craft data blocks | Machine output. Only the menu labels and the mode hint are translated. |
| Terminal command words (`help`, `status`, `radar` …) and file names (`config.yml`) | verdant-os, aether-os | They are what you type. The sentences around them are translated. |
| Brand / product names (VerdantOS, AetherOS, Leaflet, Esri, OpenStreetMap, RainViewer, GitHub) | maps, terminals | Names. |
| Units that are already international (km/h, °C, hPa, µg/m³, NTU, MHz, dBZ, kt for air speed) | everywhere | Already metric / standard. |
| The **Debug** button, its prompt and the version stamp | every page | Kept English so the debug files are easy to read; the report records the language. |
| The Devanagari character rain on the gallery | gallery | Decoration, not text. |

## Screens with a fixed place

| Screen | Behaviour |
|---|---|
| `ops-centre-berlin` | Always Berlin (Bundestag). Texts are translated, the place is not moved. |
| `ops-centre-france` | Always Paris. Texts translated. |
| `ops-centre-europe` | Always Brussels / Europe. Texts translated. |
| `global-ops-hub`, `coastal-monitor` | World / generic coast; no country to swap. |
| `public-broadcast-channel` | Bilingual English/French by design. The English half follows the flag, the French half stays French. |

## English keeps the v1.11.0 scenery (decision to confirm)

With 🇬🇧 English selected the map screens (`farm-weather-console`,
`verdant-os`, `sdr-console`, `drone-console`, `aether-os`) still show the US
Great Plains (Lincoln, Nebraska), exactly as in v1.11.0. This keeps the
regression rule "English matches v1.11.0". The Ada core already has one line
per language in `ada/src/uim-places.ads`; switching English to the UK
(London) means changing that line and adding UK regions to
`vendor/data-regions-eu.js`. UK region data is **not** bundled yet.

German, Spanish and French move these screens to Germany/Berlin,
Spain/Madrid and France/Paris with that country's regions (offline data in
`vendor/data-regions-eu.js`, sources in `vendor/LICENSE-regions`). Corsica,
the Canary Islands, Ceuta and Melilla are left out so the mainland fills the
small map panels.

## Time zones

Berlin, Madrid and Paris are all on Central European Time, the same zone as
the browser clock the mockups use, so clocks show the browser's local time in
24 h format. English keeps the 12 h clock where v1.11.0 had it.

## Text that is generated at random

Some screens make up log lines and labels at random. Every fixed part of
those lines is in `ada/data/texts.tsv`; if a new random combination shows up
in English, add a row there and run `ada/build.sh`.
