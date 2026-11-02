# RICK — Experimental Systems Lab

Este documento registra o system design fornecido para o site. O conceito combina um laboratório digital pessoal com uma interface escura, técnica, cinematográfica e controlada.

## 01. Identidade

### Arquétipo: The Systems Inventor

Rick não deve ser apresentado principalmente como “desenvolvedor”. A percepção desejada é a de uma pessoa extremamente técnica que constrói sistemas, experimenta coisas incomuns e documenta o processo.

O visitante deve pensar:

- “Ele faz coisas diferentes.”
- “Quero explorar isso.”
- “Esse cara entende tecnicamente o que está fazendo.”

### Personalidade

**Autoridade + Criatividade + Experimentação.** A ideia que une as três é **Controlled Experimentation**: o site pode experimentar visualmente, mas nunca parecer desorganizado.

## 02. Conceito do site

### Experimental Systems Lab

O site funciona como um laboratório digital pessoal, e não como um portfólio tradicional. Pode conter projetos, experimentos, pesquisas, ideias, protótipos, sistemas, vídeos, artigos, serviços, projetos abandonados e histórico de evolução.

Projetos não precisam estar terminados para ter uma página. Uma ideia recém-escrita já pode existir e evoluir por estes estados:

```text
IDEA → RESEARCH → PROTOTYPE → BUILDING → ACTIVE → SHIPPED → ARCHIVED
```

O histórico não deve ser apagado: ele faz parte da identidade.

## 03. Influências conceituais

As referências servem para extrair sensações e princípios, sem copiar elementos ou símbolos existentes.

### Interstellar

Extrair escala, silêncio visual, espaço negativo, profundidade, sensação de desconhecido, cinematografia, movimento lento e objetos isolados no espaço. A sensação procurada é: **“Existe algo maior aqui para explorar.”**

### Zelda

Extrair descoberta, exploração, curiosidade, elementos escondidos, mundos interconectados, progressão, artefatos e a sensação de encontrar algo. O usuário deve descobrir o laboratório, não apenas navegar por ele.

### Naruto

Extrair identidade visual forte, símbolos, energia, formas circulares e técnicas com identidade própria, mantendo simplicidade visual com força. Isso conversa com roxo, formas concêntricas, olhos/ripples e símbolos abstratos, sem copiar símbolos existentes.

### Laboratório de inventor

“Rick” funciona como referência conceitual para experimentos, coisas incompletas, dispositivos, pesquisas estranhas, protótipos e projetos simultâneos. A interface deve controlar essa variedade, sem caos proposital.

## 04. Direção visual

A estética deve ser **Dark / Minimal / Technical / Cinematic / Spatial**. Evitar cyberpunk genérico, terminal hacker, neon excessivo, dashboard SaaS, cards coloridos, glassmorphism exagerado e portfólio padrão de programador.

A sensação deve ficar entre **laboratório + galeria + observatório + arquivo técnico**.

## 05. Filosofia visual

### Regra 01 — O conteúdo é o protagonista

Usar uma proporção aproximada de **80% projetos / 20% Rick**. A foto não precisa ocupar metade da hero; o trabalho explica quem ele é.

### Regra 02 — Espaço é parte do design

Usar bastante espaço negativo e poucos elementos simultâneos. Grandes áreas escuras fazem os elementos importantes parecerem maiores.

### Regra 03 — Complexidade aparece quando procurada

Revelar a informação em camadas: primeiro uma apresentação cinematográfica e simples, depois informação e, por fim, detalhes técnicos. Uma página de projeto pode revelar apresentação → conceito → arquitetura → código → benchmark → decisões → changelog.

## 06. Sistema de cores

O roxo é a assinatura do laboratório, sem controlar a identidade cromática de todos os projetos.

### Base

```css
--bg-0: #07070A;
--bg-1: #0C0D12;

--surface-0: #0F1016;
--surface-1: #13151D;
--surface-2: #191C26;

--text-primary: #F4F4F6;
--text-secondary: #A5A7B0;
--text-muted: #696C76;

--border-subtle: rgba(255,255,255,.07);
--border-active: rgba(255,255,255,.16);
```

### Identidade

```css
--brand: #8066D6;
--brand-soft: #A58AF0;
--brand-light: #B497FF;
```

O roxo aparece no logo, seleção, estados ativos, cursor especial, pequenos detalhes, iluminação ambiental e transições globais. Não precisa estar em todos os cards.

## 07. Cores por universo

Cada categoria recebe uma cor de destaque própria:

| Categoria | Cor | Sensação |
|---|---|---|
| AI / Data | `#5EA9FF` | Inteligência, dados, modelos e processamento. |
| Games | `#FF625C` | Interação, conflito, movimento e gameplay. |
| Systems / Low-Level | `#E6A85C` | Hardware, memória, performance e infraestrutura. |
| Research / Experiments | `#9A78FF` | Violeta próximo da identidade central. |
| Products / Services | `#63D6A0` | Produção, produto funcional, negócio e deploy. |
| Notes / Blog | `#B7BAC4` | Neutro; o conteúdo domina. |

## 08. Regra para as cores conversarem

A cor da categoria não troca o fundo inteiro do site. Ela altera apenas glow, linhas, bordas ativas, ícones, gráficos, indicadores, highlights e elementos interativos. Manter aproximadamente **90% neutro / 10% categoria** para projetos de cores diferentes coexistirem com a assinatura roxa.

## 09. Tipografia

### Principal — Geist

Usar em títulos, textos, UI e navegação. É moderna, neutra, técnica e legível, sem chamar mais atenção que o projeto.

### Técnica — IBM Plex Mono

Usar somente para métricas, IDs, versões, datas, status, código, coordenadas e labels pequenos. Exemplos: `BUILD 0.4.17`, `STATUS / PROTOTYPE`, `UPDATED 31.10.26`. Não transformar o site inteiro em monospace.

## 10. Escala tipográfica

Escala desktop:

| Estilo | Tamanho |
|---|---:|
| Display XL | 80–112px |
| Display | 64–80px |
| H1 | 48–64px |
| H2 | 36–48px |
| H3 | 24–32px |
| Body Large | 18–20px |
| Body | 15–17px |
| Small | 13–14px |
| Technical | 11–12px |

No mobile, reduzir agressivamente os tamanhos display.

## 11. Grid

| Dispositivo | Colunas |
|---|---:|
| Desktop | 12 |
| Tablet | 6 |
| Mobile | 4 |

Container: `max-width: 1440–1520px`. Conteúdo editorial: `680–760px`.

## 12. Espaçamento

Sistema baseado em 4px:

```text
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192
```

Grandes seções devem respirar. Evitar pequenas separações sucessivas.

## 13. Geometria

Evitar dezenas de cards com `border-radius: 24px`. Usar raios contidos:

| Uso | Raio |
|---|---:|
| Small | 4px |
| Default | 8px |
| Panel | 12px |
| Large | 16px |

Elementos cinematográficos podem não ter raio.

## 14. Profundidade

A interface deve ter aproximadamente quatro planos:

```text
BACKGROUND
↓
ATMOSPHERE
↓
CONTENT
↓
INTERACTION
```

- **Background:** quase preto.
- **Atmosphere:** partículas extremamente discretas, linhas, mapas, geometria, halos, grids e nós.
- **Content:** projetos e informação.
- **Interaction:** cursor, hover, highlights e elementos próximos do usuário.

## 15. Parallax

Elementos movem-se em velocidades distintas para dar profundidade sem parecer um template de efeitos:

| Plano | Velocidade |
|---|---:|
| Background | 0.10x |
| Geometry | 0.25x |
| Ambient objects | 0.45x |
| Content | 1.00x |
| Foreground | 1.15x |

## 16. Filosofia de motion

Motion explica hierarquia, profundidade, relação, transformação e descoberta; não é decoração.

| Tipo | Duração | Exemplos |
|---|---:|---|
| Micro | 120–200ms | Hover, toggle e botão. |
| UI | 250–400ms | Panels e menus. |
| Spatial | 500–800ms | Cards e páginas. |
| Cinematic | 900–1600ms | Hero e transições importantes. |

## 17. Easing

Movimento principal:

```css
cubic-bezier(.22, 1, .36, 1)
```

Interações rápidas:

```css
cubic-bezier(.2, .8, .2, 1)
```

Evitar bounce e movimentos “fofinhos”.

## 18. Performance de motion

Priorizar `transform`, `opacity`, GPU compositing, lazy initialization e `IntersectionObserver`. Evitar blur animado em excesso, `box-shadow` gigante, dezenas de filtros, canvas sem necessidade e WebGL permanente fora da viewport.

No mobile, usar uma versão simplificada. Respeitar `prefers-reduced-motion`.

## 19. Navegação principal

A navegação compartilhada segue a estrutura definida para esta etapa:

```text
Rickz. | Blogs · Projects · Services | Redes sociais · Idioma · Pesquisa
```

Os rótulos acompanham o idioma selecionado. YouTube, Instagram, X / Twitter e LinkedIn ficam em um único popup para manter o cabeçalho compacto. Os links dependem das URLs reais dos perfis.

No mobile, a navegação e seus controles ficam no menu hambúrguer. O cabeçalho permanece acessível no topo; a seção ativa recebe destaque discreto em violeta. Pesquisa abre um diálogo, inicialmente limitado aos títulos e descrições das seções existentes, com atalho Ctrl/Cmd+K.

O layout é compartilhado entre todas as páginas. O footer contém somente **@Rickz 2026**.

## 20. Home

### Hero

Evitar a apresentação “Olá, meu nome é Rick e sou desenvolvedor...”. A composição atual usa texto curto centralizado, lua pequena no topo central e uma ilha flutuante menor no eixo central como foco visual:

```text
SYSTEMS / SOFTWARE / EXPERIMENTS

Strange worlds.
Real systems.

Software, games and controlled experimentation.

Explore Projects / View Lab Notes
```

O texto acompanha o idioma selecionado. Céu cósmico, lua, ilha, base industrial e engrenagens formam camadas de profundidade, com névoa violeta procedural em CSS. Fábrica e engrenagens ocupam uma faixa inferior como transição para a próxima área. Parallax de mouse e scroll é discreto no desktop; mobile prioriza leitura acima da arte. Movimento reduzido desliga os efeitos. Os CTAs levam às seções existentes de projetos e blogs. Configuração e limites da implementação estão em [HERO.md](HERO.md).

## 21. Featured Experiments

Após a hero, exibir **3–5 projetos importantes**, em cards grandes e quase editoriais. Evitar uma grade com 12 cards iguais. Cada projeto importante pode ter composição própria.

## 22. Systems Map

Uma visualização de projetos como nós conectados permite navegar pelas relações e transforma o histórico em algo explorável. Estrutura conceitual:

```text
              AI
             /
Luvyn ── Systems ── Orbital
  │
  ├── Compiler
  │
  └── Tooling

Games
├── RBS
└── Experiments
```

## 23. Project Card

O card contém apenas categoria, nome do projeto, descrição curta, status e ano. A imagem ou o vídeo ocupa maior importância.

No hover: profundidade pequena, cor do projeto, informações adicionais e preview em movimento quando aplicável.

## 24. Página de projeto

### 01 — Cinematic Hero

Nome, uma frase, imagem ou vídeo e status.

### 02 — The…

O trecho de system design enviado termina neste título, sem o conteúdo da seção. A continuação deve ser acrescentada quando estiver disponível.

## 25. Internacionalização

O site oferece inglês em / como idioma padrão para preservar a rota existente e português do Brasil em /pt-br/. Home, blogs, projetos e serviços têm rotas nos dois idiomas. O seletor no cabeçalho mantém a seção atual entre as versões localizadas.

Texto visível e metadados devem vir do catálogo tipado em frontend/utils/translations.ts, importado dos JSON em public/i18n/. Cada página define o locale explicitamente; o documento usa en ou pt-BR no atributo lang. A configuração de rotas fica em astro.config.ts. Uma nova língua precisa de uma entrada completa no catálogo, uma rota Astro correspondente e cobertura nos testes de internacionalização.

A localização altera conteúdo e metadados, sem mudar os tokens visuais, a identidade cromática ou o comportamento de motion do laboratório. Não há redirecionamento automático por idioma do navegador.
