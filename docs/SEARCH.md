# Pesquisa local

O diálogo existente continua responsável por abertura, Escape, Ctrl/Cmd+K e retorno de foco. A composição fica em `frontend/components/site/SiteSearch.astro`, dividida em `search/SearchInput.astro`, `SearchFilters.astro` e `SearchResults.astro`. O controlador permanece em `frontend/utils/site-search.ts`; filtros e normalização ficam em `backend/search/search.ts`, e a descoberta com relevância e tolerância a erros em `backend/search/discovery.ts`.

A apresentação usa dois cards separados por um espaço transparente: título, busca e filtros no superior; resultados e sua rolagem no inferior. Ambos pertencem ao mesmo diálogo nativo. O texto de instruções do rodapé foi removido; os atalhos continuam disponíveis.

Tipo e Categoria ficam lado a lado também no mobile, com rótulos apenas para leitores de tela. Os selects continuam exibindo a opção selecionada.

## Fonte e extensão

`search/catalog.ts` monta o índice durante a geração estática, usando a navegação principal sem Home, os artigos do mesmo catálogo LU utilizado pelo blog e a oferta disponível de Landing page. Título e descrição desse serviço vêm do catálogo localizado existente. A seleção de idioma e seus fallbacks seguem `database.list`. Sem consulta, aparecem primeiro a Landing page e as seções, seguidas dos artigos disponíveis. Nenhum corpo LU, catálogo de tradução adicional ou nova API é carregado pelo navegador para pesquisar.

Cada registro contém título, descrição, tipo, categorias, tags, URL, texto pesquisável, prioridade e destaque. A Landing page também declara sua intenção de busca e termos comerciais equivalentes em PT-BR/EN. Apenas ela entra como serviço individual: os oito cards em construção não são promovidos como destinos disponíveis. Para adicionar outros conteúdos, estenda o adaptador com a fonte e a rota reais.

O seletor de tipos contém Todos, Blogs, Projetos e Serviços. Início foi retirado dos resultados, preservando sua navegação fora da pesquisa. Tipos e categorias vêm de `backend/content/taxonomy.ts`, independentemente da quantidade de publicações. Em Todos, aparecem as categorias agregadas dos três domínios; ao escolher um tipo, somente suas categorias permanecem. Uma seleção incompatível volta para Todas as categorias; uma seleção válida é preservada. O controle fica desabilitado somente se o cadastro daquele tipo estiver vazio.

Blogs, Projetos e Serviços são resultados de navegação. Cada seção de conteúdo representa suas categorias cadastradas e leva à página principal; isso não significa que exista uma publicação em cada categoria. Novos artigos LU válidos entrarão na pesquisa após a geração do site. A Landing page leva a `/services/landing-page/` ou `/pt-br/services/landing-page/`, com o prefixo de publicação aplicado uma única vez, inclusive `/PES_Ricks/`. Projetos individuais ainda dependem de futuras listagens/rotas reais.

Nos artigos, `categories` referencia IDs do cadastro, enquanto `tags` continua livre e pesquisável, sem criar novas categorias automaticamente. Para LU antigos sem `categories`, o formato padrão é artigo, ou YouTube quando há `youtube` nos metadados. Uma lista explícita, inclusive vazia, tem precedência. Os valores de filtro incluem o tipo (`project:systems`), permanecem iguais entre idiomas e não colidem com categorias de outro domínio.

## Cadastrar tipos, categorias e ícones

O registro `contentTaxonomy` exige nome traduzível e `icon: { path, viewBox? }` tanto no tipo quanto em cada categoria. SVGs são vetoriais locais, renderizados por `frontend/components/site/TaxonomyIcon.astro`; não há HTML bruto ou serviço externo. A página de projetos e os badges da pesquisa reutilizam esse registro. Os selects mantêm a interface e o teclado nativos.

Para criar uma categoria, acrescente um ID permanente dentro de `categories` do tipo, indique `name` e `icon`, e inclua a chave de nome nos dois arquivos `public/i18n/taxonomy.en.json` e `taxonomy.pt-br.json`. Ela aparece automaticamente na pesquisa; categorias de projetos também aparecem na hero e nas seções da página. Não derive IDs de traduções nem cadastre a mesma categoria como uma tag esperando que apareça no seletor.

Exemplo de definição dentro de `project.categories`:

```ts
"internal-tools": {
  name: "projectInternalTools",
  icon: { path: "M3 4h18v16H3V4Zm0 5h18" },
},
```

Para criar um tipo, adicione uma entrada com ID permanente, `kind`, `name`, `icon` e `categories` no mesmo registro e traduza seu nome. O seletor o descobre automaticamente. `kind` identifica o formato LU existente; `content-type` no Config permite selecionar explicitamente um tipo registrado compatível com esse formato. Sem esse campo, usa-se o primeiro tipo registrado para o `kind`. Criar um formato LU ou uma rota pública nova ainda exige implementar o respectivo parser/adaptador/rota; o cadastro de taxonomia não cria páginas.

Serviços usam nomes voltados ao cliente (sistemas para empresas, sites e lojas virtuais, aplicativos para celular, automação e consultoria). Projetos usam categorias técnicas; blogs usam formatos editoriais. Textos podem ser refinados nos JSON sem mudar vínculos ou filtros.

## Interação

Texto, tipo e categoria filtram juntos, em tempo real. A busca ignora caixa, acentos, pontuação e palavras de ligação comuns em PT-BR/EN. Nome exato e termos do título recebem prioridade; os demais termos procuram título, descrição, tipo, categorias, tags, URL/ID e equivalentes comerciais. Aceita um erro por palavra (inserção, exclusão, substituição ou troca de letras vizinhas), exigindo no mínimo quatro letras em ambas as palavras para aproximá-las. Exemplos: `laddingpage`, `landig page`, `divugar meu produto`.

Consultas com intenção de criar ou usar uma página, como `site para meu produto`, `site para minha padaria` e `website for my bakery`, podem encontrar a Landing page sem exigir o nome do negócio no índice. Essa alternativa se aplica somente à oferta marcada como Landing page e continua respeitando tipo/categoria. Não é interpretação por IA nem garante qualquer recurso solicitado. Buscas sem essa intenção continuam exigindo correspondência de todos os termos relevantes. A busca textual do banco LU mantém seu comportamento anterior.

O navegador prepara texto e palavras de cada resultado uma vez, ao inicializar o diálogo; prepara a consulta uma vez por alteração do input. Não há dependências novas, chamadas externas ou decodificação de conteúdos. A aproximação verifica no máximo palavras de 48 caracteres; consultas acima de 512 caracteres ou 16 termos relevantes não produzem resultados. A ordem do DOM acompanha a relevância, com desempate estável e movimentação somente quando a posição muda.

Os selects usam teclado e interface nativos. No input, Enter ou o botão de busca leva o foco ao primeiro resultado visível; Enter em um resultado abre seu link. Setas para cima/baixo percorrem os resultados, sem interferir nos selects. Tab preserva a navegação entre os controles. Escape fecha o diálogo e devolve o foco ao acionador.

## Validação pendente

Além dos casos existentes em `backend/search/search.test.ts` e `backend/content/taxonomy.test.ts`, `search/catalog.test.ts` cobre exclusão da Home, oferta disponível, nomes/finalidades/erros em PT-BR/EN, consultas sem correspondência, ranking, limites, filtros e URLs com e sem `/PES_Ricks/`, incluindo artigos. Revisão estática dos fontes e diff realizada. Aplicativo, testes, check e build não foram executados nesta alteração, conforme CodeMode.

Na validação em execução, conferir teclado completo, Escape/retorno de foco, mudança de categoria após trocar tipo, estado vazio, idiomas, rolagem e telas estreitas/com pouca altura. Conferir também um artigo LU real publicado, incluindo categorias explícitas, tags e fallback de idioma.
