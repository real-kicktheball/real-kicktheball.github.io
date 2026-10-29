(() => {
  if(self!==top)return;
  const script=document.currentScript,assetURL=new URL(script.src),base=new URL('../',assetURL),version=assetURL.search;
  const launcher=document.querySelector('.os-dock>a[href$="archive.html"]');
  const archiveURL=new URL('archive.html',base).href;
  function safeURL(value){try{const next=new URL(value,base);return next.origin===location.origin&&next.pathname.endsWith('.html')?next.href:archiveURL;}catch{return archiveURL;}}
  let opened=false,minimized=false,maximized=false,rect,url=archiveURL;
  let direct=!!document.querySelector('main .file-explorer');if(direct){opened=true;minimized=false;url=location.href;document.body.classList.add('explorer-desktop');}
  addEventListener('blog-page-change',()=>{direct=!!document.querySelector('main .file-explorer');document.body.classList.toggle('explorer-desktop',direct);});
  const shell=document.createElement('section');shell.className='os-window file-window';shell.setAttribute('aria-label','파일 탐색기 창');
  shell.innerHTML='<div class="terminal-bar os-titlebar"><div class="window-controls"><button class="window-close" aria-label="파일 탐색기 닫기" title="닫기">×</button><button class="window-minimize" aria-label="파일 탐색기 감추기" title="감추기">−</button><button class="window-maximize" aria-label="파일 탐색기 최대화 또는 복원" title="최대화 / 복원">+</button></div><span class="file-window-name">▰ 파일 탐색기</span></div><div class="file-window-viewport"><iframe title="블로그 파일과 폴더" loading="eager"></iframe></div>';
  document.body.append(shell);const viewport=shell.querySelector('.file-window-viewport');let iframe=viewport.querySelector('iframe'),pending=null,navigation=0;
  function save(){}
  function raise(){window.blogWindowZ=(window.blogWindowZ||100)+1;shell.style.zIndex=window.blogWindowZ;}
  function geometry(){const width=Math.min(rect?.width||1180,innerWidth-24),height=Math.min(rect?.height||740,innerHeight-100);rect={width,height,left:Math.max(12,Math.min(rect?.left??(innerWidth-width)/2,innerWidth-width-12)),top:Math.max(12,Math.min(rect?.top??55,innerHeight-height-90))};Object.assign(shell.style,{width:(maximized?innerWidth-24:rect.width)+'px',height:(maximized?innerHeight-100:rect.height)+'px',left:(maximized?12:rect.left)+'px',top:(maximized?12:rect.top)+'px'});shell.classList.toggle('maximized',maximized);}
  function bindFrame(frame){
    try{
      if(frame.contentWindow.location.href==='about:blank')return;
      const doc=frame.contentDocument,title=doc.querySelector('.explorer-path')?.textContent||doc.title;
      shell.querySelector('.file-window-name').textContent='▰ '+title.trim();
      doc.addEventListener('pointerdown',raise);
      doc.addEventListener('click',event=>{
        const link=event.target.closest('a');
        if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download'))return;
        const next=new URL(link.href);if(next.origin!==location.origin||next.pathname===frame.contentWindow.location.pathname&&next.hash)return;
        event.preventDefault();
        if(/\/posts\/[^/]+\.html$/.test(next.pathname)&&window.blogNavigate){
          show(false,'article').then(()=>window.blogNavigate(next.href));
        }
        else navigate(next.href);
      },true);
      url=frame.contentWindow.location.href;save();
    }catch{}
  }
  function navigate(href){
    const next=new URL(href,base);if(next.origin!==location.origin)return;
    next.search=version;url=next.href;save();
    if(!iframe.getAttribute('src')){iframe.src=url;return;}
    if(pending)pending.remove();
    const current=++navigation,ready=document.createElement('iframe');ready.title='블로그 파일과 폴더';ready.loading='eager';ready.className='file-window-next';pending=ready;viewport.append(ready);
    ready.addEventListener('load',()=>{
      if(current!==navigation||ready!==pending)return;
      bindFrame(ready);
      const previous=iframe;
      const settle=()=>{if(current!==navigation||ready!==pending)return;previous.remove();iframe=ready;pending=null;ready.classList.remove('file-window-next','file-window-ready');};
      ready.addEventListener('transitionend',e=>{if(e.propertyName==='opacity')settle();},{once:true});
      requestAnimationFrame(()=>{if(current===navigation&&ready===pending)ready.classList.add('file-window-ready');});
      setTimeout(settle,450);
    },{once:true});
    ready.src=url;
  }
  function show(value,reason='toggle'){
    const wasOpened=opened;opened=value;
    if(value||reason==='close')minimized=false;else if(reason!=='initial')minimized=true;
    let motion=Promise.resolve();
    if(opened){
      shell.hidden=false;
      if(!wasOpened&&reason!=='initial')motion=window.blogWindowMotion?.(shell,launcher,'restore')||motion;
      if(!iframe.getAttribute('src'))navigate(safeURL(url));raise();
    }else if(reason==='close'||reason==='initial'||!wasOpened)shell.hidden=true;
    else motion=(window.blogWindowMotion?.(shell,launcher,'minimize')||motion).then(()=>{if(!opened)shell.hidden=true;});
    launcher?.classList.toggle('running',opened||minimized);launcher?.setAttribute('aria-expanded',String(opened));
    const label=opened?'파일탐색기 내리기':minimized?'파일탐색기 복원':'파일탐색기 열기';launcher?.setAttribute('aria-label',label);launcher?.setAttribute('title',label);
    const caption=launcher?.querySelector('span');if(caption)caption.textContent=minimized?'파일탐색기 · 1':'파일탐색기';save();return motion;
  }
  document.addEventListener('click',e=>{if(e.target.closest('a')!==launcher||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();show(!opened).then(()=>{if(direct&&!opened)location.replace(new URL('index.html#notes',base));});});
  shell.querySelector('.window-close').addEventListener('click',()=>{show(false,'close');navigation++;viewport.replaceChildren();iframe=document.createElement('iframe');iframe.title='블로그 파일과 폴더';iframe.loading='eager';viewport.append(iframe);iframe.addEventListener('load',()=>bindFrame(iframe));pending=null;url=archiveURL;rect=undefined;maximized=false;geometry();save();if(direct)location.replace(new URL('index.html#notes',base));else launcher?.focus({preventScroll:true});});
  shell.querySelector('.window-minimize').addEventListener('click',()=>{show(false).then(()=>{if(direct)location.replace(new URL('index.html#notes',base));});launcher?.focus({preventScroll:true});});
  const maximize=()=>{maximized=!maximized;geometry();save();};shell.querySelector('.window-maximize').addEventListener('click',maximize);
  const bar=shell.querySelector('.os-titlebar');bar.addEventListener('dblclick',e=>{if(!e.target.closest('button'))maximize();});shell.addEventListener('pointerdown',raise);
  let drag=null;
  bar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||maximized)return;const r=shell.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};bar.setPointerCapture(e.pointerId);viewport.style.pointerEvents='none';e.preventDefault();});
  bar.addEventListener('pointermove',e=>{if(!drag)return;rect={...rect,left:e.clientX-drag.x,top:e.clientY-drag.y};geometry();});
  const finish=()=>{drag=null;viewport.style.pointerEvents='';save();};bar.addEventListener('pointerup',finish);bar.addEventListener('pointercancel',finish);
  iframe.addEventListener('load',()=>bindFrame(iframe));
  let timer;new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!maximized&&!shell.hidden&&!shell.classList.contains('window-motion-active')){const r=shell.getBoundingClientRect();rect={left:r.left,top:r.top,width:r.width,height:r.height};save();}},150);}).observe(shell);
  addEventListener('resize',()=>{geometry();save();});geometry();show(opened,'initial');
})();
