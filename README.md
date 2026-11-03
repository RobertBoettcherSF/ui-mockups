# UI Mockups

**Live gallery:** https://robertboettchersf.github.io/ui-mockups/

## How it works

All texts, number/unit formatting, time-zone labels and per-country place data come from a
small **plain Ada core compiled to WebAssembly** (no Ada runtime; sources in [`ada/`](ada/),
texts in [`ada/data/texts.tsv`](ada/data/texts.tsv), built by `ada/build.sh` into
`vendor/uim-core.js`, which embeds the WASM so pages also work from `file://`). The pages
themselves are plain HTML/CSS/JS. See [docs/HOWTO.md](docs/HOWTO.md) and
[docs/HOW_WE_GOT_HERE.md](docs/HOW_WE_GOT_HERE.md).

Standalone HTML/CSS (+ vanilla JS) mockups of interface layouts.
Each folder is self-contained; open its `index.html` in a browser. The map views attempt to
use real public map data when online, and fall back gracefully to generated/SVG maps offline.

## Gallery

Every screen follows the selected flag: language, and wherever a map, coast, clock or place appears, the region (🇬🇧 UK/London, 🇩🇪 Germany/Berlin, 🇪🇸 Spain/Madrid, 🇫🇷 France/Paris).

| Preview | Mockup | Description |
|---|---|---|
| [<img src="farm-weather-console/preview.png" width="240">](farm-weather-console/preview.png) | [`farm-weather-console`](farm-weather-console/index.html) | Farm weather & crop monitoring console with live radar map |
| [<img src="drone-console/preview.png" width="240">](drone-console/preview.png) | [`drone-console`](drone-console/index.html) | Solar UAV ground-control console with satellite tracking map |
| [<img src="verdant-os/preview.png" width="240">](verdant-os/preview.png) | [`verdant-os`](verdant-os/index.html) | Farm desktop operating system concept |
| [<img src="aether-os/preview.png" width="240">](aether-os/preview.png) | [`aether-os`](aether-os/index.html) | Drone desktop operating system concept |
| [<img src="secure-video-call/preview.png" width="240">](secure-video-call/preview.png) | [`secure-video-call`](secure-video-call/index.html) | Generic secure video-call interface |
| [<img src="conference-grid/preview.png" width="240">](conference-grid/preview.png) | [`conference-grid`](conference-grid/index.html) | 3×2 video conference grid with active-speaker cycle |
| [<img src="voicemail-desktop/preview.png" width="240">](voicemail-desktop/preview.png) | [`voicemail-desktop`](voicemail-desktop/index.html) | Desktop with interactive voicemail window |
| [<img src="continental-ops-centre/preview.png" width="240">](continental-ops-centre/preview.png) | [`continental-ops-centre`](continental-ops-centre/index.html) | Continental operations dashboard centred on the flag's capital |
| [<img src="national-ops-centre/preview.png" width="240">](national-ops-centre/preview.png) | [`national-ops-centre`](national-ops-centre/index.html) | National operations dashboard with the country's regions |
| [<img src="capital-air-patrol/preview.png" width="240">](capital-air-patrol/preview.png) | [`capital-air-patrol`](capital-air-patrol/index.html) | Air-patrol dashboard over the capital's government district |
| [<img src="public-broadcast-channel/preview.png" width="240">](public-broadcast-channel/preview.png) | [`public-broadcast-channel`](public-broadcast-channel/index.html) | Bilingual public-information broadcast screen |
| [<img src="self-organizing-system/preview.png" width="240">](self-organizing-system/preview.png) | [`self-organizing-system`](self-organizing-system/index.html) | Code / blueprint two-mode system visualisation |
| [<img src="biometric-scan/preview.png" width="240">](biometric-scan/preview.png) | [`biometric-scan`](biometric-scan/index.html) | Body-scan visualisation with live readouts |
| [<img src="field-data-viewer/preview.png" width="240">](field-data-viewer/preview.png) | [`field-data-viewer`](field-data-viewer/index.html) | Field monitoring overview, chart and file viewer |
| [<img src="sdr-console/preview.png" width="240">](sdr-console/preview.png) | [`sdr-console`](sdr-console/index.html) | Software-defined radio station console |
| [<img src="secure-comms-portal/preview.png" width="240">](secure-comms-portal/preview.png) | [`secure-comms-portal`](secure-comms-portal/index.html) | Green-on-black secure communications portal |
| [<img src="global-ops-hub/preview.png" width="240">](global-ops-hub/preview.png) | [`global-ops-hub`](global-ops-hub/index.html) | Global operations hub with world map and feeds |
| [<img src="coastal-monitor/preview.png" width="240">](coastal-monitor/preview.png) | [`coastal-monitor`](coastal-monitor/index.html) | Retro coastal monitoring terminal with camera views |
| [<img src="cockpit-flight-display/preview.png" width="240">](cockpit-flight-display/preview.png) | [`cockpit-flight-display`](cockpit-flight-display/index.html) | Twin-screen spacecraft cockpit flight display |
| [<img src="craft-schematic-display/preview.png" width="240">](craft-schematic-display/preview.png) | [`craft-schematic-display`](craft-schematic-display/index.html) | Interactive spacecraft subsystem schematic |

## How to open

Clone or download the repo and open any folder's `index.html` in a browser. No build step.
Map views use public map data when online and fall back to generated maps offline.

### URL parameters & keys
Each of these mockups also shows a small hint in its bottom-right corner.
- `drone-console`, `aether-os`: `?speed=50` speeds up the simulated flight.
- `self-organizing-system`: press **M** to switch between code and blueprint mode; `?mode=a` (code) or `?mode=b` (blueprint) forces a mode.
- `craft-schematic-display`: **Space** or click a part to highlight a subsystem.
- `verdant-os`, `aether-os`: type commands in the terminal and press **Enter**.
- `secure-video-call`, `conference-grid`, `secure-comms-portal`, `global-ops-hub`: voice cover via the browser's built-in speech (Web Speech API). All four speak the selected language (🇩🇪 de-DE, 🇬🇧 en-GB with en-US only as a fallback voice, 🇪🇸 es-ES, 🇫🇷 fr-FR), using only that language's own system voices. Flow: a translated **Tap to hear** overlay → after the tap it turns into a pulsing **Connecting…** (further taps are ignored) → it disappears as soon as speech starts and speaker A is highlighted from the first word → at the end a red **Call ended** → a **Repeat?** dialog (Rejoin, or “Repeat the call?” on screens without their own end screen). Toggle with the bottom-left button or **V**; `?voice=off` disables it; the choice is remembered. Participants are shown as initial + surname (M. Venn, T. Ekker …) with gender-neutral roles in every language, so any voice fits.
- **Voice language policy:** whenever a voice feature is added or changed, add the matching voice samples for every supported gallery language (currently DE, EN, ES, FR). Rollout happens one backlog item at a time. Keys and variables stay English internally; only display/spoken strings are translated.
- **Every mockup**: red **Debug** button and a bright version stamp (e.g. `v1.13.5`) in the top-right corner; Debug sits bottom-left (next to Voice on call screens), so screenshots show the build. Debug asks for a short note (required) and downloads `debug-<mockup>-v<version>-<time>.json` with app version, URL and params, browser, screen size and the last 500 interaction events (clicks with target, keys, wheel, inputs, resize, visibility, focus, JS errors). On the four voice screens it also includes voice state, the speaker→line→voice plan, speaker changes and a `sync` block (speaker, voice, line, highlighted tile, match). Nothing personal beyond your note — send the file in the chat. In `conference-grid` the SPEAKING tile follows whichever caller is talking. Each caller has a named voice style (neutral / warm / energetic / calm, fixed rate and pitch); when a language has only one system voice, a voice of the other gender may be borrowed from another locale while the text stays in the selected language. Callers speak three rounds (intro and replies, more lines, goodbyes), then the call ends: SPEAKING clears and the Call ended screen shows (Rejoin restarts it).
- **Updates**: each page checks `version.txt` on load; if a newer build is online, a green **Reload** button appears under the version stamp.

### Map data attributions
- Basemap / imagery tiles © Esri; © OpenStreetMap contributors
- Radar overlay: RainViewer public API
- Borders: us-atlas and world-atlas TopoJSON (Natural Earth / US Census), rendered with d3-geo and Leaflet
- `vendor/` bundles Leaflet (BSD-2), d3 (ISC), topojson-client (ISC), world-atlas and us-atlas (ISC) so maps work offline; their licences are included there.

## License

MIT, see [LICENSE](LICENSE). All names, readings and messages are invented.

## Details

### farm-weather-console
Dark farm weather & dust-storm / crop monitoring console. Left sidebar (system status, striped dust-advisory hazard block, crop-health bars,
blight index, button row); centre **live Weather Radar map** (Leaflet) with a dark basemap,
region borders of the flag's country (12 UK regions, German Länder, Spanish communities, French régions from `vendor/data-regions-eu.js`), and a live radar overlay from the RainViewer public
API, tinted cyan/yellow-green and centred on the flag's country (UK for English); if the network is unavailable it
falls back to an offline map of that country's regions with simulated radar dust blobs.
Bottom row of five live line-chart panels; right column of readouts and a rolling event log.
Preview: `farm-weather-console/preview.png`

Data & attribution:
- Basemap tiles © Esri (dark canvas); © OpenStreetMap contributors
- Region borders: bundled `vendor/data-regions-eu.js` (see `vendor/LICENSE-regions`); us-atlas (TopoJSON, Natural Earth / US Census) is kept only as a fallback when no region file matches the flag
- Radar overlay © RainViewer (api.rainviewer.com public weather-maps API)

### drone-console
UAV ground-control console, in the selected language (DE/EN/ES/FR) with the region following the flag. Left **Mission Map** (Leaflet, Esri World Imagery
satellite tiles) tracking a simulated solar-powered HALE drone with an original SVG icon and
trail: phase 1 loiters in slow loops near the flag's capital (London for English); phase 2 climbs to
stratospheric altitude and flies a great-circle route east to India; phase 3 cruises at high
altitude over India. Solar/battery model drives the airframe and telemetry windows (array
output varying with sun position along the route, battery %, charge/discharge rate, endurance).
`?speed=50` URL param accelerates the sim for testing. Offline it falls back to generated
terrain with the same track. Also: rotating globe bottom-left, central login dialog cycling
Login Successful -> data transfer -> Unauthorized Access, right-hand personnel roster,
bottom-centre sensor/slider menu, Flight Details form, scanline overlay.
Preview: `drone-console/preview.png`

Data & attribution:
- Satellite tiles © Esri, Maxar, Earthstar Geographics (ArcGIS World Imagery)

All third-party map data is used via public CDNs/APIs and attributed in-app on each map.

## Desktop OS mockups

These wrap the map/console content above in invented, original desktop operating-system
shells (own names, hand-drawn SVG icons, draggable windows with title bars + minimise/close,
a bottom taskbar with an app dock, live clock and net/link status tray, desktop launcher
icons, and a working mock terminal).

### verdant-os — "VerdantOS"
Agricultural weather operations desktop. Apps: **Weather Radar** (main window = the live
Leaflet map: dark basemap + the flag's regional borders + RainViewer radar overlay, with the
procedural offline fallback of the flag's country), Field Sensors (live charts), Crop Health,
System Status (dust advisory), Event Log, and a Terminal (`help, status, radar, crops,
probes, ls`). Draggable windows, dock + desktop icons, tray clock/NET status.
Preview: `verdant-os/preview.png`

### aether-os — "AetherOS"
UAV ground-control desktop. Apps: **Mission Map** (the solar-HALE tracking sim — loiter over the flag's country
→ great-circle climb to India → stratospheric cruise, on Esri World Imagery, with
generated-terrain offline fallback; `?speed=50` to accelerate), **Secure Login** (the
Login Successful → transferring data → Unauthorized Access cycle; the window border also
flashes red and the tray link flips to BREACH), Airframe + Telemetry (solar array / battery /
charge rate / endurance driven by the shared sim), Personnel Roster, Sensor Menu, Flight
Details, and a Terminal (`status, drone, solar, route, roster`). Draggable windows, dock +
desktop icons, rotating globe, tray clock/LINK/NET status.
Preview: `aether-os/preview.png`

Shared sim state drives every aether-os window, so the map, airframe, telemetry and terminal
all stay in sync. All third-party map data is loaded via public CDNs/APIs and attributed in-app.

### secure-video-call
Secure two-party video-call interface on a black background, made fully generic: no real nation, government, agency, flag or official seal.
Top-centre flag-free "SECURE LINK" badge; two 16:9 video panels with thin white borders, each
with a centred abstract geometric emblem and a lower-left caption ("Remote Office A — Westmarrow",
"Executive Office B — Chief of Staff Aide"); the left panel shows a CSS/SVG-generated, dimmed
park/building scene. Bottom-centre control cluster (mic mute toggle, red hang-up, red REC with
blinking dot + live timer); bottom-left fullscreen (Fullscreen API) and lock toggle; bottom-right
camera toggle and blue share button. Hang-up shows a "Call ended" overlay with Rejoin.
All emblems are original abstract SVG; nothing resembles any real government insignia.
Preview: `secure-video-call/preview.png`

### conference-grid
Multi-party conference grid on a black background, fully generic (no real names, places,
governments, official seals or org logos). Top-centre shows a generic abstract building-outline
icon (resembling no real building) and a live HH:MM:SS call timer. A 3×2 grid of black tiles
with thin white borders, each carrying a distinct original abstract geometric emblem and a
lower-left caption with invented names and generic roles (Coordinator — M. Venn; Regional
Lead North — T. Ekker; Regional Lead East — I. Corral; Regional Lead South — D. Ashby;
Liaison Office — K. Brenner; Council Chair — Network Partners). An active-speaker highlight
(green border + "SPEAKING" badge) cycles between tiles. Reuses the secure-video-call control
styling: mic mute toggle, red hang-up ("Call ended" overlay), red REC with blinking dot + timer,
bottom-left fullscreen + lock, bottom-right camera + blue share — all interactive.
Preview: `conference-grid/preview.png`

### voicemail-desktop
Desktop voicemail scene, fully original and generic (no real agency, place or person). A simple
solid orange background (subtle gradient). Bottom-left floating **Voicemail** window
(draggable title bar with minimise/close): caller "Health Agency Director", fictional number
"+1 555-0100", time/duration (5:47 PM // 0:42), a big round blue play/pause button with a
progress ring over a faint waveform, and Call Back / Delete / More buttons. Interactive:
play/pause animates the ring over 42s, Delete dismisses the window with a toast, Call Back shows
a calling→connected state, More opens a small menu (Transcript / Save / Forward), and the window
is draggable. Black bottom taskbar with Channel / Comms / Priority dropdown menus (generic
items), a centred live day+time clock, and a right tray (volume / arrow / wifi icons).
Preview: `voicemail-desktop/preview.png`

### continental-ops-centre

(formerly `ops-centre-europe`; the old URL redirects.) A dark continental operations-centre dashboard,
fully generic, centred on the capital of the selected flag (London / Berlin / Madrid / Paris, from the Ada core).

- **Intercept Data Projection** — rotating orthographic globe centred on the flag's capital, generic
  unlabelled node markers across Europe and red link lines from the capital.
- **Satellite Worldwide Projection** — Natural Earth world map with the capital marker and link lines.
- **Recorded Communication / Command Status / Operation Status** — neutral exercise panels.

### national-ops-centre

(formerly `ops-centre-france`.) National operations desk: the selected flag's country with its regions
(vendor/data-regions-eu.js, see LICENSE-regions), the capital and two cities as red triangles and further
unlabelled city nodes (all from the Ada core), plus the world map.

### capital-air-patrol

(formerly `ops-centre-berlin`.) Routine air-patrol dashboard over the government district of the flag's
capital. The map is a local, freely licensed satellite image per country (EOxCloudless 2016,
Sentinel-2, CC BY 4.0, see vendor/imagery/LICENSE), shown with Leaflet, with a generated offline fallback.
The centre badge shows the flag and the district name: *BUNDESTAG* under DE, neutral names such as
*GOVERNMENT DISTRICT LONDON* elsewhere (no agency names). Two helicopter markers orbit at ~400 m.
Notes carry the flag's zone label (GMT/BST, MEZ/MESZ, CET/CEST, HNEC/HAEC via uim_zone).

### public-broadcast-channel

A public-information broadcast screen for an original, fully generic network.

- **Background** — dark charcoal with faint, slowly scrolling grey monospace
  filler text behind everything, plus a subtle scanline/flicker overlay.
- **Sidebar** — an invented channel name (*CONTINENTAL PUBLIC INFORMATION
  NETWORK*) in white serif caps, a live `HH:MM` clock with the flag's zone label (GMT/BST, MEZ/MESZ, CET/CEST, HNEC/HAEC), an underlined date,
  an original abstract emblem (no flag/stars/parliament outline), and a
  two-column bilingual English/French italic notice.
- **Header** — a bordered box with a line icon: *NEWS & INFORMATION |
  NOUVELLES ET INFORMATIONS*.
- **Panels** — three thin-bordered panels with line icons and bilingual
  titles: *ACTIVE WARNINGS | AVERTISSEMENTS ACTIFS*, *PUBLIC INFORMATION |
  INFORMATIONS PUBLIQUES*, and a tall *NEWS | NOUVELLES*. Each shows red,
  centred, slightly glitchy/flickering uppercase bilingual lines with neutral
  content (weather/heat/flood advisories, road works, rail timetable change,
  library hours, community events, local news).
- **Ticker** — a wide serif marquee scrolling right-to-left with neutral
  bilingual text.

All invented and neutral: no real organisations, channel logos, flags, seals or
people.

### self-organizing-system

An original two-mode "self-organizing system" animation (no branding anywhere).

- **Mode A — code reorganisation** — a black desktop of many overlapping
  terminal windows (thin pale-blue title bars with tiny File/Edit/View items,
  a blue left scrollbar, thin borders). Windows hold green monospace
  process/module tables, dense white hex log columns, small tables with yellow
  and blue highlighted rows, and mostly-empty consoles printing
  `Loading module... COMPLETE`. Windows spawn, move, resize, reorder and close
  themselves while text streams, as if a system is rewriting its own code. All
  data is procedurally generated (invented module names, hex addresses,
  percentages).
- **Mode B — design synthesis** — a dark blueprint workspace with a thin white
  frame. A large left panel draws an original white wireframe radial component
  (a ring of modules around a central pin-grid chip) stroke-by-stroke via SVG
  `stroke-dashoffset`, alongside a pin-grid chip/package outline, a long
  side-view assembly strip and a small data strip; a narrow middle column of
  tiny spec text; and a right panel exploded view with a glowing stacked disc,
  a ring top view and a stacked layer column (soft-glow filter). Components
  fade between drafts.

The two modes auto-cycle; press **M** (or see the on-screen hint) to toggle
manually. `?mode=a` / `?mode=b` force a single mode (used for the two preview
images). No real brands or logos.

### biometric-scan

An original biometric-scan display in the style of a sci-fi medical
readout.

- **Centre** — a simple, neutral mannequin-like human silhouette (union of
  basic SVG/canvas shapes, no anatomical detail) filled with an animated
  rainbow thermal heat-map (canvas value-noise through a blue→green→yellow→red
  palette that slowly shifts).
- **Left** — two tall vertical gauges with tick scales, green upper / red
  lower fill, a drifting marker, and labels/values (*CORE TEMP*, *HEART RATE*).
- **Right top** — glowing green header lines, a small table of generic
  biometric fields (resp rate, SpO₂, BP, glucose, hydration, skin temp, galv
  response) with values updating, and two glowing blue blocks.
- **Right bottom** — a live multi-series dotted line chart (pink/yellow/blue/
  white) scrolling continuously.
- **Overlays** — a subtle scanline flicker and soft glow.

All readings are generic and invented; no real brands, logos, or people.

### field-data-viewer

A generic environmental field-data portal on a plain black background.

- **Header** — text-only title (*Field Monitoring Service / Data Portal*) with a simple abstract emblem.
- **Data Overview** — green header bar with key/value details for the selected sample site.
- **Data Chart** — green-ruled table (SITE / TIME / NTU / Temp °C / Remarks) for sites SP-01…SP-04; the row above threshold is shown in red, followed by a placeholder `--` row. Click a row to update the overview and viewer.
- **File Viewer** — a procedurally drawn aerial sample image (fields, river, tree line) with a site marker.
- **Status bar** — home button, scale/projection readout, live clock and small green tool icons.

All data is invented; no real agencies, seals, or logos.

### sdr-console

A generic software-defined-radio status strip on a plain black background.

- **Map card** — white-bordered tall card with a glowing dot-and-line network over the flag's country outline (UK for English; world-atlas TopoJSON + d3-geo, with an offline generated fallback).
- **SDR Console v3.2 ENCRYPTED** — bright green panel with LCD-style rows: encryption level, secure frequency and three generic stations (A/B/C) whose statuses cycle; the transmitting one blinks.
- **Spectrum panel** — grey panel with an abstract antenna tile, an animated segmented spectrum display and a row of white tool icons.

All content is invented and neutral; no real agencies, logos, or names.

### secure-comms-portal

A generic encrypted-messaging portal on a black background with green text and thin green-bordered panels.

- **Header** — abstract geometric emblem, letter-spaced title and dotted-leader user/program/menu lines.
- **Team Call** — channel, frequency and a live date/time; **#Ops-Channel** lists highlighted participant role chips.
- **Live Audio Call** — padlock icon and animated dotted level bars; **Network Load Meter** with slowly fluctuating node loads.
- **System Dashboard** and **System Tray Alerts** — neutral uplink/storage/sync metrics and routine notifications.

All content is invented and neutral; no real agencies, seals, or names.

### global-ops-hub

A generic operations hub: a silver compass-rose emblem in a hexagon at the centre, linked by thin lines to six green-bordered panels (overview, secure call with animated waveform, task tracker, resource status, multi-region world map, info feed) and a bottom taskbar with a live clock. All content is neutral placeholder text. Map data: [world-atlas](https://github.com/topojson/world-atlas) (Natural Earth), rendered with d3-geo; offline fallback included.

### coastal-monitor

A generic coastal observation console with a retro look on a flat dark background. Top bar with a live date/time and a boxed gradient-outline "OCEANA" wordmark; mint-green labelled views of the flag's coast (UK: North Sea / Atlantic cliffs; DE: Baltic / North Sea dunes; FR: Atlantic / Mediterranean pines; ES: Mediterranean / Balearic palms; drawn locally on canvas, gently animated); monospace Tide & Wave Log, Buoy Telemetry Feed and a slowly appending Command & Data Log with routine entries. All content is invented and neutral.

### cockpit-flight-display

A generic two-screen flight display with glowing cyan line graphics on dark navy. The tall left screen has an airspeed arc gauge with a moving needle, an altitude slider, a thrust tick scale with a bar, and four attitude dials (pitch, roll, yaw, trim). The wider right screen has a row of animated bar meters, a trajectory/attitude plot with a moving craft silhouette, and data tables with cyan highlight rows. All values are invented.

### craft-schematic-display

A generic blueprint-style portrait display: a top-down wireframe schematic of an original small spacecraft design on a navy grid inside a bright cyan frame, with fuel cell and power bus panels below. Subsystems highlight in turn. Click a part or press Space to select one. All labels are generic.

## Languages (v1.13.5)

Pick a flag in the gallery (or add `?lang=de|es|fr|en` to any page). Every
screen then shows its texts, numbers (`1.234,5`), 24 h clock, units and map
place in that language: German → Germany/Berlin, Spanish → Spain/Madrid,
French → France/Paris; English → United Kingdom/London (since v1.12.1). All of it comes from a
small core written in plain Ada (`ada/`), compiled to WebAssembly and
embedded in `vendor/uim-core.js`, so it works from `file://` too.
See [docs/HOWTO.md](docs/HOWTO.md), [docs/HOW_WE_GOT_HERE.md](docs/HOW_WE_GOT_HERE.md)
and [docs/UNTRANSLATED.md](docs/UNTRANSLATED.md).
