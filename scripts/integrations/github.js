function cleanGitHubPath(path) {
  return path
    .split('/')
    .map(part => part.trim())
    .filter(Boolean)
    .join('/');
}

function joinGitHubPath(...parts) {
  return parts.map(cleanGitHubPath).filter(Boolean).join('/');
}

function textToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
}

function base64ToText(base64) {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function githubRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers
    }
  });

  if (response.status === 404) return null;

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.message || 'github-api-error');
  }

  return data;
}

async function verifyGithubUser(user, token) {
  const profile = await githubRequest('https://api.github.com/user', token);
  if (!profile?.login || profile.login.toLowerCase() !== user.toLowerCase()) {
    throw new Error('O PAT informado nao pertence a esse usuario GitHub.');
  }
}

async function getGitHubFile(repo, branch, path, token) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  return githubRequest(
    `https://api.github.com/repos/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`,
    token
  );
}

async function putGitHubFileBase64(repo, branch, path, base64Content, message, token, currentSha = null) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const body = {
    message,
    content: base64Content,
    branch
  };

  if (currentSha) body.sha = currentSha;

  return githubRequest(`https://api.github.com/repos/${repo}/contents/${encodedPath}`, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function putGitHubFile(repo, branch, path, content, message, token, currentSha = null) {
  return putGitHubFileBase64(repo, branch, path, textToBase64(content), message, token, currentSha);
}

async function deleteGitHubFile(repo, branch, path, message, token, currentSha) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  return githubRequest(`https://api.github.com/repos/${repo}/contents/${encodedPath}`, token, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha: currentSha, branch })
  });
}

async function upsertGitHubFile(repo, branch, path, content, message, token) {
  const existingFile = await getGitHubFile(repo, branch, path, token);
  await putGitHubFile(repo, branch, path, content, message, token, existingFile?.sha || null);
}

async function upsertGitHubFileBase64(repo, branch, path, base64Content, message, token) {
  const existingFile = await getGitHubFile(repo, branch, path, token);
  await putGitHubFileBase64(repo, branch, path, base64Content, message, token, existingFile?.sha || null);
}

async function uploadCharacterImageToGithub(auth, message) {
  if (!pendingCharacterImage) return '';
  const imagePath = ensureCharacterImagePath();
  const githubPath = joinGitHubPath(auth.sheetsPath, imagePath);
  await upsertGitHubFileBase64(auth.repo, auth.branch, githubPath, dataUrlBase64(pendingCharacterImage.dataUrl), message, auth.token);
  pendingCharacterImage = null;
  return imagePath;
}

async function removeCharacterImageFromGithub(auth, replacementPath = '') {
  if (!pendingCharacterImageRemovalPath || pendingCharacterImageRemovalPath === replacementPath) return '';
  const githubPath = joinGitHubPath(auth.sheetsPath, pendingCharacterImageRemovalPath);
  try {
    const existingFile = await getGitHubFile(auth.repo, auth.branch, githubPath, auth.token);
    if (existingFile?.sha) {
      await deleteGitHubFile(auth.repo, auth.branch, githubPath, `Remove imagem ${pendingCharacterImageRemovalPath.split('/').pop()}`, auth.token, existingFile.sha);
    }
    return githubPath;
  } finally {
    pendingCharacterImageRemovalPath = '';
  }
}

async function updateGitHubManifest(repo, branch, sheetsPath, fileName, token, previousFileName = '', displayName = sheetTitle()) {
  const manifestPath = joinGitHubPath(sheetsPath, 'index.json');
  const manifestFile = await getGitHubFile(repo, branch, manifestPath, token);
  let entries = [];

  try {
    entries = manifestFile?.content ? JSON.parse(base64ToText(manifestFile.content)) : [];
  } catch (err) {
    entries = [];
  }

  entries = entries.filter(entry => normalizeSheetEntry(entry).file !== previousFileName);

  const existingEntry = entries.find(entry => normalizeSheetEntry(entry).file === fileName);
  if (existingEntry && typeof existingEntry === 'object') {
    existingEntry.name = displayName;
  } else if (!existingEntry) {
    entries.push({ file: fileName, name: displayName });
  }

  await putGitHubFile(
    repo,
    branch,
    manifestPath,
    JSON.stringify(entries, null, 2),
    `Atualiza manifesto de fichas`,
    token,
    manifestFile?.sha || null
  );
}

async function uploadJsonToGithub(event) {
  event.preventDefault();

  const passwordReset = Boolean(pendingListPasswordReset);

  if (!passwordReset && !requireCharacterName(setGithubModalStatus)) return;
  if (!passwordReset && !requireLineageName(setGithubModalStatus)) return;
  ensureHealthDamage();
  ensureNumberDefaults();

  const user = document.getElementById('githubUser').value.trim();
  const token = document.getElementById('githubPat').value.trim();
  const repo = defaultGithubRepo;
  const branch = defaultGithubBranch;
  const sheetsPath = defaultGithubSheetsPath;
  const fileName = currentSheetName();
  const previousFileName = currentSheetFile && currentSheetFile !== fileName ? currentSheetFile : '';

  if (!passwordReset && !captureGithubCharacterList()) return;

  const submitButton = document.getElementById('githubSubmitBtn');
  submitButton.disabled = true;
  setGithubModalStatus('Enviando ficha...');

  try {
    storeGithubSettings({ user });
    const auth = { user, token, repo, branch, sheetsPath };
    if (passwordReset) {
      await verifyGithubUser(user, token);
      await resetCharacterListPassword(auth);
      pendingListPasswordReset = null;
      setGithubModalStatus('Senha da lista redefinida.');
      document.getElementById('githubPat').value = '';
      return;
    }
    await pullLatestLineage(auth);
    await loadCoven(auth);
    const sheetPath = await uploadSheetToGithub(
      auth,
      fileName,
      sheetJson(),
      `Atualiza ficha ${fileName}`,
      previousFileName
    );
    await updateCharacterListsOnGithub(auth, fileName, previousFileName);
    const lineagePath = await uploadLineageToGithub(auth, `Atualiza linhagem ${lineageFileName()}`);
    const imageRelativePath = await uploadCharacterImageToGithub(auth, `Atualiza imagem ${characterImageFileName()}`);
    const removedImagePath = await removeCharacterImageFromGithub(auth, imageRelativePath);
    const imagePath = imageRelativePath ? joinGitHubPath(sheetsPath, imageRelativePath) : removedImagePath;
    autosaveLastSavedJson = `${sheetJson()}\n---lineage---\n${lineagePath ? lineageJson() : ''}\n---coven---\n\n---image---\n`;
    startAutosave(auth);
    document.getElementById('githubPat').value = '';
    document.getElementById('githubUploadBtn').title = imagePath
      ? `Ficha enviada para ${repo}/${sheetPath} e ${imagePath}`
      : lineagePath
        ? `Ficha enviada para ${repo}/${sheetPath} e ${lineagePath}`
        : `Ficha enviada para ${repo}/${sheetPath}`;
    const extraUploads = [
      lineagePath ? `Linhagem enviada para ${repo}/${lineagePath}` : '',
      imagePath ? `Imagem enviada para ${repo}/${imagePath}` : ''
    ].filter(Boolean).join('. ');
    setGithubModalStatus(extraUploads
      ? `Ficha enviada para ${repo}/${sheetPath}. ${extraUploads}.`
      : `Ficha enviada para ${repo}/${sheetPath}.`);
    setAutosaveFeedback('Ficha salva com sucesso.');
    console.log(`[github] Ficha salva com sucesso em ${repo}/${sheetPath}. Autosave ativado.`);
  } catch (err) {
    setGithubModalStatus(err.message || 'Nao foi possivel enviar para o GitHub.');
  } finally {
    submitButton.disabled = false;
  }
}
