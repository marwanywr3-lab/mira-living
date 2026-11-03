/* A visitor can bypass the presentation and browse the static collection. */
(() => {
 'use strict';
 const root=document.documentElement,button=document.querySelector('#motion-toggle');
 if(!button)return;
 try{if(localStorage.getItem('mira-motion')==='off')root.dataset.motion='off';}catch{}
 function label(){
  const off=root.dataset.motion==='off',arabic=root.lang==='ar';
  button.querySelector('.motion-label').textContent=arabic?(off?'إعادة الحركة':'تجاوز الحركة'):(off?'Enable animations':'Skip animations');
  button.querySelector('.motion-icon').textContent=off?'↻':'↓';
 }
 button.addEventListener('click',()=>{
  const off=root.dataset.motion!=='off';
  root.dataset.motion=off?'off':'on';
  try{localStorage.setItem('mira-motion',off?'off':'on');}catch{}
  label();document.dispatchEvent(new Event('mira:motion'));
  // Let both animation modules finish reverting/rebuilding before navigating.
  requestAnimationFrame(()=>{
   const collection=document.querySelector('#collection');
   try{history.replaceState(null,'','#collection');}catch{}
   collection.focus({preventScroll:true});
   collection.scrollIntoView({block:'start',behavior:'instant'});
  });
 });
 document.addEventListener('mira:layout',label);
 label();
})();
