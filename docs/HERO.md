# Hero cinematográfica

A home usa uma composição Astro com imagens estáticas, névoa CSS e um controlador TypeScript no navegador. Não exige React nem uma biblioteca de animação. O projeto atual não tem integração React instalada.

## Arquivos

- `frontend/paginas/home/components/HomeHero.astro`: seção, título, conteúdo localizado, CTAs e montagem do controlador.
- `frontend/paginas/home/components/HeroScene.astro`: renderização das imagens e das três camadas de névoa.
- `frontend/paginas/home/config/hero.ts`: assets, dimensões originais, posições desktop/mobile, escala, opacidade, ordem e profundidade.
- `frontend/paginas/home/utils/hero-parallax.ts`: entrada do mouse, scroll, interpolação, pausa e limpeza dos listeners.
- `frontend/paginas/home/styles/hero.css`: composição, leitura, responsividade e animação da névoa.
- `public/i18n/en.json` e `pt-br.json`: texto inicial da hero. CTAs levam às rotas localizadas de projetos e blogs; “View Lab Notes” descreve o destino de notas, sem criar uma seção de pesquisa fictícia.

## Ajustar a cena

Em `heroLayers`, cada imagem tem um `id` exclusivo e as seguintes propriedades:

| Parâmetro | Efeito |
|---|---|
| `src`, `width`, `height` | Caminho público e dimensões originais da imagem. |
| `desktop` / `mobile` | Composição independente em cada faixa de tela. |
| `x`, `y` | Centro da imagem em relação à seção; fábrica e engrenagens usam a faixa inferior como referência. |
| `width` | Largura CSS, aceitando %, vw, min() e max(). A proporção original é preservada. |
| `scale` | Multiplicador opcional; padrão 1. |
| `anchorY` | Âncora vertical: -50% no centro; -100% prende a borda inferior em y. |
| `zIndex`, `opacity` | Ordem dentro da cena e intensidade da imagem. |
| `depth.pointer` | Deslocamento máximo em pixels por eixo para a posição normalizada do mouse. |
| `depth.scroll` | Deslocamento vertical em pixels ao percorrer uma altura da hero. |

Exemplo de ajuste da ilha:

```ts
desktop: { x: "50%", y: "48%", width: "min(50vw, 720px)", scale: 1 },
depth: { pointer: 20, scroll: 55 },
```

`heroMotion` controla a consulta de desktop, amortecimento, tolerância para encerrar os frames e limite de scroll. Valores de profundidade são independentes por camada. Para adicionar uma imagem, acrescente um item em `heroLayers`; o renderizador e o controlador reconhecem o novo item automaticamente.

`heroFog.layers` ajusta posição, área, opacidade, duração, atraso inicial, deslocamento horizontal e oscilação vertical de cada nuvem. A névoa usa três gradientes radiais por nuvem; apenas o transform é animado. O blur de 20px é estático e removido abaixo de 960px. Não existe imagem de névoa.

O céu tem margem extra de 40px em `hero.css` para o parallax não revelar bordas. Ao ampliar sua profundidade, preserve margem suficiente. A atmosfera fica entre céu e lua; a névoa fica entre ilha e fábrica. Vinheta e texto ficam acima da cena, em contextos de empilhamento separados. A vinheta não recebe cliques.

A lua usa opacidade total, halo procedural atrás da imagem e iluminação por filtros CSS estáticos. O halo acompanha as mesmas coordenadas e o parallax da lua em desktop/mobile. Em `.hero-layer--moon`, ajuste `--moon-brightness`, `--moon-contrast`, `--moon-halo-size`, `--moon-halo-opacity` e as cores de luz. Não há canvas, WebGL ou animação de filtros; o efeito permanece visível sem JavaScript e com movimento reduzido.

## Comportamento e responsividade

Texto e ilha seguem o eixo central. A lua fica pequena e centralizada na borda superior da hero (`y: "0%"` nos dois layouts), parcialmente cortada junto ao header pelo overflow da seção; seu halo acompanha o recorte. A ilha fica menor, abaixo do título e dos CTAs. No desktop, a largura da ilha é limitada a 720px; no mobile, a 620px, considerando a área transparente do PNG.

Fábrica e engrenagens ficam numa faixa inferior com recorte e máscara gradual no topo, formando a transição para a próxima área. A fábrica deixa de ocupar o centro da cena. `--hero-transition-height` controla essa faixa: 180–280px no desktop e 150–220px no mobile. As panorâmicas mantêm a proporção; a fábrica usa largura mínima de 660px no mobile para preservar detalhes. A seção seguinte ainda não foi criada.

A seção usa a altura da viewport com mínimo de 820px no desktop, 860px no telefone e 980px no tablet. `--hero-copy-top` reserva espaço para a lua antes do conteúdo. Esses valores ficam em `hero.css`; posições e larguras das imagens ficam em `hero.ts`. Ajuste-os após conferir os dois idiomas.

Mouse e scroll usam um único requestAnimationFrame por instância. O controlador interpola com tempo decorrido, limita entradas e encerra os frames quando a composição estabiliza. Mede a seção somente quando as dimensões ou o scroll invalidam os limites. IntersectionObserver e visibilitychange pausam os efeitos fora da tela ou com a aba oculta. A desmontagem remove listeners, observers e transformações.

Em telas com toque ou abaixo de 960px, o parallax fica estático; a névoa mantém seu movimento lento. `prefers-reduced-motion` desliga ambos os efeitos, inclusive quando a preferência muda. Sem JavaScript, toda a composição e os links continuam disponíveis, com névoa estática. Não há entrada animada que esconda o conteúdo inicial.

## Imagens e validação pendente

Os cinco PNG originais permanecem em `public/images/Ladding_Hero_*.png`, somando 7,61 MiB. A ilha tem prioridade de carregamento alta; as outras imagens têm prioridade baixa, dimensões explícitas e decodificação assíncrona. Todos os assets da primeira dobra são eager. Imagens em public são servidas diretamente: esta implementação não gera WebP/AVIF nem srcset. Variantes comprimidas e responsivas são a próxima melhoria de transferência, preservando transparência nos quatro recortes.

A entrega teve inspeção estática de imports, assets, catálogos e atualização do grafo por AST local. Aplicativo, navegador, testes, check e build não foram executados, conforme CodeMode. Não há medição de FPS, LCP ou resultado visual em execução.

Quando a execução estiver autorizada, confira / e /pt-br/ em 320, 390, 768, 1024 e 1440px, com mouse/scroll, zoom de texto, teclado, movimento reduzido e troca de aba. Verifique recortes, contraste, pausa, retorno à hero e CTAs. Os comandos existentes `npm run check`, `npm test` e `npm run build` continuam disponíveis para validação.
