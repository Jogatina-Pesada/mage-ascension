function normalizeCharacterLists(data) {
  const source = data && typeof data === 'object' ? data : {};
  const lists = Array.isArray(source.lists) ? source.lists : [];
  const normalized = lists.map(item => ({
    name: String(item?.name || '').trim(),
    passwordHash: String(item?.passwordHash || ''),
    characters: Array.isArray(item?.characters) ? item.characters.filter(value => typeof value === 'string') : []
  })).filter(item => item.name);
  if (!normalized.some(item => item.name === 'default')) {
    normalized.unshift({ name: 'default', passwordHash: '', characters: [] });
  }
  return { adminPasswordHash: String(source.adminPasswordHash || ''), lists: normalized };
}

async function hashListPassword(password) {
  if (!password) return '';
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function listPasswordMatches(password, hash) {
  return !hash || await hashListPassword(password) === hash;
}

async function fetchRawCharacterLists() {
  const response = await fetch(`${githubRawBase}/fichas/${characterListsFile}?v=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('lists');
  return normalizeCharacterLists(await response.json());
}

function fillCharacterListSelect(select, lists, selected = 'default', placeholder = '') {
  select.innerHTML = '';
  if (placeholder) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = placeholder;
    option.disabled = true;
    option.selected = true;
    select.appendChild(option);
  }
  lists.forEach(list => {
    const option = document.createElement('option');
    option.value = list.name;
    option.textContent = list.name;
    select.appendChild(option);
  });
  select.value = lists.some(list => list.name === selected) ? selected : (placeholder ? '' : 'default');
}

async function prepareGithubCharacterLists() {
  const select = document.getElementById('githubCharacterList');
  const newListFields = document.getElementById('newGithubCharacterListFields');
  newListFields.hidden = true;
  select.hidden = false;
  document.getElementById('newGithubCharacterListName').value = '';
  document.getElementById('newGithubCharacterListPassword').value = '';
  try {
    const data = await fetchRawCharacterLists();
    const fileName = currentSheetFile || currentSheetName();
    const associated = data.lists.find(list => list.characters.includes(fileName));
    fillCharacterListSelect(select, data.lists, associated?.name || 'default');
  } catch (err) {
    fillCharacterListSelect(select, normalizeCharacterLists({}).lists, 'default');
  }
}

function toggleNewGithubCharacterList() {
  const fields = document.getElementById('newGithubCharacterListFields');
  fields.hidden = !fields.hidden;
  document.getElementById('githubCharacterList').hidden = !fields.hidden;
  if (!fields.hidden) document.getElementById('newGithubCharacterListName').focus();
}

function captureGithubCharacterList() {
  const fields = document.getElementById('newGithubCharacterListFields');
  if (!fields.hidden) {
    const nameInput = document.getElementById('newGithubCharacterListName');
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.setCustomValidity('Informe o nome da lista.');
      nameInput.reportValidity();
      return false;
    }
    nameInput.setCustomValidity('');
    pendingCharacterList = { name, password: document.getElementById('newGithubCharacterListPassword').value };
    selectedCharacterList = name;
  } else {
    pendingCharacterList = null;
    selectedCharacterList = document.getElementById('githubCharacterList').value || 'default';
  }
  return true;
}

async function updateCharacterListsOnGithub(auth, fileName, previousFileName = '') {
  const path = joinGitHubPath(auth.sheetsPath, characterListsFile);
  const file = await getGitHubFile(auth.repo, auth.branch, path, auth.token);
  let data;
  try { data = normalizeCharacterLists(file?.content ? JSON.parse(base64ToText(file.content)) : {}); }
  catch (err) { data = normalizeCharacterLists({}); }
  if (!data.adminPasswordHash) data.adminPasswordHash = await hashListPassword('bruxinhas');
  let list = data.lists.find(item => item.name === selectedCharacterList);
  if (!list) {
    list = { name: selectedCharacterList, passwordHash: await hashListPassword(pendingCharacterList?.password || ''), characters: [] };
    data.lists.push(list);
  }
  data.lists.forEach(item => {
    item.characters = item.characters.filter(name => name !== fileName && name !== previousFileName);
  });
  list.characters.push(fileName);
  await putGitHubFile(auth.repo, auth.branch, path, JSON.stringify(data, null, 2), 'Atualiza listas de personagens', auth.token, file?.sha || null);
}

async function resetCharacterListPassword(auth) {
  const path = joinGitHubPath(auth.sheetsPath, characterListsFile);
  const file = await getGitHubFile(auth.repo, auth.branch, path, auth.token);
  if (!file?.content) throw new Error('Não foi possível carregar listas.json.');
  const data = normalizeCharacterLists(JSON.parse(base64ToText(file.content)));
  const admin = document.getElementById('githubListAdminPassword').value;
  if (!await listPasswordMatches(admin, data.adminPasswordHash)) throw new Error('Senha admin incorreta.');
  const list = data.lists.find(item => item.name === pendingListPasswordReset);
  if (!list) throw new Error('Lista não encontrada.');
  list.passwordHash = await hashListPassword(document.getElementById('githubListNewPassword').value);
  await putGitHubFile(auth.repo, auth.branch, path, JSON.stringify(data, null, 2), `Redefine senha da lista ${list.name}`, auth.token, file.sha);
}
