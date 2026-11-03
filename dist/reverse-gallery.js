/* MIRA product columns. Inspired by the user's reverse-scroll reference:
 * https://scroll-driven-animations.style/demos/reverse-scroll/css/
 * The center follows document scroll. The outer columns travel the other way.
 * One ScrollTrigger drives both outer columns, with a short smoothing scrub.
 */
(() => {
 'use strict';
 const grid=document.querySelector('#product-grid');
 if(!grid)return;
 const viewport=window.matchMedia('(min-width: 901px) and (min-height: 620px)');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const {gsap,ScrollTrigger}=window;
 let cards=[],columns=[],animation=null,observer=null,pending=false,keyboard=false,keyboardPaused=false,sizes='';
 const eligible=()=>viewport.matches&&!reduced.matches&&!keyboardPaused;

 function destroy(){
  observer?.disconnect();observer=null;
  animation?.revert();animation=null;sizes='';
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
  const heights=columns.map(column=>column.offsetHeight);
  const height=Math.max(...heights);
  // Keep an actual reverse direction even in a tall desktop viewport.
  if(Math.min(...heights)<=window.innerHeight+30)return false;
  const nextSizes=`${window.innerHeight}:${heights.join(':')}`;
  if(nextSizes===sizes)return true;
  sizes=nextSizes;
  const frame=window.innerHeight-140;
  columns.forEach((column,index)=>{
   // Extend the original visible path beyond both viewport edges. Extrapolating
   // it keeps the first/last card fully reachable rather than clipping a row.
   const speed=(height+heights[index]-2*frame)/(height-frame);
   const origin=frame-heights[index];
   column.style.setProperty('--reverse-from',`${origin+speed*(110-window.innerHeight)}px`);
   column.style.setProperty('--reverse-to',`${origin+speed*(110+height)}px`);
  });
  if(animation)ScrollTrigger.refresh(true);
  return true;
 }

 function setup(){
  pending=false;
  // Font/layout notifications need a measurement, not a DOM teardown.
  if(eligible()&&columns.length&&columns.every(column=>column.parentNode===grid)){
   if(!measure())destroy();
   return;
  }
  destroy();
  const current=[...grid.children].filter(el=>el.classList.contains('product-card'));
  if(!eligible()||current.length!==7)return;
  if(!gsap||!ScrollTrigger)return;
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
  grid.classList.add('reverse-enabled','reverse-gsap');
  try{
   gsap.registerPlugin(ScrollTrigger);
   animation=gsap.fromTo(columns.filter(column=>column.classList.contains('column-reverse')),
    {y:(_index,column)=>parseFloat(column.style.getPropertyValue('--reverse-from'))},
    {y:(_index,column)=>parseFloat(column.style.getPropertyValue('--reverse-to')),force3D:true,ease:'none',scrollTrigger:{
     id:'mira-reverse-products',trigger:grid,start:'top bottom',end:'bottom top',scrub:.3,invalidateOnRefresh:true
    }});
  }catch{destroy();return;}
  // Transforms do not change these sizes, so the observer has no scroll loop.
  if('ResizeObserver' in window){
   observer=new ResizeObserver(schedule);
   columns.forEach(column=>observer.observe(column));
  }
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(setup);}}
 document.addEventListener('mira:catalog',schedule);
 document.addEventListener('mira:layout',schedule);
 viewport.addEventListener('change',schedule);reduced.addEventListener('change',schedule);
 window.addEventListener('resize',schedule);
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
