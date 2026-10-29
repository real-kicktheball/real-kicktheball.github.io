(() => {
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const excluded='script,style,noscript,textarea,input,svg,[hidden],.os-window,.os-dock,.category-post-link,.brand-signal,.monitor-device,.monitor-display,.text-reveal';
  const active=new Set(),waitingText=new Set(),waitingBlocks=new Set(),completedText=new WeakSet();let frame=0;
  const textObserver=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      const el=entry.target;textObserver.unobserve(el);waitingText.delete(el);
      fontsFor(el).then(()=>{active.add(el);if(!frame)frame=requestAnimationFrame(tick);});
    }
  });
  // 폰트 조각이 도착하기 전에 쓰기 시작하면 대체 글꼴로 그려진 글자가 나중에 바뀌므로 먼저 불러온다.
  function fontsFor(el){
    if(!document.fonts?.load)return Promise.resolve();
    const style=getComputedStyle(el),text=el.lastChild.textContent;
    const loading=document.fonts.load(`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,text).catch(()=>{});
    return Promise.race([loading,new Promise(resolve=>setTimeout(resolve,1500))]);
  }
  function tick(){
    for(const el of active){
      if(!el.isConnected){active.delete(el);continue;}
      const written=el.firstChild,remaining=el.lastChild.firstChild,code=remaining.data.codePointAt(0);
      if(code===undefined){finish(el);continue;}
      const char=String.fromCodePoint(code);
      written.appendData(char);remaining.deleteData(0,char.length);
      if(!remaining.length)finish(el);
    }
    frame=active.size?requestAnimationFrame(tick):0;
  }
  function finish(el){const text=el.firstChild;active.delete(el);completedText.add(text);el.replaceWith(text);}
  function wrap(node){
    if(completedText.has(node)||!node.parentElement||node.parentElement.closest(excluded)||node.parentElement.closest('.memo-entering .article-header h1')||!node.textContent.trim()||node.textContent.trim().length<2)return;
    const el=document.createElement('span');el.className='text-reveal';
    const written=document.createTextNode(''),remaining=document.createElement('span');
    remaining.className='text-reveal-remaining';remaining.textContent=node.textContent;
    el.append(written,remaining);node.replaceWith(el);waitingText.add(el);textObserver.observe(el);
  }
  function scanText(root){
    if(root.nodeType===Node.TEXT_NODE){wrap(root);return;}
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];let node;
    while(node=walker.nextNode())nodes.push(node);
    nodes.forEach(wrap);
  }
  const proseBlocks=new WeakSet();
  const proseObserver=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      const block=entry.target;proseObserver.unobserve(block);waitingBlocks.delete(block);
      block.removeAttribute('data-reveal-pending');scanText(block);
    }
  },{rootMargin:'200px 0px'});
  function scan(root){
    if(root.nodeType===Node.TEXT_NODE){if(!root.parentElement?.closest('.prose'))wrap(root);return;}
    if(root.nodeType!==Node.ELEMENT_NODE||root.closest(excluded))return;
    for(const prose of root.querySelectorAll('.prose'))for(const block of prose.children){
      if(!proseBlocks.has(block)){proseBlocks.add(block);block.dataset.revealPending='';waitingBlocks.add(block);proseObserver.observe(block);}
    }
    if(root.matches('.prose'))return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];let node;
    while(node=walker.nextNode())if(!node.parentElement.closest('.prose'))nodes.push(node);
    nodes.forEach(wrap);
  }
  scan(document.body);
  addEventListener('blog-page-change',()=>{
    for(const el of waitingText)if(!el.isConnected){textObserver.unobserve(el);waitingText.delete(el);}
    for(const block of waitingBlocks)if(!block.isConnected){proseObserver.unobserve(block);waitingBlocks.delete(block);}
    for(const el of active)if(!el.isConnected)active.delete(el);
  });
  new MutationObserver(records=>{
    for(const record of records){
      if(record.target.parentElement?.closest(excluded)||record.target.closest?.(excluded))continue;
      for(const node of record.addedNodes)scan(node);
    }
  }).observe(document.body,{childList:true,subtree:true});
})();
