/* Sites-only transport for the existing inventory page. */
(() => {
  const versions=new Map();
  window.mageItemsSession=async()=>{const response=await fetch('/api/session');const user=await response.json();if(!response.ok||!user.role)throw new Error(user.error||'Solicite autorização ao narrador.');return user;};
  window.mageItemsRead=async()=>{const response=await fetch('/api/record?path=itens.json');if(!response.ok)throw new Error('Não foi possível carregar o inventário.');const value=await response.json();versions.set('itens.json',value.version);return JSON.parse(base64ToText(value.content));};
  const write=async(path,content)=>{const response=await fetch('/api/record?path='+encodeURIComponent(path),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({content,version:versions.get(path)||null})});const value=await response.json();if(!response.ok)throw new Error(value.error);versions.set(path,value.version);};
  upsertGitHubFileBase64=(_r,_b,path,content)=>write(path,content);
  upsertGitHubFile=(_r,_b,path,content)=>write(path,textToBase64(content));
})();
