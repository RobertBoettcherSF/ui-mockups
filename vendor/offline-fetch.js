// Serves bundled map data when the CDN is unreachable (or the page is opened via file://).
(function(){const f=window.fetch.bind(window);window.fetch=function(u,o){const d=window.__TOPO&&window.__TOPO[String(u)];
if(!d)return f(u,o);return f(u,o).catch(()=>new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}}));};})();
