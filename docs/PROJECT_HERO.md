# Hero dos projetos

A página `/projects/` e sua versão `/pt-br/projects/` usam `ProjectHero.astro`. A logo existente e os links das categorias ficam acima da floresta, sem movimento. Nome traduzido e SVG vêm do cadastro compartilhado em `backend/content/taxonomy.ts`, também utilizado na pesquisa. Os links apontam para seções vazias por categoria; não foi implementada uma listagem LU de projetos nem inventado conteúdo.

A logo do hero usa `public/images/Rick_Logo_Transparent.webp`, convertida com alpha da versão PNG criada pela ferramenta imagegen integrada. Os arquivos PNG originais ficam preservados em `RAW/images/`. Geração, prompt e verificação da arte estão em [LOGO_TRANSPARENTE.md](LOGO_TRANSPARENTE.md).

Os ícones com seus rótulos envolvem a logo central em uma composição radial estática. As posições são calculadas pela quantidade de categorias, começando no topo e seguindo o sentido horário. O cadastro atual possui sete categorias; acima de sete, os links passam para uma grade abaixo da logo. O conteúdo tem largura máxima de 580px, sem borda. No desktop, a órbita acompanha a altura da viewport entre 320px e 416px; a logo ocupa 35% (máximo de 146px), com ícones de 26px e título de até 60px. No mobile, a órbita permanece limitada a 320px, logo de 38% (até 122px) e ícones de 24px. Título e descrição ficam abaixo do conjunto, com intervalos de 8px e 16px. Os símbolos e o foco usam a mesma cor branca do token --color-text-primary (#f4f4f6). A ordem de tabulação acompanha a ordem visual, com foco visível e destinos por âncora derivados do mesmo cadastro.

A seção ocupa pelo menos o espaço da primeira tela após o header: `max(680px, calc(100svh - 84px))` no desktop e `max(580px, calc(100svh - 72px))` no mobile. Não há teto de altura: os antigos limites de 760px/700px antecipavam a seção “Explore Projects” em telas altas. Conteúdo ampliado pode aumentar a seção, sem recorte. Padding superior de 24–32px e inferior de 96px (24px/112px no mobile) mantêm a composição acima da floresta, sem ampliar os assets. A listagem permanece após o hero e acessível por rolagem ou pelas âncoras. Evitar combinar órbita de 480px com padding inferior de 280px, pois essa altura intrínseca empurrava a floresta além da primeira tela.

## Composição e ajuste

- `projects/config/hero.ts`: camadas, profundidades e limites do parallax.
- `backend/content/taxonomy.ts`: tipos e categorias com nome traduzível e SVG obrigatório; a página usa as categorias do tipo `project`.
- `projects/styles/project-hero.css`: altura dos panoramas, posição da base, opacidade da névoa e composição responsiva.
- `projects/utils/hero-parallax.ts`: scroll e mouse com interpolação temporal, pausa por visibilidade e limpeza na navegação Astro.

Ordem: céu `Hero_Main_Background.webp` (0.05), `Project_Hero_MainFlorest.webp` (0.15), `Project_Hero_Fog.webp` (0.25), `Project_Hero_Florest.webp` (0.40), logo e categorias. Somente os três assets fornecidos compõem a floresta; nenhuma árvore procedural, montanha, ruína, pedra ou imagem adicional foi criada. Os originais PNG estão em `RAW/images/`; os WebP públicos foram codificados por FFmpeg/libwebp e mantêm transparência.

Os panoramas têm canvas transparente de 2172 × 724. Os fundos repetem horizontalmente na proporção original e com altura limitada a 380–560px; o topo transparente mantém os pinheiros na base. Ultrawide acrescenta repetições, sem ampliar a floresta para cobrir a viewport. `getImage` prepara derivados responsivos WebP dos assets públicos durante a geração do site; os PNG de origem ficam em `RAW/images/`.

Margem horizontal de 64px por lado cobre os deslocamentos: mouse de até ±20px antes da profundidade e névoa independente de ±24px. Scroll limitado a 100px antes da profundidade; deslocamentos verticais mantêm as bases além da borda inferior. A névoa usa opacidade 0.16 e animação de 110s por percurso. Não há glow nem filtros nos pinheiros.

Mobile/toque usa 24% do scroll, sem mouse. `prefers-reduced-motion` desativa parallax e névoa; a cena permanece visível sem JavaScript. Logo e navegação permanecem estáveis. A animação pausa fora da viewport e com a aba oculta.

## Validação registrada

Inspeção estática de imports, assets, destinos das categorias e catálogos EN/PT-BR com 52 mensagens por idioma. Após o ajuste radial, estrutura de logo/navegação, posições proporcionais, foco e regras mobile conferidos nos fontes. Após a troca da logo, Graphify atualizado por AST local: 373 nós e 853 arestas; quinze avisos conhecidos de extração parcial Astro. Relações importantes conferidas nos fontes.

Aplicativo, navegador, testes, check e build não executados, conforme CodeMode. Composição, emendas das repetições em ultrawide, recortes, contraste, carregamento dos derivados WebP, navegação por âncoras e movimento ainda precisam de inspeção em execução.

Após ampliar o conteúdo e remover o teto de altura, regras desktop/mobile, dimensões responsivas da imagem e manutenção das âncoras conferidas nos fontes. `graphify update .` executado por AST local, sem mudança de topologia (373 nós e 853 arestas), com os mesmos quinze avisos Astro. Comparação estática com o header e com as alturas dos outros heroes; resultado visual ainda não observado.

## Controlador compartilhado com Services

A partir da hero lunar de Services, o cálculo do movimento está em
`frontend/utils/hero-parallax.ts`. `projects/utils/hero-parallax.ts` permanece
como adaptador com os mesmos parâmetros e seletores. Alterações no controlador
compartilhado afetam as duas cenas; o layout e os assets dos projetos continuam
independentes. Esta extração foi conferida estaticamente, sem execução do site.

## Cadastro compartilhado de categorias

Em 2026-11-03, a página passou a consumir o mesmo cadastro de nomes e SVG da pesquisa. Conferidos estaticamente o repasse de locale, as âncoras derivadas dos IDs e as regras de órbita/grade. Graphify atualizado por AST local: 440 nós, 1.048 arestas e dezenove avisos de extração parcial Astro. A composição com sete categorias e o modo grade para novos cadastros ainda precisam de inspeção visual; aplicativo, testes e build não foram executados.
