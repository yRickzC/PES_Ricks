
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
