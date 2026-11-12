
2026-11-04 — Hero de Projetos com seis áreas e ícones Lucide; filtros ligados ao catálogo multicategoria, EN/PT e composição original preservados. 100 testes passaram e build concluído; check ainda aponta dois erros em arquivos inalterados do Blog.

2026-11-04 — Bioma Crystal Cave integrado à categoria Web de Projects com cinco assets, parallax compartilhado, névoa suave, carregamento sob demanda e enquadramento mobile por camada. Build passou e navegação/carregamento/movimento reduzido conferidos no Chromium; dois erros de tipos anteriores no Blog permanecem.

2026-11-04 — Corrigido o escopo da Crystal Cave: somente seção Web abaixo do Hero. Hero restaurado integralmente; composição da seção conferida no Chromium desktop/mobile e build concluído.

2026-11-04 — Projects ganhou cabeçalhos com ícones das categorias e estado vazio com o mesmo cachorro do Blog. EN/PT e limpar filtros conferidos no Chromium, assim como o Blog e o layout mobile. Build concluído; Hero permanece intacto.

2026-11-04 — Cinco novos biomas de Projects implementados com 25 artes PNG, WebP responsivo, transições escuras e parallax compartilhado. Crystal e Hero preservados. 100 testes passaram; builds local/Pages e seis ambientes desktop/mobile verificados no Chromium, incluindo lazy, reduced motion e fallback sem JS. Alterações locais.

2026-11-04 — Consolidação da conversa: categorias do Hero (03f3e67) e Crystal Cave na seção Web abaixo do Hero (393a305) foram enviadas ao GitHub Pages. Estado vazio de Projects passou a reutilizar o mascote do Blog e exibir ícone/título da categoria. O prompt mestre orientou cinco biomas adicionais (Game Dev, Low-Level, Mobile, Products e Machine Learning), cada um com cinco assets e filtros reais. Essas mudanças mais recentes estão implementadas localmente, ainda sem commit/push; validação final: 100 testes e builds concluídos, seis biomas conferidos em desktop/mobile, com dois erros de tipos preexistentes no Blog.

2026-11-04 — Projects simplificado: removidos o título redundante “Explore Projects” e o link “All categories” abaixo do Hero. A categoria ativa pode ser desmarcada ao clicar nela novamente; “Clear filters” continua restaurando todas as áreas. Build estático e Chromium conferiram o layout, o filtro Web e o reset das seis áreas sem erros JavaScript.

2026-11-04 — Transição do Hero para os biomas de Projects suavizada com uma faixa horizontal escura e divisor violeta discreto, esmaecidos para os dois lados da emenda. Ajuste responsivo em CSS; build de oito páginas passou e as capturas desktop/mobile no Chromium confirmaram a composição sem overflow ou erros JavaScript.

2026-11-04 — Projects ganhou uma faixa preta de 80 a 160 px entre a floresta e o primeiro bioma. Ajuste conferido no CSS.

2026-11-04 — Projects passou a exibir o cachorro e o convite para escolher uma categoria em fundo preto. Só o bioma selecionado aparece e os ícones ao redor da logo ganharam contornos quadrados transparentes.
2026-11-04 — Convertidas Dog_Worker e Dog_Sad de RAW/images para WebP lossless em public/images com FFmpeg; dimensões e transparência preservadas, reduções de 41,4% e 39,7%.

2026-11-04 — Blog sem publicações agora mostra Dog_Sad com mensagem própria em PT-BR e EN. O cachorro original aparece quando a busca não encontra posts em um catálogo com conteúdo. Conferido estaticamente.
2026-11-04 — Dog_Thinking (nome inglês já correto) convertido de RAW/images para WebP lossless em public/images; 1254 × 1254, alpha preservado e redução de 41,3%.

2026-11-04 — Serviços / Produtos passou a exibir Dog_Worker com o aviso de construção em PT-BR e EN abaixo da hero. Conferido estaticamente.

2026-11-04 — Dog_Thinking aplicado ao aviso de seleção de categoria em Projects. Referência conferida no código.

2026-11-04 — Degradê curto entre a floresta e a faixa preta em Projects. CSS conferido estaticamente.

2026-11-04 — Removidos o título e a descrição acima do Dog_Worker em Serviços. O aviso de construção permanece.
2026-11-04 — Controlador interativo do Blog deixou de importar em runtime o módulo que carrega JSON de `public/i18n`; formatador de contagem extraído para módulo puro e reexport preservada. Conferido estaticamente; aviso em servidor ainda sem validação.

2026-11-05 — A pedido do usuário, textos de Início, Blog, Projetos e Serviços foram reescritos em PT-BR e inglês com voz mais pessoal e direta, removendo slogans e termos artificiais. Botões, descrições e estados vazios revisados; contador do blog padronizado para posts e expectativa existente ajustada. JSON, paridade, marcadores e diff conferidos estaticamente; Graphify atualizado por AST local sem alteração de topologia. Aplicativo, navegador, testes e build não executados conforme CodeMode.

2026-11-05 — Captura mostrou “O que andoconstruindo.” no título do início. Os spans inline não tinham espaço explícito entre eles; acrescentada expressão de espaço na marcação compartilhada por PT-BR e EN. Conferência estática e diff sem erros; Graphify por AST local sem mudança de topologia. Navegador, aplicativo, testes e build não executados conforme CodeMode.

2026-11-05 — Removidas as faixas de categorias acima dos títulos do Início, Blog e Serviços nos dois idiomas, incluindo “SISTEMAS / SOFTWARE / EXPERIMENTOS”. Estilos e traduções sem uso excluídos; nome acessível da seção de serviços preservado com a tradução de Serviços. Conferência estática de referências, JSON, interface e diff concluída; Graphify atualizado por AST local. Aplicativo, navegador, testes e build não executados conforme CodeMode.

2026-11-05 — Padronizados os títulos das abas em português e inglês no formato “Nome da página — Rickz”. O Início ganhou título curto e os artigos mantêm o título de cada publicação. Catálogos, rotas e layout conferidos estaticamente. Graphify atualizado por AST local. Navegador, testes e build não executados.

2026-11-05 — Trocado o travessão por hífen nos títulos das abas: “Nome da página - Rickz”. Conferido no código.

2026-11-05 — Adicionado fade nativo de 500 ms entre as páginas nos dois idiomas, incluindo artigos, com respeito à preferência de movimento reduzido. Layouts e CSS conferidos estaticamente. Validação visual pendente.

2026-11-05 — A pedido do usuário, o fade entre páginas passou de 500 ms para 1.200 ms para dar mais tempo ao carregamento. Duração fixa conferida no CSS. Validação visual pendente.

2026-11-05 — O usuário enviou uma referência para a transição com a logo. A logo agora desce sobre o fundo violeta, recebe um brilho enquanto as imagens estáticas carregam e sai por baixo com o fundo em ritmos diferentes. A espera tem limite de 8 segundos. Sintaxe do script e integração com o layout conferidas estaticamente. Validação visual pendente.

2026-11-05 — O usuário relatou que o fundo da transição aparecia de uma vez ao navegar. Fundo e logo agora entram caindo do topo em ritmos diferentes e só começam a saída depois da pausa central. Sintaxe e fases conferidas nos fontes. Validação visual pendente.

2026-11-05 — O usuário esclareceu que a queda deve acontecer antes de abrir a página de destino. O clique agora fecha a cortina sobre a página atual e só depois ativa o link. O destino retoma a cortina fechada e a libera após o carregamento. Código conferido estaticamente. Validação visual pendente.

2026-11-06 — A pedido do usuário, a rolagem no celular passou a acionar o parallax no Início e ganhou um percurso mais perceptível no Blog, em Projetos e em Serviços. Os biomas de Projetos começam a se mover quando alcançam o meio da tela. Sintaxe e diff conferidos, com Graphify atualizado por AST local. Validação visual pendente.

2026-11-06 — A página de Serviços ganhou um seletor de categorias na faixa escura e cards ilustrativos que mudam com a seleção sobre o céu da hero. Integração e traduções conferidas estaticamente, com Graphify atualizado por AST local. Validação visual pendente.

2026-11-06 — O usuário mostrou uma falha SSR ao carregar o catálogo. A página passou a importar o catálogo antes de o arquivo existir. Com os caminhos presentes, a página foi sinalizada ao watcher do Vite para nova resolução. Confirmação no servidor pendente.

2026-11-06 — A pedido do usuário, Consultoria saiu do seletor e dos cards da página de Serviços. As quatro categorias restantes foram conferidas estaticamente nos dois idiomas.

2026-11-06 — A página inicial ganhou o cachorro Work e a mensagem “Estamos trabalhando nisso!” logo abaixo da hero, com versão em inglês. Asset e traduções conferidos estaticamente.

2026-11-06 — WhatsApp adicionado ao menu social com o número configurado em `.env` e `.env.example`.

2026-11-06 — Perfil do YouTube `@yRickz` ligado ao menu social pela variável `PUBLIC_YOUTUBE_URL` nos arquivos de ambiente.

2026-11-06 — Perfil do Instagram `@yrick_c` ligado ao menu social pela variável `PUBLIC_INSTAGRAM_URL` nos arquivos de ambiente.

2026-11-06 — Serviços ganhou duas seções abaixo do catálogo. A primeira explica o processo e o suporte. A segunda prepara o orçamento para WhatsApp ou gera uma mensagem para cópia.

2026-11-06 — “Como funciona” passou para a transição entre a hero e o catálogo. Seletor e cards compartilham o fundo espacial, e o orçamento agora fica em “Projetos customizados”.

2026-11-06 — “Projetos customizados” ganhou um briefing aberto com nome, contato, ideia, prazo e referências. O botão abre o WhatsApp com os dados preenchidos.

2026-11-06 — Removido o campo de contato do briefing, já que o pedido segue pelo WhatsApp. O prazo passou a ser escolhido em um menu opcional.

2026-11-06 — A introdução de “Projetos customizados” passou a alternar 50 frases com efeito de digitação e apagamento, com controle de pausa e respeito à preferência por movimento reduzido.

2026-11-06 — As categorias do catálogo passaram a deslizar em uma faixa horizontal no celular. Os cards de resultado ganharam uma sombra suave.

2026-11-06 — “Como funciona” virou um roadmap interativo com cinco etapas. As ilustrações em SVG se transformam ao navegar entre Problema, Contato, Planejamento, Produção e Entrega.

2026-11-06 — O formulário de projetos customizados passou a mostrar nome, descrição com referências e prazo em três etapas, com envio do resumo ao WhatsApp.

2026-11-06 — O deploy do Pages expirou após dez minutos em `deployment_queued`/`updating_pages`; repetir apenas o job falho retornou `Deployment cancelled.`. O deploy de uma nova revisão passou, mas o log mostrou que `actions/deploy-pages@v5` limita timeouts maiores a dez minutos; removido o override ineficaz e registrado o incidente.

2026-11-06 — Deploy após a correção publicado no commit `b7365fc`; run [42231538844](https://github.com/yRickzC/PES_Ricks/actions/runs/42231538844) concluiu build e deploy com sucesso.

2026-11-06 — A página inicial ganhou animações de entrada ao rolar. As camadas do hero, os textos, os botões, o cachorro, a mensagem e o rodapé surgem uma vez, com suporte a movimento reduzido.

2026-11-06 — Os desenhos do roadmap passaram a mostrar cenas com cliente e desenvolvedor, mantendo as transformações em SVG. A manutenção pós-entrega passou para a quinta etapa.

2026-11-06 — Corrigido o deploy das redes sociais: como `.env` é ignorado, o workflow agora cria o arquivo a partir de `.env.example` antes do build Astro. O commit `78d334d` foi enviado e o run 42238725921 concluiu build e deploy com sucesso.

2026-11-06 — Os cards de Projetos ganharam borda, sombra e links com setas. Cards com links se elevam ao passar o mouse e mostram foco por teclado. Quando há um único destino, o card inteiro abre o link.

2026-11-06 — As setas do roadmap passaram para as pontas da faixa de etapas, com navegação em loop nos dois sentidos. O desenvolvedor passou a olhar para a esquerda nas cenas de Planejamento e Desenvolvimento.

2026-11-06 — Os cards do catálogo de Serviços ganharam sombra, elevação ao passar o mouse e glow violeta. Cada card passou a levar ao formulário de Projetos customizados.

2026-11-06 — Os cards de Serviços ganharam uma base violeta visível em repouso e efeito de pressão ao clicar.

2026-11-06 — Os botões do formulário de projetos customizados passaram a ocupar toda a linha. O controle de pausa das frases saiu, e o navegador passou a guardar o rascunho e a etapa atual.

2026-11-06 — Os elementos do formulário de projetos customizados ganharam animações individuais de entrada reaproveitando o efeito da Home.

2026-11-06 — A Home reaproveitou o FadeInUp do site em cada elemento da sequência. Céu, lua, névoa e rodapé também ganharam um leve movimento de subida.

2026-11-06 — Projetos passou a reutilizar o FadeInUp da Home. Os itens entram separadamente na primeira vez em que aparecem na tela.

2026-11-06 — O Blog reaproveitou o FadeInUp para a entrada individual de elementos do Hero, da exploração e do estado vazio.

2026-11-06 — Roadmap e catálogo de Serviços ganharam entrada individual com o FadeInUp compartilhado.

2026-11-07 — Os nove cards de Serviços passaram a abrir páginas próprias com o cachorro trabalhando e o aviso de construção, em português e inglês. Cada tela mostra o serviço e permite voltar ao catálogo. Revisão estática e Graphify local concluídos; navegador, build e testes não executados.

2026-11-07 — O usuário reportou 404 ao abrir Landing page. A configuração do Astro passou a observar os arquivos que definem as rotas para atualizar o manifesto durante o desenvolvimento. Revisão estática e Graphify local concluídos; desaparecimento do erro em execução ainda não confirmado, sem executar servidor, build ou testes.

2026-11-07 — Serviços ganhou comunicação comercial em português e inglês, com benefícios por categoria, orçamento direto no WhatsApp e evidência real no próprio portfólio. A sequência agora apresenta soluções, execução, processo e proposta customizada, preservando cenário, parallax, cards, roadmap e formulário de três etapas com rascunho. JSONs, fontes e diff revisados; Graphify atualizado por AST local. Navegador, build, testes e publicação não executados.

2026-11-07 — Home reorganizada sem reconstruir o cenário: apresentação breve, acesso a Projects e contato existente, até três projetos destacados, até três publicações recentes e CTA de Serviços. Dados vêm do catálogo LU das páginas existentes, com traduções e imagens reutilizadas; featured também é aceito em projetos. Catálogo atual vazio mantém as seções de conteúdo ocultas, sem itens fictícios. Aviso de construção retirado apenas da Home; parallax, FadeInUp, header e footer preservados. Fontes, traduções e diff revisados; Graphify atualizado por AST local. Testes escritos, mas aplicativo, navegador, testes e build não executados.

2026-11-07 — O bloco de evidência real do portfólio foi movido para logo abaixo do hero de Serviços, antes do catálogo, nos dois idiomas. Conteúdo, links e animações mantidos. Revisão estática e atualização AST local do Graphify concluídas; aplicativo, navegador, testes e build não executados.

2026-11-07 — O fundo espacial de Serviços foi estendido do catálogo até o fim de Projetos customizados, incluindo o roadmap. Um único cenário compartilhado substitui os fundos pretos entre essas seções, com escala pela viewport e fade apenas no final. Revisão estática e Graphify AST local concluídos; aparência no navegador, testes e build não verificados.

2026-11-07 — A captura mostrou que o céu ainda terminava antes do rodapé de Serviços. O cenário foi elevado ao contêiner do layout que inclui o footer, usando um slot opcional preenchido só em Serviços; removido também o fade preto no fim do formulário. Revisão estática e Graphify AST local concluídos; confirmação visual, testes e build não executados.

2026-11-07 — Correção de interpretação: o usuário queria Projetos customizados preto, sem cenário. O céu foi limitado ao catálogo e roadmap; formulário voltou ao preto sólido e o slot global foi removido. A pedido da nova captura, gradientes suavizam entrada e saída do cenário. Revisão estática e Graphify AST local concluídos; aplicativo, navegador, testes e build não executados.

2026-11-07 — Aumentado o padding inferior do roadmap para dar mais espaço antes de Projetos customizados, preservando gradiente e formulário preto. Ajuste responsivo de 56–96px. Revisão estática e Graphify AST local concluídos; aplicativo, navegador, testes e build não executados.

2026-11-07 — Removidos o rótulo de autoria e o convite fixo em Serviços; GitHub abre em nova aba. As 50 frases animadas em cada idioma agora convidam a explicar a necessidade do negócio e discutir uma proposta. JSONs e fontes revisados; Graphify AST local atualizado. Aplicativo, navegador, testes e build não executados.

2026-11-07 — Removido o aviso de ilustrações abaixo dos cards de Serviços e adicionados rastros suaves de estrelas no cenário do catálogo e roadmap. Efeito CSS com menos estrelas no mobile e desativado com movimento reduzido. Revisão estática e Graphify local concluídos; navegador, testes e build não executados.

2026-11-07 — Estrelas cadentes passaram a acompanhar toda reutilização de Hero_Main_Background.webp, incluindo a hero de Serviços e a cortina de navegação. Componente CSS compartilhado, quatro rastros (dois no celular), movimento reduzido respeitado; loops decorativos excluídos da espera da navegação. Revisão estática e Graphify AST local concluídos; aplicativo, navegador, testes e build não executados.

2026-11-07 — Usuário não enxergava estrelas; navegador confirmou efeito ativo, mas fino e raro demais. Aumentados contraste, espessura e frequência no componente compartilhado. Passagens vistas na hero e no catálogo de Serviços; console sem erros, formulário preto preservado. Graphify AST atualizado; testes, build e revisão mobile não executados.

2026-11-07 — Briefing da Home reconferido e composição refinada: destaques se adaptam à quantidade de projetos, ações ficam alinhadas, posts mantêm formato compacto e miniaturas menores, e o CTA de Serviços ocupa a largura disponível no mobile. Hero, contato, fontes reais, idiomas, cenário e FadeInUp preservados. Catálogo vazio continua ocultando projetos e posts. Revisão estática e Graphify local concluídos; aplicativo, navegador, testes e build não executados.

2026-11-07 — Após o usuário não perceber mudanças, Home aberta no navegador local em desktop e mobile. Novo título, apresentação, botões de projetos/contato e CTA de Serviços estão visíveis. Projetos e posts não aparecem porque não existem documentos LU no catálogo; mantida a regra de ocultar seções vazias. Nenhum código alterado nesta conferência; testes e build não executados.

2026-11-07 — A pedido do usuário, Projetos em destaque e Publicações recentes deixam de ser ocultados quando vazios: avisos traduzidos aparecem com os links das seções e FadeInUp existente. Sem dados fictícios. Conferido no navegador local desktop/mobile, sem transbordamento horizontal ou erros capturados no console. Traduções e diff revisados; Graphify AST local atualizado. Testes e build não executados.

2026-11-07 — Adicionada a quinta seção de conteúdo da Home: 'Da ideia à experiência', entre posts e CTA de Serviços. Três etapas simples explicam a abordagem criativa sem repetir os conteúdos das outras seções. Preservados Hero, dados, avisos vazios e animações; novo componente Astro com layout responsivo e textos EN/PT-BR, sem dependências. Revisão estática e Graphify AST local concluídos; navegador, testes e build não executados.

2026-11-07 — A pedido do usuário, seção de abordagem substituída por Sobre mim, com apresentação de Rick e do laboratório em EN/PT-BR. Home mantém cinco seções, responsividade, avisos vazios e FadeInUp. Removidas referências antigas; documentação e memória atualizadas. Revisão estática e Graphify AST local concluídos; navegador, testes e build não executados.

2026-11-07 — Sobre mim adaptado à referência enviada: título centralizado com sublinhado, subtítulo violeta e texto de apresentação em coluna de leitura, sem imagem por enquanto e sem espaço reservado. Mantidas cinco seções, idiomas e FadeInUp. Revisão estática e Graphify AST local concluídos; navegador, testes e build não executados.

2026-11-07 — Usuário esclareceu que a foto deveria ter espaço reservado. Sobre mim ajustado para quadro quadrado à esquerda e texto à direita; mobile empilha o quadro acima do texto. Nenhuma imagem inserida. FadeInUp e idiomas preservados. Revisão estática e Graphify AST local concluídos; navegador, testes e build não executados.

2026-11-07 — CTA de Serviços adaptado à referência enviada: logo centralizada, título em destaque, fundo violeta com grade sutil e botão arredondado com seta. Reutilizados asset transparente, textos EN/PT-BR, rota localizada e FadeInUp. Mantidas cinco seções. Revisão estática e Graphify AST local concluídos; navegador, testes e build não executados.

2026-11-07 — Usuário pediu projetos destacados como deck de sete cartas: hover eleva no desktop; setas ou toque selecionam no mobile, e novo toque abre projetos reais. Implementado com sete vagas preenchidas pelo cachorro triste e aviso localizado enquanto não há projetos. Catálogo real reutilizado com limite ampliado para sete, sem conteúdo fictício; posts e cinco seções preservados. Teste de seleção ajustado, revisão estática concluída e Graphify atualizado por AST local. Navegador, testes e build não executados.

2026-11-07 — Cartas de projetos receberam elevação inspirada nos cards de Serviços enviados: base violeta sólida, sombra mais profunda e destaque adicional na carta selecionada. Mantidos deck e interações desktop/mobile. Revisão estática e Graphify AST local concluídos; navegador, testes e build não executados.

2026-11-07 — Blog da Home transformado em mosaico editorial com três espaços de imagem e notas textuais alternadas, usando artigos reais sem duplicação. Enquanto vazio, imagens mostram o cachorro triste e notas exibem avisos EN/PT-BR. A pedido do usuário, removida a faixa inferior com texto, contador e botões; alternância automática mantida com pausa por hover/foco/visibilidade e respeito a movimento reduzido. Configuração, seleção, estilos e controlador separados. Revisão estática, 82 traduções em paridade, diff e Graphify AST local concluídos; navegador, testes e build não executados.

2026-11-07 — Usuário pediu CTA de Serviços ocupando toda a largura, sem os tijolos/grade, com primary no topo e preto até o footer. Removidos limite de largura, moldura, grade e margem inferior; aplicado gradiente com a cor principal existente e rodapé preto restrito à Home. Conteúdo, idiomas e animações preservados. Revisão estática, diff e Graphify AST local concluídos; navegador, testes e build não executados.

2026-11-07 — A pedido do usuário, sete imagens Ladding_Section foram convertidas de RAW para WebP lossless via FFmpeg no CMD, preservando dimensões, pixels visíveis e transparência. RGB diferente ficou apenas em pixels totalmente transparentes. O conjunto caiu de 12.088.269 para 7.103.720 bytes (41,2% menor); originais mantidos e decodificação confirmada.
2026-11-07 — Implementado interior steampunk contínuo atrás da Home, preservando o Hero: parede/salão integrados e detalhes mecânicos concentrados em Blog e Sobre mim. Assets existentes inspecionados quanto a dimensões e transparência; Layer0 dispensado para evitar excesso. Duas engrenagens e vapor suave animados por CSS, cenário simplificado por resolução, imagens lazy/responsivas e fontes vazias para peças ocultas. Conteúdo, ordem, cinco seções, idiomas e CTA preservados. Revisão estática e Graphify AST local concluídos; navegador, testes e build não executados, aparência em execução pendente.

2026-11-07 — Usuário apontou que o deck de Projetos precisava continuar preto como transição após o Hero. Corrigido o alcance do cenário: Projetos retirados de FactoryInterior e colocados sobre preto; ambientação restrita a Latest Posts e About Me. Removido slot entry desnecessário. Revisão estática e Graphify local concluídos; navegador, testes e build não executados.

2026-11-07 — Suavizada a transição escuro/roxo no CTA de Serviços: gradiente preto na entrada e espaçamento superior convertido em padding para eliminar a faixa de fundo global. Conteúdo e término preto no footer preservados. Revisão estática, diff e atualização Graphify local concluídos; navegador, testes e build não executados.

2026-11-08 — Catálogo de Serviços reorganizado a pedido do usuário: removida Automação inteira, inclusive da busca; apps substituídos por delivery, agendamentos/eventos e vendas; sistemas agora ERP, CRM e portal interno. EN/PT-BR, ilustrações SVG e slugs atualizados, preservando estilo e CTAs de orçamento no WhatsApp. Revisão estática e Graphify AST local concluídos; navegador, testes e build não executados.

2026-11-08 — Ajustados os problemas Lighthouse da Home nos fontes: deck com geometria final desde SSR, CSS inline, céu LCP com prioridade alta, imagens responsivas/compressão ajustadas e efeitos após load. Arte da cortina passa a carregar só na navegação, preservando lazy abaixo da dobra. Cache de dez minutos continua dependente da hospedagem. Revisão estática/diff e Graphify AST local concluídos (666 nós/1590 relações); aplicativo, navegador, testes, build e nova medição Lighthouse não executados conforme CodeMode.

2026-11-08 — A pedido do usuário, análise dos cases web.dev confrontada com o código e pendências confirmadas implementadas: cortina sem espera por window.load ou eager fora da tela; Crystal Cave configurada para WebP responsivo mantendo os PNGs; biomas mostram o fundo primeiro e liberam camadas individualmente, sem uma imagem com erro esconder toda a cena. Documentação e memória atualizadas. Revisão estática/diff e Graphify AST local concluídos (667 nós/1592 relações); build, site, testes e Lighthouse não executados conforme CodeMode. Derivados, aparência e ganhos reais ainda não validados; cache segue dependente da hospedagem.

2026-11-08 — Análise de SEO confrontada com os fontes: corrigida a origem padrão do Astro para .github.io, adicionado canonical da própria rota no layout compartilhado e criado llms.txt com páginas EN/PT-BR. Documentadas as limitações do GitHub Pages e a necessidade de atualizar links se domínio/base mudarem. WebMCP adiado até validar o formulário por etapas; nenhum manifesto fictício adicionado. Revisão estática/diff sem erros e Graphify AST local atualizado (668 nós/1593 relações); aplicativo, navegador, testes, build, Lighthouse e deploy não executados conforme CodeMode.

2026-11-08 — Implementado SEO técnico e descoberta conforme fontes oficiais: origem HTTPS e canonical por rota, llms com URLs adaptadas a domínio/base, robots público e ARD v0.91 vazio válido com compatibilidade legada. Formulário WebMCP prepara orçamento local após revisão humana, sem navegar automaticamente ao WhatsApp; busca preservada. Check sem erros, 116 testes e dois builds aprovados; HTTP/JSON/schema, ambas as bases, EN/PT-BR e fluxos com/sem WebMCP verificados em navegador. Corrigidos quatro erros TypeScript preexistentes. Sem deploy ou Lighthouse; robots na raiz do domínio segue dependente do repositório de usuário. Arquivos, evidências e passos externos documentados em docs/SEO.md.
Graphify final desta implementação: AST local com 686 nós/1.616 relações, 34 comunidades e 40 avisos Astro conhecidos. Diff sem erros; sem alterações finais em node_modules ou .astro.

2026-11-08 — Usuário apontou CLS 0,324 nos meteoros e pediu SVG, um por vez e reutilização por teleporte. Quatro spans substituídos por um grupo SVG persistente por céu, movido para quatro posições enquanto invisível, sem criar novos meteoros. Um observer mantém só um céu ativo, incluindo catálogo de Serviços e cortina; fora da tela/aba oculta pausa e movimento reduzido desativa. Check e build aprovados; oito rotas EN/PT-BR e reutilização/pausa conferidas em navegador. Ensaio de pausa refeito em documento novo após interferência do próprio Animation.play(). CLS mobile local 0 antes e depois; desktop final 0,00136 no cabeçalho, sem deslocamentos dos meteoros. CLS 0,324 não reproduzido, sem Lighthouse/deploy ou ganho percentual comprovado. Graphify AST local atualizado: 689 nós/1622 relações, 40 avisos Astro conhecidos.

2026-11-08 — Cards do Blog na Home receberam brilho roxo, borda realçada e leve elevação no hover para evidenciar interação. Foco por teclado destacado nos links reais; avisos vazios continuam sem navegação fictícia. Toque e movimento reduzido respeitados. Revisão estática, diff e Graphify local concluídos; navegador, testes e build não executados nesta alteração.
2026-11-08 — Pedido final aplicado: Explore Projects branco com texto escuro; Explore Services mantém o roxo e recebe cantos de 6px, substituindo o formato de pílula. Revisão estática e diff sem erros; Graphify AST local atualizado. Sem executar aplicativo, navegador, testes ou build.

2026-11-08 — Explore Services também alterado para branco, com texto escuro e hover neutro, mantendo os cantos de 6px. Graphify AST local atualizado e diff conferido; site, testes e build não executados.

2026-11-12 — Projetos em destaque da Home passam a usar slide horizontal nativo no mobile, com a primeira carta centralizada e encaixe central ao deslizar. Setas, contador, seleção por toque/teclado, redimensionamento e movimento reduzido sincronizados com a rolagem; orientação inferior ocultada no mobile e fallback sem JavaScript preservado. TypeScript do controlador, sintaxe Astro/CSS e diff conferidos sem erros. Aplicativo, navegador, testes e build não executados conforme AGENTS.md; Graphify indisponível neste ambiente.

2026-11-12 — A pedido do usuário, restaurado o visual de baralho dos projetos no mobile: cartas sobrepostas com o espaçamento proporcional anterior, vizinhas menores e mais baixas e carta selecionada elevada. Profundidade inicial mobile restaurada no HTML; gesto de deslizar, centralização, setas e contador mantidos. Sintaxe Astro/CSS e diff conferidos sem erros. Aplicativo, navegador, testes e build não executados conforme AGENTS.md; Graphify continua indisponível.

2026-11-12 — Latest posts no mobile passa a exibir um único card com imagem por vez, alternando os espaços 1, 2 e 3 a cada nove segundos no ciclo existente. Cards compartilham a mesma área da grade e altura reservada; inativos ficam invisíveis e inertes no mobile. Pausas por foco, mouse, seção fora da tela, aba oculta e movimento reduzido preservadas; redimensionamento atualiza a interação. TypeScript do controlador, sintaxe Astro/CSS e diff conferidos sem erros. Aplicativo, navegador, testes e build não executados conforme AGENTS.md; Graphify continua indisponível.

2026-11-12 — Corrigido o atraso na elevação das cartas de projetos durante o slide mobile: seleção passa a acompanhar a carta mais próxima do centro a cada quadro, substituindo a espera de 120ms após parar a rolagem. Transição mobile reduzida de 340ms para 160ms; seleção pelas setas preservada durante centralização suave e novo gesto retoma o controle imediatamente. TypeScript estrito, sintaxe CSS e diff conferidos sem erros. Aplicativo, navegador, testes e build não executados conforme AGENTS.md; sensibilidade visual ainda não observada em execução e Graphify continua indisponível.

2026-11-12 — Usuário esclareceu que o novo carrossel deve alternar somente o card com imagem de Latest posts. Adicionadas três barrinhas selecionáveis logo abaixo da imagem, arraste lateral e navegação por teclado, com indicador ativo e avisos EN/PT-BR. Ciclo mobile reduzido para cinco segundos; notas mantêm temporizador independente de nove segundos. Foco de toque nos controles não bloqueia o ciclo; foco visível e movimento reduzido pausam a troca automática, mantendo navegação manual. TypeScript, sintaxe Astro/CSS, paridade de 85 traduções e diff conferidos sem erros. Aplicativo, navegador, testes e build não executados conforme AGENTS.md; Graphify indisponível.

2026-11-12 — Barrinhas de Latest posts sobrepostas à base interna do card mobile, compartilhando sua área da grade com camada acima e espaço no conteúdo para evitar cobertura do texto. Baralho de projetos inicia na carta central com regra compartilhada no HTML e controlador: floor((quantidade - 1) / 2), resultando em carta 4 para sete/oito e carta 5 para nove. Posição inicial mobile preparada por CSS antes da montagem e centralizada sem animação ao iniciar. TypeScript, sintaxe Astro/CSS, cálculo dos três exemplos e diff conferidos sem erros. Aplicativo, navegador, testes e build locais não executados conforme AGENTS.md; Graphify indisponível.
