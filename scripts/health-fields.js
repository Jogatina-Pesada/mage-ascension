function makeHealth() {
  const buttons = document.getElementById('healthDamageButtons');
  const boxes = document.getElementById('healthBoxes');
  buttons.innerHTML = '';
  boxes.innerHTML = '';

  damageTypes.forEach(type => {
    const group = document.createElement('span');
    group.className = 'health-type-actions';
    const label = document.createElement('span');
    label.className = 'health-type-label';
    label.dataset.wikiTopicLink = 'health';
    label.dataset.wikiQuery = type.label;
    const symbol = document.createElement('span');
    symbol.className = 'health-type-symbol';
    symbol.textContent = type.symbol;
    label.append(symbol, document.createTextNode(type.label));

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'health-damage-btn';
    button.setAttribute('aria-label', `Aplicar dano ${type.label}`);
    button.appendChild(healthIcon('damage'));
    button.addEventListener('click', () => applyHealthDamage(type.symbol));

    const healButton = document.createElement('button');
    healButton.type = 'button';
    healButton.className = 'health-heal-btn';
    healButton.setAttribute('aria-label', `Curar dano ${type.label}`);
    healButton.dataset.healSymbol = type.symbol;
    healButton.appendChild(healthIcon('heal'));
    healButton.addEventListener('click', () => healHealthDamage(type.symbol));

    group.append(label, button, healButton);
    buttons.appendChild(group);
  });

  for (let i = 0; i < maxHealthBoxes; i++) {
    const box = document.createElement('span');
    box.className = 'health-box';
    box.setAttribute('role', 'checkbox');
    box.setAttribute('aria-readonly', 'true');
    box.setAttribute('aria-checked', 'false');
    boxes.appendChild(box);
  }

  renderHealthDamage();
}

function healthIcon(kind) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');

  if (kind === 'heal') {
    const plus = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    plus.setAttribute('d', 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z');
    svg.appendChild(plus);
    return svg;
  }

  const burst = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  burst.setAttribute('d', 'M12 2l2.1 5.2L19 4l-1.3 5.8L23 12l-5.3 2.2L19 20l-4.9-3.2L12 22l-2.1-5.2L5 20l1.3-5.8L1 12l5.3-2.2L5 4l4.9 3.2L12 2z');
  svg.appendChild(burst);
  return svg;
}


function legacyHealthDamage() {
  const level = getPath(state, 'health.level', healthLevels[0].value);
  const count = Math.max(0, healthLevels.findIndex(item => item.value === level));
  return Array.from({ length: Math.min(count, maxHealthBoxes) }, () => '/');
}

function normalizedHealthDamage(source = state) {
  const damage = getPath(source, 'health.damage', null);
  if (!Array.isArray(damage)) return source === state ? legacyHealthDamage() : [];
  return damage
    .filter(symbol => damageTypes.some(type => type.symbol === symbol))
    .sort((a, b) => damageSeverity[b] - damageSeverity[a])
    .slice(0, maxHealthBoxes);
}

function currentHealthLevel(damage) {
  return healthLevels[Math.min(damage.length, healthLevels.length - 1)] || healthLevels[0];
}

function healthStatusText(level) {
  return level.label;
}

function renderHealthPenalty(level) {
  const penalty = document.getElementById('healthPenalty');
  if (!penalty) return;

  if (level.blocked) {
    penalty.textContent = '☠';
    penalty.classList.add('is-blocked');
    return;
  }

  penalty.classList.remove('is-blocked');
  penalty.replaceChildren(
    document.createTextNode('↓ '),
    document.createElement('span'),
    document.createTextNode(' '),
    Object.assign(document.createElement('img'), {
      src: 'assets/dice.png',
      alt: 'dado',
      className: 'health-dice'
    })
  );
  penalty.querySelector('span').textContent = level.dicePenalty;
}

function applyHealthDamage(symbol) {
  if (aiPreviewState) {
    renderFields();
    return;
  }

  const damage = normalizedHealthDamage();
  if (damage.length >= maxHealthBoxes) return;
  damage.push(symbol);
  damage.sort((a, b) => damageSeverity[b] - damageSeverity[a]);
  setPath(state, 'health.damage', damage);
  setPath(state, 'health.level', currentHealthLevel(damage).value);
  renderHealthDamage();
}

function healHealthDamage(symbol) {
  if (aiPreviewState) {
    renderFields();
    return;
  }

  const damage = normalizedHealthDamage();
  const index = damage.indexOf(symbol);
  if (index < 0) return;
  damage.splice(index, 1);
  damage.sort((a, b) => damageSeverity[b] - damageSeverity[a]);
  setPath(state, 'health.damage', damage);
  setPath(state, 'health.level', currentHealthLevel(damage).value);
  renderHealthDamage();
}

function renderHealthDamage() {
  const damage = aiPreviewState && hasPath(aiPreviewState, 'health.damage')
    ? normalizedHealthDamage(aiPreviewState)
    : normalizedHealthDamage();
  const isSuggested = isAiSuggestionChanged('health.damage');
  const control = document.querySelector('.health-control');
  const status = document.getElementById('healthStatus');
  const level = currentHealthLevel(damage);

  control?.classList.toggle('ai-suggested', isSuggested);
  document.querySelectorAll('.health-damage-btn').forEach(button => {
    button.disabled = Boolean(aiPreviewState) || damage.length >= maxHealthBoxes;
  });
  document.querySelectorAll('.health-heal-btn').forEach(button => {
    button.disabled = Boolean(aiPreviewState) || !damage.includes(button.dataset.healSymbol);
  });
  if (status) status.textContent = healthStatusText(level);
  renderHealthPenalty(level);
  document.querySelectorAll('.health-box').forEach((box, idx) => {
    const symbol = damage[idx] || '';
    box.textContent = symbol;
    box.classList.toggle('is-filled', Boolean(symbol));
    box.setAttribute('aria-checked', symbol ? 'true' : 'false');
  });
}

function ensureHealthDamage() {
  const damage = normalizedHealthDamage();
  setPath(state, 'health.damage', damage);
  setPath(state, 'health.level', currentHealthLevel(damage).value);
}

function bindFields() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const updateField = e => {
      if (aiPreviewState) {
        renderFields();
        return;
      }
      let value = e.target.type === 'number' ? Number(e.target.value || e.target.dataset.numberDefault || 0) : e.target.value;
      if (e.target.type === 'number') {
        if (e.target.min !== '') value = Math.max(Number(e.target.min), value);
        if (e.target.max !== '') value = Math.min(Number(e.target.max), value);
        e.target.value = value;
      }
      if (creationMode && e.target.dataset.field === 'identity.experience') {
        value = Math.min(15, Math.max(0, value));
        e.target.value = value;
      }
      setPath(state, e.target.dataset.field, value);
      if (e.target.dataset.field === 'identity.name') {
        e.target.setCustomValidity('');
        syncCurrentCharacterLineageMember();
        if (creationMode && !lineageState.name && !getPath(state, 'identity.lineage', '')) {
          renderLineageMembers();
        }
      }
      if (e.target.dataset.field === 'identity.experience') {
        setExperienceError('');
        updateAllDotCosts();
        renderCreationSummary();
      }
      updateNumberStepperStates();
    };
    el.addEventListener('input', updateField);
    el.addEventListener('change', updateField);
  });
}

function bindNumberSteppers() {
  document.querySelectorAll('[data-stepper]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.querySelector(`[data-field="${button.dataset.target}"]`);
      if (!input) return;

      const min = input.min === '' ? -Infinity : Number(input.min);
      const max = input.max === '' ? Infinity : Number(input.max);
      const step = Number(input.step || 1);
      const direction = button.dataset.stepper === 'up' ? 1 : -1;
      const current = Number(input.value || input.dataset.numberDefault || 0);
      const next = Math.min(max, Math.max(min, current + direction * step));

      input.value = next;
      setPath(state, input.dataset.field, next);
      updateNumberStepperStates();
    });
  });
}

function updateNumberStepperStates() {
  document.querySelectorAll('[data-stepper]').forEach(button => {
    const input = document.querySelector(`[data-field="${button.dataset.target}"]`);
    if (!input) return;
    const current = Number(input.value || input.dataset.numberDefault || 0);
    const min = input.min === '' ? -Infinity : Number(input.min);
    const max = input.max === '' ? Infinity : Number(input.max);
    const atLimit = button.dataset.stepper === 'up' ? current >= max : current <= min;
    button.disabled = Boolean(aiPreviewState) || atLimit;
  });
}

function ensureNumberDefaults() {
  document.querySelectorAll('[data-number-default]').forEach(input => {
    if (getPath(state, input.dataset.field, '') === '') {
      setPath(state, input.dataset.field, Number(input.dataset.numberDefault));
    }
  });
}

function clampCharacterCovenResources() {
  ['advantages.quintessence', 'advantages.paradox'].forEach(path => {
    setPath(state, path, Math.min(10, Math.max(0, Number(getPath(state, path, 0)) || 0)));
  });
}

function renderFields() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const fallback = el.dataset.numberDefault || '';
    el.value = effectiveValue(el.dataset.field, fallback);
    el.classList.toggle('ai-suggested-field', isAiSuggestionChanged(el.dataset.field));
    el.disabled = Boolean(aiPreviewState);
  });
  document.querySelectorAll('[data-stepper]').forEach(button => {
    button.disabled = Boolean(aiPreviewState);
  });
  updateNumberStepperStates();
  document.querySelectorAll('[data-dots]').forEach(renderDots);
  renderCharacterImage();
  renderHealthDamage();
  updateAllDotCosts();
  renderCreationSummary();
}
