async function loadSheetList() {
  const list = document.getElementById('sheetList');
  list.innerHTML = '';
  setSheetModalStatus('Carregando fichas...');

  try {
    const response = await fetch(`${sheetsManifest}?v=${Date.now()}`);
    if (!response.ok) throw new Error('manifest');
    const entries = (await response.json()).map(normalizeSheetEntry).filter(entry => entry.file);

    if (!entries.length) {
      setSheetModalStatus('Nenhuma ficha encontrada em fichas/index.json.');
      return;
    }

    entries.forEach(entry => {
      const button = document.createElement('button');
      const name = document.createElement('span');
      const file = document.createElement('small');
      button.type = 'button';
      button.className = 'sheet-list-btn';
      name.textContent = entry.name;
      file.textContent = entry.file;
      button.append(name, file);
      button.addEventListener('click', () => loadSheetFromFolder(entry.file));
      list.appendChild(button);
    });
    setSheetModalStatus('');
  } catch (err) {
    setSheetModalStatus('Nao foi possivel ler fichas/index.json.');
  }
}

async function loadSheetFromFolder(fileName) {
  setSheetModalStatus('Carregando ficha...');
  try {
    const response = await fetch(`${sheetUrl(fileName)}?v=${Date.now()}`);
    if (!response.ok) throw new Error('sheet');
    applySheetData(await response.json(), fileName, 'fichas');
    await loadLineageFromUrl('fichas');
    closeSheetModal();
  } catch (err) {
    setSheetModalStatus('Nao foi possivel carregar essa ficha.');
  }
}

function openSheetModal() {
  document.getElementById('sheetModal').hidden = false;
  loadSheetList();
}

function closeSheetModal() {
  document.getElementById('sheetModal').hidden = true;
}

function closeStartModal() {
  document.getElementById('startModal').hidden = true;
}

function openBackgroundsModal() {
  const modal = document.getElementById('backgroundsModal');
  if (!modal) return;
  renderFields();
  selectBackgroundsModalTab('backgrounds');
  modal.hidden = false;
}

function closeBackgroundsModal() {
  const modal = document.getElementById('backgroundsModal');
  if (modal) modal.hidden = true;
}

function selectBackgroundsModalTab(tabName) {
  const modal = document.getElementById('backgroundsModal');
  if (!modal) return;
  modal.querySelectorAll('[data-backgrounds-modal-tab]').forEach(tab => {
    const active = tab.dataset.backgroundsModalTab === tabName;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  modal.querySelectorAll('[data-backgrounds-modal-panel]').forEach(panel => {
    panel.hidden = panel.dataset.backgroundsModalPanel !== tabName;
  });
}

function setStartModalStatus(message) {
  document.getElementById('startModalStatus').textContent = message;
}

function populatePrioritySelect(select, options, selected) {
  select.innerHTML = '';
  Object.entries(options).forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });
  select.value = selected;
}

function populatePriorityControls() {
  const settings = creationSettings();
  const attributeLabels = { physical: 'Físicos', social: 'Sociais', mental: 'Mentais' };
  const abilityLabels = { talents: 'Talentos', skills: 'Perícias', knowledges: 'Conhecimentos' };
  populatePrioritySelect(document.getElementById('attributePrimary'), attributeLabels, settings.attributePriorities.primary);
  populatePrioritySelect(document.getElementById('attributeSecondary'), attributeLabels, settings.attributePriorities.secondary);
  populatePrioritySelect(document.getElementById('attributeTertiary'), attributeLabels, settings.attributePriorities.tertiary);
  populatePrioritySelect(document.getElementById('abilityPrimary'), abilityLabels, settings.abilityPriorities.primary);
  populatePrioritySelect(document.getElementById('abilitySecondary'), abilityLabels, settings.abilityPriorities.secondary);
  populatePrioritySelect(document.getElementById('abilityTertiary'), abilityLabels, settings.abilityPriorities.tertiary);
}

function normalizePrioritySelects(kind, changedSelect) {
  const selects = Array.from(document.querySelectorAll(`[data-priority-kind="${kind}"]`));
  const available = kind === 'attributes' ? Object.keys(creationGroups.attributes) : Object.keys(creationGroups.abilities);
  const used = new Set();

  selects.forEach(select => {
    if (select !== changedSelect && select.value === changedSelect.value) {
      const replacement = available.find(value => !used.has(value) && value !== changedSelect.value);
      if (replacement) select.value = replacement;
    }
    used.add(select.value);
  });
}

function syncPriorityState() {
  const settings = creationSettings();
  settings.attributePriorities = {
    primary: document.getElementById('attributePrimary').value,
    secondary: document.getElementById('attributeSecondary').value,
    tertiary: document.getElementById('attributeTertiary').value
  };
  settings.abilityPriorities = {
    primary: document.getElementById('abilityPrimary').value,
    secondary: document.getElementById('abilitySecondary').value,
    tertiary: document.getElementById('abilityTertiary').value
  };
}

function bindPriorityControls() {
  document.querySelectorAll('[data-priority-kind]').forEach(select => {
    select.addEventListener('change', () => {
      normalizePrioritySelects(select.dataset.priorityKind, select);
      syncPriorityState();
      setFreebies(Math.max(0, 15 - creationFreebieSpend()));
      renderCreationSummary();
      updateAllDotCosts();
    });
  });
}

function renderCreationSummary() {
  const summary = document.getElementById('creationSummary');
  if (!summary) return;

  if (!creationMode) {
    summary.innerHTML = '';
    return;
  }

  const attrRows = Object.keys(creationGroups.attributes).map(group => `${group}: ${spentInPriorityPool(creationGroups.attributes[group][0])}/${priorityBudget('attributes', group)}`);
  const abilityRows = Object.keys(creationGroups.abilities).map(group => `${group}: ${spentInPriorityPool(creationGroups.abilities[group][0])}/${priorityBudget('abilities', group)}`);
  const lineageBonus = Object.keys(state.creation?.lineageSphereBonus || {}).length ? '<span>Linhagem aplicada</span>' : '';
  summary.innerHTML = `
    <span>Freebies: ${freebies()}</span>
    <span>Atributos ${attrRows.join(' · ')}</span>
    <span>Habilidades ${abilityRows.join(' · ')}</span>
    <span>Backgrounds ${sumPaths(backgroundPaths)}/7</span>
    <span>Arcana + Esferas + FV ${arcanaSpherePoolSpent()}/6</span>
    ${lineageBonus}
  `;
  updateLineageSphereBonusButton();
}

function incompleteCreationPools() {
  const pending = [];
  const groupLabels = {
    physical: 'Físicos', social: 'Sociais', mental: 'Mentais',
    talents: 'Talentos', skills: 'Perícias', knowledges: 'Conhecimentos'
  };
  Object.keys(creationGroups.attributes).forEach(group => {
    const spent = spentInPriorityPool(creationGroups.attributes[group][0]);
    const budget = priorityBudget('attributes', group);
    if (spent < budget) pending.push(`Atributos ${groupLabels[group]}: faltam ${budget - spent}`);
  });
  Object.keys(creationGroups.abilities).forEach(group => {
    const spent = spentInPriorityPool(creationGroups.abilities[group][0]);
    const budget = priorityBudget('abilities', group);
    if (spent < budget) pending.push(`Habilidades ${groupLabels[group]}: faltam ${budget - spent}`);
  });
  const backgroundsRemaining = backgroundPoolRemaining();
  if (backgroundsRemaining) pending.push(`Antecedentes: faltam ${backgroundsRemaining}`);
  const sharedPoolRemaining = arcanaSpherePoolRemaining();
  if (sharedPoolRemaining) pending.push(`Arcana + Esferas + Força de Vontade: faltam ${sharedPoolRemaining}`);
  if (freebies()) pending.push(`Freebies: faltam gastar ${freebies()}`);
  return pending;
}

function closeCreationPointsWarningModal() {
  const modal = document.getElementById('creationPointsWarningModal');
  if (modal) modal.hidden = true;
}

function closeCreationCompletionModal() {
  const modal = document.getElementById('creationCompletionModal');
  if (modal) modal.hidden = true;
}

async function requestCreationCompletion() {
  const pending = incompleteCreationPools();
  if (pending.length) {
    document.getElementById('creationPointsWarningMessage').textContent = `Ainda há pontos para distribuir: ${pending.join('; ')}.`;
    document.getElementById('creationPointsWarningModal').hidden = false;
    return;
  }
  document.getElementById('creationCompletionModal').hidden = false;
}

function confirmCreationCompletion() {
  state.creationSnapshot = creationSnapshotData();
  closeCreationCompletionModal();
  setCreationMode(false);
}

function bindCreationCompletion() {
  document.getElementById('closeCreationPointsWarningModal')?.addEventListener('click', closeCreationPointsWarningModal);
  document.getElementById('acknowledgeCreationPointsWarningBtn')?.addEventListener('click', closeCreationPointsWarningModal);
  document.getElementById('closeCreationCompletionModal')?.addEventListener('click', closeCreationCompletionModal);
  document.getElementById('cancelCreationCompletionBtn')?.addEventListener('click', closeCreationCompletionModal);
  document.getElementById('confirmCreationCompletionBtn')?.addEventListener('click', confirmCreationCompletion);
}

function setCreationMode(enabled) {
  creationMode = enabled;
  creationSettings().mode = enabled;
  document.getElementById('creationPanel').hidden = !enabled;
  document.querySelector('.backgrounds-panel').hidden = !enabled;
  document.querySelector('.creation-world-panel').hidden = !enabled;
  document.querySelector('.notes-focus-section').hidden = enabled;
  document.querySelector('.covenant-panel').hidden = enabled;
  const backgroundsButton = document.getElementById('openBackgroundsModalBtn');
  if (backgroundsButton) backgroundsButton.hidden = enabled;
  if (enabled) closeBackgroundsModal();
  document.getElementById('resourceLabel').textContent = enabled ? 'Freebies' : 'Experiência';
  const resourceInput = document.getElementById('experienceInput');
  if (resourceInput) {
    resourceInput.max = enabled ? '15' : '';
    resourceInput.min = '0';
  }
  populatePriorityControls();
  setLevelEditing(enabled);
  renderCreationSummary();
}

function startNewCharacter() {
  clearGithubSyncSource();
  clearAiPreview();
  clearState();
  clearLineageState();
  pendingCharacterImage = null;
  pendingCharacterImageRemovalPath = '';
  currentSheetAssetBaseUrl = 'fichas';
  currentSheetFile = '';
  state.creation = {
    mode: true,
    attributePriorities: { ...creationDefaults.attributePriorities },
    abilityPriorities: { ...creationDefaults.abilityPriorities }
  };
  dotPaths().forEach(path => setPath(state, path, 0));
  setPath(state, 'advantages.arcana', 1);
  setPath(state, 'advantages.willpowerTemporary', 0);
  setPath(state, 'identity.experience', 15);
  setPath(state, 'health.damage', []);
  setPath(state, 'health.level', healthLevels[0].value);
  addLineageMember(false);
  setCreationMode(true);
  renderFields();
  renderLineage();
  closeStartModal();
}

async function loadGitSheetList() {
  const list = document.getElementById('gitSheetList');
  list.innerHTML = '';
  setStartModalStatus('Carregando fichas do GitHub...');

  try {
    const [response, lists] = await Promise.all([
      fetch(`${githubRawBase}/fichas/index.json?v=${Date.now()}`),
      fetchRawCharacterLists()
    ]);
    if (!response.ok) throw new Error('manifest');
    const entries = (await response.json()).map(normalizeSheetEntry).filter(entry => entry.file);
    const access = document.getElementById('gitListAccess');
    const select = document.getElementById('gitCharacterList');
    fillCharacterListSelect(select, lists.lists);
    access.hidden = false;
    const renderSelected = async () => {
      const selected = lists.lists.find(item => item.name === select.value);
      const password = document.getElementById('gitListPassword').value;
      document.getElementById('gitListPasswordLabel').hidden = !selected?.passwordHash;
      list.innerHTML = '';
      if (!selected || !await listPasswordMatches(password, selected.passwordHash)) {
        setStartModalStatus('Senha da lista incorreta.');
        return;
      }
      const allowed = new Set(selected.characters);
      entries.filter(entry => allowed.has(entry.file)).forEach(entry => {
      const button = document.createElement('button');
      const name = document.createElement('span');
      const file = document.createElement('small');
      button.type = 'button';
      button.className = 'sheet-list-btn';
      name.textContent = entry.name;
      file.textContent = entry.file;
      button.append(name, file);
      button.addEventListener('click', () => loadSheetFromGithub(entry.file));
      list.appendChild(button);
      });
      setStartModalStatus(list.children.length ? '' : 'Nenhum personagem nesta lista.');
    };
    select.onchange = () => { document.getElementById('gitListPassword').value = ''; renderSelected(); };
    document.getElementById('unlockGitListBtn').onclick = renderSelected;
    document.getElementById('resetGitListPasswordBtn').onclick = () => {
      pendingListPasswordReset = select.value;
      openGithubModal(true);
    };
    await renderSelected();
  } catch (err) {
    setStartModalStatus('Não foi possível carregar as fichas do GitHub.');
  }
}

async function loadSheetFromGithub(fileName) {
  setStartModalStatus('Carregando ficha...');
  try {
    const url = `${githubRawBase}/fichas/${fileName.split('/').map(encodeURIComponent).join('/')}?v=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('sheet');
    const data = await response.json();
    console.log('[github load] Ficha carregada', {
      fileName,
      url,
      data
    });
    const sheetsBaseUrl = `${githubRawBase}/fichas`;
    applySheetData(data, fileName, sheetsBaseUrl);
    const lineageData = await loadLineageFromUrl(sheetsBaseUrl);
    setGithubSyncSource({ sheetsBaseUrl, lineageData });
    closeStartModal();
  } catch (err) {
    setStartModalStatus('Não foi possível carregar essa ficha.');
  }
}

async function loadLocalSheet(file) {
  if (!file) return;
  try {
    clearGithubSyncSource();
    applySheetData(JSON.parse(await file.text()), file.name, 'fichas');
    closeStartModal();
  } catch (err) {
    setStartModalStatus('Arquivo JSON inválido.');
  }
}
