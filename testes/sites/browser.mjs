import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import worker from '../../dist/server/index.js';
import { openDatabase } from '../../sites/scripts/local-db.mjs';
import { base64Text,writeRecord } from '../../sites/server/data.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/cua_node/lib/node_modules/playwright');
const DB=openDatabase();
const admin={id:'test-admin',email:'test@example.test',role:'admin'};
await DB.prepare('INSERT INTO members(user_id,email,role) VALUES(?,?,?)').bind(admin.id,admin.email,admin.role).run();
await writeRecord(DB,admin,'fichas/coven.json',{content:base64Text(JSON.stringify({name:'Test Coven',quintessence:0,paradox:0,obolOfTheDead:0,fame:0,lab:'',pantry:Array(16).fill(null),lock:null}))});
await writeRecord(DB,admin,'itens.json',{content:base64Text('[]')});
const server=createServer(async(req,res)=>{
  try{
    // Test-only identity injection: this file is never included in the Sites build or local dev server.
    const headers=new Headers(req.headers);headers.set('oai-authenticated-user-id',admin.id);headers.set('oai-authenticated-user-email',admin.email);
    const init={method:req.method,headers};if(!['GET','HEAD'].includes(req.method)){init.body=req;init.duplex='half';}
    const response=await worker.fetch(new Request('http://127.0.0.1:8788'+req.url,init),{DB});
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(e){res.writeHead(500);res.end(String(e));}
});
await new Promise(resolve=>server.listen(8788,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const results=[];
try{
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
    const page=await browser.newPage({viewport});const errors=[],external=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8788')&&!r.url().startsWith('data:'))external.push(r.url());});
    await page.goto('http://127.0.0.1:8788/');await page.waitForFunction(()=>typeof window.startNewCharacter==='function');
    await page.locator('#newCharacterBtn').click();
    await page.locator('[data-field="identity.name"]').fill('Teste '+viewport.width);
    await page.locator('#githubUploadBtn').click();await page.locator('#githubSubmitBtn').click();
    await page.waitForFunction(()=>document.querySelector('#autosaveFeedback').textContent==='Ficha salva no Sites.');
    const name='teste_'+viewport.width+'.json';
    const saved=await page.evaluate(async name=>{const r=await fetch('/api/raw?path=fichas/'+name);return r.json();},name);
    assert.equal(saved.identity.name,'Teste '+viewport.width);
    // Test the real UI import path with a file; then re-save through the backend.
    await page.evaluate(()=>{document.querySelector('#startModal').hidden=false;});
    await page.locator('#localSheetInput').setInputFiles({name:'importado.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({identity:{name:'Importado '+viewport.width},custom:{value:'preservado'}}))});
    await page.waitForFunction(width=>document.querySelector('[data-field="identity.name"]').value==='Importado '+width,viewport.width);
    const importedSave=page.waitForResponse(r=>r.url().includes('/api/bundle')&&r.request().method()==='POST');
    await page.locator('#githubUploadBtn').click();await page.locator('#githubSubmitBtn').click();const savedResponse=await importedSave;assert.equal(savedResponse.status(),200,await savedResponse.text());
    await page.waitForFunction(()=>!document.querySelector('#githubUploadBtn').disabled);
    const data=await page.evaluate(async width=>(await fetch('/api/raw?path=fichas/importado_'+width+'.json')).json(),viewport.width);assert.equal(data.custom.value,'preservado');
    await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=2;canvas.height=2;pendingCharacterImage={dataUrl:canvas.toDataURL('image/png'),extension:'png'};setPath(state,'advantages.quintessence',4);});
    let saveResponse=page.waitForResponse(r=>r.url().includes('/api/bundle')&&r.request().method()==='POST');
    await page.locator('#githubUploadBtn').click();await page.locator('#githubSubmitBtn').click();assert.equal((await saveResponse).status(),200);await page.waitForFunction(()=>!document.querySelector('#githubUploadBtn').disabled);
    await page.evaluate(async width=>loadSheetFromGithub('importado_'+width+'.json'),viewport.width);
    await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=3;canvas.height=3;pendingCharacterImage={dataUrl:canvas.toDataURL('image/png'),extension:'png'};});
    saveResponse=page.waitForResponse(r=>r.url().includes('/api/bundle')&&r.request().method()==='POST');
    await page.locator('#githubUploadBtn').click();await page.locator('#githubSubmitBtn').click();assert.equal((await saveResponse).status(),200);await page.waitForFunction(()=>!document.querySelector('#githubUploadBtn').disabled);
    await page.locator('#covenEditBtn').click();await page.waitForFunction(()=>window.eval('covenEditMode'));
    await page.evaluate(async()=>transferCharacterResourceToCoven('quintessence',1));
    assert.equal(await page.evaluate(()=>getPath(state,'advantages.quintessence')),2);
    const covenSaved=await page.evaluate(async()=>(await fetch('/api/raw?path=fichas/coven.json')).json());assert.ok(covenSaved.quintessence>=1);
    await page.locator('#covenEditBtn').click();await page.waitForFunction(()=>!window.eval('covenEditMode'));
    const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
    assert.ok(size.scroll<=size.width+1,`Overflow ${size.scroll}/${size.width}`);
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    results.push({viewport,save:true,import:true,unknownFields:true,imageReplacement:true,covenTransfer:true,noExternalRequests:true,noPageErrors:true,noOverflow:true});await page.close();
  }
  const page=await browser.newPage();await page.goto('http://127.0.0.1:8788/itens.html');await page.locator('#accessForm button[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('#inventoryApp').hidden);await page.locator('#newItemBtn').click();await page.locator('#itemName').fill('Item Teste');
  // Inventory form has required effects; verify the page is available without a password/PAT.
  assert.equal(await page.locator('#passwordInput').isVisible(),false);results.push({inventory:true,noPassword:true});await page.close();
  console.log(JSON.stringify(results,null,2));await writeFile('work/sites-browser-results.json',JSON.stringify(results,null,2)+'\n');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));DB.close();}
