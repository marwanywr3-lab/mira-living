/* MIRA Cinema: real product cutouts, three scroll acts, two choreographies.
 * GSAP + ScrollTrigger + MotionPathPlugin 3.15.0, all self-hosted.
 */
(() => {
 'use strict';
 const {gsap,ScrollTrigger,MotionPathPlugin}=window;
 if(!gsap||!ScrollTrigger)return;
 const root=document.documentElement,films=[...document.querySelectorAll('[data-film]')];
 let media,timer;
 const refresh=()=>{clearTimeout(timer);timer=setTimeout(()=>ScrollTrigger.refresh(true),150);};
 try{
  gsap.registerPlugin(ScrollTrigger);
  if(MotionPathPlugin)gsap.registerPlugin(MotionPathPlugin);
  ScrollTrigger.config({ignoreMobileResize:true});
  media=gsap.matchMedia();
  media.add({wide:'(min-width: 901px)',small:'(max-width: 900px)',compact:'(max-height: 619px)',reduced:'(prefers-reduced-motion: reduce)'},context=>{
   if(context.conditions.reduced||context.conditions.compact)return;
   const small=context.conditions.small,direction=()=>root.dir==='rtl'?1:-1;
   root.classList.add('gsap-ready','cinema-ready');
   gsap.timeline({defaults:{ease:'power3.out'}})
    .fromTo('.logo-letter',{yPercent:75,rotationX:-70,opacity:0},{yPercent:0,rotationX:0,opacity:1,duration:1.3,stagger:.08,clearProps:'all'})
    .fromTo('.brand-rule',{scaleX:0},{scaleX:1,duration:1.2,clearProps:'transform'},.4);
   films.forEach(section=>{
    const q=s=>section.querySelector(s),qa=s=>[...section.querySelectorAll(s)];
    const object=q('.cinema-object'),intact=q('.cinema-intact'),slices=qa('.product-slice');
    const lead=q('.cinema-lead'),copy=q('.cinema-copy'),macro=q('.cinema-macro');
    const room=q('.cinema-room'),endcard=q('.cinema-endcard'),word=q('.cinema-word');
    const halo=q('.cinema-halo'),orbit=q('.cinema-orbit'),chapters=qa('[data-chapter]');
    const brew=section.dataset.film==='brew',progress=gsap.quickSetter(q('.cinema-track>span'),'scaleX');
    let chapter=-1;
    function update(p){
     progress(p);const next=p<.36?0:p<.74?1:2;
     if(next!==chapter){chapter=next;chapters.forEach((el,i)=>el.classList.toggle('is-active',i===next));q('.cinema-count').textContent=`0${next+1} — 03`;}
     section.classList.toggle('cinema-in-room',p>.81);
    }
    update(0);
    gsap.set([copy,macro,endcard,room],{autoAlpha:0});
    gsap.set(room,{clipPath:brew?'inset(0% 50% 0% 50%)':'circle(0% at 50% 50%)',scale:1.15});
    gsap.set(intact,{autoAlpha:brew?1:0});gsap.set(slices,{autoAlpha:brew?0:1});
    const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
     id:`mira-cinema-${section.dataset.film}`,trigger:section,start:'top top',end:'bottom bottom',scrub:small?.45:.7,invalidateOnRefresh:true,
     onUpdate:self=>update(self.progress),
     onToggle:self=>{section.classList.toggle('cinema-in-view',self.isActive);object.style.willChange=self.isActive?'transform':'';}
    }});
    // ACT I: refrigerator assembles from image slices; coffee machine follows an arc.
    if(!brew){
     tl.fromTo(object,{scale:.56,rotation:-16,x:()=>direction()*innerWidth*.2,y:()=>innerHeight*.18},{scale:1,rotation:0,x:()=>direction()*innerWidth*.08,y:0,duration:34,ease:'power2.inOut'},0)
      .fromTo(slices,{x:i=>[-180,200,-150][i],y:i=>[-80,0,100][i],rotation:i=>[-12,14,-10][i]},{x:0,y:0,rotation:0,duration:25,stagger:3,ease:'power2.inOut'},0)
      .to(intact,{autoAlpha:1,duration:3},31).to(slices,{autoAlpha:0,duration:3},33);
    }else{
     gsap.set(object,{scale:.6,rotation:-20});
     if(MotionPathPlugin){
      const path=[{x:-innerWidth*(small?.5:.4)*direction(),y:innerHeight*.22},{x:innerWidth*(small?.22:.25)*direction(),y:-innerHeight*.14},{x:innerWidth*.08*direction(),y:innerHeight*.035},{x:0,y:0}];
      tl.to(object,{motionPath:{path,curviness:1.3,autoRotate:false},scale:1,rotation:4,duration:33,ease:'power1.inOut'},0);
     }else tl.fromTo(object,{x:-innerWidth*.3,y:innerHeight*.2},{x:0,y:0,scale:1,rotation:4,duration:33,ease:'power2.inOut'},0);
     tl.to(object,{rotation:0,duration:5},33);
    }
    tl.fromTo(halo,{scale:.25,opacity:0},{scale:1.15,opacity:1,duration:32},0)
     .fromTo(orbit,{scale:.7,rotation:brew?-50:20,opacity:0},{scale:1,rotation:brew?50:-20,opacity:.65,duration:46},0)
     .fromTo(word,{xPercent:brew?-18:18,scale:1.15,opacity:0},{xPercent:brew?8:-8,scale:.9,opacity:1,duration:43},0)
     .fromTo(lead,{y:60,autoAlpha:0},{y:0,autoAlpha:1,duration:13},10)
     .to(lead,{y:-65,autoAlpha:0,duration:10},32);
    // ACT II: large macro zoom of the isolated appliance and a real detail crop.
    tl.to(object,{scale:small?1.8:(brew?2.35:2.05),x:()=>direction()*innerWidth*(small?.18:.28),y:()=>innerHeight*(brew?-.14:.12),rotation:()=>direction()*(brew?-9:4),rotationY:()=>direction()*-10,duration:24,ease:'power2.inOut'},38)
     .fromTo(copy,{autoAlpha:0,y:70},{autoAlpha:1,y:0,duration:13},44)
     .fromTo(macro,{autoAlpha:0,scale:.45,rotation:brew?-18:18},{autoAlpha:1,scale:1,rotation:0,duration:17,ease:'power2.out'},47)
     .to(orbit,{rotation:brew?150:-60,scale:1.35,opacity:.25,duration:28},38)
     .to(word,{xPercent:brew?25:-25,opacity:0,duration:25},41)
     .to(copy,{autoAlpha:0,y:-35,duration:9},67)
     .to(macro,{autoAlpha:0,scale:.8,duration:8},68);
    // ACT III: pull back into the original room. Iris vs. center-opening curtain.
    tl.to(object,{x:0,y:0,scale:.88,rotation:0,rotationY:0,duration:21,ease:'power2.inOut'},65)
     .to(room,{autoAlpha:1,clipPath:brew?'inset(0% 0% 0% 0%)':'circle(85% at 50% 50%)',scale:1,duration:23,ease:'power2.inOut'},72)
     .to([halo,orbit],{autoAlpha:0,duration:12},73)
     .to(object,{autoAlpha:0,duration:9},85)
     .fromTo(endcard,{autoAlpha:0,y:65},{autoAlpha:1,y:0,duration:16,ease:'power2.out'},84);
   });
   return()=>{
    root.classList.remove('gsap-ready','cinema-ready');
    films.forEach(section=>{section.classList.remove('cinema-in-room','cinema-in-view');section.querySelector('.cinema-object').style.willChange='';section.querySelector('.cinema-track>span').style.transform='';section.querySelectorAll('.is-active').forEach(el=>el.classList.remove('is-active'));});
   };
  });
  document.addEventListener('mira:layout',refresh);document.fonts?.ready.then(refresh);
  // Scene sizes are explicit; image decoding cannot change their scroll geometry.
  window.addEventListener('pageshow',refresh);refresh();
 }catch(error){media?.revert();root.classList.remove('gsap-ready','cinema-ready');console.warn('MIRA cinematic enhancement unavailable; the static storefront remains active.');}
})();
