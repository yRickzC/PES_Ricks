# YT_RAW

## 2026-11-01

- **Pedido/motivo:** configurar os fluxos das skills Graphify e YT-RAW e registrar o system design do site na documentação.
- **Mudança/decisão:** instalada a integração Graphify para Codex; adicionadas instruções e comandos de uso, documentação do system design e este diário na raiz.
- **Resultado:** documentação criada. O workspace ainda não tinha código-fonte nem grafo; a extração Graphify ficou para quando houver código.
- **Pedido/motivo:** iniciar o site com Node.js, TypeScript, Vite, Astro, Tailwind CSS e testes automatizados.
- **Mudança/decisão:** criada a base Astro/Vite com Tailwind v4, verificação TypeScript, Vitest + cobertura V8, homepage inicial alinhada ao system design e testes do ciclo de status dos projetos.
- **Resultado:** arquivos e comandos adicionados. Instalação, build e testes não foram executados nesta etapa.

- **Atualização do grafo:** Graphify atualizou graphify-out/; o extrator avisou que não conseguiu indexar os dois arquivos .astro e indexou os módulos TypeScript.
- **Pedido/motivo:** preservar problemas, decisões e mudanças do projeto para evitar regressões em sessões futuras.
- **Mudança/decisão:** criada memory/ com estado atual, histórico, questões abertas e modelo de incidente; AGENTS.md e a documentação apontam para essa memória.
- **Resultado:** os registros incluem o aviso do extrator Graphify para arquivos Astro, o status de validação não confirmado e o trecho incompleto do system design.
- **Pedido/motivo:** manter os arquivos de memória fora do controle de versão.
- **Mudança/decisão:** adicionada a pasta memory/ ao .gitignore.
- **Resultado:** novos arquivos dessa pasta serão ignorados pelo Git; o conteúdo permanece no workspace.
- **Pedido/motivo:** confirmar se o diário YT-RAW também estava fora do controle de versão.
- **Mudança/decisão:** adicionado YT_RAW.md ao .gitignore junto com memory/.
- **Resultado:** os dois registros locais serão ignorados pelo Git.
