# UI Mockups

Standalone HTML/CSS (+ vanilla JS) mockups inspired by interface layouts seen in a film.
Each folder is self-contained; open its `index.html` in a browser. The map views attempt to
use real public map data when online, and fall back gracefully to generated/SVG maps offline.

## Gallery

| Preview | Mockup | Description |
|---|---|---|
| [<img src="farm-weather-console/preview.png" width="240">](farm-weather-console/preview.png) | [`farm-weather-console`](farm-weather-console/index.html) | Farm weather & crop monitoring console with live radar map |
| [<img src="drone-console/preview.png" width="240">](drone-console/preview.png) | [`drone-console`](drone-console/index.html) | Solar UAV ground-control console with satellite tracking map |
| [<img src="verdant-os/preview.png" width="240">](verdant-os/preview.png) | [`verdant-os`](verdant-os/index.html) | Farm desktop operating system concept |
| [<img src="aether-os/preview.png" width="240">](aether-os/preview.png) | [`aether-os`](aether-os/index.html) | Drone desktop operating system concept |
| [<img src="secure-video-call/preview.png" width="240">](secure-video-call/preview.png) | [`secure-video-call`](secure-video-call/index.html) | Generic secure video-call interface |
| [<img src="conference-grid/preview.png" width="240">](conference-grid/preview.png) | [`conference-grid`](conference-grid/index.html) | 3×2 video conference grid with active-speaker cycle |
| [<img src="voicemail-desktop/preview.png" width="240">](voicemail-desktop/preview.png) | [`voicemail-desktop`](voicemail-desktop/index.html) | Desktop with interactive voicemail window |
| [<img src="ops-centre-europe/preview.png" width="240">](ops-centre-europe/preview.png) | [`ops-centre-europe`](ops-centre-europe/index.html) | Operations-centre dashboard centred on Brussels |
| [<img src="ops-centre-france/preview.png" width="240">](ops-centre-france/preview.png) | [`ops-centre-france`](ops-centre-france/index.html) | Regional operations dashboard centred on Paris |
| [<img src="ops-centre-berlin/preview.png" width="240">](ops-centre-berlin/preview.png) | [`ops-centre-berlin`](ops-centre-berlin/index.html) | Air-patrol dashboard around the Bundestag, Berlin |
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
- `drone-console`, `aether-os`: `?speed=50` speeds up the simulated flight.
- `self-organizing-system`: press **M** to switch between code and blueprint mode; `?mode=` forces a mode.
- `craft-schematic-display`: **Space** or click a part to highlight a subsystem.
- `verdant-os`, `aether-os`: type commands in the terminal and press **Enter**.

### Map data attributions
- Basemap / imagery tiles © Esri; © OpenStreetMap contributors
- Radar overlay: RainViewer public API
- Borders: us-atlas and world-atlas TopoJSON (Natural Earth / US Census), rendered with d3-geo and Leaflet
- `vendor/` bundles Leaflet (BSD-2), d3 (ISC), topojson-client (ISC), world-atlas and us-atlas (ISC) so maps work offline; their licences are included there.

## License

MIT, see [LICENSE](LICENSE). All names, readings and messages are invented.

## Details

### farm-weather-console
Dark farm weather & dust-storm / crop monitoring console (inspired by a laptop screen glimpsed
in a film). Left sidebar (system status, striped dust-advisory hazard block, crop-health bars,
blight index, button row); centre **live Weather Radar map** (Leaflet) with a dark basemap,
US state borders from us-atlas TopoJSON, and a live radar overlay from the RainViewer public
API, tinted cyan/yellow-green and centred on the Great Plains; if the network is unavailable it
falls back to a procedural SVG map of the Great Plains states with simulated radar dust blobs.
Bottom row of five live line-chart panels; right column of readouts and a rolling event log.
Preview: `farm-weather-console/preview.png`

Data & attribution:
- Basemap tiles © Esri (dark canvas); © OpenStreetMap contributors
- US state borders: us-atlas (TopoJSON, Natural Earth / US Census) via jsDelivr
- Radar overlay © RainViewer (api.rainviewer.com public weather-maps API)

### drone-console
UAV ground-control console inspired by a surveillance-drone UI seen in a film; the original was
in Hindi and has been recreated in English. Left **Mission Map** (Leaflet, Esri World Imagery
satellite tiles) tracking a simulated solar-powered HALE drone with an original SVG icon and
trail: phase 1 loiters in slow loops over cornfields near Lincoln, Nebraska; phase 2 climbs to
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
icons, and a working mock terminal). No film logos, names, or assets are used.

### verdant-os — "VerdantOS"
Agricultural weather operations desktop. Apps: **Weather Radar** (main window = the live
Leaflet map: dark basemap + us-atlas state borders + RainViewer radar overlay, with the
procedural Great-Plains SVG offline fallback), Field Sensors (live charts), Crop Health,
System Status (dust advisory), Event Log, and a Terminal (`help, status, radar, crops,
probes, ls`). Draggable windows, dock + desktop icons, tray clock/NET status.
Preview: `verdant-os/preview.png`

### aether-os — "AetherOS"
UAV ground-control desktop. Apps: **Mission Map** (the solar-HALE tracking sim — Nebraska
loiter → great-circle climb to India → stratospheric cruise, on Esri World Imagery, with
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
with a centred abstract geometric emblem and a lower-left caption ("Remote Office A — Harbourton",
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
lower-left caption with invented names and generic roles (Coordinator — Mara Venn; Regional
Lead North — Tobias Ekker; Regional Lead East — Ines Corral; Regional Lead South — Dev Ashby;
Liaison Officer — Kai Brenner; Council Chair — Network Partners). An active-speaker highlight
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

### ops-centre-europe

A dark continental operations-centre dashboard inspired by a film control-room
layout, redrawn as an original, fully generic coordination desk centred on
Europe (Brussels).

- **Header** — abstract geometric emblem (no real seal/flag), spaced-letter
  title *CONTINENTAL OPERATIONS CENTRE / JOINT COORDINATION DESK*, dotted rule,
  and a *RESTRICTED // CENTRAL DESK* marker.
- **Intercept Data Projection** — a slowly rotating orthographic globe
  (d3-geo, world-atlas TopoJSON via CDN) centred on Brussels, with graticule,
  generic circular node markers across European cities plus a spread-out
  offshore cluster in the North Sea, and a red triangle at the centre.
- **Satellite Worldwide Projection** — a Natural Earth world map (d3-geo)
  rotated to a European central meridian, with English ocean labels and the
  red centre marker.
- **Recorded Communication** — two animated audio-waveform channels
  (Regional Desk / Central Desk) over a generic secure-relay source line.
- **Command Status / Operation Status** — bordered panels with a live
  "network link" strength bar and flickering status fields for a neutral
  logistics-coordination exercise (*NORTHERN BRIDGE*, status HOLD).

Everything is invented and neutral: no real organisations, governments,
agencies, nations, flags, official seals, or film references. Map data is
loaded from public CDNs (world-atlas / d3-geo) with a generated offline
fallback for both projections.

### ops-centre-france

A regional variant of `ops-centre-europe`, inspired by a film control-room
layout but redrawn as an original, fully generic coordination desk zoomed in
on France (Paris).

- **Header / status / audio panels** — same neutral layout as
  `ops-centre-europe` (abstract emblem, *REGIONAL OPERATIONS CENTRE / JOINT
  COORDINATION DESK*, recorded-communication waveforms, and Command/Operation
  status panels for the neutral exercise *WESTERN ANCHOR*).
- **Intercept Data Projection** — a zoomed-in regional map (~1300 km wide,
  d3-geo orthographic centred on Paris) with coastlines, borders and a fine
  graticule over a dark satellite-style ocean; a red triangle at the centre
  plus two more at other locations, and several generic circular node markers
  scattered within the surrounding territory (west of the Rhine).
- **Satellite Worldwide Projection** — the same Natural Earth world map with
  matching red triangles at the three locations.

All invented and neutral: no real organisations, governments, agencies,
nations, flags, official seals, people, or film references. Map data loads from
public CDNs (world-atlas / d3-geo) with a generated offline fallback for both
projections.

### ops-centre-berlin

A routine air-security patrol dashboard inspired by a film control-room
layout, redrawn as an original, fully generic coordination desk focused on the
Bundestag in Berlin.

- **Header / theme** — abstract emblem, *REGIONAL OPERATIONS CENTRE / JOINT
  COORDINATION DESK*, and a top-right *RESTRICTED // CENTRAL DESK* marker.
  Neutral routine-patrol wording throughout (no attack/outbreak/coup
  narrative).
- **Berlin Spatial Satellite Projection Map** — a Leaflet map on Esri World
  Imagery (attributed) centred on the Bundestag (52.5186N, 13.3762E) at zoom
  16, with a generated offline fallback. The centre marker is a round badge
  with a German flag and a *BUNDESTAG* label. Two original top-down helicopter
  SVG markers continuously circle the building on a ~250 m orbit at offset
  phases, rotating to their heading.
- **Event Log / Standing Notice** (left) — green highlighted headings and
  sub-headings, dotted dividers, `> ` log lines and bulleted notice items.
- **Related Active Files / Notes & Remarks** (right) — file codes with
  alternating green/navy highlighted tags and CET-timestamped routine notes.
- **Live Audio Call** — a locked, authorised-personnel box with animated bars
  below the map.
- **Ticker** — a bottom red marquee of generic link/telemetry status messages
  scrolling right-to-left with `///` separators.
- **System alert** — a periodic generic overlay (every ~25 s, ~8 s on screen,
  also triggered by clicking the header): a bordered black box titled
  *// SYSTEM ALERT //* with three dark-red highlighted lines and blinking
  keywords; the ticker shows a matching message while it is active.

All invented and neutral apart from the user-approved German flag and
*BUNDESTAG* label: no other real organisations, agencies, people, seals, or
film references. Map tiles load from Esri with attribution and a generated
offline fallback.

### public-broadcast-channel

A public-information broadcast screen inspired by a film's channel layout and
colour palette, redrawn as an original, fully generic network.

- **Background** — dark charcoal with faint, slowly scrolling grey monospace
  filler text behind everything, plus a subtle scanline/flicker overlay.
- **Sidebar** — an invented channel name (*CONTINENTAL PUBLIC INFORMATION
  NETWORK*) in white serif caps, a live `HH:MM LT` clock, an underlined date,
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

All invented and neutral: no real organisations, channel logos, flags, seals,
people, or film references.

### self-organizing-system

An original two-mode "self-organizing system" animation inspired by the mood of
some sci-fi interface shots (no film name or branding anywhere).

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
images). No real brands, logos, or film references.

### biometric-scan

An original biometric-scan display inspired by the mood of a sci-fi medical
readout (no film name anywhere).

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

All readings are generic and invented; no real brands, logos, people, or film
references.

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

- **Map card** — white-bordered tall card with a glowing dot-and-line network over a continental US outline (us-atlas TopoJSON + d3-geo, with an offline generated fallback).
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

## global-ops-hub

A generic operations hub: a silver compass-rose emblem in a hexagon at the centre, linked by thin lines to six green-bordered panels (overview, secure call with animated waveform, task tracker, resource status, multi-region world map, info feed) and a bottom taskbar with a live clock. All content is neutral placeholder text. Map data: [world-atlas](https://github.com/topojson/world-atlas) (Natural Earth), rendered with d3-geo; offline fallback included.

## coastal-monitor

A generic coastal observation console with a retro look on a flat dark background. Top bar with a live date/time and a boxed gradient-outline "OCEANA" wordmark; mint-green labelled views of a calm ocean sunset and a palm beach (drawn locally on canvas, gently animated); monospace Tide & Wave Log, Buoy Telemetry Feed and a slowly appending Command & Data Log with routine entries. All content is invented and neutral.

## cockpit-flight-display

A generic two-screen flight display with glowing cyan line graphics on dark navy. The tall left screen has an airspeed arc gauge with a moving needle, an altitude slider, a thrust tick scale with a bar, and four attitude dials (pitch, roll, yaw, trim). The wider right screen has a row of animated bar meters, a trajectory/attitude plot with a moving craft silhouette, and data tables with cyan highlight rows. All values are invented.

## craft-schematic-display

A generic blueprint-style portrait display: a top-down wireframe schematic of an original small spacecraft design on a navy grid inside a bright cyan frame, with fuel cell and power bus panels below. Subsystems highlight in turn. Click a part or press Space to select one. All labels are generic.
