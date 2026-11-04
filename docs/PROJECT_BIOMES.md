# Biomas das seções de Projects

O Hero original permanece com floresta, logo e órbita. Os seis ambientes são seções abaixo dele, com projetos consultados no catálogo LU existente e estado vazio compartilhado com o Blog. Não há projetos fictícios na publicação.

| Ordem | Categoria / ID | Bioma | Prefixo dos PNGs |
|---|---|---|---|
| 1 | Web / `web` | Crystal Cave existente | `Service_Crystal` |
| 2 | Game Dev / `game-dev` | Volcanic Cave | `Project_GameDev` |
| 3 | Low-Level / `low-level` | Basalt Abyss | `Project_LowLevel` |
| 4 | Mobile / `mobile` | Subterranean Waters | `Project_Mobile` |
| 5 | Products / `products` | Mineral Chamber | `Project_Products` |
| 6 | Machine Learning / `machine-learning` | Bioluminescent Cave | `Project_ML` |

A ordem das seções vem da configuração de biomas. A taxonomia mantém sua ordem radial original no Hero. IDs são permanentes nos dois idiomas. Cada consulta pede categoria e idioma ao mesmo banco; um projeto multicategoria aparece em suas seções sem duplicar o registro. Os cards mostram capa, título, descrição, status, tags e links disponíveis nos metadados atuais. Não foram criados novos campos para dados que o catálogo não possui.

## Assets e direção de arte

Os 25 PNGs novos foram gerados individualmente com image_gen a partir dos [prompts originais](art/PROJECT_BIOME_PROMPTS.md), mantendo a mesma direção de luz, perspectiva 2D e centro aberto. Cada arquivo mede 2172 × 724. Os cinco Background são RGB opacos; os vinte Small, Fog, Medium e Top têm alpha real. Os PNGs em `public/images` são os originais sem perdas; o build Astro produz variantes WebP de 720, 1280 e 2172 px para os novos biomas. A Crystal Cave continua usando os mesmos PNGs, cujos bytes foram comparados com o commit anterior.

A paleta é preta/índigo/violeta. Obsidiana fissurada, basalto hexagonal, margens erodidas com água, formações minerais e raízes/fungos distinguem os novos ambientes. Não há neon, partículas, bibliotecas 3D ou filtros animados.

## Configuração compartilhada

- `projects/config/biomes.ts` conserva a configuração Crystal original e cria os demais registros com posições base reutilizadas, profundidades e enquadramentos mobile individuais.
- `ProjectBiome.astro` é o único renderer para as seis cenas. A ordem sempre é Background → Small → Fog → Medium → Top → conteúdo.
- `project-biome.ts` carrega as imagens na seleção ou a até 180px da viewport, decodifica todas antes da transição de opacidade e inicia o controlador comum. Não há `src`/`srcset` em cenas ainda não solicitadas.
- `frontend/utils/hero-parallax.ts` distribui um listener passivo de scroll e um único lote requestAnimationFrame entre as cenas. As instâncias visíveis trabalham quando há movimento; a fila fica vazia depois de estabilizar. O Hero conserva sua API e seus parâmetros.

Os novos biomas usam progresso local (`travelFraction: 0.1`), limite de 64px antes de aplicar a profundidade, mouse de 24px e multiplicador mobile de 0.16. Isso mantém os deslocamentos finais dentro do overscan. O teto permanece ancorado no topo, com sua proporção original. A Crystal mantém o movimento anterior.

A névoa move somente transform, com duração de 130–150s conforme a cena. No mobile, a deriva dos novos ambientes fica pausada; parallax e deriva param com movimento reduzido e fora da área visível/aba ativa. Sem JavaScript, imagens nativas lazy em noscript preservam os seis ambientes e as âncoras; filtros interativos continuam sendo uma melhoria do navegador.

## Transições e publicação

O fade de cada ambiente usa o preto do site, com extensão de 56–100px conforme a viewport, dentro da cena e abaixo dos textos. Não existe um separador de altura adicional entre cavernas. A navegação mantém `#projects-<id>` e `#projects-all`.

Os caminhos dos novos PNGs e derivados respeitam o base path do GitHub Pages. Os originais ficam publicados para manutenção; o navegador solicita os derivados responsivos quando cada ambiente é necessário.

## Validação

- 100 testes existentes passaram, incluindo catálogo multicategoria e seleção por idioma.
- Build estático padrão e build com `/PES_Ricks` concluídos; 30 caminhos de camadas e seus srcsets conferidos nos dois idiomas.
- Chromium: seis cenas em desktop/mobile, ordem das seções, filtros/reset, imagens, limite de movimento, fila RAF ociosa após estabilizar, zero downloads dos novos ambientes na entrada, ausência de overflow e de erros JS/HTTP.
- Preferência de movimento reduzido e fallback sem JavaScript conferidos. Capturas dos seis ambientes inspecionadas.
- PNGs novos conferidos quanto a dimensões e transparência. PNGs Crystal e os quatro arquivos originais do Hero permanecem inalterados.
- A checagem Astro ainda aponta dois erros anteriores nos arquivos inalterados `blogs/data/articles.ts` e `blogs/subpaginas/ArticlePage.astro`.
