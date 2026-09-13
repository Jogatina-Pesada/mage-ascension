function autosaveIndicatorTemplate() {
  return `
<div class="autosave-indicator no-print" id="autosaveIndicator" hidden>
    <span id="autosaveCountdown">Autosave inativo</span>
    <span id="autosaveFeedback"></span>
  </div>
  `;
}

function backgroundsModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="backgroundsModal" hidden>
    <div class="modal backgrounds-modal" role="dialog" aria-modal="true" aria-labelledby="backgroundsModalTitle">
      <header class="modal-header">
        <h2 id="backgroundsModalTitle">Antecedentes</h2>
        <button id="closeBackgroundsModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </header>
      <div class="backgrounds-modal-tabs" role="tablist" aria-label="Dados de antecedentes">
        <button id="backgroundsModalBackgroundsTab" class="backgrounds-modal-tab is-active" type="button" role="tab" aria-selected="true" aria-controls="backgroundsModalBackgroundsPanel" data-backgrounds-modal-tab="backgrounds">Antecedentes</button>
        <button id="backgroundsModalWorldTab" class="backgrounds-modal-tab" type="button" role="tab" aria-selected="false" aria-controls="backgroundsModalWorldPanel" data-backgrounds-modal-tab="world">Quem você é no mundo</button>
      </div>
      <section id="backgroundsModalBackgroundsPanel" class="backgrounds-modal-panel" role="tabpanel" aria-labelledby="backgroundsModalBackgroundsTab" data-backgrounds-modal-panel="backgrounds">
        <div class="background-grid backgrounds-modal-grid">
          <div data-dots="backgrounds.allies" data-label="Aliados"></div>
          <div data-dots="backgrounds.backup" data-label="Apoio"></div>
          <div data-dots="backgrounds.contacts" data-label="Contatos"></div>
          <div data-dots="backgrounds.spies" data-label="Espiões"></div>
          <div data-dots="backgrounds.fame" data-label="Fama"></div>
          <div data-dots="backgrounds.influence" data-label="Influência"></div>
          <div data-dots="backgrounds.wonder" data-label="Maravilha"></div>
          <div data-dots="backgrounds.mentor" data-label="Mentor"></div>
          <div data-dots="backgrounds.patron" data-label="Patrono"></div>
          <div data-dots="backgrounds.resources" data-label="Recursos"></div>
          <div data-dots="backgrounds.sanctum" data-label="Refúgio"></div>
          <div data-dots="backgrounds.dream" data-label="Sonho"></div>
          <div data-dots="backgrounds.pastLives" data-label="Vidas Passadas"></div>
        </div>
        <label class="background-origin-field" data-wiki-topic-link="backgrounds" data-wiki-query="Origem">Origem
          <textarea class="large" data-field="origin" placeholder="História, lugar e circunstâncias de origem da personagem"></textarea>
        </label>
        <div class="background-extra-fields">
          <label data-wiki-topic-link="backgrounds" data-wiki-query="Aspirações">Aspirações
            <textarea data-field="aspirations" placeholder="coisas que a bruxa deseja a curto prazo"></textarea>
          </label>
          <label data-wiki-topic-link="backgrounds" data-wiki-query="Obsessão vício">Obsessão / vício
            <textarea data-field="obsession" placeholder="coisas que a bruxa anseia de forma compulsiva a longo prazo"></textarea>
          </label>
        </div>
      </section>
      <section id="backgroundsModalWorldPanel" class="backgrounds-modal-panel" role="tabpanel" aria-labelledby="backgroundsModalWorldTab" data-backgrounds-modal-panel="world" hidden>
        <div class="creation-world-columns backgrounds-modal-world">
          <div class="creation-world-column">
            <h3>Como lida com magia</h3>
            <label>Por que você acredita em magia?
              <textarea rows="2" data-field="world.magic.belief"></textarea>
            </label>
            <label>Como você usa magia?
              <textarea rows="2" data-field="world.magic.method"></textarea>
            </label>
            <label>Você usa materiais, símbolos, preparos, crenças? Tem uma ferramenta padrão?
              <textarea rows="2" data-field="world.magic.tools"></textarea>
            </label>
            <label>Como sua magia se parece (estilo)?
              <textarea rows="2" data-field="world.magic.style"></textarea>
            </label>
            <label>Como você se juntou ao coven? Qual relacionamento que você tem com os demais membros?
              <textarea rows="2" data-field="world.magic.coven"></textarea>
            </label>
          </div>
          <div class="creation-world-column">
            <h3>Como lida com a “realidade”</h3>
            <label>O que você faz da vida?
              <textarea rows="2" data-field="world.reality.life"></textarea>
            </label>
            <label>Você tem uma profissão?
              <textarea rows="2" data-field="world.reality.profession"></textarea>
            </label>
            <label>Tem amigos / família?
              <textarea rows="2" data-field="world.reality.relationships"></textarea>
            </label>
            <label>Onde você mora?
              <textarea rows="2" data-field="world.reality.home"></textarea>
            </label>
            <label>Que lugares costuma habitar?
              <textarea rows="2" data-field="world.reality.places"></textarea>
            </label>
          </div>
        </div>
      </section>
    </div>
  </div>
  `;
}

function sheetModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="sheetModal" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="sheetModalTitle">
      <header class="modal-header">
        <h2 id="sheetModalTitle">Fichas</h2>
        <button id="closeSheetModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </header>
      <div class="sheet-list" id="sheetList"></div>
      <p class="modal-status" id="sheetModalStatus"></p>
    </div>
  </div>
  `;
}

function startModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="startModal">
    <div class="modal start-modal" role="dialog" aria-modal="true" aria-labelledby="startModalTitle">
      <header class="modal-header">
        <h2 id="startModalTitle">Personagem</h2>
      </header>
      <div class="start-actions">
        <button id="newCharacterBtn" class="start-action-btn" type="button" aria-label="Novo personagem" title="Novo personagem">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
          <span>NOVO</span>
        </button>
        <button id="loadGitSheetsBtn" class="start-action-btn" type="button" aria-label="Abrir personagem" title="Carregar da pasta fichas no GitHub">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 19c-4 1.5-4-2-5-2.5"></path>
            <path d="M15 22v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6A4.6 4.6 0 0 0 18.7 7a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 3.5 5.4 3.8 5.4 3.8A4.2 4.2 0 0 0 5.3 7 4.6 4.6 0 0 0 4 10.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V22"></path>
          </svg>
          <span>ABRIR</span>
        </button>
        <label class="start-action-btn file-btn" aria-label="Carregar personagem" title="Carregar personagem">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12"></path>
            <path d="m7 8 5-5 5 5"></path>
            <path d="M5 15v4h14v-4"></path>
          </svg>
          <span>Carregar</span>
          <input id="localSheetInput" type="file" accept="application/json,.json" />
        </label>
        <a id="openStartWikiBtn" class="start-action-btn" href="wiki.html" target="_blank" rel="noopener" aria-label="Abrir wiki em página inteira" title="Abrir wiki em página inteira">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v18H7.5A3.5 3.5 0 0 0 4 23z"></path>
            <path d="M4 5.5v14"></path><path d="M8 6h8"></path><path d="M8 10h6"></path>
          </svg>
          <span>WIKI</span>
        </a>
      </div>
      <div id="gitListAccess" class="list-access" hidden>
        <label>Lista<select id="gitCharacterList"></select></label>
        <label id="gitListPasswordLabel" hidden>Senha da lista<input id="gitListPassword" type="password" autocomplete="off" /></label>
        <button id="resetGitListPasswordBtn" type="button">Redefinir senha da lista</button>
      </div>
      <div class="sheet-list" id="gitSheetList"></div>
      <p class="modal-status" id="startModalStatus"></p>
    </div>
  </div>
  `;
}

function githubModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="githubModal" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="githubModalTitle">
      <header class="modal-header">
        <h2 id="githubModalTitle">Upload GitHub</h2>
        <button id="closeGithubModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </header>
      <form class="github-form" id="githubForm">
        <label>Usuario GitHub<input id="githubUser" autocomplete="username" required /></label>
        <label>PAT<input id="githubPat" type="password" autocomplete="off" required /></label>
        <div id="githubCharacterListFields" class="github-character-list-fields">
          <label>Associar à lista<select id="githubCharacterList"><option value="">selecione uma lista</option></select></label>
          <button id="createGithubCharacterListBtn" type="button" aria-label="Criar nova lista">+</button>
          <div id="newGithubCharacterListFields" hidden>
            <label>Nome da lista<input id="newGithubCharacterListName" /></label>
            <label>Senha da lista (opcional)<input id="newGithubCharacterListPassword" type="password" autocomplete="new-password" /></label>
          </div>
        </div>
        <div id="githubListResetFields" hidden>
          <label>Senha admin<input id="githubListAdminPassword" type="password" autocomplete="off" /></label>
          <label>Nova senha da lista (opcional)<input id="githubListNewPassword" type="password" autocomplete="new-password" /></label>
        </div>
        <button id="githubSubmitBtn" type="submit">Enviar ficha</button>
      </form>
      <p class="modal-status" id="githubModalStatus"></p>
    </div>
  </div>
  `;
}

function lineageLoadModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="lineageLoadModal" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="lineageLoadModalTitle">
      <header class="modal-header">
        <h2 id="lineageLoadModalTitle">Carregar linhagem</h2>
        <button id="closeLineageLoadModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </header>
      <div class="sheet-list" id="gitLineageList"></div>
      <p class="modal-status" id="lineageLoadModalStatus"></p>
    </div>
  </div>
  `;
}

function aiModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="aiModal" hidden>
    <div class="modal ai-modal" role="dialog" aria-modal="true" aria-labelledby="aiModalTitle">
      <header class="modal-header">
        <h2 id="aiModalTitle">Integração de IA</h2>
        <button id="closeAiModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </header>
      <form class="ai-form" id="aiForm">
        <div id="aiQuestionPanel" class="ai-question-panel">
          <label>Quando você imagina seu personagem resolvendo um problema, o que ele faz primeiro?
            <em>Usa magia? Conversa? Investiga? Invade sistemas? Parte para ação física? etc.</em>
            <textarea maxlength="200" data-ai-question="problemApproach"></textarea>
          </label>
          <label>Que tipo de cena você gostaria de protagonizar com mais frequência?
            <em>Confrontos mágicos, Mistérios ocultos, Política entre magos, Exploração da Umbra, Pesquisa e criação de rituais.</em>
            <textarea maxlength="200" data-ai-question="scenePreference"></textarea>
          </label>
          <label>O que seu personagem ainda não consegue fazer hoje, mas você gostaria que conseguisse?
            <em>Teletransportar-se, Ler pensamentos, Curar aliados, Invocar espíritos, Manipular sorte etc.</em>
            <textarea maxlength="200" data-ai-question="desiredCapability"></textarea>
          </label>
          <label>Seu personagem quer ser mais poderoso ou mais versátil?
            <em>Mais poderoso → subir Arcana e Sphere principal. Mais versátil → abrir novas Esferas, Habilidades e Backgrounds.</em>
            <select data-ai-question="powerOrVersatility">
              <option value="Mais poderoso">Mais poderoso</option>
              <option value="Mais versátil">Mais versátil</option>
            </select>
          </label>
          <label>Qual é a maior fraqueza do personagem atualmente?
            <em>Falta de poder mágico? Pouca resistência mental? Dificuldade social? Pouco conhecimento? Falta de recursos e contatos? etc.</em>
            <textarea maxlength="200" data-ai-question="currentWeakness"></textarea>
          </label>
          <div class="ai-actions">
            <button id="generateAiPromptBtn" type="submit">1. Gerar prompt</button>
            <button id="copyAiPromptBtn" type="button">2. Copiar prompt</button>
            <button id="receiveAiJsonBtn" type="button">3. Receber JSON</button>
          </div>
          <textarea id="aiPromptOutput" class="ai-prompt-output" readonly placeholder="O prompt gerado aparecerá aqui. Ele deve ser enviado para a sua IA de preferência :) O resultado deve ser um JSON, a ser colado na etapa 3."></textarea>
        </div>
        <div id="aiResultPanel" class="ai-result-panel" hidden>
          <label>JSON retornado pela IA
            <textarea id="aiJsonInput" class="ai-json-input" placeholder="Cole aqui o JSON retornado pela IA."></textarea>
          </label>
          <div class="ai-actions">
            <button id="previewAiJsonBtn" type="button">Pré-visualizar na ficha</button>
            <button id="backToAiQuestionsBtn" type="button">Voltar às perguntas</button>
          </div>
        </div>
        <p class="modal-status" id="aiModalStatus"></p>
      </form>
    </div>
  </div>
  `;
}

function characterImageRemoveModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="characterImageRemoveModal" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="characterImageRemoveModalTitle">
      <header class="modal-header">
        <h2 id="characterImageRemoveModalTitle">Remover imagem</h2>
        <button id="closeCharacterImageRemoveModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </header>
      <p class="modal-status">Remover a imagem ativa deste personagem?</p>
      <div class="ai-actions">
        <button id="confirmCharacterImageRemoveBtn" type="button">Confirmar</button>
        <button id="cancelCharacterImageRemoveBtn" type="button">Cancelar</button>
      </div>
    </div>
  </div>
  `;
}

function creationCompletionModalsTemplate() {
  return `
<div class="modal-backdrop no-print" id="creationPointsWarningModal" hidden>
  <div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="creationPointsWarningModalTitle" aria-describedby="creationPointsWarningMessage">
    <header class="modal-header">
      <h2 id="creationPointsWarningModalTitle">Criação incompleta</h2>
      <button id="closeCreationPointsWarningModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
      </button>
    </header>
    <p id="creationPointsWarningMessage" class="modal-status"></p>
    <div class="ai-actions"><button id="acknowledgeCreationPointsWarningBtn" type="button">Continuar criação</button></div>
  </div>
</div>
<div class="modal-backdrop no-print" id="creationCompletionModal" hidden>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="creationCompletionModalTitle" aria-describedby="creationCompletionMessage">
    <header class="modal-header">
      <h2 id="creationCompletionModalTitle">Concluir criação</h2>
      <button id="closeCreationCompletionModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
      </button>
    </header>
    <p id="creationCompletionMessage" class="modal-status">Todos os pontos foram gastos. Deseja concluir a criação e mudar a ficha para o modo de edição?</p>
    <div class="ai-actions">
      <button id="confirmCreationCompletionBtn" type="button">Confirmar</button>
      <button id="cancelCreationCompletionBtn" type="button">Cancelar</button>
    </div>
  </div>
</div>
  `;
}

function covenItemModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="covenItemModal" hidden>
  <div class="modal coven-item-modal" role="dialog" aria-modal="true" aria-labelledby="covenItemModalTitle">
    <header class="modal-header">
      <h2 id="covenItemModalTitle">Item da dispensa</h2>
      <button id="closeCovenItemModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </header>
    <form id="covenItemForm" class="coven-item-form">
      <div class="coven-inventory-import" id="covenInventoryImport">
        <label>ID do inventário<input id="covenInventoryItemId" maxlength="8" placeholder="ABC12345" pattern="[A-Za-z]{3}[0-9]{5}" /></label>
        <button id="importCovenInventoryItemBtn" type="button">Buscar item</button>
      </div>
      <p id="covenInventoryItemReference" class="coven-inventory-reference" hidden></p>
      <p id="covenItemUsedStatus" class="coven-item-used-status" hidden></p>
      <div class="coven-item-image-stage">
        <button id="previousCovenItemImageBtn" class="coven-item-image-nav" type="button" aria-label="Imagem anterior" hidden>‹</button>
        <label class="coven-item-image-picker" id="covenItemImagePicker" tabindex="0">
          <img id="covenItemImagePreview" alt="Imagem do item" hidden />
          <span id="covenItemImagePlaceholder">Selecionar imagem quadrada</span>
          <input id="covenItemImageInput" type="file" accept="image/*" />
        </label>
        <button id="nextCovenItemImageBtn" class="coven-item-image-nav" type="button" aria-label="Próxima imagem" hidden>›</button>
      </div>
      <p id="covenItemImageCounter" class="coven-item-image-counter" hidden></p>
      <label>Nome<input id="covenItemName" maxlength="80" required /></label>
      <label>Descrição<textarea id="covenItemDescription" rows="5"></textarea></label>
      <p id="covenItemModalStatus" class="modal-status" role="status"></p>
      <div class="ai-actions" id="covenItemEditActions">
        <button id="saveCovenItemBtn" type="submit">Salvar item</button>
        <button id="deleteCovenItemBtn" class="icon-btn danger-action" type="button" aria-label="Excluir item" title="Excluir item">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M9 7V4h6v3"></path><path d="m6 7 1 13h10l1-13"></path><path d="M10 11v5M14 11v5"></path></svg>
        </button>
      </div>
      <div class="ai-actions" id="covenItemUseActions" hidden>
        <button id="useCovenInventoryItemBtn" type="button">Usar item</button>
      </div>
    </form>
  </div>
</div>
  `;
}

function covenItemDeleteModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="covenItemDeleteModal" hidden>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="covenItemDeleteModalTitle">
    <header class="modal-header">
      <h2 id="covenItemDeleteModalTitle">Excluir item da dispensa</h2>
      <button id="closeCovenItemDeleteModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
      </button>
    </header>
    <p id="covenItemDeleteMessage" class="modal-status">Deseja excluir este item?</p>
    <div class="ai-actions">
      <button id="confirmCovenItemDeleteBtn" class="danger-action" type="button">Excluir item</button>
      <button id="cancelCovenItemDeleteBtn" type="button">Cancelar</button>
    </div>
  </div>
</div>
  `;
}

function covenItemUseModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="covenItemUseModal" hidden>
  <div class="modal coven-item-use-modal" role="dialog" aria-modal="true" aria-labelledby="covenItemUseModalTitle">
    <header class="modal-header">
      <h2 id="covenItemUseModalTitle">Confirmar uso do item</h2>
      <button id="closeCovenItemUseModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
      </button>
    </header>
    <p id="covenItemUseSummary" class="modal-status"></p>
    <div id="covenItemUseEffects" class="coven-item-use-effects"></div>
    <p class="modal-status">Ao confirmar, o item será marcado como usado mesmo que algum efeito não cumpra o nível mínimo.</p>
    <div class="ai-actions">
      <button id="confirmCovenItemUseBtn" type="button">Confirmar uso</button>
      <button id="cancelCovenItemUseBtn" type="button">Cancelar</button>
    </div>
  </div>
</div>
  `;
}

function lineageDeathModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="lineageDeathModal" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="lineageDeathModalTitle">
      <header class="modal-header">
        <h2 id="lineageDeathModalTitle">Confirmar morte</h2>
        <button id="closeLineageDeathModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </header>
      <p class="modal-status">Marcar este personagem como morto?</p>
      <div class="ai-actions">
        <button id="confirmLineageDeathBtn" type="button">Confirmar</button>
        <button id="cancelLineageDeathBtn" type="button">Cancelar</button>
      </div>
    </div>
  </div>
  `;
}

function lineageReviveModalTemplate() {
  return `
<div class="modal-backdrop no-print" id="lineageReviveModal" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="lineageReviveModalTitle">
      <header class="modal-header">
        <h2 id="lineageReviveModalTitle">Confirmar retorno</h2>
        <button id="closeLineageReviveModal" class="icon-btn modal-close" type="button" aria-label="Fechar" title="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </header>
      <p class="modal-status">Reviver este personagem e remover da linhagem a experiência herdada por sua morte?</p>
      <div class="ai-actions">
        <button id="confirmLineageReviveBtn" type="button">Confirmar</button>
        <button id="cancelLineageReviveBtn" type="button">Cancelar</button>
      </div>
    </div>
  </div>
  `;
}
