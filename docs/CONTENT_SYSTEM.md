# Sistema estático de conteúdo LU

Arquivos `.lu` em `public/content/` alimentam artigos, projetos, serviços, locais e changelogs. O motor TypeScript funciona no navegador ou na geração estática. Não há servidor de conteúdo. O blog já consome o catálogo na listagem e em páginas estáticas de artigos; projetos, serviços e locais ainda não têm páginas de detalhe.

## Como escrever

Crie, por exemplo, `public/content/articles/experimento.pt_br.lu`:

````lu
```$Config
id: experimento-roblox
title: Meu experimento no Roblox
description: O que aprendi construindo o primeiro protótipo.
imagem: /images/Rick_Logo.webp
imagem-alt: Marca do laboratório
tags: game-design, roblox
categories: article, dev-log
data: 2026-11-02
```

## O primeiro protótipo

Texto com **destaque**, *ênfase* e `código inline`.

---

```@typescript(main.ts)
const mensagem = "Olá!";
```

```$YouTube
id: abcdefghijk
title: Meu experimento no Roblox
```
````

O bloco `$Config` é obrigatório, aparece uma única vez e não é renderizado. Pode ficar em qualquer posição fora de código; prefira o início. `---` fora de cercas é **sempre uma barra**, inclusive antes de Config. Dentro de cercas, é texto literal.

O formato anterior, com JSON entre `---` e diretivas `::widget`, foi substituído. Os templates foram migrados. `index.json` continua sendo JSON gerado automaticamente para transporte e consultas; você escreve os artigos em LU. O esquema interno de metadados e índice permanece na versão 1, independente desta mudança na sintaxe de autoria.

## Aparência da página do blog

O cabeçalho é montado automaticamente a partir do `$Config`, sem widget de layout:

- `data` aparece acima do título, formatada no idioma da página. Ainda é opcional para artigos; se omitida, a página não inventa uma data.
- `title` vira o título grande. Não precisa repeti-lo como `#` no corpo.
- `tags` aparecem ao lado do título no desktop e abaixo no mobile.
- `imagem` vira a capa em destaque, inteira e sem recorte. Use `imagem-alt` para descrevê-la.
- `description` abre a coluna de leitura; o corpo LU vem em seguida, incluindo separadores, código e widgets.

As rotas são `/blogs/<id>/` e `/pt-br/blogs/<id>/`. A listagem `/blogs/` também lê os LU e mostra capa, data quando presente, título e descrição. Não é necessário editar uma página Astro para cada artigo. O conteúdo é validado e renderizado durante a geração estática; filesystem não é enviado ao navegador. O carregador usa `publicDir` resolvido pelo Astro.

As capas dos artigos usam `SiteImage.astro`, baseado em `Image` de `astro:assets`, com dimensões inferidas dos arquivos locais e variantes responsivas. A exploração do Blog prepara as variantes locais com `getImage` no build e reutiliza os mesmos dados em imagens HTML, inclusive após filtros/paginação; capas HTTPS nessa listagem usam a URL original, sem inferência remota. Capas e miniaturas usam `loading="lazy"`, sem prioridade alta forçada; `SiteImage` também adota lazy por padrão para novos consumidores. As imagens locais publicadas ficam em `public/images/` como WebP; as origens anteriores estão preservadas em `RAW/images/`. Para capas HTTPS nas páginas dos artigos, autorize explicitamente os hosts em `image.domains` ou `image.remotePatterns` de `astro.config.ts`: a inferência de tamanho remoto exige autorização do Astro e acesso à origem durante a geração. Não há liberação global de hosts externos. Imagens no corpo Markdown continuam sob responsabilidade do renderizador LU.

O catálogo atual permanece vazio: só serão geradas páginas de artigos realmente cadastrados. Estilos editoriais ficam em `frontend/paginas/blogs/styles/blogs.css` e a composição em `layout/ArticleLayout.astro`. O widget GitHub continua exigindo um snapshot fornecido explicitamente; essa página não busca dados remotos automaticamente.

## Configurações

Os campos usam `chave: valor`, sem chaves de objeto e sem vírgulas ao fim das linhas.

| Campo | Regra |
| --- | --- |
| `id` | Obrigatório; slug como `experimento-roblox`. Mantido entre traduções. |
| `title` / `titulo` / `título` | Título obrigatório. |
| `description` / `descricao` / `descrição` | Descrição obrigatória. |
| `image` / `imagem` | Capa obrigatória; caminho em public ou URL HTTPS. |
| `image-alt` / `imagem-alt` | Descrição da imagem; se omitida na forma `image: caminho`, usa o título. Prefira uma descrição própria. |
| `tags` | Obrigatório; uma ou mais tags, slugs separados por vírgula ou lista `[game-design, roblox]`. |
| `categories` / `categorias` | Opcional para compatibilidade; lista de IDs cadastrados no tipo, como `article, dev-log` para blog ou `[web, machine-learning]` para projeto. Tags não criam categorias. |
| `content-type` / `tipo-conteudo` | Opcional; ID do tipo de `backend/content/taxonomy.ts`, compatível com `kind`. Sem ele, usa-se o primeiro tipo do formato: blog para article, project para project, service para service. |
| `kind` / `type` / `tipo` | `article`, `project`, `service`, `location` ou `changelog`. |
| `date` / `data` | Data real `AAAA-MM-DD`; obrigatória em changelog. |
| `updatedAt` / `updated-at` / `atualizado-em` | Opcional, somente Blog: data real `AAAA-MM-DD` da atualização. |
| `keywords` / `palavras-chave` | Opcional, somente Blog: lista de textos não vazios, separados por vírgula ou entre colchetes. Alimenta a busca da página do Blog. |
| `featured` / `destaque` | Opcional, somente Blog: `true` destaca o post na descoberta editorial; padrão `false`. |
| `featuredOrder` / `featured-order` / `ordem-destaque` | Opcional, somente Blog: inteiro não negativo; menor valor aparece primeiro entre destaques. |
| `locale` / `idioma` | `en`, `pt-br` ou `pt_br`; normalmente inferido do nome do arquivo. |
| `relations` / `relacoes` / `relações` | Chaves separadas por vírgula ou lista; relaciona vários projetos, serviços e locais. |
| `status` | Somente projetos: IDEA, RESEARCH, PROTOTYPE, BUILDING, ACTIVE, SHIPPED, ARCHIVED. |
| `layout` | Nome de um futuro layout da interface, como `project-detail`. |
| `youtube` | ID do vídeo, com 11 caracteres. O player no corpo usa o widget YouTube. |
| `links` | Lista de links, preenchida por caminhos `links.0.label`, `links.0.url`, etc. |

Se `kind` não for informado, as pastas `articles`/`blogs`, `projects`, `services`, `locations` e `changelogs` definem o tipo. Em caminhos sem essas pastas, `changelog.lu` e suas variantes de idioma usam `changelog`; os demais usam `article`. Um `kind` explícito prevalece. Para eliminar ambiguidade, os templates trazem o tipo explícito.

Também é possível escrever `image.src: /images/capa.webp` e `image.alt: Descrição`. Não misture essa forma com `image-alt`. Campos desconhecidos, propriedades repetidas e aliases conflitantes geram erros. Os marcadores TODO, TBD, CHANGEME e PREENCHER em campos obrigatórios indicam presets incompletos e bloqueiam a publicação.

Valores comuns são textos. `true`, `false`, `null` e números são convertidos para seus tipos; envolva valores literais como um ID inteiramente numérico em aspas. Aspas simples preservam texto; aspas duplas aceitam escapes como `\n`. Comentários começam com `#` em uma linha própria. Dois pontos e `#` dentro de um valor não iniciam sintaxe especial. Listas entre colchetes aceitam vírgulas dentro de valores entre aspas. Objetos e listas de objetos usam caminhos com ponto e índices sequenciais a partir de 0; não há objetos JSON, indentação YAML, expressões ou execução.

````lu
```$Config
id: meu-projeto
kind: project
title: Meu projeto
description: |
  Primeira linha da descrição.
  Outra linha, com dois pontos: assim.
image.src: /images/Rick_Logo.webp
image.alt: Marca do laboratório
tags: [game-design, ferramenta]
relations: service:sites, location:laboratorio
links.0.label: Repositório
links.0.url: https://github.com/exemplo/projeto
```
````

Os destinos desse exemplo precisam existir. Imagens locais são verificadas em public, sem decodificar o arquivo. URLs HTTPS não são consultadas durante a validação.

A exploração abaixo do Hero usa exclusivamente artigos Blog do catálogo, com categorias e tags derivadas dos posts disponíveis no idioma selecionado. Sem filtros, mostra uma grade editorial ordenada por destaque e data; com filtros, uma lista horizontal. Filtra antes de paginar, com 10 posts por página. Configuração, parâmetros de URL e validação pendente estão em [BLOG_EXPLORE.md](BLOG_EXPLORE.md).

## Código, widgets e escapes

| Abertura da cerca | Resultado |
| --- | --- |
| ` ```@typescript(main.ts) ` | Bloco de código com linguagem e nome de arquivo. |
| ` ```@typescript ` | Código com linguagem, sem nome de arquivo. |
| ` ```$Nome do Widget ` | Widget; as linhas seguintes são suas propriedades. |
| ` ``` ` ou ` ```ts ` | Código comum. |
| ` ```\@typescript(main.ts) ` | Código comum; o escape impede o tratamento especial. |
| ` ```\$Config ` | Código comum; não abre configurações. |

Todas fecham com três crases em uma linha própria. Para escrever um exemplo que contém três crases, envolva-o numa cerca de quatro ou mais: somente uma cerca com pelo menos o comprimento da abertura fecha o bloco externo. `$` e `@` só têm significado especial imediatamente após as crases da abertura. Texto, código inline e conteúdo dentro do bloco não ativam widgets.

`@linguagem(arquivo)` gera `<pre><code>` e, quando houver arquivo, um `<figure>` com legenda. O texto é escapado; syntax highlighting, copiar código e estilos não foram implementados nesta etapa.

Nomes de widgets ignoram caixa, acentos, espaços e underscores: `$Meu Widget` corresponde a `meu-widget`. `$MeuWidget` corresponde a `meuwidget`. `Config` é reservado para os metadados.

````lu
```$Timeline
```

```$related-content
kind: article
limit: 12
```

```$changelog
```

```$github-history
owner: seu-usuario
repo: seu-repositorio
ref: main
directory: .github
```
````

- `related-content`: resumos ligados à página nos dois sentidos; aceita `kind`, `limit` (1–100) e `target`.
- `timeline`: relacionados com data, em ordem decrescente; aceita `target`.
- `changelog`: relacionados filtrados para changelogs; aceita propriedades de related-content.
- `youtube`: `id` e `title`, player lazy com youtube-nocookie.com.
- `github-history`: `owner`, `repo`, `ref`, `directory` opcional. Renderiza um snapshot carregado explicitamente; não dispara requisições sozinho.

Sem `target`, a coleção usa a página atual. Um alvo explícito entra no grafo como referência; não configure o próprio conteúdo como alvo. Widgets desconhecidos e propriedades inválidas bloqueiam a publicação.

## Criar um widget customizado

Edite `backend/content/site-widgets.ts`. Esse é o registro padrão compartilhado por CLI, validação, build, cliente e renderizador. Exemplo completo:

```ts
import { createWidgetRegistry } from "./widgets.ts";
import { escapeHtml } from "./html.ts";

export const siteWidgets = createWidgetRegistry({
  "Meu Aviso": {
    validate: (props) => typeof props.text === "string" && props.text.trim()
      ? [] : ["Informe text."],
    render: (props) => `<aside>${escapeHtml(String(props.text))}</aside>`,
  },
});
```

Chame no artigo:

````lu
```$Meu Aviso
text: Este experimento ainda está em andamento.
```
````

O código do widget é confiável e deve escapar seu HTML, validar propriedades e usar `safeHref` para URLs. `references(props)` opcional declara dependências do catálogo. `render(props, context)` recebe `database`, `current`, `locale` e os resolvers/snapshots opcionais. Não importe Node, filesystem ou credenciais nesse registro, pois ele também vai para o navegador.

APIs também aceitam um registro explícito: `createContentClient({ widgets })`, terceiro argumento de `renderLu`, `contentIntegration(widgets)` e segundo argumento de `readPublicContent`/`preparePublicContent`. Passe o mesmo registro a todas as etapas ao usar essa opção.

## Português e inglês

Use arquivos separados, com o **mesmo id e tipo**:

```text
public/content/articles/experimento.pt_br.lu
public/content/articles/experimento.en.lu
```

`.pt_br.lu` e `.pt-br.lu` são aceitos e normalizados para `pt-br`. Não crie as duas grafias para a mesma tradução: haverá chave duplicada. `.en.lu` usa `en`. Um arquivo sem sufixo nem `locale` é compartilhado entre idiomas. Também é permitido definir `idioma: pt_br` no Config de um arquivo sem sufixo. Se o sufixo e Config discordarem, a validação falha. Sufixos de outros idiomas, como `.fr.lu`, são rejeitados nesta versão.

O i18n existente do site usa `en` e `pt-br` em `frontend/config/i18n.ts`, com `pt-BR` no atributo HTML. O motor LU converte o underscore do arquivo para esse identificador. A listagem e as rotas do blog pedem ao catálogo o idioma atual. O seletor mantém o mesmo artigo quando há tradução ou fallback disponível; quando não há versão utilizável no destino, leva à listagem desse idioma. O atributo `lang` do artigo indica o idioma efetivo do texto quando há fallback.

A identidade é `article:experimento`. As entradas concretas usam `article:experimento@pt-br` e `article:experimento@en`. Referências normais como `[[project:meu-jogo]]` selecionam o idioma do documento de origem. Para escolher uma tradução explicitamente, use `[[project:meu-jogo@en]]`. O fallback é idioma pedido → versão sem idioma → inglês; uma visita em inglês não recebe automaticamente um texto exclusivamente em português.

`list({ locale })` escolhe uma versão por identidade antes dos filtros de tags e busca; sem locale, retorna todas as variantes. `translations(key)` retorna as versões disponíveis para montar o seletor. Grafo e arestas usam chaves concretas. Não repita relações no destino: o catálogo já consulta os dois sentidos. Destinos ausentes, identidade repetida no mesmo idioma e autorreferências são erros.

## Corpo e API

Markdown suportado: títulos # a ######, parágrafos, listas simples, citações, barra ---, código, negrito, ênfase, links, imagens e referências `[[tipo:id|rótulo]]`. HTML é escapado. Não há JSX, imports, tabelas, listas ou formatação inline aninhadas. URLs aceitam HTTPS, caminhos públicos seguros e anchors simples; imagens exigem descrição alternativa. Referências dentro de código são ignoradas.

```ts
import { createContentClient, renderLu } from "./backend/content/index.ts";

const client = createContentClient();
const database = await client.load();
const locale = "pt-br";
const articles = database.list({ kind: "article", locale, tags: ["roblox"] });
const cards = articles.map((entry) => database.card(entry.key));
const related = database.related("project:meu-jogo", "incoming", locale);
const timeline = database.timeline("project:meu-jogo", locale);
const translations = database.translations("article:experimento");
const graph = database.graph();
const document = await client.document("article:experimento", locale);
const html = renderLu(document, { database, locale });
```

Ajuste os imports ao consumidor. `get(key, locale)` e `card(key, locale)` também resolvem traduções. `card` fornece dados, tipo público, IDs de categorias e URL do fonte; a interface monta a rota pública. O blog usa `articleHref` e passa `resolveHref(entry)` ao renderizador para ligar artigos entre si. Tipos sem página de detalhe continuam como spans. Busca ignora caixa/acentos e combina termos e tags com AND. Consultas ordenam por data decrescente e chave. Dados são congelados. O cliente deduplica índice e corpos por chave concreta, permite nova tentativa após erro e detecta divergência de revisão/metadados/referências. `clear()` limpa seu cache.

`database.list({ contentType: "project", categories: ["systems"] })` combina o tipo público com categorias; múltiplas categorias usam AND, junto dos demais filtros. Nomes e SVGs ficam no cadastro central, não em cada LU. Use `taxonomyCategories("project", "pt-br")` ou `contentCategories(metadata, locale)` para obter nome traduzido, ID estável e ícone. Novos artigos devem declarar categorias; arquivos antigos sem esse campo recebem o formato artigo/YouTube somente na consulta, sem alterar seus metadados serializados. `categories: []` mantém o conteúdo sem categoria. IDs desconhecidos, repetidos ou pertencentes a outro tipo são rejeitados. Consulte [SEARCH.md](SEARCH.md) para ampliar o cadastro.

`basePath` ajusta a busca do catálogo e dos corpos para hospedagem em subpasta. Imagens/links continuam absolutos ao domínio e devem ser adequados pela interface se necessário. O índice não contém o corpo dos artigos; ele é buscado sob demanda. Imports de `backend/content/index.ts` são seguros para navegador; `node/` é exclusivo do build/CLI.

## Validação antes de publicar

```powershell
npm run content:validate   # lê e valida os LU locais
npm run content:prepare    # valida e atualiza public/content/index.json
npm run build             # hook Astro prepara o conteúdo antes da geração
npm test                  # suíte automatizada
```

O scanner lê recursivamente todos os `.lu` de `public/content/`. Caminhos são ASCII, sem espaços, segmentos relativos ou links simbólicos. Campos, presets, datas, imagens locais, referências, relações e widgets são verificados antes de substituir o índice; erros são agregados por arquivo/campo e linha quando disponível. O índice é determinístico e só é escrito após validação completa. Conteúdo vazio é válido. Prepare novamente após alterar os arquivos; o cliente não observa o filesystem.

Templates em `docs/content/templates/` ficam fora do scanner e contêm PREENCHER para exigir configuração. Tudo dentro de public será público, incluindo fontes LU. Conteúdo privado fica fora de public.

Os testes de formato, traduções, cliente, pipeline, GitHub e geração das páginas do blog foram escritos/atualizados, **sem execução**, conforme CodeMode. Também não foram executados scanner, check, build ou inspeção visual nesta sessão. O comportamento descrito está implementado e aguarda validação em execução.

## Changelogs do GitHub

`backend/github/access/history.ts` oferece `loadGithubHistory(config, options)` e cliente com cache. Procura recursivamente `.github/**/changelog.lu`, `changelog.en.lu` e `changelog.pt_br.lu` (ou `.pt-br.lu`); `directory` altera a raiz. Importa os arquivos existentes na branch/tag/commit informado, por SHA do blob. Não percorre commits antigos nem recupera arquivos removidos. Use uma subpasta por release e o mesmo id entre traduções de uma release.

Config requer tipo changelog e data. O widget seleciona uma versão por idioma com o mesmo fallback do catálogo. Conteúdo remoto admite texto/código/imagens/links seguros, mas widgets e relações locais exigem espelhamento em public/content. A importação remota não integra o grafo ou o bloqueio local de build.

```ts
import { loadGithubHistory } from "./backend/github/access/history.ts";

const result = await loadGithubHistory({ owner: "usuario", repo: "projeto", ref: "main" });
const snapshots = new Map();
if (result.status === "ready") snapshots.set(result.key, result.documents);
const html = renderLu(document, { database, githubHistory: snapshots });
```

A API pública é acessada sem credenciais, com cancelamento e limites: 15s no total, 50 arquivos e 256.000 bytes por arquivo por padrão. Erros, árvore truncada ou limites excedidos retornam unavailable sem histórico parcial. Falhas não ficam em cache. Nenhuma rede é disparada ao declarar/renderizar um widget ou preparar conteúdo local. Para publicação sem rede, espelhe changelogs em public/content e use `$changelog`.

## Áreas de projetos

O Hero de Projetos e sua listagem usam a mesma taxonomia: `web`, `game-dev`, `low-level`, `mobile`, `products` e `machine-learning`. Os IDs são independentes do idioma. Use `categories: [mobile, machine-learning]` para um projeto aparecer em ambas as áreas. A seleção no Hero filtra as seções já consultadas pelo catálogo, e “Todas as categorias” restaura a listagem completa. O hash `#projects-<id>` permite abrir uma área diretamente. Sem JavaScript, os links continuam levando às seções. Categorias antigas de projetos devem ser reclassificadas para esses IDs; tags continuam livres.
