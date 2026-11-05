
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
