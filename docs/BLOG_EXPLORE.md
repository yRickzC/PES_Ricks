# Exploração do Blog / Lab Notes

Escopo: somente `/blogs/` e `/pt-br/blogs/`, abaixo do Hero existente. Header, busca global, Home, Projects e Services não usam este estado ou controlador.

## Conteúdo e configuração

`BlogsPage.astro` consulta `database.list({ kind: "article", contentType: "blog", locale })`. A seleção de tradução/fallback continua no banco LU. `createBlogPosts` também verifica o tipo antes de serializar o catálogo. Não há posts fictícios em `public/content/`.

Os campos existentes são reutilizados: chave concreta → `id`, título → `title`, descrição → `summary`, imagem → `cover`, categorias cadastradas → `categories`, tags → `tags`, data → `createdAt`, rota localizada → `href`. Categorias e tags dos filtros vêm exclusivamente dos posts selecionados. Datas continuam opcionais e não são inventadas. Metadados opcionais novos, restritos a `kind: article`:

````lu
```$Config
id: meu-experimento
kind: article
title: Meu experimento
description: O que aprendi durante a pesquisa.
image: /images/Rick_Logo.webp
image-alt: Marca do laboratório
tags: systems, performance
categories: experiments, dev-log
date: 2026-11-03
updatedAt: 2026-11-03
keywords: geração de mundos, compiladores
featured: true
featuredOrder: 1
```
````

Exemplo de autoria, não um post instalado. Aliases PT-BR: `destaque`, `ordem-destaque`, `palavras-chave`, `atualizado-em`. `featured` exige booleano; `featuredOrder`, inteiro não negativo; `keywords`, textos não vazios; `updatedAt`, data civil válida. Configurações anteriores continuam válidas.

## Estados e navegação

- Descoberta: sem texto ou filtros, grade editorial; destaques ocupam toda a largura, com imagem e texto lado a lado no desktop. Ordenação: destaques, ordem explícita, data decrescente, identidade. Não há escolha de destaque por índice.
- Pesquisa: qualquer termo/categoria/tag ativa a lista horizontal; imagem com 31% da linha, tags abaixo, título, resumo de até três linhas e data opcional. Mobile empilha imagem, tags e conteúdo.
- Vazio: apenas `Blog_Result_Dog.webp`, mensagem e botão para limpar. A transparência é preservada; largura máxima 220px desktop / 170px mobile, sem recorte, fundo ou efeitos na arte. Também atende catálogo inicialmente vazio.

Busca normaliza caixa e acentos e combina palavras com AND em título, descrição, IDs/nomes localizados de categorias, tags e keywords. Não indexa corpo LU, pois o índice atual não o oferece. Categoria e todas as tags selecionadas são combinadas com o texto. O filtro sempre precede a paginação; `PAGE_SIZE = 10`. Busca/filtros/limpeza retornam à página 1; páginas fora do intervalo são ajustadas. A UI renderiza somente os dez registros visíveis, além de um template inerte.

URLs aceitam `q`, `category`, `tag` repetido e `page`, por exemplo `/pt-br/blogs/?q=compilador&category=experiments&tag=systems&page=2`. Digitação usa debounce de 160ms e `replaceState`; filtros/páginas usam `pushState`. Voltar/avançar restaura filtros. Parâmetros alheios e fragmentos são preservados. Filtros antigos de links compartilhados ficam visíveis e podem ser removidos mesmo se não existirem mais no catálogo.

## Organização e performance

- `components/explore/`: composição, busca, filtros, resultado, paginação e vazio.
- `data/explore.ts`: estado, filtro/paginação e URL, sem dependência de DOM ou renderer LU.
- `data/explore-catalog.ts`: adaptação do banco no build; `explore-images.ts`: variantes locais responsivas com `astro:assets`.
- `utils/blog-explore.ts`: único controlador interativo, Web Component nativo com limpeza de listeners e timer. Não usa React nem biblioteca de busca.
- `styles/blog-explore.css`: visual restrito ao Blog, com seletores de estado, foco visível e layout mobile.
- `public/i18n/blog.en.json` / `blog.pt-br.json`: textos específicos, sem alterar o contrato global de mensagens.

Astro entrega os primeiros dez posts como HTML estático e inclui apenas metadados do catálogo para filtragem local. Imagens locais recebem dimensões e `srcset`; imagens HTTPS conservam URL original sem acesso à rede durante a preparação da listagem. Todas as capas e o cachorro usam lazy loading. Sem JavaScript, só a primeira página está disponível; busca, filtros, URL e paginação dependem do controlador. Não há busca remota automática; a adaptação do catálogo pode ser substituída futuramente sem alterar os componentes de resultado.

## Validação

Testes escritos em `data/explore.test.ts` cobrem isolamento Blog, tradução/base, busca normalizada, filtros combinados, 23 resultados em 10/10/3, modos, reset, destaque, URLs e traduções. `backend/content/blog-metadata.test.ts` cobre aliases, validação dos metadados e compatibilidade.

Nesta implementação, somente inspeção estática dos fontes, arquivos/imports, traduções e whitespace. Código do projeto, testes, check, build e navegador não foram executados, conforme CodeMode. Para validação posterior: `npm test -- frontend/paginas/blogs/data/explore.test.ts backend/content/blog-metadata.test.ts`, `npm run check`, `npm run build`; inspecionar EN/PT-BR, mobile, teclado, voltar/avançar, derivados de imagem e catálogo real com pelo menos 23 artigos. O catálogo público atual está vazio; a composição com posts e o comportamento em execução ainda não foram observados.
