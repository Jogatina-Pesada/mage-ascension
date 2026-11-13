import sourceManifest from './source-manifest.json' with {type:'json'};
import { HttpError, json, requireAdmin, readBody } from './auth.mjs';
import { recordKind, lookup, dataRoute } from './data.mjs';

// Import only audited, immutable repository files. No user-supplied origin or owner is accepted.
export async function importExisting(request, env, user, fetchSource=fetch) {
  requireAdmin(user);
  if(request.method==='GET') {
    const records=[];
    for(const entry of sourceManifest.records)records.push({path:entry.path,exists:!!await lookup(env.DB,entry.path)});
    return json({records});
  }
  if(request.method!=='POST')throw new HttpError(405,'Método não permitido.');
  const body=await readBody(request,4096);
  if(!body||typeof body.path!=='string')throw new HttpError(400,'Informe o caminho do arquivo.');
  const entry=sourceManifest.records.find(item=>item.path===body.path);
  if(!entry)throw new HttpError(400,'Arquivo fora do inventário de migração.');
  // An existing record belongs to its current user and is never replaced by this importer.
  if(await lookup(env.DB,entry.path))return json({path:entry.path,skipped:true});
  const url=`https://raw.githubusercontent.com/${sourceManifest.repository}/${sourceManifest.commit}/${entry.path.split('/').map(encodeURIComponent).join('/')}`;
  let response;
  try{response=await fetchSource(url,{redirect:'error',signal:AbortSignal.timeout(20000)});}catch{throw new HttpError(502,'Não foi possível ler o arquivo original. Tente novamente.');}
  if(!response.ok)throw new HttpError(502,'Arquivo original indisponível: '+entry.path);
  if(Number(response.headers.get('Content-Length'))>entry.bytes)throw new HttpError(502,'Tamanho do arquivo original não confere.');
  const reader=response.body.getReader(),chunks=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>entry.bytes){await reader.cancel();throw new HttpError(502,'Arquivo original excede o tamanho auditado.');}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),n=>n.toString(16).padStart(2,'0')).join('');
  if(size!==entry.bytes||digest!==entry.sha256)throw new HttpError(502,'Integridade do arquivo original não confere.');
  let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
  const restore=new Request(new URL('/api/restore',request.url),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({format:'mage-sites-backup-v1',apply:true,records:[{path:entry.path,kind:recordKind(entry.path),owner_id:user.id,content:btoa(binary),source_sha256:digest,list_name:entry.listName}]})});
  try{const result=await dataRoute(restore,env,user);return json({path:entry.path,...await result.json()});}
  catch(error){if(error.status===409&&await lookup(env.DB,entry.path))return json({path:entry.path,skipped:true});throw error;}
}
