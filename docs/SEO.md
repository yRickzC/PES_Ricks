# SEO técnico e descoberta por agentes

Implementação e validação local em 2026-11-08. Nenhuma publicação ou alteração em outro repositório foi realizada.

## Arquivos e comportamento

| Arquivo | Implementação |
| --- | --- |
| `astro.config.ts` | Origem padrão `https://<owner>.github.io`; respeita `PUBLIC_SITE_URL` e mantém a base independente. Registra a integração estática de descoberta. |
| `backend/seo/integration.ts` | Valida origem HTTPS sem caminho, credenciais ou query; adapta os links de `llms.txt` à origem/base no build e no desenvolvimento. |
| `backend/seo/integration.test.ts` | Sete testes para origem padrão/customizada, configurações inválidas e links localizados com ambas as bases. |
| `frontend/main.astro` | Canonical único da própria rota, sem query/fragmento; referências `describedby`, `ard` e `ai-catalog` com base correta. |
| `.env.example` | Exemplos separados de origem HTTPS e caminho base. Defina os overrides no ambiente do build; os exemplos permanecem comentados. |
| `public/robots.txt` | Permite todo o rastreamento público. Sem `Sitemap`, pois não há sitemap gerado. |
| `public/llms.txt` | Markdown com H1, descrição real, serviços e links EN/PT-BR, sem cases inventados. Links adaptados automaticamente à publicação. |
| `public/.well-known/ard.json` | Manifesto ARD v0.91 válido com `entries: []`. |
| `public/.well-known/ai-catalog.json` | Alias estático legado com os mesmos 15 bytes; igualdade conferida na validação. |
| `frontend/paginas/services/components/ServiceProjectBrief.astro` | Ferramenta declarativa `prepare_software_quote`; revisão das três etapas, retorno local e confirmação separada para WhatsApp. |
| `public/i18n/services.en.json`, `public/i18n/services.pt-br.json` | Descrições localizadas da ferramenta e do parâmetro de ideia. |
| `frontend/env.d.ts` | Tipagem dos atributos declarativos experimentais usados no formulário. |
| `frontend/paginas/blogs/data/articles.ts` | Corrige dois erros preexistentes de tipagem: props compatíveis com Astro e chave de artigo tipada. |
| `frontend/paginas/home/utils/project-deck.ts` | Corrige dois erros preexistentes com guards de `PointerEvent`/`MouseEvent` nos listeners. |
| `docs/DEPLOYMENT.md`, memória e `YT_RAW.md` | Configuração de publicação, resultados e limites registrados. |

`frontend/config/navigation.ts`, `frontend/config/i18n.ts` e `SiteSearch.astro` foram inspecionados e preservados. A pesquisa filtra conteúdo local; não recebeu ferramenta adicional. Nenhuma dependência foi instalada ou arquivo de `node_modules` alterado.

## URLs esperadas após a publicação

- <https://yrickzc.github.io/PES_Ricks/robots.txt>
- <https://yrickzc.github.io/PES_Ricks/llms.txt>
- <https://yrickzc.github.io/PES_Ricks/.well-known/ard.json>
- <https://yrickzc.github.io/PES_Ricks/.well-known/ai-catalog.json>

Exemplos de canonicals: `https://yrickzc.github.io/PES_Ricks/`, `https://yrickzc.github.io/PES_Ricks/services/`, `https://yrickzc.github.io/PES_Ricks/pt-br/services/` e cada detalhe de serviço em sua própria URL. Com `PUBLIC_BASE_PATH=/` e `PUBLIC_SITE_URL=https://exemplo.com`, os mesmos arquivos ficam diretamente nessa origem e os links do documento acompanham a alteração. No desenvolvimento local, o canonical aponta para a origem pública configurada, sem incorporar localhost ou parâmetros de consulta.

## ARD e descoberta

A especificação oficial consultada é a **v0.91**. O projeto não publica servidores MCP, agentes A2A, registries ou skills consumíveis por ARD. Páginas comerciais e o formulário WebMCP não foram convertidos em recursos fictícios. O schema permite um array `entries` vazio, sem `minItems`; esse catálogo declara corretamente a ausência de recursos. O alias legado existe apenas para consumidores antigos, sem outra fonte de dados ou lógica de geração.

Os consumidores ARD devem considerar o link `rel="ard"` da página, o que permite apontar ao manifesto do projeto. A busca automática na raiz do domínio continua separada. O link `describedby` também apresenta o documento `llms.txt`; isso facilita descoberta, sem garantir uso ou recomendação por modelos.

## WebMCP

O formulário possui `toolname`, `tooldescription`, campos nomeados/labels e `toolparamdescription` para a ideia. Sem `toolautosubmit`: o navegador preenche os campos e aguarda a revisão humana. `toolactivated` torna as três etapas visíveis; `toolcancel` restaura o wizard. O submit invocado pelo agente usa `preventDefault`/`respondWith` e retorna um orçamento preparado, sem navegar externamente. Um link separado permite ao visitante continuar no WhatsApp. O envio efetivo da mensagem continua no WhatsApp.

O formulário convencional conserva etapas, campos obrigatórios, botão Voltar e rascunho local. Sem JavaScript, o fallback de contato existente permanece. Não foi adicionada API imperativa de registro no produto.

## Validações observadas

| Verificação | Resultado real |
| --- | --- |
| `npm run check` | 121 arquivos; zero erros, avisos e hints. Quatro erros preexistentes corrigidos. |
| `npm test` | 15 arquivos, 116 testes aprovados. |
| `PUBLIC_BASE_PATH=/PES_Ricks` + `npm run build` | Sucesso: 26 páginas e 205 imagens otimizadas. Origem padrão do Pages. |
| `PUBLIC_BASE_PATH=/`, `PUBLIC_SITE_URL=https://rickz.example` + `npm run build -- --outDir .astro/seo-validation/root-dist` | Sucesso: 26 páginas e 205 imagens otimizadas. |
| HTML estático dos dois builds | 52 documentos com um canonical individual HTTPS e três referências de descoberta corretas; inclui os dois idiomas e 18 detalhes de serviços por build. |
| Documentos públicos | HTTP 200 nos quatro arquivos, nas duas bases, usando Astro preview; texto/JSON apropriado, sem HTML de erro. Dez links de `llms.txt` por build resolvem páginas geradas; âncora de orçamento existente. |
| ARD | Ambos os arquivos validados com AJV 2020 contra `$defs/ArdManifest` do schema oficial; igualdade conferida. Casos inválidos sem `entries`, com tipo incorreto ou entrada incompleta rejeitados. |
| WebMCP experimental | Chrome 156.0.8078.80 com recursos experimentais: ferramenta realmente registrada; schema gerado pelo navegador validado; ideia obrigatória e enum de prazo conferidos. EN/PT-BR: preenchimento, revisão humana, submit com `agentInvoked`, resposta `prepared`, confirmação separada e URL local preservada. |
| Sem WebMCP | Chrome sem flag, `document.modelContext` ausente: quatro cenários EN/PT-BR nas duas bases; validação, etapas, Voltar, persistência e URL preparada do WhatsApp passaram. Navegação externa interceptada e abortada antes da requisição. |
| Navegação e acessibilidade pontual | Home → Projetos → Serviços nos dois idiomas, com canonical atualizado; labels de todos os campos do orçamento; pesquisa aberta por Ctrl+K com foco dentro do diálogo e fechada por Escape. |
| Desenvolvimento local | `llms.txt` respondeu com a origem/base configuradas; Serviços PT-BR manteve canonical público único, sem a query da requisição local. |

Um aviso Vite já existente sobre import estático/dinâmico do logo foi emitido nos builds; não impediu a geração. Os roteiros e resultados pontuais de navegador/HTTP/schema estão em `.astro/seo-validation/` (saída local ignorada). Não há artigos publicados no catálogo atual: URLs de artigos continuam calculadas pelo mesmo pathname, mas nenhum artigo real foi gerado para ensaio.

Graphify atualizado por AST local: 686 nós, 1.616 relações e 34 comunidades, com 40 avisos conhecidos de extração parcial Astro. Relações relevantes confirmadas nos fontes. `git diff --check` sem erros; nenhum diff final em `node_modules` ou `.astro`.

**Não foi executado Lighthouse nem realizado deploy.** A existência de arquivos e testes locais não equivale à aprovação dessas auditorias em produção. Auditorias de recursos MCP/A2A/skills e seus endpoints não se aplicam ao catálogo vazio. WebMCP foi validado apenas no suporte experimental observado; navegadores sem suporte seguem o fluxo convencional.

## GitHub Pages: configuração externa necessária

O workflow `.github/workflows/deploy.yml` gera e publica o artefato estático do Astro. Não há regras próprias de proxy, reescrita ou bloqueio de robots nesse fluxo. Os diretórios `.well-known` foram encontrados nos dois builds e servidos pelo preview.

Em 2026-11-08, consultas HTTP ao site publicado retornaram **404** tanto em `https://yrickzc.github.io/robots.txt` quanto em `https://yrickzc.github.io/PES_Ricks/robots.txt`; a página de Serviços retornou 200. Os novos arquivos ainda dependem da publicação deste projeto.

Publicar `/PES_Ricks/robots.txt` **não controla** o rastreamento do domínio: o protocolo exige `/robots.txt` na origem. Para disponibilizá-lo:

1. Configurar a publicação GitHub Pages do repositório de usuário **`yRickzC/yRickzC.github.io`** em `https://yrickzc.github.io/`, caso ainda não exista.
2. Incluir `robots.txt` na raiz do artefato desse site de usuário, com `User-agent: *` e `Allow: /`, preservando eventuais políticas necessárias aos outros projetos do domínio.
3. Publicar esse repositório e verificar HTTP 200 com texto válido em `https://yrickzc.github.io/robots.txt`. Alternativamente, migrar para domínio próprio e publicar este site na raiz, configurando a origem/base.

Se desejar descoberta também pela raiz, disponibilizar `llms.txt` e os manifestos ARD no site de usuário. O documento raiz pode apontar ao Rickz; o ARD raiz deve representar os recursos reais de todo o domínio, preservando os que já existam. O projeto atual não pode escrever esses caminhos da origem nem impor redirecionamentos HTTP a partir de `/PES_Ricks/`. Nenhuma configuração externa foi feita automaticamente.

Após publicar: conferir novamente as quatro URLs, os canonicals e as auditorias Lighthouse disponíveis na versão utilizada. Não criar `Sitemap` ou endpoints apenas para preencher auditorias.

## Referências oficiais consultadas

- [llms.txt](https://llmstxt.org/)
- [ARD v0.91](https://agenticresourcediscovery.org/spec/)
- [JSON Schema oficial ARD](https://github.com/ards-project/ard-spec/blob/main/spec/schemas/ard-entry.schema.json), definição `ArdManifest`
- [WebMCP declarativo no Chrome](https://developer.chrome.com/docs/ai/webmcp/declarative-api)
- [Especificação WebMCP](https://webmachinelearning.github.io/webmcp/)
- [Robots Exclusion Protocol — RFC 9309](https://www.rfc-editor.org/rfc/rfc9309)
