# Hero do serviço Landing Page

## Rota e responsabilidades

`ServicePage.astro` usa `LandingHero` apenas para `landing-page`, em EN e PT-BR,
respeitando a base de publicação. As demais ofertas mantêm seu template.

- `LandingHero.astro`: hero integral, integração da seção arquitetônica e bloco comercial seguinte.
- `LandingConstruction.astro`: abertura editorial, quatro capítulos da construção
  e encerramento, orientados pelos textos EN/PT-BR.
- `styles/landing-construction.css`: composição editorial e animações nativas de scroll.
- `LandingOfferScene.astro`: conversa ilustrativa no WhatsApp, cliente desenhado
  em SVG e a mesma coleção de papelaria renderizada no computador e no celular.
- `config/landing.ts` e `public/i18n/landing.*.json`: conteúdo localizado tipado.
- `utils/landing-timeline.ts`: estados puros derivados do progresso do scroll.
- `utils/landing-hero.ts`: medidas, RAF compartilhado, observers e limpeza.
- `styles/landing-hero.css`: enquadramento, profundidade e transforms.

Não há dependências novas, imagens remotas, Canvas ou temporizadores. A loja de
papelaria e a conversa são fictícias e identificadas como ilustração; não
representam vendas, depoimentos ou resultados reais.

Os produtos usam desenhos de caderno, lápis e planner, sem marca fictícia própria.
A iluminação combina preto/índigo, violeta e magenta discreto, seguindo a atmosfera
de `Hero_Main_Background.webp` e os acentos do design system. O WhatsApp mantém
suas cores reconhecíveis. Nomes da loja e do kit seguem a localização EN/PT-BR.

## Três capítulos reversíveis

O hero tem 440svh. O cenário sticky ocupa toda a largura e a altura disponível
abaixo do cabeçalho (85px; 73px até 959px). Os textos comerciais e os CTAs reais
ficam depois da seção arquitetônica, em `#landing-next`.

1. **Comparação (0–18%)**: mensagem de produto no WhatsApp à esquerda e vitrine
   organizada à direita. O cliente permanece oculto. Os dois painéis flutuam
   suavemente em repouso, com fases diferentes; o início do scroll já produz
   um pequeno deslocamento, sem antecipar as perguntas ou a troca de capítulo.
   Até 767px, a comparação fica empilhada: conversa acima e vitrine abaixo,
   separadas por uma linha horizontal ao centro, com telas ampliadas.
2. **Dúvidas (18–59%)**: a conversa cresce, o cliente com celular aparece e quatro
   perguntas surgem progressivamente entre 31–51%. Em telas com pouco espaço,
   a conversa acompanha as perguntas para manter as últimas mensagens visíveis.
   A cena permanece em pausa antes da solução.
3. **Vitrine (59–100%)**: conversa e dúvidas cedem lugar ao cliente no computador,
   com a vitrine também no celular. Entre 77–96%, as duas telas percorrem os
   detalhes e os quatro produtos da coleção. A cena final permanece até a saída.

A faixa narrativa inferior e a indicação de rolagem foram removidas. As perguntas
na conversa e os pensamentos dos personagens continuam localizados em EN/PT-BR.
Toda mudança acompanha o progresso, inclusive ao voltar no scroll.

## Medidas e desempenho

O controlador calcula início e distância útil na montagem e no redimensionamento.
Cada viewport (conversa, desktop e celular) informa seu próprio conteúdo; o
controlador mede o overflow real e guarda a distância em variáveis CSS. A conversa
se desloca conforme as perguntas aparecem; as duas vitrines usam o mesmo progresso
de navegação e suas próprias distâncias, evitando revelar espaço vazio ao final.

O listener de scroll é passivo e agenda no máximo um RAF por quadro. O desenho
altera somente variáveis para transform e opacity, sem leituras de geometria.
ResizeObserver acompanha o painel, as viewports e os conteúdos, incluindo mudanças
no tamanho do texto. IntersectionObserver e a visibilidade do documento suspendem
atualizações fora da área visível. Listeners, observers e RAF são limpos na troca
Astro; `pageshow` recalcula as medidas após restauração.

A flutuação inicial usa a propriedade CSS `translate`, independente do `transform`
da timeline, sem RAF contínuo. Sua amplitude é de 6px no desktop e 3px no mobile,
desaparecendo junto com a comparação. A animação pausa fora da área visível ou
com o documento oculto e é desativada com movimento reduzido. O deslocamento
inicial do scroll pertence à timeline pura e permanece reversível.

## Acessibilidade e continuidade

A cena tem descrição acessível localizada. Os desenhos, mensagens fictícias,
cursores e botões ilustrativos ficam fora da árvore de interação; não competem
com os links comerciais reais. “Quero minha landing page” leva ao formulário
localizado de serviços em `#quote`; “Ver demonstração” leva à própria animação.

Sem JavaScript, sem observers ou com movimento reduzido, o cenário final aparece
estático no fluxo, com o cliente e as duas telas.
O offset do menu, o tamanho dos dispositivos e a composição têm ajustes mobile
e para paisagem com pouca altura. A página mantém a condição comercial existente.

## Seção 02 — Por trás da transformação

A seção entra imediatamente após o cenário cinematográfico e antes da timeline
de contratação e do bloco comercial, sem alterar a timeline da Hero.
Planejamento, maquete, construção e casa finalizada formam uma narrativa única.
Abertura e encerramento tipográficos usam os tokens existentes, sem cards.

No desktop, fotografias grandes alternam entre esquerda e direita em uma grade
assimétrica. A casa finalizada amplia a composição, preservando a entrada e o
caminho sem recorte. Os capítulos não exibem rótulos numerados. Até 767px, cada
capítulo segue a ordem do HTML: título, fotografia e descrição. As proporções originais reservam o espaço das
imagens; não há telas sticky ou distâncias artificiais de rolagem nesta seção.

O primeiro arquivo já existe em WebP em public/images. Os outros três foram
encontrados como PNG em RAW/images; cópias com os nomes originais ficam em
frontend/paginas/services/assets para integrar a publicação sem depender de RAW,
que é ignorado pelo Git. Astro Image está configurado para gerar WebP responsivo
com quatro larguras por fotografia, sizes, dimensões intrínsecas, loading lazy
e decoding async. O build de validação da timeline de contratação gerou as versões
WebP dessas fotografias. Nenhuma imagem externa ou nova foi criada.

View timelines CSS vinculam a entrada de cada elemento ao scroll: fotografias
e textos surgem com fade-in completo (opacidade 0 → 1). As fotografias
se revelam de cima para baixo com recorte inferior discreto (24% → 0), deslocamento
vertical (-40px → 0) e escala 1.04 → 1. Títulos e descrições descem suavemente
até sua posição final; a descrição termina sua entrada um pouco depois.
Os estados estabilizam para leitura; após 20% da saída da viewport, fotos e textos
desaparecem gradualmente até opacidade zero. Entrada e saída se revertem ao subir.
O fade-out não interfere na opacidade da entrada antes de seu intervalo.
No mobile e em navegadores sem view timelines, um IntersectionObserver alterna
fade-in/fade-out de 550ms numa faixa interna da viewport (margens de 8%). Não depende
da porcentagem visível da foto, permitindo imagens mais altas que a tela.
O deslocamento no mobile é de -12px; não há recorte ou escala animados nesse modo.
Alterações de largura e preferência de movimento reconfiguram o efeito; observers
e listeners são liberados antes de navegações Astro. Não há listener de scroll
nem dependência adicional. Com movimento reduzido ou na impressão, o conteúdo
permanece visível e estático. Sem JavaScript,
todo o conteúdo, traduções e alternativas das imagens continuam no HTML.

## Validação anterior da seção arquitetônica — 2026-11-15

Revisão estática dos componentes, traduções, estados, medidas, seletores e diff.
Aplicativo, navegador, parsers, testes, typecheck e build não foram executados.
Enquadramento, legibilidade, ritmo e fluidez em dispositivos reais permanecem
pendentes de observação visual; não há medição de FPS, CLS ou Lighthouse.

## Da ideia à publicação

`LandingProcess.astro` entra após `LandingConstruction` e antes do bloco comercial
com o investimento. Os textos de Briefing, Estrutura, Desenvolvimento e Publicação
ficam em `landing.pt-br.json` e `landing.en.json`, com o prazo de 7 a 30 dias corridos.

A lista ordenada usa três colunas no desktop: título, círculo e descrição. Até
767px, a linha fica à esquerda e os textos se empilham à direita. Não há cards ou
assets externos. O fundo usa tons roxos da Hero em gradientes de nebulosa, com SVG
topográfico inline: curvas de nível e trajetos pontilhados discretos. A decoração
não recebe foco/cliques, é ignorada por leitores de tela e não exige JS, requisições
ou animação adicional. Gradientes nas extremidades integram a seção ao fundo preto.
A hierarquia é h2 para a seção e h3 para cada etapa; a linha e os
círculos são decorativos. Todo o conteúdo está no HTML inicial.

`landing-process.ts` mede os centros reais dos quatro círculos e posiciona a linha
entre o primeiro e o último. O progresso é a distância entre o primeiro centro e
55% da altura da viewport, dividida pela distância até o último centro, limitada
ao intervalo 0–1. A última etapa alcançada fica ativa; os círculos já percorridos
continuam roxos. Subir a página reverte ambos os estados.
Somente a etapa ativa exibe título e conteúdo no modo animado: entrada e saída
com opacidade e deslocamento vertical de 18px em 420ms, também no mobile. Pontos
inativos ficam com 28% de opacidade. Sem JS, com movimento reduzido e na impressão,
todos os textos permanecem visíveis.

Scroll passivo agenda no máximo um requestAnimationFrame por quadro. As leituras
de geometria precedem as escritas de estilos; a linha usa scaleY. IntersectionObserver
limita atualizações à proximidade da seção e ResizeObserver acompanha mudanças de
layout. Não há loop contínuo ou temporizadores de progresso. Navegações Astro
liberam observers, listeners e RAF. Sem JS, sem observers ou com movimento reduzido,
a lista permanece visível e estática.

### Validação da timeline — 2026-11-15

- `npm run check`: 129 arquivos, zero erros, avisos ou hints.
- `npm run build`: concluído, 26 páginas; aviso Vite sobre importação estática e
  dinâmica de `Rick_Logo_Transparent.webp`, fora desta mudança.
- Chrome headless via CDP, usando o servidor local: larguras 1440, 768, 390 e 320px;
  quatro etapas nos dois sentidos do scroll, centros alinhados à linha com erro
  inferior a 1px e ausência de overflow horizontal.
- Capturas desktop e mobile inspecionadas; movimento reduzido mantém estado
  estático e conteúdo visível. Sem JavaScript, os quatro títulos e descrições
  continuam disponíveis em PT-BR e EN. Árvore de acessibilidade confirma h2/h3.
- Graphify atualizado por AST local: 735 nós e 1709 relações; 44 avisos de extração
  parcial Astro. Sem dependências adicionais. Não foram medidos FPS, CLS ou Lighthouse,
  nem executados testes em aparelhos físicos.

### Fundo topográfico — 2026-11-15

- Fundo roxo escuro restrito à timeline, mantendo geometria, conteúdo e progresso.
- SVG inline validado como XML: 18 paths, `aria-hidden="true"`, `focusable="false"`.
- Revisão estática e diff; grafo AST local atualizado (737 nós/1711 relações,
  44 avisos de extração parcial Astro). Nesta alteração visual não foram executados
  navegador, testes, check ou build; aparência final em execução ainda não observada.

## Pacotes de Landing Page — 2026-11-15

`LandingPricing.astro` entra após `LandingProcess`, antes da chamada final. A seção
usa três cards em telas grandes e uma coluna até 1023px, com preços em destaque,
lista de benefícios e condições de escopo. O Profissional recebe selo, superfície
e borda diferenciadas usando os tokens existentes. Hover discreto, foco visível e
movimento reduzido são tratados por `landing-pricing.css`; o conteúdo é HTML
renderizado no servidor e não depende de JavaScript para aparecer.

`config/landing.ts` centraliza IDs, desenvolvimento, mensalidades e período inicial
de seis meses em uma estrutura tipada. Os totais são calculados: Essencial R$ 1.000,
Profissional R$ 2.000 e Avançado R$ 2.700. Nomes, benefícios, domínio, custos externos,
renovação, entrega e demais condições ficam nos arquivos `landing.pt-br.json` e
`landing.en.json`. A antiga indicação isolada de preço foi removida.

Cada contratação segue para a página localizada de serviços com
`?landingPlan=<id>#quote`. O formulário existente aceita apenas os IDs das opções
renderizadas, apresenta o pacote e seus valores, permite trocar a escolha e inclui
esses dados na mensagem preparada para o WhatsApp. A seleção integra o rascunho
local já existente; nome, ideia, referências e prazo são preservados. Nenhum backend,
checkout ou dependência foi adicionado.

Validação desta mudança: leitura dos fontes e do fluxo, parsing dos dois JSON,
comparação das chaves de tradução e revisão de whitespace pelo Git. Graphify
atualizado por AST local: 739 nós e 1722 relações, com 45 avisos de extração parcial
Astro. Não foram executados app, navegador, check, build ou testes nesta mudança;
responsividade visual e funcionamento em execução permanecem sem nova observação.

### Ajustes dos pacotes — 2026-11-15

Profissional apresenta “Site cinematográfico”; Avançado apresenta backend com
512 MB de RAM e página de controle de conteúdo, com descrição alinhada ao
gerenciamento de conteúdos. Textos sincronizados em PT-BR/EN. Removidos o
subtítulo da seção e o bloco “Clareza antes de começar”, incluindo traduções e
estilos exclusivos. Valores, totais e fluxo de seleção dos pacotes preservados.

JSON e paridade estrutural dos idiomas conferidos; revisão estática dos fontes,
referências e whitespace concluída. Graphify atualizado por AST local (740 nós,
1723 relações; 45 avisos conhecidos de extração parcial Astro). Sem execução
de aplicativo, navegador, testes, check ou build nesta alteração.

### FAQ — 2026-11-15

`LandingFaq.astro` entra imediatamente após `LandingPricing` e antes do handoff de
contratação. As oito perguntas e respostas ficam em `faq` nos JSON PT-BR/EN; a
primeira contextualiza os valores no plano Profissional, preservando os outros
pacotes. O CTA equivalente existente logo depois é reutilizado, sem novo botão.

`landing-faq.css` usa apenas os tokens existentes: fundo escuro, iluminação roxa
difusa no alto à direita via gradientes estáticos, perguntas sem cards e divisórias
finas. Tipografia e espaçamentos respondem à largura disponível.

Sem JavaScript, `details`/`summary` com `name` oferecem divulgação nativa e
exclusividade nos navegadores compatíveis. O aprimoramento `landing-faq.ts`
mantém uma resposta expandida, anima altura/opacidade por 260ms e sincroniza
`aria-expanded` com a intenção de abertura/fechamento. A medição ocorre somente
na interação; não há listener de scroll próprio. Animações e listeners são
liberados antes da troca de página. Movimento reduzido abre e fecha imediatamente;
a entrada do título e da lista reutiliza `mountScrollReveal`.

Validação efetivamente realizada: parsing JSON, oito perguntas/respostas completas
em cada idioma, paridade das chaves, revisão estática de imports, fluxo, semântica,
CSS responsivo e whitespace. Graphify AST local: 745 nós/1732 relações, 46 avisos
conhecidos de extração parcial Astro. Sem aplicativo, navegador, testes, tipagem
ou build nesta mudança; fidelidade visual e comportamento em execução pendentes.
