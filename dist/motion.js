/* MIRA scroll direction, independent of the shop state.
 * GSAP / ScrollTrigger 3.15.0 are self-hosted in vendor/.
 * Static CSS remains usable when either library is unavailable.
 */
(() => {
 'use strict';
 const {gsap, ScrollTrigger}=window;
 if(!gsap||!ScrollTrigger)return;
 const root=document.documentElement;
 const films=[...document.querySelectorAll('[data-film]')];
 let refreshTimer;
 let media;

 // Coalesce image/font/language changes; never measure layout on each scroll.
 const refresh=()=>{
  clearTimeout(refreshTimer);
  refreshTimer=setTimeout(()=>ScrollTrigger.refresh(),120);
 };

 try {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ignoreMobileResize:true});
  media=gsap.matchMedia();

  media.add({
   desktop:'(min-width: 901px) and (min-height: 701px)',
   mobile:'(max-width: 900px), (max-height: 700px)',
   reduced:'(prefers-reduced-motion: reduce)'
  },context=>{
   // matchMedia reverts every tween and inline style when the preference changes.
   if(context.conditions.reduced)return;
   const desktop=context.conditions.desktop;
   root.classList.add('gsap-ready');
   root.classList.toggle('film-desktop-motion',desktop);

   // The logo entrance is separate from the scroll transform, avoiding two
   // animation systems writing to the same element.
   const entrance=gsap.timeline({defaults:{ease:'power3.out'}});
   entrance.fromTo('.logo-letter',
    {yPercent:25,opacity:0,scale:.94},
    {yPercent:0,opacity:1,scale:1,duration:1.25,stagger:.075,clearProps:'transform,opacity'}
   ).fromTo('.brand-rule',
    {scaleX:0,opacity:0},
    {scaleX:1,opacity:.35,duration:1,clearProps:'transform,opacity'},.3
   ).fromTo('.nav .logo',
    {opacity:.4,y:5},
    {opacity:1,y:0,duration:1,clearProps:'transform,opacity'},.1
   );

   if(desktop){
    gsap.to('.hero-brand',{
     scale:.96,y:-12,ease:'none',
     scrollTrigger:{id:'mira-logo',trigger:'.hero',start:'top top',end:'bottom top',scrub:.65}
    });
    gsap.to('.hero-visual>img',{
     scale:1.065,yPercent:2.5,ease:'none',
     scrollTrigger:{id:'mira-hero',trigger:'.hero',start:'top top',end:'bottom top',scrub:.8}
    });
   }

   films.forEach(section=>{
    const camera=section.querySelector('.film-camera');
    const visual=section.querySelector('.film-visual');
    const notes=[...section.querySelectorAll('[data-film-note]')];
    const focus=[...section.querySelectorAll('.film-focus>span')];
    const progress=section.querySelector('.film-progress>span');
    const brew=section.dataset.film==='brew';
    const sign=brew?-1:1;
    const setProgress=gsap.quickSetter(progress,'scaleX');
    let active=-1;
    function update(progressValue){
     setProgress(progressValue);
     const next=Math.min(2,Math.floor(progressValue*3));
     if(next===active)return;
     active=next;
     notes.forEach((note,i)=>note.classList.toggle('is-active',i===next));
     focus.forEach((label,i)=>label.classList.toggle('is-active',i===next));
    }
    section.classList.add('motion-enabled');
    update(0);

    // CSS supplies native sticky positioning on desktop. Only the inner image
    // is transformed: no pin spacers, scroll hijacking, or synthetic 3D model.
    const shot=gsap.timeline({
     defaults:{ease:'none'},
     scrollTrigger:{
      id:`mira-${section.dataset.film}`,
      trigger:desktop?section:visual,
      start:desktop?'top top+=105':'top 90%',
      end:desktop?'bottom bottom-=20':'bottom 15%',
      scrub:desktop?.8:.4,
      invalidateOnRefresh:true,
      onUpdate:self=>update(self.progress),
      onToggle:self=>{
       camera.style.willChange=self.isActive?'transform':'';
       section.classList.toggle('film-in-view',self.isActive);
      }
     }
    });
    shot.fromTo(camera,{
     scale:desktop?1.075:1.035,
     rotation:desktop?-1.25*sign:0,
     xPercent:desktop?-1.1*sign:0,
     yPercent:desktop?1.3:1
    },{
     scale:desktop?1.19:1.085,
     rotation:desktop?.75*sign:0,
     xPercent:desktop?1.1*sign:0,
     yPercent:desktop?-1.3:-1,
     duration:1
    });
   });

   return ()=>{
    root.classList.remove('gsap-ready','film-desktop-motion');
    films.forEach(section=>{
     section.classList.remove('motion-enabled','film-in-view');
     section.querySelector('.film-camera').style.willChange='';
     section.querySelector('.film-progress>span').style.transform='';
     section.querySelectorAll('.is-active').forEach(el=>el.classList.remove('is-active'));
    });
   };
  });

  document.addEventListener('mira:layout',refresh);
  document.fonts?.ready.then(refresh);
  document.querySelectorAll('.hero-visual img,.film-camera img').forEach(img=>{
   if(!img.complete)img.addEventListener('load',refresh,{once:true});
  });
  window.addEventListener('pageshow',refresh);
  refresh();
 } catch(error){
  // A failed animation must never make a product or purchase control inaccessible.
  media?.revert();
  root.classList.remove('gsap-ready','film-desktop-motion');
  console.warn('MIRA motion enhancement unavailable; the static storefront remains active.');
 }
})();
