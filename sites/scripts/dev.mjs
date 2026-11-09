import { createServer } from 'node:http';
import { openDatabase } from './local-db.mjs';
import worker from '../../dist/server/index.js';
import { mkdirSync } from 'node:fs';
mkdirSync('work',{recursive:true});
const DB=openDatabase('work/mage-local.sqlite');
const args=process.argv.slice(2);
const option=(name,fallback)=>{const i=args.indexOf(name);return i>=0?args[i+1]||fallback:fallback;};
const port=Number(process.env.PORT||option('--port','8787'));
const host=process.env.HOST||option('--host','127.0.0.1');
const server=createServer(async(req,res)=>{
  try{
    const headers=new Headers(req.headers);
    // Local clients cannot forge Sites identity; there is intentionally no local login provider.
    for(const key of [...headers.keys()])if(key.startsWith('oai-'))headers.delete(key);
    const init={method:req.method,headers};if(!['GET','HEAD'].includes(req.method)){init.body=req;init.duplex='half';}
    const response=await worker.fetch(new Request('http://127.0.0.1:8787'+req.url,init),{DB});
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('Erro local.');}
});
server.listen(port,host,()=>console.log(`Local: http://${host}:${port} — edição/exportação offline; login ChatGPT somente no Sites.`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{DB.close();process.exit();}));
