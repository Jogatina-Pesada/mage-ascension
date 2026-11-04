# Migração para ChatGPT Sites

Auditoria em 2026-11-04. Estado: fase 1 concluída; fase 2 com decisão arquitetural pendente. Nenhuma publicação, registro de Site, alteração de produção ou migração de dados executada.

## 1. Origem e rollback

- Repositório existente: https://github.com/Jogatina-Pesada/mage-ascension.git (origin preservado).
- Commit auditado: `63d98dcfb7c7034652d4213b6d51d5b07f9e44c8`.
- Tag local: `pre-sites-migration`, apontando para esse commit.
- Branch local: `feature/chatgpt-sites-migration`.
- Checkout inicialmente limpo. Não foi criado outro repositório.
- Tag e branch ainda não enviadas ao GitHub; acesso remoto de escrita não foi validado.
- Para consultar a versão anterior sem alterar a branch: `git worktree add --detach ../mage-pre-sites pre-sites-migration`.
- Futuro rollback de código: reverter commits de migração na branch correspondente. Rollback de publicação exige restaurar a versão anterior na hospedagem; preservar GitHub Pages até aceite. Rollback de dados exige backup separado: voltar código não desfaz alterações no banco.

## 2. Arquitetura existente

Aplicação estática HTML/CSS/JavaScript clássico, sem package.json, dependências instaláveis, bundler, backend ou workflow CI versionado. Não há configuração Sites existente. `index.html` carrega templates, estado e módulos em ordem; funções e variáveis compartilham o escopo global. `app.js` é uma ponte de compatibilidade. Introduzir framework no frontend não é necessário.

| Área | Arquivos e comportamento |
| --- | --- |
| Interface | `scripts/components/*`, `style.css`; shell montado em runtime, modais, campos e controles acessíveis |
| Estado e regras | `scripts/config.js`, `state-utils.js`, `dots.js`; prioridades, custos incrementais/devolução, limites, XP e freebies |
| Identidade e criação | `sheet-loading-creation.js`, `health-fields.js`; nome, crônica, imagem, criação/conclusão, snapshot, campos livres |
| Atributos/habilidades/esferas | bolinhas bloqueadas fora da edição; compras e devoluções; esferas limitadas por Arcana na criação |
| Antecedentes | pool inicial 7, máximo 3 na criação, excedente em freebies; justificativas, origem, aspirações, obsessão, perguntas sobre magia/realidade; modal após criação |
| Saúde | sete caixas, dano contusivo/letal/agravado, cura, penalidades e compatibilidade health.level |
| Linhagem | `lineage.js`, `github-sync.js`; JSON separado, XP/rating fracionário, membros, morte/herança, reviver, bônus na criação e sincronização |
| Coven | `coven.js`; arquivo global, lock por sessão até dez minutos, leitura/edição, recursos, fama 0–6, óbolo, laboratório, transferências e despensa com 16 slots/imagens |
| Imagens | `character-image.js`, integrações; upload, corte quadrado, preview, substituição/remoção, arquivos separados |
| Itens | `itens.html`, `itens.css`, `itens.json`, `scripts/items-inventory.js`, `fichas/itens.json`; catálogo, inventário e consumo com efeitos/requisitos |
| IA | `ai.js`, `prompt.js`; perguntas, prompt/copiar, extração de JSON, preview bloqueado, confirmação/rollback; não é uma chamada a um provedor de IA |
| Wiki/impressão | `wiki.html`, `wiki.js`, `wiki-page.js`, templates e `printing.js`; pesquisa, navegação, ajuda contextual e impressão |
| Persistência | `sheets-serialization.js`, `integrations/local-files.js`, `integrations/github.js`, `github-ui.js`, `autosave.js`, `character-lists.js` |

## 3. Persistência e segurança existentes

- File System Access API com handle em IndexedDB; exportação por download como fallback; importação JSON local e carregamento por manifestos/URLs.
- GitHub Contents API com PAT informado na interface e mantido em memória para autosave. `github-ui.js` persiste apenas usuário no localStorage; PAT não deve migrar para o novo cliente.
- Autosave depende do envio GitHub manual; o código define **60 segundos**, embora README diga 15 minutos.
- Escritas usam SHA da Contents API. A sincronização de linhagem faz merge de três vias e favorece valor local em conflitos escalares; isso não equivale a uma política geral de prevenção de perda de atualização.
- Coven usa lock dentro do JSON, sessionStorage para ID de sessão e validação de expiração. Preservar regras, mas aquisição/renovação/liberação precisam se tornar atômicas no backend.
- Listas usam hashes de senha publicados e comparação no cliente, inclusive hash administrativo default. Esse mecanismo filtra a interface; não oferece autorização de backend e não deve ser reutilizado como autenticação Sites.
- `githubRawBase` em `scripts/config.js` aponta para `uneluneravie/mage-ascension/main`, enquanto o destino padrão de escrita é `jogatina-pesada/mage-ascension`. Não alterar antes de definir a origem canônica dos dados remotos.
- Arquivos do diretório fichas não podem ser copiados para assets públicos do novo Site. Toda leitura de registros deve passar pela autorização do servidor, inclusive imagens.

## 4. Dados e contratos

Inventário reproduzível em `docs/sites-migration-data-inventory.json`: caminho, tamanho, SHA-256, tipo e chaves raiz. Não inclui conteúdo de personagens nem hashes de senhas. São 19 JSONs válidos: sete fichas, seis linhagens, dois manifestos, coven, listas, inventário e catálogo raiz. Existem 24 arquivos de imagem versionados nas pastas consultadas (`imagens/` e `fichas/imagens/`).

Preservar integralmente o documento original, incluindo campos desconhecidos. Fichas usam identity, attributes, abilities, spheres, advantages, backgrounds, backgroundJustifications, origin, aspirations, obsession, world, health, creation, creationSnapshot, ai e demais campos existentes. Linhagens possuem name, spheres, sphereExperience e members. Coven permanece global e separado. Listas não definem propriedade confiável de usuário ChatGPT.

`applySheetData` já transforma dados legados: remove lab e certos campos de criação e extrai lineage embutido; `sheetJson` também normaliza/muta estado. Por isso importar via UI e reexportar não deve ser o mecanismo de backup integral. Migrador futuro deve guardar bytes originais e hash antes de qualquer normalização. Preservar nomes snake_case, referências de imagens, manifesto string/objeto e formatos legados.

## 5. Testes e verificações da auditoria

Infraestrutura: harness próprio no navegador, 45 testes unitários e 78 funcionais declarados, páginas em `testes/`, servidor Python opcional que registra resultados. Não há relatório de resultados versionado. Testes incluem regras, criação, saúde, serialização, IA, linhagem, coven, carregamento, salvamento local e GitHub mockado. Não há backend existente para testar autorização real.

Problema detectado por leitura: `testes/test-harness.js` não carrega `character-lists.js` nem `printing.js`, presentes em index.html; existem testes de listas. Comparação precisa primeiro corrigir essa diferença e registrar baseline na versão anterior. Não se afirma que as suites passam.

Executado nesta fase: parse dos 19 JSONs (todos válidos); `node --check` nos 29 JavaScripts de aplicação (todos válidos). Nenhum teste de navegador, autenticação real, D1, mobile ou integração hospedada foi executado. Não foi localizada a ferramenta `cua_repl.js`; conforme referência de preview Sites, não improvisar navegador alternativo nem iniciar preview gerenciado sem ela.

Os AGENTS.md locais proíbem execução pelo Codex; o pedido explícito desta migração autoriza testes e prevalece. Essa precedência não é evidência de testes aprovados.

## 6. Capacidades confirmadas da plataforma

Fontes consultadas: skill Sites e referências oficiais disponibilizadas pelo plugin:

- `sites/SKILL.md`: publicação a partir de fonte Git sincronizada; criação retorna credencial de repositório provisionado pelo Sites; hospedagem estática ou Cloudflare Worker, 128 MB por isolate, sem TCP bruto.
- `sites/references/identity-and-secrets.md`: identidade autenticada por headers oai-authenticated-user-id/email, ID estável dentro do Site, diferente entre Sites. Sign-in, sign-out e callback são controlados pela plataforma. Helpers server-only no starter Vinext. Identidade não implica associação ao workspace; autorização deve ocorrer em cada operação.
- `sites/references/storage.md`: D1 e R2 provisionados por bindings em .openai/hosting.json; migrations de schema versionadas, geração antes do build, aplicação hospedada na publicação; dados/seed fora de migrations. Uma instrução por prepare e batch para grupos.
- `sites/templates/worker-esm-starter/README.md`: starter Worker ESM limitado a um arquivo, sem assets separados; não se encaixa diretamente na estrutura atual sem adaptação.
- `sites/references/preview/managed.md`: preview gerenciado exige infraestrutura e navegador próprios do ambiente.

São capacidades documentadas, ainda não verificadas em um Site desta aplicação. A API create_site não expõe parâmetro para conectar o GitHub existente; ela provisiona outro repositório de origem. Nenhum caminho documentado consultado permite publicar somente a partir do origin GitHub atual.

## 7. Fase 2 — decisão necessária antes de implementação

Bloqueio: o usuário exige não criar outro repositório, mas o fluxo suportado do Sites inclui um repositório próprio. Não chamar create_site nem substituir origin para contornar a restrição. Solicitação enviada: autorizar espelho técnico do Sites, mantendo o repositório GitHub como fonte principal, ou manter a restrição estrita. Com restrição estrita, a publicação Sites permanece bloqueada até existir suporte confirmado para vinculação direta.

Se autorizado, caminho candidato: preservar frontend estático e suas regras; adaptar somente entrega de assets, adicionar backend Worker compatível com build suportado (avaliar starter Vinext para assets e D1), trocar integração de persistência por API autenticada e manter execução local. Não foi escolhido framework ou adicionada dependência antes dessa decisão.

## 8. Fases seguintes — ainda não implementadas

3. Autenticação: usar identidade fornecida pela infraestrutura Sites, rejeitar ausência de sessão, associação local de IDs a papéis narrador/jogador e allowlist no servidor. Não aceitar identidade/papel do body. Definir responsáveis e associação dos personagens existentes antes do backfill. Local não deve simular autenticação em produção.

4. Persistência: documento JSON preservado, ID independente de nome, owner/membership, versão para compare-and-swap (409 em conflito), timestamps, auditoria de operações relevantes. Linhagens/coven/listas/imagens exigem permissões próprias; narrador não pode ser inferido de dados enviados pelo frontend. Backup/restauração autenticados, migrador com dry-run, hash, transação/batch e chave de idempotência; não sobrescrever registros alterados. Nenhum PAT exigido na nova persistência. D1 para registros; avaliar R2 para imagens sem custos externos não aprovados.

5. Testes: baseline antes/depois, XP, todos os pools, JSON/legados/campos desconhecidos, inventário de bytes preservado, 401/403, isolamento entre usuários, narrador, CRUD, concorrência/409, locks do coven, imagens, import/export, backup/restauração/idempotência e viewport desktop/mobile. Diferenciar testes mockados de autenticação real da plataforma. A ausência de navegador é limite de validação, não aprovação implícita.

6. Publicação: somente após passar testes e aprovação explícita do usuário. Não existe URL publicada nova. Antes disso validar secrets runtime, bindings, ACL e política de acesso; manter GitHub Pages funcionando e documentar comandos locais/build/debug/deploy/rollback no README quando a arquitetura estiver implementada. Não apagar integração antiga antes de comprovar equivalência e rollback.
