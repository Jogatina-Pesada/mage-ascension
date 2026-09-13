function clearState() {
  Object.keys(state).forEach(k => delete state[k]);
}

function characterName() {
  return getPath(state, 'identity.name', '').trim();
}

function sheetTitle() {
  return characterName();
}

function requireCharacterName(onError = () => {}) {
  const nameInput = document.querySelector('[data-field="identity.name"]');
  const message = 'Preencha o nome do personagem antes de salvar ou enviar.';

  if (characterName()) {
    nameInput?.setCustomValidity('');
    return true;
  }

  nameInput?.setCustomValidity(message);
  nameInput?.reportValidity();
  nameInput?.focus();
  onError(message);
  return false;
}

function requireLineageName(onError = () => {}) {
  if (!lineageHasData() || lineageName()) return true;

  const nameInput = document.getElementById('lineageNameInput');
  const message = 'Preencha o nome da linhagem antes de salvar seus dados.';
  nameInput?.setCustomValidity(message);
  nameInput?.reportValidity();
  nameInput?.focus();
  onError(message);
  return false;
}

function snakeCase(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'mage_personagem';
}

function sheetFileName() {
  return `${snakeCase(sheetTitle())}.json`;
}

function sheetUrl(fileName) {
  return `fichas/${fileName.split('/').map(encodeURIComponent).join('/')}`;
}

function applySheetData(data, fileName = '', assetBaseUrl = 'fichas') {
  clearGithubSyncSource();
  clearAiPreview();
  clearState();
  clearLineageState();
  pendingCharacterImage = null;
  pendingCharacterImageRemovalPath = '';
  currentSheetAssetBaseUrl = assetBaseUrl;
  Object.assign(state, data);
  if (getPath(state, 'advantages.willpowerTemporary', null) === null) {
    setPath(state, 'advantages.willpowerTemporary', Number(getPath(state, 'advantages.willpower', 0)) || 0);
  }
  clampCharacterCovenResources();
  if (typeof data.lab === 'string' && !covenState.lab) covenState.lab = data.lab;
  delete state.lab;
  if (state.creation) {
    delete state.creation.lineageSphereBonusApplied;
    delete state.creation.lineageSphereBonus;
  }
  if (data.lineage && typeof data.lineage === 'object') {
    lineageState.name = data.lineage.name || data.identity?.lineage || '';
    lineageState.spheres = { ...(data.lineage.spheres || {}) };
    lineageState.sphereExperience = { ...(data.lineage.sphereExperience || {}) };
    syncLineageSpheresFromExperience();
    lineageState.members = Array.isArray(data.lineage.members) ? data.lineage.members.map(normalizeLineageMember) : [];
    delete state.lineage;
  }
  currentSheetFile = fileName;
  setCreationMode(Boolean(data.creation?.mode));
  renderFields();
  renderLineage();
}

function applyLineageData(data) {
  clearLineageState();
  lineageState.name = data.name || lineageName();
  lineageState.spheres = { ...(data.spheres || {}) };
  lineageState.sphereExperience = { ...(data.sphereExperience || {}) };
  syncLineageSpheresFromExperience();
  lineageState.members = Array.isArray(data.members)
    ? data.members.map(normalizeLineageMember)
    : [];
  if (lineageState.name) setPath(state, 'identity.lineage', lineageState.name);
  renderLineage();
}

async function loadLineageFromUrl(baseUrl) {
  if (!lineageName()) return;
  try {
    const url = `${baseUrl}/linhagens/${lineageFileName().split('/').map(encodeURIComponent).join('/')}?v=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    console.log('[github load] Linhagem carregada', {
      url,
      data
    });
    applyLineageData(data);
    return data;
  } catch (err) {
    console.warn('[lineage] Nao foi possivel carregar a linhagem.', err);
    return null;
  }
}

async function loadLineageFromGithub() {
  return loadLineageFromUrl(githubSheetsRawBase());
}

function githubLineagesApiUrl() {
  const settings = getGithubSettings();
  const repo = settings.repo || defaultGithubRepo;
  const branch = settings.branch || 'main';
  const sheetsPath = cleanGitHubPath(settings.sheetsPath || 'fichas');
  const path = joinGitHubPath(sheetsPath, 'linhagens');
  return `https://api.github.com/repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(branch)}`;
}

function openLineageLoadModal() {
  document.getElementById('lineageLoadModal').hidden = false;
  loadGitLineageList();
}

function closeLineageLoadModal() {
  document.getElementById('lineageLoadModal').hidden = true;
}

async function loadLineageFromGithubItem(item) {
  setLineageLoadModalStatus('Carregando linhagem...');
  try {
    const url = `${githubSheetsRawBase()}/linhagens/${item.file.split('/').map(encodeURIComponent).join('/')}?v=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('lineage');
    const data = await response.json();
    console.log('[github load] Linhagem carregada pela criação', {
      fileName: item.file,
      url,
      data
    });
    applyLineageData(data);
    closeLineageLoadModal();
    focusLineageSection();
  } catch (err) {
    setLineageLoadModalStatus('Não foi possível carregar essa linhagem.');
  }
}

async function loadGitLineageList() {
  const list = document.getElementById('gitLineageList');
  list.innerHTML = '';
  setLineageLoadModalStatus('Carregando linhagens do GitHub...');

  try {
    const response = await fetch(`${githubSheetsRawBase()}/linhagens/index.json?v=${Date.now()}`);
    if (!response.ok) throw new Error('lineage-list');
    const entries = (await response.json())
      .map(normalizeSheetEntry)
      .filter(entry => entry.file && /\.json$/i.test(entry.file) && entry.file !== 'index.json')
      .sort((a, b) => a.name.localeCompare(b.name));

    entries.forEach(entry => {
      const button = document.createElement('button');
      const name = document.createElement('span');
      const file = document.createElement('small');
      button.type = 'button';
      button.className = 'sheet-list-btn';
      name.textContent = entry.name || entry.file.replace(/\.json$/i, '');
      file.textContent = entry.file;
      button.append(name, file);
      button.addEventListener('click', () => loadLineageFromGithubItem(entry));
      list.appendChild(button);
    });

    setLineageLoadModalStatus(entries.length ? '' : 'Nenhuma linhagem encontrada no GitHub.');
  } catch (err) {
    console.error('[github load] Não foi possível carregar o índice de linhagens.', err);
    setLineageLoadModalStatus('Não foi possível carregar fichas/linhagens/index.json.');
  }
}

async function loadLocalLineage(file) {
  if (!file) return;
  try {
    applyLineageData(JSON.parse(await file.text()));
    focusLineageSection();
  } catch (err) {
    setAutosaveFeedback('Arquivo de linhagem inválido.', true);
  } finally {
    document.getElementById('localLineageInput').value = '';
  }
}

function normalizeSheetEntry(entry) {
  if (typeof entry === 'string') return { file: entry, name: entry.replace(/\.json$/i, '') };
  return {
    file: entry.file,
    name: entry.name || entry.title || entry.file?.replace(/\.json$/i, '')
  };
}

function setSheetModalStatus(message) {
  document.getElementById('sheetModalStatus').textContent = message;
}

function setGithubModalStatus(message) {
  document.getElementById('githubModalStatus').textContent = message;
}

function setLineageLoadModalStatus(message) {
  document.getElementById('lineageLoadModalStatus').textContent = message;
}

function sheetJson() {
  setPath(state, 'advantages.willpowerTemporary', temporaryWillpower());
  ensureHealthDamage();
  clampCharacterCovenResources();
  ensureCharacterImagePath();
  ensureCreationSnapshot();
  if (lineageName()) setPath(state, 'identity.lineage', lineageName());
  delete state.lineage;
  delete state.lab;
  return JSON.stringify(state, null, 2);
}

function creationSnapshotData() {
  return {
    capturedAt: new Date().toISOString(),
    identity: cloneData(getPath(state, 'identity', {})),
    attributes: cloneData(getPath(state, 'attributes', {})),
    abilities: cloneData(getPath(state, 'abilities', {})),
    spheres: cloneData(getPath(state, 'spheres', {})),
    advantages: cloneData(getPath(state, 'advantages', {})),
    backgrounds: cloneData(getPath(state, 'backgrounds', {})),
    backgroundJustifications: cloneData(getPath(state, 'backgroundJustifications', {})),
    origin: getPath(state, 'origin', ''),
    aspirations: getPath(state, 'aspirations', ''),
    obsession: getPath(state, 'obsession', ''),
    world: cloneData(getPath(state, 'world', {})),
    creation: cloneData(getPath(state, 'creation', {}))
  };
}

function ensureCreationSnapshot() {
  if (!state.creationSnapshot) {
    state.creationSnapshot = creationSnapshotData();
  }
}

function lineageData() {
  const sphereExperience = Object.fromEntries(spherePaths.map(path => {
    const key = path.split('.')[1];
    return [key, lineageSphereXp(key)];
  }));

  return {
    name: lineageName(),
    spheres: Object.fromEntries(spherePaths.map(path => {
      const key = path.split('.')[1];
      return [key, Number(lineageState.spheres[key] || 0)];
    })),
    sphereExperience,
    members: lineageState.members
      .filter(member => member.name || member.chronicle || member.dead)
      .map(member => ({
        name: member.name || '',
        chronicle: member.chronicle || '',
        status: member.dead ? 'dead' : 'alive',
        dead: Boolean(member.dead),
        lineageContribution: { ...(member.lineageContribution || {}) }
      }))
  };
}

function lineageJson() {
  return JSON.stringify(lineageData(), null, 2);
}

function currentSheetName() {
  return characterName() ? sheetFileName() : currentSheetFile || sheetFileName();
}

function formatDuration(ms) {
  const minutes = Math.max(0, Math.ceil(ms / 60000));
  return `${minutes} min`;
}

function setAutosaveFeedback(message, isError = false) {
  const feedback = document.getElementById('autosaveFeedback');
  feedback.textContent = message;
  feedback.classList.toggle('is-error', isError);
  if (message) {
    window.setTimeout(() => {
      if (feedback.textContent === message) feedback.textContent = '';
    }, 6000);
  }
}
