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
    if(/^fichas\/[^/]+\.json$/.test(path)&&!['fichas/coven.json','fichas/listas.json','fichas/itens.json'].includes(path))body.listName=selectedCharacterList||'default';
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
    if(response.ok&&response.headers.get('X-Mage-Asset-Versions')){for(const [path,version] of Object.entries(JSON.parse(response.headers.get('X-Mage-Asset-Versions'))))versions.set(path,version);}
    return response;
  };
  githubSheetsRawBase=()=>location.origin+'/api/source/fichas';
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
  let saving=false;
  const saveToSites=async(interactive=true)=>{
    if(saving)return;
    if(!requireCharacterName()||!requireLineageName()||(interactive&&!captureGithubCharacterList()))return;
    saving=true;
    const button=document.getElementById('githubUploadBtn'),submit=document.getElementById('githubSubmitBtn');button.disabled=true;submit.disabled=true;
    try{
      await verifyGithubUser();ensureHealthDamage();ensureNumberDefaults();
      const fileName=currentSheetName(),path='fichas/'+fileName,previous=currentSheetFile&&currentSheetFile!==fileName?currentSheetFile:'';
      const pendingImage=pendingCharacterImage;
      if(pendingImage)ensureCharacterImagePath();
      const records=[{path,content:textToBase64(sheetJson()),version:versions.get(path)||null,listName:selectedCharacterList||'default'}];
      if(pendingImage){const imagePath='fichas/'+ensureCharacterImagePath();records.push({path:imagePath,content:dataUrlBase64(pendingImage.dataUrl),version:versions.get(imagePath)||null});}
      const previousLineageFile=currentLineageFile;
      if(lineageHasData()&&lineageName()){const lineagePath='fichas/'+lineageRelativePath();records.push({path:lineagePath,content:textToBase64(lineageJson()),version:versions.get(lineagePath)||null});}
      const result=await api('/api/bundle',{method:'POST',body:JSON.stringify({records})});
      for(const row of result)versions.set(row.path,row.version);
      if(pendingCharacterImage===pendingImage)pendingCharacterImage=null;
      currentSheetFile=fileName;
      if(previous)await removeGitHubSheetFile(auth(),previous,fileName);
      if(lineageHasData()&&lineageName()){
        if(previousLineageFile&&previousLineageFile!==lineageFileName()){
          await updateLineageReferencesOnGithub(auth(),previousLineageFile.replace(/\.json$/i,''),lineageName());
          await removeGitHubSheetFile({...auth(),sheetsPath:'fichas/linhagens'},previousLineageFile,lineageFileName());
        }
        currentLineageFile=lineageFileName();
      }
      await removeCharacterImageFromGithub(auth(),getPath(state,'identity.image',''));
      if(interactive){startAutosave(auth());closeGithubModal();}
      setAutosaveFeedback('Ficha salva no Sites.');
    }catch(error){setGithubModalStatus(error.message);setAutosaveFeedback(error.message,true);}finally{saving=false;button.disabled=false;submit.disabled=false;}
  };
  runAutosave=async()=>{if(!autosaveAuth)return;try{await saveToSites(false);if(covenEditMode)await uploadCovenToGithub(auth(),'Autosave coven');}catch(error){setAutosaveFeedback(error.message,true);}finally{scheduleAutosave();}};
  openGithubModal=async()=>{
    if(!requireCharacterName())return;
    try{await verifyGithubUser();document.getElementById('githubModalTitle').textContent='Salvar no Sites';
      for(const id of ['githubUser','githubPat','newGithubCharacterListPassword']){const field=document.getElementById(id);field.required=false;field.closest('label').hidden=true;}
      document.getElementById('githubListResetFields').hidden=true;
      document.getElementById('githubSubmitBtn').textContent='Salvar ficha';
      setGithubModalStatus('');await prepareGithubCharacterLists();document.getElementById('githubModal').hidden=false;
    }catch(error){setAutosaveFeedback(error.message,true);}
  };
  uploadJsonToGithub=event=>{event.preventDefault();return saveToSites();};
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
  const links=document.createElement('div');links.className='sites-session-bar';
  links.style.cssText='display:flex;gap:1rem;align-items:center;justify-content:flex-end;flex-wrap:wrap;padding:.5rem';
  const sessionStatus=document.createElement('span');sessionStatus.setAttribute('role','status');sessionStatus.textContent='Verificando sessão…';links.append(sessionStatus);
  const signIn=document.createElement('a');signIn.textContent='Entrar com ChatGPT';signIn.href='/signin-with-chatgpt?return_to=%2F';signIn.target='_top';signIn.hidden=true;links.append(signIn);
  const signOut=document.createElement('a');signOut.textContent='Sair';signOut.href='/signout-with-chatgpt?return_to=%2F';signOut.target='_top';signOut.hidden=true;links.append(signOut);
  const importButton=document.createElement('button');importButton.type='button';importButton.textContent='Importar fichas originais';importButton.hidden=true;links.append(importButton);
  document.body.prepend(links);
  let importing=null;
  async function importOriginalRecords(){
    if(identity?.role!=='admin')return;
    if(importing)return importing;
    importing=(async()=>{
      importButton.disabled=true;
      try{
        const manifest=await api('/api/import-existing');const pending=manifest.records.filter(row=>!row.exists);
        for(let i=0;i<pending.length;i++){
          const message=`Importando acervo original: ${i+1}/${pending.length}…`;sessionStatus.textContent=message;setStartModalStatus(message);
          await api('/api/import-existing',{method:'POST',body:JSON.stringify({path:pending[i].path})});
        }
        importButton.hidden=true;sessionStatus.textContent='Conectada como narradora. Acervo disponível.';await loadCoven();
      }catch(error){sessionStatus.textContent=error.message;importButton.hidden=false;throw error;}
      finally{importButton.disabled=false;importing=null;}
    })();return importing;
  }
  const loadSavedSheets=loadGitSheetList;
  loadGitSheetList=async()=>{
    try{
      await verifyGithubUser();
      await importOriginalRecords();
      await loadSavedSheets();
    }catch(error){setStartModalStatus(error.message);}
  };
  importButton.addEventListener('click',async()=>{try{await importOriginalRecords();await loadSavedSheets();}catch(error){setStartModalStatus(error.message);}});
  api('/api/session').then(async user=>{
    identity=user;signIn.hidden=true;signOut.hidden=false;
    if(user.role){covenSyncAuth=auth();sessionStatus.textContent=user.role==='admin'?'Conectada como narradora.':'Conta conectada.';}
    else{sessionStatus.textContent='Conta conectada, mas sem autorização. Solicite acesso ao narrador.';return;}
    if(user.role==='admin'){const manifest=await api('/api/import-existing');importButton.hidden=!manifest.records.some(row=>!row.exists);}
  }).catch(error=>{signIn.hidden=error.status!==401;sessionStatus.textContent=error.status===401?'Entre com ChatGPT para acessar suas fichas.':error.message;});
})();
