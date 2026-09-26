function copyPrintFieldValues(source, copy) {
  const sourceFields = source.querySelectorAll('input, textarea, select');
  const copyFields = copy.querySelectorAll('input, textarea, select');

  sourceFields.forEach((field, index) => {
    const copiedField = copyFields[index];
    if (!copiedField) return;
    copiedField.value = field.value;
    if (copiedField.tagName === 'TEXTAREA') copiedField.textContent = field.value;
    if (copiedField.tagName === 'SELECT') {
      Array.from(copiedField.options).forEach(option => {
        option.selected = option.value === field.value;
      });
    }
  });
}

function createPrintBackgroundsPage() {
  const modal = document.getElementById('backgroundsModal');
  if (!modal) return null;

  const page = document.createElement('section');
  page.className = 'print-backgrounds-page';
  page.setAttribute('aria-label', 'Antecedentes e quem você é no mundo');
  page.innerHTML = '<h1>Antecedentes</h1>';

  modal.querySelectorAll('[data-backgrounds-modal-panel]').forEach(panel => {
    const copy = panel.cloneNode(true);
    copy.removeAttribute('id');
    copy.removeAttribute('hidden');
    copy.removeAttribute('role');
    copy.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    copyPrintFieldValues(panel, copy);
    if (panel.dataset.backgroundsModalPanel === 'world') {
      copy.insertAdjacentHTML('afterbegin', '<h2>Quem você é no mundo</h2>');
    }
    page.appendChild(copy);
  });

  document.body.appendChild(page);
  return page;
}

function printSheet() {
  const previousTitle = document.title;
  const characterName = document.querySelector('[data-field="identity.name"]')?.value.trim();
  const backgroundsPage = createPrintBackgroundsPage();
  const finishPrinting = () => {
    document.body.classList.remove('sheet-printing');
    backgroundsPage?.remove();
    document.title = previousTitle;
  };

  document.body.classList.add('sheet-printing');
  document.title = characterName ? `${characterName} - Ficha` : 'Ficha - Mage: The Ascension';
  window.addEventListener('afterprint', finishPrinting, { once: true });
  window.print();
}

function bindSheetPrinting() {
  document.getElementById('printSheetBtn')?.addEventListener('click', printSheet);
}
