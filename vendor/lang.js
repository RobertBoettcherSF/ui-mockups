/* Language layer for every page (v1.12.1).
   All texts, number formats, units and places come from the Ada core
   (ada/src, compiled to WebAssembly and embedded in vendor/uim-core.js).
   This file only moves text between the page and the core:
     - picks the language: ?lang=xx, else localStorage "uim-lang", else English
     - sets <html lang>
     - sends every visible text, title, placeholder, tooltip and canvas text
       through the core and shows what comes back
   API:  UIM.lang, UIM.t(text), UIM.num(text), UIM.qty(text, unit),
         UIM.place(), UIM.setLang(code), UIM.version, UIM.ok, UIM.error
   Load order in <head>: uim-core.js, lang.js, then the page's own scripts. */
(function () {
  var CODES = ['en', 'de', 'es', 'fr'];
  var UNITS = {acres: 0, F: 1, mi: 2, mph: 3, ft: 4};
  var t0 = performance.now();
  var core = null, error = null;
  try {
    var w = window.__UIM_WASM;
    if (!w) throw new Error('vendor/uim-core.js did not load');
    var bin = atob(w.b64), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    core = new WebAssembly.Instance(new WebAssembly.Module(bytes), {}).exports;
  } catch (e) { error = String(e && e.message || e); core = null; }
  var loadMs = Math.round((performance.now() - t0) * 10) / 10;

  var lang = 'en';
  try {
    var q = (location.search.match(/[?&]lang=(\w+)/) || [])[1];
    if (q && CODES.indexOf(q) >= 0) { lang = q; localStorage.setItem('uim-lang', q); }
    else { var s = localStorage.getItem('uim-lang'); if (CODES.indexOf(s) >= 0) lang = s; }
  } catch (e) {}

  var enc = new TextEncoder(), dec = new TextDecoder();
  function call(fn, text, extra) {
    var b = enc.encode(text);
    if (b.length > 65536) return text;
    new Uint8Array(core.memory.buffer).set(b, core.uim_in());
    var n = extra === undefined ? fn(CODES.indexOf(lang), b.length) : fn(CODES.indexOf(lang), b.length, extra);
    return dec.decode(new Uint8Array(core.memory.buffer, core.uim_out(), n));
  }
  function read(n) { return dec.decode(new Uint8Array(core.memory.buffer, core.uim_out(), n)); }

  var cache = new Map();
  function t(text) {
    text = String(text);
    if (!core || lang === 'en' || !/[A-Za-z0-9]/.test(text)) return text;
    var hit = cache.get(text);
    if (hit === undefined) {
      var lead = text.match(/^\s*/)[0], tail = text.slice(lead.length).match(/\s*$/)[0];
      hit = lead + call(core.uim_t, text.slice(lead.length, text.length - tail.length)) + tail;
      if (cache.size > 20000) cache.clear();
      cache.set(text, hit);
    }
    return hit;
  }
  var placeCache = {};
  function place() {
    if (!core) return null;
    if (!placeCache[lang]) placeCache[lang] = JSON.parse(read(core.uim_place(CODES.indexOf(lang))));
    return placeCache[lang];
  }

  var UIM = window.UIM = {
    lang: lang, ok: !!core, error: error, loadMs: loadMs,
    size: window.__UIM_WASM ? window.__UIM_WASM.size : 0,
    version: core ? read(core.uim_version()) : null,
    t: t,
    num: function (x) { return core ? call(core.uim_num, String(x)) : String(x); },
    qty: function (x, unit) { return core ? call(core.uim_qty, String(x), UNITS[unit] || 0) : String(x); },
    place: place,
    setLang: function (code) {
      if (CODES.indexOf(code) < 0) return;
      try { localStorage.setItem('uim-lang', code); } catch (e) {}
      lang = UIM.lang = code; cache.clear();
      document.documentElement.lang = code;
      walk(document.documentElement);
      if (orig.title !== undefined) document.title = t(orig.title);
      document.dispatchEvent(new CustomEvent('uim-lang', {detail: code}));
    }
  };
  document.documentElement.lang = lang;

  /* ---- page text ---- */
  var SKIP = {SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1};
  var ATTRS = ['placeholder', 'title', 'aria-label'];
  var shown = new WeakMap();      // node -> {en: original, out: what we wrote}
  var orig = {};
  function skip(el) {
    for (; el && el.nodeType === 1; el = el.parentNode) {
      if (SKIP[el.tagName] || el.hasAttribute('data-dbg') || el.hasAttribute('data-notr')) return true;
    }
    return false;
  }
  function textNode(n) {
    var s = shown.get(n), now = n.data;
    var en = s && now === s.out ? s.en : now;
    var out = t(en);
    if (out !== now) n.data = out;
    shown.set(n, {en: en, out: out});
  }
  function attr(el, a) {
    var key = 'uimEn_' + a.replace('-', '_'), now = el.getAttribute(a);
    if (now === null) return;
    var en = el.dataset[key + 'Out'] === now ? el.dataset[key] : now;
    var out = t(en);
    if (out === en && el.dataset[key] === undefined) return;
    el.dataset[key] = en; el.dataset[key + 'Out'] = out;
    if (out !== now) el.setAttribute(a, out);
  }
  function walk(root) {
    if (!core || (lang === 'en' && !walk.used)) return;
    walk.used = true;
    if (root.nodeType === 3) { if (!skip(root.parentNode)) textNode(root); return; }
    if (root.nodeType !== 1 || skip(root)) return;
    var it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (n) { return n.nodeType === 1 && (SKIP[n.tagName] || n.hasAttribute('data-dbg') || n.hasAttribute('data-notr')) ? 2 : 1; }
    });
    for (var n = root; n; n = it.nextNode()) {
      if (n.nodeType === 3) textNode(n);
      else for (var k = 0; k < ATTRS.length; k++) if (n.hasAttribute(ATTRS[k])) attr(n, ATTRS[k]);
    }
  }
  var busy = false;
  var mo = new MutationObserver(function (list) {
    if (busy) return; busy = true;
    try {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m.type === 'childList') for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
        else if (m.type === 'characterData') walk(m.target);
        else if (m.type === 'attributes' && !skip(m.target)) attr(m.target, m.attributeName);
      }
      if (document.title && orig.out !== document.title) { orig.title = document.title; orig.out = document.title = t(orig.title); }
    } finally { mo.takeRecords(); busy = false; }
  });
  if (core) {
    mo.observe(document.documentElement, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS});
    document.addEventListener('DOMContentLoaded', function () {
      orig.title = document.title; orig.out = document.title = t(orig.title);
      walk(document.documentElement);
    });
    /* canvas text */
    var C = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
    if (C) ['fillText', 'strokeText', 'measureText'].forEach(function (f) {
      var o = C[f];
      C[f] = function (text) { var a = Array.prototype.slice.call(arguments); a[0] = t(text); return o.apply(this, a); };
    });
  }

  /* ---- errors and the Debug report ---- */
  function report() {
    return {lang: lang, htmlLang: document.documentElement.lang, coreOk: !!core, coreVersion: UIM.version,
            coreBytes: UIM.size, coreSha: window.__UIM_WASM && window.__UIM_WASM.sha, coreLoadMs: loadMs,
            coreError: error, place: place()};
  }
  function hook() { if (window.DebugCover) { DebugCover.state('language', report); if (error) DebugCover.log('core-error', {error: error}); } }
  hook(); document.addEventListener('DOMContentLoaded', hook);
  if (error) document.addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('div');
    b.setAttribute('data-dbg', '');
    b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;background:#b00020;color:#fff;font:14px/1.4 sans-serif;padding:8px 12px';
    b.textContent = 'Language core failed to load (' + error + '). Showing English. Press Debug and send the file.';
    document.body.appendChild(b);
  });
})();
