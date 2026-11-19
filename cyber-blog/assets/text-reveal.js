(() => {
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const excluded='script,style,noscript,textarea,input,svg,[hidden],.os-window,.os-dock,.category-post-link,.brand-signal,.monitor-device,.monitor-display,.text-reveal,.ie-modal';
  const active=new Set(),waitingText=new Set(),waitingBlocks=new Set(),completedText=new WeakSet(),timing=new WeakMap();let frame=0;
  // 짧은 글은 한 프레임에 한 글자(약 60자/초), 긴 글은 화면에 들어온 뒤 최대 1.3초(폰트·관찰 지연 포함 1.5초 이내) 안에 끝나도록 속도를 올린다.
  const CHAR_MS=1000/60,MAX_MS=1300;
  const textObserver=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      const el=entry.target;textObserver.unobserve(el);waitingText.delete(el);
      const total=el.lastChild.textContent.length;timing.set(el,{start:performance.now(),total,duration:Math.min(total*CHAR_MS,MAX_MS)});
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
  function tick(now){
    for(const el of active){
      if(!el.isConnected){active.delete(el);continue;}
      const written=el.firstChild,remaining=el.lastChild.firstChild,t=timing.get(el);
      if(!remaining||!remaining.length||!t){finish(el);continue;}
      const done=t.total-remaining.length,progress=t.duration?Math.min(1,(now-t.start)/t.duration):1;
      let take=Math.max(1,Math.ceil(t.total*progress)-done);
      // 이모지 같은 서로게이트 쌍을 반으로 자르지 않는다.
      if(take<remaining.length){const c=remaining.data.charCodeAt(take-1);if(c>=0xD800&&c<=0xDBFF)take++;}
      written.appendData(remaining.data.slice(0,take));remaining.deleteData(0,take);
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
