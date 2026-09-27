function updateAutosaveCountdown() {
  const indicator = document.getElementById('autosaveIndicator');
  const countdown = document.getElementById('autosaveCountdown');

  if (!autosaveAuth) {
    indicator.hidden = true;
    return;
  }

  indicator.hidden = false;
  countdown.textContent = `Autosave em ${formatDuration(autosaveNextAt - Date.now())}`;
}

function scheduleAutosave() {
  if (!autosaveAuth) return;
  window.clearTimeout(autosaveTimer);
  autosaveNextAt = Date.now() + autosaveIntervalMs;
  updateAutosaveCountdown();
  autosaveTimer = window.setTimeout(runAutosave, autosaveIntervalMs);
}

function startAutosave(auth) {
  autosaveAuth = auth;
  window.clearInterval(autosaveTickTimer);
  autosaveTickTimer = window.setInterval(updateAutosaveCountdown, 1000);
  scheduleAutosave();
}

async function removeGitHubSheetFile({ repo, branch, sheetsPath, token }, fileName, replacementFileName = '') {
  if (!fileName || fileName === replacementFileName) return '';
  const sheetPath = joinGitHubPath(sheetsPath, fileName);
  const existingFile = await getGitHubFile(repo, branch, sheetPath, token);
  if (!existingFile?.sha) return '';
  await deleteGitHubFile(repo, branch, sheetPath, `Remove ficha antiga ${fileName}`, token, existingFile.sha);
  return sheetPath;
}

async function uploadSheetToGithub({ repo, branch, sheetsPath, token }, fileName, content, message, previousFileName = '') {
  const sheetPath = joinGitHubPath(sheetsPath, fileName);
  await upsertGitHubFile(repo, branch, sheetPath, content, message, token);
  await updateGitHubManifest(repo, branch, sheetsPath, fileName, token, previousFileName);
  await removeGitHubSheetFile({ repo, branch, sheetsPath, token }, previousFileName, fileName);
  currentSheetFile = fileName;
  return sheetPath;
}

async function uploadLineageToGithub(auth, message) {
  if (!lineageHasData() || !lineageName()) return '';
  ensureLineageDefaults();
  const previousFileName = currentLineageFile && currentLineageFile !== lineageFileName() ? currentLineageFile : '';
  const previousName = previousFileName ? previousFileName.replace(/\.json$/i, '') : '';
  const lineagePath = joinGitHubPath(auth.sheetsPath, lineageRelativePath());
  await upsertGitHubFile(auth.repo, auth.branch, lineagePath, lineageJson(), message, auth.token);
  await updateGitHubManifest(
    auth.repo,
    auth.branch,
    joinGitHubPath(auth.sheetsPath, 'linhagens'),
    lineageFileName(),
    auth.token,
    previousFileName,
    lineageName()
  );
  if (previousFileName) {
    await updateLineageReferencesOnGithub(auth, previousName, lineageName());
    await removeGitHubSheetFile(
      { ...auth, sheetsPath: joinGitHubPath(auth.sheetsPath, 'linhagens') },
      previousFileName,
      lineageFileName()
    );
  }
  currentLineageFile = lineageFileName();
  return lineagePath;
}

async function runAutosave() {
  if (!autosaveAuth) return;

  try {
    ensureHealthDamage();
    ensureNumberDefaults();
    await pullLatestLineage(autosaveAuth);
    if (!covenEditMode) await loadCoven(autosaveAuth);
    const content = sheetJson();
    const lineageContent = lineageHasData() && lineageName() ? lineageJson() : '';
    const covenContent = covenEditMode ? covenJson() : '';
    const autosaveContent = `${content}\n---lineage---\n${lineageContent}\n---coven---\n${covenContent}\n---image---\n${pendingCharacterImage?.dataUrl || ''}`;
    if (autosaveContent === autosaveLastSavedJson) {
      console.log('[autosave] Nenhuma alteração para enviar.');
      scheduleAutosave();
      return;
    }

    const fileName = currentSheetName();
    const previousFileName = currentSheetFile && currentSheetFile !== fileName ? currentSheetFile : '';
    const sheetPath = await uploadSheetToGithub(
      autosaveAuth,
      fileName,
      content,
      `Autosave ficha ${fileName}`,
      previousFileName
    );
    const lineagePath = await uploadLineageToGithub(autosaveAuth, `Autosave linhagem ${lineageFileName()}`);
    const covenPath = await uploadCovenToGithub(autosaveAuth, 'Autosave coven');
    const imageRelativePath = await uploadCharacterImageToGithub(autosaveAuth, `Autosave imagem ${characterImageFileName()}`);
    const removedImagePath = await removeCharacterImageFromGithub(autosaveAuth, imageRelativePath);
    const imagePath = imageRelativePath ? joinGitHubPath(autosaveAuth.sheetsPath, imageRelativePath) : removedImagePath;
    autosaveLastSavedJson = `${content}\n---lineage---\n${lineageContent}\n---coven---\n${covenPath ? covenJson() : ''}\n---image---\n`;
    document.getElementById('githubUploadBtn').title = imagePath
      ? `Ficha enviada para ${autosaveAuth.repo}/${sheetPath} e ${imagePath}`
      : lineagePath
      ? `Ficha enviada para ${autosaveAuth.repo}/${sheetPath} e ${lineagePath}`
      : `Ficha enviada para ${autosaveAuth.repo}/${sheetPath}`;
    console.log(`[autosave] Ficha salva com sucesso em ${autosaveAuth.repo}/${sheetPath}.`);
    setAutosaveFeedback('Ficha salva com sucesso.');
  } catch (err) {
    console.error('[autosave] Falha ao salvar ficha.', err);
    setAutosaveFeedback('Falha no autosave.', true);
  } finally {
    scheduleAutosave();
  }
}
