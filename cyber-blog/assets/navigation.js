(() => {
  if(self!==top)return;
  // Keep desktop windows alive while the content page changes.
  for(const link of document.querySelectorAll('.header a,.os-dock a,footer a')){
    const href=link.getAttribute('href');
    if(href&&!href.startsWith('#'))link.href=new URL(href,location.href).href;
  }
  for(const asset of document.querySelectorAll('link[rel="icon"],link[rel="stylesheet"]'))asset.href=new URL(asset.getAttribute('href'),location.href).href;
  const page=url=>url.origin===location.origin&&(/\/posts\/[^/]+\.html$/.test(url.pathname)||/\/(index|about|recent)\.html$/.test(url.pathname)||url.pathname==='/');
  const article=url=>/\/posts\/[^/]+\.html$/.test(url.pathname);
  let sequence=0;
  function sourceParts(source){
    if(!source?.isConnected)return {};
    const shell=source.closest('.post-card,.category-post-link');
    if(!shell)return {};
    const title=shell.querySelector('h3,.category-file-name')||source;
    return {shell,title,mode:shell.matches('.category-post-link')?'category':'card'};
  }
  async function navigate(href,{replace=false,pop=false,source}={}){
    const url=new URL(href,location.href);
    if(!page(url)){location.assign(url.href);return false;}
    const request=++sequence;
    try{
      const response=await fetch(url.href,{cache:'no-cache'});
      if(!response.ok)throw Error('HTTP '+response.status);
      const next=new DOMParser().parseFromString(await response.text(),'text/html');
      const main=next.querySelector('main');if(!main||request!==sequence)return false;
      const opening=article(url)&&!pop;
      const shared=opening&&!!document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
      const origin=shared?sourceParts(source):{};
      const shell=origin.shell,title=origin.title;
      let targetShell,targetTitle;
      if(shared&&shell&&title){
        document.documentElement.classList.add('memo-from-'+origin.mode,'memo-transitioning');
        shell.style.viewTransitionName='memo-sheet';title.style.viewTransitionName='memo-title';
      }
      if(opening)main.classList.add('memo-entering');
      if(shared&&shell&&title)main.classList.add('memo-shared');
      const swap=()=>{
        if(!pop){if(replace)history.replaceState({blog:true},'',url.href);else history.pushState({blog:true},'',url.href);}
        document.title=next.title;
        document.body.dataset.base=next.body.dataset.base;
        for(const name of ['description','og:title','og:description','og:type','og:url','og:image','twitter:title','twitter:description','twitter:image']){
          const selector=name.startsWith('og:')?`meta[property="${name}"]`:`meta[name="${name}"]`;
          const current=document.querySelector(selector),incoming=next.querySelector(selector);
          if(current&&incoming)current.content=incoming.content;
        }
        const canonical=document.querySelector('link[rel="canonical"]'),nextCanonical=next.querySelector('link[rel="canonical"]');
        if(canonical&&nextCanonical)canonical.href=nextCanonical.href;
        const currentNav=document.querySelectorAll('.header nav a'),newNav=next.querySelectorAll('.header nav a');
        currentNav.forEach((link,i)=>{link.removeAttribute('aria-current');if(newNav[i]?.hasAttribute('aria-current'))link.setAttribute('aria-current',newNav[i].getAttribute('aria-current'));});
        if(shared&&shell&&title){
          targetShell=main.querySelector('.article-terminal');targetTitle=main.querySelector('.article-header h1');
          if(targetShell)targetShell.style.viewTransitionName='memo-sheet';
          if(targetTitle)targetTitle.style.viewTransitionName='memo-title';
        }
        document.querySelector('main').replaceWith(main);
        window.blogInitMain?.();
        dispatchEvent(new Event('blog-page-change'));
        if(url.hash)document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView();
        else scrollTo({top:0,behavior:'instant'});
      };
      if(shared&&shell&&title){
        const transition=document.startViewTransition(swap);
        transition.finished.catch(()=>{}).finally(()=>{
          shell.style.viewTransitionName='';title.style.viewTransitionName='';
          if(targetShell)targetShell.style.viewTransitionName='';
          if(targetTitle)targetTitle.style.viewTransitionName='';
          document.documentElement.classList.remove('memo-from-'+origin.mode,'memo-transitioning');
        });
        await transition.updateCallbackDone;
      }else swap();
      if(opening)setTimeout(()=>main.classList.remove('memo-entering','memo-shared'),1500);
      return true;
    }catch{location.assign(url.href);return false;}
  }
  // Falling-digit curtain for header navigation: cover the screen, swap the page, then uncover in the same direction.
  const curtain=(()=>{
    const alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',cell=18,line=22,trail=9,duration=550,spread=.45;
    let canvas,ctx,pattern,width=0,height=0,dpr=1,busy=false,bg,palette;
    const palettes={dark:{bg:'#06110d',dim:['#16412d','#2d7450'],trail:'#72eaa4',head:'#d8ffe8'},light:{bg:'#eef6f0',dim:['#cfe1d5','#a9c8b5'],trail:'#087649',head:'#04281a'}};
    const glyph=()=>alphabet[Math.random()*alphabet.length|0];
    function setup(){
      if(!canvas){
        canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
        canvas.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;display:none';
        document.body.append(canvas);ctx=canvas.getContext('2d');
      }
      palette=palettes[document.documentElement.dataset.theme==='light'?'light':'dark'];bg=palette.bg;
      dpr=Math.min(2,devicePixelRatio||1);width=innerWidth;height=innerHeight;
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
      pattern=document.createElement('canvas');pattern.width=canvas.width;pattern.height=canvas.height;
      const p=pattern.getContext('2d');p.scale(dpr,dpr);
      p.fillStyle=bg;p.fillRect(0,0,width,height);
      p.font='13px "IBM Plex Mono",monospace';p.textBaseline='top';
      for(let x=0;x<width;x+=cell)for(let y=0;y<height;y+=line){p.fillStyle=palette.dim[Math.random()>.8?1:0];p.fillText(glyph(),x+2,y+3);}
    }
    // dir: 'down' (top to bottom), 'left' (right to left), 'right' (left to right)
    function run(mode,dir){
      const vertical=dir==='down',size=vertical?cell:line,step=vertical?line:cell;
      const lanes=Math.ceil((vertical?width:height)/size),length=vertical?height:width;
      const delays=Array.from({length:lanes},()=>Math.random()*spread*duration),span=duration*(1-spread);
      const rect=(lane,from,to)=>dir==='down'?[lane*size,from,size,to-from]:dir==='left'?[width-to,lane*size,to-from,size]:[from,lane*size,to-from,size];
      return new Promise(resolve=>{
        const start=performance.now();
        const frame=now=>{
          const t=now-start;let done=true;
          ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
          ctx.font='600 15px "IBM Plex Mono",monospace';ctx.textBaseline='top';
          for(let lane=0;lane<lanes;lane++){
            const p=Math.min(1,Math.max(0,(t-delays[lane])/span));if(p<1)done=false;
            const edge=p*length,from=mode==='cover'?0:edge,to=mode==='cover'?edge:length;
            if(to>from){const [x,y,w,h]=rect(lane,from,to);ctx.drawImage(pattern,x*dpr,y*dpr,w*dpr,h*dpr,x,y,w,h);}
            if(p<=0||p>=1)continue;
            for(let k=0;k<trail;k++){
              const a=mode==='cover'?edge-(k+1)*step:edge+k*step;
              if(a<0||a+step>length)continue;
              const [x,y,w,h]=rect(lane,a,a+step);
              ctx.globalAlpha=1;ctx.fillStyle=bg;ctx.fillRect(x,y,w,h);
              ctx.globalAlpha=1-k/trail;ctx.fillStyle=k===0?palette.head:palette.trail;ctx.fillText(glyph(),x+2,y+3);
            }
            ctx.globalAlpha=1;
          }
          if(done)resolve();else requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
    }
    return {
      get busy(){return busy;},
      async go(dir,task){
        if(busy)return;busy=true;setup();
        canvas.style.display='block';canvas.style.pointerEvents='auto';
        try{await run('cover',dir);await task();}
        finally{await run('reveal',dir);canvas.style.display='none';canvas.style.pointerEvents='none';busy=false;}
      }
    };
  })();
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  function curtainDirection(link,url){
    if(reducedMotion.matches||!link.closest('.header'))return null;
    if(link.matches('.brand'))return 'down';
    if(/\/about\.html$/.test(url.pathname))return 'left';
    if(/\/(index\.html)?$/.test(url.pathname))return 'right';
    return null;
  }
  window.blogNavigate=navigate;
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download'))return;
    const url=new URL(link.href);if(!page(url)||url.pathname===location.pathname&&url.search===location.search&&url.hash)return;
    event.preventDefault();
    if(curtain.busy)return;
    const direction=curtainDirection(link,url);
    if(direction)curtain.go(direction,()=>navigate(url.href,{source:link}));else navigate(url.href,{source:link});
  });
  addEventListener('popstate',()=>{if(page(new URL(location.href)))navigate(location.href,{pop:true});});
})();
