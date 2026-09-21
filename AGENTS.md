# Diretrizes Do Projeto

Este projeto e uma ficha editavel de Mage: The Ascension feita com HTML, CSS e JavaScript nativo. O refactor planejado deve preservar o comportamento atual, mas reorganizar os arquivos principais em modulos menores, testaveis e mais faceis de manter.

Antes de qualquer refactor funcional, consulte `testes/AGENTS.md`. O Codex nao deve executar testes; deve apenas considerar resultados de testes previamente existentes, quando houver.

## Objetivo Do Refactor

O refactor deve quebrar os arquivos principais atuais em responsabilidades claras:

- `index.html`: deve deixar de concentrar toda a estrutura visual da ficha em um unico arquivo grande.
- `app.js`: deve deixar de concentrar estado, regras, renderizacao, eventos, persistencia e integracoes externas no mesmo arquivo.

A prioridade e reduzir acoplamento sem alterar regras da ficha, formato dos JSONs, nomes de campos publicos ou fluxos de usuario.

## Estrutura Atual

- `index.html`: casca da pagina; carrega o shell visual, prompt e modulos JS em ordem.
- `app.js`: ponte de compatibilidade para ferramentas antigas; a aplicacao real fica em `scripts/`.
- `scripts/components/`: componentes e modulos visuais. O shell e composto por templates HTML em JavaScript sem build step:
  - `header-template.js`: cabecalho e acoes principais.
  - `sheet-sections.js`: identidade, saude, criacao, esferas, atributos, habilidades, antecedentes, notas, coven e linhagem.
  - `creation-world-template.js`: secao `Quem voce e no mundo`.
  - `modals-template.js`: autosave e modais.
  - `wiki-template.js`: estrutura compartilhada da wiki, reutilizada no modal e na pagina inteira.
  - `sheet-shell.js`: composicao final e `renderAppShell()`.
- `wiki.html`: pagina inteira da wiki; reutiliza o mesmo template, conteudo e comportamento do modal.
- `scripts/wiki.js`: conteudo, renderizacao, pesquisa e navegacao compartilhados da wiki.
- `scripts/wiki-page.js`: bootstrap minimo da wiki em pagina inteira.
- `scripts/integrations/`: integracoes externas e persistencia fora do fluxo principal.
- `scripts/bootstrap.js`: inicializacao e binding final da aplicacao.
- `scripts/config.js`: estado global e constantes compartilhadas.
- `scripts/state-utils.js`: helpers de estado, custos, freebies e regras compartilhadas.

## Organizacao Do HTML

O HTML deve ser separado em modulos visuais e componentes reutilizaveis.

Diretrizes:

- Componentes repetidos ou conceitualmente independentes devem sair do `index.html`.
- O `index.html` deve ficar responsavel por montar a pagina e carregar os scripts/estilos necessarios.
- Blocos grandes da ficha devem virar modulos visuais, por exemplo:
  - cabecalho e acoes principais;
  - identidade e imagem do personagem;
  - saude;
  - painel de criacao;
  - esferas e vantagens;
  - atributos;
  - habilidades;
  - notas, foco magico e laboratorio;
  - linhagem;
  - modais.
- Controles reutilizaveis devem virar componentes, por exemplo:
  - linha de bolinhas;
  - stepper numerico;
  - modal base;
  - lista de fichas;
  - seletor/upload de arquivo;
  - linha de membro da linhagem.
- Mantenha atributos de estado e seletores estaveis enquanto houver testes ou codigo dependendo deles, especialmente `id`, `data-field`, `data-dots`, `data-lineage-*` e atributos de acessibilidade.
- Nao mova texto visivel ou estrutura sem ajustar os testes funcionais correspondentes.

## Manutencao Da Wiki

A wiki integrada a ficha deve permanecer sincronizada com as regras e o conteudo da interface.

Diretrizes:

- Sempre que uma regra, definicao, campo, controle ou secao for incluida, removida ou alterada na ficha, atualize tambem o topico correspondente na wiki na mesma mudanca.
- Quando uma nova secao conceitual for criada na ficha, inclua um topico correspondente no menu da wiki, salvo quando houver uma justificativa explicita para agrupa-la em um topico existente.
- Preserve na wiki os mesmos nomes, agrupamentos e ordem conceitual apresentados na ficha. Subsecoes como categorias de Atributos e Habilidades devem refletir a organizacao visual vigente.
- Garanta que novos termos, sinonimos relevantes e descricoes possam ser encontrados pela pesquisa da wiki e que as correspondencias continuem recebendo highlight.
- Evite duplicar regras em fontes independentes quando for possivel reutilizar configuracoes ou descricoes existentes da ficha.
- Ajuda contextual de campos deve abrir o topico correspondente da wiki ao clicar, tocar ou usar o teclado sobre o nome do campo. Nao reintroduza tooltips descritivos baseados apenas em `title`; preserve `title` somente em controles de acao quando ele complementar `aria-label`.
- Toda alteracao de conteudo, navegacao ou pesquisa da wiki deve atualizar a cobertura funcional correspondente, sem executar os testes.

## Organizacao Do JavaScript

O `app.js` deve ser quebrado por funcionalidade. Cada modulo deve ter responsabilidade clara e dependencia explicita.

Diretrizes:

- Evite novo estado global espalhado. Prefira um modulo central de estado ou injeção explicita de dependencias.
- Regras puras devem ficar separadas de renderizacao e eventos de DOM.
- Funcoes de regra devem ser exportaveis/testaveis sem exigir uma pagina carregada.
- Eventos de UI devem ser registrados em modulos de binding, perto da area funcional correspondente.
- Renderizacao deve ficar separada das regras de calculo.
- Serializacao deve preservar compatibilidade com os JSONs atuais.

Separacao sugerida:

- `state.js`: estado principal, helpers de `getPath`, `setPath`, clone e reset.
- `config.js`: constantes da ficha, listas de campos, custos, niveis de saude, paths de esferas/backgrounds.
- `identity.js`: nome, cronica, experiencia/freebies e nome de arquivo.
- `dots.js`: renderizacao e interacao generica de bolinhas.
- `xp.js`: custos de XP, custos de criacao, pools, limites e freebies.
- `creation.js`: modo de criacao, prioridades, resumo e snapshot.
- `health.js`: dano, cura, normalizacao, niveis e penalidades.
- `lineage.js`: estado da linhagem, membros, XP/rating, morte, reviver e bonus herdado.
- `images.js`: upload, corte, preview, caminhos e remocao de imagem.
- `fields.js`: binding/render de campos `data-field` e steppers numericos.
- `serialization.js`: `sheetJson`, `lineageJson`, compatibilidade legado e snapshots.
- `sheets.js`: carregar ficha local/GitHub raw, manifestos e aplicacao de dados.
- `ai.js`: perguntas, prompt, preview, commit e rollback de sugestoes.
- `modals.js`: abrir/fechar modais, Escape e backdrop.
- `autosave.js`: timer, comparacao de conteudo, feedback e reenvio.
- `app.js`: bootstrap/orquestracao, idealmente pequeno.

Essa lista e uma direcao, nao uma obrigacao rigida de nomes. Se a estrutura final usar nomes diferentes, mantenha a mesma separacao de responsabilidades.

## Integracoes Externas

Qualquer integracao externa deve ser centralizada em arquivos `.js` separados do fluxo principal da ficha.

Diretrizes:

- GitHub deve ficar isolado em modulo proprio, por exemplo `integrations/github.js` ou `github.js`.
- File System Access API deve ficar isolada em modulo proprio, por exemplo `integrations/local-files.js`.
- Clipboard deve ficar atras de uma funcao pequena e mockavel.
- Fetch de manifestos/fichas remotas deve ficar em camada propria, sem espalhar URLs e chamadas pela UI.
- Modulos de integracao devem expor funcoes pequenas, com entradas e saidas claras.
- UI nao deve montar manualmente detalhes da API externa quando puder chamar uma funcao de servico.
- Tokens, PATs e dados sensiveis nunca devem ser persistidos. A regra atual do GitHub continua valendo: salvar apenas usuario, repositorio, branch e pasta; nao salvar PAT.

## Contratos Que Nao Devem Quebrar Sem Migração

Preserve estes contratos durante o refactor:

- Formato dos JSONs das fichas.
- Formato dos JSONs de linhagem.
- Formato do JSON global do coven em `fichas/coven.json`, incluindo o lock de edicao com expiracao maxima de 10 minutos.
- Campos `identity`, `attributes`, `abilities`, `spheres`, `advantages`, `backgrounds`, `backgroundJustifications`, `aspirations`, `obsession`, `world`, `health`, `creation`, `creationSnapshot`, `ai`.
- Compatibilidade com `health.level` legado.
- Compatibilidade com linhagem embutida legada em `state.lineage`.
- Manifestos `fichas/index.json` e `fichas/linhagens/index.json`.
- Caminhos de imagem em `imagens/*.png|jpg`.
- Nomes de arquivos gerados por `snake_case`.
- Fluxos de salvar local, upload GitHub, autosave, preview de IA, morte/reviver linhagem e bonus de linhagem.
- Fluxo read-only do coven, aquisicao/verificacao/liberacao do lock e sincronizacao do arquivo global.
- Inventario da despensa do coven com 16 slots, metadados no JSON global e imagens separadas em `fichas/imagens/coven/`.
- Fama do coven persistida como nivel de 0 a 6, com classificacao e descricao apresentadas na interface.
- `obolOfTheDead` persiste o valor numerico do dinheiro compartilhado do coven, exibido como `Óbolo dos Mortos`.
- Layout do coven em duas linhas: Recursos e Despensa em colunas na primeira, Laboratorio ocupando a segunda; no mobile, as colunas devem ser empilhadas.
- A seção Anotacoes ocupa toda a largura e aparece imediatamente abaixo do coven. Paradigma, Foco e Instrumentos nao possui mais painel proprio na ficha.
- O nome do coven e persistido em `name` no arquivo global e aparece no topo da subseção Recursos.
- Quintessencia e Paradoxo do coven sao transferidos da ficha: 2 Quintessencias do personagem geram 1 no coven; 1 Paradoxo do personagem gera 2 no coven. Ambos os recursos do personagem tem limite 10; o coven nao tem limite.
- Ao atingir 10 minutos, a edicao do coven deve salvar automaticamente, remover o lock quando ainda pertencer a sessao e voltar ao modo somente leitura. Em caso de falha, deve pausar a edicao e informar que o salvamento falhou.

Se algum contrato precisar mudar, implemente migracao e testes antes de alterar o formato persistido.

## Antecedentes Na Criacao

A criacao de personagem usa 7 pontos iniciais de Antecedentes. Nenhum Antecedente deve comecar acima de 3 pontos, salvo regra futura explicita da cronica. Pontos acima do pool inicial custam 1 Freebie por ponto. A secao de Antecedentes deve aparecer logo abaixo da secao de Habilidades.

Depois da criacao, Antecedentes nao sao compraveis por XP e suas bolinhas devem ficar bloqueadas no modo de edicao normal. A secao de Antecedentes nao deve aparecer na ficha principal de um personagem ja criado; os Antecedentes devem ficar em um modal aberto por um botao ao lado do campo `Cronica` na identidade. Apenas os textos de justificativa continuam editaveis quando o Antecedente tiver pelo menos 1 ponto.

Cada Antecedente com pelo menos 1 ponto deve mostrar uma justificativa textual abaixo da linha de bolinhas. Os pontos continuam em `backgrounds.*`; as justificativas devem ser persistidas separadamente em `backgroundJustifications.*` para preservar os valores numericos existentes.

A area de Antecedentes tambem deve exibir campos livres editaveis para Aspirações (`aspirations`) e Obsessão / vício (`obsession`). Aspirações usa a descricao de hover "coisas que a bruxa deseja a curto prazo"; Obsessão / vício usa "coisas que a bruxa anseia de forma compulsiva a longo prazo". Esses campos aparecem na secao de criacao e no modal de personagem ja criado, e devem entrar em `creationSnapshot`.

A secao `Quem voce e no mundo` deve aparecer na criacao e, depois que o personagem ja foi criado, seus campos devem ficar disponiveis em uma segunda aba dentro do modal de Antecedentes. As respostas usam `world.magic.*` e `world.reality.*` e devem continuar editaveis no modal.

Antecedentes disponiveis na UI, em ordem alfabetica e com nomes em portugues:

- Aliados (`backgrounds.allies`)
- Apoio (`backgrounds.backup`)
- Contatos (`backgrounds.contacts`)
- Espioes (`backgrounds.spies`)
- Fama (`backgrounds.fame`)
- Influencia (`backgrounds.influence`)
- Maravilha (`backgrounds.wonder`)
- Mentor (`backgrounds.mentor`)
- Patrono (`backgrounds.patron`)
- Recursos (`backgrounds.resources`)
- Refugio (`backgrounds.sanctum`)
- Sonho (`backgrounds.dream`)
- Vidas Passadas (`backgrounds.pastLives`)

## Diretrizes De Teste Para Refactor

- O Codex nao deve executar testes, servidores de teste ou runners automatizados.
- Antes de mover codigo, consulte os testes existentes relevantes e resultados previamente registrados, quando houver.
- Ao extrair uma regra para modulo proprio, adicione ou mova testes unitarios para cobrir essa regra diretamente.
- Ao extrair UI/componente, mantenha ou adicione teste funcional para o fluxo do usuario.
- Alteracao pequena/local: atualize os testes relacionados ao local alterado. Se ainda nao existirem testes para cobrir, crie cobertura automatizada de pelo menos 90% do codigo afetado, sem executa-la.
- Alteracao major: atualize a cobertura de todas as suites em `testes/index.html`, sem executa-las.
- O refactor so deve ser considerado concluido quando os fluxos listados em `testes/AGENTS.md` tiverem cobertura compativel com o novo contrato. Resultados existentes podem ser considerados, mas nao devem ser gerados pelo Codex.

## Estilo De Implementacao

- Prefira mudancas pequenas e verificaveis.
- Mova codigo antes de reescrever comportamento.
- Evite misturar refactor estrutural com mudanca de regra.
- Preserve nomes publicos ate que os testes estejam adaptados.
- Mantenha comentarios apenas onde a regra nao for obvia.
- Nao introduza framework ou build step sem necessidade clara.
- Se for introduzido um runner ou bundler, documente o comando aqui e em `testes/AGENTS.md`.
