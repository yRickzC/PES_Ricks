# Hero de Services / Products

## Composição

`frontend/paginas/services/components/ServiceHero.astro` substitui o cabeçalho
genérico de Services nas duas rotas existentes. Usa o céu compartilhado, a lua
`Ladding_Hero_Moon.webp` e exatamente `Service_Hero_Rock0.webp`,
`Service_Hero_Fog.webp`, `Service_Hero_Rock1.webp` e `Service_Hero_Rock2.webp`, nessa
ordem. Os PNG originais estão preservados em `RAW/images/`; os arquivos públicos
foram convertidos para WebP por FFmpeg/libwebp.

A lua central tem largura de 640–920px no desktop e 580–714px no mobile,
incluindo a área transparente do asset. Seu centro fica em 68% da altura no
desktop e 70% no mobile, aprofundando a sobreposição atrás das rochas.
A luz violeta vem da própria imagem,
com brilho e saturação estáticos moderados, sem halo adicional ou rotação.
Rochas distantes com contraste reduzido; bases escalonadas e foreground mais
escuro se sobrepõem para formar a paisagem. Uma transição curta na base liga
a cena ao fundo global. Texto e ações ficam acima da cena, sem painel.

## Parâmetros e movimento

`services/config/hero.ts` centraliza fontes, ordem, opacidade, profundidade,
largura, escala e posição desktop/mobile. O valor `y` é o ponto de ancoragem
da imagem: centro para a lua e base para as rochas. As larguras mínimas e o
overscan lateral preservam margem para o movimento; não esticar as imagens
verticalmente. Os atributos `sizes` acompanham essas larguras.

Profundidades iniciais: céu 0.05, lua 0.10, Rock0 0.15, névoa 0.22, Rock1 0.30,
Rock2 0.48. O percurso de scroll tem limite de 80px antes da profundidade.
No mobile ou com ponteiro de toque, o movimento progride na vertical ao longo
da altura da hero e usa até 65% do percurso. No desktop com ponteiro preciso,
o mouse desloca a lua em aproximadamente 1.2px por eixo.

O controlador antes usado por Projects foi extraído para
`frontend/utils/hero-parallax.ts`. Projects mantém seu adaptador, parâmetros e
seletores. Services usa a mesma interpolação temporal, requestAnimationFrame
sob demanda, listeners passivos, leitura de limites invalidada por eventos,
pausa fora da viewport/aba oculta e limpeza em `astro:before-swap`.

A névoa tem opacidade 0.12 e percorre 36px horizontalmente em 120s, com apenas
3px de oscilação vertical. A animação pausa com a cena e fica desabilitada no
mobile/toque. `prefers-reduced-motion` mantém todos os planos estáticos,
inclusive a névoa. Não há filtros animados nem hidratação de framework.

## Conteúdo e imagens

As mensagens da hero seguem `Messages` e os catálogos EN/PT-BR. O CTA
principal aponta para o seletor de serviços em `#services` e o secundário
leva a Projects no idioma atual.

`ServiceCatalog.astro` usa as categorias da taxonomia e catálogos próprios
em EN/PT-BR. A seleção usa controles nativos e CSS. Os cards exibem formatos
de serviço sobre a mesma imagem de céu da hero.

`SiteImage` prepara variantes responsivas com `astro:assets`; os originais PNG
estão em `RAW/images/`. As imagens da primeira tela usam eager; somente a lua recebe
prioridade alta. A geração dos derivados depende de um build futuro.

## Validação e ajustes pendentes

Inspeção estática dos fontes, imports, assets, idiomas e whitespace. Grafo
atualizado por AST local, sem modelos ou serviços externos. Conforme CodeMode,
aplicativo, navegador, testes, check e build não foram executados.

Composição final, contraste sobre a lua, três silhuetas em telas ultrawide,
recortes durante scroll/mouse, zoom, navegação por teclado e custo dos
derivados ainda precisam ser observados em execução. Afinar primeiro as
posições e larguras da configuração; preservar os três planos, a distância
entre conteúdo e foreground e a margem lateral de movimento. A altura mínima
acompanha a viewport após o header, sem teto; o conteúdo pode aumentar a seção.
