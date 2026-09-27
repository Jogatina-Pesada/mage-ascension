function clearLineageState() {
  lineageState.name = '';
  lineageState.spheres = {};
  lineageState.sphereExperience = {};
  lineageState.members = [];
  pendingLineageDeathId = null;
  pendingLineageReviveId = null;
}

function lineageName() {
  return (lineageState.name || getPath(state, 'identity.lineage', '') || characterName()).trim();
}

function lineageFileName() {
  return `${snakeCase(lineageName())}.json`;
}

function lineageRelativePath() {
  return `linhagens/${lineageFileName()}`;
}

function lineageHasData() {
  return Boolean(
    lineageName()
    || Object.values(lineageState.spheres).some(value => Number(value) > 0)
    || lineageState.members.some(member => member.name || member.chronicle || member.dead)
  );
}

function ensureLineageMember() {
  if (!lineageState.members.length) addLineageMember(false);
}

function syncCurrentCharacterLineageMember() {
  if (!creationMode) return;
  ensureLineageMember();
  const name = characterName();
  if (!name || lineageState.members.some(item => item.name === name)) return;
  let member = lineageState.members.find(item => !item.name);
  if (!member) {
    addLineageMember(false);
    member = lineageState.members[lineageState.members.length - 1];
  }
  member.name = name;
}

function ensureLineageDefaults() {
  if (!lineageState.name && !getPath(state, 'identity.lineage', '')) {
    lineageState.name = characterName();
  }
  if (lineageState.name) setPath(state, 'identity.lineage', lineageState.name);
  syncCurrentCharacterLineageMember();
}

function addLineageMember(render = true) {
  lineageState.members.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: '',
    chronicle: '',
    dead: false,
    lineageContribution: {}
  });
  if (render) renderLineageMembers();
}

function normalizeLineageMember(member = {}) {
  return {
    id: member.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: member.name || '',
    chronicle: member.chronicle || '',
    dead: Boolean(member.dead || member.status === 'dead' || member.inMemoriam),
    lineageContribution: { ...(member.lineageContribution || member.sphereExperienceContribution || {}) }
  };
}

function ratingToXp(rating) {
  const value = Math.max(0, Number(rating) || 0);
  const full = Math.floor(value);
  const fraction = value - full;
  let total = 0;
  for (let level = 1; level <= full; level++) total += level * 7;
  if (fraction > 0) total += fraction * (full + 1) * 7;
  return total;
}

function legacyLineageRatingToXp(rating) {
  const value = Math.max(0, Number(rating) || 0);
  const full = Math.floor(value);
  const fraction = value - full;
  let total = 0;
  for (let level = 1; level <= full; level++) total += level * 7;
  if (fraction > 0) total += value * 7;
  return total;
}

function xpToRating(xp) {
  let remaining = Math.max(0, Number(xp) || 0) / 7;
  let level = 0;

  while (remaining >= level + 1) {
    level += 1;
    remaining -= level;
  }

  if (!remaining) return level;
  return level + remaining / (level + 1);
}

function lineageSphereXp(key) {
  if (Object.prototype.hasOwnProperty.call(lineageState.sphereExperience, key)) {
    return Number(lineageState.sphereExperience[key]) || 0;
  }
  return legacyLineageRatingToXp(lineageState.spheres[key] || 0);
}

function roundedRating(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function formatLineageXp(value) {
  const rounded = Math.round((Number(value) || 0) * 100) / 100;
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

function syncLineageSpheresFromExperience() {
  spherePaths.forEach(path => {
    const key = path.split('.')[1];
    if (Object.prototype.hasOwnProperty.call(lineageState.sphereExperience, key)) {
      lineageState.spheres[key] = roundedRating(xpToRating(lineageState.sphereExperience[key]));
    }
  });
}

function creationSphereRating(characterData, key) {
  const current = Number(characterData?.spheres?.[key] || 0);
  const snapshotValue = characterData?.creationSnapshot?.spheres?.[key];
  if (snapshotValue !== undefined && snapshotValue !== null) {
    return Math.min(current, Math.max(0, Number(snapshotValue) || 0));
  }
  return current > 0 ? 1 : 0;
}

function characterSphereDeathBreakdown(characterData, key) {
  const current = Number(characterData?.spheres?.[key] || 0);
  const hasCreationSnapshot = characterData?.creationSnapshot?.spheres?.[key] !== undefined
    && characterData?.creationSnapshot?.spheres?.[key] !== null;
  const createdWith = creationSphereRating(characterData, key);
  const currentXp = ratingToXp(current);
  const creationXp = ratingToXp(createdWith);
  const gainedXp = Math.max(0, currentXp - creationXp);
  return {
    key,
    current,
    createdWith,
    source: hasCreationSnapshot ? 'creationSnapshot' : 'fallback-lvl1',
    currentXp,
    creationXp,
    gainedXp
  };
}

function characterSphereDeathXp(characterData, key) {
  return characterSphereDeathBreakdown(characterData, key).gainedXp;
}

function absorbCharacterSpheresIntoLineage(characterData) {
  const debugRows = [];
  const contribution = {};

  spherePaths.forEach(path => {
    const key = path.split('.')[1];
    const characterBreakdown = characterSphereDeathBreakdown(characterData, key);
    const transferredXp = characterBreakdown.gainedXp / 2;
    const beforeXp = lineageSphereXp(key);
    const totalXp = beforeXp + transferredXp;
    const finalRating = roundedRating(xpToRating(totalXp));

    debugRows.push({
      sphere: key,
      characterRating: characterBreakdown.current,
      creationRating: characterBreakdown.createdWith,
      creationSource: characterBreakdown.source,
      characterXp: characterBreakdown.currentXp,
      ignoredCreationXp: characterBreakdown.creationXp,
      inheritedXp: characterBreakdown.gainedXp,
      transferredXp,
      lineageXpBefore: beforeXp,
      lineageXpAfter: totalXp,
      lineageRatingAfter: finalRating
    });

    if (!transferredXp) return;
    contribution[key] = transferredXp;
    lineageState.sphereExperience[key] = totalXp;
    lineageState.spheres[key] = finalRating;
  });

  console.groupCollapsed('[lineage death] Calculo de esferas herdadas');
  console.table(debugRows);
  console.groupEnd();
  return contribution;
}

function removeLineageContribution(contribution = {}) {
  const debugRows = [];

  spherePaths.forEach(path => {
    const key = path.split('.')[1];
    const removedXp = Math.max(0, Number(contribution[key]) || 0);
    const beforeXp = lineageSphereXp(key);
    const totalXp = Math.max(0, beforeXp - removedXp);
    const finalRating = roundedRating(xpToRating(totalXp));

    debugRows.push({
      sphere: key,
      removedXp,
      lineageXpBefore: beforeXp,
      lineageXpAfter: totalXp,
      lineageRatingAfter: finalRating
    });

    if (!removedXp) return;
    lineageState.sphereExperience[key] = totalXp;
    lineageState.spheres[key] = finalRating;
  });

  console.groupCollapsed('[lineage revive] Remocao de esferas herdadas');
  console.table(debugRows);
  console.groupEnd();
}

function githubSheetsRawBase() {
  const settings = getGithubSettings();
  const repo = settings.repo || defaultGithubRepo;
  const branch = settings.branch || 'main';
  const sheetsPath = cleanGitHubPath(settings.sheetsPath || 'fichas');
  return `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(branch)}/${sheetsPath.split('/').map(encodeURIComponent).join('/')}`;
}

function lineageMemberSheetFileName(member) {
  const name = (member?.name || '').trim();
  if (!name) throw new Error('member-name-missing');
  return /\.json$/i.test(name) ? name : `${snakeCase(name)}.json`;
}

async function fetchLineageMemberSheet(member) {
  const fileName = lineageMemberSheetFileName(member);
  const url = `${githubSheetsRawBase()}/${fileName.split('/').map(encodeURIComponent).join('/')}?v=${Date.now()}`;
  console.log('[lineage death] Buscando ficha do personagem no GitHub', {
    memberName: member.name,
    fileName,
    url
  });
  const response = await fetch(url);
  console.log('[lineage death] Resposta da ficha do personagem', {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText
  });
  if (!response.ok) throw new Error(`member-sheet-not-found:${response.status}`);
  const data = await response.json();
  console.log('[lineage death] Ficha carregada', {
    characterName: data?.identity?.name,
    spheres: data?.spheres,
    creationSnapshotSpheres: data?.creationSnapshot?.spheres
  });
  return data;
}

function makeLineageDots(container) {
  const key = container.dataset.lineageDots;
  const label = container.dataset.label;
  const path = `spheres.${key}`;
  const symbol = sphereSymbols[path] || '';
  container.className = 'lineage-dot-row';
  container.innerHTML = '<span class="dot-label"></span><span class="dots"></span>';

  const labelElement = container.querySelector('.dot-label');
  if (symbol) {
    const symbolElement = document.createElement('span');
    symbolElement.className = 'sphere-symbol';
    symbolElement.textContent = symbol;
    labelElement.append(symbolElement, document.createTextNode(label));
  } else {
    labelElement.textContent = label;
  }
  labelElement.dataset.wikiPath = path;
  labelElement.dataset.wikiQuery = label;

  const dots = container.querySelector('.dots');
  for (let i = 1; i <= 5; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', `${label}: ${i}`);
    dot.disabled = true;
    dots.appendChild(dot);
  }
  renderLineageDots(container);
}

function renderLineageDots(container) {
  const value = Number(lineageState.spheres[container.dataset.lineageDots] || 0);
  container.querySelectorAll('.dot').forEach((dot, idx) => {
    const filled = idx + 1 <= value;
    const partial = Math.max(0, Math.min(1, value - idx));
    dot.classList.toggle('filled', filled);
    if (!filled && partial > 0) {
      dot.style.background = `linear-gradient(to right, var(--gold) ${partial * 100}%, transparent ${partial * 100}%)`;
    } else {
      dot.style.background = '';
    }
  });
}

function makeLineageExperience(container) {
  const label = container.dataset.label;
  container.className = 'lineage-xp-row';
  container.innerHTML = '<span class="dot-label"></span><span class="lineage-xp-value"></span>';
  container.querySelector('.dot-label').textContent = label;
  renderLineageExperience(container);
}

function renderLineageExperience(container) {
  const key = container.dataset.lineageXp;
  const value = container.querySelector('.lineage-xp-value');
  if (!value) return;
  value.textContent = formatLineageXp(lineageSphereXp(key));
}

function renderLineageMembers() {
  const list = document.getElementById('lineageMembers');
  if (!list) return;
  list.innerHTML = '';
  ensureLineageMember();

  lineageState.members.forEach(member => {
    const row = document.createElement('div');
    row.className = 'lineage-member-row';
    row.dataset.memberId = member.id;

    const nameWrap = document.createElement('span');
    nameWrap.className = 'lineage-member-name';
    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Nome';
    nameInput.value = member.name || '';
    nameInput.addEventListener('input', () => {
      member.name = nameInput.value;
    });
    nameWrap.appendChild(nameInput);
    if (member.dead) {
      const memoriam = document.createElement('span');
      memoriam.className = 'lineage-memoriam';
      memoriam.textContent = 'in memorium';
      nameWrap.appendChild(memoriam);
    }

    const chronicleInput = document.createElement('select');
    chronicleOptions.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue === 'Urbana' ? 'Urbano' : optionValue;
      chronicleInput.appendChild(option);
    });
    chronicleInput.value = chronicleOptions.includes(member.chronicle) ? member.chronicle : chronicleOptions[0];
    member.chronicle = chronicleInput.value;
    chronicleInput.addEventListener('change', () => {
      member.chronicle = chronicleInput.value;
    });

    const deathButton = document.createElement('button');
    deathButton.type = 'button';
    deathButton.className = member.dead
      ? 'lineage-death-btn lineage-revive-btn no-print'
      : 'lineage-death-btn no-print';
    deathButton.textContent = member.dead ? '↺' : '☠';
    deathButton.title = member.dead ? 'Reviver personagem' : 'Marcar morte';
    deathButton.setAttribute('aria-label', `${member.dead ? 'Reviver' : 'Marcar morte de'} ${member.name || 'personagem'}`);
    deathButton.addEventListener('click', () => {
      if (member.dead) {
        openLineageReviveModal(member.id);
        return;
      }
      openLineageDeathModal(member.id);
    });

    row.append(nameWrap, chronicleInput, deathButton);
    list.appendChild(row);
  });
}

function renderLineage() {
  const nameInput = document.getElementById('lineageNameInput');
  lineageState.name = getPath(state, 'identity.lineage', lineageState.name || '');
  if (nameInput) nameInput.value = lineageState.name;
  document.querySelectorAll('[data-lineage-dots]').forEach(renderLineageDots);
  document.querySelectorAll('[data-lineage-xp]').forEach(renderLineageExperience);
  renderLineageMembers();
  updateLineageSphereBonusButton();
}

async function loadLineageByNameOnBlur() {
  const requestedName = document.getElementById('lineageNameInput')?.value.trim();
  if (!requestedName) return null;
  const requestedFile = `${snakeCase(requestedName)}.json`;
  setLineageSyncLoading(true);
  try {
    const data = await fetchGithubRawJson(githubSheetsRawBase(), `linhagens/${requestedFile}`);
    if (!data) return null;
    applyLineageData(data, requestedFile);
    githubLineageSyncBase = syncClone(data);
    return data;
  } catch (err) {
    console.warn('[lineage] Nao foi possivel verificar a linhagem no GitHub.', err);
    return null;
  } finally {
    setLineageSyncLoading(false);
  }
}

function focusLineageSection() {
  const nameInput = document.getElementById('lineageNameInput');
  nameInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  nameInput?.focus();
}

function startNewLineage() {
  clearLineageState();
  currentLineageFile = '';
  setPath(state, 'identity.lineage', '');
  addLineageMember(false);
  renderLineage();
  focusLineageSection();
}

function lineageSphereBonusTarget(path) {
  const key = path.split('.')[1];
  let target = Number(getPath(state, path, 0));
  let availableXp = Math.floor(lineageSphereXp(key));
  const max = Number(document.querySelector(`[data-dots="${path}"]`)?.dataset.max || 5);

  while (target < max) {
    const cost = sphereNextLevelCost(target);
    if (availableXp < cost) break;
    availableXp -= cost;
    target += 1;
  }

  return target;
}

function sphereLabel(path) {
  return document.querySelector(`[data-dots="${path}"]`)?.dataset.label || path.split('.')[1];
}

function applyLineageSphereBonus() {
  if (!canApplyLineageSphereBonus()) return;

  const applied = { ...(creationSettings().lineageSphereBonus || {}) };
  const changed = [];
  const unchanged = [];

  pendingLineageSphereBonusPaths().forEach(path => {
    const current = Number(getPath(state, path, 0));
    const target = lineageSphereBonusTarget(path);
    if (target <= current) {
      unchanged.push(sphereLabel(path));
      return;
    }
    setPath(state, path, target);
    applied[path.split('.')[1]] = {
      from: current,
      to: target,
      points: target - current,
      lineageXp: Math.floor(lineageSphereXp(path.split('.')[1]))
    };
    changed.push(sphereLabel(path));
  });

  creationSettings().lineageSphereBonus = applied;
  creationSettings().lineageSphereBonusApplied = Boolean(Object.keys(applied).length) && !pendingLineageSphereBonusPaths().length;
  document.querySelectorAll('[data-dots]').forEach(renderDots);
  renderCreationSummary();
  updateAllDotCosts();
  updateLineageSphereBonusButton();
  if (unchanged.length) {
    setLineageBonusStatus(`Nenhuma alteração aplicada para ${unchanged.join(', ')}: atingiu o limite de experiência da esfera.`);
  } else {
    setLineageBonusStatus(changed.length ? `Linhagem aplicada em ${changed.join(', ')}.` : '');
  }
  console.log('[lineage bonus] Esferas aplicadas na criação', {
    applied,
    changed,
    unchanged
  });
}

function bindLineage() {
  document.querySelectorAll('[data-lineage-dots]').forEach(makeLineageDots);
  document.querySelectorAll('[data-lineage-xp]').forEach(makeLineageExperience);
  document.getElementById('lineageNameInput')?.addEventListener('input', event => {
    lineageState.name = event.target.value;
    setPath(state, 'identity.lineage', lineageState.name);
    event.target.setCustomValidity('');
    updateLineageSphereBonusButton();
  });
  document.getElementById('lineageNameInput')?.addEventListener('blur', loadLineageByNameOnBlur);
  document.getElementById('addLineageMemberBtn')?.addEventListener('click', () => addLineageMember());
  document.getElementById('applyLineageSphereBonusBtn')?.addEventListener('click', applyLineageSphereBonus);
  document.getElementById('closeLineageDeathModal')?.addEventListener('click', closeLineageDeathModal);
  document.getElementById('cancelLineageDeathBtn')?.addEventListener('click', closeLineageDeathModal);
  document.getElementById('confirmLineageDeathBtn')?.addEventListener('click', confirmLineageDeath);
  document.getElementById('closeLineageReviveModal')?.addEventListener('click', closeLineageReviveModal);
  document.getElementById('cancelLineageReviveBtn')?.addEventListener('click', closeLineageReviveModal);
  document.getElementById('confirmLineageReviveBtn')?.addEventListener('click', confirmLineageRevive);
  renderLineage();
}

function openLineageDeathModal(memberId) {
  pendingLineageDeathId = memberId;
  document.getElementById('lineageDeathModal').hidden = false;
}

function closeLineageDeathModal() {
  pendingLineageDeathId = null;
  document.getElementById('lineageDeathModal').hidden = true;
}

function openLineageReviveModal(memberId) {
  pendingLineageReviveId = memberId;
  document.getElementById('lineageReviveModal').hidden = false;
}

function closeLineageReviveModal() {
  pendingLineageReviveId = null;
  document.getElementById('lineageReviveModal').hidden = true;
}

async function confirmLineageDeath() {
  const member = lineageState.members.find(item => item.id === pendingLineageDeathId);
  if (!member) {
    console.warn('[lineage death] Nenhum personagem pendente encontrado.', { pendingLineageDeathId });
    closeLineageDeathModal();
    return;
  }

  const button = document.getElementById('confirmLineageDeathBtn');
  if (button) button.disabled = true;

  try {
    console.log('[lineage death] Confirmando morte', {
      memberName: member.name,
      lineageName: lineageName(),
      lineageSpheresBefore: { ...lineageState.spheres },
      lineageSphereExperienceBefore: { ...lineageState.sphereExperience }
    });
    const characterData = await fetchLineageMemberSheet(member);
    member.lineageContribution = absorbCharacterSpheresIntoLineage(characterData);
    member.dead = true;
    console.log('[lineage death] Morte confirmada e linhagem atualizada', {
      memberName: member.name,
      lineageContribution: member.lineageContribution,
      lineageSpheresAfter: { ...lineageState.spheres },
      lineageSphereExperienceAfter: { ...lineageState.sphereExperience }
    });
    closeLineageDeathModal();
    renderLineageMembers();
    document.querySelectorAll('[data-lineage-dots]').forEach(renderLineageDots);
    document.querySelectorAll('[data-lineage-xp]').forEach(renderLineageExperience);
  } catch (err) {
    console.error('[lineage] Nao foi possivel absorver as esferas do personagem.', err);
    alert('Nao foi possivel carregar a ficha desse personagem no GitHub. A morte nao foi confirmada.');
  } finally {
    if (button) button.disabled = false;
  }
}

function confirmLineageRevive() {
  const member = lineageState.members.find(item => item.id === pendingLineageReviveId);
  if (!member) {
    console.warn('[lineage revive] Nenhum personagem pendente encontrado.', { pendingLineageReviveId });
    closeLineageReviveModal();
    return;
  }

  console.log('[lineage revive] Confirmando retorno a vida', {
    memberName: member.name,
    lineageContribution: member.lineageContribution || {},
    lineageSpheresBefore: { ...lineageState.spheres },
    lineageSphereExperienceBefore: { ...lineageState.sphereExperience }
  });

  if (!Object.values(member.lineageContribution || {}).some(value => Number(value) > 0)) {
    console.warn('[lineage revive] Personagem morto sem contribuicao registrada. Nenhuma XP sera removida.', {
      memberName: member.name
    });
  }

  removeLineageContribution(member.lineageContribution || {});
  member.dead = false;
  member.lineageContribution = {};

  console.log('[lineage revive] Personagem revivido e linhagem atualizada', {
    memberName: member.name,
    lineageSpheresAfter: { ...lineageState.spheres },
    lineageSphereExperienceAfter: { ...lineageState.sphereExperience }
  });

  closeLineageReviveModal();
  renderLineageMembers();
  document.querySelectorAll('[data-lineage-dots]').forEach(renderLineageDots);
  document.querySelectorAll('[data-lineage-xp]').forEach(renderLineageExperience);
}
