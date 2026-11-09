import { HttpError, json, requireAdmin, readBody } from './auth.mjs';
export function recordKind(path) {
  if(typeof path!=='string' || path.length>240 || !/^[a-zA-Z0-9_./-]+$/.test(path) || path.split('/').some(x=>!x||x==='.'||x==='..')) throw new HttpError(400,'Caminho inválido.');
  if(path==='fichas/coven.json') return 'coven';
  if(path==='fichas/listas.json') return 'lists';
  if(path==='itens.json'||path==='fichas/itens.json') return 'catalog';
  if(/^fichas\/linhagens\/[\w-]+\.json$/.test(path)&&!path.endsWith('/index.json'))return 'lineage';
  if(/^fichas\/[\w-]+\.json$/.test(path)&&!path.endsWith('/index.json'))return 'sheet';
  if(/^(fichas\/)?imagens\/[\w/.-]+\.(png|jpe?g|webp|gif)$/.test(path))return 'image';
  throw new HttpError(400,'Tipo de registro não suportado.');
}
export function decodeContent(content,kind) {
  if(typeof content!=='string'||content.length>3*1024*1024)throw new HttpError(413,'Conteúdo ausente ou muito grande.');
  let bytes;try{bytes=Uint8Array.from(atob(content),x=>x.charCodeAt(0));}catch{throw new HttpError(400,'Base64 inválido.');}
  if(kind==='image') {
    const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
    const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
    const gif=new TextDecoder().decode(bytes.slice(0,6)).startsWith('GIF8');
    const webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
    if(!png&&!jpeg&&!gif&&!webp)throw new HttpError(400,'Imagem inválida.');
    return {bytes,data:null};
  }
  let data;try{data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw new HttpError(400,'JSON inválido.');}
  if(!data||typeof data!=='object'||(kind!=='catalog'&&Array.isArray(data)))throw new HttpError(400,'Documento inválido.');
  const scan=(v,depth=0)=>{if(depth>60)throw new HttpError(400,'Documento muito profundo.');if(typeof v==='number'&&!Number.isFinite(v))throw new HttpError(400,'Número inválido.');if(v&&typeof v==='object')for(const [k,child] of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k))throw new HttpError(400,'Campo inseguro.');scan(child,depth+1);}};scan(data);
  if(kind==='sheet'&&(!data.identity||typeof data.identity.name!=='string'||!data.identity.name.trim()))throw new HttpError(400,'Ficha sem nome.');
  if(kind==='lineage'&&typeof data.name!=='string')throw new HttpError(400,'Linhagem sem nome.');
  // Unknown fields are retained. Validate transport and structural invariants without normalizing legacy documents.
  return {bytes,data};
}
export async function lookup(db,path){return db.prepare('SELECT * FROM records WHERE path=?').bind(path).first();}
function storedImageKey(content){return typeof content==='string'&&content.startsWith('r2:')?content.slice(3):null;}
function mimeType(path){return path.endsWith('.png')?'image/png':path.endsWith('.webp')?'image/webp':path.endsWith('.gif')?'image/gif':'image/jpeg';}
async function imageBytes(env,row){
  const key=storedImageKey(row.content);
  if(!key)return Uint8Array.from(atob(row.content),c=>c.charCodeAt(0));
  if(!env.BUCKET)throw new HttpError(503,'Armazenamento de imagens não configurado.');
  const object=await env.BUCKET.get(key);if(!object)throw new HttpError(500,'Imagem armazenada não encontrada.');
  return new Uint8Array(await object.arrayBuffer());
}
function bytesBase64(bytes){let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(binary);}
async function exposedContent(env,row){return row.kind==='image'?bytesBase64(await imageBytes(env,row)):row.content;}
async function deleteObject(bucket,key){if(bucket&&key)try{await bucket.delete(key);}catch{/* An orphan is safe; the database reference remains authoritative. */}}
function requireImageBucket(env){if(!env.BUCKET)throw new HttpError(503,'Armazenamento de imagens não configurado.');return env.BUCKET;}
export async function canRead(db,user,row) {
  if(!row)return false;
  if(user.role==='admin'||row.owner_id===user.id||['coven','catalog'].includes(row.kind))return true;
  if(row.kind==='image'&&(/^(fichas\/)?imagens\/(coven|itens)\//.test(row.path)))return true;
  if(row.kind==='lists')return false;
  return !!await db.prepare('SELECT 1 AS ok FROM record_access WHERE path=? AND user_id=?').bind(row.path,user.id).first();
}
export async function canWrite(db,user,row) {
  if(user.role==='admin'||row.owner_id===user.id||row.kind==='coven'||(row.kind==='image'&&row.path.startsWith('fichas/imagens/coven/')))return true;
  return !!await db.prepare("SELECT 1 AS ok FROM record_access WHERE path=? AND user_id=? AND permission='write'").bind(row.path,user.id).first();
}
export async function allowedRecords(db,user,kind=null) {
  const result=await db.prepare('SELECT * FROM records ORDER BY path').all();
  const rows=[];for(const row of result.results){if((!kind||row.kind===kind)&&await canRead(db,user,row))rows.push(row);}return rows;
}
export function base64Text(text) {const bytes=new TextEncoder().encode(text);let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary);}
export async function writeRecord(db,user,path,body,stage=false,bucket=null) {
  const kind=recordKind(path); const decoded=decodeContent(body.content,kind);
  const row=await lookup(db,path);
  if(row&&!await canWrite(db,user,row))throw new HttpError(404,'Registro não encontrado.');
  if(!row&&user.role!=='admin'&&!['sheet','lineage','image'].includes(kind))throw new HttpError(403,'Somente o narrador pode criar registros compartilhados.');
  if(body.ownerId!==undefined && body.ownerId!==user.id)requireAdmin(user);
  if(row&&body.ownerId!==undefined&&body.ownerId!==row.owner_id)throw new HttpError(400,'Use a operação administrativa de permissões para transferir propriedade.');
  if((row?.version??null)!==(body.version??null))throw new HttpError(409,'Outra sessão alterou este registro. Exporte suas alterações e recarregue antes de tentar novamente.');
  if(kind==='coven') {
    const prior=row?decodeContent(row.content,kind).data:null;
    const old=prior?.lock,next=decoded.data.lock,now=Date.now();
    if(old && Date.parse(old.expiresAt)>now) {
      if(old.userId!==user.id||body.sessionId!==old.sessionId)throw new HttpError(409,'Coven em edição por outra sessão.');
      if(next&&(next.sessionId!==old.sessionId||next.expiresAt!==old.expiresAt||next.userId!==user.id))throw new HttpError(409,'Não é permitido renovar ou transferir o lock durante a edição.');
    } else if(row) {
      // The timeout handler may save/release its own expired lock, but never another session's.
      if(!next) {
        if(!old||old.userId!==user.id||body.sessionId!==old.sessionId)throw new HttpError(409,'É necessário adquirir o lock do coven.');
      } else {
        if(typeof next.sessionId!=='string'||next.sessionId!==body.sessionId||next.userId!==user.id)throw new HttpError(400,'Lock inválido.');
        const expiry=Date.parse(next.expiresAt),acquired=Date.parse(next.acquiredAt);
        if(!Number.isFinite(expiry)||!Number.isFinite(acquired)||expiry<=now||expiry>now+600000||Math.abs(acquired-now)>30000||expiry-acquired>600000)throw new HttpError(400,'Lock deve expirar em até dez minutos.');
        // Acquiring a lock cannot also change the document.
        const a={...prior,lock:null},b={...decoded.data,lock:null};
        if(JSON.stringify(a)!==JSON.stringify(b))throw new HttpError(409,'Releia o coven antes de adquirir o lock.');
      }
    }
  }
  if(kind==='image' && user.role!=='admin'){
    if(/^imagens\//.test(path)||path.startsWith('fichas/imagens/itens/'))throw new HttpError(403,'Somente o narrador pode alterar imagens do catálogo.');
    if(path.startsWith('fichas/imagens/coven/')){const coven=await lookup(db,'fichas/coven.json');const lock=coven&&decodeContent(coven.content,'coven').data.lock;if(!lock||lock.userId!==user.id||lock.sessionId!==body.sessionId||Date.parse(lock.expiresAt)<=Date.now())throw new HttpError(409,'Adquira o lock do coven antes de enviar imagens.');}
  }
  const listName=body.listName??row?.list_name??'default';
  if(typeof listName!=='string'||!listName.trim()||listName.length>80)throw new HttpError(400,'Nome de lista inválido.');
  const version=crypto.randomUUID(),updated=new Date().toISOString();
  const previousImageKey=kind==='image'?storedImageKey(row?.content):null;
  const imageKey=kind==='image'&&bucket?`records/${path}/${version}`:null;
  if(imageKey)await bucket.put(imageKey,decoded.bytes,{httpMetadata:{contentType:mimeType(path)}});
  const storedContent=imageKey?`r2:${imageKey}`:body.content;
  let statement;
  if(row)statement= db.prepare('UPDATE records SET content=?,version=?,updated_at=?,list_name=?,source_sha256=NULL WHERE path=? AND version=?').bind(storedContent,version,updated,listName,path,row.version);
  else statement= db.prepare('INSERT INTO records(path,kind,owner_id,content,version,updated_at,list_name) VALUES(?,?,?,?,?,?,?) ON CONFLICT(path) DO NOTHING').bind(path,kind,body.ownerId||user.id,storedContent,version,updated,listName);
  if(stage)return {path,version,statement,expected:row?.version??null,imageKey,previousImageKey};
  try{
    const result=await statement.run();
    if(result.meta.changes!==1)throw new HttpError(409,'Conflito de gravação. Recarregue o registro.');
    await deleteObject(bucket,previousImageKey);
    return {path,version};
  }catch(error){await deleteObject(bucket,imageKey);throw error;}
}
export async function dataRoute(request,env,user) {
  const url=new URL(request.url), db=env.DB;
  if(url.pathname==='/api/session')return json(user);
  if(url.pathname==='/api/members') {
    requireAdmin(user);
    if(request.method==='GET')return json((await db.prepare('SELECT user_id,email,role,active FROM members ORDER BY email').all()).results);
    if(request.method!=='POST')throw new HttpError(405,'Método não permitido.');
    const b=await readBody(request);
    if(typeof b.id!=='string'||!b.id||b.id.length>200||typeof b.email!=='string'||!['admin','player'].includes(b.role))throw new HttpError(400,'Associação inválida.');
    // Avoid accidentally removing the final administrator.
    if(b.id===user.id&&(b.role!=='admin'||b.active===false))throw new HttpError(400,'Não remova seu próprio papel de narrador.');
    await db.prepare('INSERT INTO members(user_id,email,role,active) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET email=excluded.email,role=excluded.role,active=excluded.active').bind(b.id,b.email,b.role,b.active===false?0:1).run();return json({ok:true});
  }
  if(url.pathname==='/api/access') {
    requireAdmin(user);if(request.method!=='POST')throw new HttpError(405,'Método não permitido.');const b=await readBody(request);
    if(!await lookup(db,b.path)||typeof b.userId!=='string'||!['read','write','remove'].includes(b.permission))throw new HttpError(400,'Permissão inválida.');
    if(b.permission==='remove')await db.prepare('DELETE FROM record_access WHERE path=? AND user_id=?').bind(b.path,b.userId).run();
    else await db.prepare('INSERT INTO record_access(path,user_id,permission) VALUES(?,?,?) ON CONFLICT(path,user_id) DO UPDATE SET permission=excluded.permission').bind(b.path,b.userId,b.permission).run();return json({ok:true});
  }
  if(url.pathname==='/api/records'&&request.method==='GET')return json((await allowedRecords(db,user,url.searchParams.get('kind'))).map(r=>({path:r.path,kind:r.kind,version:r.version,ownerId:r.owner_id})));
  if(url.pathname==='/api/record') {
    const path=url.searchParams.get('path');recordKind(path);
    if(request.method==='PUT'){
      const kind=recordKind(path),bucket=kind==='image'?requireImageBucket(env):null;
      return json(await writeRecord(db,user,path,await readBody(request,4*1024*1024),false,bucket));
    }
    const row=await lookup(db,path);
    if(!await canRead(db,user,row))throw new HttpError(404,'Registro não encontrado.');
    if(request.method==='GET')return json({path,content:await exposedContent(env,row),version:row.version});
    if(request.method==='DELETE') {
      if(!await canWrite(db,user,row))throw new HttpError(404,'Registro não encontrado.');
      if(row.kind==='image'&&row.path.startsWith('fichas/imagens/coven/'))requireAdmin(user);
      if(row.kind==='coven')throw new HttpError(403,'O coven global não pode ser excluído.');
      const b=await readBody(request);if(!b.version)throw new HttpError(428,'Informe a versão lida.');
      const imageKey=row.kind==='image'?storedImageKey(row.content):null;
      if(imageKey)requireImageBucket(env);
      const result=await db.prepare('DELETE FROM records WHERE path=? AND version=?').bind(path,b.version).run();
      if(result.meta.changes!==1)throw new HttpError(409,'Conflito de exclusão.');await deleteObject(env.BUCKET,imageKey);return json({ok:true});
    }
    throw new HttpError(405,'Método não permitido.');
  }
  if(url.pathname==='/api/raw'&&request.method==='GET') {
    const path=url.searchParams.get('path');
    if(path==='fichas/index.json'||path==='fichas/linhagens/index.json') {
      const kind=path.includes('/linhagens/')?'lineage':'sheet';
      return json((await allowedRecords(db,user,kind)).map(r=>({file:r.path.slice(kind==='lineage'?17:7),name:decodeContent(r.content,r.kind).data.identity?.name||decodeContent(r.content,r.kind).data.name})));
    }
    // Password-based list restrictions are replaced by server authorization; only return authorized names.
    if(path==='fichas/listas.json') {
      const sheets=await allowedRecords(db,user,'sheet');
      const grouped=new Map([['default',[]]]);
      for(const row of sheets){const name=row.list_name||'default';if(!grouped.has(name))grouped.set(name,[]);grouped.get(name).push(row.path.slice(7));}
      return json({lists:[...grouped].map(([name,characters])=>({name,passwordHash:'',characters}))});
    }
    recordKind(path);const row=await lookup(db,path);if(!await canRead(db,user,row))throw new HttpError(404,'Registro não encontrado.');const decoded=row.kind==='image'?{bytes:await imageBytes(env,row)}:decodeContent(row.content,row.kind);
    let imageVersions={};
    if(row.kind==='sheet'&&typeof decoded.data.identity?.image==='string'){const imagePath='fichas/'+decoded.data.identity.image.replace(/^fichas\//,'');const image=await lookup(db,imagePath);if(image&&await canRead(db,user,image))imageVersions[imagePath]=image.version;}
    return new Response(decoded.bytes,{headers:{'Content-Type':row.kind==='image'?mimeType(path):'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','ETag':row.version,'X-Mage-Asset-Versions':JSON.stringify(imageVersions)}});
  }
  if(url.pathname==='/api/bundle'&&request.method==='POST') {
    const b=await readBody(request,8*1024*1024);
    if(!Array.isArray(b.records)||b.records.length<1||b.records.length>10||new Set(b.records.map(r=>r.path)).size!==b.records.length)throw new HttpError(400,'Lote inválido.');
    const staged=[];try{for(const record of b.records){const bucket=recordKind(record.path)==='image'?requireImageBucket(env):null;staged.push(await writeRecord(db,user,record.path,record,true,bucket));}}catch(error){for(const row of staged)await deleteObject(env.BUCKET,row.imageKey);throw error;}
    const statements=[];
    for(const row of staged){const guard=crypto.randomUUID();statements.push(db.prepare('INSERT INTO write_guards(id,ok) VALUES(?,CASE WHEN ((SELECT version FROM records WHERE path=?) IS ?) THEN 1 ELSE 0 END)').bind(guard,row.path,row.expected),row.statement,db.prepare('DELETE FROM write_guards WHERE id=?').bind(guard));}
    try{await db.batch(statements);}catch{for(const row of staged)await deleteObject(env.BUCKET,row.imageKey);throw new HttpError(409,'Conflito: o lote inteiro foi cancelado. Exporte suas alterações antes de recarregar.');}
    for(const row of staged)await deleteObject(env.BUCKET,row.previousImageKey);
    return json(staged.map(({path,version})=>({path,version})));
  }
  if(url.pathname==='/api/restore'&&request.method==='POST') {
    requireAdmin(user);const b=await readBody(request,32*1024*1024);
    if(b.format!=='mage-sites-backup-v1'||!Array.isArray(b.records)||b.records.length>1000)throw new HttpError(400,'Backup inválido.');
    const pending=[],seen=new Set();let skipped=0;
    for(const record of b.records){
      if(seen.has(record.path))throw new HttpError(400,'Caminho duplicado no backup.');seen.add(record.path);
      const kind=recordKind(record.path),decoded=decodeContent(record.content,kind);
      if(record.kind!==kind||typeof record.owner_id!=='string')throw new HttpError(400,'Metadados inválidos.');
      if(!await db.prepare('SELECT user_id FROM members WHERE user_id=?').bind(record.owner_id).first())throw new HttpError(400,'Cadastre todos os proprietários antes de restaurar.');
      const existing=await lookup(db,record.path);
      if(existing){if(await exposedContent(env,existing)===record.content&&existing.owner_id===record.owner_id&&existing.kind===kind&&existing.list_name===(record.list_name||'default')){skipped++;continue;}throw new HttpError(409,'A restauração não sobrescreve registros existentes: '+record.path);}
      const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',decoded.bytes)),x=>x.toString(16).padStart(2,'0')).join('');
      if(record.source_sha256&&record.source_sha256!==digest)throw new HttpError(400,'Hash de origem não confere.');
      pending.push({record,kind,bytes:decoded.bytes,digest,listName:typeof record.list_name==='string'&&record.list_name.length<=80?record.list_name:'default'});
    }
    const grants=[];
    for(const grant of b.access||[]){
      if(!seen.has(grant.path)||!['read','write'].includes(grant.permission)||!await db.prepare('SELECT user_id FROM members WHERE user_id=?').bind(grant.user_id).first())throw new HttpError(400,'Permissão de backup inválida.');
      // Existing grants are not weakened or replaced by a repeated restore.
      grants.push(grant);
    }
    if(b.apply===true&&pending.some(row=>row.kind==='image'))requireImageBucket(env);
    if(b.apply===true){
      const statements=[],uploaded=[];
      for(const row of pending){
        const version=crypto.randomUUID(),key=row.kind==='image'?`records/${row.record.path}/${version}`:null;
        if(key){try{await env.BUCKET.put(key,row.bytes,{httpMetadata:{contentType:mimeType(row.record.path)}});uploaded.push(key);}catch{for(const saved of uploaded)await deleteObject(env.BUCKET,saved);throw new HttpError(502,'Falha ao armazenar uma imagem. Nenhum registro foi restaurado.');}}
        statements.push(db.prepare('INSERT INTO records(path,kind,owner_id,content,version,updated_at,source_sha256,list_name) VALUES(?,?,?,?,?,?,?,?)').bind(row.record.path,row.kind,row.record.owner_id,key?`r2:${key}`:row.record.content,version,new Date().toISOString(),row.digest,row.listName));
      }
      for(const grant of grants)statements.push(db.prepare('INSERT INTO record_access(path,user_id,permission) VALUES(?,?,?) ON CONFLICT(path,user_id) DO NOTHING').bind(grant.path,grant.user_id,grant.permission));
      if(statements.length){try{await db.batch(statements);}catch{for(const key of uploaded)await deleteObject(env.BUCKET,key);throw new HttpError(409,'Conflito durante restauração; nenhuma alteração foi aplicada.');}}
    }
    return json({dryRun:b.apply!==true,inserted:b.records.length-skipped,skipped});
  }
  if(url.pathname==='/api/backup'&&request.method==='GET') {
    requireAdmin(user);const rows=(await db.prepare('SELECT * FROM records ORDER BY path').all()).results;
    const records=await Promise.all(rows.map(async row=>({...row,content:await exposedContent(env,row)})));
    return json({format:'mage-sites-backup-v1',createdAt:new Date().toISOString(),records,access:(await db.prepare('SELECT * FROM record_access ORDER BY path,user_id').all()).results,members:(await db.prepare('SELECT * FROM members ORDER BY user_id').all()).results});
  }
  throw new HttpError(404,'Rota não encontrada.');
}
