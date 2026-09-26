function setLevelEditing(editable) {
  if (aiPreviewState) editable = false;
  levelEditMode = editable;
  document.getElementById('sheet')?.classList.toggle('level-editing', editable);
  const button = document.getElementById('levelEditBtn');
  if (button) {
    button.classList.toggle('active', editable);
    if (creationMode) {
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>';
      button.title = 'Concluir criação';
    } else {
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 20 9-9-8-8-9 9v8h8z"></path><path d="m16 7 1 1"></path></svg>';
      button.title = editable ? 'Concluir edição de níveis' : 'Editar níveis';
    }
    button.setAttribute('aria-label', button.title);
  }
  document.querySelectorAll('[data-dots]').forEach(container => {
    const editableDots = Boolean(xpMultiplierFor(container.dataset.dots));
    container.querySelectorAll('.dot').forEach(dot => {
      if (container.dataset.dots === 'advantages.willpower') {
        const permanent = Number(getPath(state, 'advantages.willpower', 0));
        dot.disabled = Boolean(aiPreviewState) || (Number(dot.dataset.level) > permanent && (!editable || !editableDots));
      } else {
        dot.disabled = !editable || !editableDots;
      }
    });
    setDotCost(container);
  });
}

function makeDots(container) {
  const path = container.dataset.dots;
  const label = container.dataset.label;
  const max = Number(container.dataset.max || 5);
  const symbol = sphereSymbols[path] || '';
  container.className = 'dot-row';
  container.innerHTML = '<span class="dot-label"></span><span class="xp-cost"></span><span class="dots"></span>';
  if (path.startsWith('backgrounds.')) {
    container.classList.add('background-dot-row');
  }
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
  for (let i = 1; i <= max; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.dataset.level = String(i);
    dot.setAttribute('role', 'checkbox');
    dot.setAttribute('aria-checked', 'false');
    dot.setAttribute('aria-label', `${label}: ${i}`);
    dot.addEventListener('mouseenter', () => {
      if (!isDotSectionEditable(container)) return;
      const current = Number(getPath(state, path, 0));
      const target = current === i ? Math.max(0, i - 1) : i;
      setDotCost(container, target);
    });
    dot.addEventListener('mouseleave', () => setDotCost(container));
    dot.addEventListener('click', () => {
      if (path === 'advantages.willpower') {
        changeWillpower(i, container);
        return;
      }
      if (!isDotSectionEditable(container)) return;
      const current = Number(getPath(state, path, 0));
      const target = current === i ? Math.max(0, i - 1) : i;
      if (creationMode && !canSetCreationLevel(path, target)) return;
      const cost = dotChangeCost(path, current, target);
      const experience = currentExperience();

      if (cost > experience) {
        setExperienceError(creationMode ? 'Freebies insuficientes para aumentar esse nível.' : 'Experiência insuficiente para aumentar esse nível.');
        return;
      }

      setPath(state, path, target);
      if (creationMode) {
        setFreebies(experience - cost);
      } else {
        setExperience(experience - cost);
      }
      renderDots(container);
      renderCreationSummary();
      updateAllDotCosts();
      updateLineageSphereBonusButton();
    });
    dots.appendChild(dot);
  }
  if (path.startsWith('backgrounds.')) {
    const key = path.split('.')[1];
    const justification = document.createElement('textarea');
    justification.className = 'background-justification';
    justification.dataset.field = `backgroundJustifications.${key}`;
    justification.placeholder = backgroundJustificationHints[key] || 'Descreva de onde esse Antecedente veio.';
    justification.setAttribute('aria-label', `Justificativa de ${label}`);
    justification.hidden = true;
    container.appendChild(justification);
  }
  renderDots(container);
}

function temporaryWillpower() {
  const permanent = Math.max(0, Number(getPath(state, 'advantages.willpower', 0)) || 0);
  const stored = getPath(state, 'advantages.willpowerTemporary', null);
  return stored === null || stored === undefined
    ? permanent
    : Math.min(permanent, Math.max(0, Number(stored) || 0));
}

function changeWillpower(level, container) {
  if (aiPreviewState) return;
  const permanent = Math.max(0, Number(getPath(state, 'advantages.willpower', 0)) || 0);

  if (level <= permanent) {
    const temporary = temporaryWillpower();
    if (levelEditMode && level === permanent && temporary === level - 1) {
      const target = level - 1;
      if (creationMode && !canSetCreationLevel('advantages.willpower', target)) return;
      const cost = dotChangeCost('advantages.willpower', permanent, target);
      setPath(state, 'advantages.willpower', target);
      if (creationMode) setFreebies(currentExperience() - cost);
      else setExperience(currentExperience() - cost);
      renderDots(container);
      renderCreationSummary();
      updateAllDotCosts();
      updateLineageSphereBonusButton();
      return;
    }
    setPath(state, 'advantages.willpowerTemporary', temporary === level ? level - 1 : level);
    renderDots(container);
    return;
  }

  if (!levelEditMode || !isDotSectionEditable(container)) return;
  if (creationMode && !canSetCreationLevel('advantages.willpower', level)) return;
  const cost = dotChangeCost('advantages.willpower', permanent, level);
  const experience = currentExperience();
  if (cost > experience) {
    setExperienceError(creationMode ? 'Freebies insuficientes para aumentar esse nível.' : 'Experiência insuficiente para aumentar esse nível.');
    return;
  }

  setPath(state, 'advantages.willpower', level);
  setPath(state, 'advantages.willpowerTemporary', level);
  if (creationMode) setFreebies(experience - cost);
  else setExperience(experience - cost);
  renderDots(container);
  renderCreationSummary();
  updateAllDotCosts();
  updateLineageSphereBonusButton();
}

function bindLevelEditor() {
  document.getElementById('levelEditBtn')?.addEventListener('click', () => {
    if (creationMode) {
      requestCreationCompletion();
      return;
    }
    setLevelEditing(!levelEditMode);
  });
  setLevelEditing(false);
}

function isLineageBonusDot(path, idx, value) {
  if (!creationMode || !path.startsWith('spheres.')) return false;
  const bonus = state.creation?.lineageSphereBonus?.[path.split('.')[1]];
  if (!bonus) return false;
  return idx < value && idx >= Number(bonus.from || 0) && idx < Number(bonus.to || 0);
}

function renderDots(container) {
  const path = container.dataset.dots;
  const value = Number(effectiveValue(path, 0));
  const temporary = path === 'advantages.willpower' ? temporaryWillpower() : value;
  container.classList.toggle('ai-suggested', isAiSuggestionChanged(path));
  container.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('filled', idx < temporary);
    dot.classList.toggle('permanent-dot', path === 'advantages.willpower' && idx < value);
    dot.classList.toggle('unobtained-permanent-dot', path === 'advantages.willpower' && idx >= value);
    dot.setAttribute('aria-checked', String(idx < temporary));
    if (path === 'advantages.willpower') {
      const obtained = idx < value;
      const accessibilityLabel = obtained
        ? `${container.dataset.label} temporária: ${idx + 1} (permanente obtida)`
        : `${container.dataset.label} permanente ${idx + 1}: ainda não obtida`;
      dot.removeAttribute('title');
      dot.setAttribute('aria-label', accessibilityLabel);
      dot.disabled = Boolean(aiPreviewState) || (!obtained && !levelEditMode);
    }
    dot.classList.toggle('lineage-bonus-dot', isLineageBonusDot(path, idx, value));
    dot.classList.toggle('ai-suggested', isAiSuggestionChanged(path) && idx < value);
  });
  if (path.startsWith('backgrounds.')) {
    const justification = container.querySelector('.background-justification');
    if (justification) justification.hidden = value < 1;
  }
  setDotCost(container);
}
