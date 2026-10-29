(() => {
  if(self!==top)return;
  const root=document.documentElement;
  const home=()=>/\/(?:index\.html)?$/.test(location.pathname);
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  let playing=false,serial=0,abortCurrent;
  function start(){
    if(playing||!home()||location.hash==='#notes'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const screen=document.querySelector('.monitor-display'),content=screen?.querySelector('.monitor-overlay');
    if(!screen||!content){root.classList.remove('monitor-intro-pending');return;}
    playing=true;const run=++serial;
    root.classList.add('monitor-intro-pending');
    const target=screen.getBoundingClientRect(),originalStyle=screen.getAttribute('style');
    const originalContentStyle=content.getAttribute('style');
    const startLeft=innerWidth<700?'37%':'30%',contentScale=innerWidth<700?.25:.9;
    const cover=rect=>{
      const scale=Math.max(innerWidth/rect.width,innerHeight/rect.height);
      const left=(innerWidth-rect.width*scale)/2-rect.left;
      const top=(innerHeight-rect.height*scale)/2-rect.top;
      return `translate(${left}px,${top}px) scale(${scale})`;
    };
    const placeholder=document.createElement('div');placeholder.className='monitor-display monitor-intro-placeholder';placeholder.setAttribute('aria-hidden','true');
    screen.replaceWith(placeholder);document.body.append(screen);
    const expanded=cover(target);
    screen.classList.add('monitor-intro-screen');
    Object.assign(screen.style,{position:'fixed',left:target.left+'px',top:target.top+'px',width:target.width+'px',height:target.height+'px',transformOrigin:'top left',transform:expanded,zIndex:'60',willChange:'transform',pointerEvents:'none'});
    Object.assign(content.style,{left:startLeft,transform:`scale(${contentScale})`,transformOrigin:'bottom left',willChange:'left,transform'});
    const labels=[...content.children].map(element=>({element,plain:element.textContent,encoded:btoa(element.textContent)}));
    for(const label of labels)label.element.textContent=label.encoded;
    let animation,contentAnimation,cleaned=false;
    function cleanup(){
      if(cleaned)return;cleaned=true;
      animation?.cancel();contentAnimation?.cancel();
      for(const label of labels)label.element.textContent=label.plain;
      screen.classList.remove('monitor-intro-screen');
      if(originalStyle===null)screen.removeAttribute('style');else screen.setAttribute('style',originalStyle);
      if(originalContentStyle===null)content.removeAttribute('style');else content.setAttribute('style',originalContentStyle);
      if(placeholder.isConnected)placeholder.replaceWith(screen);else screen.remove();
      root.classList.remove('monitor-intro-pending','monitor-intro-shrinking');
      playing=false;abortCurrent=null;
      dispatchEvent(new Event('blog-intro-end'));
    }
    abortCurrent=()=>{serial++;cleanup();};
    const valid=()=>run===serial&&placeholder.isConnected;
    (async()=>{
      try{
        if(document.hidden)await new Promise(resolve=>{
          const visible=()=>{if(!document.hidden){document.removeEventListener('visibilitychange',visible);resolve();}};
          document.addEventListener('visibilitychange',visible);
        });
        await wait(400);if(!valid())return;
        const longest=Math.max(...labels.map(label=>label.plain.length));
        for(let i=1;i<=longest;i++){
          for(const label of labels){
            if(i>label.plain.length)continue;
            const blocks=Math.floor((i-1)/3)+1;
            label.element.textContent=label.plain.slice(0,i)+label.encoded.slice(blocks*4);
          }
          if(i<longest)await wait(110);
          if(!valid())return;
        }
        await wait(1200);if(!valid())return;
        const timing={duration:1200,easing:'cubic-bezier(.24,.7,.18,1)',fill:'forwards'};
        animation=screen.animate([{transform:expanded,borderRadius:'0px',borderColor:'transparent'},{transform:'translate(0px,0px) scale(1)',borderRadius:'8px',borderColor:'#3d7e5d'}],timing);
        contentAnimation=content.animate([{left:startLeft,transform:`scale(${contentScale})`},{left:'7%',transform:'scale(1)'}],timing);
        root.classList.remove('monitor-intro-pending');root.classList.add('monitor-intro-shrinking');
        await Promise.all([animation.finished,contentAnimation.finished]);
      }catch{}finally{cleanup();}
    })();
  }
  addEventListener('blog-page-change',()=>abortCurrent?.());
  document.addEventListener('click',event=>{
    const link=event.target.closest('a.monitor-scroll[href="#notes"]');
    if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const notes=document.querySelector('#notes');if(!notes)return;
    event.preventDefault();
    abortCurrent?.();
    if(location.hash!=='#notes')history.pushState(null,'','#notes');
    notes.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  });
  if(root.classList.contains('monitor-intro-pending'))start();
})();
