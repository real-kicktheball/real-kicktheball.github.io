const assetQuery=new URL(document.currentScript.src).search;
const themeButton = document.querySelector('.theme');
const themeIcons = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>'
};
function updateThemeLabel() {
  const light = document.documentElement.dataset.theme === 'light';
  themeButton.innerHTML = light ? themeIcons.moon : themeIcons.sun;
  themeButton.setAttribute('aria-label', light ? '어두운 테마로 전환' : '밝은 테마로 전환');
}
updateThemeLabel();
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  for(const frame of document.querySelectorAll('.file-window iframe'))try{frame.contentDocument.documentElement.dataset.theme=next;}catch{}
  updateThemeLabel();
});
// Expand the home page categories in place, loading article links only when needed.
let sidebarIndexPromise;
function typeFileName(name,delay){
  const chars=Array.from(name.querySelector('.category-file-space').textContent),typed=name.querySelector('.category-file-typed');
  let position=0;
  function write(){
    if(!name.isConnected)return;
    typed.textContent+=chars[position++];
    if(position<chars.length)setTimeout(write,55);
    else name.dataset.typed='true';
  }
  setTimeout(write,delay);
}
const waitingNames=new Set();
const fileTypingObserver=new IntersectionObserver(entries=>{
  entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.target.compareDocumentPosition(b.target)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1).forEach((entry,i)=>{fileTypingObserver.unobserve(entry.target);waitingNames.delete(entry.target);typeFileName(entry.target,i*80);});
},{rootMargin:'0px 0px 60px 0px'});
addEventListener('blog-page-change',()=>{for(const name of waitingNames)if(!name.isConnected){fileTypingObserver.unobserve(name);waitingNames.delete(name);}});
function initSidebar(root=document){for(const folder of root.querySelectorAll('.sidebar .category-menu,.sidebar .category-folder')){
  const load=async()=>{
    if(!folder.open)return;
    const list=folder.querySelector(':scope > .category-submenu > .category-posts');
    if(!list||list.dataset.loaded)return;
    list.dataset.loaded='loading';
    try{
      const base=new URL(document.body.dataset.base,location.href);
      sidebarIndexPromise??=fetch(new URL('search-index.json'+assetQuery,base)).then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{sidebarIndexPromise=null;throw e;});
      const index=await sidebarIndexPromise,parts=JSON.parse(list.dataset.section);
      list.replaceChildren();
      const links=index.filter(p=>p.category===list.dataset.category&&p.section.length===parts.length&&parts.every((part,i)=>p.section[i]===part));
      const activePost=list.closest('.sidebar')?.dataset.activePost,activeIndex=links.findIndex(p=>p.slug===activePost);
      if(activeIndex>=40)links.unshift(links.splice(activeIndex,1)[0]);
      const more=document.createElement('button');more.type='button';more.className='category-more';
      let cursor=0,activeLink;
      const appendBatch=()=>{
        const fragment=document.createDocumentFragment(),newNames=[];
        for(const post of links.slice(cursor,cursor+40)){
          const a=document.createElement('a');a.className='category-post-link';a.href=new URL('posts/'+post.slug+'.html',base);a.setAttribute('aria-label',post.title);
          if(post.slug===activePost){a.classList.add('current');a.setAttribute('aria-current','page');activeLink=a;}
          const icon=document.createElement('span'),name=document.createElement('span'),space=document.createElement('span'),typed=document.createElement('span'),kind=document.createElement('small');
          icon.className='category-file-icon';icon.setAttribute('aria-hidden','true');icon.textContent='▤';name.className='category-file-name';space.className='category-file-space';space.setAttribute('aria-hidden','true');space.textContent=post.title;typed.className='category-file-typed';name.append(space,typed);kind.className='category-file-kind';kind.textContent='글';a.append(icon,name,kind);fragment.append(a);newNames.push(name);
        }
        cursor=Math.min(cursor+40,links.length);list.insertBefore(fragment,more);
        more.hidden=cursor>=links.length;more.textContent=`다음 파일 보기 (${cursor}/${links.length})`;
        for(const name of newNames){if(matchMedia('(prefers-reduced-motion: reduce)').matches)name.querySelector('.category-file-typed').textContent=name.querySelector('.category-file-space').textContent;else{waitingNames.add(name);fileTypingObserver.observe(name);}}
      };
      more.addEventListener('click',appendBatch);list.append(more);appendBatch();
      if(activeLink)requestAnimationFrame(()=>{list.scrollTop=Math.max(0,activeLink.offsetTop-list.offsetTop-list.clientHeight/2);});
      list.dataset.loaded='true';
    }catch{list.dataset.loaded='';list.textContent='목록을 불러오지 못했습니다. 다시 펼쳐 주세요.';}
  };
  folder.addEventListener('toggle',load);
  if(folder.open)load();
}}
document.addEventListener('click',event=>{
  const link=event.target.closest('[data-sidebar-target]');if(!link)return;
  const target=document.getElementById(link.dataset.sidebarTarget);if(!target)return;
  event.preventDefault();
  for(let parent=target;parent;parent=parent.parentElement?.closest('details'))if(parent.tagName==='DETAILS')parent.open=true;
  const cue=target.matches('details')?target.querySelector(':scope > summary'):target.matches('.sidebar')?target.querySelector('.category-menu[open] > summary')||target.querySelector('.category-menu > summary')||target:target;
  cue.classList.remove('category-cue');void cue.offsetWidth;cue.classList.add('category-cue');
  cue.addEventListener('animationend',()=>cue.classList.remove('category-cue'),{once:true});
  setTimeout(()=>cue.classList.remove('category-cue'),1600);
  target.scrollIntoView({behavior:'smooth',block:'start'});
});
let searchKeyHandler;
function initSearch(root=document){
  if(searchKeyHandler)document.removeEventListener('keydown',searchKeyHandler);
  searchKeyHandler=null;
  const search=root.querySelector('#search');if(!search)return;
  const section=root.querySelector('.archive-section'),grid=section.querySelector('.post-grid'),empty=section.querySelector('.empty'),count=section.querySelector('.result-count'),pagination=section.querySelector('.pagination'),more=section.querySelector('.search-more');
  const initial={html:grid.innerHTML,count:count.textContent,empty:empty.hidden};
  const base=new URL(document.body.dataset.base,location.href),scope=JSON.parse(section.dataset.section||'[]');
  let indexPromise,bodyPromise,sequence=0,matches=[],shown=0;
  const loadIndex=()=>indexPromise??=fetch(new URL('search-index.json'+assetQuery,base)).then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{indexPromise=null;throw e;});
  const loadBodies=()=>bodyPromise??=fetch(new URL('search-body-index.json'+assetQuery,base)).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>Object.fromEntries(Object.entries(data).map(([slug,body])=>[slug,body.toLocaleLowerCase().normalize('NFC')]))).catch(e=>{bodyPromise=null;throw e;});
  const element=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  function appendResults(){
    const end=Math.min(shown+24,matches.length);
    for(const p of matches.slice(shown,end)){
      const card=element('article','post-card'+(section.classList.contains('file-explorer')?' file-row':'')),meta=element('div','post-meta'),title=element('h3',''),link=element('a','',p.title),time=element('time','',p.date.replaceAll('-','.'));
      time.dateTime=p.date;meta.append(element('span','badge',p.categoryName));link.href=new URL('posts/'+p.slug+'.html',base);title.append(link);
      if(section.classList.contains('file-explorer'))card.append(element('span','file-icon','≡'),title,time,element('span','file-kind','Markdown'));
      else card.append(meta,title,element('p','post-preview',p.summary));
      grid.append(card);
    }
    shown=end;more.hidden=shown>=matches.length;more.textContent=`검색 결과 더 보기 (${shown}/${matches.length})`;
  }
  search.addEventListener('input',async()=>{
    const request=++sequence,query=search.value.trim().toLocaleLowerCase().normalize('NFC');
    if(!query){grid.innerHTML=initial.html;count.textContent=initial.count;empty.hidden=initial.empty;pagination.hidden=false;more.hidden=true;return;}
    count.textContent='검색 중...';pagination.hidden=true;more.hidden=true;
    try{
      await new Promise(resolve=>setTimeout(resolve,140));if(request!==sequence)return;
      const [index,bodies]=await Promise.all([loadIndex(),loadBodies()]);if(request!==sequence)return;
      const titleMatches=[],contentMatches=[];
      for(const p of index){
        if((section.dataset.category&&p.category!==section.dataset.category)||!scope.every((s,i)=>p.section[i]===s))continue;
        if(p.title.toLocaleLowerCase().normalize('NFC').includes(query))titleMatches.push(p);
        else if(p.summary.toLocaleLowerCase().normalize('NFC').includes(query)||bodies[p.slug]?.includes(query))contentMatches.push(p);
      }
      matches=titleMatches.concat(contentMatches);
      grid.replaceChildren();shown=0;appendResults();count.textContent=`${matches.length}개의 검색 결과`;empty.hidden=matches.length!==0;
      empty.querySelector('h3').textContent='검색 결과가 없습니다.';empty.querySelector('p').textContent='다른 검색어로 찾아보세요.';
    }catch{if(request===sequence)count.textContent='검색 자료를 불러오지 못했습니다. 다시 입력해 주세요.';}
  });
  more.addEventListener('click',appendResults);
  searchKeyHandler=event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) { event.preventDefault(); search.focus(); }
    if (event.key === 'Escape' && document.activeElement === search) { search.value = ''; search.dispatchEvent(new Event('input')); search.blur(); }
  };
  document.addEventListener('keydown',searchKeyHandler);
}
window.blogInitMain=()=>{const main=document.querySelector('main');initSidebar(main);initSearch(main);};
window.blogInitMain();

// Disable browser selection/clipboard gestures; normal typed input still works.
for(const type of ['copy','cut','paste','dragstart','drop'])document.addEventListener(type,event=>event.preventDefault());
document.addEventListener('selectstart',event=>{if(!event.target.closest('input,textarea'))event.preventDefault();});

document.addEventListener('contextmenu',event=>event.preventDefault());

// Keep expanded folders when navigating, including empty directories.
let expandedFolders={};
for(const branch of document.querySelectorAll('.explorer-tree details')){
 const link=branch.querySelector(':scope > summary a');if(!link)continue;const key=new URL(link.href).pathname;
 if(expandedFolders[key]===true)branch.open=true;
 branch.addEventListener('toggle',()=>{expandedFolders[key]=branch.open;});
}
// Slide category menus and folders down from the top when they are opened.
document.addEventListener('toggle',event=>{
  const details=event.target;
  if(!(details instanceof HTMLDetailsElement)||!details.open)return;
  const menu=details.querySelector(':scope > .category-submenu');
  if(!menu)return;
  menu.classList.remove('drop');void menu.offsetWidth;menu.classList.add('drop');
  menu.addEventListener('animationend',()=>menu.classList.remove('drop'),{once:true});
},true);
