# Ficha Editavel - Mage: The Ascension

Projeto HTML + CSS + JavaScript nativo, pronto para rodar no GitHub Pages.

## Como usar

1. Abra `index.html` localmente ou publique a pasta no GitHub Pages.
2. Escolha criar um novo personagem, carregar da pasta `fichas` no GitHub ou carregar um JSON do computador.
4. Clique no icone de upload para abrir o modal de fichas.
5. Clique no icone de salvar para salvar a ficha atual na pasta `fichas`.
6. Clique no icone de envio para GitHub para subir a ficha diretamente para um repositorio.

O campo `Nome` do personagem e obrigatorio para salvar localmente ou enviar para o GitHub.

Para fichas novas, o arquivo e criado como `nome_do_personagem.json`, em snake_case minusculo. Para fichas carregadas pelo modal, o mesmo arquivo JSON e atualizado.

## Estrutura visual

O `index.html` carrega templates HTML em `scripts/components/` antes de iniciar a aplicacao. O arquivo `scripts/components/sheet-shell.js` apenas compoe esses templates e injeta o shell visual; os blocos editaveis ficam separados em `header-template.js`, `sheet-sections.js`, `creation-world-template.js` e `modals-template.js`.

## Criacao de personagem

Ao criar um personagem novo, o campo de experiencia vira `Freebies` e comeca em 15. O app habilita os controles de prioridades de Atributos e Habilidades, inicia Atributos em 0, aplica os pontos iniciais de Arcana e Saude, e calcula custos de compra por prioridade, pontos iniciais e Freebies.

Durante a criacao, a ficha mostra apenas as areas necessarias para distribuir pontos e definir conceitos iniciais. Anotacoes, Paradigma/Foco/Instrumentos e Coven ficam ocultos ate a criacao terminar.

O botão com ícone de check conclui a criação. Antes de pedir confirmação, ele verifica se todos os pontos de Atributos, Habilidades, Antecedentes, Arcana/Esferas/Força de Vontade e Freebies foram gastos. Se houver pontos restantes, um aviso informa quais pools ainda estão incompletos. Ao confirmar a conclusão, a ficha registra o snapshot de criação e passa ao modo normal de edição.

A secao `Quem voce e no mundo` aparece durante a criacao com duas colunas de perguntas: `Como lida com magia` e `Como lida com a realidade`. As respostas sao salvas em `world.magic.*` e `world.reality.*`. Depois da criacao, esses campos ficam disponiveis em uma segunda aba dentro do modal de Antecedentes.

Antecedentes usam pontos de bolinha e tambem entram no calculo de criacao. Durante a criacao, o personagem recebe 7 pontos de Antecedentes para distribuir livremente; nenhum Antecedente pode comecar acima de 3 pontos. Pontos acima do pool inicial custam 1 Freebie por ponto.

Quando um Antecedente tem pelo menos 1 ponto, a ficha abre um campo de justificativa abaixo dele para explicar de onde aquele recurso veio. Esses textos sao salvos em `backgroundJustifications`, separados dos valores numericos de `backgrounds`.

Na area de Antecedentes, a ficha tambem registra `origin`, `aspirations` e `obsession`: Origem descreve a história e as circunstâncias da personagem, Aspirações descrevem coisas que a bruxa deseja a curto prazo, e Obsessão / vício descreve coisas que a bruxa anseia de forma compulsiva a longo prazo.

Depois que a criacao termina, os pontos de Antecedentes ficam bloqueados: eles nao podem ser aumentados ou reduzidos por XP no modo de edicao. A secao de Antecedentes sai da ficha principal e passa a ser acessada por um botao ao lado de `Cronica`, abrindo um modal. As justificativas continuam editaveis para detalhar os Antecedentes ja comprados.

Antecedentes disponiveis, em ordem alfabetica:

- Aliados: amigos e aliados mundanos que ajudam o personagem.
- Apoio: apoio de uma organizacao.
- Contatos: fontes de informacao.
- Espioes: rede de informantes.
- Fama: fama publica.
- Influencia: poder sobre instituicoes e grupos.
- Maravilha: artefato magico significativo.
- Mentor: professor ou guia experiente.
- Patrono: um protetor poderoso.
- Recursos: dinheiro e patrimonio.
- Refugio: refugio ou base.
- Sonho: ligacao com sonhos, visoes e o inconsciente coletivo.
- Vidas Passadas: conhecimento de vidas passadas.

No GitHub Pages, o navegador nao consegue gravar diretamente no repositorio hospedado. O app usa a File System Access API para gravar em uma pasta local `fichas`; na primeira vez, o navegador pode pedir permissao para essa pasta. Depois disso, a permissao fica salva no navegador e o botao de salvar atualiza/cria o JSON automaticamente.

## Upload para GitHub

O botao de envio abre um modal que exige usuario GitHub e PAT para autenticar a chamada para a API do GitHub. O repositorio padrao e `jogatina-pesada/mage-ascension`, e tambem e possivel informar branch e pasta das fichas.

O PAT precisa ter permissao de escrita no repositorio. Para tokens fine-grained, conceda acesso ao repositorio escolhido com `Contents: Read and write`. O PAT nao e salvo no navegador; apenas usuario, repositorio, branch e pasta ficam guardados para preencher o modal na proxima vez.

Durante o upload, o app cria ou atualiza `fichas/nome_da_ficha.json` e tambem atualiza `fichas/index.json` para que a ficha apareca no modal de carregamento.

Depois do primeiro envio manual para o GitHub, o app ativa autosave a cada 15 minutos enquanto a pagina estiver aberta. O PAT fica apenas em memoria nessa sessao e o envio automatico so acontece quando houver mudanca real no JSON da ficha.

## Prompt de IA

O botao de integracao de IA ao lado de experiencia/freebies abre um modal com cinco perguntas sobre a evolucao do personagem. Ao clicar em `Gerar prompt`, o app usa o template carregado por `prompt.js`, substitui os campos `{{RESPOSTA_1}}` a `{{RESPOSTA_5}}` e inclui `{{JSON_DA_FICHA_ATUAL}}` com a ficha atual, pronta para copiar em um chat de IA generico.

As respostas ficam armazenadas em `ai` dentro dos dados da ficha e so sao persistidas quando a ficha for salva localmente ou enviada para o GitHub.

Para funcionar no GitHub Pages, mantenha `prompt.js` publicado na raiz do projeto junto com `index.html`. O arquivo deve definir `window.aiPromptTemplate`.

Nao usa frameworks, build ou dependencias externas.

## Migração para ChatGPT Sites (em validação)

O GitHub existente permanece a fonte principal. O Site privado registrado ainda **não foi publicado**. Consulte `docs/sites-migration.md` para auditoria, decisões, resultados e bloqueios. Os dados reais ainda não foram enviados ao Sites.

### Execução e debug local

A aplicação original continua sem dependências: abra `index.html` ou sirva a pasta com `python -m http.server 8000 --bind 127.0.0.1`. O modo original mantém suas integrações anteriores; não use PAT para validar o novo modo Sites.

O backend e o build novo exigem Node.js 24 (SQLite nativo, sem instalar pacotes):

```sh
node sites/scripts/build.mjs
node sites/scripts/dev.mjs
```

Acesse `http://127.0.0.1:8787`. Para debug: `node --inspect sites/scripts/dev.mjs`; use também o console e a aba Network do navegador. O build inclui somente HTML/CSS/JS e assets de interface no Worker. Não copia registros nem imagens privadas para assets públicos.

O servidor local remove headers de identidade recebidos e retorna 401 para APIs protegidas. Ele permite editar/importar/exportar offline, mas **não simula Entrar com ChatGPT**. O login real pertence à infraestrutura Sites. Dados locais de desenvolvimento ficam em `work/mage-local.sqlite`, ignorado pelo Git. Não há segredo de autenticação no frontend.

### Testes

O pedido explícito desta migração autoriza executar testes, prevalecendo sobre a proibição histórica nos AGENTS.md. Sem essa autorização em tarefas futuras, observe as instruções locais aplicáveis.

```sh
node testes/sites/server.test.mjs
node sites/scripts/build.mjs
node testes/sites/browser.mjs
```

O teste de navegador usa Playwright e Chromium como ferramentas de desenvolvimento, sem dependência de runtime. Configure `PLAYWRIGHT_MODULE` com o caminho de uma instalação local de Playwright e `CHROMIUM_PATH` com o executável Chromium quando os caminhos do ambiente não existirem. O servidor com identidade fictícia existe somente nesse teste e não é empacotado.

As suites originais continuam em `testes/index.html`: execute `python testes/serve-tests.py`, abra `http://127.0.0.1:8765/testes/index.html` e consulte `testes/test-results.json`. As correções do harness e de asserções antigas não mudam regras da aplicação.

### Permissões e sessões

Configure `MAGE_BOOTSTRAP_ADMIN_EMAIL` exclusivamente no runtime do Sites com o e-mail da proprietária confirmado no painel. O primeiro login correspondente vincula esse e-mail ao ID estável deste Site. Remova a configuração de bootstrap depois de confirmar o cadastro. Mantenha o Site privado; nenhum jogador foi convidado automaticamente.

`GET /api/session` informa o ID da sessão e o papel cadastrado. IDs do painel de compartilhamento não devem ser usados como IDs de sessão sem confirmação. Somente o narrador pode usar `POST /api/members` com `{id,email,role:"player"}`; `active:false` revoga acesso sem apagar fichas. `POST /api/access` recebe `{path,userId,permission:"read"|"write"|"remove"}` para compartilhamento explícito. Imagens privadas exigem permissão própria ao compartilhar uma ficha; não se concede acesso a uma imagem apenas porque seu caminho foi inserido em um JSON. Não há tela nova de administração; essas operações são APIs autenticadas.

Os campos ownerId/listName do cliente não substituem autorização. Cada operação consulta associação e permissões no servidor. O papel admin pode gerenciar todos os registros; jogador lê/escreve somente registros próprios ou compartilhados, e pode editar coven com lock válido. O catálogo é editável pelo narrador. Listas organizam personagens; suas senhas antigas não concedem acesso no Sites.

Em 401, exporte o rascunho antes de entrar novamente. Em 409, exporte as alterações, recarregue a versão salva e reconcilie o conteúdo. A aplicação não sobrescreve automaticamente um conflito. Renomeações mantêm compatibilidade com nomes de arquivos; limpeza de referências antigas ocorre após salvar os novos documentos e pode exigir ação do narrador se não houver permissão sobre todas as referências.

### Migração, backup e restauração

Prepare um mapa privado em `work/owners.json`, com `adminId` do Site de destino, `byPath` associando caminhos a IDs e, opcionalmente, `access` com `{path,user_id,permission}`. Caminhos sem associação ficam com o narrador. Confirme esse mapa com os responsáveis antes de aplicar.

```sh
node sites/scripts/prepare-import.mjs --owners work/owners.json
node sites/scripts/prepare-import.mjs --owners work/owners.json --output work/import.json
```

O primeiro comando somente valida. O segundo cria um arquivo novo, privado, e falha se o destino já existir. Nenhum comando acima envia dados. Cadastre membros no backend antes de importar. Em sessão autenticada de narrador, `POST /api/restore` com o arquivo preparado faz dry-run; só `apply:true` aplica o lote. Repetições pulam documentos idênticos e recusam sobrescrever documentos divergentes. O backup preserva bytes do JSON e imagens, sem normalização pela UI.

`GET /api/backup` exporta os registros e permissões, somente para narrador. Guarde fora do repositório e dos assets públicos. A restauração insere registros ausentes; recuperar sobre registros existentes exige revisão, backup atual e exclusão explícita com a versão lida, seguida de restauração. Não restaure membros/IDs de outro Site automaticamente: IDs de usuário são específicos de cada Site. Fichas podem ser importadas/exportadas individualmente pela interface como antes.

### Build, publicação e rollback

`node sites/scripts/build.mjs` gera `dist/server/index.js`, um Worker ES module com fetch, conforme o formato suportado pelo Sites. `.openai/hosting.json` guarda a identidade do Site; `origin` continua apontando para o GitHub. O repositório técnico Sites é apenas espelho autorizado.

**Deploy ainda bloqueado:** o ambiente não disponibiliza os helpers Sites de lifecycle nem o contrato completo dos metadados D1/migrations para este Worker. Os bindings estão null deliberadamente; não há banco hospedado validado. `sites/server/schema.sql` é o schema local idempotente, não uma migration hospedada já registrada. Quando o tooling estiver disponível, configurar binding DB e migrations pelo fluxo suportado, validar em D1 real, sincronizar o commit exato para o espelho e salvar uma versão **sem deploy**. Não executar comandos genéricos `wrangler deploy` nem criar infraestrutura fora do Sites para contornar o bloqueio.

Após testes locais e hospedados, revisão das permissões e aprovação explícita do usuário, publicar a versão salva pela ferramenta Sites. Nenhuma URL é anunciada como ativa antes do retorno de sucesso da publicação. A URL e os identificadores da versão/deployment devem ser registrados em `docs/sites-migration.md` nesse momento.

A tag `pre-sites-migration` aponta para o commit anterior à migração. Para inspecionar sem perder alterações:

```sh
git worktree add --detach ../mage-pre-sites pre-sites-migration
```

Para rollback futuro de publicação, reimplante uma versão salva anterior no mesmo Site. Se for necessário voltar ao GitHub Pages, ele permanece disponível até o aceite. Para rollback de código, reverta os commits de migração na branch de trabalho. Rollback de código não restaura banco: preserve backup e estado de migrations antes de qualquer deploy. Migrations aplicadas devem permanecer imutáveis; mudanças posteriores exigem nova migration compatível com a versão anterior.
