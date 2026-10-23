# UI Mockups

Standalone HTML/CSS (+ vanilla JS) mockups inspired by interface layouts seen in a film.
Each folder is self-contained; open its `index.html` in a browser. The map views attempt to
use real public map data when online, and fall back gracefully to generated/SVG maps offline.

## Mockups

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
