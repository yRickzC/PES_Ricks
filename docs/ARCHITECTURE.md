# Arquitetura de pastas

A interface fica em frontend/paginas/, a lógica fica diretamente nos domínios de backend/ e os arquivos estáticos ficam em public/.

~~~text
frontend/
  main.astro                    # Documento, cabeçalho, conteúdo e footer globais
  env.d.ts
  components/site/              # SiteHeader, SiteFooter, SiteSearch e Icon
  layout/SectionLayout.astro    # Base das seções com conteúdo ainda pendente
  config/
    i18n.ts                     # Locales, idioma padrão e códigos lang
    navigation.ts               # Destinos e registro explícito das rotas
    social.ts                   # Redes sociais e URLs dos perfis
  utils/
    translations.ts             # Catálogo tipado, importado dos JSON
    translations.test.ts
    site-header.ts              # Menu mobile e fechamento dos popups
    site-search.ts              # Interação do diálogo de pesquisa
  styles/
    global.css
    site.css                    # Layout compartilhado e comportamento responsivo
  paginas/
    home/
      HomePage.astro
      components/
        HomeHero.astro
        HeroScene.astro
      config/hero.ts            # Posições, escala, opacidade e profundidade das camadas
      utils/hero-parallax.ts    # Motion de interface no navegador
      styles/hero.css           # Cena, névoa CSS e composição responsiva
      layout/
        HomeLayout.astro
      subpaginas/               # Reservada para futuras telas filhas
    blogs/
      BlogsPage.astro           # Listagem dos artigos LU no idioma atual
      data/articles.ts          # Seleção, URLs, datas e props das páginas
      data/public-content.ts    # Leitura local no frontmatter/geração estática
      layout/ArticleLayout.astro
      subpaginas/ArticlePage.astro
      styles/blogs.css          # Capa, título, tags e coluna editorial
    projects/ProjectsPage.astro
    services/ServicesPage.astro
backend/
  content/                      # Parser LU, catálogo, relações, renderizador e cliente
    node/                       # Scanner local, CLI e integração de build Astro
  search/search.ts              # Correspondência de texto sem distinção de acentos
  projects/
    project-status.ts
    project-status.test.ts
  github/
    access/history.ts           # Importação opcional de changelog.lu de repos públicos
    localStorage/               # Reservada para persistência no navegador
public/
  content/                      # Arquivos .lu e index.json gerado sem os corpos
  i18n/
    en.json
    pt-br.json
  images/
~~~

## Páginas e subpáginas

Cada página possui sua própria pasta em frontend/paginas/, com o arquivo da página, components/ e layout/. Subpáginas ficam em subpaginas/<nome>/ e seguem o mesmo padrão. Crie componentes e layouts quando houver conteúdo próprio.

Existe uma única pasta de páginas: frontend/paginas/. frontend/config/navigation.ts registra os padrões de URL e os arquivos de entrada em pageRoutes. A integração em astro.config.ts registra essas rotas pelo hook astro:config:setup do Astro. Componentes e layouts não viram rotas automaticamente.

A home usa o mesmo HomePage.astro em / e /pt-br/. Blogs, projetos e serviços têm entradas próprias e versões nos dois idiomas: /blogs/, /projects/, /services/ e os equivalentes com /pt-br/. O registro gera oito rotas de seção e dois padrões dinâmicos de artigos: /blogs/[id]/ e /pt-br/blogs/[id]/. ArticlePage.astro usa getStaticPaths e o padrão de rota para selecionar o idioma; o catálogo escolhe uma versão por identidade e os fallbacks permitidos. Sem artigos cadastrados, não gera detalhes.

Para adicionar uma subpágina, por exemplo /projects/<slug>/:

1. Crie a tela em frontend/paginas/projects/subpaginas/detail/DetailPage.astro.
2. Coloque os componentes e o layout exclusivos nas pastas irmãs components/ e layout/.
3. Registre o padrão /projects/[slug]/ e o entrypoint da tela em pageRoutes, incluindo as versões localizadas necessárias. Rotas dinâmicas estáticas precisam definir getStaticPaths no arquivo da página.
4. Acrescente os textos nos JSON de idioma e o destino no componente de navegação adequado. Para uma seção principal estática, adicione-a em sitePages: esse registro alimenta as rotas, o nav e a pesquisa.

Esse exemplo orienta futuras subpáginas de projetos. O detalhe de blog já está implementado em blogs/subpaginas/ArticlePage.astro.

## Lógica por domínio

backend/<dominio>/ reúne a lógica usada pelas páginas desse domínio. Por exemplo, backend/github/ pode agrupar acesso ao GitHub em access/ e persistência local em localStorage/. Crie outras divisões quando houver responsabilidades reais.

O domínio projects/ contém o módulo puro de status e seu teste. content/ implementa o sistema estático LU descrito em [CONTENT_SYSTEM.md](CONTENT_SYSTEM.md). github/access/history.ts importa changelogs de repositórios públicos mediante chamada explícita; github/localStorage/ continua reservado, sem persistência implementada.

O nome backend/ não cria servidor ou API. Módulos de localStorage devem executar no navegador; módulos com segredos ou acesso exclusivo de servidor precisam permanecer no servidor.

## Responsabilidades compartilhadas

- frontend/main.astro fornece o documento HTML, metadados, estilos, cabeçalho global, área principal, footer e diálogo de pesquisa.
- O layout da página organiza a composição visual; componentes recebem dados por props.
- frontend/config/ centraliza configuração compartilhada, destinos e rotas.
- frontend/utils/ contém utilitários da interface. translations.ts importa os JSON durante o processamento dos módulos, sem fetch HTTP.
- public/i18n/ é a fonte dos textos. Os JSON também são publicados em /i18n/<locale>.json.
- public/images/ recebe imagens estáticas, referenciadas por /images/<arquivo>.
- public/content/ recebe os documentos `.lu`; o hook de build valida todos os arquivos antes de substituir index.json. Templates incompletos ficam em docs/content/templates/, fora da publicação.
- backend/content/index.ts é a API para navegador; backend/content/node/ usa filesystem e só entra no frontmatter/geração estática através de blogs/data/public-content.ts. A listagem e o detalhe de blog já consomem o catálogo; o corpo é renderizado com os widgets registrados e estilos editoriais.
- Testes permanecem ao lado do módulo correspondente; Vitest e TypeScript incluem frontend/ e backend/.

## Layout e navegação globais

SiteHeader exibe a marca Rickz, Blogs, Projetos e Serviços, popup de redes sociais, seletor de idioma e pesquisa. No mobile, os controles ficam dentro do menu hambúrguer. O idioma mantém a seção atual e, nos artigos, o mesmo ID quando disponível no idioma de destino; sem versão utilizável, retorna à listagem. O link ativo usa aria-current. O footer contém somente @Rickz 2026.

YouTube, Instagram, X / Twitter e LinkedIn ficam em frontend/config/social.ts. As URLs permanecem null até os perfis serem informados; nesse estado, as redes aparecem como “Em breve”, sem links inventados.

A pesquisa inicial filtra os títulos e descrições localizados das quatro seções, sem API ou índice de artigos. A regra pura fica em backend/search/ e a interação do diálogo em frontend/utils/site-search.ts. Ctrl/Cmd+K abre a pesquisa; Escape fecha o diálogo nativo e o foco retorna ao controle de origem.

HomeLayout compõe o conteúdo da home dentro de main.astro. SectionLayout fornece a base das seções. ArticleLayout compõe data, título grande, tags ao lado, capa inteira e coluna de leitura usando os metadados LU. No mobile, as tags ficam abaixo do título. Ainda não há publicações ou serviços cadastrados.

## Cena da home

HomeHero compõe HeroScene, conteúdo localizado e links de projetos e blogs. A configuração tipada fica junto à página em config/hero.ts. O controlador de parallax é comportamento visual, por isso permanece em utils/ da home; nenhuma regra de domínio é adicionada ao backend. Os cinco assets continuam em public/images/. A névoa é criada por CSS, sem imagem. Consulte [HERO.md](HERO.md) para ajustar posições, intensidades, responsividade e conhecer as limitações de validação e transferência.
