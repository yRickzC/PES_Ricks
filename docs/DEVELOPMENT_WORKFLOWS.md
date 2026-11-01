# Fluxos de desenvolvimento

## Skills no Codex

As skills estão instaladas no perfil local do Codex e podem ser chamadas no chat:

- `$graphify` para explorar arquitetura e relações do código com o grafo.
- `$yt-raw` para acrescentar ao diário um registro curto de uma etapa relevante.

A integração do Graphify para Codex foi configurada com `graphify codex install`; ela mantém as instruções do projeto em `AGENTS.md` e o hook em `.codex/hooks.json`.

## Graphify CLI

Confira a instalação e os comandos disponíveis:

```powershell
graphify --version
graphify --help
```

Quando houver código-fonte e ainda não existir um grafo válido para este projeto, extraia somente o código por AST local:

```powershell
graphify extract . --code-only
```

Consulte o grafo para responder perguntas sobre o código. Passe o caminho explicitamente para evitar consultar outro projeto:

```powershell
graphify query "Como o fluxo de inicialização conecta os módulos principais?" --graph .\graphify-out\graph.json
graphify path "App" "Database" --graph .\graphify-out\graph.json
graphify explain "App" --graph .\graphify-out\graph.json
graphify affected "App" --graph .\graphify-out\graph.json
```

Depois de alterar código, atualize o grafo localmente:

```powershell
graphify update .
graphify check-update .
```

Leia os arquivos-fonte apontados pelo grafo para confirmar chamadas, assinaturas e condições. A extração `--code-only` e a atualização do grafo não exigem backend semântico.

## YT-RAW

YT-RAW não tem comando de shell: a skill do Codex mantém `YT_RAW.md` na raiz. Após uma etapa relevante, invoque `$yt-raw`; ela deve ler o diário, acrescentar uma entrada curta em português na ordem cronológica e conferir somente o trecho adicionado. Não substitua entradas anteriores.

## Estado inicial deste workspace

Na configuração inicial, a pasta do projeto não continha código-fonte nem `graphify-out/graph.json`; por isso, nenhum grafo foi extraído. Rode `graphify extract . --code-only` quando houver código para indexar.
## Node, Astro, Tailwind e testes

O projeto usa Astro com Vite, Tailwind CSS v4 e Vitest. A configuração de Astro registra o plugin do Tailwind para Vite; o Vitest usa uma configuração dedicada para testes unitários TypeScript.

Requisitos locais: Node.js >=22.23.4 e npm.

~~~powershell
npm install
npm run dev
~~~

Comandos disponíveis:

~~~powershell
npm run check          # verificação Astro/TypeScript
npm test               # suíte automatizada, execução única
npm run test:watch     # observa alterações e reexecuta testes
npm run test:coverage  # executa a suíte e gera cobertura V8
npm run build          # build de produção
npm run preview        # serve localmente o build
~~~

Testes ficam ao lado do código em src/ e usam os sufixos .test.ts ou .spec.ts. O exemplo inicial cobre o ciclo de status de projetos definido em [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md).

## System design

A identidade, os tokens visuais e as regras de interface estão em [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md). A folha global expõe os tokens da base escura, assinatura violeta e cores por categoria como cores utilitárias do Tailwind.
## Memória persistente do projeto

Antes de alterar arquitetura, interface ou comportamento, leia [memory/README.md](../memory/README.md), [memory/PROJECT_STATE.md](../memory/PROJECT_STATE.md) e [memory/KNOWN_ISSUES.md](../memory/KNOWN_ISSUES.md). Registre mudanças concluídas em [memory/CHANGELOG.md](../memory/CHANGELOG.md). Para bugs, use [memory/INCIDENT_TEMPLATE.md](../memory/INCIDENT_TEMPLATE.md) e preserve a causa raiz e a validação da correção.
