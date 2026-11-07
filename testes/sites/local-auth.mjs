import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const child=spawn(process.execPath,['sites/scripts/dev.mjs'],{stdio:['ignore','pipe','pipe']});
try{
  await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Servidor local não iniciou.')),10000);child.stdout.on('data',()=>{clearTimeout(timeout);resolve();});child.on('exit',code=>{clearTimeout(timeout);reject(new Error('Servidor local terminou: '+code));});});
  const response=await fetch('http://127.0.0.1:8787/api/records',{headers:{'oai-authenticated-user-id':'fake-admin','oai-authenticated-user-email':'owner@example.test'}});
  assert.equal(response.status,401);assert.equal((await fetch('http://127.0.0.1:8787/')).status,200);
  console.log('PASS: servidor local rejeita headers de identidade forjados e serve a interface offline.');
}finally{child.kill('SIGTERM');}
