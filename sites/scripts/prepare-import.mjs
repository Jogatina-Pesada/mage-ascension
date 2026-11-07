import {readFile,readdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import { recordKind, decodeContent } from '../server/data.mjs';
const args=process.argv.slice(2);const get=key=>args[args.indexOf(key)+1];
if(!args.includes('--owners'))throw new Error('Use --owners arquivo.json [--output work/import.json]. Sem output, somente valida.');
const root=path.resolve(import.meta.dirname,'../..'),owners=JSON.parse(await readFile(get('--owners'),'utf8'));
if(!owners.adminId||!owners.byPath||typeof owners.byPath!=='object')throw new Error('Owners exige adminId e byPath. IDs devem vir de /api/session do Site de destino.');
const records=[];
async function walk(dir){for(const entry of await readdir(path.join(root,dir),{withFileTypes:true})){const rel=dir+'/'+entry.name;if(entry.isDirectory())await walk(rel);else await add(rel);}}
async function add(rel){if(rel.endsWith('/index.json'))return;let kind;try{kind=recordKind(rel);}catch{throw new Error('Arquivo sem política de migração: '+rel);}const bytes=await readFile(path.join(root,rel));const content=bytes.toString('base64');decodeContent(content,kind);records.push({path:rel,kind,owner_id:owners.byPath[rel]||owners.adminId,content,source_sha256:createHash('sha256').update(bytes).digest('hex')});}
await walk('fichas');await walk('imagens');await add('itens.json');
const backup={format:'mage-sites-backup-v1',createdAt:new Date().toISOString(),records,access:owners.access||[]};
if(args.includes('--output'))await writeFile(get('--output'),JSON.stringify(backup),{flag:'wx',mode:0o600});
console.log(JSON.stringify({validRecords:records.length,bytes:records.reduce((n,r)=>n+Buffer.from(r.content,'base64').length,0),written:args.includes('--output'),applied:false}));
