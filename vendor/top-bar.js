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
    "aether-os", "biometric-scan", "coastal-monitor", "cockpit-flight-display",
    "conference-grid", "craft-schematic-display", "drone-console",
    "farm-weather-console", "field-data-viewer", "global-ops-hub",
    "ops-centre-berlin", "ops-centre-europe", "ops-centre-france",
    "public-broadcast-channel", "sdr-console", "secure-comms-portal",
    "secure-video-call", "self-organizing-system", "verdant-os",
    "voicemail-desktop"
  ];

  // Display labels per language. English is the key set.
  var LABELS = {
    en: { gallery: "Gallery", jump: "Jump to mockup" },
    de: { gallery: "Galerie", jump: "Zu Mockup springen" },
    es: { gallery: "Galería", jump: "Ir a la maqueta" },
    fr: { gallery: "Galerie", jump: "Aller à la maquette" }
  };

  var BAR_HEIGHT = 28;

  // Current app version comes from debug-cover.js.
  function appVersion() {
    if (window.DebugCover && window.DebugCover.version) {
      return window.DebugCover.version;
    }
    return "";
  }

  // Language saved by the gallery page; English if none.
  function currentLanguage() {
    var lang = "en";
    try {
      lang = localStorage.getItem("uim-lang") || "en";
    } catch (e) {}
    if (!LABELS[lang]) {
      lang = "en";
    }
    return lang;
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

  // "ops-centre-berlin" -> "Ops Centre Berlin"
  function prettyName(folder) {
    var words = folder.split("-");
    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(" ");
  }

  function logEvent(type, data) {
    if (window.DebugCover) {
      window.DebugCover.log(type, data);
    }
  }

  function buildBar() {
    var labels = LABELS[currentLanguage()];
    var version = appVersion();
    var here = currentMockup();

    var bar = document.createElement("div");
    bar.setAttribute("data-dbg", "1");
    bar.style.cssText =
      "position:fixed;top:0;left:0;right:0;height:" + BAR_HEIGHT + "px;" +
      "z-index:99999;display:flex;align-items:center;gap:10px;" +
      "padding:0 120px 0 10px;background:rgba(10,12,16,0.92);" +
      "border-bottom:1px solid #333;font:12px monospace;color:#ccc";

    // Gallery link
    var link = document.createElement("a");
    link.textContent = "\u2190 " + labels.gallery;
    link.href = "../?v=" + version;
    link.style.cssText = "color:#8ecbff;text-decoration:none";
    link.onclick = function () {
      logEvent("nav-gallery", { from: here });
    };
    bar.appendChild(link);

    // Dropdown of all mockups
    var select = document.createElement("select");
    select.title = labels.jump;
    select.style.cssText =
      "background:#1a1d24;color:#ddd;border:1px solid #444;" +
      "font:12px monospace;padding:1px 4px";
    for (var i = 0; i < MOCKUPS.length; i++) {
      var option = document.createElement("option");
      option.value = MOCKUPS[i];
      option.textContent = prettyName(MOCKUPS[i]);
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
