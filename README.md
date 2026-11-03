# RICK — Experimental Systems Lab

Laboratório digital pessoal para projetos, experimentos, pesquisas, protótipos e sistemas em evolução.

## Começar

Requisitos: Node.js >=22.23.4 e npm.

~~~powershell
npm ci
npm run dev
~~~

## Comandos

~~~powershell
npm run check          # valida páginas Astro e tipos
npm run content:validate # valida os arquivos .lu de public/content
npm run content:prepare  # valida e gera o catálogo estático
npm test               # executa testes automatizados uma vez
npm run test:watch     # modo interativo
npm run test:coverage  # testes com cobertura V8
npm run build          # gera o site estático em dist/
npm run preview        # prévia local da versão de produção
~~~

- [Arquitetura de pastas](docs/ARCHITECTURE.md): páginas, subpáginas, rotas, regras de domínio e arquivos públicos.
- [Sistema de conteúdo LU](docs/CONTENT_SYSTEM.md): artigos, projetos, serviços, relações, widgets, templates e validação antes do build.
- [System design](docs/SYSTEM_DESIGN.md): identidade, direção visual, navegação, motion e estrutura de projetos.
- [Fluxos de desenvolvimento](docs/DEVELOPMENT_WORKFLOWS.md): Node/Astro, testes automatizados, Graphify e YT-RAW.
- [Deploy no GitHub Pages](docs/DEPLOYMENT.md): build estático e publicação automática pela branch main.
- [Diário bruto](YT_RAW.md): histórico cronológico breve do desenvolvimento.
- [Memória do projeto](memory/README.md): estado atual, histórico de mudanças e problemas conhecidos.
