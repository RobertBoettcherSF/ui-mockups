// Fit header titles (.ttl .h1/.h2) to one line by shrinking spacing then size; wrap as last resort.
(function(){
  function fit(){document.querySelectorAll('header .ttl .h1, header .ttl .h2').forEach(function(el){
    el.style.whiteSpace='nowrap';el.style.maxWidth='';el.style.fontSize='';el.style.letterSpacing='';
    var cs=getComputedStyle(el),fs=parseFloat(cs.fontSize),ls=parseFloat(cs.letterSpacing)||0,min=el.classList.contains('h1')?12:9,box=el.parentElement;
    var over=function(){var r=el.getBoundingClientRect(),lim=Math.min(box.clientWidth,innerWidth-r.left-8);return el.scrollWidth>lim+1;};
    while(over()&&ls>1){ls-=1;el.style.letterSpacing=ls+'px';}
    while(over()&&fs>min){fs-=0.5;el.style.fontSize=fs+'px';}
    if(over()){el.style.whiteSpace='normal';el.style.overflowWrap='anywhere';el.style.maxWidth=(innerWidth-el.getBoundingClientRect().left-8)+'px';}
  });}
  window.addEventListener('resize',fit);document.addEventListener('uim-lang',function(){setTimeout(fit,0);});
  if(document.readyState!=='loading')fit();else document.addEventListener('DOMContentLoaded',fit);
  window.addEventListener('load',fit);if(document.fonts)document.fonts.ready.then(fit);
})();
