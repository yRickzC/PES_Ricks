# Publicação estática no GitHub Pages

## Fluxo automático

O site é compilado como estático pelo Astro (**output: static**) e publicado pelo workflow **.github/workflows/deploy.yml**.

- Push para **main** ou **deploy/github-pages**: instala as dependências pelo lockfile, gera **dist/**, envia o artefato e publica no GitHub Pages.
- Execução manual: abra **Actions → Deploy to GitHub Pages → Run workflow**.
- URL do repositório atual: <https://yrickzc.github.io/PES_Ricks/>.

O workflow usa a action oficial do Astro com o CLI chamado diretamente pelo Node e a action de deploy do GitHub Pages. Ele não versiona **dist/**; dependências e saídas locais estão no **.gitignore**.

## Ativação no repositório

Na primeira configuração, abra **Settings → Pages** e selecione **GitHub Actions** em **Build and deployment → Source**. Depois, um push em **main** ou **deploy/github-pages** inicia o deploy; acompanhe o resultado na aba **Actions**.

## Caminho base

**astro.config.ts** mantém o modo **static** e calcula o site e caminho base para o destino:

- No GitHub Actions, repositórios de projeto usam **/<nome-do-repositório>**; repositórios **<owner>.github.io** usam **/**.
- No desenvolvimento local, o caminho base é **/**.
- O idioma padrão, imagens do Astro e links de páginas seguem a configuração base. Links, imagens e artigos internos LU também recebem o prefixo do Pages.

Para um domínio/caminho diferente, defina **PUBLIC_SITE_URL** e **PUBLIC_BASE_PATH** no ambiente do job de build. Por exemplo, domínio próprio na raiz: **PUBLIC_SITE_URL=https://exemplo.com** e **PUBLIC_BASE_PATH=/**.

## Build local

~~~powershell
npm ci
npm run build
~~~

O resultado estático fica em **dist/**. O build não foi executado ao adicionar este setup; a primeira compilação e publicação devem ser acompanhadas na aba **Actions**.
