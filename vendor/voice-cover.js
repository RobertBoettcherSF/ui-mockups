/* Voice cover for call mockups. Web Speech API, no audio files.
   Usage: <script src="../vendor/voice-cover.js" data-callers="4"></script>
   Toggle: button bottom-left or key V. ?voice=off disables.
   Requires debug-cover.js loaded first (events + state go into its Debug report).
   Pages can listen for 'vc:speaker' events (detail.index = caller, -1 = none). */
(function(){
  var s=document.currentScript, n=+(s&&s.dataset.callers||2);
  var synth=window.speechSynthesis;
  var muted=/[?&]voice=off/.test(location.search)||localStorage.getItem('vc-muted')==='1';
  var plan=[], speaking=-1, unlocked=false, cur=null, lit=null;
  var D=window.DebugCover||{log:function(){},state:function(){}};
  function ev(type,d){D.log('voice:'+type,d);}
  window.VoiceCover={log:ev,get speaking(){return speaking;}};
  function setSpk(i){var p=speaking;speaking=i;if(p!==i)ev('speaker',{from:p,to:i});dispatchEvent(new CustomEvent('vc:speaker',{detail:{index:i}}));}
  addEventListener('vc:highlight',function(e){lit={index:e.detail.index,label:e.detail.label};ev('highlight',{tile:e.detail.index,label:e.detail.label,speakerId:speaking,match:speaking<0||speaking===e.detail.index});});
  var btn=document.createElement('button');btn.setAttribute('data-dbg','1');btn.style.cssText='position:fixed;bottom:10px;left:10px;z-index:99999;font:11px monospace;padding:4px 8px;border-radius:4px;cursor:pointer;background:#000a;color:#ddd;border:1px solid #666';
  function label(){btn.textContent=!synth?'Voice: unsupported':(muted?'🔇 Voice off (V)':'🔊 Voice on (V)');}
  label(); (document.body||document.documentElement).appendChild(btn);
  ev('load',{callers:n,muted:muted,speechSynthesis:!!synth});
  D.state('voice',function(){return {
      voice:{lang:lang,muted:muted,speechSynthesis:!!synth,unlocked:unlocked,speaking:synth?synth.speaking:false,currentSpeaker:speaking,
        availableVoices:synth?synth.getVoices().map(function(v){return v.name+' ('+v.lang+')';}):[]},
      sync:{speakerId:speaking,currentSpeakingVoice:cur?cur.voice:null,currentLine:cur?cur.line:null,highlightedTile:lit?lit.index:null,highlightedLabel:lit?lit.label:null,match:speaking<0||!lit||lit.index===speaking},
      speakerPlan:plan};});
  if(!synth) return;
  // Keys stay English; only display/spoken strings are localised.
  var KEYS={first:'intro_star',lines:['reply_concur','reply_good_idea','reply_plan','reply_would_if_could']};
  var TAGS={en:'en-US',fr:'fr-FR'};
  var S={
    en:{intro_star:"This is a mockup GUI. Feel free to use it. If you found it useful, consider giving this repo a star on GitHub.",
      reply_concur:"I concur.",reply_good_idea:"Good idea.",reply_plan:"That sounds like a plan.",reply_would_if_could:"If I could do it, I would."},
    fr:{intro_star:"Ceci est une maquette d'interface graphique. N'hésitez pas à l'utiliser. Si vous l'avez trouvée utile, pensez à donner une étoile à ce dépôt sur GitHub.",
      reply_concur:"Je suis d'accord.",reply_good_idea:"Bonne idée.",reply_plan:"Ça me semble être un bon plan.",reply_would_if_could:"Si je pouvais le faire, je le ferais."}};
  function tr(k){return (S[lang]&&S[lang][k])||S.en[k];}
  var supported=(s&&s.dataset.langs||'en').split(','), lang='en';
  try{var ul=localStorage.getItem('uim-lang');var q=(location.search.match(/[?&]lang=(\w+)/)||[])[1];ul=q||ul;if(ul&&supported.indexOf(ul)>=0&&S[ul])lang=ul;}catch(e){}
  var first=tr(KEYS.first), lines=KEYS.lines.map(tr);
  ev('lang',{lang:lang,supported:supported});
  var started=false;
  function voices(){var v=synth.getVoices().filter(function(x){return x.lang.toLowerCase().indexOf(lang)===0});return v.length?v:synth.getVoices();}
  function pick(i){var v=voices(); if(!v.length) return null;
    var fem=v.filter(function(x){return /female|woman|samantha|victoria|karen|zira|susan|serena|fiona|moira|tessa|aria|jenny|libby|sonia|amelie|amélie|audrey|aurelie|denise|julie|marie|hortense|celine|eloise|vivienne/i.test(x.name)});
    var mal=v.filter(function(x){return fem.indexOf(x)<0});
    var pool=(i%2? (fem.length?fem:v) : (mal.length?mal:v));
    return pool[Math.floor(i/2)%pool.length];}
  function say(t,i){var u=new SpeechSynthesisUtterance(t);var v=pick(i);if(v)u.voice=v;u.lang=v?v.lang:TAGS[lang];
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
