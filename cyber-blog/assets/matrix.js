(() => {
  if(self!==top)return;
  const button=document.querySelector('#matrix-toggle');
  if(!button)return;
  const alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const brand=document.querySelector('.brand-signal');
  if(brand)brand.textContent=brand.dataset.signalWord||'black_nut';
  const glow=document.createElement('div');glow.className='pointer-glow';glow.setAttribute('aria-hidden','true');document.body.append(glow);
  let enabled=true,monitor=null,ctx=null,width=0,height=0,drops=[],impacts=[],frame=0,timer=0,lastFrame=0;
  const glyph=()=>alphabet[Math.random()*alphabet.length|0];
  const active=()=>enabled&&!reducedMotion.matches&&!document.hidden&&monitor?.isConnected;
  function drop(initial=false){return {char:glyph(),x:12+Math.random()*Math.max(1,width-24),y:initial?Math.random()*height:-20-Math.random()*40,speed:3.5+Math.random()*4.5};}
  function resizeMonitor(){
    if(!ctx)return;
    const oldWidth=width,oldHeight=height;
    width=Math.max(1,Math.min(1000,Math.round(monitor.clientWidth)));
    height=Math.max(1,Math.min(500,Math.round(monitor.clientHeight)));
    if(monitor.width===width&&monitor.height===height)return;
    monitor.width=width;monitor.height=height;
    if(oldWidth&&oldHeight)for(const item of drops){item.x*=width/oldWidth;item.y*=height/oldHeight;}
    ctx.fillStyle='#06110d';ctx.fillRect(0,0,width,height);
    ctx.font='13px monospace';
    for(let x=0;x<width;x+=18)for(let y=0;y<height;y+=20){ctx.fillStyle=Math.random()>.8?'#2d7450':'#16412d';ctx.fillText(glyph(),x,y);}
  }
  function syncMonitor(){
    const next=document.querySelector('#monitor-glyphs');if(next===monitor)return;
    monitor=next;ctx=monitor?.getContext('2d')||null;width=0;height=0;drops=[];impacts=[];
    if(ctx){resizeMonitor();for(let i=0;i<(innerWidth<700?16:32);i++)drops.push(drop(true));}
  }
  function drawMonitor(){
    if(!ctx)return;
    const mobile=innerWidth<700;
    ctx.fillStyle=mobile?'rgba(4,16,10,.12)':'rgba(4,16,10,.2)';ctx.fillRect(0,0,width,height);
    ctx.font='600 15px monospace';
    if(drops.length<(mobile?34:105))drops.push(drop());
    const remaining=[];
    for(const item of drops){
      item.y+=item.speed*(mobile?.66:1);
      ctx.fillStyle='#72eaa4';ctx.fillText(item.char,item.x,item.y);
      ctx.globalAlpha=.23;ctx.fillText(item.char,item.x,item.y-17);ctx.globalAlpha=1;
      if(item.y>=height-12)impacts.push({x:item.x,life:8});else remaining.push(item);
    }
    drops=remaining;impacts=impacts.filter(item=>item.life-->0);
    for(const item of impacts){
      const spread=10+(8-item.life)*4;
      ctx.fillStyle=`rgba(158,255,191,${item.life*.09})`;
      ctx.fillRect(item.x-spread/2,height-6,spread,2);
    }
  }
  function draw(now){
    frame=0;if(!active())return;
    const rect=monitor.getBoundingClientRect(),visible=rect.bottom>=0&&rect.top<=innerHeight;
    const interval=innerWidth<700?33:50;
    if(visible){
      if(now-lastFrame>=interval){lastFrame=now;drawMonitor();}
      frame=requestAnimationFrame(draw);
    }else timer=setTimeout(()=>{timer=0;frame=requestAnimationFrame(draw);},250);
  }
  function sync(){
    button.setAttribute('aria-pressed',String(enabled));button.title=enabled?'배경 효과 끄기':'배경 효과 켜기';
    document.documentElement.dataset.effects=active()?'on':'off';
    cancelAnimationFrame(frame);clearTimeout(timer);frame=0;timer=0;
    if(active())frame=requestAnimationFrame(draw);
  }
  button.addEventListener('click',()=>{enabled=!enabled;sync();});
  document.addEventListener('visibilitychange',sync);
  addEventListener('pageshow',event=>{if(event.persisted){syncMonitor();sync();}});
  addEventListener('resize',()=>{resizeMonitor();sync();});
  reducedMotion.addEventListener?.('change',sync);
  document.addEventListener('pointermove',event=>{
    if(!active()||event.pointerType==='touch')return;
    glow.style.setProperty('--pointer-x',event.clientX+'px');glow.style.setProperty('--pointer-y',event.clientY+'px');
    const screen=event.target.closest('.monitor-display');
    if(screen){const rect=screen.getBoundingClientRect();screen.style.setProperty('--monitor-x',event.clientX-rect.left+'px');screen.style.setProperty('--monitor-y',event.clientY-rect.top+'px');}
    const card=event.target.closest('.post-card');
    if(card){const rect=card.getBoundingClientRect();card.style.setProperty('--card-x',event.clientX-rect.left+'px');card.style.setProperty('--card-y',event.clientY-rect.top+'px');}
  });
  let readingBar;
  function updateReadingProgress(){if(readingBar)readingBar.style.transform='scaleX('+Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))+')';}
  function syncReadingProgress(){
    if(document.querySelector('.article-wrap')){if(!readingBar){readingBar=document.createElement('div');readingBar.className='reading-progress';readingBar.setAttribute('aria-hidden','true');document.body.append(readingBar);}}
    else if(readingBar){readingBar.remove();readingBar=null;}
    updateReadingProgress();
  }
  addEventListener('scroll',updateReadingProgress,{passive:true});
  addEventListener('blog-page-change',()=>{if(brand)brand.textContent=brand.dataset.signalWord||'black_nut';syncReadingProgress();syncMonitor();sync();});
  addEventListener('blog-intro-end',()=>{syncMonitor();sync();});
  syncReadingProgress();syncMonitor();sync();
})();
