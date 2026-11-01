# Graph Report - Ricks  (2026-11-01)

## Corpus Check
- 15 files · ~2,869 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 112 nodes · 109 edges · 17 communities (13 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- RICK — Experimental Systems Lab
- package.json
- README.md
- devDependencies
- scripts
- Fluxos de desenvolvimento
- project-status.ts
- 03. Influências conceituais
- tsconfig.json
- 05. Filosofia visual
- AGENTS.md
- 24. Página de projeto
- 01. Identidade
- 09. Tipografia

## God Nodes (most connected - your core abstractions)
1. `RICK — Experimental Systems Lab` - 25 edges
2. `scripts` - 8 edges
3. `Fluxos de desenvolvimento` - 7 edges
4. `03. Influências conceituais` - 5 edges
5. `05. Filosofia visual` - 4 edges
6. `RICK — Experimental Systems Lab` - 3 edges
7. `01. Identidade` - 3 edges
8. `06. Sistema de cores` - 3 edges
9. `09. Tipografia` - 3 edges
10. `24. Página de projeto` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (17 total, 1 thin omitted)

### Community 0 - "RICK — Experimental Systems Lab"
Cohesion: 0.08
Nodes (24): 02. Conceito do site, 04. Direção visual, 06. Sistema de cores, 07. Cores por universo, 08. Regra para as cores conversarem, 10. Escala tipográfica, 11. Grid, 12. Espaçamento (+16 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (16): dependencies, astro, engines, node, name, private, type, version (+8 more)

### Community 2 - "README.md"
Cohesion: 0.25
Nodes (5): Comandos, Começar, RICK — Experimental Systems Lab, 2026-11-01, YT_RAW

### Community 3 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @astrojs/check, tailwindcss, @tailwindcss/vite, @types/node, typescript, vite, vitest (+1 more)

### Community 4 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, check, dev, preview, test, test:coverage, test:watch

### Community 5 - "Fluxos de desenvolvimento"
Cohesion: 0.29
Nodes (7): Estado inicial deste workspace, Fluxos de desenvolvimento, Graphify CLI, Node, Astro, Tailwind e testes, Skills no Codex, System design, YT-RAW

### Community 6 - "project-status.ts"
Cohesion: 0.43
Nodes (5): vitest, getNextProjectStatus(), isProjectStatus(), ProjectStatus, projectStatuses

### Community 7 - "03. Influências conceituais"
Cohesion: 0.40
Nodes (5): 03. Influências conceituais, Interstellar, Laboratório de inventor, Naruto, Zelda

### Community 8 - "tsconfig.json"
Cohesion: 0.40
Nodes (4): astro/tsconfigs/strict, exclude, extends, include

### Community 9 - "05. Filosofia visual"
Cohesion: 0.50
Nodes (4): 05. Filosofia visual, Regra 01 — O conteúdo é o protagonista, Regra 02 — Espaço é parte do design, Regra 03 — Complexidade aparece quando procurada

### Community 11 - "24. Página de projeto"
Cohesion: 0.67
Nodes (3): 01 — Cinematic Hero, 02 — The…, 24. Página de projeto

### Community 12 - "01. Identidade"
Cohesion: 0.67
Nodes (3): 01. Identidade, Arquétipo: The Systems Inventor, Personalidade

### Community 13 - "09. Tipografia"
Cohesion: 0.67
Nodes (3): 09. Tipografia, Principal — Geist, Técnica — IBM Plex Mono

## Knowledge Gaps
- **77 isolated node(s):** `name`, `version`, `private`, `type`, `node` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 82 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RICK — Experimental Systems Lab` connect `RICK — Experimental Systems Lab` to `README.md`, `03. Influências conceituais`, `05. Filosofia visual`, `24. Página de projeto`, `01. Identidade`, `09. Tipografia`?**
  _High betweenness centrality (0.237) - this node is a cross-community bridge._
- **Why does `Fluxos de desenvolvimento` connect `Fluxos de desenvolvimento` to `README.md`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RICK — Experimental Systems Lab` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._