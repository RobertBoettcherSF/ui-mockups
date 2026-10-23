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
