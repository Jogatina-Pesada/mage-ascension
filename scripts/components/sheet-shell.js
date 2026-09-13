function sheetMainTemplate() {
  return `
  <main class="sheet" id="sheet">
    ${shellHeaderTemplate()}
    ${identityHealthTemplate()}
    ${creationPanelTemplate()}
    ${spheresAdvantagesTemplate()}
    ${attributesTemplate()}
    ${abilitiesTemplate()}
    ${backgroundsTemplate()}
    ${covenantTemplate()}
    ${notesFocusTemplate()}
    ${lineageTemplate()}
    ${creationWorldTemplate()}
  </main>
  `;
}

function appShellTemplate() {
  return `
  ${sheetMainTemplate()}
  ${autosaveIndicatorTemplate()}
  ${wikiModalTemplate()}
  ${backgroundsModalTemplate()}
  ${sheetModalTemplate()}
  ${startModalTemplate()}
  ${githubModalTemplate()}
  ${lineageLoadModalTemplate()}
  ${aiModalTemplate()}
  ${characterImageRemoveModalTemplate()}
  ${creationCompletionModalsTemplate()}
  ${covenItemModalTemplate()}
  ${covenItemDeleteModalTemplate()}
  ${covenItemUseModalTemplate()}
  ${lineageDeathModalTemplate()}
  ${lineageReviveModalTemplate()}
  `;
}

function renderAppShell() {
  document.body.insertAdjacentHTML('afterbegin', appShellTemplate());
}
