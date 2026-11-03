/* MIRA motion: shopping controls are static and always accessible.
 * Desktop has a short product story. Mobile keeps normal document scrolling.
 */
(() => {
 'use strict';
 const {gsap,ScrollTrigger,MotionPathPlugin}=window;
 if(!gsap||!ScrollTrigger)return;
 const root=document.documentElement,films=[...document.querySelectorAll('[data-film]')];
 let media,timer;
 const refresh=()=>{clearTimeout(timer);timer=setTimeout(()=>ScrollTrigger.refresh(true),150);};
 try{
  gsap.registerPlugin(ScrollTrigger);if(MotionPathPlugin)gsap.registerPlugin(MotionPathPlugin);
  ScrollTrigger.config({ignoreMobileResize:true});
  function build(){
  media?.revert();media=gsap.matchMedia();
  media.add({wide:'(min-width: 901px)',small:'(max-width: 900px)',compact:'(max-height: 619px)',reduced:'(prefers-reduced-motion: reduce)'},context=>{
   if(root.dataset.motion==='off'||context.conditions.reduced||context.conditions.compact)return;
   const small=context.conditions.small,direction=()=>root.dir==='rtl'?1:-1;
   root.classList.add('gsap-ready');
   gsap.fromTo('.logo-letter',{yPercent:20,opacity:0},{yPercent:0,opacity:1,duration:.9,stagger:.045,ease:'power2.out',clearProps:'all'});
   if(small){
    // No mobile pinning, staged text, hidden buttons or long scroll sequences.
    films.forEach(section=>{
     gsap.fromTo(section.querySelector('.cinema-object'),{y:12,scale:.98},{y:-8,scale:1.025,ease:'none',scrollTrigger:{id:`mira-mobile-${section.dataset.film}`,trigger:section,start:'top 85%',end:'bottom 15%',scrub:.5}});
    });
    return()=>root.classList.remove('gsap-ready');
   }
   root.classList.add('cinema-ready');
   films.forEach(section=>{
    const q=s=>section.querySelector(s),object=q('.cinema-object'),lead=q('.cinema-lead');
    const copy=q('.cinema-copy'),macro=q('.cinema-macro'),room=q('.cinema-room'),endcard=q('.cinema-endcard');
    const word=q('.cinema-word'),halo=q('.cinema-halo'),orbit=q('.cinema-orbit'),brew=section.dataset.film==='brew';
    // The .cinema-actions dock is deliberately excluded from every tween.
    gsap.set([copy,macro,room,endcard],{autoAlpha:0});
    gsap.set(room,{clipPath:brew?'inset(0% 50% 0% 50%)':'circle(0% at 50% 50%)',scale:1.05});
    const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
     id:`mira-story-${section.dataset.film}`,trigger:section,start:'top top',end:'bottom bottom',scrub:.65,invalidateOnRefresh:true,
     onUpdate:self=>section.classList.toggle('cinema-in-room',self.progress>.8),
     onToggle:self=>{object.style.willChange=self.isActive?'transform':'';}
    }});
    if(brew&&MotionPathPlugin){
     gsap.set(object,{scale:.96,rotation:-3});
     tl.to(object,{motionPath:{path:[{x:-innerWidth*.13*direction(),y:30},{x:innerWidth*.06*direction(),y:-18},{x:0,y:0}],curviness:1.1},scale:1,rotation:0,duration:30,ease:'power1.inOut'},0);
    }else{
     tl.fromTo(object,{scale:.96,rotation:-3,x:()=>direction()*innerWidth*.04,y:18},{scale:1,rotation:0,x:()=>direction()*innerWidth*.06,y:0,duration:30,ease:'power2.out'},0);
    }
    tl.to(halo,{scale:1.08,duration:45},0)
     .to(orbit,{rotation:brew?30:-12,opacity:.3,duration:55},0)
     .to(word,{xPercent:brew?5:-5,duration:50},0)
     .to(lead,{autoAlpha:0,y:-15,duration:12},30)
     .to(object,{scale:1.4,x:()=>direction()*innerWidth*.16,y:()=>innerHeight*(brew?-.03:.04),rotation:()=>direction()*(brew?-2:1),duration:22,ease:'power2.inOut'},32)
     .fromTo(copy,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:12},36)
     .fromTo(macro,{autoAlpha:0,scale:.9},{autoAlpha:1,scale:1,duration:12},42)
     .to(word,{opacity:0,duration:12},40)
     .to([copy,macro],{autoAlpha:0,duration:10},62)
     .to(object,{x:0,y:0,scale:.94,rotation:0,duration:20,ease:'power2.inOut'},64)
     // Extend only the final handoff. The 150-unit timeline and 340svh stage
     // preserve the preceding scroll pace; this reveal gets 3× its old travel.
     .to(room,{autoAlpha:1,clipPath:brew?'inset(0% 0% 0% 0%)':'circle(85% at 50% 50%)',scale:1,duration:66,ease:'none'},72)
     .to([halo,orbit],{autoAlpha:0,duration:30},90)
     .to(object,{autoAlpha:0,duration:24,ease:'sine.inOut'},114)
     .fromTo(endcard,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:18,ease:'power2.out'},132);
   });
   return()=>{
    root.classList.remove('gsap-ready','cinema-ready');
    films.forEach(section=>{section.classList.remove('cinema-in-room');section.querySelector('.cinema-object').style.willChange='';});
   };
  });
  }
  build();document.addEventListener('mira:motion',()=>{build();refresh();});
  document.addEventListener('mira:layout',refresh);document.addEventListener('mira:catalog',refresh);document.fonts?.ready.then(refresh);window.addEventListener('pageshow',refresh);refresh();
 }catch(error){media?.revert();root.classList.remove('gsap-ready','cinema-ready');console.warn('MIRA motion unavailable; shopping remains fully accessible.');}
})();
