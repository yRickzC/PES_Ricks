# Problemas e estados pendentes

Atualize o status quando houver evidência. Não descarte itens resolvidos: mova o resumo e a validação para [CHANGELOG.md](CHANGELOG.md).

## GRAPH-001 — Graphify não extrai os arquivos Astro

- **Status:** aberto; limitação do extrator.
- **Observado:** 2026-11-01, Graphify 0.9.56.
- **Sintoma:** graphify update . conclui e gera o grafo, mas avisa que src/layouts/BaseLayout.astro e src/pages/index.astro têm erro de sintaxe na linha 2 e não extrai símbolos desses arquivos.
- **Impacto:** o grafo não representa a estrutura interna dos componentes Astro. O TypeScript foi indexado; uma consulta encontrou o módulo de status e seu teste.
- **Cuidados:** confirmar relações de Astro diretamente nos arquivos-fonte. Não tratar o aviso do extrator, por si só, como erro de compilação Astro nem remover frontmatter válido para satisfazer o parser.
- **Próxima ação:** reavaliar quando uma versão futura do Graphify documentar suporte Astro.

## VALIDATION-001 — Estado de testes e build sem resultado registrado

- **Status:** precisa de confirmação.
- **Observado:** a etapa que criou o scaffold não executou npm run check, npm test ou npm run build. Mais tarde havia node_modules, .astro e package-lock.json no workspace, mas isso não prova quais comandos passaram.
- **Cuidados:** antes de afirmar que o projeto está validado, obter um resultado atual de cada comando necessário, respeitando as instruções de execução do AGENTS.md.

## DESIGN-001 — Trecho final do system design incompleto

- **Status:** aguardando conteúdo de origem.
- **Observado:** docs/SYSTEM_DESIGN.md termina na seção 24, depois do título “02 — The…”.
- **Cuidados:** não inventar o restante da especificação. Completar somente quando o conteúdo original estiver disponível.