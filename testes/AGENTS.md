# Guia De Testes

Esta pasta concentra os testes automatizados da ficha de Mage: The Ascension.

- `unitarios/`: testes de regras puras, normalizacao de dados, calculos e serializacao.
- `funcionais/`: testes de fluxos de usuario no navegador, integracao entre UI, estado e persistencia.
- `test-harness.js`: runner minimo usado pelas suites.
- `testes.css`: estilos dos runners.

## Como Rodar

O Codex nao deve executar estes testes, iniciar o servidor de testes ou abrir os runners. Ele pode consultar e atualizar a cobertura e considerar resultados previamente gerados, quando existirem. A execucao fica a cargo de uma pessoa.

Este projeto ainda nao usa dependencias de build/teste. Os testes rodam direto no navegador, como o proprio app.

Abra:

- `testes/unitarios/index.html` para rodar a suite unitaria.
- `testes/funcionais/index.html` para rodar a suite funcional.
- `testes/index.html` para rodar todas as suites.

O resultado aparece no topo da pagina. O titulo da aba tambem muda para `PASS ...` ou `FAIL ...`.

Para gerar um arquivo de log que possa ser lido depois por agentes/codigo, rode o servidor de testes a partir da raiz do projeto:

```powershell
python testes/serve-tests.py
```

Depois abra `http://127.0.0.1:8765/testes/index.html`. Ao concluir, o runner grava `testes/test-results.json`. Se a pagina for aberta por `file://` ou por outro servidor estatico, o log ainda aparece na tela, fica em `localStorage` e pode ser baixado pelo link `Baixar log`.

Regra geral:

- Alteracao pequena/local: rode apenas os testes relacionados ao local alterado. Se ainda nao existirem testes que cubram esse comportamento, crie cobertura automatizada para pelo menos 90% do codigo.
- Alteracao major: rode todos os testes unitarios e funcionais.
- Correcao de bug: adicione primeiro um teste que falhe com o bug atual, depois implemente a correcao e rode os testes relacionados.
- Mudanca em regra compartilhada, serializacao, salvamento, carregamento, linhagem, XP/freebies ou integracao de IA: trate como alteracao de risco ampliado e rode tambem os fluxos funcionais principais.

## Fluxos Da Ficha

### Inicializacao

A ficha deve renderizar a UI principal sem erro: campos de identidade, controles de saude, bolinhas de atributos, habilidades, esferas, vantagens, paineis de linhagem, modais e acoes principais. As bolinhas devem iniciar bloqueadas fora do modo de edicao, a saude deve iniciar sem dano e os campos numericos devem ter defaults consistentes.

### Identidade

Inclui nome do personagem, cronica e experiencia/freebies. O nome e obrigatorio para salvar ou enviar ao GitHub. O nome tambem define o titulo da ficha e o arquivo em `snake_case`, removendo acentos e caracteres especiais.

### Imagem Do Personagem

Inclui upload, validacao de tipo de arquivo, corte quadrado, preview, persistencia em `identity.image`, remocao por modal de confirmacao, escrita local/GitHub e remocao da imagem antiga quando houver substituicao.

### Campos Livres

Inclui notas, foco magico e laboratorio. Os campos devem atualizar o estado conforme o usuario digita, carregar corretamente a partir de JSON e manter textos longos e quebras de linha na serializacao.

### Bolinhas E Edicao De Niveis

Inclui atributos, habilidades, esferas, Arcana e Forca de Vontade. Fora do modo de edicao, bolinhas nao alteram estado. No modo de edicao, clique aumenta ou reduz niveis, calcula custo, consome ou devolve XP e respeita maximos. Antecedentes sao editaveis somente durante a criacao; depois da criacao, as bolinhas de Antecedentes ficam bloqueadas e nao consomem XP.

### Custos De XP

Custos atuais:

- Atributos: `4 * nivel comprado`.
- Habilidades: `2 * nivel comprado`.
- Antecedentes: `1 * nivel comprado`.
- Esferas: `7 * nivel comprado`.
- Arcana: `8 * nivel comprado`.
- Forca de Vontade: `1 * nivel comprado`.

Os testes unitarios devem cobrir aumento, reducao, custo zero, maximo e XP insuficiente.

### Criacao De Personagem

Novo personagem entra em modo de criacao, usa `Freebies` no lugar de experiencia, inicia com 15 freebies, atributos em 0, Arcana em 1, demais niveis em 0 e saude limpa. O painel de prioridades deve aparecer e o resumo deve refletir pools e gastos. Durante a criacao, as secoes Anotacoes, Paradigma/Foco/Instrumentos e Coven devem ficar ocultas.

A criacao deve exibir a secao `Quem voce e no mundo`, em duas colunas: `Como lida com magia` e `Como lida com a realidade`. Cada coluna possui perguntas com campos de texto curto, persistidos em `world.magic.*` e `world.reality.*`, e incluidos em `creationSnapshot.world`. Depois da criacao, esses campos devem aparecer em uma segunda aba dentro do modal de Antecedentes.

### Prioridades De Criacao

Inclui prioridades primaria, secundaria e terciaria para atributos e habilidades. Os selects nao devem permitir duplicidade efetiva. Orcamentos atuais:

- Atributos: 7, 5 e 3.
- Habilidades: 13, 9 e 5.

Mudancas de prioridade devem sincronizar `state.creation`, recalcular freebies e atualizar o resumo.

### Antecedentes Na Criacao

Durante a criacao, inclui a secao de Antecedentes logo abaixo de Habilidades, com os nomes traduzidos para portugues e ordenados alfabeticamente: Aliados, Apoio, Contatos, Espioes, Fama, Influencia, Maravilha, Mentor, Patrono, Recursos, Refugio, Sonho e Vidas Passadas. Depois da criacao, essa secao deve ficar oculta na ficha principal; os Antecedentes devem ser exibidos em um modal aberto por botao ao lado de `Cronica`. A UI deve renderizar bolinhas para cada Antecedente, usar o campo persistido `backgrounds.*` correspondente e manter descricoes de ajuda coerentes.

Cada Antecedente com pelo menos 1 ponto deve abrir um campo de justificativa abaixo da linha. O texto deve atualizar `backgroundJustifications.*`, continuar no estado/JSON mesmo se os pontos voltarem a 0, ser incluido em `creationSnapshot.backgroundJustifications` e respeitar o bloqueio de preview de IA.

A area de Antecedentes tambem deve exibir campos livres editaveis para Aspirações (`aspirations`) e Obsessão / vício (`obsession`), tanto na secao de criacao quanto no modal de personagem criado. Os hovers devem ser, respectivamente, "coisas que a bruxa deseja a curto prazo" e "coisas que a bruxa anseia de forma compulsiva a longo prazo". Esses campos devem persistir no JSON e em `creationSnapshot`.

### Limites E Freebies Na Criacao

Esferas nao podem exceder Arcana. Arcana nao pode cair abaixo da maior esfera comprada. O pool compartilhado de Arcana, Esferas e Forca de Vontade tem 6 pontos iniciais. Antecedentes tem 7 pontos iniciais, nenhum Antecedente pode comecar acima de 3 pontos e gastos acima do pool inicial devem consumir 1 Freebie por ponto.

### Saude

Inclui dano contusivo `/`, letal `X` e agravado `*`, ordenados por severidade. A ficha deve aplicar dano, curar por tipo, limitar a 7 caixas, atualizar nivel de saude, penalidade de dados, estado incapacitado e compatibilidade com o formato legado baseado em `health.level`.

### Linhagem

Inclui nome da linhagem, arquivo em `linhagens/nome.json`, membros, cronica do membro, status vivo/morto e persistencia separada da ficha. A ficha deve bloquear salvamento de linhagem com dados mas sem nome.

### Coven

O coven usa o arquivo global `fichas/coven.json`, compartilhado por todos os personagens, e nao deve ser serializado dentro da ficha. A secao inicia somente leitura. A edicao exige autosave/GitHub ativo, releitura do arquivo remoto e aquisicao de um lock no proprio JSON com expiracao maxima de 10 minutos. Um lock ativo de outra sessao bloqueia a edicao. Ao concluir, os dados devem ser salvos, o lock removido e a secao deve voltar a somente leitura. Autosaves durante a edicao devem preservar e validar o lock antes de escrever.

A subseção Despensa possui exatamente 16 slots quadrados. Slots vazios só podem criar itens durante a edição do coven. Cada item persiste nome, descrição e caminhos das imagens no JSON; as imagens devem ser enviadas separadamente para `imagens/coven/` antes do JSON. Itens ocupados exibem imagem e nome e abrem um modal com todas as informações, inclusive em modo somente leitura. Durante a edição, o modal permite excluir o item após confirmação. Itens importados preservam `inventoryId` e podem ser usados uma única vez: antes da confirmação, um resumo apresenta os efeitos relidos de `itens.json`; cada efeito que atender ao próprio nível mínimo é aplicado e limitado ao máximo configurado, enquanto efeitos sem o requisito são ignorados sem bloquear os demais. Ao confirmar, o item persiste `used: true`; efeitos de Esfera não são copiados para o JSON do coven. Criar, alterar, excluir ou consumir um item dispara salvamento automático do coven, preservando o lock e mantendo a edição ativa; os salvamentos devem ser serializados para evitar sobrescritas.

A Fama do coven deve persistir um nível numérico entre 0 e 6. A interface deve mostrar a classificação correspondente e disponibilizar a descrição completa do nível selecionado, inclusive em modo somente leitura.

O campo numérico `obolOfTheDead`, exibido como `Óbolo dos Mortos`, representa o dinheiro compartilhado do coven, não aceita valores negativos e obedece ao bloqueio geral de edição da seção.

Quintessência e Paradoxo do coven só mudam por transferência da ficha ativa: 2 pontos de Quintessência do personagem equivalem a 1 no coven, e 1 ponto de Paradoxo do personagem equivale a 2 no coven. A devolução usa a proporção inversa. Quintessência e Paradoxo do personagem ficam limitados ao intervalo de 0 a 10; os totais do coven não possuem máximo.

Ao atingir a expiração de 10 minutos, a sessão deve tentar salvar automaticamente o coven e suas imagens pendentes, remover seu lock e voltar ao modo somente leitura. Se o salvamento falhar ou o lock já tiver mudado, a edição ainda deve ser pausada e a falha deve ser informada sem sobrescrever o lock de outra sessão.

### XP E Rating Da Linhagem

Inclui conversao entre rating e XP, suporte a rating fracionario, suporte legado, render de bolinhas parciais e exibicao de XP formatado. Quando `sphereExperience` existir, ele deve ser a fonte principal e sincronizar `spheres`.

### Morte E Heranca Da Linhagem

Ao confirmar morte de um membro, a ficha do personagem deve ser buscada no GitHub, o XP ganho depois da criacao deve ser calculado, metade deve ser transferida para a linhagem e a contribuicao deve ficar registrada no membro. Reviver um membro deve remover exatamente a contribuicao registrada.

### Bonus De Linhagem Na Criacao

O botao de herdar esferas da linhagem so deve ficar disponivel no modo de criacao, com pool inicial concluido, freebies zerados, linhagem carregada e XP suficiente. A aplicacao deve aumentar esferas ate o nivel compravel, registrar `creation.lineageSphereBonus` e nao duplicar bonus em aplicacoes futuras.

### Carregamento De Fichas

Inclui carregar JSON local, carregar lista local via `fichas/index.json`, carregar do GitHub raw e carregar linhagem associada. Deve normalizar manifestos com strings ou objetos, lidar com JSON invalido, falha de rede/manifesto e migrar o formato legado de linhagem embutida.

### Salvamento Local

Inclui File System Access API, fallback por download, escrita de JSON da ficha, escrita de linhagem, escrita/remocao de imagem e atualizacao de `fichas/index.json`. AbortError do seletor de pasta nao deve disparar download.

### Upload Para GitHub

Inclui modal de credenciais, validacao de repositorio, Contents API, upsert de ficha, upsert de linhagem, upsert/remocao de imagem, remocao de arquivo antigo ao renomear ficha e atualizacao de manifestos. Usuario, repositorio, branch e pasta podem ser salvos no `localStorage`; PAT nao deve ser persistido.

### Autosave

Autosave e ativado apos upload manual para GitHub. Deve mostrar countdown, comparar conteudo atual com o ultimo salvo, evitar envio quando nada mudou, enviar ficha/linhagem/imagem quando houver mudanca, mostrar feedback e reagendar apos sucesso ou erro.

### Integracao De IA

Inclui perguntas salvas em `state.ai`, geracao de prompt via `window.aiPromptTemplate`, copia para clipboard, recebimento de JSON, extracao de JSON em texto livre ou bloco fenced, preview, confirmacao e rollback. Durante preview, salvar/GitHub devem ficar ocultos e campos, bolinhas, steppers e saude devem ficar bloqueados.

### Serializacao E Compatibilidade

`sheetJson` deve normalizar saude, garantir defaults numericos, garantir `creationSnapshot`, sincronizar `identity.lineage`, remover `state.lineage` legado e produzir JSON parseavel. `lineageJson` deve incluir nome, esferas, XP por esfera e membros filtrados com status e contribuicoes.

### Modais E Navegacao

Inclui modal inicial, fichas, Antecedentes, GitHub, IA, carregar linhagem, morte, reviver, remover imagem, item da despensa e wiki. Todos devem fechar por botão explícito e Escape. Cliques no backdrop não devem fechar nenhum modal, para evitar perda acidental de dados preenchidos. Cancelamentos devem limpar estados pendentes. A wiki deve reutilizar o mesmo template, conteúdo, pesquisa e navegação no modal e em `wiki.html`; o modal da wiki e o modal inicial devem oferecer acesso à página inteira em uma nova aba.

### Acessibilidade E Estado Visual

Inclui `aria-label`, `role=checkbox`, `aria-checked`, estados disabled, classes de sugestao da IA e classes de bonus de linhagem. Mudancas funcionais devem preservar sinais visuais e atributos acessiveis que comunicam estado. Nomes de campos com ajuda contextual devem abrir o topico correspondente da wiki por clique, toque, Enter ou Espaco, sem depender de tooltip `title`.
