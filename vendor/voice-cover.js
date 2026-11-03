/* Voice cover for call mockups. Web Speech API, no audio files.
   Usage: <script src="../vendor/voice-cover.js" data-callers="4"></script>
   Toggle: button bottom-left or key V. ?voice=off disables.
   Requires debug-cover.js loaded first (events + state go into its Debug report).
   Pages can listen for 'vc:speaker' events (detail.index = caller, -1 = none)
   and 'vc:ended' (all lines spoken; the call is over). */
(function(){
  var s=document.currentScript, n=+(s&&s.dataset.callers||2);
  var synth=window.speechSynthesis;
  var muted=/[?&]voice=off/.test(location.search)||localStorage.getItem('vc-muted')==='1';
  var plan=[], order=[], speaking=-1, unlocked=false, cur=null, lit=null;
  var D=window.DebugCover||{log:function(){},state:function(){}};
  function ev(type,d){D.log('voice:'+type,d);}
  window.VoiceCover={log:ev,get speaking(){return speaking;}};
  function setSpk(i){var p=speaking;speaking=i;if(p!==i)ev('speaker',{from:p,to:i});dispatchEvent(new CustomEvent('vc:speaker',{detail:{index:i}}));}
  addEventListener('vc:highlight',function(e){lit={index:e.detail.index,label:e.detail.label};ev('highlight',{tile:e.detail.index,label:e.detail.label,speakerId:speaking,match:speaking<0||speaking===e.detail.index});});
  var btn=document.createElement('button');btn.setAttribute('data-dbg','1');btn.style.cssText='position:fixed;bottom:10px;left:10px;z-index:99999;font:11px monospace;padding:4px 8px;border-radius:4px;cursor:pointer;background:#000a;color:#ddd;border:1px solid #666';
  var narrow=false;btn.id='vc-btn';(function(){var st=document.createElement('style');st.textContent='#vc-btn::after{content:"";position:absolute;left:0;right:0;top:-9px;bottom:-9px}';(document.head||document.documentElement).appendChild(st);})();
  function place(){var bar=document.getElementById('uim-topbar');narrow=innerWidth<600&&!!bar;
    if(narrow){if(btn.parentNode!==bar)bar.appendChild(btn);btn.style.position='static';btn.style.top=btn.style.left=btn.style.bottom='';btn.style.marginLeft='auto';btn.style.padding='0 8px';btn.style.flex='0 0 auto';btn.style.minWidth='44px';btn.style.height='26px';btn.style.font='bold 12px sans-serif';btn.style.color='#fff';btn.style.background='#1d3b5c';btn.style.border='1px solid #8ecbff';btn.style.borderRadius='6px';btn.style.position='relative';}
    else{if(btn.parentNode!==document.body&&document.body)document.body.appendChild(btn);btn.style.position='fixed';btn.style.top='';btn.style.bottom='10px';btn.style.left='10px';btn.style.marginLeft='';btn.style.padding='4px 8px';}
    label();}
  window.addEventListener('resize',place);window.addEventListener('load',place);setTimeout(place,300);
  function label(){var k=!synth?'Voice: unsupported':(muted?'🔇 Voice off (V)':'🔊 Voice on (V)');var tx=(window.UIM&&UIM.t)?UIM.t(k):k;btn.title=tx;btn.setAttribute('aria-label',tx);btn.textContent=(typeof narrow!=='undefined'&&narrow)?(muted?'🔇 ':'🔊 ')+((window.UIM&&UIM.t)?UIM.t('Voice'):'Voice'):tx;}
  document.addEventListener('uim-lang',function(){label();});
  label(); place(); (document.body||document.documentElement).appendChild(btn);
  ev('load',{callers:n,muted:muted,speechSynthesis:!!synth});
  D.state('voice',function(){return {
      voice:{lang:lang,muted:muted,speechSynthesis:!!synth,unlocked:unlocked,speaking:synth?synth.speaking:false,currentSpeaker:speaking,
        availableVoices:synth?synth.getVoices().map(function(v){return v.name+' ('+v.lang+')';}):[]},
      sync:{speakerId:speaking,currentSpeakingVoice:cur?cur.voice:null,currentLine:cur?cur.line:null,highlightedTile:lit?lit.index:null,highlightedLabel:lit?lit.label:null,match:speaking<0||!lit||lit.index===speaking},
      speakerPlan:plan};});
  if(!synth) return;
  // Keys stay English; only display/spoken strings are localised.
  // The call runs in rounds. Round 1: caller 0 says the intro, others reply.
  // Round 2: more replies. Round 3: everyone says goodbye. Then the call ends.
  var KEYS={
    first:'intro_star',
    replies:['reply_concur','reply_good_idea','reply_plan','reply_would_if_could','reply_agree_all','reply_next_step'],
    more:['more_open_source','more_try_it','more_feedback','more_languages','more_star_too','more_works_for_me'],
    bye:['bye_thanks','bye_see_you','bye_good_call','bye_later','bye_cheers','bye_take_care']};
  var TAGS={en:'en-GB',de:'de-DE',es:'es-ES',fr:'fr-FR'};
  var S={
    en:{intro_star:"This is a mockup GUI. Feel free to use it. If you found it useful, consider giving this repo a star on GitHub.",
      reply_concur:"I concur.",reply_good_idea:"Good idea.",reply_plan:"That sounds like a plan.",reply_would_if_could:"If I could do it, I would.",
      reply_agree_all:"Agreed, all around.",reply_next_step:"Let's take the next step.",
      more_open_source:"The code is open source, under the MIT licence.",more_try_it:"Try the other screens in the gallery.",
      more_feedback:"If something looks wrong, press Debug and send the file.",more_languages:"It also works in other languages.",
      more_star_too:"I gave it a star already.",more_works_for_me:"Works for me.",
      bye_thanks:"Thanks, everyone. Ending the call now.",bye_see_you:"See you next time.",bye_good_call:"Good call.",
      bye_later:"Talk later.",bye_cheers:"Cheers.",bye_take_care:"Take care."}};
  // The English lines are the keys; the Ada core (vendor/lang.js) gives the other languages.
  function tr(k){return lang!=='en'&&window.UIM?UIM.t(S.en[k]):S.en[k];}
  var supported=(s&&s.dataset.langs||'en').split(','), lang='en';
  try{var ul=localStorage.getItem('uim-lang');var q=(location.search.match(/[?&]lang=(\w+)/)||[])[1];ul=q||ul;if(ul&&supported.indexOf(ul)>=0&&TAGS[ul])lang=ul;}catch(e){}
  ev('lang',{lang:lang,supported:supported});
  var started=false, queued=0, ended=false;

  // Voices: only the selected language's own system voices.
  // Alternate female/male where the browser offers both. If several speakers
  // share one voice, a light pitch step (+/-0.06) keeps them apart without
  // sounding artificial.
  var PITCH=[1.00,0.94,1.06,0.97,1.03,0.91];
  var FEMALE=/female|woman|samantha|victoria|karen|zira|susan|serena|fiona|moira|tessa|aria|jenny|libby|sonia|amelie|amélie|audrey|aurelie|denise|julie|marie|hortense|celine|eloise|vivienne|anna|helena|monica|paulina|katja|petra|hedda|vicki|marlene|conchita|lucia|lucía|paloma|elvira|laura|google uk english female|google us english/i;
  function isFemale(v){return FEMALE.test(v.name);}
  // Novelty / effect voices (mostly macOS + iOS) sound robotic or spooky.
  // We never pick them; natural voices (Samantha, Daniel, Anna, Thomas,
  // Amelie, Monica ...) remain.
  var NOVELTY=/^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|fred|good news|hysterical|jester|junior|kathy|organ|pipe organ|princess|ralph|superstar|trinoids|whisper|wobble|zarvox)\b/i;
  function isNatural(v){return !NOVELTY.test(v.name);}
  function pick(i){
    var all=synth.getVoices();
    var own=all.filter(function(x){return x.lang.toLowerCase().indexOf(lang)===0;});
    if(lang==='en'){var gb=own.filter(function(x){return /en[-_]gb/i.test(x.lang);});if(gb.length)own=gb;} // EN = UK; en-US only as fallback
    var natural=own.filter(isNatural);
    if(natural.length) own=natural;
    if(!own.length) return null;
    var pool=own.filter(function(x){return isFemale(x)===(i%2===1);});
    if(pool.length) return pool[Math.floor(i/2)%pool.length];
    return own[i%own.length];}

  function finishCall(){if(ended)return;ended=true;if(tap.dataset.state==='connecting')tapState('gone');cur=null;setSpk(-1);ev('call-ended',{});
    dispatchEvent(new CustomEvent('vc:ended'));
    if(!document.getElementById('ended'))setTimeout(endBox,800);}
  // Pages without their own #ended screen get a generic one: red "Call ended" + repeat.
  function endBox(){var T=function(k){return window.UIM&&UIM.t?UIM.t(k):k;};
    var b=document.getElementById('vc-ended');if(!b){b=document.createElement('div');b.id='vc-ended';
      b.style.cssText='position:fixed;inset:0;margin:auto;width:min(86vw,380px);height:170px;z-index:99997;background:rgba(10,12,16,.95);border:1px solid #ff4d4d;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;font:15px system-ui,sans-serif;color:#e8eef2';
      b.innerHTML='<div style="color:#ff4d4d;font-size:24px" data-k="Call ended"></div><div data-k="Repeat the call?"></div><button data-k="Repeat" style="background:#2a2f36;color:#e8eef2;border:1px solid #556;padding:8px 18px;border-radius:20px;cursor:pointer"></button>';
      b.querySelector('button').onclick=function(){b.style.display='none';window.VoiceCover.restart();};
      document.body.appendChild(b);}
    b.querySelectorAll('[data-k]').forEach(function(x){x.textContent=T(x.getAttribute('data-k'));});b.style.display='flex';ev('end-box',{});}

  // Spoken text only: acronyms (MIT, GUI, URL …) are spelled letter by letter, e.g. 'MIT' -> 'M I T'; the plan/log keep the original line.
  function spell(t){return t.replace(/\b[A-ZÄÖÜ]{2,5}\b/g,function(w){return w.split('').join(' ');});}
  function say(t,i,key){var u=new SpeechSynthesisUtterance(spell(t));var v=pick(i);
    if(v)u.voice=v;u.lang=TAGS[lang]||lang;u.pitch=PITCH[i%PITCH.length];u.rate=1;
    var vn=v?v.name:'(default)';
    plan.push({speaker:i,key:key,line:t,voice:vn,voiceLang:v?v.lang:null,pitch:u.pitch,rate:u.rate});
    queued++;order.push(i);
    // SPEAKING stays on this speaker until the next utterance takes over.
    // iOS does not always fire onstart for queued lines, so on end we hand
    // the highlight straight to the next speaker in the queue.
    function done(){queued--;order.shift();
      if(queued<=0&&started){finishCall();return;}
      if(order.length&&speaking!==order[0])setSpk(order[0]);}
    u.onstart=function(){unlocked=true;if(tap.dataset.state!=='gone')tapState('gone');cur={voice:vn,line:t};setSpk(i);ev('speak-start',{speakerId:i,key:key,voice:vn,line:t,highlightedTile:lit?lit.index:null,highlightedLabel:lit?lit.label:null});};
    u.onend=function(){ev('speak-end',{speakerId:i,key:key,highlightedTile:lit?lit.index:null});done();};
    u.onerror=function(e){ev('speak-error',{speakerId:i,key:key,error:e.error});done();};
    synth.speak(u);}
  function run(trigger){if(muted||started||ended)return;started=true;if(synth.speaking||synth.pending)synth.cancel();plan=[];order=[];queued=0;ev('run',{trigger:trigger});
    say(tr(KEYS.first),0,KEYS.first);
    if(n===2){ // two-party call: strict back-and-forth, then goodbye
      say(tr('reply_good_idea'),1,'reply_good_idea');say(tr('more_open_source'),0,'more_open_source');
      say(tr('more_star_too'),1,'more_star_too');say(tr('bye_thanks'),0,'bye_thanks');say(tr('bye_take_care'),1,'bye_take_care');return;}
    for(var k=1;k<n;k++){var r=KEYS.replies[(k-1)%KEYS.replies.length];say(tr(r),k,r);}
    for(var m=n-1;m>=0;m--){var mk=KEYS.more[m%KEYS.more.length];say(tr(mk),m,mk);}
    for(var b=0;b<n;b++){var bk=KEYS.bye[b%KEYS.bye.length];say(tr(bk),b,bk);}}
  window.VoiceCover.restart=function(){synth.cancel();started=false;ended=false;setSpk(-1);run('restart');};
  function toggle(){muted=!muted;localStorage.setItem('vc-muted',muted?'1':'0');ev('mute',{muted:muted});
    synth.cancel();started=false;ended=false;queued=0;setSpk(-1);if(!muted)run('unmute'); label();}
  btn.onclick=function(e){e.stopPropagation();toggle();};
  addEventListener('keydown',function(e){if(e.key==='v'||e.key==='V')toggle();});
  // Tap to hear: iOS Safari only allows speech when the first speak() call
  // runs synchronously inside a user tap (touchend / click). So we do not
  // auto-start; the overlay's handler calls run() directly, which calls
  // synth.speak() before returning.
  var tap=document.createElement('button');tap.setAttribute('data-dbg','1');
  var TT=function(k){return window.UIM&&UIM.t?UIM.t(k):k;};
  var st=document.createElement('style');st.textContent='@keyframes vcpulse{0%,100%{opacity:1}50%{opacity:.45}}';document.head.appendChild(st);
  // States: idle (tap to hear) -> connecting (pulse, taps ignored) -> gone while speaking.
  function tapState(k){tap.dataset.state=k;
    if(k==='idle'){tap.textContent='\u25B6 '+TT('Tap to hear');tap.style.animation='';tap.style.pointerEvents='auto';tap.style.display='';}
    else if(k==='connecting'){tap.textContent='\u23F3 '+TT('Connecting…');tap.style.animation='vcpulse 1.2s ease-in-out infinite';tap.style.pointerEvents='none';tap.style.display='';}
    else{tap.style.display='none';tap.style.animation='';}
    ev('overlay',{state:k});}
  tap.style.cssText='position:fixed;inset:0;margin:auto;width:min(80vw,360px);height:120px;z-index:99998;'+
    'font:600 22px system-ui,sans-serif;color:#fff;background:rgba(10,120,60,.92);border:2px solid #7f7;border-radius:16px;cursor:pointer';
  tapState('idle');
  document.addEventListener('uim-lang',function(){if(tap.dataset.state!=='gone')tapState(tap.dataset.state);});
  function onTap(e){
    if(e){e.preventDefault();e.stopPropagation();}
    if(tap.dataset.state!=='idle')return;              // taps while connecting/playing are ignored
    ev('unlock-attempt',{via:e?e.type:'none'});
    if(muted){muted=false;localStorage.setItem('vc-muted','0');label();}
    started=false;ended=false;
    tapState('connecting');
    run('tap');                      // speak() happens here, synchronously
    var t0=Date.now();
    (function check(){
      if(unlocked||synth.speaking){unlocked=true;ev('unlock-success',{speaking:synth.speaking,ms:Date.now()-t0});if(synth.speaking){if(speaking<0&&order.length)setSpk(order[0]);if(tap.dataset.state==='connecting')tapState('gone');}else if(tap.dataset.state==='connecting')setTimeout(check,100);return;}
      if(Date.now()-t0<10000){setTimeout(check,100);return;}
      if(synth.pending){setTimeout(check,100);return;}
      ev('unlock-fail',{speaking:synth.speaking,pending:synth.pending});started=false;tapState('idle');})();}
  tap.addEventListener('touchend',onTap);
  tap.addEventListener('click',onTap);
  document.body.appendChild(tap);if(muted)tapState('gone');
  addEventListener('beforeunload',function(){synth.cancel();});
  synth.onvoiceschanged=function(){ev('voices-changed',{count:synth.getVoices().length});};
})();
