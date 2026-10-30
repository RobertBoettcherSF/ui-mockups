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
  // The call runs in rounds. Round 1: caller 0 says the intro, others reply.
  // Round 2: more replies. Round 3: everyone says goodbye. Then the call ends.
  var KEYS={
    first:'intro_star',
    replies:['reply_concur','reply_good_idea','reply_plan','reply_would_if_could','reply_agree_all','reply_next_step'],
    more:['more_open_source','more_try_it','more_feedback','more_languages','more_star_too','more_works_for_me'],
    bye:['bye_thanks','bye_see_you','bye_good_call','bye_later','bye_cheers','bye_take_care']};
  var TAGS={en:'en-US',fr:'fr-FR'};
  var S={
    en:{intro_star:"This is a mockup GUI. Feel free to use it. If you found it useful, consider giving this repo a star on GitHub.",
      reply_concur:"I concur.",reply_good_idea:"Good idea.",reply_plan:"That sounds like a plan.",reply_would_if_could:"If I could do it, I would.",
      reply_agree_all:"Agreed, all around.",reply_next_step:"Let's take the next step.",
      more_open_source:"The code is open source, under the MIT licence.",more_try_it:"Try the other screens in the gallery.",
      more_feedback:"If something looks wrong, press Debug and send the file.",more_languages:"It also works in other languages.",
      more_star_too:"I gave it a star already.",more_works_for_me:"Works for me.",
      bye_thanks:"Thanks, everyone. Ending the call now.",bye_see_you:"See you next time.",bye_good_call:"Good call.",
      bye_later:"Talk later.",bye_cheers:"Cheers.",bye_take_care:"Take care."},
    fr:{intro_star:"Ceci est une maquette d'interface graphique. N'hésitez pas à l'utiliser. Si vous l'avez trouvée utile, pensez à donner une étoile à ce dépôt sur GitHub.",
      reply_concur:"Je suis d'accord.",reply_good_idea:"Bonne idée.",reply_plan:"Ça me semble être un bon plan.",reply_would_if_could:"Si je pouvais le faire, je le ferais.",
      reply_agree_all:"D'accord sur toute la ligne.",reply_next_step:"Passons à l'étape suivante.",
      more_open_source:"Le code est open source, sous licence MIT.",more_try_it:"Essayez les autres écrans de la galerie.",
      more_feedback:"Si quelque chose cloche, appuyez sur Debug et envoyez le fichier.",more_languages:"Ça marche aussi dans d'autres langues.",
      more_star_too:"Je lui ai déjà donné une étoile.",more_works_for_me:"Ça me va.",
      bye_thanks:"Merci à tous. Je termine l'appel.",bye_see_you:"À la prochaine.",bye_good_call:"Bon appel.",
      bye_later:"On se reparle plus tard.",bye_cheers:"Salut.",bye_take_care:"Prenez soin de vous."}};
  function tr(k){return (S[lang]&&S[lang][k])||S.en[k];}
  var supported=(s&&s.dataset.langs||'en').split(','), lang='en';
  try{var ul=localStorage.getItem('uim-lang');var q=(location.search.match(/[?&]lang=(\w+)/)||[])[1];ul=q||ul;if(ul&&supported.indexOf(ul)>=0&&S[ul])lang=ul;}catch(e){}
  ev('lang',{lang:lang,supported:supported});
  var started=false, queued=0, ended=false;

  // Voices: only the selected language's own system voices.
  // Alternate female/male where the browser offers both. If several speakers
  // share one voice, a light pitch step (+/-0.06) keeps them apart without
  // sounding artificial.
  var PITCH=[1.00,0.94,1.06,0.97,1.03,0.91];
  var FEMALE=/female|woman|samantha|victoria|karen|zira|susan|serena|fiona|moira|tessa|aria|jenny|libby|sonia|amelie|amélie|audrey|aurelie|denise|julie|marie|hortense|celine|eloise|vivienne|anna|helena|monica|paulina|google uk english female|google us english/i;
  function isFemale(v){return FEMALE.test(v.name);}
  function pick(i){
    var all=synth.getVoices();
    var own=all.filter(function(x){return x.lang.toLowerCase().indexOf(lang)===0;});
    if(!own.length) return null;
    var pool=own.filter(function(x){return isFemale(x)===(i%2===1);});
    if(pool.length) return pool[Math.floor(i/2)%pool.length];
    return own[i%own.length];}

  function finishCall(){if(ended)return;ended=true;cur=null;setSpk(-1);ev('call-ended',{});
    dispatchEvent(new CustomEvent('vc:ended'));}

  function say(t,i,key){var u=new SpeechSynthesisUtterance(t);var v=pick(i);
    if(v)u.voice=v;u.lang=TAGS[lang]||lang;u.pitch=PITCH[i%PITCH.length];u.rate=1;
    var vn=v?v.name:'(default)';
    plan.push({speaker:i,key:key,line:t,voice:vn,voiceLang:v?v.lang:null,pitch:u.pitch,rate:u.rate});
    queued++;
    function done(){queued--;if(speaking===i){cur=null;setSpk(-1);}if(queued<=0&&started)finishCall();}
    u.onstart=function(){unlocked=true;cur={voice:vn,line:t};setSpk(i);ev('speak-start',{speakerId:i,key:key,voice:vn,line:t,highlightedTile:lit?lit.index:null,highlightedLabel:lit?lit.label:null});};
    u.onend=function(){ev('speak-end',{speakerId:i,key:key,highlightedTile:lit?lit.index:null});done();};
    u.onerror=function(e){ev('speak-error',{speakerId:i,key:key,error:e.error});done();};
    synth.speak(u);}
  function run(trigger){if(muted||started||ended)return;started=true;synth.cancel();plan=[];queued=0;ev('run',{trigger:trigger});
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
  addEventListener('keydown',function(e){if(e.key==='v'||e.key==='V')toggle();else run('key');});
  addEventListener('pointerdown',function(){if(!unlocked)ev('unlock-attempt',{});run('pointer');});
  addEventListener('beforeunload',function(){synth.cancel();});
  setTimeout(function(){run('auto');},600);
  synth.onvoiceschanged=function(){ev('voices-changed',{count:synth.getVoices().length});};
})();
