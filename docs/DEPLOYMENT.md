# Publicação estática no GitHub Pages

## Fluxo automático

O site é compilado como estático pelo Astro (**output: static**) e publicado pelo workflow **.github/workflows/deploy.yml**.

- Push para **main** ou **deploy/github-pages**: instala as dependências pelo lockfile, gera **dist/**, envia o artefato e publica no GitHub Pages.
- Execução manual: abra **Actions → Deploy to GitHub Pages → Run workflow**.
- URL do repositório atual: <https://yrickzc.github.io/PES_Ricks/>.

O workflow usa a action oficial do Astro com o CLI chamado diretamente pelo Node e a action de deploy do GitHub Pages. Ele não versiona **dist/**; dependências e saídas locais estão no **.gitignore**.

## Variáveis públicas

O **.env** local é ignorado pelo Git e não existe no runner do GitHub. Antes de compilar, o workflow copia **.env.example** para **.env**, disponibilizando `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_YOUTUBE_URL` e `PUBLIC_INSTAGRAM_URL` ao Astro. O Astro incorpora esses valores no site estático; o arquivo **.env** não faz parte do artefato enviado ao Pages. Como os valores `PUBLIC_*` ficam visíveis no site publicado, não use esse arquivo para credenciais privadas.

Ao alterar os links sociais, atualize **.env.example**; o workflow usa esse arquivo tanto para a publicação quanto como referência da configuração pública.

## Ativação no repositório

Na primeira configuração, abra **Settings → Pages** e selecione **GitHub Actions** em **Build and deployment → Source**. Depois, um push em **main** ou **deploy/github-pages** inicia o deploy; acompanhe o resultado na aba **Actions**.

## Diagnóstico de timeout

Se o build passar e o deploy ficar em `deployment_queued` ou `updating_pages` até expirar, confira os logs do job **Deploy**. No `actions/deploy-pages@v5`, valores de timeout acima de **600.000 ms (10 minutos)** são limitados a esse máximo pelo runtime observado; aumentar o valor no workflow não estende a espera.

## Caminho base

**astro.config.ts** mantém o modo **static** e calcula o site e caminho base para o destino:

- No GitHub Actions, repositórios de projeto usam **/<nome-do-repositório>**; repositórios **<owner>.github.io** usam **/**.
- No desenvolvimento local, o caminho base é **/**.
- O idioma padrão, imagens do Astro e links de páginas seguem a configuração base. Links, imagens e artigos internos LU também recebem o prefixo do Pages.

Para um domínio/caminho diferente, defina **PUBLIC_SITE_URL** e **PUBLIC_BASE_PATH** no ambiente do job de build. Por exemplo, domínio próprio na raiz: **PUBLIC_SITE_URL=https://exemplo.com** e **PUBLIC_BASE_PATH=/**.

## Cache e auditoria de desempenho

As capturas Lighthouse de 2026-11-08 mostram TTL de dez minutos nos assets publicados no GitHub Pages. O workflow atual envia arquivos estáticos; não configura cabeçalhos HTTP `Cache-Control`. Os nomes com hash em `_astro/` já distinguem versões dos derivados, mas não ampliam o TTL da resposta.

Um arquivo `_headers` ou uma tag HTML não altera esse cabeçalho no fluxo atual. Para atender ao alerta de cache longo, é necessário configurar uma camada de hospedagem/CDN que permita definir cabeçalhos: assets com hash podem receber `public, max-age=31536000, immutable`, mantendo HTML revalidável e evitando aplicar cache imutável aos arquivos públicos sem hash. Nenhuma mudança de infraestrutura ou publicação foi feita nesta correção; o TTL permanece uma pendência da hospedagem.

## Build local

~~~powershell
npm ci
npm run build
~~~

O resultado estático fica em **dist/**. O build não foi executado ao adicionar este setup; a primeira compilação e publicação devem ser acompanhadas na aba **Actions**.
