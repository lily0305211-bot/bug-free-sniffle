'use strict';
const el=id=>document.getElementById(id);
let busy=false,started=false;
// The uncompressed Godot runtime exceeds the web uploader's per-file size.
// Serve gzip as a normal asset, then stream-decompress without special headers.
const originalFetch=globalThis.fetch.bind(globalThis);
globalThis.fetch=async function(input,options){
 const target=new URL(typeof input==='string'?input:(input instanceof URL?input.href:input.url),location.href);
 if(target.origin===location.origin&&target.pathname.endsWith('/game.wasm')){
  const compressed=new URL(target);compressed.pathname+='.gz';
  const response=await originalFetch(compressed.href,options);
  if(!response.ok)throw new Error('遊戲引擎未完整上傳：game.wasm.gz（HTTP '+response.status+'）');
  const body=response.body.pipeThrough(new DecompressionStream('gzip'));
  return new Response(body,{status:200,headers:{'Content-Type':'application/wasm'}});
 }
 return originalFetch(input,options);
};
function notify(message){el('notice').textContent=message;el('notice').classList.remove('hidden')}
function prerequisites(){
 if(location.protocol==='file:')return '請先把整個 moonbow 資料夾上傳 GitHub Pages，或使用本機 HTTP 伺服器；不能直接雙擊 HTML 載入這份引擎版。';
 if(typeof Engine==='undefined')return '缺少 game.js。請確認整個 moonbow 資料夾已上傳，不能只有 index.html。';
 if(typeof DecompressionStream==='undefined')return '這個瀏覽器不支援引擎解壓縮。請更新瀏覽器，或使用下載包中的 Windows 版。';
 const missing=Engine.getMissingFeatures({threads:false});
 if(missing.length)return '目前瀏覽器無法啟動 3D 引擎（'+missing.join('、')+'）。請確認裝置支援 WebGL 2，並在瀏覽器啟用硬體加速後重新開啟；也可改用 Windows 試玩版。';
 return '';
}
el('play').onclick=async()=>{
 if(busy||started)return;
 const missing=prerequisites();if(missing){notify(missing);return}
 busy=true;el('play').disabled=true;el('notice').classList.add('hidden');el('loading').classList.remove('hidden');
 const config={executable:'game',canvas:el('game'),canvasResizePolicy:2,focusCanvas:true,ensureCrossOriginIsolationHeaders:false,fileSizes:{'game.pck':9924400,'game.wasm':37700666},args:[]};
 const engine=new Engine(config);
 try{
  el('game').style.display='block';el('game').style.position='fixed';el('game').style.inset='0';el('game').style.zIndex='-1';
  await engine.startGame({onProgress(current,total){if(total>0){const value=Math.min(99,Math.round(current/total*100));el('percent').textContent=value+'%';el('fill').style.width=value+'%';el('status').textContent=value>90?'初始化光影、骨架與聲音…':'下載遊戲引擎與場景…'}},onExit(){location.reload()}});
  el('percent').textContent='100%';el('fill').style.width='100%';el('entry').classList.add('hidden');el('game').style.zIndex='1';el('back').classList.remove('hidden');el('game').focus();started=true;
 }catch(error){
  el('game').style.display='none';el('loading').classList.add('hidden');notify('遊戲未能載入：'+(error?.message||String(error))+'。請確認整個資料夾已部署完成，再重新整理。');el('play').disabled=false;
 }finally{busy=false}
};
el('about').onclick=()=>el('aboutText').classList.toggle('hidden');
el('back').onclick=()=>{if(confirm('離開這次單關試玩，回到網站入口？'))location.reload()};
