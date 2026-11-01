# Estado do projeto

Atualizado em 2026-11-01. Confirme os arquivos antes de assumir que este estado continua atual.

## Objetivo

RICK é um laboratório digital pessoal para projetos, experimentos, pesquisas, ideias, protótipos, sistemas, serviços, artigos e histórico de evolução. Não deve se apresentar como um portfólio tradicional de desenvolvedor.

A referência visual e funcional completa é [docs/SYSTEM_DESIGN.md](../docs/SYSTEM_DESIGN.md).

## Stack e execução

- Node observado na configuração: v24.14.0; npm: 11.19.1.
- Requisito no package.json: Node >=22.23.4.
- Astro declarado ^7.4.4; versão resolvida no package-lock observado: 7.4.4.
- Vite declarado ^8.3.3; versão resolvida observada: 8.3.5.
- Tailwind CSS e @tailwindcss/vite declarados ^4.3.3; Tailwind resolvido: 4.3.3.
- Vitest e @vitest/coverage-v8 declarados ^5.0.5; Vitest resolvido: 5.0.5.
- TypeScript declarado ^6.0.3; Astro Check fornece o comando de verificação.
- Há package-lock.json v3 e node_modules no workspace, observados em 2026-11-01.

Comandos principais:

~~~powershell
npm run dev
npm run check
npm test
npm run test:watch
npm run test:coverage
npm run build
npm run preview
~~~

Instale dependências com npm install quando necessário. Consulte README.md e docs/DEVELOPMENT_WORKFLOWS.md para a lista completa.

## Estrutura relevante

- package.json: dependências e comandos.
- astro.config.ts: integração do Tailwind pelo plugin Vite.
- vitest.config.ts: testes unitários e cobertura V8.
- tsconfig.json: configuração strict; inclui a configuração do Astro, Vitest e src/.
- src/pages/index.astro e src/layouts/BaseLayout.astro: ponto inicial do site.
- src/styles/global.css: tokens globais de cores e tipografia.
- src/lib/project-status.ts: estados canônicos e progressão de projetos.
- src/lib/project-status.test.ts: testes do ciclo de status.
- docs/SYSTEM_DESIGN.md: especificação de produto e design.
- YT_RAW.md: diário cronológico breve.
- graphify-out/graph.json: grafo local de relações do código.

## Decisões que não devem regredir sem uma decisão explícita

### Identidade do produto

- Arquétipo: The Systems Inventor; ideia central: Controlled Experimentation.
- Projetos e experimentos são protagonistas; proporção conceitual de 80% trabalho e 20% pessoa.
- Conteúdo pode existir em andamento e evoluir por IDEA → RESEARCH → PROTOTYPE → BUILDING → ACTIVE → SHIPPED → ARCHIVED.
- Preservar o histórico, inclusive experimentos abandonados e projetos arquivados.

### Direção visual

- Dark, minimal, technical, cinematic e spatial: laboratório + galeria + observatório + arquivo técnico.
- Roxo é assinatura do laboratório; projetos mantêm suas cores de categoria em detalhes, com base visual aproximadamente 90% neutra e 10% de destaque.
- Geist é a fonte principal; IBM Plex Mono deve ficar em labels e informação técnica.
- Preservar espaço negativo, conteúdo editorial e complexidade revelada progressivamente.
- Motion deve explicar hierarquia ou profundidade, priorizar transform/opacity e respeitar prefers-reduced-motion.
- Evitar estética cyberpunk genérica, neon excessivo, terminal hacker, dashboard SaaS e grades uniformes de cards.