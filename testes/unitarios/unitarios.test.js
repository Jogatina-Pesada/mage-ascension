(() => {
const {
  appState,
  appVar,
  assert,
  lineageState,
  loadAppFrame,
  resetApp,
  runTests,
  test
} = window.TestHarness;

async function withApp(fn) {
  const { iframe, win, doc } = await loadAppFrame();
  try {
    return await fn(win, doc);
  } finally {
    iframe.remove();
  }
}

test('snakeCase normaliza acentos, espacos e pontuacao', () => withApp(win => {
  assert.equal(win.snakeCase(' Joao da Silva! '), 'joao_da_silva');
  assert.equal(win.snakeCase('Mago: Ascensao & Queda'), 'mago_ascensao_queda');
  assert.equal(win.snakeCase('***'), 'mage_personagem');
}));

test('sheetFileName usa o nome atual da ficha', () => withApp(win => {
  resetApp(win, { identity: { name: 'Baba Yaga' } });
  assert.equal(win.sheetFileName(), 'baba_yaga.json');
}));

test('sheetUrl codifica segmentos do caminho', () => withApp(win => {
  assert.equal(win.sheetUrl('pasta/mago velho.json'), 'fichas/pasta/mago%20velho.json');
}));

test('cleanGitHubPath e joinGitHubPath normalizam caminhos', () => withApp(win => {
  assert.equal(win.cleanGitHubPath(' /fichas//linhagens/ '), 'fichas/linhagens');
  assert.equal(win.joinGitHubPath('/fichas/', ' linhagens ', 'teste.json'), 'fichas/linhagens/teste.json');
}));

test('base64 preserva texto unicode', () => withApp(win => {
  const source = 'Mage: Ascensao - Sao Paulo - esfera Vida';
  assert.equal(win.base64ToText(win.textToBase64(source)), source);
}));

test('extractJsonText aceita JSON puro', () => withApp(win => {
  assert.equal(win.extractJsonText('{"ok":true}'), '{"ok":true}');
}));

test('extractJsonText aceita bloco fenced', () => withApp(win => {
  assert.equal(win.extractJsonText('```json\n{"ok":true}\n```'), '{"ok":true}');
}));

test('extractJsonText extrai JSON embutido em texto', () => withApp(win => {
  assert.equal(win.extractJsonText('antes {"ok":true} depois'), '{"ok":true}');
}));

test('normalizeSheetEntry suporta string e objeto', () => withApp(win => {
  assert.deepEqual(win.normalizeSheetEntry('baba_yaga.json'), { file: 'baba_yaga.json', name: 'baba_yaga' });
  assert.deepEqual(win.normalizeSheetEntry({ file: 'x.json', title: 'X' }), { file: 'x.json', name: 'X' });
}));

test('levelChangeCost calcula aumento e reducao de XP', () => withApp(win => {
  assert.equal(win.levelChangeCost('attributes.strength', 1, 3), 20);
  assert.equal(win.levelChangeCost('abilities.alertness', 0, 2), 6);
  assert.equal(win.levelChangeCost('spheres.life', 2, 4), 49);
  assert.equal(win.levelChangeCost('advantages.arcana', 1, 2), 16);
  assert.equal(win.levelChangeCost('advantages.willpower', 1, 3), 5);
  assert.equal(win.levelChangeCost('attributes.strength', 3, 1), -20);
}));

test('sphereNextLevelCost usa multiplicador de esfera', () => withApp(win => {
  assert.equal(win.sphereNextLevelCost(0), 7);
  assert.equal(win.sphereNextLevelCost(2), 21);
}));

test('xpMultiplierFor reconhece grupos e vantagens', () => withApp(win => {
  assert.equal(win.xpMultiplierFor('attributes.strength'), 4);
  assert.equal(win.xpMultiplierFor('abilities.alertness'), 2);
  assert.equal(win.xpMultiplierFor('backgrounds.allies'), 1);
  assert.equal(win.xpMultiplierFor('spheres.time'), 7);
  assert.equal(win.xpMultiplierFor('advantages.arcana'), 8);
  assert.equal(win.xpMultiplierFor('notes'), 0);
}));

test('backgroundPaths usa antecedentes traduzidos em ordem alfabetica', () => withApp(win => {
  assert.deepEqual(appVar(win, 'backgroundPaths'), [
    'backgrounds.allies',
    'backgrounds.backup',
    'backgrounds.contacts',
    'backgrounds.spies',
    'backgrounds.fame',
    'backgrounds.influence',
    'backgrounds.wonder',
    'backgrounds.mentor',
    'backgrounds.patron',
    'backgrounds.resources',
    'backgrounds.sanctum',
    'backgrounds.dream',
    'backgrounds.pastLives'
  ]);
}));

test('setExperience nunca deixa experiencia negativa', () => withApp(win => {
  resetApp(win);
  win.setExperience(-10);
  assert.equal(win.getPath(appState(win), 'identity.experience', null), 0);
}));

test('setFreebies limita valor entre 0 e 15', () => withApp(win => {
  resetApp(win);
  win.setFreebies(99);
  assert.equal(win.getPath(appState(win), 'identity.experience', null), 15);
  win.setFreebies(-1);
  assert.equal(win.getPath(appState(win), 'identity.experience', null), 0);
}));

test('startNewCharacter aplica defaults de criacao', () => withApp(win => {
  win.startNewCharacter();
  const state = appState(win);
  assert.equal(win.getPath(state, 'creation.mode'), true);
  assert.equal(win.getPath(state, 'identity.experience'), 15);
  assert.equal(win.getPath(state, 'attributes.strength'), 0);
  assert.equal(win.getPath(state, 'attributes.wits'), 0);
  assert.equal(win.getPath(state, 'advantages.arcana'), 1);
  assert.deepEqual(win.getPath(state, 'health.damage'), []);
}));

test('creationFreebieSpend nao cobra defaults iniciais', () => withApp(win => {
  win.startNewCharacter();
  assert.equal(win.creationFreebieSpend(), 0);
}));

test('creationFreebieSpend cobra atributo acima do pool', () => withApp(win => {
  win.startNewCharacter();
  win.setPath(appState(win), 'attributes.strength', 5);
  win.setPath(appState(win), 'attributes.dexterity', 4);
  win.setPath(appState(win), 'attributes.stamina', 3);
  assert.equal(win.spentInPriorityPool('attributes.strength'), 12);
  assert.equal(win.creationFreebieSpend(), 25);
}));

test('creationFreebieSpend cobra habilidades acima do pool', () => withApp(win => {
  win.startNewCharacter();
  win.setPath(appState(win), 'abilities.alertness', 3);
  win.setPath(appState(win), 'abilities.athletics', 3);
  win.setPath(appState(win), 'abilities.awareness', 3);
  win.setPath(appState(win), 'abilities.brawl', 3);
  win.setPath(appState(win), 'abilities.empathy', 3);
  assert.equal(win.creationFreebieSpend(), 4);
}));

test('creationFreebieSpend cobra backgrounds acima do pool inicial', () => withApp(win => {
  win.startNewCharacter();
  win.setPath(appState(win), 'backgrounds.allies', 3);
  win.setPath(appState(win), 'backgrounds.contacts', 3);
  win.setPath(appState(win), 'backgrounds.resources', 2);
  assert.equal(win.creationFreebieSpend(), 1);
}));

test('creationLevelLimit limita backgrounds a 3 na criacao', () => withApp(win => {
  win.startNewCharacter();
  assert.equal(win.creationLevelLimit('backgrounds.allies'), 3);
  assert.equal(win.canSetCreationLevel('backgrounds.allies', 4), false);
  assert.equal(win.canSetCreationLevel('backgrounds.allies', 3), true);
}));

test('creationLevelLimit limita esferas pela Arcana', () => withApp(win => {
  win.startNewCharacter();
  win.setPath(appState(win), 'advantages.arcana', 2);
  assert.equal(win.creationLevelLimit('spheres.life'), 2);
  assert.equal(win.canSetCreationLevel('spheres.life', 3), false);
  assert.equal(win.canSetCreationLevel('spheres.life', 2), true);
}));

test('Arcana nao pode cair abaixo da maior esfera na criacao', () => withApp(win => {
  win.startNewCharacter();
  win.setPath(appState(win), 'spheres.life', 3);
  assert.equal(win.canSetCreationLevel('advantages.arcana', 2), false);
  assert.equal(win.canSetCreationLevel('advantages.arcana', 3), true);
}));

test('normalizedHealthDamage filtra, ordena e limita dano', () => withApp(win => {
  resetApp(win, { health: { damage: ['/', 'bad', '*', 'X', '/', 'X', '*', '/', 'X'] } });
  assert.deepEqual(win.normalizedHealthDamage(), ['*', '*', 'X', 'X', 'X', '/', '/']);
}));

test('legacyHealthDamage converte health.level antigo', () => withApp(win => {
  resetApp(win, { health: { level: 'wounded' } });
  assert.deepEqual(win.legacyHealthDamage(), ['/', '/', '/', '/']);
}));

test('currentHealthLevel retorna nivel e bloqueio corretos', () => withApp(win => {
  assert.equal(win.currentHealthLevel([]).value, 'healthy');
  assert.equal(win.currentHealthLevel(['/', '/', '/', '/', '/', '/']).value, 'crippled');
  assert.equal(win.currentHealthLevel(['/', '/', '/', '/', '/', '/', '/']).value, 'incapacitated');
  assert.equal(win.currentHealthLevel(['/', '/', '/', '/', '/', '/', '/']).blocked, true);
}));

test('applyHealthDamage e healHealthDamage mantem estado normalizado', () => withApp(win => {
  resetApp(win);
  win.applyHealthDamage('/');
  win.applyHealthDamage('X');
  win.applyHealthDamage('*');
  assert.deepEqual(win.getPath(appState(win), 'health.damage'), ['*', 'X', '/']);
  assert.equal(win.getPath(appState(win), 'health.level'), 'injured');
  win.healHealthDamage('X');
  assert.deepEqual(win.getPath(appState(win), 'health.damage'), ['*', '/']);
  assert.equal(win.getPath(appState(win), 'health.level'), 'hurt');
}));

test('ratingToXp e xpToRating sao inversos nos niveis inteiros', () => withApp(win => {
  assert.equal(win.ratingToXp(1), 7);
  assert.equal(win.ratingToXp(2), 21);
  assert.equal(win.ratingToXp(3), 42);
  assert.equal(win.xpToRating(7), 1);
  assert.equal(win.xpToRating(21), 2);
  assert.equal(win.xpToRating(42), 3);
}));

test('formatLineageXp remove zeros desnecessarios', () => withApp(win => {
  assert.equal(win.formatLineageXp(7), '7');
  assert.equal(win.formatLineageXp(7.5), '7.5');
  assert.equal(win.formatLineageXp(7.125), '7.13');
}));

test('sphereExperience tem prioridade sobre rating legado da linhagem', () => withApp(win => {
  const lineage = lineageState(win);
  lineage.spheres.life = 5;
  lineage.sphereExperience.life = 7;
  assert.equal(win.lineageSphereXp('life'), 7);
}));

test('syncLineageSpheresFromExperience calcula rating visivel', () => withApp(win => {
  const lineage = lineageState(win);
  lineage.sphereExperience.life = 21;
  win.syncLineageSpheresFromExperience();
  assert.equal(lineage.spheres.life, 2);
}));

test('characterSphereDeathBreakdown usa creationSnapshot quando existe', () => withApp(win => {
  const data = {
    spheres: { life: 3 },
    creationSnapshot: { spheres: { life: 1 } }
  };
  const breakdown = win.characterSphereDeathBreakdown(data, 'life');
  assert.equal(breakdown.currentXp, 42);
  assert.equal(breakdown.creationXp, 7);
  assert.equal(breakdown.gainedXp, 35);
  assert.equal(breakdown.source, 'creationSnapshot');
}));

test('characterSphereDeathBreakdown usa fallback lvl1 sem snapshot', () => withApp(win => {
  const breakdown = win.characterSphereDeathBreakdown({ spheres: { forces: 2 } }, 'forces');
  assert.equal(breakdown.createdWith, 1);
  assert.equal(breakdown.gainedXp, 14);
  assert.equal(breakdown.source, 'fallback-lvl1');
}));

test('absorbCharacterSpheresIntoLineage transfere metade do XP ganho', () => withApp(win => {
  const lineage = lineageState(win);
  lineage.sphereExperience.life = 7;
  const contribution = win.absorbCharacterSpheresIntoLineage({
    spheres: { life: 3 },
    creationSnapshot: { spheres: { life: 1 } }
  });
  assert.equal(contribution.life, 17.5);
  assert.equal(lineage.sphereExperience.life, 24.5);
  assert.equal(lineage.spheres.life, 2.17);
}));

test('removeLineageContribution remove apenas a contribuicao registrada', () => withApp(win => {
  const lineage = lineageState(win);
  lineage.sphereExperience.life = 24.5;
  win.removeLineageContribution({ life: 17.5 });
  assert.equal(lineage.sphereExperience.life, 7);
  assert.equal(lineage.spheres.life, 1);
}));

test('lineageData filtra membro vazio e preserva morto com contribuicao', () => withApp(win => {
  resetApp(win, { identity: { lineage: 'Casa Teste' } });
  const lineage = lineageState(win);
  lineage.members = [
    { name: '', chronicle: '', dead: false, lineageContribution: {} },
    { name: 'Mago Antigo', chronicle: 'Urbana', dead: true, lineageContribution: { life: 7 } }
  ];
  const data = win.lineageData();
  assert.equal(data.name, 'Casa Teste');
  assert.equal(data.members.length, 1);
  assert.equal(data.members[0].status, 'dead');
  assert.deepEqual(data.members[0].lineageContribution, { life: 7 });
}));

test('sheetJson normaliza saude, linhagem e creationSnapshot', () => withApp(win => {
  resetApp(win, {
    identity: { name: 'Teste', lineage: 'Casa Teste' },
    health: { damage: ['bad', 'X'] },
    lineage: { name: 'Legado Embutido' }
  });
  const json = JSON.parse(win.sheetJson());
  assert.deepEqual(json.health.damage, ['X']);
  assert.equal(json.health.level, 'bruised');
  assert.equal(json.identity.lineage, 'Casa Teste');
  assert.equal(Boolean(json.creationSnapshot), true);
  assert.equal(Object.prototype.hasOwnProperty.call(json, 'lineage'), false);
}));

test('sheetJson preserva justificativas de backgrounds no snapshot', () => withApp(win => {
  resetApp(win, {
    identity: { name: 'Teste' },
    backgrounds: { allies: 1 },
    backgroundJustifications: { allies: 'Jornalista amigo.' },
    origin: 'Veio de uma vila costeira.',
    aspirations: 'Achar um aliado.',
    obsession: 'Entender a visao.',
    world: {
      magic: { belief: 'Porque viu.' },
      reality: { profession: 'Livreira.' }
    }
  });
  const json = JSON.parse(win.sheetJson());
  assert.equal(json.backgroundJustifications.allies, 'Jornalista amigo.');
  assert.equal(json.creationSnapshot.backgroundJustifications.allies, 'Jornalista amigo.');
  assert.equal(json.origin, 'Veio de uma vila costeira.');
  assert.equal(json.creationSnapshot.origin, 'Veio de uma vila costeira.');
  assert.equal(json.aspirations, 'Achar um aliado.');
  assert.equal(json.obsession, 'Entender a visao.');
  assert.equal(json.creationSnapshot.aspirations, 'Achar um aliado.');
  assert.equal(json.creationSnapshot.obsession, 'Entender a visao.');
  assert.equal(json.world.magic.belief, 'Porque viu.');
  assert.equal(json.world.reality.profession, 'Livreira.');
  assert.equal(json.creationSnapshot.world.magic.belief, 'Porque viu.');
  assert.equal(json.creationSnapshot.world.reality.profession, 'Livreira.');
}));

test('normalizeAiSuggestion remove _xpAnalysis', () => withApp(win => {
  assert.deepEqual(win.normalizeAiSuggestion({ identity: { name: 'A' }, _xpAnalysis: { x: 1 } }), {
    identity: { name: 'A' }
  });
}));

test('imageExtensionFromMime normaliza jpeg e tipos estranhos', () => withApp(win => {
  assert.equal(win.imageExtensionFromMime('image/jpeg'), 'jpg');
  assert.equal(win.imageExtensionFromMime('image/png'), 'png');
  assert.equal(win.imageExtensionFromMime('image/x-icon'), 'xicon');
}));

test('dataUrlBase64 retorna apenas payload', () => withApp(win => {
  assert.equal(win.dataUrlBase64('data:image/png;base64,abc123'), 'abc123');
}));

test('getGithubSettings tolera JSON invalido', () => withApp(win => {
  win.localStorage.setItem(appVar(win, 'githubSettingsKey'), '{invalido');
  assert.deepEqual(win.getGithubSettings(), {
    user: '', repo: 'jogatina-pesada/mage-ascension', branch: 'main', sheetsPath: 'fichas'
  });
}));

test('normalizeCharacterLists cria default e limpa entradas invalidas', () => withApp(win => {
  const result = win.normalizeCharacterLists({
    adminPasswordHash: 'admin',
    lists: [{ name: ' protegida ', passwordHash: 'hash', characters: ['a.json', 4] }, { name: '' }]
  });
  assert.equal(result.adminPasswordHash, 'admin');
  assert.equal(result.lists[0].name, 'default');
  assert.equal(result.lists[1].name, 'protegida');
  assert.deepEqual(result.lists[1].characters, ['a.json']);
}));

test('senha de lista aceita a configurada ou o fallback administrativo', async () => withApp(async win => {
  const hash = await win.hashListPassword('segredo');
  const fallbackHash = await win.hashListPassword('bruxinhas');
  assert.equal(hash.length, 64);
  assert.equal(hash.includes('segredo'), false);
  assert.equal(win.eval('defaultCharacterListAdminPasswordHash'), fallbackHash);
  assert.equal(await win.listPasswordMatches('segredo', hash), true);
  assert.equal(await win.listPasswordMatches('bruxinhas', hash), true);
  assert.equal(await win.listPasswordMatches('errada', hash), false);
  assert.equal(await win.listPasswordMatches('', ''), true);
}));

runTests();
})();
