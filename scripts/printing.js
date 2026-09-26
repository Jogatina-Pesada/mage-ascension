function printSheet() {
  const previousTitle = document.title;
  const characterName = document.querySelector('[data-field="identity.name"]')?.value.trim();
  const finishPrinting = () => {
    document.body.classList.remove('sheet-printing');
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
