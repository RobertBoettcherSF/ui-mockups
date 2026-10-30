/* Shared debug cover for every mockup.
   Adds an always-visible red Debug button + bright version stamp (top-right), Reload-if-newer check via root version.txt; Debug bottom-left (next to Voice),
   and logs interactions into a ring buffer (last 500 events).
   Debug: note required, then downloads debug-<mockup>-<time>.json.
   Other scripts: DebugCover.log(type,data), DebugCover.state(name,fn). */
(function(){
  if(window.DebugCover)return;
  var APPV='1.9.0', MAX=500, t0=performance.now();
  var mock=(location.pathname.split('/').filter(Boolean).slice(-2,-1)[0])||document.title||'root';
  var log=[], providers={};
  function ev(type,d){var e={t:new Date().toISOString(),ms:Math.round(performance.now()-t0),type:type};if(d)for(var k in d)e[k]=d[k];log.push(e);if(log.length>MAX)log.shift();}
  function desc(el){if(!el||!el.tagName)return null;var c=(typeof el.className==='string'?el.className:(el.getAttribute&&el.getAttribute('class'))||'');
    return {tag:el.tagName.toLowerCase(),id:el.id||undefined,cls:c?c.slice(0,60):undefined,text:(el.innerText||el.textContent||'').trim().replace(/\s+/g,' ').slice(0,40)||undefined};}
  window.DebugCover={version:APPV,log:ev,state:function(n,f){providers[n]=f;}};
  var SRC=(document.currentScript&&document.currentScript.src)||'';
  var ROOT=SRC?SRC.replace(/vendor\/debug-cover\.js.*$/,''):'/ui-mockups/';
  var base='position:fixed;z-index:100000;font:11px monospace;padding:4px 8px;border-radius:4px;';
  var badge=document.createElement('div');badge.textContent='v'+APPV;badge.setAttribute('data-dbg','1');badge.title='Build version';
  badge.style.cssText=base+'top:2px;right:8px;font:bold 14px monospace;background:#ffeb3b;color:#000;border:2px solid #000;box-shadow:0 0 8px #ffeb3b;pointer-events:none';
  var rl=document.createElement('button');rl.setAttribute('data-dbg','1');
  rl.style.cssText=base+'top:34px;right:8px;display:none;cursor:pointer;font:bold 13px monospace;background:#00e676;color:#000;border:2px solid #000';
  var dbg=document.createElement('button');dbg.textContent='Debug';dbg.setAttribute('data-dbg','1');
  dbg.style.cssText=base+'bottom:10px;left:10px;cursor:pointer;background:#b3261e;color:#fff;border:1px solid #e57373;font-weight:bold';
  function place(){var v=null;document.querySelectorAll('button[data-dbg]').forEach(function(b){if(b!==dbg&&b!==rl&&/voice/i.test(b.textContent))v=b;});
    if(v){var r=v.getBoundingClientRect();dbg.style.left=Math.round(r.right+8)+'px';}}
  function cmp(a,b){a=a.split('.').map(Number);b=b.split('.').map(Number);for(var i=0;i<3;i++){if((a[i]||0)!==(b[i]||0))return (a[i]||0)-(b[i]||0);}return 0;}
  function check(){try{fetch(ROOT+'version.txt?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.text():'';}).then(function(t){
    t=(t||'').trim().replace(/^v/,'');if(/^\d+\.\d+\.\d+$/.test(t)&&cmp(t,APPV)>0){rl.textContent='v'+t+' available \u2014 Reload';rl.style.display='block';ev('update-available',{remote:t});}
  }).catch(function(){});}catch(e){}}
  rl.onclick=function(e){e.stopPropagation();ev('update-reload');var u=new URL(location.href);u.searchParams.set('v',rl.textContent.split(' ')[0].slice(1));location.replace(u.toString());};
  function mount(){var r=document.body||document.documentElement;r.appendChild(dbg);r.appendChild(badge);r.appendChild(rl);
    setTimeout(place,0);setTimeout(place,600);setTimeout(place,2000);addEventListener('resize',place);check();setInterval(check,300000);}
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
