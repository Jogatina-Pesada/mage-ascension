function wikiPanelTemplate({ fullPage = false } = {}) {
  return `
  <section class="${fullPage ? 'wiki-modal wiki-page-panel' : 'modal wiki-modal'}" ${fullPage ? 'id="wikiPage"' : 'role="dialog" aria-modal="true"'} aria-labelledby="wikiModalTitle">
    <header class="modal-header wiki-modal-header">
      <div>
        <h2 id="wikiModalTitle">Wiki da ficha</h2>
        <p>Consulte os campos e as regras de cada seção.</p>
      </div>
      <div class="wiki-header-actions">
        <button id="printWikiTopicBtn" class="icon-btn wiki-print-topic" type="button" aria-label="Imprimir esta seção" title="Imprimir esta seção em PDF">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v7H6z"></path></svg>
        </button>
        ${fullPage ? '' : `
        <a class="icon-btn wiki-open-page" href="wiki.html" target="_blank" rel="noopener" aria-label="Abrir wiki em página inteira" title="Abrir em página inteira">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7"></path><path d="m10 14 11-11"></path><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"></path></svg>
        </a>
        <button id="closeWikiModal" class="icon-btn modal-close" type="button" aria-label="Fechar wiki" title="Fechar">×</button>`}
      </div>
    </header>
    <div class="wiki-search">
      <label class="sr-only" for="wikiSearchInput">Pesquisar na wiki</label>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>
      <input id="wikiSearchInput" type="text" role="searchbox" inputmode="search" placeholder="Pesquisar na wiki…" autocomplete="off" />
      <div class="wiki-search-actions">
        <button id="previousWikiMatchBtn" class="wiki-search-nav" type="button" aria-label="Correspondência anterior" title="Correspondência anterior" disabled>↑</button>
        <button id="nextWikiMatchBtn" class="wiki-search-nav" type="button" aria-label="Próxima correspondência" title="Próxima correspondência" disabled>↓</button>
        <button id="clearWikiSearchBtn" class="wiki-search-clear" type="button" aria-label="Limpar pesquisa" title="Limpar pesquisa" hidden>×</button>
      </div>
    </div>
    <p id="wikiSearchStatus" class="sr-only" role="status" aria-live="polite"></p>
    <div id="wikiLayout" class="wiki-layout">
      <nav id="wikiTopicMenu" class="wiki-topic-menu" aria-label="Tópicos da wiki"></nav>
      <article id="wikiTopicContent" class="wiki-topic-content" tabindex="0" aria-live="polite"></article>
    </div>
    <p id="wikiEmptyState" class="wiki-empty-state" hidden>Nenhum tópico encontrado.</p>
  </section>
  `;
}

function wikiModalTemplate() {
  return `<div class="modal-backdrop no-print" id="wikiModal" hidden>${wikiPanelTemplate()}</div>`;
}

function wikiFullPageTemplate() {
  return `<main class="wiki-page-shell">${wikiPanelTemplate({ fullPage: true })}</main>`;
}
