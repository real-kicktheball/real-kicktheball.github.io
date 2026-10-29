import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {marked} from 'marked';
import sanitizeHtml from 'sanitize-html';
import hljs from 'highlight.js';
import {parseDocument} from 'htmlparser2';
const root=import.meta.dirname,out=path.resolve(root,'../docs');
const site=JSON.parse(fs.readFileSync(path.join(root,'site.json'),'utf8'));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const blockTags=new Set(['p','div','li','pre','blockquote','tr','td','th','h1','h2','h3','h4','h5','h6','br']);
function visibleText(markup){
 const parts=[];
 function walk(node){
  if(node.type==='text')parts.push(node.data);
  if(node.name==='img'&&node.attribs.alt)parts.push(node.attribs.alt);
  for(const child of node.children||[])walk(child);
  if(blockTags.has(node.name))parts.push(' ');
 }
 walk(parseDocument(markup));
 return parts.join('').replace(/\s+/g,' ').trim();
}
const codeAliases={python3:'python','c++':'cpp',sh:'bash',shell:'bash',asm:'x86asm',ps1:'powershell'};
marked.use({renderer:{code({text,lang}){
 const requested=(lang||'text').trim().split(/\s+/)[0].toLowerCase();
 const language=codeAliases[requested]||requested;
 const supported=!!hljs.getLanguage(language);
 const html=supported?hljs.highlight(text,{language,ignoreIllegals:true}).value:esc(text);
 return `<pre data-language="${esc(requested)}"><code class="hljs language-${esc(supported?language:'plaintext')}">${html}\n</code></pre>\n`;
}}});
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,10);
const gid=(category,parts)=>category+'--'+hash(parts.join('/'));
const aliases={'블로그 구축':'blog','개요':'overview'};
const folderName=name=>aliases[name]||(/^[a-zA-Z0-9 _.-]+$/.test(name)?name.toLowerCase().replace(/[^a-z0-9.-]+/g,'-'):('topic-'+hash(name)));
const groups=new Map();
const posts=fs.readdirSync(path.join(root,'content')).filter(f=>f.endsWith('.md')).map(f=>{
 const raw=fs.readFileSync(path.join(root,'content',f),'utf8'),m=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
 if(!m)throw Error('Invalid metadata: '+f);
 const p=JSON.parse(m[1]);
 if(!site.categories.some(c=>c.id===p.category)||!p.title||!Array.isArray(p.tags)||!/^\d{4}-\d{2}-\d{2}$/.test(p.date))throw Error('Invalid post: '+f);
 p.section??=[];
 for(let i=1;i<=p.section.length;i++){const parts=p.section.slice(0,i),id=gid(p.category,parts);if(!groups.has(id))groups.set(id,{id,category:p.category,parts,name:parts.at(-1),count:0});groups.get(id).count++;}
 const html=sanitizeHtml(marked.parse(m[2]),{allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img','details','summary']),allowedAttributes:{...sanitizeHtml.defaults.allowedAttributes,code:['class'],span:['class'],pre:['data-language'],img:['src','alt','title','width','height','loading'],a:['href','title','rel']},allowedSchemes:['http','https','mailto'],allowProtocolRelative:false});
 return {...p,slug:f.slice(0,-3),body:m[2],html:html.replace(/<img(?=\s)/g,'<img loading="lazy" decoding="async"')};
}).sort((a,b)=>Number(!!a.imported)-Number(!!b.imported)||b.date.localeCompare(a.date)||a.title.localeCompare(b.title,'ko'));
const recentPosts=[...posts].sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title,'ko')).slice(0,20);
// docs is generated output in this project, never a vault directory.
if(out!==path.join(path.dirname(root),'docs'))throw Error('Unexpected output directory');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
const versionHash=createHash('sha256').update(JSON.stringify(site));
for(const file of ['style.css','app.js','theme.js','terminal.js','matrix.js','intro.js','window-motion.js','file-window.js','text-reveal.js','navigation.js','favicon.svg','social-card.png'])versionHash.update(fs.readFileSync(path.join(root,'assets',file)));
for(const p of posts)versionHash.update(JSON.stringify([p.slug,p.title,p.category,p.section,p.date,p.summary,p.tags,p.imported,p.body]));
const version=versionHash.digest('hex').slice(0,10);
const write=(name,body)=>{const p=path.join(out,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,body);};
const cat=id=>site.categories.find(c=>c.id===id);
function layout(title,content,{base='./',active='archive',description=site.description,pathname='/',type='website'}={}){
 const canonical=new URL(pathname,site.url).href,image=new URL(`/assets/social-card.png?v=${version}`,site.url).href;
 const social=`<link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="${esc(type)}"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="${esc(title)} · ${esc(site.name)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(image)}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="black_nut 나이츠 프론티어 활동 기록"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)} · ${esc(site.name)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image)}">`;
 return `<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><meta name="description" content="${esc(description)}">${social}<title>${esc(title)} · ${esc(site.name)}</title><link rel="icon" type="image/svg+xml" href="${base}assets/favicon.svg?v=${version}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&amp;family=Noto+Sans+KR:wght@400;500;600;700;800;900&amp;display=swap"><script src="${base}assets/theme.js?v=${version}"></script><link rel="stylesheet" href="${base}assets/style.css?v=${version}"><script defer src="${base}assets/app.js?v=${version}"></script><script defer src="${base}assets/matrix.js?v=${version}"></script><script defer src="${base}assets/intro.js?v=${version}"></script><script defer src="${base}assets/window-motion.js?v=${version}"></script><script defer src="${base}assets/file-window.js?v=${version}"></script><script defer src="${base}assets/terminal.js?v=${version}" data-index="${base}terminal-index.json?v=${version}"></script><script defer src="${base}assets/text-reveal.js?v=${version}"></script><script defer src="${base}assets/navigation.js?v=${version}"></script></head><body data-base="${base}"><a class="skip" href="#main">본문으로 이동</a><div class="ambient" aria-hidden="true"></div><header class="header"><div class="nav"><a class="brand" href="${base}index.html" aria-label="black_nut 홈"><span class="brand-signal" data-signal-word="${esc(site.nickname)}">${esc(site.nickname)}</span></a><nav aria-label="주 메뉴">${[['home','index.html','홈'],['about','about.html','소개']].map(([id,file,label])=>`<a href="${base}${file}" ${active===id?'aria-current="page"':''}>${label}</a>`).join('')}<a class="github" href="https://github.com/${esc(site.username)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></nav><button class="theme" aria-label="밝은 테마로 전환">☀</button></div></header><main id="main">${content}</main><footer><a class="brand" href="${base}index.html">${esc(site.nickname)}</a><p>나이츠 프론티어 활동 기록.</p><span class="mono">© ${new Date().getFullYear()} ${esc(site.nickname)} · GitHub Pages</span><a href="#main">맨 위로 ↑</a></footer><div class="os-dock" aria-label="빠른 실행"><a href="${base}index.html" title="홈">⌂<span>홈</span></a><a href="${base}archive.html" title="파일탐색기 열기" aria-label="파일탐색기 열기" aria-expanded="false">▰<span>파일탐색기</span></a><button id="terminal-launcher" aria-label="터미널 열기" aria-expanded="false">&gt;_<span>터미널</span></button><button id="matrix-toggle" aria-label="매트릭스 배경 효과" aria-pressed="true">01<span>효과</span></button></div></body></html>`;
}
function cards(list,base){return list.map(p=>`<article class="post-card"><div class="post-meta"><span class="badge">${esc(cat(p.category).name)}</span></div><h3><a href="${base}posts/${p.slug}.html">${esc(p.title)}</a></h3><p class="post-preview">${esc(p.summary)}</p></article>`).join('');}
function sidebarPosts(category,parts){
 const count=posts.filter(p=>p.category===category&&p.section.length===parts.length&&parts.every((part,i)=>p.section[i]===part)).length;
 return count?'<div class="category-posts" data-category="'+esc(category)+'" data-section="'+esc(JSON.stringify(parts))+'" data-count="'+count+'"></div>':'';
}
function sidebarBranches(base,category,parts=[],activeCategory='',activeParts=[]){
 return [...groups.values()].filter(g=>g.category===category&&g.parts.length===parts.length+1&&parts.every((part,i)=>g.parts[i]===part)).map(g=>'<details class="category-folder" id="folder-'+g.id+'" '+(category===activeCategory&&g.parts.every((part,i)=>activeParts[i]===part)?'open':'')+'><summary class="category-folder-label"><span class="folder-icon" aria-hidden="true">▰</span><span class="category-folder-name">'+esc(g.name)+'</span><small>폴더 · '+g.count+'</small></summary><div class="category-submenu">'+sidebarPosts(category,g.parts)+sidebarBranches(base,category,g.parts,activeCategory,activeParts)+'</div></details>').join('');
}
function sidebar(base,category='',parts=[],activePost=''){return '<aside class="sidebar" id="category-sidebar" data-active-post="'+esc(activePost)+'"><span class="eyebrow">카테고리</span><a class="category-link" href="'+base+'recent.html"><span>최근 기록</span><span>'+recentPosts.length+'</span></a>'+site.categories.map(c=>'<details class="category-menu" id="category-'+c.id+'" data-category="'+c.id+'" '+(c.id===category?'open':'')+'><summary class="category-link"><span><i aria-hidden="true">'+(c.id==='development'?'<svg class="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m7 6-6 6 6 6m10-12 6 6-6 6M14 3l-4 18"/></svg>':esc(c.symbol))+'</i>'+esc(c.name)+'</span><span>⌄</span></summary><div class="category-submenu">'+sidebarPosts(c.id,[])+sidebarBranches(base,c.id,[],category,parts)+'</div></details>').join('')+'</aside>';}

function breadcrumbs(category,parts,base){return `<nav class="breadcrumbs" aria-label="현재 위치"><a href="${base}archive.html">기록</a><span>/</span><a href="${base}categories/${category}.html">${esc(cat(category).name)}</a>${parts.map((n,i)=>`<span>/</span><a href="${base}categories/${gid(category,parts.slice(0,i+1))}.html">${esc(n)}</a>`).join('')}</nav>`;}
function articleBreadcrumbs(category,parts){return `<nav class="breadcrumbs" aria-label="카테고리 경로"><a href="#category-sidebar" data-sidebar-target="category-sidebar">← 카테고리에서 보기</a><span>/</span><a href="#category-${category}" data-sidebar-target="category-${category}">${esc(cat(category).name)}</a>${parts.map((n,i)=>`<span>/</span><a href="#folder-${gid(category,parts.slice(0,i+1))}" data-sidebar-target="folder-${gid(category,parts.slice(0,i+1))}">${esc(n)}</a>`).join('')}</nav>`;}

function treeBranch(base,category,parts=[],current=[]){
 const children=[...groups.values()].filter(g=>g.category===category&&g.parts.length===parts.length+1&&parts.every((v,i)=>g.parts[i]===v));
 return children.map(g=>{const link='<a href="'+base+'categories/'+g.id+'.html"><span class="folder-icon" aria-hidden="true">▰</span>'+esc(g.name)+'</a>';const sub=treeBranch(base,category,g.parts,current);return sub?'<details '+(g.parts.every((v,i)=>current[i]===v)?'open':'')+'><summary>'+link+'</summary><div class="tree-children">'+sub+'</div></details>':'<div class="tree-leaf">'+link+'</div>';}).join('');
}
function explorer(list,{base,category,parts,page,pages,urlFor},childGroups,subset){
 const parent=parts.length>1?base+'categories/'+gid(category,parts.slice(0,-1))+'.html':parts.length?base+'categories/'+category+'.html':base+'archive.html';
 const rows=subset.map(p=>'<article class="post-card file-row"><span class="file-icon" aria-hidden="true">≡</span><h3><a href="'+base+'posts/'+p.slug+'.html">'+esc(p.title)+'</a></h3><time>'+p.date.replaceAll('-','.')+'</time><span class="file-kind">Markdown</span><p hidden>'+esc(p.summary)+'</p><div class="tags" hidden>'+p.tags.map(esc).join(' ')+'</div></article>').join('');
 const roots=!category?site.categories.map(c=>({id:c.id,name:c.name,count:posts.filter(p=>p.category===c.id).length})):childGroups;
 return '<section class="archive-section file-explorer" data-category="'+esc(category)+'" data-section="'+esc(JSON.stringify(parts))+'"><div class="explorer-title"><span class="folder-icon">▰</span> 파일 탐색기 <span>black_nut / notes</span></div><div class="explorer-toolbar"><a href="'+parent+'" class="explorer-up" aria-label="상위 폴더로">↑</a><nav class="explorer-path" aria-label="현재 폴더"><a href="'+base+'archive.html">기록</a>'+(category?'<span>›</span><a href="'+base+'categories/'+category+'.html">'+esc(cat(category).name)+'</a>':'')+parts.map((p,i)=>'<span>›</span><a href="'+base+'categories/'+gid(category,parts.slice(0,i+1))+'.html">'+esc(p)+'</a>').join('')+'</nav><label class="search"><input type="search" id="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="이 폴더에서 검색" aria-label="이 폴더에서 검색"></label></div><div class="explorer-layout"><aside class="explorer-tree" aria-label="폴더 트리"><a href="'+base+'archive.html" class="tree-home">⌂ 전체 기록</a>'+site.categories.map(c=>'<details '+(category===c.id?'open':'')+'><summary><a href="'+base+'categories/'+c.id+'.html"><span class="folder-icon" aria-hidden="true">▰</span>'+esc(c.name)+'</a></summary><div class="tree-children">'+treeBranch(base,c.id,[],category===c.id?parts:[])+'</div></details>').join('')+'</aside><div class="explorer-files"><div class="file-columns"><span>이름</span><span>게시일</span><span>종류</span></div><div class="folder-grid">'+roots.map(g=>'<a class="folder-tile" href="'+base+'categories/'+g.id+'.html"><span><i class="folder-icon" aria-hidden="true">▰</i>'+esc(g.name)+'</span><span>'+g.count+'개 · 폴더</span></a>').join('')+'</div><div class="post-grid">'+rows+'</div><div class="empty" '+(list.length||roots.length?'hidden':'')+'><h3>이 폴더는 비어 있습니다.</h3><p>아직 게시한 글이 없습니다.</p></div><nav class="pagination" aria-label="목록 페이지">'+(pages>1?(page>1?'<a href="'+urlFor(page-1)+'">← 이전</a>':'<span></span>')+'<span>'+page+' / '+pages+'</span>'+(page<pages?'<a href="'+urlFor(page+1)+'">다음 →</a>':'<span></span>'):'')+'</nav><button class="search-more" hidden>더 보기</button></div></div><div class="explorer-status"><p class="result-count" aria-live="polite">'+list.length+'개 파일'+(roots.length?' · '+roots.length+'개 폴더':'')+'</p><span>Markdown</span></div></section>';
}

function archive(list,{base='./',category='',parts=[],page=1,pages=1,urlFor=()=>'',home=false,heading}={}){
 const childGroups=[...groups.values()].filter(g=>g.category===category&&g.parts.length===parts.length+1&&parts.every((p,i)=>g.parts[i]===p));
 const title=heading||parts.at(-1)||cat(category)?.name||(home?'고정 기록':'전체 기록');
 const subset=home?list:list.slice((page-1)*18,page*18);
 if(!home)return explorer(list,{base,category,parts,page,pages,urlFor},childGroups,subset);
 return `<section class="archive-section" data-category="${esc(category)}" data-section="${esc(JSON.stringify(parts))}"><div class="section-heading"><div><span class="eyebrow">${category?'DIRECTORY / '+category.toUpperCase():'ARCHIVE'}</span><h2>${esc(title)}<span class="count">${list.length}</span></h2></div><label class="search"><span aria-hidden="true">⌕</span><input type="search" id="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${category?'이 분류에서 검색...':'전체 기록 검색...'}" aria-label="글 제목, 설명, 태그 검색"><kbd>/</kbd></label></div><div class="archive-layout">${sidebar(base,category)}<div>${childGroups.length?`<div class="folder-grid">${childGroups.map(g=>`<a class="folder-tile" href="${base}categories/${g.id}.html"><span>▱ ${esc(g.name)}</span><span>${g.count} →</span></a>`).join('')}</div>`:''}<p class="result-count" aria-live="polite">${list.length}개의 기록${pages>1?' · '+page+' / '+pages+' 페이지':''}</p><div class="post-grid">${cards(subset,base)}</div><div class="empty" ${list.length?'hidden':''}><span class="mono">$ find ./notes</span><h3>${list.length?'검색 결과가 없습니다.':'첫 번째 기록을 준비하고 있습니다.'}</h3><p>${list.length?'다른 검색어로 찾아보세요.':'배운 내용을 정리해 이곳에 남길 예정입니다.'}</p></div><nav class="pagination" aria-label="글 목록 페이지">${home?'':pages>1?`${page>1?`<a href="${urlFor(page-1)}">← 이전</a>`:'<span></span>'}<span>${page} / ${pages}</span>${page<pages?`<a href="${urlFor(page+1)}">다음 →</a>`:'<span></span>'}`:''}</nav><button class="search-more" hidden>검색 결과 더 보기</button></div></div></section>`;
}
const hero=`<section class="hero hero-monitor" aria-label="디지털 모니터">
  <div class="monitor-aura" aria-hidden="true"></div>
  <div class="monitor-device">
    <div class="monitor-bezel">
      <div class="monitor-topline"><span class="monitor-led"></span><span>BLACK_NUT // SIGNAL_01</span><span class="monitor-topline-right">SYS.READY</span></div>
      <div class="monitor-display" role="img" aria-label="숫자와 영문자가 흐르는 모니터 화면">
        <canvas id="monitor-glyphs" aria-hidden="true"></canvas>
        <div class="monitor-scanlines" aria-hidden="true"></div>
        <div class="monitor-overlay" aria-hidden="true"><span class="monitor-prompt">&gt;_</span><strong>black_nut</strong><small>KNIGHTS FRONTIER</small></div>
      </div>
      <div class="monitor-bottomline"><span class="monitor-power"><i></i> ONLINE</span><span>001101 // NOTES</span></div>
    </div>
    <div class="monitor-neck" aria-hidden="true"></div><div class="monitor-foot" aria-hidden="true"></div>
  </div>
  <a class="monitor-scroll" href="#notes">기록 열기 <span aria-hidden="true">↓</span></a>
</section><div class="topic-strip"><span class="mono">EXPLORE THE ARCHIVE ↓</span><span>6 TOPICS</span><span>${posts.length} NOTES</span><span>나이츠 프론티어</span></div>`
const pinnedSlugs=['2026-10-26-hello-world'];
const pinnedPosts=pinnedSlugs.map(slug=>{const post=posts.find(p=>p.slug===slug);if(!post)throw Error('Missing pinned post: '+slug);return post;});
write('index.html',layout('개발과 보안의 기록',hero+`<div id="notes">${archive(pinnedPosts,{home:true})}</div>`,{active:'home',pathname:'/'}));
write('recent.html',layout('최근 기록',`<section class="page-intro"><span class="eyebrow">RECENT NOTES</span><h1>최근 기록<span class="accent">.</span></h1><p>최근에 작성한 글을 모았습니다.</p></section>${archive(recentPosts,{home:true,heading:'최신 글'})}`,{pathname:'/recent.html'}));
const sets=[{id:'archive',category:'',parts:[],list:[]},...site.categories.map(c=>({id:c.id,category:c.id,parts:[],list:posts.filter(p=>p.category===c.id&&p.section.length===0)})),...[...groups.values()].map(g=>({id:g.id,category:g.category,parts:g.parts,list:posts.filter(p=>p.category===g.category&&p.section.length===g.parts.length&&g.parts.every((x,i)=>p.section[i]===x))}))];
for(const set of sets){
 const base=set.category?'../':'./',pages=Math.max(1,Math.ceil(set.list.length/18));
 const urlFor=p=>set.id+(p>1?'--page-'+p:'')+'.html';
 for(let page=1;page<=pages;page++){
  const title=set.parts.at(-1)||cat(set.category)?.name||'전체 기록';
  const intro=`<section class="page-intro">${set.category?breadcrumbs(set.category,set.parts,base):'<span class="eyebrow">ARCHIVE</span>'}<h1>${esc(title)}<span class="accent">.</span></h1><p>${set.parts.length?'폴더별로 탐색하는 활동 기록.':cat(set.category)?.description||'나이츠 프론티어 활동 기록을 모았습니다.'}</p></section>`;
  write((set.category?'categories/':'')+urlFor(page),layout(title,intro+archive(set.list,{base,category:set.category,parts:set.parts,page,pages,urlFor}),{base,pathname:(set.category?'/categories/':'/')+urlFor(page)}));
 }
}
write('about.html',layout('소개',`<section class="page-intro"><span class="eyebrow">ABOUT ME</span><h1>안녕하세요,<br><span class="accent">${esc(site.nickname)}</span>입니다.</h1><p>${esc(site.tagline)}</p></section><section class="about-grid"><div class="about-monogram" aria-hidden="true">&gt;_<small>CURIOUS BY DEFAULT</small></div><div class="prose"><h2>이 블로그에 대해</h2><p>${esc(site.about)}</p><a class="button primary" href="https://github.com/${esc(site.username)}">GitHub에서 프로젝트 보기 ↗</a></div></section>`,{active:'about',pathname:'/about.html'}));
for(const p of posts){
 const article=`<div class="article-layout">${sidebar('../',p.category,p.section,p.slug)}<section class="article-wrap">${articleBreadcrumbs(p.category,p.section)}<div class="article-header"><span class="eyebrow">${esc(cat(p.category).name)}</span><h1>${esc(p.title)}</h1><p>${esc(p.summary)}</p><div class="article-meta"><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time><span>${Math.max(1,Math.ceil(p.body.length/650))}분 읽기</span><span>by ${esc(site.nickname)}</span></div>${p.imported?'<p class="import-note">게시일 기준 · Obsidian 노트에서 옮김</p>':''}</div><div class="article-terminal"><div class="terminal-bar"><span class="dots"><i></i><i></i><i></i></span><span>~/notes/${esc(p.slug)}.md</span></div><article class="prose">${p.html}</article></div><div class="article-bottom"><div class="tags">${p.tags.map(t=>`<span>#${esc(t)}</span>`).join('')}</div><a class="back" href="#${p.section.length?'folder-'+gid(p.category,p.section):'category-'+p.category}" data-sidebar-target="${p.section.length?'folder-'+gid(p.category,p.section):'category-'+p.category}">← 같은 폴더의 기록 보기</a></div></section></div>`;
 write('posts/'+p.slug+'.html',layout(p.title,article,{base:'../',description:p.summary,pathname:'/posts/'+p.slug+'.html',type:'article'}));
 write('terminal-content/'+p.slug+'.txt',p.body);
}
write('search-index.json',JSON.stringify(posts.map(p=>({slug:p.slug,title:p.title,category:p.category,categoryName:cat(p.category).name,section:p.section,date:p.date,summary:p.summary,tags:p.tags}))));
write('search-body-index.json',JSON.stringify(Object.fromEntries(posts.map(p=>[p.slug,visibleText(p.html)]))));
const dirs=site.categories.map(c=>({path:c.id,title:c.name,url:'categories/'+c.id+'.html'})).concat([...groups.values()].map(g=>({path:g.category+'/'+g.parts.map(folderName).join('/'),title:g.name,url:'categories/'+g.id+'.html'})));
write('terminal-index.json',JSON.stringify({nickname:site.nickname,about:site.about,dirs,posts:posts.map(p=>({slug:p.slug,title:p.title,path:p.category+(p.section.length?'/'+p.section.map(folderName).join('/'):'')+'/'+p.slug+'.md'}))}));
write('404.html',layout('페이지를 찾을 수 없습니다','<section class="page-intro"><span class="eyebrow">ERROR 404</span><h1>길을 잃었나요?</h1><p>요청한 기록을 찾을 수 없습니다.</p><a class="button primary" href="/">홈으로 돌아가기 →</a></section>',{base:'/',pathname:'/404.html'}));
write('sw.min.js',fs.readFileSync(path.join(root,'assets/retire-worker.js'),'utf8'));
write('refresh.html',`<!doctype html><html lang="ko"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>화면 업데이트</title><body style="background:#080d0d;color:#80f5c3;font-family:sans-serif;padding:10vw"><h1>새 블로그로 이동합니다.</h1><a href="/?v=${version}" style="color:inherit">블로그 열기 →</a><script>(async()=>{try{if('serviceWorker'in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.filter(r=>[r.active,r.waiting,r.installing].some(w=>w&&new URL(w.scriptURL).pathname==='/sw.min.js')).map(r=>r.unregister()));}if('caches'in window){await Promise.all((await caches.keys()).filter(k=>k.startsWith('chirpy-')).map(k=>caches.delete(k)));}}finally{location.replace('/?v=${version}');}})();</script></body></html>`);
write('.nojekyll','');
console.log(`Built ${posts.length} posts, ${groups.size} subcategories, six main categories → ${out}`);
