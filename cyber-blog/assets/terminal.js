(() => {
  if(window.self!==window.top)return;
  const script=document.currentScript;
  const indexURL=new URL(script.dataset.index,location.href);
  const baseURL=new URL('./',indexURL);
  const launcher=document.querySelector('#terminal-launcher');

  const windows=[];let serial=0;
  let manifest;
  const loadManifest=()=>manifest??=fetch(indexURL).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).catch(error=>{manifest=null;throw error;});
  const saveAll=()=>{};
  function syncDock(){const visible=windows.some(w=>w.visible()),label=visible?'터미널 모두 감추기':windows.length?'터미널 복원':'터미널 열기';launcher.setAttribute('aria-expanded',String(visible));launcher.setAttribute('aria-label',label);launcher.title=label;launcher.classList.toggle('running',windows.length>0);launcher.querySelector('span').textContent='터미널'+(windows.length?' · '+windows.length:'');}
  function front(w){const i=windows.indexOf(w);if(i>=0){windows.splice(i,1);windows.push(w);}windows.forEach(v=>{window.blogWindowZ=(window.blogWindowZ||100)+1;v.shell.style.zIndex=window.blogWindowZ;});}
  launcher.addEventListener('click',()=>{if(!windows.length){createWindow({opened:true});return;}const show=!windows.some(w=>w.visible());[...windows].forEach(w=>w.show(show));saveAll();});
  document.querySelectorAll('[data-open-terminal]').forEach(b=>b.addEventListener('click',()=>{if(!windows.length)createWindow({opened:true});else windows.at(-1).show(true);saveAll();}));
  window.addEventListener('resize',()=>[...windows].forEach(w=>w.clamp()));
  async function createWindow(state={}){
  const id=++serial;
  const shell=document.createElement('section');
  shell.className='terminal os-window';shell.setAttribute('aria-label','black_nut 블로그 터미널');
  shell.innerHTML='<div class="terminal-bar os-titlebar"><div class="window-controls"><button class="window-close" aria-label="터미널 닫기" title="닫기">×</button><button class="window-minimize" aria-label="터미널 최소화" title="최소화">−</button><button class="window-maximize" aria-label="터미널 확대 또는 복원" title="확대 / 복원">+</button></div><span>black_nut — blog shell</span><button class="window-new" aria-label="새 터미널 열기" title="새 터미널 열기">⋮</button></div><div class="terminal-content terminal-scroll" tabindex="0" aria-label="터미널 출력 영역"><div class="terminal-output" role="log" aria-live="polite" aria-relevant="additions"><p class="terminal-comment">기록을 불러오고 있습니다...</p></div><form class="terminal-form" autocomplete="off"><label class="terminal-prompt accent">~ $</label><div class="terminal-entry"><input class="terminal-input" aria-label="터미널 명령어" placeholder="help" spellcheck="false" autocorrect="off" autocapitalize="off" autocomplete="off" maxlength="1000" enterkeyhint="send"><button type="submit" aria-label="명령어 실행">↵</button></div></form></div><div class="terminal-hints"><button type="button" data-command="help">help</button><button type="button" data-command="ls">ls</button><button type="button" data-command="cd ~">cd ~</button><button type="button" data-command="clear">clear</button><span>↑ ↓ history · Tab complete</span></div>';
  shell.querySelector('.terminal-input').id='shell-input-'+id;
  shell.querySelector('.terminal-prompt').htmlFor='shell-input-'+id;
  document.body.appendChild(shell);
  let opened=state.opened!==false,maximized=!!state.maximized,rect=state.rect;
  function clampRect(){
    const currentZ=shell.style.zIndex;
    const width=Math.min(rect?.width||480,innerWidth-24),height=Math.min(rect?.height||430,innerHeight-100);
    const left=Math.max(12,Math.min(rect?.left??innerWidth-width-24,innerWidth-width-12));
    const top=Math.max(12,Math.min(rect?.top??innerHeight-height-94,innerHeight-height-94));
    rect={width,height,left,top};
    if(maximized){shell.style.cssText=`width:${innerWidth-24}px;height:${innerHeight-100}px;left:12px;top:12px`;}
    else shell.style.cssText=`width:${width}px;height:${height}px;left:${left}px;top:${top}px`;
    shell.classList.toggle('maximized',maximized);shell.style.zIndex=currentZ||80+windows.findIndex(w=>w.shell===shell);
  }
  let snapshot=()=>({...state,opened,maximized,rect});
  const handle={shell,visible:()=>opened,snapshot:()=>snapshot(),clamp:()=>{clampRect();front(handle);},show:value=>{opened=value;visibility(value);}};
  windows.push(handle);
  function visibility(focus=false,initial=false){
    const wasHidden=shell.hidden,animating=shell.classList.contains('window-motion-active');
    if(opened){
      shell.hidden=false;
      if(!initial&&(wasHidden||animating))window.blogWindowMotion?.(shell,launcher,'restore');
    }else if(initial)shell.hidden=true;
    else if(!wasHidden)(window.blogWindowMotion?.(shell,launcher,'minimize')||Promise.resolve()).then(()=>{if(!opened)shell.hidden=true;});
    syncDock();if(focus){front(handle);shell.querySelector('.terminal-input').focus({preventScroll:true});}
  }
  const persist=()=>saveAll();
  clampRect();front(handle);visibility(false,true);
  if(id===1&&opened)window.blogWindowMotion?.(shell,launcher,'restore');
  shell.addEventListener('pointerdown',()=>front(handle));
  shell.querySelector('.window-new').addEventListener('click',()=>createWindow({opened:true,cwd:snapshot().cwd,rect:{...rect,left:rect.left+32,top:rect.top+32}}));
  shell.querySelector('.window-close').addEventListener('click',()=>{observer.disconnect();clearTimeout(sizeTimer);shell.remove();windows.splice(windows.indexOf(handle),1);syncDock();persist();launcher.focus({preventScroll:true});});
  shell.querySelector('.window-minimize').addEventListener('click',()=>{opened=false;visibility();persist();launcher.focus({preventScroll:true});});
  const maximize=()=>{maximized=!maximized;clampRect();front(handle);persist();};
  shell.querySelector('.window-maximize').addEventListener('click',maximize);
  const titlebar=shell.querySelector('.os-titlebar');titlebar.addEventListener('dblclick',e=>{if(!e.target.closest('button'))maximize();});
  let drag=null;
  titlebar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||maximized)return;const r=shell.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};titlebar.setPointerCapture(e.pointerId);e.preventDefault();});
  titlebar.addEventListener('pointermove',e=>{if(!drag)return;rect={...rect,left:e.clientX-drag.x,top:e.clientY-drag.y};clampRect();});
  titlebar.addEventListener('pointerup',()=>{drag=null;persist();});titlebar.addEventListener('pointercancel',()=>{drag=null;persist();});
  let sizeTimer;
  const observer=new ResizeObserver(()=>{clearTimeout(sizeTimer);sizeTimer=setTimeout(()=>{if(!maximized&&!shell.hidden&&!shell.classList.contains('window-motion-active')){const r=shell.getBoundingClientRect();rect={width:r.width,height:r.height,left:r.left,top:r.top};persist();}},150);});observer.observe(shell);
  const form = shell.querySelector('.terminal-form');
  let data;
  try{data=await loadManifest();}
  catch{shell.querySelector('.terminal-output').textContent='기록을 불러오지 못했습니다. 네트워크 연결 후 페이지를 새로고침해 주세요.';form.hidden=true;return;}
  const input = shell.querySelector('.terminal-input');
  const output = shell.querySelector('.terminal-output');
  const prompt = shell.querySelector('.terminal-prompt');
  const scroll = shell.querySelector('.terminal-scroll');
  const home = '/home/' + data.nickname;
  const nodes = new Map([
    ['/', {type:'dir'}], ['/home', {type:'dir'}], [home, {type:'dir',url:'index.html'}],
    [home+'/about.txt', {type:'file',text:data.about,url:'about.html'}],
    [home+'/interests.json', {type:'file',text:JSON.stringify({focus:['knights frontier'],mindset:'stay curious'},null,2)}],
    [home+'/README.md', {type:'file',text:'# '+data.nickname+'\n\nls → 카테고리와 파일 목록\ncd development → 개발 폴더로 이동\ncat 파일명.md → 글 읽기\nopen 파일명.md → 본문 페이지 열기\ncd .. → 상위 폴더\ncd ~ → 홈 폴더\nTab → 경로 자동완성\n↑ ↓ → 이전 명령어'}]
  ]);
  for (const d of data.dirs) nodes.set(home+'/'+d.path, {type:'dir',title:d.title,url:d.url});
  for (const p of data.posts) nodes.set(home+'/'+p.path, {type:'file',title:p.title,source:'terminal-content/'+p.slug+'.txt',url:'posts/'+p.slug+'.html'});
  let cwd=nodes.get(state.cwd)?.type==='dir'?state.cwd:home, previous=nodes.get(state.previous)?.type==='dir'?state.previous:home, history=Array.isArray(state.history)?state.history.filter(h=>typeof h==='string').slice(-100):[], cursor=history.length, draft='';
  const commands=['help','ls','cd','pwd','cat','open','whoami','clear','echo','date','history'];
  const display = p => p===home?'~':p.startsWith(home+'/')?'~'+p.slice(home.length):p;
  function resolve(value='.') {
    if(value==='~')value=home;
    else if(value.startsWith('~/'))value=home+value.slice(1);
    const parts=(value.startsWith('/')?value:cwd+'/'+value).split('/');
    const result=[];
    for(const part of parts){if(!part||part==='.')continue;if(part==='..')result.pop();else result.push(part);}
    return '/'+result.join('/');
  }
  function animateText(element,text){
    const full=String(text);element.dataset.fullText=full;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){element.textContent=full;return;}
    let cursor=0;const started=performance.now();element.classList.add('typing');
    function reveal(){
      if(!element.isConnected)return;
      const count=Math.max(1,Math.ceil(full.length/32))+Math.floor(Math.random()*3);
      const next=performance.now()-started>650?full.length:Math.min(full.length,cursor+count);
      element.append(document.createTextNode(full.slice(cursor,next)));cursor=next;
      if(scroll.scrollHeight-scroll.scrollTop-scroll.clientHeight<180)scroll.scrollTop=scroll.scrollHeight;
      if(cursor<full.length)setTimeout(reveal,12+Math.random()*14);else element.classList.remove('typing');
    }
    reveal();
  }
  function print(text,cls='shell-result',animate=true){const p=document.createElement('pre');p.className=cls;output.appendChild(p);if(animate)animateText(p,text);else{p.textContent=String(text);p.dataset.fullText=String(text);}}
  function typeBootLine(text,cls){
    return new Promise(resolve=>{
      const p=document.createElement('pre'),chars=Array.from(text);p.className=cls+' typing';p.dataset.fullText=text;output.appendChild(p);
      let index=0;
      function next(){
        if(!shell.isConnected){resolve();return;}
        if(index===chars.length){p.classList.remove('typing');resolve();return;}
        p.append(document.createTextNode(chars[index++]));
        scroll.scrollTop=scroll.scrollHeight;
        setTimeout(next,18);
      }
      next();
    });
  }
  function children(dir) {const prefix=dir==='/'?'/':dir+'/';return [...nodes.keys()].filter(k=>k.startsWith(prefix)&&k!==dir&&!k.slice(prefix.length).includes('/'));}
  function tokenize(line) {
    const tokens=[];let token='',quote=null,started=false;
    for(const char of line){if(quote){if(char===quote)quote=null;else token+=char;started=true;}else if(char==='"'||char==="'"){quote=char;started=true;}else if(/\s/.test(char)){if(started){tokens.push(token);token='';started=false;}}else{token+=char;started=true;}}
    if(quote)throw Error('따옴표를 닫아 주세요.');if(started)tokens.push(token);return tokens;
  }
  function list(target) {
    const p=resolve(target),node=nodes.get(p);if(!node)throw Error('경로를 찾을 수 없습니다: '+target);
    const paths=node.type==='dir'?children(p):[p];
    if(!paths.length){print('아직 기록이 없습니다.');return;}
    const list=document.createElement('div');list.className='shell-files';
    for(const file of paths){const n=nodes.get(file),button=document.createElement('button');button.type='button';button.className=n.type==='dir'?'shell-dir':'shell-file';button.textContent=file.split('/').pop()+(n.type==='dir'?'/':'')+(n.title?' — '+n.title:'');button.title=n.title||button.textContent;button.addEventListener('click',()=>run((n.type==='dir'?'cd ':'cat ')+JSON.stringify(file)));list.appendChild(button);}
    list.dataset.fullText=[...list.children].map(e=>e.dataset.fullText).join('\n');output.appendChild(list);for(const button of list.children)animateText(button,button.dataset.fullText);
  }
  let busy=false,booting=false;
  async function run(line) {
    if(busy||booting)return;
    if(!line.trim())return;
    busy=true;input.disabled=true;
    print(display(cwd)+' $ '+line,'shell-command');history.push(line);if(history.length>100)history.shift();cursor=history.length;draft='';
    try{
      const [cmd,...args]=tokenize(line), arg=args[0];
      if(!['echo','cat'].includes(cmd)&&args.length>1)throw Error('인수가 너무 많습니다. help로 사용법을 확인하세요.');
      switch(cmd){
        case 'help':print('블로그 탐색 명령어\n\nls [경로]       폴더·글 목록 (클릭 가능)\ncd [경로]       폴더 이동: .. / ~ / - 지원\npwd             현재 경로\ncat 파일        파일·글 내용 읽기\nopen [경로]     글·카테고리 페이지 열기\nwhoami          닉네임\nclear           화면 지우기\necho 내용       입력한 내용 출력\ndate            현재 날짜와 시간\nhistory         명령어 기록\n\n예: cd development → ls → cat 파일명.md\n↑ ↓ 이전 명령어 · Tab 자동완성 · Ctrl+L 지우기');break;
        case 'ls':list(arg||'.');break;
        case 'pwd':print(cwd);break;
        case 'whoami':print(data.nickname);break;
        case 'cd':{const next=arg==='-'?previous:resolve(arg||'~');if(nodes.get(next)?.type!=='dir')throw Error('폴더를 찾을 수 없습니다: '+(arg||'~'));previous=cwd;cwd=next;if(arg==='-')print(display(cwd));break;}
        case 'cat':if(!args.length)throw Error('사용법: cat 파일명');for(const name of args){const n=nodes.get(resolve(name));if(!n)throw Error('파일을 찾을 수 없습니다: '+name);if(n.type!=='file')throw Error('폴더입니다. ls를 사용하세요: '+name);if(n.source&&n.text===undefined){const r=await fetch(new URL(n.source,baseURL));if(!r.ok)throw Error('글을 불러오지 못했습니다. 다시 시도하세요.');n.text=await r.text();}print(n.text);}break;
        case 'open':{const n=nodes.get(resolve(arg||'.'));if(!n?.url)throw Error('연결된 페이지가 없습니다. ls로 경로를 확인하세요.');persist();const target=new URL(n.url,baseURL);if(window.blogNavigate)await window.blogNavigate(target);else location.assign(target);break;}
        case 'clear':output.replaceChildren();break;
        case 'echo':print(args.join(' '));break;
        case 'date':print(new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})+' KST');break;
        case 'history':print(history.map((h,i)=>`${i+1}  ${h}`).join('\n'));break;
        default:print('명령어를 찾을 수 없습니다: '+cmd+'\nhelp로 지원 명령어를 확인하세요.','shell-error');
      }
    }catch(e){print(e.message,'shell-error');}
    while(output.children.length>160)output.firstElementChild.remove();
    busy=false;input.disabled=false;prompt.textContent=display(cwd)+' $';input.value='';input.focus({preventScroll:true});scroll.scrollTop=scroll.scrollHeight;persist();
  }
  output.replaceChildren();
  if(state.transcript)print(String(state.transcript).slice(-60000),'shell-result',false);
  else{
    booting=true;
    input.disabled=true;
    (async()=>{
      for(const [line,cls] of [
        ['Welcome to '+data.nickname+'’s space.\nhelp로 명령어를, ls로 기록을 둘러보세요.','terminal-comment'],
        ['~ $ whoami','shell-command'],
        [data.nickname+'\n// build. break. understand.','shell-result']
      ]){
        if(!shell.isConnected)return;
        await typeBootLine(line,cls);
      }
      booting=false;
      input.disabled=false;
      if(opened)input.focus({preventScroll:true});
    })();
  }
  prompt.textContent=display(cwd)+' $';
  snapshot=()=>({opened,maximized,rect,cwd,previous,history,transcript:[...output.children].map(e=>e.dataset.fullText??e.textContent).join('\n').slice(-60000)});
  persist();

  form.addEventListener('submit',event=>{event.preventDefault();run(input.value);});
  shell.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>run(button.dataset.command)));
  input.addEventListener('keydown',event=>{
    if(event.key==='ArrowUp'){event.preventDefault();if(cursor===history.length)draft=input.value;cursor=Math.max(0,cursor-1);input.value=history[cursor]||'';}
    else if(event.key==='ArrowDown'){event.preventDefault();cursor=Math.min(history.length,cursor+1);input.value=cursor===history.length?draft:history[cursor];}
    else if(event.ctrlKey&&event.key.toLowerCase()==='l'){event.preventDefault();output.replaceChildren();persist();}
    else if(event.key==='Tab'&&!event.shiftKey){
      const line=input.value;
      // An empty entry retains normal Tab focus navigation.
      if(!line.trim())return;
      event.preventDefault();
      if(!line.includes(' ')){const matches=commands.filter(c=>c.startsWith(line));if(matches.length===1)input.value=matches[0]+' ';else if(matches.length)print(matches.join('  '));}
      else{
        const split=line.lastIndexOf(' '),partial=line.slice(split+1);
        const slash=partial.lastIndexOf('/'),dir=slash<0?'.':partial.slice(0,slash+1),stem=slash<0?partial:partial.slice(slash+1);
        const matches=children(resolve(dir)).filter(p=>p.split('/').pop().startsWith(stem));
        if(matches.length===1){const name=matches[0].split('/').pop();input.value=line.slice(0,split+1)+(slash<0?'':dir)+name+(nodes.get(matches[0]).type==='dir'?'/':'');}
        else if(matches.length)print(matches.map(p=>p.split('/').pop()).join('\n'));
      }
      scroll.scrollTop=scroll.scrollHeight;
    }
  });
  }
  syncDock();
})();
