// Inline post editor: shown only in browsers logged in via /admin/ (token in localStorage).
// Pages are swapped in place by navigation.js, so the editor re-attaches on every 'blog-page-change'.
// It also adds "+ 새 글" buttons to the file explorer and the category sidebar; inside the
// explorer window (an iframe) those buttons open the composer in the top window.
(()=>{
const inFrame=window.top!==window;
const getToken=()=>{try{return localStorage.getItem('kb-admin-token')||'';}catch{return '';}};
const dropToken=()=>{try{localStorage.removeItem('kb-admin-token');}catch{}};
if(!getToken())return;
const OWNER='real-kicktheball',REPO='real-kicktheball.github.io',BRANCH='main',DIR='cyber-blog/content',UPLOADS='cyber-blog/assets/uploads';
const API=`https://api.github.com/repos/${OWNER}/${REPO}`;

const css=`.ie-bar{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.ie-btn{font:600 12px var(--mono);padding:7px 13px;border-radius:7px;border:1px solid var(--line);background:var(--panel);color:var(--text);cursor:pointer}
.ie-btn:hover{border-color:var(--accent);color:var(--accent)}.ie-btn:disabled{opacity:.5;cursor:wait}
.ie-btn.primary{background:var(--accent);border-color:var(--accent);color:var(--bg)}.ie-btn.primary:hover{color:var(--bg);filter:brightness(1.08)}
.ie-btn.danger{color:#ff7a70;border-color:#ff7a7066;background:transparent}
.ie-status{font:12px var(--mono);color:var(--muted);align-self:center}.ie-status.err{color:#ff7a70}.ie-status.ok{color:var(--accent)}
.ie-panel{margin:18px 0 30px;padding:18px;border:1px solid var(--accent);border-radius:10px;background:var(--panel)}
.ie-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ie-full{grid-column:1/-1}
.ie-panel label{display:block;font:600 11px var(--mono);color:var(--muted);margin:0 0 4px;letter-spacing:.04em}
.ie-panel input,.ie-panel select,.ie-panel textarea{width:100%;box-sizing:border-box;font:inherit;font-size:14px;padding:8px 10px;border-radius:7px;border:1px solid var(--line);background:var(--bg);color:var(--text)}
.ie-panel input:focus,.ie-panel select:focus,.ie-panel textarea:focus{outline:2px solid var(--accent);outline-offset:-1px}
.ie-panel .ie-check{display:flex;align-items:center;gap:8px;font:14px inherit;color:var(--text);letter-spacing:0}.ie-panel .ie-check input{width:auto}
.ie-tabs{display:flex;gap:6px;margin:14px 0 8px;align-items:center}.ie-tabs [aria-selected=true]{border-color:var(--accent);color:var(--accent)}
.ie-panel textarea{min-height:60vh;font:13px/1.6 var(--mono);resize:vertical;tab-size:2}
.ie-preview{min-height:60vh;border:1px solid var(--line);border-radius:7px;padding:4px 20px;background:var(--bg);overflow:auto}
.ie-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;align-items:center}
.ie-hidden{display:none!important}
.explorer-toolbar .ie-new{white-space:nowrap;padding:9px 14px}
.file-explorer .empty .ie-btn{margin-top:14px}
.ie-new-link{display:flex;align-items:center;gap:6px;width:100%;margin:2px 0 4px;padding:7px 6px;border:1px dashed var(--line);border-radius:6px;background:transparent;color:var(--accent);font:600 11px var(--mono);text-align:left}
.ie-new-link:hover{border-color:var(--accent);background:var(--soft)}
.ie-modal{position:fixed;inset:0;z-index:10000;display:flex;justify-content:center;align-items:flex-start;overflow:auto;padding:5vh 16px;background:rgba(0,0,0,.62);backdrop-filter:blur(2px)}
.ie-modal .ie-panel{width:min(940px,100%);margin:0;box-shadow:0 20px 60px #0008}
.ie-modal textarea,.ie-modal .ie-preview{min-height:42vh}
.ie-head{display:flex;align-items:center;gap:10px;margin:0 0 14px;font:600 13px var(--mono)}.ie-head strong{color:var(--accent)}.ie-head .ie-where{flex:1;min-width:0;color:var(--muted);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ie-done{padding:26px 6px;text-align:center}.ie-done h3{margin:0 0 8px}.ie-done .ie-actions{justify-content:center}
@media(max-width:700px){.ie-grid{grid-template-columns:1fr}.ie-panel{padding:14px}.ie-modal{padding:10px}}`;
document.head.insertAdjacentHTML('beforeend','<style>'+css+'</style>');

const el=(tag,attrs={},html='')=>{const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);e.innerHTML=html;return e;};
const escHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);};

// "+ 새 글" buttons: explorer toolbar (and empty-folder notice) plus every sidebar category/folder.
function addNewPostButtons(open){
 const root=document.querySelector('main');if(!root)return;
 const ex=root.querySelector('.file-explorer');
 if(ex&&!ex.dataset.ieNew){
  ex.dataset.ieNew='1';
  const go=()=>{let section=[];try{section=JSON.parse(ex.dataset.section||'[]');}catch{}open({category:ex.dataset.category||'',section});};
  const btn=el('button',{class:'ie-btn primary ie-new',type:'button',title:'이 폴더에 새 글 쓰기'},'+ 새 글');btn.onclick=go;
  const toolbar=ex.querySelector('.explorer-toolbar');toolbar?.insertBefore(btn,toolbar.querySelector('.search'));
  const empty=ex.querySelector('.empty');
  if(empty&&!ex.querySelector('.file-row,.folder-tile')){const b=el('button',{class:'ie-btn primary',type:'button'},'+ 이 폴더에 첫 글 쓰기');b.onclick=go;empty.append(b);}
 }
 for(const d of root.querySelectorAll('.sidebar .category-menu,.sidebar .category-folder')){
  const sub=d.querySelector(':scope > .category-submenu');
  if(!sub||sub.querySelector(':scope > .ie-new-link'))continue;
  const btn=el('button',{class:'ie-new-link',type:'button',title:'여기에 새 글 쓰기'},'<span aria-hidden="true">+</span> 새 글 쓰기');
  btn.onclick=()=>{
   const section=[];
   for(let f=d;f?.matches('.category-folder');f=f.parentElement.closest('details'))section.unshift(f.querySelector(':scope > summary .category-folder-name')?.textContent.trim()||'');
   open({category:d.closest('.category-menu')?.dataset.category||'',section:section.filter(Boolean)});
  };
  sub.prepend(btn);
 }
}
if(inFrame){
 // Explorer window iframe: the composer lives in the top window (same origin).
 addNewPostButtons(ctx=>{try{window.top.blogNewPost?.(ctx);}catch{}});
 return;
}
const b64encode=s=>{const b=new TextEncoder().encode(s);let x='';for(let i=0;i<b.length;i+=0x8000)x+=String.fromCharCode(...b.subarray(i,i+0x8000));return btoa(x);};
const b64decode=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),c=>c.charCodeAt(0)));
const parse=raw=>{const m=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);if(!m)throw Error('글 메타데이터 형식이 올바르지 않아요.');return{meta:JSON.parse(m[1]),body:m[2].replace(/^\r?\n/,'')};};
const serialize=(meta,body)=>'---\n'+JSON.stringify(meta)+'\n---\n\n'+body.replace(/\s+$/,'')+'\n';
async function gh(path,opt={}){
 const r=await fetch(API+path,{cache:'no-store',...opt,headers:{Authorization:'Bearer '+getToken(),Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(opt.headers||{})}});
 if(!r.ok){let m=r.status+'';try{m+=' '+(await r.json()).message}catch{}const e=Error(m);e.status=r.status;throw e;}
 return r.status===204?null:r.json();
}
function loadScript(src){return new Promise((ok,bad)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>bad(Error('스크립트를 불러오지 못했어요.'));document.head.appendChild(s);});}
let libs=null;
const ensureLibs=()=>libs||=Promise.all([window.marked||loadScript('https://cdn.jsdelivr.net/npm/marked@15.0.12/marked.min.js'),window.DOMPurify||loadScript('https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js')]);
const render=md=>DOMPurify.sanitize(marked.parse(md||''));
const authFail=e=>{if(e.status===401){dropToken();return '로그인이 만료됐어요. /admin/에서 다시 로그인하세요.';}if(e.status===409)return '다른 곳에서 먼저 수정됐어요. 새로고침 후 다시 시도하세요.';return e.message;};
let categories=[],pollTimer=null;
let active=null; // editor of the page currently shown
const loadCategories=async()=>{if(!categories.length){const s=await gh(`/contents/cyber-blog/site.json?ref=${BRANCH}`);categories=JSON.parse(b64decode(s.content)).categories;}return categories;};
const categoryOptions=()=>categories.map(c=>`<option value="${escHTML(c.id)}">${escHTML(c.name)}</option>`).join('');
async function uploadImage(f,ta,show){
 if(f.size>5*1024*1024){show('이미지는 5MB 이하만 올릴 수 있어요.','err');return false;}
 const ext=(f.name.match(/\.[a-z0-9]+$/i)||['.png'])[0].toLowerCase(),name=Date.now().toString(36)+ext,buf=new Uint8Array(await f.arrayBuffer());
 let bin='';for(let i=0;i<buf.length;i+=0x8000)bin+=String.fromCharCode(...buf.subarray(i,i+0x8000));
 show('이미지 올리는 중...');
 try{
  await gh(`/contents/${UPLOADS}/${name}`,{method:'PUT',body:JSON.stringify({message:'이미지 추가: '+f.name,content:btoa(bin),branch:BRANCH})});
  ta.setRangeText(`![${f.name.replace(/\.[^.]+$/,'').replace(/[\[\]]/g,'')}](/assets/uploads/${name})`,ta.selectionStart,ta.selectionEnd,'end');
  ta.focus();show('이미지 추가됨 — 저장해야 반영돼요.','ok');return true;
 }catch(e){show('이미지 업로드 실패: '+authFail(e),'err');return false;}
}

function watchDeploy(sha,label,show,onSuccess){
 clearTimeout(pollTimer);let tries=0;show(label+' · 배포 준비 중...','ok');
 const tick=async()=>{tries++;
  try{const r=(await gh(`/actions/runs?head_sha=${sha}&per_page=5`)).workflow_runs.find(r=>r.name==='Build and Deploy');
   if(r&&r.status==='completed'){show(label+(r.conclusion==='success'?' · 사이트에 반영됐어요 ✓':r.conclusion==='cancelled'?' · 더 새로운 저장이 배포 중이에요':' · 빌드 실패 — Actions 로그 확인'),r.conclusion==='failure'?'err':'ok');if(r.conclusion==='success')onSuccess?.();return;}
   show(label+' · 배포 중'+'.'.repeat(tries%4),'ok');
  }catch(e){show(label+' · 1~2분 뒤 사이트에 반영돼요','ok');return;}
  if(tries<60)pollTimer=setTimeout(tick,5000);};
 pollTimer=setTimeout(tick,4000);
}

function init(){
 active=null;
 const wrap=document.querySelector('.article-wrap[data-slug]');
 if(!wrap||wrap.dataset.ieReady||!getToken())return;
 wrap.dataset.ieReady='1';
 const slug=wrap.dataset.slug,FILE=`${DIR}/${encodeURIComponent(slug)}.md`;
 const header=wrap.querySelector('.article-header'),terminal=wrap.querySelector('.article-terminal'),bottom=wrap.querySelector('.article-bottom'),prose=terminal.querySelector('.prose');
 let file=null,dirty=false,panel=null;

 const bar=el('div',{class:'ie-bar'});
 const editBtn=el('button',{class:'ie-btn',type:'button'},'✎ 수정');
 const pinBtn=el('button',{class:'ie-btn',type:'button'},'📌 홈에 고정');
 const barStatus=el('span',{class:'ie-status'});
 bar.append(editBtn,pinBtn,barStatus);header.appendChild(bar);
 const status=(msg,cls='')=>{barStatus.textContent=msg;barStatus.className='ie-status '+cls;};

 async function loadFile(){const f=await gh(`/contents/${FILE}?ref=${BRANCH}`);file={sha:f.sha,...parse(b64decode(f.content))};return file;}
 const syncPin=()=>{pinBtn.textContent=file?.meta.pinned?'📌 고정 해제':'📌 홈에 고정';};
 async function put(meta,body,message){
  const res=await gh(`/contents/${FILE}`,{method:'PUT',body:JSON.stringify({message,content:b64encode(serialize(meta,body)),branch:BRANCH,sha:file.sha})});
  file={sha:res.content.sha,meta,body};return res;
 }

 pinBtn.onclick=async()=>{
  pinBtn.disabled=true;status('확인 중...');
  try{await loadFile();const meta={...file.meta};if(meta.pinned)delete meta.pinned;else meta.pinned=true;
   const res=await put(meta,file.body,(meta.pinned?'고정: ':'고정 해제: ')+meta.title);syncPin();watchDeploy(res.commit.sha,meta.pinned?'홈에 고정됨':'고정 해제됨',status);
  }catch(e){status('실패: '+authFail(e),'err');}finally{pinBtn.disabled=false;}
 };

 function buildPanel(){
  panel=el('section',{class:'ie-panel','aria-label':'글 수정'},`
<div class="ie-grid">
 <div class="ie-full"><label for="ie-title">제목</label><input id="ie-title"></div>
 <div class="ie-full"><label for="ie-summary">한 줄 요약</label><input id="ie-summary"></div>
 <div><label for="ie-date">게시일</label><input id="ie-date" type="date"></div>
 <div><label for="ie-category">카테고리</label><select id="ie-category"></select></div>
 <div><label for="ie-section">폴더 경로 (/ 로 구분)</label><input id="ie-section"></div>
 <div><label for="ie-tags">태그 (쉼표로 구분)</label><input id="ie-tags"></div>
 <div class="ie-full"><label class="ie-check"><input id="ie-pinned" type="checkbox"> 📌 홈 화면에 고정</label></div>
</div>
<div class="ie-tabs" role="tablist">
 <button type="button" class="ie-btn" role="tab" data-ie-tab="write" aria-selected="true">작성</button>
 <button type="button" class="ie-btn" role="tab" data-ie-tab="preview" aria-selected="false">미리보기</button>
 <span style="flex:1"></span>
 <button type="button" class="ie-btn" data-ie="img">이미지 넣기</button><input data-ie="imgfile" type="file" accept="image/*" class="ie-hidden">
</div>
<textarea id="ie-body" spellcheck="false"></textarea>
<div class="ie-preview prose ie-hidden" data-ie="preview"></div>
<div class="ie-actions">
 <button type="button" class="ie-btn primary" data-ie="save">저장하고 배포</button>
 <button type="button" class="ie-btn" data-ie="cancel">취소</button>
 <button type="button" class="ie-btn danger" data-ie="delete">삭제</button>
 <span class="ie-status" data-ie="status">Ctrl+S 저장</span>
</div>`);
  terminal.before(panel);
  panel.addEventListener('input',()=>{dirty=true;});
  panel.querySelectorAll('[data-ie-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.ieTab));
  q('save').onclick=save;q('cancel').onclick=close;q('delete').onclick=remove;
  q('img').onclick=()=>q('imgfile').click();
  q('imgfile').onchange=e=>{const f=e.target.files[0];if(f)upload(f);e.target.value='';};
  q('body').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();e.target.setRangeText('  ',e.target.selectionStart,e.target.selectionEnd,'end');}});
 }
 const q=k=>panel.querySelector(`#ie-${k},[data-ie="${k}"]`);
 const pStatus=(m,c='')=>{const s=q('status');s.textContent=m;s.className='ie-status '+c;};
 const isOpen=()=>!!panel&&!panel.classList.contains('ie-hidden');
 function tab(t){
  panel.querySelectorAll('[data-ie-tab]').forEach(b=>b.setAttribute('aria-selected',b.dataset.ieTab===t));
  q('body').classList.toggle('ie-hidden',t!=='write');q('preview').classList.toggle('ie-hidden',t!=='preview');
  if(t==='preview')q('preview').innerHTML=render(q('body').value||'*본문이 비어 있어요.*');
 }
 async function open(){
  editBtn.disabled=true;status('불러오는 중...');
  try{
   await Promise.all([loadFile(),ensureLibs(),loadCategories()]);
   if(!panel)buildPanel();
   const m=file.meta;
   q('category').innerHTML=categoryOptions();
   q('title').value=m.title||'';q('summary').value=m.summary||'';q('date').value=m.date||'';
   q('category').value=m.category||'';q('section').value=(m.section||[]).join(' / ');q('tags').value=(m.tags||[]).join(', ');
   q('pinned').checked=!!m.pinned;q('body').value=file.body;
   panel.classList.remove('ie-hidden');terminal.classList.add('ie-hidden');bottom?.classList.add('ie-hidden');bar.classList.add('ie-hidden');
   tab('write');dirty=false;pStatus('Ctrl+S 저장');status('');
   panel.scrollIntoView({behavior:'smooth',block:'start'});q('body').focus({preventScroll:true});
  }catch(e){status('불러오기 실패: '+authFail(e),'err');}
  finally{editBtn.disabled=false;}
 }
 function close(){
  if(dirty&&!confirm('저장하지 않은 변경 내용이 있어요. 버릴까요?'))return;
  dirty=false;panel.classList.add('ie-hidden');terminal.classList.remove('ie-hidden');bottom?.classList.remove('ie-hidden');bar.classList.remove('ie-hidden');syncPin();
 }
 function collect(){
  const meta={...file.meta,title:q('title').value.trim(),summary:q('summary').value.trim(),date:q('date').value,category:q('category').value,
   section:q('section').value.split('/').map(s=>s.trim()).filter(Boolean),tags:q('tags').value.split(',').map(s=>s.trim()).filter(Boolean)};
  if(q('pinned').checked)meta.pinned=true;else delete meta.pinned;
  if(!meta.title)throw Error('제목을 입력하세요.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(meta.date))throw Error('게시일을 입력하세요.');
  if(!categories.some(c=>c.id===meta.category))throw Error('카테고리를 고르세요.');
  return meta;
 }
 async function save(){
  let meta;try{meta=collect();}catch(e){pStatus(e.message,'err');return;}
  const body=q('body').value;q('save').disabled=true;pStatus('저장 중...');
  try{
   const res=await put(meta,body,'글 수정: '+meta.title);
   // Show the change right away; the rebuilt page (with code highlighting) takes over after deploy.
   header.querySelector('h1').textContent=meta.title;const sp=header.querySelector('p');if(sp)sp.textContent=meta.summary;
   document.title=meta.title+' · '+document.title.split(' · ').pop();
   prose.innerHTML=render(body);
   dirty=false;close();watchDeploy(res.commit.sha,'저장됨',status);
  }catch(e){pStatus('저장 실패: '+authFail(e),'err');}
  finally{q('save').disabled=false;}
 }
 async function remove(){
  if(!confirm(`"${file.meta.title}" 글을 삭제할까요?\n(GitHub 커밋 기록에는 남아서 나중에 되살릴 수 있어요.)`))return;
  q('delete').disabled=true;pStatus('삭제 중...');
  try{
   await gh(`/contents/${FILE}`,{method:'DELETE',body:JSON.stringify({message:'글 삭제: '+file.meta.title,sha:file.sha,branch:BRANCH})});
   dirty=false;pStatus('삭제됨 · 1~2분 뒤 사이트에서 사라져요. 카테고리로 이동합니다.','ok');
   const base=document.body.dataset.base||'../';
   setTimeout(()=>{location.href=base+'categories/'+encodeURIComponent(file.meta.category)+'.html';},1800);
  }catch(e){pStatus('삭제 실패: '+authFail(e),'err');q('delete').disabled=false;}
 }
 async function upload(f){if(await uploadImage(f,q('body'),pStatus))dirty=true;}
 editBtn.onclick=open;
 active={isOpen,isDirty:()=>dirty,save};
 // Show the current pin state without blocking the page.
 loadFile().then(syncPin).catch(e=>{if(e.status===401){bar.remove();dropToken();}});
}

// New-post composer: a modal over the current page, opened from any "+ 새 글" button.
const composer={node:null,dirty:false,open:false};
function openComposer({category='',section=[]}={}){
 if(composer.open){composer.node.querySelector('[data-c="title"]').focus();return;}
 const box=el('div',{class:'ie-modal',role:'dialog','aria-modal':'true','aria-label':'새 글 작성'},`
<section class="ie-panel">
 <div class="ie-head"><strong>+ 새 글</strong><span class="ie-where" data-c="where"></span><button type="button" class="ie-btn" data-c="x" aria-label="닫기">×</button></div>
 <div data-c="form">
  <div class="ie-grid">
   <div class="ie-full"><label for="ic-title">제목 *</label><input id="ic-title" data-c="title" autocomplete="off"></div>
   <div class="ie-full"><label for="ic-summary">한 줄 요약</label><input id="ic-summary" data-c="summary" autocomplete="off"></div>
   <div><label for="ic-date">게시일 *</label><input id="ic-date" data-c="date" type="date"></div>
   <div><label for="ic-category">카테고리 *</label><select id="ic-category" data-c="category"><option>불러오는 중...</option></select></div>
   <div><label for="ic-section">폴더 경로 (/ 로 구분)</label><input id="ic-section" data-c="section" placeholder="비우면 카테고리 바로 아래"></div>
   <div><label for="ic-tags">태그 (쉼표로 구분)</label><input id="ic-tags" data-c="tags" placeholder="예: XSS, 웹"></div>
   <div class="ie-full"><label for="ic-slug">파일 이름 (글 주소) — 비우면 자동</label><input id="ic-slug" data-c="slug" autocomplete="off"></div>
   <div class="ie-full"><label class="ie-check"><input data-c="pinned" type="checkbox"> 📌 홈 화면에 고정</label></div>
  </div>
  <div class="ie-tabs" role="tablist">
   <button type="button" class="ie-btn" role="tab" data-ic-tab="write" aria-selected="true">작성</button>
   <button type="button" class="ie-btn" role="tab" data-ic-tab="preview" aria-selected="false">미리보기</button>
   <span style="flex:1"></span>
   <button type="button" class="ie-btn" data-c="img">이미지 넣기</button><input data-c="imgfile" type="file" accept="image/*" class="ie-hidden">
  </div>
  <textarea data-c="body" spellcheck="false" placeholder="Markdown으로 본문을 작성하세요."></textarea>
  <div class="ie-preview prose ie-hidden" data-c="preview"></div>
  <div class="ie-actions">
   <button type="button" class="ie-btn primary" data-c="save">저장하고 배포</button>
   <button type="button" class="ie-btn" data-c="cancel">취소</button>
   <span class="ie-status" data-c="status">Ctrl+S 저장 · Esc 닫기</span>
  </div>
 </div>
 <div class="ie-done ie-hidden" data-c="done">
  <h3>✓ 글을 저장했어요</h3>
  <p class="ie-status" data-c="deploy"></p>
  <div class="ie-actions">
   <a class="ie-btn primary ie-hidden" data-c="view">글 보기 →</a>
   <button type="button" class="ie-btn" data-c="again">새 글 하나 더</button>
   <button type="button" class="ie-btn" data-c="close">닫기</button>
  </div>
 </div>
</section>`);
 const c=k=>box.querySelector(`[data-c="${k}"]`);
 const show=(m,cls='')=>{const s=c('status');s.textContent=m;s.className='ie-status '+cls;};
 const where=()=>{const cat=categories.find(x=>x.id===c('category').value);c('where').textContent=[cat?.name||'',...c('section').value.split('/').map(s=>s.trim()).filter(Boolean)].filter(Boolean).join(' / ');};
 let slugTouched=false;
 const autoSlug=()=>{if(slugTouched)return;const words=c('title').value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g,' ').trim().replace(/[\s-]+/g,'-').slice(0,60).replace(/-$/,'');c('slug').value=(c('date').value||today())+'-'+(words||'post-'+Date.now().toString(36));};
 const tab=t=>{box.querySelectorAll('[data-ic-tab]').forEach(b=>b.setAttribute('aria-selected',b.dataset.icTab===t));c('body').classList.toggle('ie-hidden',t!=='write');c('preview').classList.toggle('ie-hidden',t!=='preview');if(t==='preview')ensureLibs().then(()=>{c('preview').innerHTML=render(c('body').value||'*본문이 비어 있어요.*');}).catch(e=>{c('preview').textContent=e.message;});};
 const reset=()=>{
  for(const k of ['title','summary','tags','body'])c(k).value='';
  c('date').value=today();c('section').value=section.join(' / ');c('pinned').checked=false;slugTouched=false;c('slug').value='';
  c('form').classList.remove('ie-hidden');c('done').classList.add('ie-hidden');c('view').classList.add('ie-hidden');
  tab('write');show('Ctrl+S 저장 · Esc 닫기');composer.dirty=false;where();c('title').focus();
 };
 const close=()=>{
  if(composer.dirty&&!confirm('저장하지 않은 글이 있어요. 버리고 닫을까요?'))return;
  composer.dirty=false;composer.open=false;composer.node=null;box.remove();document.documentElement.style.overflow='';
 };
 async function save(){
  if(c('form').classList.contains('ie-hidden'))return;
  const meta={title:c('title').value.trim(),date:c('date').value,category:c('category').value,tags:c('tags').value.split(',').map(s=>s.trim()).filter(Boolean),summary:c('summary').value.trim(),section:c('section').value.split('/').map(s=>s.trim()).filter(Boolean)};
  if(c('pinned').checked)meta.pinned=true;
  if(!meta.title){show('제목을 입력하세요.','err');c('title').focus();return;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)){show('게시일을 입력하세요.','err');return;}
  if(!categories.some(x=>x.id===meta.category)){show('카테고리를 고르세요.','err');return;}
  if(!c('slug').value.trim()){slugTouched=false;autoSlug();}
  const slug=c('slug').value.trim();
  if(!/^[\p{L}\p{N}][\p{L}\p{N}._-]*$/u.test(slug)){show('파일 이름에는 글자, 숫자, - _ . 만 쓸 수 있어요.','err');return;}
  c('save').disabled=true;show('저장 중...');
  try{
   const res=await gh(`/contents/${DIR}/${encodeURIComponent(slug+'.md')}`,{method:'PUT',body:JSON.stringify({message:'새 글: '+meta.title,content:b64encode(serialize(meta,c('body').value)),branch:BRANCH})});
   composer.dirty=false;
   c('form').classList.add('ie-hidden');c('done').classList.remove('ie-hidden');
   const view=c('view');view.href=new URL('posts/'+encodeURIComponent(slug)+'.html',new URL(document.body.dataset.base||'./',location.href)).href;
   const dep=(m,cls='')=>{const s=c('deploy');s.textContent=m;s.className='ie-status '+cls;};
   watchDeploy(res.commit.sha,'저장됨',dep,()=>view.classList.remove('ie-hidden'));
  }catch(e){show('저장 실패: '+(e.status===422?'같은 파일 이름의 글이 이미 있어요. 파일 이름을 바꿔 주세요.':authFail(e)),'err');}
  finally{c('save').disabled=false;}
 }
 box.addEventListener('input',e=>{if(!e.target.matches('[data-c="imgfile"]'))composer.dirty=true;});
 box.addEventListener('mousedown',e=>{if(e.target===box)box.dataset.down='1';});
 box.addEventListener('click',e=>{if(e.target===box&&box.dataset.down)close();delete box.dataset.down;});
 box.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();close();}
  else if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();e.stopPropagation();save();}
  else if(e.key==='Tab'&&e.target===c('body')){e.preventDefault();e.target.setRangeText('  ',e.target.selectionStart,e.target.selectionEnd,'end');}
 });
 c('title').addEventListener('input',autoSlug);c('date').addEventListener('input',autoSlug);
 c('slug').addEventListener('input',()=>{slugTouched=!!c('slug').value;});
 c('category').addEventListener('change',where);c('section').addEventListener('input',where);
 box.querySelectorAll('[data-ic-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.icTab));
 c('img').onclick=()=>c('imgfile').click();
 c('imgfile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(f&&await uploadImage(f,c('body'),show))composer.dirty=true;};
 c('view').addEventListener('click',close);
 c('save').onclick=save;c('cancel').onclick=close;c('x').onclick=close;c('close').onclick=close;c('again').onclick=reset;
 document.body.append(box);document.documentElement.style.overflow='hidden';
 Object.assign(composer,{node:box,open:true,dirty:false});
 reset();
 loadCategories().then(()=>{
  const sel=c('category');sel.innerHTML=categoryOptions();
  sel.value=categories.some(x=>x.id===category)?category:categories[0]?.id||'';where();
 }).catch(e=>show('카테고리 불러오기 실패: '+authFail(e),'err'));
 ensureLibs().catch(()=>{});
}
window.blogNewPost=openComposer;
const refreshButtons=()=>addNewPostButtons(openComposer);

document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='s'&&!composer.open&&active?.isOpen()){e.preventDefault();active.save();}});
// Guard unsaved edits against both full reloads and in-place page swaps.
const anyDirty=()=>composer.dirty||!!active?.isDirty();
window.addEventListener('beforeunload',e=>{if(anyDirty()){e.preventDefault();e.returnValue='';}});
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href]');
 if(a&&active?.isDirty()&&!a.getAttribute('href').startsWith('#')&&!confirm('저장하지 않은 변경 내용이 있어요. 버리고 이동할까요?')){e.preventDefault();e.stopImmediatePropagation();}
},true);
addEventListener('blog-page-change',()=>{init();refreshButtons();});
init();refreshButtons();
})();
