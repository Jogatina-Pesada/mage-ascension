function shellHeaderTemplate() {
  return `
<header class="hero">
      <div>
        <h2>Mage: The Ascension</h2>
      </div>
      <div class="actions no-print">
        <button id="openWikiBtn" class="icon-btn" type="button" aria-label="Abrir wiki da ficha" aria-controls="wikiModal" title="Wiki da ficha">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v18H7.5A3.5 3.5 0 0 0 4 23z"></path>
            <path d="M4 5.5v14"></path>
            <path d="M8 6h8"></path>
            <path d="M8 10h6"></path>
          </svg>
        </button>
        <button id="printSheetBtn" class="icon-btn" type="button" aria-label="Imprimir ficha" title="Imprimir ficha em preto e branco">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 9V3h10v6"></path>
            <path d="M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"></path>
            <path d="M7 14h10v7H7z"></path>
          </svg>
        </button>
        <button id="saveBtn" class="icon-btn" type="button" aria-label="Baixar ficha" title="Baixar ficha">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12"></path>
            <path d="m7 10 5 5 5-5"></path>
            <path d="M5 21h14"></path>
          </svg>
        </button>
        <button id="githubUploadBtn" class="icon-btn" type="button" aria-label="Salvar na nuvem (GitHub)" title="Salvar na nuvem (GitHub)">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 18h10a4 4 0 0 0 .8-7.9A6 6 0 0 0 6.2 8.5 4.8 4.8 0 0 0 7 18z"></path>
            <path d="M12 15V9"></path>
            <path d="m9.5 11.5 2.5-2.5 2.5 2.5"></path>
          </svg>
        </button>
        <button id="commitAiPreviewBtn" class="icon-btn ai-preview-action" type="button" aria-label="Confirmar alterações sugeridas" title="Confirmar alterações sugeridas" hidden>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
        </button>
        <button id="rollbackAiPreviewBtn" class="icon-btn ai-preview-action" type="button" aria-label="Desfazer alterações sugeridas" title="Desfazer alterações sugeridas" hidden>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 7v6h6"></path>
            <path d="M21 17a9 9 0 0 0-15-6.7L3 13"></path>
          </svg>
        </button>
        <!-- <button id="clearBtn" type="button">Limpar</button> -->
      </div>
    </header>
  `;
}
