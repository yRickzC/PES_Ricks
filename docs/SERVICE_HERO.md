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
principal abre o WhatsApp configurado em `socialLinks`, com uma mensagem de
pedido de orçamento no idioma atual. O secundário aponta para `#services`,
com rolagem suave global e movimento reduzido respeitado. Sem WhatsApp
configurado, o pedido leva ao formulário local em `#quote`.

`ServiceCatalog.astro` usa as categorias da taxonomia e catálogos próprios
em EN/PT-BR. A seleção usa controles nativos e CSS. Os cards exibem formatos
de serviço sobre a mesma imagem de céu da hero. `ServicesPage.astro` mantém um
único cenário compartilhado apenas pelo catálogo e pelo roadmap, dentro de
`.service-environment`. Projetos customizados fica fora desse contêiner e usa
fundo preto sólido (`--color-bg-0`), sem imagem. O layout global não recebe
o cenário; o rodapé mantém seu fundo habitual. A imagem otimizada acompanha a viewport com CSS sticky,
sem esticar pela altura da página, duplicar imagens ou adicionar JavaScript.
`SiteImage` inclui automaticamente `ShootingStars.astro` sempre que renderiza
`Hero_Main_Background.webp`, sem adicionar um wrapper à imagem. Assim, a hero de
Serviços, o catálogo/roadmap e as outras heroes que reutilizam o céu recebem o
mesmo efeito. A cortina de navegação, que usa uma imagem direta, inclui o componente
explicitamente; sua espera considera somente animações finitas para não aguardar
os loops decorativos. Quatro rastros de estrelas atravessam o céu com transform/opacity
em CSS e ciclos diferentes de 5–8s; no mobile ficam dois. Rastros de 2px, núcleo
luminoso e brilho estático discreto tornam a passagem perceptível mesmo na camada
escurecida da hero. Cada passagem ocupa 42% do ciclo. A decoração não recebe
cliques, fica oculta da árvore acessível e só anima sem preferência por movimento
reduzido. Os gradientes existentes também cobrem as estrelas. O aviso de formatos
possíveis abaixo dos cards foi removido nos dois idiomas.
Catálogo e roadmap são transparentes; painéis e campos mantêm suas superfícies legíveis.
Gradientes nas extremidades do cenário suavizam a entrada a partir do preto e
a saída para o formulário preto, sem colocar imagem em Projetos customizados. Resumos por categoria explicam
o público e os benefícios; os cards iniciam um pedido de orçamento no WhatsApp
com o nome da solução. `getServiceQuoteUrl`, na configuração existente do
catálogo, centraliza esses links e sua mensagem localizada. As páginas de
detalhe em construção permanecem registradas, mas não são o destino dos CTAs
comerciais.

A sequência da página é hero → exemplo real → soluções → processo → projeto
customizado. O exemplo real é o próprio portfólio, com links para a Home
localizada e o repositório confirmado no remoto Git, que abre em nova aba.
O rótulo de autoria/projeto pessoal foi removido. Não há casos de clientes,
depoimentos ou métricas inventados. O bloco
editorial usa os tokens e o FadeInUp compartilhados, sem hidratação adicional.

O roadmap preserva suas cinco ilustrações e navegação, com proposta antes do
desenvolvimento e manutenção conforme escopo após a entrega. O formulário
continua em três etapas, mantém o rascunho no navegador e prepara no WhatsApp
nome, descrição, referências e prazo preenchidos. O parágrafo fixo de convite
foi removido; as 50 frases animadas em cada idioma convidam a descrever o negócio,
entender a necessidade e conversar sobre escopo, prazo e proposta. Título do
formulário e alternativa acessível permanecem disponíveis sem depender da animação.

`SiteImage` prepara variantes responsivas com `astro:assets`; os originais PNG
estão em `RAW/images/`. As imagens da primeira tela usam eager; somente a lua recebe
prioridade alta. A geração dos derivados depende de um build futuro.

## Validação e ajustes pendentes

Em 2026-11-08, o catálogo passou a conter três categorias com três ofertas cada:
Sites (site institucional, landing page e loja virtual), ERP e sistemas (ERP,
CRM e portal interno) e Apps mobile (delivery, agendamentos/eventos e vendas).
Automação foi removida do catálogo, dos seletores CSS, da taxonomia de busca
e das traduções EN/PT-BR. Os slugs das páginas estáticas acompanham as novas
ofertas; as ilustrações SVG de CRM e aplicativos usam o estilo existente.
Os cards continuam iniciando o orçamento no WhatsApp com a solução escolhida.
Alteração conferida estaticamente, sem executar aplicativo, testes ou build.

Em 2026-11-07, a pedido do usuário, a página local de Serviços foi aberta no
navegador. Rastros visíveis foram observados na hero e no catálogo após aumentar
espessura, contraste e frequência; animações CSS em execução confirmadas no DOM,
sem erros no console consultado. O formulário preserva fundo rgb(7, 7, 10).
Esta verificação desktop não substitui os testes, build ou revisão mobile pendentes.

Inspeção estática dos fontes, imports, assets, idiomas e whitespace. Grafo
atualizado por AST local, sem modelos ou serviços externos. Conforme CodeMode,
aplicativo, navegador, testes, check e build não foram executados.

Composição final, contraste sobre a lua, três silhuetas em telas ultrawide,
recortes durante scroll/mouse, zoom, navegação por teclado e custo dos
derivados ainda precisam ser observados em execução. Afinar primeiro as
posições e larguras da configuração; preservar os três planos, a distância
entre conteúdo e foreground e a margem lateral de movimento. A altura mínima
acompanha a viewport após o header, sem teto; o conteúdo pode aumentar a seção.
