/* MIRA product columns. Inspired by the user's reverse-scroll reference:
 * https://scroll-driven-animations.style/demos/reverse-scroll/css/
 * The center follows document scroll. The outer columns travel the other way.
 * Native CSS view timelines are preferred; ScrollTrigger is the fallback.
 */
(() => {
 'use strict';
 const grid=document.querySelector('#product-grid');
 if(!grid)return;
 const viewport=window.matchMedia('(min-width: 901px) and (min-height: 620px)');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const native=typeof CSS!=='undefined'&&CSS.supports('animation-timeline','view()')&&CSS.supports('animation-range','contain 0% contain 100%');
 let cards=[],columns=[],tweens=[],observer=null,pending=false,keyboard=false,keyboardPaused=false;
 const eligible=()=>viewport.matches&&!reduced.matches&&!keyboardPaused;

 function destroy(){
  observer?.disconnect();observer=null;
  tweens.forEach(tween=>tween.revert());tweens=[];
  const attached=columns.length&&columns.every(column=>column.parentNode===grid);
  grid.classList.remove('reverse-layout','reverse-enabled','reverse-css','reverse-gsap');
  if(attached){
   cards.forEach(card=>{
    if(card.dataset.reverseWide==='true')card.classList.add('card-wide');
    delete card.dataset.reverseWide;
   });
   grid.replaceChildren(...cards);
  }
  cards=[];columns=[];
 }

 function measure(){
  if(!columns.length||!columns.every(column=>column.isConnected))return false;
  // The timeline's inset leaves room for the floating navigation and bottom gap.
  const frame=Math.max(1,window.innerHeight-140);
  const heights=columns.map(column=>column.offsetHeight);
  const travel=Math.max(...heights)-frame;
  // One-card/filter results stay in the regular grid; no empty animated runway.
  if(travel<100||Math.min(...heights)<=frame+30)return false;
  columns.forEach((column,index)=>{
   column.style.setProperty('--reverse-from',`${frame-heights[index]}px`);
   column.style.setProperty('--reverse-to',`${travel}px`);
  });
  return true;
 }

 function setup(){
  pending=false;destroy();
  const current=[...grid.children].filter(el=>el.classList.contains('product-card'));
  if(!eligible()||current.length!==7)return;
  if(!native&&(!window.gsap||!window.ScrollTrigger))return;
  cards=current;
  // Each appliance appears once. The center has the extra seventh product.
  const groups=[[0,3],[1,4,6],[2,5]];
  columns=groups.map((indices,index)=>{
   const column=document.createElement('div');
   column.className=`product-column${index===1?'':' column-reverse'}`;
   indices.forEach(i=>{
    if(cards[i].classList.contains('card-wide')){
     cards[i].dataset.reverseWide='true';cards[i].classList.remove('card-wide');
    }
    column.appendChild(cards[i]);
   });
   return column;
  });
  grid.replaceChildren(...columns);grid.classList.add('reverse-layout');
  if(!measure()){destroy();return;}
  grid.classList.add('reverse-enabled',native?'reverse-css':'reverse-gsap');
  if(!native){
   columns.filter(column=>column.classList.contains('column-reverse')).forEach(column=>{
    tweens.push(window.gsap.fromTo(column,
     {y:()=>parseFloat(column.style.getPropertyValue('--reverse-from'))},
     {y:()=>parseFloat(column.style.getPropertyValue('--reverse-to')),ease:'none',scrollTrigger:{
      id:'mira-reverse-products',trigger:grid,start:'top 110px',end:'bottom bottom-=30px',scrub:true,invalidateOnRefresh:true
     }}));
   });
  }
  // Transforms do not change these sizes, so the observer has no scroll loop.
  if('ResizeObserver' in window){
   observer=new ResizeObserver(()=>{
    if(!measure()){destroy();return;}
    if(!native)window.ScrollTrigger.refresh(true);
   });
   columns.forEach(column=>observer.observe(column));
  }
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(setup);}}
 document.addEventListener('mira:catalog',schedule);
 document.addEventListener('mira:layout',schedule);
 viewport.addEventListener('change',schedule);reduced.addEventListener('change',schedule);
 window.addEventListener('resize',()=>{
  if(!eligible()){destroy();return;}
  if(!columns.length)schedule();else if(!measure())destroy();
 });
 // Keyboard browsing switches to a static catalog for the rest of this visit.
 // No focus target is carried off-screen by a reverse-moving column.
 document.addEventListener('keydown',event=>{if(event.key==='Tab')keyboard=true;},true);
 document.addEventListener('pointerdown',()=>{keyboard=false;},true);
 grid.addEventListener('focusin',event=>{
  if(!keyboard||!columns.length)return;
  keyboardPaused=true;const target=event.target;destroy();
  requestAnimationFrame(()=>{target.scrollIntoView({block:'nearest',behavior:'instant'});window.ScrollTrigger?.refresh(true);});
 });
 document.fonts?.ready.then(schedule);
 schedule();
})();
