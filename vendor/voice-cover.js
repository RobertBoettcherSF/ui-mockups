/* Voice cover for call mockups. Web Speech API, no audio files.
   Usage: <script src="../vendor/voice-cover.js" data-callers="4"></script>
   Toggle: button bottom-left or key V. ?voice=off disables. */
(function(){
  var s=document.currentScript, n=+(s&&s.dataset.callers||2);
  var synth=window.speechSynthesis;
  var muted=/[?&]voice=off/.test(location.search)||localStorage.getItem('vc-muted')==='1';
  var btn=document.createElement('button');
  btn.style.cssText='position:fixed;left:10px;bottom:10px;z-index:99999;font:11px monospace;padding:4px 8px;background:#000a;color:#ddd;border:1px solid #666;border-radius:4px;cursor:pointer';
  function label(){btn.textContent=!synth?'Voice: unsupported':(muted?'🔇 Voice off (V)':'🔊 Voice on (V)');}
  label(); (document.body||document.documentElement).appendChild(btn);
  if(!synth) return;
  var first="This is a mockup GUI. Feel free to use it. If you found it useful, consider giving this repo a star on GitHub.";
  var lines=["I concur.","Good idea.","That sounds like a plan.","If I could do it, I would."];
  var started=false, timer=null;
  function voices(){var v=synth.getVoices().filter(function(x){return /^en/i.test(x.lang)});return v.length?v:synth.getVoices();}
  function pick(i){var v=voices(); if(!v.length) return null;
    var fem=v.filter(function(x){return /female|woman|samantha|victoria|karen|zira|susan|serena|fiona|moira|tessa|aria|jenny|libby|sonia/i.test(x.name)});
    var mal=v.filter(function(x){return fem.indexOf(x)<0});
    var pool=(i%2? (fem.length?fem:v) : (mal.length?mal:v));
    return pool[Math.floor(i/2)%pool.length];}
  function say(t,i){var u=new SpeechSynthesisUtterance(t);var v=pick(i);if(v)u.voice=v;u.lang=v?v.lang:'en-US';
    u.pitch=[1,1.15,0.85,1.25,0.9,1.05][i%6];u.rate=[1,0.95,1.05,1,0.9,1.1][i%6];synth.speak(u);}
  function run(){if(muted||started)return;started=true;synth.cancel();say(first,0);
    for(var k=1;k<n;k++) say(lines[(k-1)%lines.length],k);}
  function toggle(){muted=!muted;localStorage.setItem('vc-muted',muted?'1':'0');
    if(muted){synth.cancel();started=false;}else{started=false;run();} label();}
  btn.onclick=function(e){e.stopPropagation();toggle();};
  addEventListener('keydown',function(e){if(e.key==='v'||e.key==='V')toggle();else run();});
  addEventListener('pointerdown',run);
  addEventListener('beforeunload',function(){synth.cancel();});
  setTimeout(run,600); /* may be blocked until first click/key by autoplay rules */
  if(synth.onvoiceschanged!==undefined) synth.onvoiceschanged=function(){};
})();
