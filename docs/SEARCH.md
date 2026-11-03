# Pesquisa local

O diálogo existente continua responsável por abertura, Escape, Ctrl/Cmd+K e retorno de foco. A composição fica em `frontend/components/site/SiteSearch.astro`, dividida em `search/SearchInput.astro`, `SearchFilters.astro` e `SearchResults.astro`. O controlador permanece em `frontend/utils/site-search.ts`; filtros e normalização ficam em `backend/search/search.ts`.

A apresentação usa dois cards separados por um espaço transparente: título, busca e filtros no superior; resultados e sua rolagem no inferior. Ambos pertencem ao mesmo diálogo nativo. O texto de instruções do rodapé foi removido; os atalhos continuam disponíveis.

Tipo e Categoria ficam lado a lado também no mobile, com rótulos apenas para leitores de tela. Os selects continuam exibindo a opção selecionada.

## Fonte e extensão

`search/catalog.ts` monta o índice durante a geração estática, usando as seções de `frontend/config/navigation.ts` e os artigos do mesmo catálogo LU utilizado pelo blog. A seleção de idioma e seus fallbacks seguem `database.list`. Artigos mantêm a ordem recente fornecida pelo catálogo; seções principais aparecem primeiro. Nenhum corpo LU ou nova API é carregado pelo navegador para pesquisar.

Cada registro contém título, descrição, tipo, categorias, tags, URL, texto pesquisável, prioridade e destaque. Apenas artigos têm rotas individuais publicadas atualmente. Para adicionar outros conteúdos, estenda o adaptador com a fonte e a rota reais. Não crie links para detalhes ainda inexistentes.

O seletor de tipos contém Todos, Blogs, Projetos e Serviços. Início continua como sugestão geral, sem opção própria no seletor. Tipos e categorias vêm de `backend/content/taxonomy.ts`, independentemente da quantidade de publicações. Em Todos, aparecem as categorias agregadas dos três domínios; ao escolher um tipo, somente suas categorias permanecem. Uma seleção incompatível volta para Todas as categorias; uma seleção válida é preservada. O controle fica desabilitado somente se o cadastro daquele tipo estiver vazio.

As quatro seções principais são resultados de navegação. Cada seção de conteúdo representa suas categorias cadastradas e leva à página principal; isso não significa que exista uma publicação em cada categoria. O catálogo de artigos atual está vazio; novos artigos LU válidos entrarão na pesquisa após a geração do site. Projetos e serviços individuais ainda dependem das futuras listagens/rotas reais e não são inventados pelo adaptador.

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

Texto, tipo e categoria filtram juntos, em tempo real. A busca ignora caixa e acentos e exige todos os termos em título, descrição, tipo, categorias, tags ou URL/ID. Sem filtros, aparecem seções sugeridas e artigos recentes disponíveis.

Os selects usam teclado e interface nativos. No input, Enter ou o botão de busca leva o foco ao primeiro resultado visível; Enter em um resultado abre seu link. Setas para cima/baixo percorrem os resultados, sem interferir nos selects. Tab preserva a navegação entre os controles. Escape fecha o diálogo e devolve o foco ao acionador.

## Validação pendente

Foram escritos casos em `backend/search/search.test.ts` e `backend/content/taxonomy.test.ts` para busca textual, filtros combinados, isolamento por domínio, IDs entre idiomas, categorias independentes de publicações, validação LU, compatibilidade e consultas. Aplicativo, testes, check e build não foram executados nesta alteração, conforme CodeMode.

Na validação em execução, conferir teclado completo, Escape/retorno de foco, mudança de categoria após trocar tipo, estado vazio, idiomas, rolagem e telas estreitas/com pouca altura. Conferir também um artigo LU real publicado, incluindo categorias explícitas, tags e fallback de idioma.
