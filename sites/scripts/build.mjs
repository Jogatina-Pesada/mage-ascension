import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '../..');
const assets = {};
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'};
async function add(file) {
  const data = await readFile(path.join(root, file));
  let content = data.toString('utf8');
  if(file.endsWith('.html')) content = content.replace('<head>', '<head><script>window.mageSitesMode=true;</script>');
  if(file === 'index.html') content = content.replace('<script src="scripts/bootstrap.js">', '<script src="scripts/integrations/sites.js"></script>\n  <script src="scripts/bootstrap.js">');
  if(file === 'itens.html') content=content.replace('<script src="scripts/items-inventory.js">', '<script src="scripts/integrations/sites-items.js"></script><script src="scripts/items-inventory.js">');
  assets['/'+file] = {type:mime[path.extname(file)], body:path.extname(file)==='.png' ? data.toString('base64'):content, binary:path.extname(file)==='.png'};
}
async function directory(dir) {for(const entry of await readdir(path.join(root,dir),{withFileTypes:true})){const file=dir+'/'+entry.name;if(entry.isDirectory()) await directory(file);else if(mime[path.extname(file)]) await add(file);}}
for(const file of ['index.html','wiki.html','itens.html','style.css','itens.css','prompt.js','app.js']) await add(file);
await directory('scripts');await directory('assets');
// Never include character records, passwords, images or migration backups as public assets.
await rm(path.join(root,'dist'),{recursive:true,force:true});
await mkdir(path.join(root,'dist/server'),{recursive:true});
let code='const bundledAssets = '+JSON.stringify(assets)+';\n';
for(const name of ['auth.mjs','data.mjs','worker.mjs']) {
  const file=path.join(root,'sites/server',name);
  let source;try{source=await readFile(file,'utf8');}catch(e){if(e.code==='ENOENT')continue;throw e;}
  code+=source.replace(/^import .*;\n/gm,'').replace(/^export (?!default)/gm,'')+'\n';
}
await writeFile(path.join(root,'dist/server/index.js'),code);
console.log(`Built Worker with ${Object.keys(assets).length} public assets; character data excluded.`);
