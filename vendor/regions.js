/* Region outlines for the map screens, following the language flag.
   English: the US states of v1.11.0 (us-atlas). DE/ES/FR: the regions of
   the flag's country from vendor/data-regions-eu.js (offline, see
   LICENSE-regions). Which country belongs to which flag comes from the
   Ada core (UIM.place()).
   UIM.regions()            -> Promise of GeoJSON features (needs topojson-client)
   UIM.regionPaths(box, fc) -> [{n, d, lx, ly}] SVG paths fitted into box [x0,y0,x1,y1]
   UIM.project(box, fc, [lat,lon]) -> [x, y] in the same box */
(function () {
  var US = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
  UIM.regions = function () {
    var code = UIM.place() ? UIM.place().code : 'en';
    var topo = window.__REGIONS && window.__REGIONS[code];
    if (code === 'en' || !topo) {
      return fetch(US).then(function (r) { return r.json(); })
        .then(function (t) { return topojson.feature(t, t.objects.states); });
    }
    return Promise.resolve(topojson.feature(topo, topo.objects.regions));
  };
  function rings(f) {
    var g = f.geometry; if (!g) return [];
    return g.type === 'Polygon' ? g.coordinates : [].concat.apply([], g.coordinates);
  }
  function fit(box, fc) {
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    fc.features.forEach(function (f) { rings(f).forEach(function (r) { r.forEach(function (p) {
      x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }); }); });
    var k = Math.cos((y0 + y1) / 2 * Math.PI / 180);
    var s = Math.min((box[2] - box[0]) / ((x1 - x0) * k), (box[3] - box[1]) / (y1 - y0));
    var ox = (box[0] + box[2]) / 2 - (x0 + x1) / 2 * k * s, oy = (box[1] + box[3]) / 2 + (y0 + y1) / 2 * s;
    return function (lon, lat) { return [ox + lon * k * s, oy - lat * s]; };
  }
  UIM.project = function (box, fc, ll) { return fit(box, fc)(ll[1], ll[0]); };
  UIM.regionPaths = function (box, fc) {
    var pr = fit(box, fc);
    return fc.features.map(function (f) {
      var d = '', big = null, area = -1;
      rings(f).forEach(function (r) {
        var pts = r.map(function (p) { return pr(p[0], p[1]); });
        d += 'M' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('L') + 'Z';
        if (pts.length > area) { area = pts.length; big = pts; }
      });
      var cx = 0, cy = 0; big.forEach(function (p) { cx += p[0]; cy += p[1]; });
      return {n: String(f.properties.name || '').toUpperCase(), d: d, lx: cx / big.length, ly: cy / big.length};
    });
  };
})();
