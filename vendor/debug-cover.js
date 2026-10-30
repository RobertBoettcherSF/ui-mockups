/* Shared debug cover for every mockup.
   Adds an always-visible red Debug button + version badge (bottom-right),
   and logs interactions into a ring buffer (last 500 events).
   Debug: note required, then downloads debug-<mockup>-<time>.json.
   Other scripts: DebugCover.log(type,data), DebugCover.state(name,fn). */
(function(){
  if(window.DebugCover)return;
  var APPV='1.2.0', MAX=500, t0=performance.now();
  var mock=(location.pathname.split('/').filter(Boolean).slice(-2,-1)[0])||document.title||'root';
  var log=[], providers={};
  function ev(type,d){var e={t:new Date().toISOString(),ms:Math.round(performance.now()-t0),type:type};if(d)for(var k in d)e[k]=d[k];log.push(e);if(log.length>MAX)log.shift();}
  function desc(el){if(!el||!el.tagName)return null;var c=(typeof el.className==='string'?el.className:(el.getAttribute&&el.getAttribute('class'))||'');
    return {tag:el.tagName.toLowerCase(),id:el.id||undefined,cls:c?c.slice(0,60):undefined,text:(el.innerText||el.textContent||'').trim().replace(/\s+/g,' ').slice(0,40)||undefined};}
  window.DebugCover={version:APPV,log:ev,state:function(n,f){providers[n]=f;}};
  var css='position:fixed;bottom:10px;z-index:100000;font:11px monospace;padding:4px 8px;border-radius:4px;';
  var badge=document.createElement('div');badge.textContent='v'+APPV;badge.setAttribute('data-dbg','1');
  badge.style.cssText=css+'right:10px;background:#000b;color:#ccc;border:1px solid #555;pointer-events:none';
  var dbg=document.createElement('button');dbg.textContent='Debug';dbg.setAttribute('data-dbg','1');
  dbg.style.cssText=css+'right:80px;cursor:pointer;background:#b3261e;color:#fff;border:1px solid #e57373;font-weight:bold';
  function mount(){var r=document.body||document.documentElement;r.appendChild(dbg);r.appendChild(badge);
    setTimeout(function(){dbg.style.right=(badge.offsetWidth+18)+'px';},0);}
  if(document.body)mount();else addEventListener('DOMContentLoaded',mount);
  var q={};new URLSearchParams(location.search).forEach(function(v,k){q[k]=v;});
  ev('load',{mockup:mock,appVersion:APPV,params:q,hash:location.hash||undefined,referrer:document.referrer?'yes':'no'});
  ['pointerdown','click','dblclick','contextmenu'].forEach(function(n){addEventListener(n,function(e){if(e.target&&e.target.closest&&e.target.closest('[data-dbg]')&&n!=='click')return;
    ev(n,{x:Math.round(e.clientX),y:Math.round(e.clientY),btn:e.button,target:desc(e.target)});},true);});
  addEventListener('keydown',function(e){ev('keydown',{key:e.key.length===1?e.key:e.key,code:e.code,mods:(e.ctrlKey?'c':'')+(e.shiftKey?'s':'')+(e.altKey?'a':'')+(e.metaKey?'m':''),repeat:e.repeat||undefined});},true);
  var wt=0;addEventListener('wheel',function(e){var n=Date.now();if(n-wt<300)return;wt=n;ev('wheel',{dy:Math.round(e.deltaY),target:desc(e.target)});},{capture:true,passive:true});
  ['input','change'].forEach(function(n){addEventListener(n,function(e){var t=e.target;ev(n,{target:desc(t),value:t&&t.type==='range'||t&&t.type==='checkbox'?(t.type==='checkbox'?t.checked:t.value):undefined});},true);});
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){ev('resize',{w:innerWidth,h:innerHeight});},250);});
  document.addEventListener('visibilitychange',function(){ev('visibility',{state:document.visibilityState});});
  addEventListener('focus',function(){ev('focus');});addEventListener('blur',function(){ev('blur');});
  addEventListener('hashchange',function(){ev('hashchange',{hash:location.hash});});
  addEventListener('error',function(e){ev('js-error',{msg:String(e.message).slice(0,200),src:(e.filename||'').split('/').pop(),line:e.lineno});});
  addEventListener('unhandledrejection',function(e){ev('promise-rejection',{msg:String(e.reason).slice(0,200)});});
  dbg.onclick=function(e){e.stopPropagation();
    var note=prompt('Debug report v'+APPV+' — what happened? (required)');
    if(note===null){ev('debug-cancel');return;} note=note.trim(); if(!note){alert('Please describe the issue.');return;}
    var rep={appVersion:APPV,mockup:mock,url:location.href,params:q,createdAt:new Date().toISOString(),uptimeMs:Math.round(performance.now()-t0),note:note,
      userAgent:navigator.userAgent,language:navigator.language,
      screen:{w:screen.width,h:screen.height,viewportW:innerWidth,viewportH:innerHeight,dpr:devicePixelRatio},state:{},eventLog:log};
    for(var k in providers){try{var s=providers[k]();for(var j in s)rep[j]=s[j];}catch(x){rep.state[k+'Error']=String(x);}}
    var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(rep)],{type:'application/json'}));
    a.download='debug-'+mock+'-v'+APPV+'-'+Date.now()+'.json';document.body.appendChild(a);a.click();a.remove();ev('debug-export');};
})();
