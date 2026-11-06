# Hero do Blog / Lab Notes

A listagem de blogs usa `BlogHero.astro` antes das notas LU, dentro do layout global. As páginas de artigos mantêm seu cabeçalho editorial próprio. O título é LAB NOTES; o primeiro CTA aponta para `#lab-notes`, e o segundo abre projetos no idioma atual. Os textos ficam nos catálogos PT-BR/EN.

## Composição

Deserto escuro, limpo e silencioso: o céu compartilhado existente e quatro camadas de areia são os únicos assets da cena. A tipografia Geist grande é o ponto principal; os links discretos deixam a paisagem respirar. Sem caixas atrás do texto, névoa animada, objetos, ícones ou brilho adicional.

Paleta: fundo `#07070a`, texto `#f4f4f6`, texto secundário `#d0cbd8`, label `#c2b6d3` e acento `#9c86c0`. Gradientes suaves nas bordas integram o fundo e a seção seguinte. O conteúdo fica centralizado no terço superior; o horizonte e o foreground ocupam a área inferior.

## Arquivos e ajustes

- `frontend/paginas/blogs/components/BlogHero.astro`: renderização e montagem no ciclo de navegação Astro.
- `frontend/paginas/blogs/config/hero.ts`: fontes, profundidade, deslocamento vertical, escala, ordem e parâmetros de motion.
- `frontend/paginas/blogs/utils/hero-parallax.ts`: adaptador para o controlador compartilhado com Projects e Services.
- `frontend/paginas/blogs/styles/blog-hero.css`: composição, leitura, vinheta e responsividade.

| Camada | Asset existente em public/images | Depth | yOffset | Scale | zIndex |
| --- | --- | --- | --- | --- | --- |
| sky | Hero_Main_Background.webp | 0.08 | 0% | 1.12 | 0 |
| duna_0 | Blog_Hero_Dune_0.webp | 0.15 | -18% | 1.04 | 1 |
| duna_1 | Blog_Hero_Dune_1.webp | 0.28 | 2% | 1.04 | 2 |
| duna_2 | Blog_Hero_Dune_2.webp | 0.45 | 12% | 1.04 | 3 |
| duna_3 | Blog_Hero_Dune_3.webp | 0.70 | 20% | 1.04 | 4 |

`duna_0` a `duna_3` são IDs explícitos na configuração. Os quatro originais PNG, com canvas transparente de 2172 × 724, ficam em `RAW/images/`; as versões públicas WebP mantêm os mesmos nomes-base. `yOffset` é uma porcentagem da altura do plano: valores positivos descem a imagem; negativos sobem. Os offsets diferenciam as cristas para que os planos próximos não ocultem toda a paisagem distante. A escala ancorada na base protege as laterais. As imagens usam cover e recorte central, preservando proporção.

A altura mínima é 94svh no desktop, com piso de 680px para acomodar texto; no mobile, 92svh com piso de 720px. Conteúdo pode expandir a seção com zoom ou fontes maiores. O plano das dunas ocupa 80% da altura no mobile, liberando espaço para leitura. Ajuste `--hero-height`, `--dune-height` e o padding de `.blog-hero-content` para mudar a composição.

## Parallax

O controlador usa o progresso local da seção no scroll. A distância base é limitada ao menor valor entre 18% da altura e 140px; cada camada multiplica essa distância por seu depth. Assim, 0.70 representa a proporção relativa do foreground, sem deslocá-lo por 70% de todo o scroll da página. Movimento positivo acompanha a rolagem com intensidades diferentes. Escala e offset ficam na imagem interna; translate3d fica no plano externo, sem sobrescrever a composição.

No desktop com mouse, `pointerTravel` define um percurso de 36px em cada eixo, de uma extremidade à outra, antes do multiplicador de profundidade. Ao sair da hero, a contribuição do mouse retorna suavemente a zero. No mobile ou com ponteiro de toque, a rolagem desloca as camadas na vertical com até 50% do percurso e progride ao longo da altura da hero. `requestAnimationFrame` interpola o movimento e encerra ao estabilizar. A atualização pausa fora da viewport e com a aba oculta. `prefers-reduced-motion` mantém a cena estática. Observers, listeners e frames são removidos antes da troca de página Astro. Sem JavaScript, a composição permanece estática e os links funcionam.

SiteImage usa os WebP locais com variantes responsivas, carregamento eager e decode assíncrono. Somente o foreground recebe prioridade alta. Os originais estão preservados em `RAW/images/`.

## Validação

Inspeção dos quatro assets, imports, configuração, catálogos e ciclo de montagem realizada estaticamente. Aplicativo, navegador, testes, check e build não executados, conforme CodeMode. Recortes, alinhamento das cristas, contraste, navegação e suavidade precisam de inspeção real em desktop/mobile, com scroll, retorno ao topo, zoom e reduced motion. Não há medição de FPS, LCP ou derivados gerados.
