if(window.self!==window.top)document.documentElement.dataset.embedded='true';
try {
  localStorage.removeItem('kicktheball-theme');
  for(const key of ['black-nut-workspace','black-nut-shell','black-nut-explorer','black-nut-effects-session','black-nut-expanded-folders'])sessionStorage.removeItem(key);
} catch {}
let theme='dark';
if(self!==top)try{theme=parent.document.documentElement.dataset.theme||'dark';}catch{}
document.documentElement.dataset.theme=theme;
let firstTabVisit=false;
if(self===top)try{
  firstTabVisit=!sessionStorage.getItem('black-nut-intro-seen');
  sessionStorage.setItem('black-nut-intro-seen','1');
}catch{firstTabVisit=true;}
if(self===top&&firstTabVisit&&/^\/(?:index\.html)?$/.test(location.pathname)&&location.hash!=='#notes'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.classList.add('monitor-intro-pending');
  setTimeout(()=>{if(!document.querySelector('.monitor-intro-screen'))document.documentElement.classList.remove('monitor-intro-pending');},6000);
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => Promise.all(regs.filter(r => [r.active,r.waiting,r.installing].some(w => w && new URL(w.scriptURL).pathname === '/sw.min.js')).map(r => r.update()))).catch(() => {});
}
