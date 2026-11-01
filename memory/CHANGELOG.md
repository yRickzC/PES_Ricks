# Histórico de mudanças

Registros cronológicos breves. O YT_RAW.md na raiz mantém o diário resumido; este arquivo preserva contexto e validações.

## 2026-11-01 — Documentação inicial

- Configuradas as instruções de uso das skills Graphify e YT-RAW no projeto.
- Criada a documentação do system design e o diário YT_RAW.md.
- Naquela etapa, a raiz não tinha código-fonte nem grafo.

## 2026-11-01 — Scaffold web e testes

- Adicionados Node/TypeScript, Astro com Vite, Tailwind CSS v4 e Vitest com cobertura V8.
- Criada a homepage inicial e um utilitário/teste para o ciclo de status dos projetos.
- Graphify v0.9.56 atualizou graphify-out/ com 112 nós e 109 relações. A consulta relacionou o utilitário e seu teste.
- Graphify emitiu avisos de sintaxe para os dois arquivos .astro e não extraiu símbolos deles; os módulos TypeScript foram indexados.
- Na criação do scaffold, instalação, build e testes não foram executados pelo assistente. Em uma inspeção posterior, package-lock.json e node_modules já estavam presentes; não se atribui essa instalação a um agente específico nem se presume o resultado dos testes.
- Configuração declarada: Astro ^7.4.4, Vite ^8.3.3, Tailwind ^4.3.3, Vitest ^5.0.5 e TypeScript ^6.0.3. Lock observado: Astro 7.4.4, Vite 8.3.5, Tailwind 4.3.3 e Vitest 5.0.5.

## 2026-11-01 — Memória persistente

- Criada esta pasta para centralizar estado, histórico, questões abertas e o formato de registro de incidentes.
- AGENTS.md, README.md e docs/DEVELOPMENT_WORKFLOWS.md passaram a apontar para esta memória.