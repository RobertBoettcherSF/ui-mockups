/* Voice cover for call mockups. Web Speech API, no audio files.
   Usage: <script src="../vendor/voice-cover.js" data-callers="4"></script>
   Toggle: button bottom-left or key V. ?voice=off disables.
   Debug: red button next to it downloads a JSON report (note required).
   Pages can listen for 'vc:speaker' events (detail.index = caller, -1 = none). */
(function(){
  var APPV='1.1.1';
  var s=document.currentScript, n=+(s&&s.dataset.callers||2);
  var mock=(location.pathname.split('/').filter(Boolean).slice(-2,-1)[0])||document.title;
  var synth=window.speechSynthesis;
  var muted=/[?&]voice=off/.test(location.search)||localStorage.getItem('vc-muted')==='1';
  var log=[], plan=[], speaking=-1, unlocked=false, cur=null, lit=null;
  function ev(type,d){var e={t:new Date().toISOString(),type:type};for(var k in d)e[k]=d[k];log.push(e);if(log.length>200)log.shift();}
  window.VoiceCover={log:ev,get speaking(){return speaking;}};
  function setSpk(i){speaking=i;dispatchEvent(new CustomEvent('vc:speaker',{detail:{index:i}}));}
  addEventListener('vc:highlight',function(e){lit={index:e.detail.index,label:e.detail.label};ev('highlight',{tile:e.detail.index,label:e.detail.label,speakerId:speaking,match:speaking<0||speaking===e.detail.index});});
  var css='position:fixed;bottom:10px;z-index:99999;font:11px monospace;padding:4px 8px;border-radius:4px;cursor:pointer;';
  var btn=document.createElement('button');btn.style.cssText=css+'left:10px;background:#000a;color:#ddd;border:1px solid #666';
  var dbg=document.createElement('button');dbg.textContent='Debug';dbg.style.cssText=css+'left:150px;background:#b3261e;color:#fff;border:1px solid #e57373;font-weight:bold';
  function label(){btn.textContent=!synth?'Voice: unsupported':(muted?'🔇 Voice off (V)':'🔊 Voice on (V)');}
  label(); var root=document.body||document.documentElement; root.appendChild(btn); root.appendChild(dbg);
  setTimeout(function(){dbg.style.left=(btn.offsetLeft+btn.offsetWidth+8)+'px';},0);
  ev('load',{mockup:mock,callers:n,muted:muted,speechSynthesis:!!synth});
  dbg.onclick=function(e){e.stopPropagation();
    var note=prompt('Debug report — what went wrong? (required)');
    if(note===null)return; note=note.trim(); if(!note){alert('Please describe the issue.');return;}
    var rep={appVersion:APPV,mockup:mock,url:location.href,createdAt:new Date().toISOString(),note:note,
      userAgent:navigator.userAgent,language:navigator.language,
      screen:{w:screen.width,h:screen.height,viewportW:innerWidth,viewportH:innerHeight,dpr:devicePixelRatio},
      voice:{muted:muted,speechSynthesis:!!synth,unlocked:unlocked,speaking:synth?synth.speaking:false,currentSpeaker:speaking,
        availableVoices:synth?synth.getVoices().map(function(v){return v.name+' ('+v.lang+')';}):[]},
      sync:{speakerId:speaking,currentSpeakingVoice:cur?cur.voice:null,currentLine:cur?cur.line:null,highlightedTile:lit?lit.index:null,highlightedLabel:lit?lit.label:null,match:speaking<0||!lit||lit.index===speaking},
      speakerPlan:plan, eventLog:log};
    var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(rep,null,2)],{type:'application/json'}));
    a.download='debug-'+mock+'-'+Date.now()+'.json';document.body.appendChild(a);a.click();a.remove();ev('debug-export',{});};
  if(!synth) return;
  var first="This is a mockup GUI. Feel free to use it. If you found it useful, consider giving this repo a star on GitHub.";
  var lines=["I concur.","Good idea.","That sounds like a plan.","If I could do it, I would."];
  var started=false;
  function voices(){var v=synth.getVoices().filter(function(x){return /^en/i.test(x.lang)});return v.length?v:synth.getVoices();}
  function pick(i){var v=voices(); if(!v.length) return null;
    var fem=v.filter(function(x){return /female|woman|samantha|victoria|karen|zira|susan|serena|fiona|moira|tessa|aria|jenny|libby|sonia/i.test(x.name)});
    var mal=v.filter(function(x){return fem.indexOf(x)<0});
    var pool=(i%2? (fem.length?fem:v) : (mal.length?mal:v));
    return pool[Math.floor(i/2)%pool.length];}
  function say(t,i){var u=new SpeechSynthesisUtterance(t);var v=pick(i);if(v)u.voice=v;u.lang=v?v.lang:'en-US';
    u.pitch=[1,1.15,0.85,1.25,0.9,1.05][i%6];u.rate=[1,0.95,1.05,1,0.9,1.1][i%6];
    var vn=v?v.name:'(default)'; plan.push({speaker:i,line:t,voice:vn,pitch:u.pitch,rate:u.rate});
    u.onstart=function(){unlocked=true;cur={voice:vn,line:t};setSpk(i);ev('speak-start',{speakerId:i,voice:vn,line:t,highlightedTile:lit?lit.index:null,highlightedLabel:lit?lit.label:null});};
    u.onend=function(){if(speaking===i){cur=null;setSpk(-1);}ev('speak-end',{speakerId:i,highlightedTile:lit?lit.index:null});};
    u.onerror=function(e){if(speaking===i){cur=null;setSpk(-1);}ev('speak-error',{speakerId:i,error:e.error});};
    synth.speak(u);}
  function run(trigger){if(muted||started)return;started=true;synth.cancel();plan=[];ev('run',{trigger:trigger});say(first,0);
    for(var k=1;k<n;k++) say(lines[(k-1)%lines.length],k);}
  function toggle(){muted=!muted;localStorage.setItem('vc-muted',muted?'1':'0');ev('mute',{muted:muted});
    synth.cancel();started=false;setSpk(-1);if(!muted)run('unmute'); label();}
  btn.onclick=function(e){e.stopPropagation();toggle();};
  addEventListener('keydown',function(e){if(e.key==='v'||e.key==='V')toggle();else run('key');});
  addEventListener('pointerdown',function(){if(!unlocked)ev('unlock-attempt',{});run('pointer');});
  addEventListener('beforeunload',function(){synth.cancel();});
  setTimeout(function(){run('auto');},600);
  synth.onvoiceschanged=function(){ev('voices-changed',{count:synth.getVoices().length});};
})();
