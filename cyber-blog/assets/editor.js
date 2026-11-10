// Inline post editor: shown only in browsers logged in via /admin/ (token in localStorage).
// Pages are swapped in place by navigation.js, so the editor re-attaches on every 'blog-page-change'.
(()=>{
if(window.top!==window)return;
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
@media(max-width:700px){.ie-grid{grid-template-columns:1fr}.ie-panel{padding:14px}}`;
document.head.insertAdjacentHTML('beforeend','<style>'+css+'</style>');

const el=(tag,attrs={},html='')=>{const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);e.innerHTML=html;return e;};
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

function watchDeploy(sha,label,show){
 clearTimeout(pollTimer);let tries=0;show(label+' · 배포 준비 중...','ok');
 const tick=async()=>{tries++;
  try{const r=(await gh(`/actions/runs?head_sha=${sha}&per_page=5`)).workflow_runs.find(r=>r.name==='Build and Deploy');
   if(r&&r.status==='completed'){show(label+(r.conclusion==='success'?' · 사이트에 반영됐어요 ✓':r.conclusion==='cancelled'?' · 더 새로운 저장이 배포 중이에요':' · 빌드 실패 — Actions 로그 확인'),r.conclusion==='failure'?'err':'ok');return;}
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
   await Promise.all([loadFile(),ensureLibs(),categories.length?0:gh(`/contents/cyber-blog/site.json?ref=${BRANCH}`).then(s=>{categories=JSON.parse(b64decode(s.content)).categories;})]);
   if(!panel)buildPanel();
   const m=file.meta;
   q('category').innerHTML=categories.map(c=>`<option value="${c.id}">${c.name.replace(/</g,'&lt;')}</option>`).join('');
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
 async function upload(f){
  if(f.size>5*1024*1024){pStatus('이미지는 5MB 이하만 올릴 수 있어요.','err');return;}
  const ext=(f.name.match(/\.[a-z0-9]+$/i)||['.png'])[0].toLowerCase(),name=Date.now().toString(36)+ext,buf=new Uint8Array(await f.arrayBuffer());
  let bin='';for(let i=0;i<buf.length;i+=0x8000)bin+=String.fromCharCode(...buf.subarray(i,i+0x8000));
  pStatus('이미지 올리는 중...');
  try{
   await gh(`/contents/${UPLOADS}/${name}`,{method:'PUT',body:JSON.stringify({message:'이미지 추가: '+f.name,content:btoa(bin),branch:BRANCH})});
   const ta=q('body');ta.setRangeText(`![${f.name.replace(/\.[^.]+$/,'').replace(/[\[\]]/g,'')}](/assets/uploads/${name})`,ta.selectionStart,ta.selectionEnd,'end');
   dirty=true;ta.focus();pStatus('이미지 추가됨 — 저장해야 반영돼요.','ok');
  }catch(e){pStatus('이미지 업로드 실패: '+authFail(e),'err');}
 }
 editBtn.onclick=open;
 active={isOpen,isDirty:()=>dirty,save};
 // Show the current pin state without blocking the page.
 loadFile().then(syncPin).catch(e=>{if(e.status===401){bar.remove();dropToken();}});
}

document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='s'&&active?.isOpen()){e.preventDefault();active.save();}});
// Guard unsaved edits against both full reloads and in-place page swaps.
window.addEventListener('beforeunload',e=>{if(active?.isDirty()){e.preventDefault();e.returnValue='';}});
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href]');
 if(a&&active?.isDirty()&&!a.getAttribute('href').startsWith('#')&&!confirm('저장하지 않은 변경 내용이 있어요. 버리고 이동할까요?')){e.preventDefault();e.stopImmediatePropagation();}
},true);
addEventListener('blog-page-change',init);
init();
})();
