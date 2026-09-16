function normalizeCovenData(data = {}) {
  const pantry = Array.from({ length: 16 }, (_, slot) => {
    const item = Array.isArray(data.pantry) ? data.pantry[slot] : null;
    if (!item || typeof item !== 'object') return null;
    const images = Array.isArray(item.images)
      ? item.images.map(String).filter(Boolean)
      : item.image ? [String(item.image)] : [];
    return {
      id: String(item.id || `item-${slot + 1}`),
      inventoryId: /^[A-Z]{3}\d{5}$/.test(String(item.inventoryId || '').toUpperCase())
        ? String(item.inventoryId).toUpperCase()
        : '',
      used: Boolean(item.used),
      name: String(item.name || ''),
      description: String(item.description || ''),
      image: images[0] || '',
      images
    };
  });
  return {
    name: typeof data.name === 'string' ? data.name : '',
    quintessence: Math.max(0, Number(data.quintessence) || 0),
    paradox: Math.max(0, Number(data.paradox) || 0),
    obolOfTheDead: Math.max(0, Number(data.obolOfTheDead) || 0),
    fame: Math.min(6, Math.max(0, Number(data.fame) || 0)),
    lab: typeof data.lab === 'string' ? data.lab : '',
    pantry,
    lock: data.lock && typeof data.lock === 'object' ? { ...data.lock } : null
  };
}

function covenItemImages(item) {
  if (!item) return [];
  if (activeCovenItemImageDraft?.id === item.id && Array.isArray(activeCovenItemImageDraft.images)) {
    return activeCovenItemImageDraft.images;
  }
  return Array.isArray(item.images) && item.images.length ? item.images : item.image ? [item.image] : [];
}

function covenItemImageSource(item, index = 0) {
  if (!item) return '';
  const pending = pendingCovenItemImages[item.id]?.images?.[index];
  if (pending?.dataUrl) return pending.dataUrl;
  const image = covenItemImages(item)[index];
  if (!image) return '';
  const baseUrl = githubLoadedSheetSource?.sheetsBaseUrl || currentSheetAssetBaseUrl || 'fichas';
  return assetUrl(baseUrl, image);
}

function renderCovenPantry() {
  const grid = document.getElementById('covenPantryGrid');
  if (!grid) return;
  grid.replaceChildren();
  covenState.pantry.forEach((item, slot) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'coven-pantry-slot';
    button.dataset.covenPantrySlot = slot;
    button.setAttribute('aria-label', item ? `Abrir item ${item.name}` : `Espaço ${slot + 1} vazio`);
    button.disabled = !item && !covenEditMode;
    if (item) {
      button.classList.add('has-item');
      const source = covenItemImageSource(item);
      if (source) {
        const image = document.createElement('img');
        image.src = source;
        image.alt = '';
        button.appendChild(image);
      }
      const name = document.createElement('span');
      name.textContent = item.name;
      button.appendChild(name);
    } else {
      const empty = document.createElement('span');
      empty.className = 'coven-pantry-empty';
      empty.textContent = '+';
      button.appendChild(empty);
    }
    button.addEventListener('click', () => openCovenItemModal(slot));
    grid.appendChild(button);
  });
}

function covenJson() {
  return JSON.stringify(normalizeCovenData(covenState), null, 2);
}

function covenLockIsActive(lock = covenState.lock, now = Date.now()) {
  if (!lock?.expiresAt) return false;
  const expiresAt = Date.parse(lock.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt > now;
}

function covenLockBelongsToSession(lock = covenState.lock) {
  return covenLockIsActive(lock) && lock.sessionId === covenEditorSessionId;
}

function covenGithubPath(auth) {
  return joinGitHubPath(auth.sheetsPath, covenFileName);
}

async function fetchCovenFromGithub(auth = null) {
  if (auth) {
    const file = await getGitHubFile(auth.repo, auth.branch, covenGithubPath(auth), auth.token);
    return {
      file,
      data: file?.content ? normalizeCovenData(JSON.parse(base64ToText(file.content))) : normalizeCovenData()
    };
  }
  const baseUrl = githubLoadedSheetSource?.sheetsBaseUrl || `${githubRawBase}/fichas`;
  const response = await fetch(githubRawFileUrl(baseUrl, covenFileName), { cache: 'no-store' });
  if (!response.ok) return { file: null, data: normalizeCovenData() };
  return { file: null, data: normalizeCovenData(await response.json()) };
}

function replaceCovenState(data) {
  const normalized = normalizeCovenData(data);
  Object.keys(covenState).forEach(key => delete covenState[key]);
  Object.assign(covenState, normalized);
}

function setCovenStatus(message = '', isError = false) {
  const status = document.getElementById('covenLockStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('error', isError);
}

function covenAuth() {
  return autosaveAuth || covenSyncAuth;
}

function activeCovenLockMessage(lock = covenState.lock) {
  if (!covenLockIsActive(lock)) return '';
  const owner = String(lock.owner || 'usuário desconhecido').trim();
  const expiresAt = new Date(lock.expiresAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `Coven em edição por ${owner} até ${expiresAt}.`;
}

function renderCovenLockStatus() {
  if (covenEditMode && covenLockBelongsToSession()) {
    const owner = String(covenState.lock.owner || 'usuário desconhecido').trim();
    const expiresAt = new Date(covenState.lock.expiresAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setCovenStatus(`Edição habilitada para ${owner} até ${expiresAt}.`);
    return;
  }
  setCovenStatus(activeCovenLockMessage());
}

function renderCoven() {
  document.querySelectorAll('[data-coven-field]').forEach(control => {
    control.value = covenState[control.dataset.covenField] ?? '';
    control.disabled = !covenEditMode;
  });
  document.querySelectorAll('[data-coven-stepper]').forEach(button => {
    const value = Number(covenState[button.dataset.covenTarget]) || 0;
    const removalUnits = button.dataset.covenTarget === 'paradox' ? 2 : 1;
    const unavailableRemoval = button.dataset.covenStepper === 'down' && value < removalUnits;
    button.disabled = !covenEditMode || unavailableRemoval;
  });
  renderCovenFameDescription();
  const editButton = document.getElementById('covenEditBtn');
  if (editButton) {
    editButton.setAttribute('aria-label', covenEditMode ? 'Concluir edição do coven' : 'Editar coven');
    editButton.title = covenEditMode ? 'Concluir edição do coven' : 'Editar coven';
    editButton.classList.toggle('active', covenEditMode);
  }
  renderCovenPantry();
  renderCovenLockStatus();
}

function renderCovenFameDescription() {
  const selected = covenFameLevels.find(item => item.level === Number(covenState.fame)) || covenFameLevels[0];
  const description = document.getElementById('covenFameDescription');
  const select = document.querySelector('[data-coven-field="fame"]');
  if (description) description.textContent = selected.description;
  if (select) select.title = `${selected.classification}: ${selected.description}`;
}

function setCovenItemModalStatus(message = '', isError = false) {
  const status = document.getElementById('covenItemModalStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('error', isError);
}

function renderCovenItemModalImage(item) {
  const preview = document.getElementById('covenItemImagePreview');
  const placeholder = document.getElementById('covenItemImagePlaceholder');
  const images = covenItemImages(item);
  if (activeCovenItemImageIndex >= images.length) activeCovenItemImageIndex = Math.max(0, images.length - 1);
  const source = covenItemImageSource(item, activeCovenItemImageIndex);
  const hasMultiple = images.length > 1;
  const previous = document.getElementById('previousCovenItemImageBtn');
  const next = document.getElementById('nextCovenItemImageBtn');
  const counter = document.getElementById('covenItemImageCounter');
  preview.hidden = !source;
  placeholder.hidden = Boolean(source);
  if (source) preview.src = source;
  else preview.removeAttribute('src');
  previous.hidden = !hasMultiple;
  next.hidden = !hasMultiple;
  counter.hidden = !hasMultiple;
  if (hasMultiple) counter.textContent = `${activeCovenItemImageIndex + 1} de ${images.length}`;
}

function openCovenItemModal(slot) {
  const item = covenState.pantry[slot];
  if (!item && !covenEditMode) return;
  activeCovenPantrySlot = slot;
  activeCovenItemImageDraft = null;
  activeCovenItemImageIndex = 0;
  const editable = covenEditMode;
  document.getElementById('covenItemModalTitle').textContent = item ? item.name || 'Item da dispensa' : 'Adicionar item à dispensa';
  document.getElementById('covenItemName').value = item?.name || '';
  document.getElementById('covenItemDescription').value = item?.description || '';
  document.getElementById('covenInventoryItemId').value = '';
  document.getElementById('covenInventoryItemId').disabled = !editable;
  document.getElementById('importCovenInventoryItemBtn').disabled = !editable;
  document.getElementById('covenInventoryImport').hidden = !editable;
  const reference = document.getElementById('covenInventoryItemReference');
  reference.hidden = !item?.inventoryId;
  reference.textContent = item?.inventoryId ? `ID do inventário: ${item.inventoryId}` : '';
  const usedStatus = document.getElementById('covenItemUsedStatus');
  usedStatus.hidden = !item?.inventoryId;
  usedStatus.classList.toggle('is-used', Boolean(item?.used));
  usedStatus.textContent = item?.used ? 'Item já usado' : 'Disponível para uso';
  document.getElementById('covenItemName').disabled = !editable;
  document.getElementById('covenItemDescription').disabled = !editable;
  document.getElementById('covenItemImageInput').disabled = !editable;
  document.getElementById('covenItemImagePicker').classList.toggle('is-readonly', !editable);
  document.getElementById('covenItemEditActions').hidden = !editable;
  document.getElementById('deleteCovenItemBtn').hidden = !editable || !item;
  document.getElementById('covenItemUseActions').hidden = !editable || !item?.inventoryId || item.used;
  document.getElementById('covenItemImageInput').value = '';
  setCovenItemModalStatus('');
  renderCovenItemModalImage(item);
  document.getElementById('covenItemModal').hidden = false;
}

function closeCovenItemModal() {
  if (activeCovenItemImageDraft) delete pendingCovenItemImages[activeCovenItemImageDraft.id];
  activeCovenPantrySlot = null;
  activeCovenItemImageDraft = null;
  activeCovenItemImageIndex = 0;
  document.getElementById('covenItemModal').hidden = true;
}

function covenItemId(slot) {
  return covenState.pantry[slot]?.id || `item-${Date.now()}-${slot + 1}`;
}

function covenItemImagePath(itemId, extension = 'png') {
  return `imagens/coven/${snakeCase(itemId)}.${extension}`;
}

function covenItemImagePaths(itemId, images) {
  return images.map((image, index) => {
    const extension = image.extension || imageExtensionFromMime(dataUrlMime(image.dataUrl));
    return `imagens/coven/${snakeCase(itemId)}-${index + 1}.${extension}`;
  });
}

function inventoryRootBaseUrl() {
  const sheetsBaseUrl = githubLoadedSheetSource?.sheetsBaseUrl;
  if (sheetsBaseUrl) return sheetsBaseUrl.replace(/\/[^/]+\/?$/, '');
  if (/^https?:/i.test(currentSheetAssetBaseUrl)) return currentSheetAssetBaseUrl.replace(/\/[^/]+\/?$/, '');
  return githubRawBase;
}

async function fetchInventoryCatalog() {
  const syncAuth = covenAuth();
  if (syncAuth) {
    const apiPaths = [joinGitHubPath(syncAuth.sheetsPath, 'itens.json'), 'itens.json'];
    for (const path of [...new Set(apiPaths)]) {
      const file = await getGitHubFile(syncAuth.repo, syncAuth.branch, path, syncAuth.token);
      if (file?.content) {
        const inventoryPath = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
        return {
          items: JSON.parse(base64ToText(file.content)),
          auth: { ...syncAuth, inventoryPath },
          baseUrl: ''
        };
      }
    }
  }
  const bases = [
    githubLoadedSheetSource?.sheetsBaseUrl,
    inventoryRootBaseUrl(),
    `${githubRawBase}/fichas`,
    githubRawBase
  ].filter(Boolean);
  for (const baseUrl of [...new Set(bases)]) {
    const response = await fetch(githubRawFileUrl(baseUrl, 'itens.json'), { cache: 'no-store' });
    if (response.ok) return { items: await response.json(), auth: null, baseUrl };
  }
  throw new Error('Não foi possível carregar itens.json.');
}

function imageMimeFromPath(path) {
  const extension = String(path).split('.').pop()?.toLowerCase();
  return { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }[extension] || 'image/png';
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result || '')));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(blob);
  });
}

async function fetchInventoryImage(path, source) {
  if (source.auth) {
    const imagePath = joinGitHubPath(source.auth.inventoryPath, path);
    const file = await getGitHubFile(source.auth.repo, source.auth.branch, imagePath, source.auth.token);
    if (!file?.content) throw new Error(`Imagem não encontrada: ${path}`);
    return `data:${imageMimeFromPath(path)};base64,${file.content.replace(/\n/g, '')}`;
  }
  const response = await fetch(assetUrl(source.baseUrl, path), { cache: 'no-store' });
  if (!response.ok) throw new Error(`Imagem não encontrada: ${path}`);
  return blobToDataUrl(await response.blob());
}

async function importInventoryItem() {
  if (!covenEditMode || activeCovenPantrySlot === null) return;
  const input = document.getElementById('covenInventoryItemId');
  const inventoryId = input.value.trim().toUpperCase();
  if (!/^[A-Z]{3}\d{5}$/.test(inventoryId)) {
    setCovenItemModalStatus('Informe um ID no formato ABC12345.', true);
    return;
  }
  const button = document.getElementById('importCovenInventoryItemBtn');
  button.disabled = true;
  setCovenItemModalStatus(`Buscando ${inventoryId} no inventário...`);
  try {
    const source = await fetchInventoryCatalog();
    const inventory = Array.isArray(source.items) ? source.items : [];
    const found = inventory.find(item => String(item?.id || '').toUpperCase() === inventoryId);
    if (!found) throw new Error(`Nenhum item encontrado com o ID ${inventoryId}.`);
    const sourcePaths = Array.isArray(found.images) ? found.images.map(String).filter(Boolean) : [];
    const downloaded = await Promise.all(sourcePaths.map(path => fetchInventoryImage(path, source)));
    const id = covenItemId(activeCovenPantrySlot);
    const pendingImages = downloaded.map((dataUrl, index) => ({
      dataUrl,
      extension: imageExtensionFromMime(dataUrlMime(dataUrl)),
      sourcePath: sourcePaths[index]
    }));
    const paths = covenItemImagePaths(id, pendingImages);
    pendingCovenItemImages[id] = { images: pendingImages };
    activeCovenItemImageDraft = {
      id,
      inventoryId,
      image: paths[0] || '',
      images: paths
    };
    activeCovenItemImageIndex = 0;
    document.getElementById('covenItemName').value = String(found.name || '');
    document.getElementById('covenItemDescription').value = String(found.description || '');
    const reference = document.getElementById('covenInventoryItemReference');
    reference.hidden = false;
    reference.textContent = `ID do inventário: ${inventoryId}`;
    const usedStatus = document.getElementById('covenItemUsedStatus');
    usedStatus.hidden = false;
    usedStatus.classList.remove('is-used');
    usedStatus.textContent = 'Disponível para uso';
    renderCovenItemModalImage({ ...found, ...activeCovenItemImageDraft });
    setCovenItemModalStatus(`Item ${inventoryId} importado. Salve o item e depois conclua a edição do coven.`);
  } catch (error) {
    setCovenItemModalStatus(error.message || 'Não foi possível importar o item.', true);
  } finally {
    button.disabled = false;
  }
}

function navigateCovenItemImage(direction) {
  if (activeCovenPantrySlot === null) return;
  const item = covenState.pantry[activeCovenPantrySlot] || activeCovenItemImageDraft;
  const images = covenItemImages(item);
  if (images.length < 2) return;
  activeCovenItemImageIndex = (activeCovenItemImageIndex + direction + images.length) % images.length;
  renderCovenItemModalImage(item);
}

function openCovenItemDeleteModal() {
  if (!covenEditMode || activeCovenPantrySlot === null) return;
  const item = covenState.pantry[activeCovenPantrySlot];
  if (!item) return;
  document.getElementById('covenItemDeleteMessage').textContent = `Excluir “${item.name}” da dispensa? A exclusão será salva automaticamente sem liberar o lock.`;
  document.getElementById('covenItemDeleteModal').hidden = false;
}

function closeCovenItemDeleteModal() {
  document.getElementById('covenItemDeleteModal').hidden = true;
}

function confirmCovenItemDelete() {
  if (!covenEditMode || activeCovenPantrySlot === null) return closeCovenItemDeleteModal();
  const item = covenState.pantry[activeCovenPantrySlot];
  if (item) delete pendingCovenItemImages[item.id];
  covenState.pantry[activeCovenPantrySlot] = null;
  closeCovenItemDeleteModal();
  closeCovenItemModal();
  renderCovenPantry();
  queueCovenProgressSave('Exclusão de item da dispensa');
}

function inventoryEffectPath(effect) {
  const path = `spheres.${String(effect?.sphere || '')}`;
  return spherePaths.includes(path) ? path : '';
}

function sphereDisplayName(path) {
  return document.querySelector(`[data-dots="${path}"]`)?.dataset.label || path.split('.')[1];
}

async function useCovenInventoryItem() {
  if (!covenEditMode || activeCovenPantrySlot === null) return;
  const item = covenState.pantry[activeCovenPantrySlot];
  if (!item?.inventoryId || item.used) return;
  const button = document.getElementById('useCovenInventoryItemBtn');
  button.disabled = true;
  setCovenItemModalStatus(`Buscando efeitos de ${item.inventoryId}...`);
  try {
    const source = await fetchInventoryCatalog();
    const inventory = Array.isArray(source.items) ? source.items : [];
    const found = inventory.find(candidate => String(candidate?.id || '').toUpperCase() === item.inventoryId);
    if (!found) throw new Error(`Nenhum item encontrado com o ID ${item.inventoryId}.`);
    const effects = Array.isArray(found.effects)
      ? found.effects.map(effect => ({
        path: inventoryEffectPath(effect),
        points: Math.max(0, Number(effect.points) || 0),
        minLevel: Math.max(0, Number(effect.minLevel) || 0),
        maxLevel: Math.max(0, Number(effect.maxLevel) || 0)
      })).filter(effect => effect.path && effect.points > 0)
      : [];
    if (!effects.length) throw new Error('Este item não possui efeitos de Esfera configurados.');
    const previewEffects = effects.map(effect => {
      const current = Math.max(0, Number(getPath(state, effect.path, 0)) || 0);
      const target = Math.max(current, Math.min(effect.maxLevel, current + effect.points));
      return {
        ...effect,
        name: sphereDisplayName(effect.path),
        current,
        target,
        eligible: current >= effect.minLevel
      };
    });
    pendingCovenItemUsePreview = { itemId: item.id, effects: previewEffects };
    document.getElementById('covenItemUseSummary').textContent = `Efeitos de “${item.name}” (${item.inventoryId})`;
    document.getElementById('covenItemUseEffects').replaceChildren(...previewEffects.map(effect => {
      const row = document.createElement('div');
      row.className = `coven-item-use-effect${effect.eligible ? '' : ' is-unavailable'}`;
      row.textContent = effect.eligible
        ? `${effect.name}: ${effect.current} + ${effect.points} → ${effect.target} (máximo ${effect.maxLevel})`
        : `${effect.name}: não aplicado — nível atual ${effect.current}, mínimo exigido ${effect.minLevel}`;
      return row;
    }));
    document.getElementById('covenItemUseModal').hidden = false;
    setCovenItemModalStatus('Revise os efeitos antes de confirmar o uso.');
  } catch (error) {
    setCovenItemModalStatus(error.message || 'Não foi possível preparar o uso do item.', true);
  } finally {
    button.disabled = false;
  }
}

function closeCovenItemUseModal() {
  pendingCovenItemUsePreview = null;
  document.getElementById('covenItemUseModal').hidden = true;
}

function confirmCovenItemUse() {
  if (!covenEditMode || activeCovenPantrySlot === null || !pendingCovenItemUsePreview) {
    closeCovenItemUseModal();
    return;
  }
  const item = covenState.pantry[activeCovenPantrySlot];
  if (!item || item.id !== pendingCovenItemUsePreview.itemId || item.used) {
    closeCovenItemUseModal();
    return;
  }
  const eligible = pendingCovenItemUsePreview.effects.filter(effect => effect.eligible);
  eligible.forEach(effect => setPath(state, effect.path, effect.target));
  item.used = true;
  eligible.forEach(effect => {
    const container = document.querySelector(`[data-dots="${effect.path}"]`);
    if (container) renderDots(container);
  });
  renderCreationSummary();
  updateAllDotCosts();
  updateLineageSphereBonusButton();
  document.getElementById('covenItemUseActions').hidden = true;
  const usedStatus = document.getElementById('covenItemUsedStatus');
  usedStatus.hidden = false;
  usedStatus.classList.add('is-used');
  usedStatus.textContent = 'Item já usado';
  const applied = eligible.map(effect => `${effect.name} ${effect.current}→${effect.target}`);
  closeCovenItemUseModal();
  setCovenItemModalStatus(applied.length
    ? `Item usado: ${applied.join('; ')}. A marca de uso será salva automaticamente.`
    : 'Item usado sem efeitos aplicáveis. A marca de uso será salva automaticamente.');
  queueCovenProgressSave(`Consumo do item ${item.name}`);
}

async function handleCovenItemImage(file) {
  if (!file || activeCovenPantrySlot === null) return;
  if (!file.type.startsWith('image/')) {
    setCovenItemModalStatus('Selecione um arquivo de imagem.', true);
    return;
  }
  try {
    const dataUrl = await cropImageFileToSquareDataUrl(file);
    const id = covenItemId(activeCovenPantrySlot);
    const extension = imageExtensionFromMime(dataUrlMime(dataUrl));
    const pendingImages = [{ dataUrl, extension }];
    const paths = covenItemImagePaths(id, pendingImages);
    pendingCovenItemImages[id] = { images: pendingImages };
    const existing = covenState.pantry[activeCovenPantrySlot] || { id, name: '', description: '', image: '', images: [] };
    activeCovenItemImageDraft = { id, image: paths[0], images: paths };
    activeCovenItemImageIndex = 0;
    renderCovenItemModalImage({ ...existing, ...activeCovenItemImageDraft });
    setCovenItemModalStatus('Imagem pronta para upload ao salvar o coven.');
  } catch (err) {
    setCovenItemModalStatus('Não foi possível carregar essa imagem.', true);
  }
}

function saveCovenItem(event) {
  event.preventDefault();
  if (!covenEditMode || activeCovenPantrySlot === null) return;
  const slot = activeCovenPantrySlot;
  const existing = covenState.pantry[slot];
  const name = document.getElementById('covenItemName').value.trim();
  if (!name) return setCovenItemModalStatus('Informe o nome do item.', true);
  covenState.pantry[slot] = {
    id: activeCovenItemImageDraft?.id || existing?.id || covenItemId(slot),
    inventoryId: activeCovenItemImageDraft?.inventoryId || existing?.inventoryId || '',
    used: activeCovenItemImageDraft?.inventoryId && activeCovenItemImageDraft.inventoryId !== existing?.inventoryId
      ? false
      : existing?.used || false,
    name,
    description: document.getElementById('covenItemDescription').value.trim(),
    image: activeCovenItemImageDraft?.image || existing?.image || '',
    images: activeCovenItemImageDraft?.images || existing?.images || (existing?.image ? [existing.image] : [])
  };
  activeCovenItemImageDraft = null;
  closeCovenItemModal();
  renderCovenPantry();
  queueCovenProgressSave(`Cadastro ou alteração do item ${name}`);
}

async function uploadPendingCovenItemImages(auth) {
  for (const [itemId, pending] of Object.entries(pendingCovenItemImages)) {
    const item = covenState.pantry.find(candidate => candidate?.id === itemId);
    if (!item?.images?.length) continue;
    for (let index = 0; index < pending.images.length; index += 1) {
      const image = pending.images[index];
      const imagePath = item.images[index];
      if (!image?.dataUrl || !imagePath) continue;
      await upsertGitHubFileBase64(
        auth.repo,
        auth.branch,
        joinGitHubPath(auth.sheetsPath, imagePath),
        dataUrlBase64(image.dataUrl),
        `Atualiza imagem ${index + 1} do item ${item.name || itemId} do coven`,
        auth.token
      );
    }
    delete pendingCovenItemImages[itemId];
  }
}

function enqueueCovenSave(save) {
  covenProgressSaveQueue = covenProgressSaveQueue
    .catch(() => {})
    .then(save);
  return covenProgressSaveQueue;
}

function queueCovenProgressSave(reason = 'Atualização da dispensa') {
  return enqueueCovenSave(async () => {
    const auth = covenAuth();
    if (!covenEditMode || !auth) return false;
    setCovenStatus(`${reason}. Salvando automaticamente sem liberar o lock...`);
    try {
      const { file, data } = await fetchCovenFromGithub(auth);
      if (!file?.sha || !covenLockBelongsToSession(data.lock)) {
        stopCovenEditing('O lock do coven mudou antes do salvamento automático. A edição foi pausada.');
        setCovenStatus('O lock do coven mudou antes do salvamento automático. A edição foi pausada.', true);
        return false;
      }
      await uploadPendingCovenItemImages(auth);
      const next = normalizeCovenData({ ...covenState, lock: data.lock });
      await putGitHubFile(
        auth.repo,
        auth.branch,
        covenGithubPath(auth),
        JSON.stringify(next, null, 2),
        `Autosave do coven: ${reason}`,
        auth.token,
        file.sha
      );
      replaceCovenState(next);
      renderCoven();
      setCovenStatus('Dispensa salva automaticamente. O lock de edição continua ativo.');
      return true;
    } catch (error) {
      console.error('[coven] Falha no salvamento automático da dispensa.', error);
      setCovenStatus('Não foi possível salvar automaticamente a Dispensa. Tente concluir a edição novamente.', true);
      return false;
    }
  });
}

function stopCovenEditing(message = '') {
  covenEditMode = false;
  window.clearTimeout(covenLockTimer);
  covenLockTimer = null;
  if (!document.getElementById('covenItemModal')?.hidden) closeCovenItemModal();
  closeCovenItemDeleteModal();
  closeCovenItemUseModal();
  renderCoven();
  if (message) setCovenStatus(message);
}

function scheduleCovenLockExpiry() {
  window.clearTimeout(covenLockTimer);
  const delay = Math.max(0, Date.parse(covenState.lock.expiresAt) - Date.now());
  covenLockTimer = window.setTimeout(() => {
    finishCovenEditing({ automatic: true, allowExpiredOwnLock: true });
  }, delay);
}

async function loadCoven(auth = null) {
  try {
    const { data } = await fetchCovenFromGithub(auth);
    if (!covenEditMode) replaceCovenState(data);
    renderCoven();
  } catch (err) {
    console.error('[coven] Não foi possível carregar o coven.', err);
    setCovenStatus('Não foi possível carregar o coven.', true);
  }
}

function setCovenGithubModalStatus(message = '', isError = false) {
  const status = document.getElementById('covenGithubModalStatus');
  status.textContent = message;
  status.classList.toggle('error', isError);
}

function openCovenGithubModal() {
  const settings = getGithubSettings();
  document.getElementById('covenGithubUser').value = settings.user || '';
  document.getElementById('covenGithubPat').value = '';
  setCovenGithubModalStatus('');
  document.getElementById('covenGithubModal').hidden = false;
  (settings.user ? document.getElementById('covenGithubPat') : document.getElementById('covenGithubUser')).focus();
}

function closeCovenGithubModal() {
  document.getElementById('covenGithubModal').hidden = true;
  document.getElementById('covenGithubPat').value = '';
}

async function connectCovenGithub(event) {
  event.preventDefault();
  const user = document.getElementById('covenGithubUser').value.trim();
  const token = document.getElementById('covenGithubPat').value.trim();
  const settings = getGithubSettings();
  const button = document.getElementById('covenGithubSubmitBtn');
  button.disabled = true;
  setCovenGithubModalStatus('Validando credenciais...');
  try {
    await verifyGithubUser(user, token);
    covenSyncAuth = { user, token, repo: settings.repo, branch: settings.branch, sheetsPath: settings.sheetsPath };
    storeGithubSettings({ user });
    closeCovenGithubModal();
    await beginCovenEditing();
  } catch (error) {
    covenSyncAuth = null;
    document.getElementById('covenGithubPat').value = '';
    setCovenGithubModalStatus(error.message || 'Não foi possível autenticar no GitHub.', true);
  } finally {
    button.disabled = false;
  }
}

async function beginCovenEditing() {
  const auth = covenAuth();
  if (!auth) {
    openCovenGithubModal();
    return;
  }

  const button = document.getElementById('covenEditBtn');
  button.disabled = true;
  setCovenStatus('Verificando lock do coven...');
  try {
    await enqueueCovenSave(async () => {
      const maximumAttempts = 3;
      for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
        const { file, data } = await fetchCovenFromGithub(auth);
        if (covenLockIsActive(data.lock) && data.lock.sessionId !== covenEditorSessionId) {
          replaceCovenState(data);
          renderCoven();
          setCovenStatus(activeCovenLockMessage(data.lock), true);
          return;
        }

        const acquiredAt = new Date();
        data.lock = {
          owner: auth.user || auth.repo.split('/')[0],
          sessionId: covenEditorSessionId,
          acquiredAt: acquiredAt.toISOString(),
          expiresAt: new Date(acquiredAt.getTime() + covenLockDurationMs).toISOString()
        };
        try {
          await putGitHubFile(
            auth.repo,
            auth.branch,
            covenGithubPath(auth),
            JSON.stringify(data, null, 2),
            'Adquire lock de edição do coven',
            auth.token,
            file?.sha || null
          );
        } catch (error) {
          if (error.status === 409 && attempt < maximumAttempts) continue;
          throw error;
        }
        replaceCovenState(data);
        covenEditMode = true;
        scheduleCovenLockExpiry();
        renderCoven();
        return;
      }
    });
  } catch (err) {
    console.error('[coven] Não foi possível adquirir o lock.', err);
    setCovenStatus('O lock não pôde ser adquirido; releia o coven e tente novamente.', true);
  } finally {
    button.disabled = false;
  }
}

async function finishCovenEditing({ automatic = false, allowExpiredOwnLock = false } = {}) {
  const auth = covenAuth();
  const button = document.getElementById('covenEditBtn');
  button.disabled = true;
  if (automatic) {
    covenEditMode = false;
    if (!document.getElementById('covenItemModal')?.hidden) closeCovenItemModal();
    closeCovenItemDeleteModal();
    closeCovenItemUseModal();
    renderCoven();
  }
  setCovenStatus(automatic
    ? 'Limite de 10 minutos atingido. Salvando o coven automaticamente...'
    : 'Salvando coven e removendo lock...');
  try {
    await covenProgressSaveQueue;
    const { file, data } = await fetchCovenFromGithub(auth);
    const ownsRemoteLock = data.lock?.sessionId === covenEditorSessionId
      && (covenLockIsActive(data.lock) || allowExpiredOwnLock);
    if (!ownsRemoteLock) {
      replaceCovenState(data);
      stopCovenEditing(automatic
        ? 'Edição pausada após 10 minutos. O lock mudou antes do salvamento automático; as alterações não foram enviadas.'
        : 'O lock expirou ou pertence a outra sessão; as alterações não foram enviadas.');
      return;
    }
    await uploadPendingCovenItemImages(auth);
    const next = normalizeCovenData({ ...covenState, lock: null });
    await putGitHubFile(
      auth.repo,
      auth.branch,
      covenGithubPath(auth),
      JSON.stringify(next, null, 2),
      'Atualiza coven e remove lock de edição',
      auth.token,
      file.sha
    );
    replaceCovenState(next);
    stopCovenEditing(automatic
      ? 'Coven salvo automaticamente após 10 minutos. Edição pausada.'
      : 'Coven salvo.');
  } catch (err) {
    console.error('[coven] Não foi possível concluir a edição.', err);
    if (automatic) {
      stopCovenEditing('Edição pausada após 10 minutos, mas o salvamento automático falhou. Reabra a edição para tentar novamente.');
      setCovenStatus('Edição pausada após 10 minutos, mas o salvamento automático falhou. Reabra a edição para tentar novamente.', true);
    } else {
      setCovenStatus('Não foi possível salvar e remover o lock. Tente novamente antes da expiração.', true);
    }
  } finally {
    button.disabled = false;
  }
}

async function uploadCovenToGithub(auth, message = 'Autosave coven') {
  return enqueueCovenSave(async () => {
    if (!covenEditMode || !covenLockBelongsToSession()) return '';
    const { file, data } = await fetchCovenFromGithub(auth);
    if (!covenLockBelongsToSession(data.lock)) {
      replaceCovenState(data);
      stopCovenEditing('O lock do coven não está mais ativo; alterações não enviadas.');
      return '';
    }
    covenState.lock = data.lock;
    await uploadPendingCovenItemImages(auth);
    await putGitHubFile(auth.repo, auth.branch, covenGithubPath(auth), covenJson(), message, auth.token, file.sha);
    return covenGithubPath(auth);
  });
}

function bindCoven() {
  document.querySelectorAll('[data-coven-field]').forEach(control => {
    control.addEventListener('input', event => {
      if (!covenEditMode) return renderCoven();
      const key = event.target.dataset.covenField;
      covenState[key] = event.target.type === 'number' || key === 'fame' ? Number(event.target.value || 0) : event.target.value;
      if (key === 'fame') renderCovenFameDescription();
    });
  });
  document.querySelectorAll('[data-coven-stepper]').forEach(button => {
    button.addEventListener('click', () => {
      if (!covenEditMode) return;
      if (button.dataset.covenTarget === 'quintessence' || button.dataset.covenTarget === 'paradox') {
        transferCharacterResourceToCoven(button.dataset.covenTarget, button.dataset.covenStepper === 'up' ? 1 : -1);
        return;
      }
      const input = document.querySelector(`[data-coven-field="${button.dataset.covenTarget}"]`);
      const direction = button.dataset.covenStepper === 'up' ? 1 : -1;
      input.value = Math.min(Number(input.max), Math.max(Number(input.min), Number(input.value || 0) + direction));
      input.dispatchEvent(new Event('input', { bubbles: true }));
      renderCoven();
    });
  });
  document.getElementById('covenEditBtn')?.addEventListener('click', () => {
    if (covenEditMode) finishCovenEditing();
    else beginCovenEditing();
  });
  document.getElementById('covenGithubForm')?.addEventListener('submit', connectCovenGithub);
  document.getElementById('closeCovenGithubModal')?.addEventListener('click', closeCovenGithubModal);
  document.getElementById('closeCovenItemModal')?.addEventListener('click', closeCovenItemModal);
  document.getElementById('covenItemForm')?.addEventListener('submit', saveCovenItem);
  document.getElementById('covenItemImageInput')?.addEventListener('change', event => handleCovenItemImage(event.target.files?.[0]));
  document.getElementById('importCovenInventoryItemBtn')?.addEventListener('click', importInventoryItem);
  document.getElementById('previousCovenItemImageBtn')?.addEventListener('click', () => navigateCovenItemImage(-1));
  document.getElementById('nextCovenItemImageBtn')?.addEventListener('click', () => navigateCovenItemImage(1));
  document.getElementById('deleteCovenItemBtn')?.addEventListener('click', openCovenItemDeleteModal);
  document.getElementById('closeCovenItemDeleteModal')?.addEventListener('click', closeCovenItemDeleteModal);
  document.getElementById('cancelCovenItemDeleteBtn')?.addEventListener('click', closeCovenItemDeleteModal);
  document.getElementById('confirmCovenItemDeleteBtn')?.addEventListener('click', confirmCovenItemDelete);
  document.getElementById('useCovenInventoryItemBtn')?.addEventListener('click', useCovenInventoryItem);
  document.getElementById('closeCovenItemUseModal')?.addEventListener('click', closeCovenItemUseModal);
  document.getElementById('cancelCovenItemUseBtn')?.addEventListener('click', closeCovenItemUseModal);
  document.getElementById('confirmCovenItemUseBtn')?.addEventListener('click', confirmCovenItemUse);
  renderCoven();
}

function transferCharacterResourceToCoven(resource, direction) {
  const characterPath = `advantages.${resource}`;
  const characterValue = Number(getPath(state, characterPath, 0)) || 0;
  const covenValue = Number(covenState[resource]) || 0;
  const characterUnits = resource === 'quintessence' ? 2 : 1;
  const covenUnits = resource === 'quintessence' ? 1 : 2;

  if (direction > 0) {
    if (characterValue < characterUnits) {
      setCovenStatus(resource === 'quintessence'
        ? 'O personagem precisa de 2 pontos de Quintessência para transferir 1 ao coven.'
        : 'O personagem precisa de 1 ponto de Paradoxo para transferir 2 ao coven.', true);
      return;
    }
    setPath(state, characterPath, characterValue - characterUnits);
    covenState[resource] = covenValue + covenUnits;
  } else {
    if (covenValue < covenUnits) return;
    if (characterValue + characterUnits > 10) {
      setCovenStatus('O personagem não pode receber a devolução porque atingiria mais de 10 pontos.', true);
      return;
    }
    covenState[resource] = covenValue - covenUnits;
    setPath(state, characterPath, characterValue + characterUnits);
  }

  setCovenStatus('');
  renderFields();
  renderCoven();
}
