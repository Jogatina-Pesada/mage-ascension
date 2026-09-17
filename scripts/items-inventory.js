(() => {
  'use strict';

  const STORAGE_KEY = 'mage-ascension-items-v1';
  const GITHUB_SETTINGS_KEY = 'mage-ascension-items-github-v1';
  const SHARED_GITHUB_SETTINGS_KEY = 'mage-ascension-github-settings';
  const DEFAULT_GITHUB_REPO = 'uneluneravie/mage-ascension';
  const PASSWORD_HASH = 'b1529e22616716e47e4bb526bd1673c2e3b987ad7475d608ee615549e2cd5cd4';
  const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
  const sphereLabels = {
    fate: 'Destino', space: 'Espaço', spirit: 'Espírito', forces: 'Forças', matter: 'Matéria',
    mind: 'Mente', death: 'Morte', prime: 'Primórdio', time: 'Tempo', life: 'Vida'
  };

  const elements = {};
  let items = [];
  let pendingImages = [];
  let pendingSync = null;
  let githubSessionAuth = null;

  function normalizeSearch(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function sanitizeEffect(effect) {
    const sphere = sphereLabels[effect?.sphere] ? effect.sphere : '';
    return {
      sphere,
      points: Number.parseInt(effect?.points, 10) || 0,
      minLevel: Number.parseInt(effect?.minLevel, 10) || 0,
      maxLevel: Number.parseInt(effect?.maxLevel, 10) || 0
    };
  }

  function sanitizeImage(image, index = 0) {
    if (typeof image === 'string') {
      const isDataUrl = image.startsWith('data:image/');
      return {
        id: createId(),
        name: isDataUrl ? `imagem-${index + 1}.${image.includes('image/jpeg') ? 'jpg' : 'png'}` : image.split('/').pop(),
        type: isDataUrl ? image.slice(5, image.indexOf(';')) : '',
        dataUrl: isDataUrl ? image : '',
        path: isDataUrl ? '' : cleanGitHubPath(image)
      };
    }
    return {
      id: String(image?.id || createId()),
      name: String(image?.name || `imagem-${index + 1}.png`),
      type: String(image?.type || ''),
      dataUrl: typeof image?.dataUrl === 'string' && image.dataUrl.startsWith('data:image/') ? image.dataUrl : '',
      path: typeof image?.path === 'string' ? cleanGitHubPath(image.path) : ''
    };
  }

  function sanitizeItem(item) {
    const rawImages = Array.isArray(item?.images) ? item.images : item?.image ? [item.image] : [];
    const name = String(item?.name || '').slice(0, 120);
    const currentId = String(item?.id || '').toUpperCase();
    return {
      id: /^[A-Z]{3}\d{5}$/.test(currentId) ? currentId : createItemId(name),
      name,
      description: String(item?.description || '').slice(0, 2000),
      imageFolder: typeof item?.imageFolder === 'string' ? cleanGitHubPath(item.imageFolder) : '',
      images: rawImages.map(sanitizeImage).filter(image => image.dataUrl || image.path),
      effects: Array.isArray(item?.effects) ? item.effects.map(sanitizeEffect).filter(effect => effect.sphere) : []
    };
  }

  function createId() {
    return globalThis.crypto?.randomUUID?.() || `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function createItemId(name) {
    const letters = normalizeSearch(name).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3).padEnd(3, 'X');
    let number;
    if (globalThis.crypto?.getRandomValues) {
      const random = new Uint32Array(1);
      globalThis.crypto.getRandomValues(random);
      number = random[0] % 100000;
    } else {
      number = Math.floor(Math.random() * 100000);
    }
    return `${letters}${String(number).padStart(5, '0')}`;
  }

  function createUniqueItemId(name) {
    const usedIds = new Set(items.map(item => item.id));
    let id = createItemId(name);
    while (usedIds.has(id)) id = createItemId(name);
    return id;
  }

  function readStoredItems() {
    let storedText = '[]';
    try {
      storedText = localStorage.getItem(STORAGE_KEY) || '[]';
      const stored = JSON.parse(storedText);
      items = Array.isArray(stored) ? stored.map(sanitizeItem).filter(item => item.name) : [];
    } catch (_) {
      items = [];
    }
    try {
      const migratedText = JSON.stringify(items);
      if (migratedText !== storedText) localStorage.setItem(STORAGE_KEY, migratedText);
    } catch (_) {
      // A migracao continua valida em memoria mesmo se o armazenamento estiver cheio.
    }
    return items;
  }

  async function loadItems() {
    try {
      const response = await fetch(new URL('itens.json', document.baseURI), { cache: 'no-store' });
      if (!response.ok) throw new Error(`Falha ao carregar itens.json (${response.status}).`);
      const catalog = await response.json();
      if (!Array.isArray(catalog)) throw new Error('O conteúdo de itens.json é inválido.');
      items = catalog.map(sanitizeItem).filter(item => item.name);
      saveItems();
      return items;
    } catch (error) {
      const stored = readStoredItems();
      if (stored.length) return stored;
      throw error;
    }
  }

  function saveItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function loadGitHubSettings() {
    try {
      const inventory = JSON.parse(localStorage.getItem(GITHUB_SETTINGS_KEY) || '{}');
      const character = JSON.parse(localStorage.getItem(SHARED_GITHUB_SETTINGS_KEY) || '{}');
      return {
        user: character.user || inventory.user || '',
        repo: character.repo || inventory.repo || DEFAULT_GITHUB_REPO,
        branch: character.branch || inventory.branch || 'main',
        folder: character.sheetsPath || inventory.folder || 'fichas'
      };
    } catch (_) {
      return {};
    }
  }

  function storeGitHubSettings(settings) {
    localStorage.setItem(GITHUB_SETTINGS_KEY, JSON.stringify(settings));
  }

  async function hashText(text) {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function checkPassword(password) {
    return hashText(password).then(hash => hash === PASSWORD_HASH);
  }

  function createEffectRow(effect = {}) {
    const row = elements.effectRowTemplate.content.firstElementChild.cloneNode(true);
    const normalized = sanitizeEffect(effect);
    row.querySelector('[data-effect-field="sphere"]').value = normalized.sphere;
    row.querySelector('[data-effect-field="points"]').value = normalized.points || 1;
    row.querySelector('[data-effect-field="minLevel"]').value = normalized.minLevel;
    row.querySelector('[data-effect-field="maxLevel"]').value = normalized.maxLevel;
    row.querySelector('.remove-effect-btn').addEventListener('click', () => row.remove());
    elements.effectsList.appendChild(row);
    return row;
  }

  function readEffects() {
    return Array.from(elements.effectsList.querySelectorAll('.effect-row')).map(row => sanitizeEffect({
      sphere: row.querySelector('[data-effect-field="sphere"]').value,
      points: row.querySelector('[data-effect-field="points"]').value,
      minLevel: row.querySelector('[data-effect-field="minLevel"]').value,
      maxLevel: row.querySelector('[data-effect-field="maxLevel"]').value
    }));
  }

  function validateEffects(effects) {
    if (effects.some(effect => !effect.sphere || effect.points < 1)) return 'Preencha todos os efeitos e informe ao menos 1 ponto ganho.';
    if (effects.some(effect => effect.minLevel < 0 || effect.maxLevel < 0 || effect.minLevel > 10 || effect.maxLevel > 10)) return 'Os níveis devem estar entre 0 e 10.';
    if (effects.some(effect => effect.minLevel > effect.maxLevel)) return 'O nível mínimo não pode ser maior que o nível máximo.';
    if (new Set(effects.map(effect => effect.sphere)).size !== effects.length) return 'Cada esfera pode aparecer apenas uma vez no mesmo item.';
    return '';
  }

  function openItemForm(itemId = '') {
    const item = items.find(entry => entry.id === itemId);
    elements.itemForm.reset();
    elements.effectsList.replaceChildren();
    elements.itemId.value = item?.id || '';
    elements.itemIdDisplay.value = item?.id || '';
    elements.itemName.value = item?.name || '';
    elements.itemDescription.value = item?.description || '';
    pendingImages = (item?.images || []).map(image => ({ ...image }));
    updateImagePreviews();
    (item?.effects || []).forEach(createEffectRow);
    elements.itemFormError.textContent = '';
    elements.itemDialogTitle.textContent = item ? 'Editar item' : 'Cadastrar item';
    elements.itemDialog.showModal();
    elements.itemName.focus();
  }

  function closeItemForm() {
    elements.itemDialog.close();
    elements.itemFormError.textContent = '';
  }

  function imageSource(image) {
    return image.dataUrl || image.path;
  }

  function updateImagePreviews() {
    elements.imagePreviewWrap.hidden = !pendingImages.length;
    elements.imagePreviews.replaceChildren(...pendingImages.map(image => {
      const card = document.createElement('div');
      card.className = 'image-preview-card';
      const preview = document.createElement('img');
      preview.className = 'image-preview';
      preview.src = imageSource(image);
      preview.alt = `Prévia de ${image.name}`;
      const name = document.createElement('span');
      name.className = 'image-preview-name';
      name.textContent = image.name;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'secondary-btn delete-btn';
      remove.textContent = 'Remover';
      remove.addEventListener('click', () => {
        pendingImages = pendingImages.filter(entry => entry.id !== image.id);
        updateImagePreviews();
      });
      card.append(preview, name, remove);
      return card;
    }));
  }

  function makeCard(item) {
    const article = document.createElement('article');
    article.className = 'item-card';
    const media = document.createElement('div');
    media.className = 'item-gallery';
    if (item.images.length) {
      item.images.slice(0, 4).forEach((image, index) => {
        const picture = document.createElement('img');
        picture.className = 'item-image';
        picture.src = imageSource(image);
        picture.alt = `${item.name}, imagem ${index + 1}`;
        media.appendChild(picture);
      });
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'item-image-placeholder';
      placeholder.textContent = '✦';
      placeholder.setAttribute('aria-hidden', 'true');
      media.appendChild(placeholder);
    }
    const body = document.createElement('div');
    body.className = 'item-card-body';
    const title = document.createElement('h2');
    title.textContent = item.name;
    const itemId = document.createElement('p');
    itemId.className = 'item-id';
    itemId.textContent = `ID ${item.id}`;
    const description = document.createElement('p');
    description.className = 'item-description';
    description.textContent = item.description || 'Sem descrição.';
    body.append(title, itemId, description);
    if (item.effects.length) {
      const list = document.createElement('ul');
      list.className = 'effect-summary';
      item.effects.forEach(effect => {
        const row = document.createElement('li');
        row.textContent = `${sphereLabels[effect.sphere]}: +${effect.points} ponto(s), níveis ${effect.minLevel}–${effect.maxLevel}`;
        list.appendChild(row);
      });
      body.appendChild(list);
    }
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.textContent = 'Editar';
    edit.addEventListener('click', () => openItemForm(item.id));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete-btn';
    remove.textContent = 'Excluir';
    remove.addEventListener('click', () => deleteItem(item.id));
    actions.append(edit, remove);
    body.appendChild(actions);
    article.append(media, body);
    return article;
  }

  function renderItems() {
    const query = normalizeSearch(elements.itemSearch.value);
    const filtered = items.filter(item => normalizeSearch(`${item.name} ${item.description}`).includes(query));
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    elements.itemsGrid.replaceChildren(...filtered.map(makeCard));
    elements.emptyInventory.hidden = filtered.length > 0;
    elements.emptyInventory.textContent = items.length && !filtered.length ? 'Nenhum item corresponde à busca.' : 'Nenhum item cadastrado.';
    elements.inventorySummary.textContent = `${filtered.length} ${filtered.length === 1 ? 'item encontrado' : 'itens encontrados'}`;
  }

  function deleteItem(itemId) {
    const item = items.find(entry => entry.id === itemId);
    if (!item || !confirm(`Excluir o item “${item.name}”?`)) return;
    requestGitHubSync(
      items.filter(entry => entry.id !== itemId),
      `Remove item ${item.name}`,
      () => renderItems()
    );
  }

  function saveItemFromForm() {
    const effects = readEffects();
    const error = validateEffects(effects);
    if (error) {
      elements.itemFormError.textContent = error;
      return false;
    }
    const item = sanitizeItem({
      id: elements.itemId.value || createUniqueItemId(elements.itemName.value.trim()),
      name: elements.itemName.value.trim(),
      description: elements.itemDescription.value.trim(),
      imageFolder: items.find(entry => entry.id === elements.itemId.value)?.imageFolder || '',
      images: pendingImages,
      effects
    });
    const nextItems = items.slice();
    const existingIndex = nextItems.findIndex(entry => entry.id === item.id);
    if (existingIndex >= 0) nextItems[existingIndex] = item;
    else nextItems.push(item);
    requestGitHubSync(nextItems, `${existingIndex >= 0 ? 'Atualiza' : 'Adiciona'} item ${item.name}`, () => {
      closeItemForm();
      renderItems();
    });
    return true;
  }

  function updateGitHubFilePath() {
    elements.githubFilePath.textContent = joinGitHubPath(elements.githubFolder.value, 'itens.json');
  }

  function requestGitHubSync(nextItems, message, onSuccess) {
    pendingSync = { nextItems, message, onSuccess };
    if (githubSessionAuth) {
      syncPendingItems(githubSessionAuth, false);
      return;
    }
    openGitHubDialog();
  }

  function openGitHubDialog(status = '') {
    const settings = loadGitHubSettings();
    elements.githubUser.value = settings.user || '';
    elements.githubRepo.value = settings.repo || DEFAULT_GITHUB_REPO;
    elements.githubBranch.value = settings.branch || 'main';
    elements.githubFolder.value = settings.folder || 'fichas';
    elements.githubPat.value = '';
    elements.githubStatus.textContent = status;
    elements.githubStatus.className = status ? 'form-message is-error' : 'form-message';
    updateGitHubFilePath();
    if (!elements.githubDialog.open) elements.githubDialog.showModal();
    (elements.githubUser.value ? elements.githubPat : elements.githubUser).focus();
  }

  function closeGitHubDialog() {
    pendingSync = null;
    elements.githubPat.value = '';
    elements.githubDialog.close();
  }

  function readGitHubAuth() {
    const user = elements.githubUser.value.trim();
    const token = elements.githubPat.value.trim();
    const repo = elements.githubRepo.value.trim();
    const branch = elements.githubBranch.value.trim();
    const folder = cleanGitHubPath(elements.githubFolder.value);
    return { user, token, repo, branch, folder };
  }

  async function uploadPendingItems(event) {
    event.preventDefault();
    if (!pendingSync || !elements.githubForm.reportValidity()) return;
    const auth = readGitHubAuth();
    const { user, token, repo, branch, folder } = auth;
    if (!/^[^/\s]+\/[^/\s]+$/.test(repo)) {
      elements.githubStatus.textContent = 'Informe o repositório no formato usuario/repositorio.';
      elements.githubStatus.className = 'form-message is-error';
      return;
    }
    elements.githubSubmitBtn.disabled = true;
    try {
      await verifyGithubUser(user, token);
      await syncPendingItems(auth, true);
    } catch (error) {
      elements.githubStatus.textContent = error.message || 'Não foi possível enviar itens.json ao GitHub.';
      elements.githubStatus.className = 'form-message is-error';
    } finally {
      elements.githubSubmitBtn.disabled = false;
    }
  }

  async function syncPendingItems(auth, cameFromDialog) {
    if (!pendingSync) return;
    const { user, token, repo, branch, folder } = auth;
    const path = joinGitHubPath(folder, 'itens.json');
    const sync = pendingSync;
    if (!cameFromDialog) {
      elements.itemFormError.textContent = `Enviando ${path}...`;
      elements.inventorySummary.textContent = `Enviando ${path}...`;
    }
    if (cameFromDialog) {
      elements.githubStatus.textContent = `Enviando ${path}...`;
      elements.githubStatus.className = 'form-message';
    }
    try {
      for (const item of sync.nextItems) {
        if (!item.images.length) continue;
        if (!item.imageFolder) item.imageFolder = createItemImageFolder(item);
        for (const image of item.images) {
          if (!image.dataUrl || image.path) continue;
          const fileName = createImageFileName(image);
          const imagePath = joinGitHubPath(item.imageFolder, fileName);
          await upsertGitHubFileBase64(
            repo,
            branch,
            joinGitHubPath(folder, imagePath),
            image.dataUrl.split(',')[1],
            `${sync.message} - imagem ${fileName}`,
            token
          );
          image.path = imagePath;
        }
      }
      await upsertGitHubFile(
        repo,
        branch,
        path,
        JSON.stringify(sync.nextItems.map(itemForGitHub), null, 2),
        sync.message,
        token
      );
      items = sync.nextItems;
      saveItems();
      storeGitHubSettings({ user, repo, branch, folder });
      githubSessionAuth = { user, token, repo, branch, folder };
      pendingSync = null;
      elements.itemFormError.textContent = '';
      elements.githubPat.value = '';
      if (elements.githubDialog.open) elements.githubDialog.close();
      sync.onSuccess();
    } catch (error) {
      if (!cameFromDialog) {
        githubSessionAuth = null;
        openGitHubDialog(error.message || 'O reenvio automático falhou. Confira os dados do GitHub.');
        return;
      }
      throw error;
    }
  }

  function safeFilePart(value) {
    return normalizeSearch(value).replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'item';
  }

  function createItemImageFolder(item) {
    return joinGitHubPath('imagens', 'itens', `${safeFilePart(item.name)}-${item.id.slice(0, 8)}`);
  }

  function createImageFileName(image) {
    const originalExtension = image.name.match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase();
    const typeExtension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[image.type];
    return `${safeFilePart(image.name.replace(/\.[^.]+$/, ''))}-${image.id.slice(0, 8)}.${typeExtension || originalExtension || 'png'}`;
  }

  function itemForGitHub(item) {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      imageFolder: item.imageFolder,
      images: item.images.map(image => image.path).filter(Boolean),
      effects: item.effects
    };
  }

  function readImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve({
        id: createId(), name: file.name, type: file.type, dataUrl: String(reader.result || ''), path: ''
      }));
      reader.addEventListener('error', () => reject(reader.error));
      reader.readAsDataURL(file);
    });
  }

  function bindEvents() {
    elements.accessForm.addEventListener('submit', async event => {
      event.preventDefault();
      elements.accessError.textContent = '';
      try {
        if (!await checkPassword(elements.passwordInput.value)) {
          elements.accessError.textContent = 'Senha incorreta.';
          elements.passwordInput.select();
          return;
        }
        elements.passwordInput.value = '';
        elements.accessPanel.hidden = true;
        elements.inventoryApp.hidden = false;
        elements.inventorySummary.textContent = 'Carregando itens...';
        await loadItems();
        renderItems();
        elements.itemSearch.focus();
      } catch (error) {
        elements.inventorySummary.textContent = error.message || 'Não foi possível carregar o inventário.';
        elements.emptyInventory.hidden = false;
        elements.emptyInventory.textContent = 'Confira a conexão e tente novamente.';
      }
    });
    elements.lockBtn.addEventListener('click', () => {
      elements.inventoryApp.hidden = true;
      elements.accessPanel.hidden = false;
      elements.itemSearch.value = '';
      elements.passwordInput.focus();
    });
    elements.newItemBtn.addEventListener('click', () => openItemForm());
    elements.closeItemDialogBtn.addEventListener('click', closeItemForm);
    elements.cancelItemBtn.addEventListener('click', closeItemForm);
    elements.addEffectBtn.addEventListener('click', () => createEffectRow());
    elements.itemSearch.addEventListener('input', renderItems);
    elements.itemForm.addEventListener('submit', event => {
      event.preventDefault();
      if (elements.itemForm.reportValidity()) saveItemFromForm();
    });
    elements.githubForm.addEventListener('submit', uploadPendingItems);
    elements.closeGithubDialogBtn.addEventListener('click', closeGitHubDialog);
    elements.cancelGithubBtn.addEventListener('click', closeGitHubDialog);
    elements.githubFolder.addEventListener('input', updateGitHubFilePath);
    elements.itemImage.addEventListener('change', async () => {
      const files = Array.from(elements.itemImage.files || []);
      if (!files.length) return;
      if (files.some(file => !['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > MAX_IMAGE_BYTES)) {
        elements.itemFormError.textContent = 'Cada arquivo deve ser uma imagem PNG, JPEG, WebP ou GIF de até 1,5 MB.';
        elements.itemImage.value = '';
        return;
      }
      try {
        pendingImages.push(...await Promise.all(files.map(readImageFile)));
        elements.itemFormError.textContent = '';
        updateImagePreviews();
      } catch (_) {
        elements.itemFormError.textContent = 'Não foi possível ler uma das imagens selecionadas.';
      } finally {
        elements.itemImage.value = '';
      }
    });
  }

  function init() {
    [
      'accessPanel', 'accessForm', 'passwordInput', 'accessError', 'inventoryApp', 'lockBtn', 'itemSearch',
      'newItemBtn', 'inventorySummary', 'itemsGrid', 'emptyInventory', 'itemDialog', 'itemDialogTitle',
      'itemForm', 'itemId', 'itemIdDisplay', 'itemName', 'itemDescription', 'itemImage', 'imagePreviewWrap', 'imagePreviews',
      'effectsList', 'effectRowTemplate', 'addEffectBtn', 'itemFormError', 'closeItemDialogBtn',
      'cancelItemBtn', 'githubDialog', 'githubForm', 'githubUser', 'githubPat', 'githubRepo', 'githubBranch', 'githubFolder',
      'githubFilePath', 'githubStatus', 'githubSubmitBtn', 'closeGithubDialogBtn', 'cancelGithubBtn'
    ].forEach(id => { elements[id] = document.getElementById(id); });
    bindEvents();
  }

  window.ItemsInventory = {
    checkPassword,
    createItemId,
    createItemImageFolder,
    itemForGitHub,
    loadItems,
    normalizeSearch,
    sanitizeItem,
    validateEffects
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
