/* Top bar for every mockup page.
   A thin dark bar fixed to the top of the screen with:
     - a "Gallery" link back to the start page
     - a dropdown to jump straight to any other mockup
   Keys and folder names stay English. Only the labels shown on screen
   are translated, using the language chosen on the gallery page.
   Jumps are written to the Debug log (DebugCover.log). */

(function () {

  // All mockups, by folder name (English, used internally).
  var MOCKUPS = [
    "aether-os", "biometric-scan", "capital-air-patrol", "coastal-monitor",
    "cockpit-flight-display", "conference-grid", "continental-ops-centre",
    "craft-schematic-display", "drone-console",
    "farm-weather-console", "field-data-viewer", "global-ops-hub",
    "national-ops-centre", "public-broadcast-channel", "sdr-console", "secure-comms-portal",
    "secure-video-call", "self-organizing-system", "verdant-os",
    "voicemail-desktop"
  ];

  // Labels are English here; the Ada core (vendor/lang.js) translates them.
  function label(english) {
    return window.UIM ? window.UIM.t(english) : english;
  }

  var BAR_HEIGHT = 28;

  // Current app version comes from debug-cover.js.
  function appVersion() {
    if (window.DebugCover && window.DebugCover.version) {
      return window.DebugCover.version;
    }
    return "";
  }

  // Folder name of this page, e.g. "conference-grid".
  function currentMockup() {
    var parts = location.pathname.split("/");
    var folders = [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] !== "" && parts[i] !== "index.html") {
        folders.push(parts[i]);
      }
    }
    return folders[folders.length - 1] || "";
  }

  // "capital-air-patrol" -> "Capital Air Patrol"
  function prettyName(folder) {
    var words = folder.split("-");
    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(" ").replace(/\bOs\b/g, "OS").replace(/\bSdr\b/g, "SDR");
  }

  // Phones: shorter names so the dropdown never truncates.
  var PHONE = window.matchMedia && window.matchMedia("(max-width:600px)").matches;
  var DROP = ["Centre", "Console", "Display", "System", "Channel", "Desktop", "Portal", "Viewer", "Hub", "Grid", "Call", "Scan"];
  function shortName(folder) {
    var full = prettyName(folder).split(" ");
    var kept = full.filter(function (w) { return DROP.indexOf(w) < 0; });
    return (kept.length ? kept : full).join(" ");
  }

  function logEvent(type, data) {
    if (window.DebugCover) {
      window.DebugCover.log(type, data);
    }
  }

  (function(){var st=document.createElement("style");st.textContent="@media(max-width:600px){html,body{max-width:100vw}html,body{overflow-x:clip!important}body>*{max-width:100vw}}";(document.head||document.documentElement).appendChild(st);})();

  function buildBar() {
    var version = appVersion();
    var here = currentMockup();

    var bar = document.createElement("div");
    bar.setAttribute("data-dbg", "1");
    bar.id = "uim-topbar";
    bar.style.cssText =
      "position:fixed;top:0;left:0;right:0;height:" + BAR_HEIGHT + "px;" +
      "z-index:99999;display:flex;align-items:center;gap:10px;" +
      (PHONE ? "padding:0 88px 0 8px;gap:6px;" : "padding:0 120px 0 10px;") + "background:rgba(10,12,16,0.92);" +
      "border-bottom:1px solid #333;font:12px monospace;color:#ccc";

    // Gallery link
    var link = document.createElement("a");
    link.textContent = PHONE ? "\u2190" : "\u2190 " + label("Gallery");
    link.title = label("Gallery"); link.setAttribute("aria-label", label("Gallery"));
    if (PHONE) link.style.cssText = "color:#8ecbff;text-decoration:none;font-size:18px;padding:4px 6px";
    link.href = "../?v=" + version;
    link.style.cssText = "color:#8ecbff;text-decoration:none";
    link.onclick = function () {
      logEvent("nav-gallery", { from: here });
    };
    bar.appendChild(link);

    // Dropdown of all mockups
    var select = document.createElement("select");
    select.title = label("Jump to mockup");
    select.style.cssText =
      "background:#1a1d24;color:#ddd;border:1px solid #444;" +
      (PHONE ? "font:11px monospace;padding:1px 2px;min-width:0;flex:0 1 auto" : "font:12px monospace;padding:1px 4px;min-width:0;flex:0 1 auto;max-width:48vw");
    for (var i = 0; i < MOCKUPS.length; i++) {
      var option = document.createElement("option");
      option.value = MOCKUPS[i];
      option.textContent = PHONE ? shortName(MOCKUPS[i]) : prettyName(MOCKUPS[i]);
      if (MOCKUPS[i] === here) {
        option.selected = true;
      }
      select.appendChild(option);
    }
    select.onchange = function () {
      logEvent("nav-jump", { from: here, to: select.value });
      location.href = "../" + select.value + "/?v=" + version;
    };
    bar.appendChild(select);

    document.body.appendChild(bar);
  }

  if (document.body) {
    buildBar();
  } else {
    document.addEventListener("DOMContentLoaded", buildBar);
  }

})();
