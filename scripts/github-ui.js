function getGithubSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(githubSettingsKey) || '{}');
    return { user: stored.user || '', repo: defaultGithubRepo, branch: defaultGithubBranch, sheetsPath: defaultGithubSheetsPath };
  } catch (err) {
    return { user: '', repo: defaultGithubRepo, branch: defaultGithubBranch, sheetsPath: defaultGithubSheetsPath };
  }
}

function storeGithubSettings(settings) {
  localStorage.setItem(githubSettingsKey, JSON.stringify({ user: settings.user }));
}

function openGithubModal(passwordReset = false) {
  passwordReset = passwordReset === true;
  if (!passwordReset && !requireCharacterName()) return;

  const settings = getGithubSettings();
  document.getElementById('githubUser').value = settings.user || '';
  document.getElementById('githubPat').value = '';
  document.getElementById('githubCharacterListFields').hidden = passwordReset;
  document.getElementById('githubListResetFields').hidden = !passwordReset;
  document.getElementById('githubListAdminPassword').required = passwordReset;
  document.getElementById('githubSubmitBtn').textContent = passwordReset ? 'Salvar nova senha' : 'Enviar ficha';
  setGithubModalStatus('');
  document.getElementById('githubModal').hidden = false;
  if (!passwordReset) prepareGithubCharacterLists();
}

function closeGithubModal() {
  document.getElementById('githubModal').hidden = true;
  pendingListPasswordReset = null;
}
