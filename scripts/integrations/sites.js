/* Loaded only by the Sites build, before bootstrap. The original GitHub/local build is unchanged. */
(() => {
  'use strict';
  const versions = new Map();
  let identity = null;
  const nativeFetch = window.fetch.bind(window);
  const api = async (url, options={}) => {
    const response = await nativeFetch(url,{...options,headers:{'Content-Type':'application/json',...options.headers}});
    if(!response.ok){let value;try{value=await response.json();}catch{}const error=new Error(value?.error||`Erro ${response.status}`);error.status=response.status;if(response.status===401){window.clearTimeout(autosaveTimer);setAutosaveFeedback('Sessão expirada. Exporte suas alterações antes de entrar novamente.',true);}throw error;}
    return response.json();
  };
  const auth = () => ({user:identity?.email||'ChatGPT',repo:defaultGithubRepo,branch:defaultGithubBranch,sheetsPath:'fichas',sites:true});
  const recordUrl=path=>'/api/record?path='+encodeURIComponent(path);
  const read=async path=>{try{const value=await api(recordUrl(path));versions.set(path,value.version);return {content:value.content,sha:value.version};}catch(e){if(e.status===404)return null;throw e;}};
  const write=async(path,content,version)=>{
    const body={content,version:version??null,sessionId:covenEditorSessionId};
    if(path==='fichas/coven.json') {
      const data=JSON.parse(base64ToText(content));if(data.lock)data.lock.userId=identity?.id;
      body.content=textToBase64(JSON.stringify(data,null,2));
    }
    const result=await api(recordUrl(path),{method:'PUT',body:JSON.stringify(body)});versions.set(path,result.version);return {content:{sha:result.version},sha:result.version};
  };
  // Track the version actually read by the editor. Never fetch a newer version immediately before saving.
  window.fetch=async(input,options)=>{
    const response=await nativeFetch(input,options);const url=new URL(typeof input==='string'?input:input.url||input,location.href);
    if(url.origin===location.origin&&response.ok&&response.headers.get('ETag')&&url.pathname.startsWith('/api/source/'))versions.set(decodeURIComponent(url.pathname.slice('/api/source/'.length)),response.headers.get('ETag'));
    return response;
  };
  getGitHubFile=(_repo,_branch,path)=>read(path);
  putGitHubFileBase64=(_repo,_branch,path,content,_message,_token,sha=null)=>write(path,content,sha);
  putGitHubFile=(_repo,_branch,path,content,_message,_token,sha=null)=>write(path,textToBase64(content),sha);
  upsertGitHubFileBase64=(_repo,_branch,path,content)=>write(path,content,versions.get(path));
  upsertGitHubFile=(_repo,_branch,path,content)=>write(path,textToBase64(content),versions.get(path));
  deleteGitHubFile=async(_repo,_branch,path,_message,_token,sha)=>{await api(recordUrl(path),{method:'DELETE',body:JSON.stringify({version:sha})});versions.delete(path);};
  verifyGithubUser=async()=>{identity=await api('/api/session');if(!identity.role)throw new Error('Solicite autorização ao narrador.');};
  // Manifests are synthesized server-side from authorized records, not writable client ACLs.
  updateGitHubManifest=async()=>{};
  updateCharacterListsOnGithub=async()=>{};
  openGithubModal=async()=>{
    if(!requireCharacterName()||!requireLineageName())return;
    const button=document.getElementById('githubUploadBtn');button.disabled=true;
    try{
      await verifyGithubUser();ensureHealthDamage();ensureNumberDefaults();
      await uploadCharacterImageToGithub(auth(),'Salva imagem');
      const fileName=currentSheetName(),previous=currentSheetFile&&currentSheetFile!==fileName?currentSheetFile:'';
      await uploadSheetToGithub(auth(),fileName,sheetJson(),'Salva ficha',previous);
      await uploadLineageToGithub(auth(),'Salva linhagem');
      await removeCharacterImageFromGithub(auth(),getPath(state,'identity.image',''));
      startAutosave(auth());setAutosaveFeedback('Ficha salva no Sites.');
    }catch(error){setAutosaveFeedback(error.message,true);}finally{button.disabled=false;}
  };
  openCovenGithubModal=async()=>{try{await verifyGithubUser();covenSyncAuth=auth();await beginCovenEditing();}catch(error){setCovenStatus(error.message,true);}};
  const transfer=transferCharacterResourceToCoven;
  let transferBusy=false;
  transferCharacterResourceToCoven=async(resource,direction)=>{
    if(transferBusy)return;
    if(!currentSheetFile||!versions.has('fichas/'+currentSheetFile)){setCovenStatus('Salve a ficha no Sites antes de transferir recursos.',true);return;}
    transferBusy=true;
    const beforeSheet=getPath(state,'advantages.'+resource,0),beforeCoven=covenState[resource];
    try{
      transfer(resource,direction);
      if(beforeSheet===getPath(state,'advantages.'+resource,0))return;
      const covenData=JSON.parse(covenJson());if(covenData.lock)covenData.lock.userId=identity?.id;
      const result=await api('/api/bundle',{method:'POST',body:JSON.stringify({records:[
        {path:'fichas/'+currentSheetFile,content:textToBase64(sheetJson()),version:versions.get('fichas/'+currentSheetFile)},
        {path:'fichas/coven.json',content:textToBase64(JSON.stringify(covenData)),version:versions.get('fichas/coven.json'),sessionId:covenEditorSessionId}
      ]})});
      for(const row of result)versions.set(row.path,row.version);
      setCovenStatus('Recursos transferidos e salvos.');
    }catch(error){setPath(state,'advantages.'+resource,beforeSheet);covenState[resource]=beforeCoven;renderFields();renderCoven();setCovenStatus(error.message,true);}finally{transferBusy=false;}
  };
  const priorApply=applySheetData;
  applySheetData=(...args)=>{
    // Loading another document must never auto-save it with the previous document's session.
    window.clearTimeout(autosaveTimer);window.clearInterval(autosaveTickTimer);autosaveAuth=null;autosaveLastSavedJson='';
    priorApply(...args);updateAutosaveCountdown();
  };
  // Keep all existing selectors, icons and layout; label the changed persistence action accurately.
  document.getElementById('githubUploadBtn').title='Salvar no Sites';
  document.getElementById('githubUploadBtn').setAttribute('aria-label','Salvar no Sites');
  document.getElementById('loadGitSheetsBtn').textContent='Carregar fichas salvas';
  const links=document.createElement('div');links.style.cssText='display:flex;gap:1rem;justify-content:flex-end;padding:.5rem';
  for(const [label,href] of [['Entrar com ChatGPT','/signin-with-chatgpt?return_to=%2F'],['Sair','/signout-with-chatgpt?return_to=%2F']]){const a=document.createElement('a');a.textContent=label;a.href=href;a.target='_top';links.append(a);}
  document.body.prepend(links);
  api('/api/session').then(user=>{identity=user;if(user.role)covenSyncAuth=auth();else setAutosaveFeedback('Solicite autorização ao narrador. Seu ID: '+user.id,true);}).catch(error=>setAutosaveFeedback(error.message,true));
})();
