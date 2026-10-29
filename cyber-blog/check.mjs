import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parseDocument} from 'htmlparser2';
const root = path.resolve(import.meta.dirname,'../docs');
const config=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'site.json'),'utf8'));
const files = fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html'));
let links=0;
for(const file of files){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 assert(html.includes('<html lang="ko">'),file);
 assert(!html.includes('[[Home/'),`Obsidian link remains: ${file}`);
 assert(!/gh[pousr]_[A-Za-z0-9]{20,}|github_pat_/.test(html),`Possible credential in ${file}`);
 if(file!=='refresh.html'){
  const canonical=new URL(file==='index.html'?'/':'/'+file,config.url).href;
  assert(html.includes(`<link rel="canonical" href="${canonical}">`),`Missing canonical URL: ${file}`);
  assert(html.includes(`<meta property="og:url" content="${canonical}">`),`Missing share URL: ${file}`);
  assert(html.includes(`<meta property="og:type" content="${file.startsWith('posts/')?'article':'website'}">`),`Wrong share type: ${file}`);
  assert(/<meta property="og:image" content="https:\/\/[^" ]+\/assets\/social-card\.png\?v=[a-f0-9]+">/.test(html),`Missing share image: ${file}`);
  assert(html.includes('<meta name="twitter:card" content="summary_large_image">'),`Missing large image card: ${file}`);
 }
 const urls=[];
 function collect(node){if(node.attribs){for(const key of ['href','src'])if(node.attribs[key])urls.push(node.attribs[key]);}for(const child of node.children||[])collect(child);}
 collect(parseDocument(html));
 for(const url of urls){
  if (/^(https?:|mailto:|#|data:)/.test(url))continue;
  const pathname=decodeURIComponent(url.split(/[?#]/)[0]);
  const target=pathname.startsWith('/')?path.join(root,pathname):path.resolve(path.dirname(path.join(root,file)),pathname);
  assert(fs.existsSync(target),`Broken link: ${file} → ${url}`); links++;
 }
}
assert.equal(config.categories.length,6);
for(const c of config.categories)assert(fs.existsSync(path.join(root,'categories',c.id+'.html')));
const searchIndex=JSON.parse(fs.readFileSync(path.join(root,'search-index.json'),'utf8'));
const searchBodies=JSON.parse(fs.readFileSync(path.join(root,'search-body-index.json'),'utf8'));
assert.equal(Object.keys(searchBodies).length,searchIndex.length,'Search body count differs from post count');
for(const post of searchIndex)assert.equal(typeof searchBodies[post.slug],'string',`Missing search body: ${post.slug}`);
console.log(`PASS: ${files.length} HTML pages, ${links} internal links, six categories, no unresolved vault links.`);
