function identityHealthTemplate() {
  return `
<section class="grid identity-health">
      <div class="panel identity">
        <section class="character-photo" aria-label="Imagem quadrada do personagem">
          <div id="characterImagePicker" class="character-photo-frame" role="button" tabindex="0" aria-label="Enviar imagem do personagem" title="Enviar imagem do personagem">
            <img id="characterImagePreview" alt="Imagem do personagem" hidden />
            <span id="characterImagePlaceholder" class="character-image-placeholder" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v12"></path>
                <path d="m7 8 5-5 5 5"></path>
                <path d="M5 15v4h14v-4"></path>
              </svg>
              <span>Imagem quadrada</span>
            </span>
            <button id="removeCharacterImageBtn" class="character-photo-remove no-print" type="button" aria-label="Remover imagem" aria-controls="characterImageRemoveModal" title="Remover imagem" hidden>×</button>
          </div>
          <input id="characterImageInput" class="character-photo-input" type="file" accept="image/*" />
        </section>
        <div class="identity-fields">
          <label>Nome<input data-field="identity.name" placeholder="Nome do personagem" required /></label>
          <label>Crônica
            <span class="chronicle-control">
              <select data-field="identity.chronicle">
                <option value="Idade Média">Idade Média</option>
                <option value="Urbana">Urbano</option>
                <option value="Futurista">Futurista</option>
              </select>
              <button id="openBackgroundsModalBtn" class="icon-btn backgrounds-modal-btn no-print" type="button" aria-label="Abrir antecedentes" aria-controls="backgroundsModal" title="Antecedentes" hidden>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path>
                </svg>
              </button>
            </span>
          </label>
          <label><span id="resourceLabel">Experiência</span>
            <span class="experience-control">
              <input id="experienceInput" data-field="identity.experience" data-number-default="0" type="number" min="0" step="1" value="0" inputmode="numeric" />
              <button id="levelEditBtn" class="icon-btn level-edit-btn no-print" type="button" aria-label="Editar níveis" title="Editar níveis">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 20 9-9-8-8-9 9v8h8z"></path>
                  <path d="m16 7 1 1"></path>
                </svg>
              </button>
              <button id="aiIntegrationBtn" class="icon-btn ai-integration-btn no-print" type="button" aria-label="Integração de IA" title="Integração de IA">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3l1.7 5.2L19 10l-5.3 1.8L12 17l-1.7-5.2L5 10l5.3-1.8L12 3z"></path>
                  <path d="M19 16l.7 2.1L22 19l-2.3.9L19 22l-.7-2.1L16 19l2.3-.9L19 16z"></path>
                  <path d="M5 15l.5 1.5L7 17l-1.5.5L5 19l-.5-1.5L3 17l1.5-.5L5 15z"></path>
                </svg>
              </button>
            </span>
          </label>
        </div>
      </div>
      <div class="panel health-panel">
      <label><span class="health-title">Saúde</span>
        <span class="health-control">
          <span id="healthDamageButtons" class="health-damage-buttons no-print"></span>
          <span id="healthBoxes" class="health-boxes" aria-label="Dano de saude"></span>
          <span class="health-summary">
            <span id="healthStatus" class="health-status">Saudável</span>
            <span id="healthPenalty" class="health-penalty">0</span>
          </span>
        </span>
      </label>
      </div>
    </section>
  `;
}

function creationPanelTemplate() {
  return `
<section class="panel creation-panel no-print" id="creationPanel" hidden>
      <h2>Criação</h2>
      <div class="creation-controls">
        <label>Atributos Primária<select id="attributePrimary" data-priority-kind="attributes" data-priority-rank="primary"></select></label>
        <label>Atributos Secundária<select id="attributeSecondary" data-priority-kind="attributes" data-priority-rank="secondary"></select></label>
        <label>Atributos Terciária<select id="attributeTertiary" data-priority-kind="attributes" data-priority-rank="tertiary"></select></label>
        <label>Habilidades Primário<select id="abilityPrimary" data-priority-kind="abilities" data-priority-rank="primary"></select></label>
        <label>Habilidades Secundário<select id="abilitySecondary" data-priority-kind="abilities" data-priority-rank="secondary"></select></label>
        <label>Habilidades Terciário<select id="abilityTertiary" data-priority-kind="abilities" data-priority-rank="tertiary"></select></label>
      </div>
      <div class="creation-summary" id="creationSummary"></div>
      <div class="creation-lineage-actions">
        <label>Linhagem</label>
        <button id="newLineageBtn" class="icon-btn" type="button" aria-label="Nova linhagem" title="Nova linhagem">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
        </button>
        <button id="loadGitLineageBtn" class="icon-btn" type="button" aria-label="Carregar linhagem do GitHub" title="Carregar linhagem do GitHub">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 19c-4 1.5-4-2-5-2.5"></path>
            <path d="M15 22v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6A4.6 4.6 0 0 0 18.7 7a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 3.5 5.4 3.8 5.4 3.8A4.2 4.2 0 0 0 5.3 7 4.6 4.6 0 0 0 4 10.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V22"></path>
          </svg>
        </button>
        <label class="icon-btn file-btn" aria-label="Carregar linhagem local" title="Carregar linhagem local">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12"></path>
            <path d="m7 8 5-5 5 5"></path>
            <path d="M5 15v4h14v-4"></path>
          </svg>
          <input id="localLineageInput" type="file" accept="application/json,.json" />
        </label>
      </div>
    </section>
  `;
}

function spheresAdvantagesTemplate() {
  return `
<section class="grid spheres-advantages">
      <div class="panel">
        <h2>Esferas</h2>
        <div class="sphere-grid">
          <div data-dots="spheres.fate" data-label="Destino"></div>
          <div data-dots="spheres.space" data-label="Espaço"></div>
          <div data-dots="spheres.spirit" data-label="Espírito"></div>
          <div data-dots="spheres.forces" data-label="Forças"></div>
          <div data-dots="spheres.matter" data-label="Matéria"></div>
          <div data-dots="spheres.mind" data-label="Mente"></div>
          <div data-dots="spheres.death" data-label="Morte"></div>
          <div data-dots="spheres.prime" data-label="Primórdio"></div>
          <div data-dots="spheres.time" data-label="Tempo"></div>
          <div data-dots="spheres.life" data-label="Vida"></div>
        </div>
      </div>
      <div class="panel">
        <h2>Vantagens</h2>
        <div data-dots="advantages.arcana" data-label="Arcana" data-max="10"></div>
        <div data-dots="advantages.willpower" data-label="Força de Vontade" data-max="10"></div>
        <label class="number-row">
          <span class="dot-label" data-wiki-path="advantages.quintessence" data-wiki-query="Quintessência">Quintessência</span>
          <span class="number-stepper">
            <button class="stepper-btn" type="button" data-stepper="down" data-target="advantages.quintessence" aria-label="Diminuir Quintessência">‹</button>
            <input data-field="advantages.quintessence" data-number-default="0" type="number" min="0" max="10" step="1" value="0" inputmode="numeric" />
            <button class="stepper-btn" type="button" data-stepper="up" data-target="advantages.quintessence" aria-label="Aumentar Quintessência">›</button>
          </span>
        </label>
        <label class="number-row">
          <span class="dot-label" data-wiki-path="advantages.paradox" data-wiki-query="Paradoxo">Paradoxo</span>
          <span class="number-stepper">
            <button class="stepper-btn" type="button" data-stepper="down" data-target="advantages.paradox" aria-label="Diminuir Paradoxo">‹</button>
            <input data-field="advantages.paradox" data-number-default="0" type="number" min="0" max="10" step="1" value="0" inputmode="numeric" />
            <button class="stepper-btn" type="button" data-stepper="up" data-target="advantages.paradox" aria-label="Aumentar Paradoxo">›</button>
          </span>
        </label>
      </div>
    </section>
  `;
}

function attributesTemplate() {
  return `
<section class="panel attributes-panel">
      <h2>Atributos</h2>
      <div class="attribute-columns">
        <div class="attribute-column">
          <h3>Físicos</h3>
          <div data-dots="attributes.strength" data-label="Força"></div>
          <div data-dots="attributes.dexterity" data-label="Destreza"></div>
          <div data-dots="attributes.stamina" data-label="Vigor"></div>
        </div>
        <div class="attribute-column">
          <h3>Sociais</h3>
          <div data-dots="attributes.charisma" data-label="Carisma"></div>
          <div data-dots="attributes.manipulation" data-label="Manipulação"></div>
          <div data-dots="attributes.appearance" data-label="Aparência"></div>
        </div>
        <div class="attribute-column">
          <h3>Mentais</h3>
          <div data-dots="attributes.perception" data-label="Percepção"></div>
          <div data-dots="attributes.intelligence" data-label="Inteligência"></div>
          <div data-dots="attributes.wits" data-label="Raciocínio"></div>
        </div>
      </div>
    </section>
  `;
}

function abilitiesTemplate() {
  return `
<section class="panel abilities-panel">
      <h2>Habilidades</h2>
      <div class="ability-columns">
        <div class="ability-column">
          <h3>Talentos</h3>
          <div data-dots="abilities.alertness" data-label="Prontidão"></div>
          <div data-dots="abilities.athletics" data-label="Esportes"></div>
          <div data-dots="abilities.awareness" data-label="Consciência"></div>
          <div data-dots="abilities.brawl" data-label="Briga"></div>
          <div data-dots="abilities.empathy" data-label="Empatia"></div>
          <div data-dots="abilities.expression" data-label="Expressão"></div>
          <div data-dots="abilities.intimidation" data-label="Intimidação"></div>
          <div data-dots="abilities.leadership" data-label="Liderança"></div>
          <div data-dots="abilities.streetwise" data-label="Manha"></div>
          <div data-dots="abilities.subterfuge" data-label="Lábia"></div>
        </div>
        <div class="ability-column">
          <h3>Perícias</h3>
          <div data-dots="abilities.crafts" data-label="Ofícios"></div>
          <div data-dots="abilities.drive" data-label="Condução"></div>
          <div data-dots="abilities.etiquette" data-label="Etiqueta"></div>
          <div data-dots="abilities.firearms" data-label="Armas de Fogo"></div>
          <div data-dots="abilities.meditation" data-label="Meditação"></div>
          <div data-dots="abilities.melee" data-label="Armas Brancas"></div>
          <div data-dots="abilities.research" data-label="Pesquisa"></div>
          <div data-dots="abilities.stealth" data-label="Furtividade"></div>
          <div data-dots="abilities.survival" data-label="Sobrevivência"></div>
          <div data-dots="abilities.technology" data-label="Tecnologia"></div>
        </div>
        <div class="ability-column">
          <h3>Conhecimentos</h3>
          <div data-dots="abilities.academics" data-label="Acadêmicos"></div>
          <div data-dots="abilities.computer" data-label="Computador"></div>
          <div data-dots="abilities.cosmology" data-label="Cosmologia"></div>
          <div data-dots="abilities.enigmas" data-label="Enigmas"></div>
          <div data-dots="abilities.esoterica" data-label="Esotérica"></div>
          <div data-dots="abilities.investigation" data-label="Investigação"></div>
          <div data-dots="abilities.law" data-label="Direito"></div>
          <div data-dots="abilities.medicine" data-label="Medicina"></div>
          <div data-dots="abilities.occult" data-label="Ocultismo"></div>
          <div data-dots="abilities.science" data-label="Ciência"></div>
        </div>
      </div>
    </section>
  `;
}

function backgroundsTemplate() {
  return `
<section class="panel backgrounds-panel">
      <h2>Antecedentes</h2>
      <div class="background-grid">
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
  `;
}

function notesFocusTemplate() {
  return `
<section class="panel notes-focus-section">
  <h2>Anotações</h2>
  <textarea class="large" data-field="notes" placeholder="Rotes, grimório, contatos, histórico, equipamentos..."></textarea>
</section>
  `;
}

function covenantTemplate() {
  return `
<section class="panel covenant-panel" id="covenSection">
  <div class="section-heading">
    <h2>Coven</h2>
    <button id="covenEditBtn" class="icon-btn level-edit-btn no-print" type="button" aria-label="Editar coven" title="Editar coven">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 20 9-9-8-8-9 9v8h8z"></path><path d="m16 7 1 1"></path></svg>
    </button>
  </div>
  <p id="covenLockStatus" class="coven-lock-status no-print" role="status" aria-live="polite"></p>
  <div class="coven-primary-row">
    <section class="coven-subsection coven-resources" aria-labelledby="covenResourcesTitle">
      <h3 id="covenResourcesTitle">Recursos</h3>
      <label class="coven-name-field">Nome do Coven
        <input data-coven-field="name" type="text" maxlength="120" placeholder="Nome do coven" />
      </label>
      <label class="number-row"><span class="dot-label" data-wiki-topic-link="coven" data-wiki-query="Quintessência">Quintessência</span><span class="number-stepper"><button class="stepper-btn" type="button" data-coven-stepper="down" data-coven-target="quintessence" aria-label="Devolver Quintessência ao personagem">−</button><input data-coven-field="quintessence" type="number" min="0" step="1" value="0" inputmode="numeric" readonly /><button class="stepper-btn" type="button" data-coven-stepper="up" data-coven-target="quintessence" aria-label="Transferir Quintessência do personagem">+</button></span></label>
      <label class="number-row"><span class="dot-label" data-wiki-topic-link="coven" data-wiki-query="Paradoxo">Paradoxo</span><span class="number-stepper"><button class="stepper-btn" type="button" data-coven-stepper="down" data-coven-target="paradox" aria-label="Devolver Paradoxo ao personagem">−</button><input data-coven-field="paradox" type="number" min="0" step="2" value="0" inputmode="numeric" readonly /><button class="stepper-btn" type="button" data-coven-stepper="up" data-coven-target="paradox" aria-label="Transferir Paradoxo do personagem">+</button></span></label>
      <label class="number-row"><span class="dot-label" data-wiki-topic-link="coven" data-wiki-query="Óbolo dos Mortos">Óbolo dos Mortos</span><span class="number-stepper"><button class="stepper-btn" type="button" data-coven-stepper="down" data-coven-target="obolOfTheDead" aria-label="Diminuir Óbolo dos Mortos">‹</button><input data-coven-field="obolOfTheDead" type="number" min="0" max="999999" step="1" value="0" inputmode="numeric" /><button class="stepper-btn" type="button" data-coven-stepper="up" data-coven-target="obolOfTheDead" aria-label="Aumentar Óbolo dos Mortos">›</button></span></label>
      <label class="coven-fame-field">Fama
        <select data-coven-field="fame" aria-describedby="covenFameDescription"><option value="0">0 — Profanos</option><option value="1">1 — Despertos</option><option value="2">2 — Iniciados</option><option value="3">3 — Arcanistas</option><option value="4">4 — Oraculares</option><option value="5">5 — Luminares</option><option value="6">6 — Ascendentes</option></select>
        <span id="covenFameDescription" class="coven-fame-description"></span>
      </label>
    </section>
    <section class="coven-subsection coven-pantry" aria-labelledby="covenPantryTitle">
      <h3 id="covenPantryTitle">Despensa</h3>
      <div id="covenPantryGrid" class="coven-pantry-grid" aria-label="Inventário da despensa com 16 espaços"></div>
    </section>
  </div>
  <!--
  <section class="coven-subsection coven-laboratory" aria-labelledby="covenLaboratoryTitle">
    <h3 id="covenLaboratoryTitle">Laboratório</h3>
    <textarea data-coven-field="lab"></textarea>
  </section>
  -->
    </section>
  `;
}

function lineageTemplate() {
  return `
<section class="grid lineage-section" id="lineageSection" aria-busy="false">
      <div class="lineage-sync-loading no-print" id="lineageSyncLoading" hidden role="status" aria-live="polite">
        <span class="lineage-sync-spinner" aria-hidden="true"></span>
        <span>Sincronizando linhagem...</span>
      </div>
      <div class="panel">
        <h2>Linhagem</h2>
        <label>Nome da Linhagem<input id="lineageNameInput" data-lineage-field="name" placeholder="Nome da linhagem" /></label>
        <div class="lineage-sphere-grid" id="lineageSphereGrid">
          <div data-lineage-dots="fate" data-label="Destino"></div>
          <div data-lineage-dots="space" data-label="Espaço"></div>
          <div data-lineage-dots="spirit" data-label="Espírito"></div>
          <div data-lineage-dots="forces" data-label="Forças"></div>
          <div data-lineage-dots="matter" data-label="Matéria"></div>
          <div data-lineage-dots="mind" data-label="Mente"></div>
          <div data-lineage-dots="death" data-label="Morte"></div>
          <div data-lineage-dots="prime" data-label="Primórdio"></div>
          <div data-lineage-dots="time" data-label="Tempo"></div>
          <div data-lineage-dots="life" data-label="Vida"></div>
        </div>
        <button id="applyLineageSphereBonusBtn" class="lineage-bonus-btn no-print" type="button" disabled hidden>Herdar esferas da linhagem</button>
        <p id="lineageBonusStatus" class="lineage-bonus-status no-print"></p>
      </div>
      <div class="panel">
        <h2>Personagens</h2>
        <div class="lineage-members" id="lineageMembers"></div>
        <button id="addLineageMemberBtn" class="lineage-add-btn no-print" type="button">+</button>
      </div>
    </section>
  `;
}
