# Hero do serviço Landing Page

## Rota e isolamento

`ServicePage.astro` renderiza `LandingHero` apenas quando o slug é `landing-page`.
Rotas: `/services/landing-page/` e `/pt-br/services/landing-page/`, prefixadas
pela base configurada (`/PES_Ricks` no GitHub Pages). As demais ofertas usam o
template de construção existente. Título, canonical e alternância de idioma
continuam no layout Main; a descrição desta oferta usa a subheadline localizada.

## Responsabilidades

- `components/LandingHero.astro`: headline, CTAs reais, mensagens comerciais,
  narrativa e seção imediata de transição `#landing-next`.
- `components/LandingOfferScene.astro`: ambientes, interface demonstrativa e uma
  única embalagem ORBIT em HTML/CSS. O SVG vetorial da embalagem é local/inline.
- `config/landing.ts` e `public/i18n/landing.*.json`: catálogo tipado EN/PT-BR.
- `utils/landing-timeline.ts`: função pura do progresso para os estados visuais.
- `utils/landing-hero.ts`: montagem, medidas, scroll e limpeza dos recursos.
- `styles/landing-hero.css`: composição, transforms, profundidade e responsividade.

Não há imagens remotas, Canvas, bibliotecas de animação ou imagens grandes.
A caixa não é recriada durante o scroll. O preview inicial à direita contém
elementos decorativos; a transformação principal reorganiza os mesmos nós de
título, descrição, benefícios e CTA ilustrativo, usando transform.

## Progresso reversível

A seção tem 400svh no desktop e 360svh no mobile, com um painel sticky.
O controlador mede a posição e a distância útil no início e em redimensionamentos.
O progresso é `(scrollY - início) / distância`, limitado pela timeline a 0–1.
Um listener passivo agenda no máximo um requestAnimationFrame por quadro.
O caminho de scroll não mede geometria nem altera dimensões do layout.

0–15% mostra a divisão diagonal; 15–35% move seu limite para fora e expande
o ambiente ruim; 35–50% mantém o problema evidente; 50–75% reorganiza a interface;
75–90% apresenta o resultado; 90–100% estabiliza e afasta levemente a câmera.
Mensagens saem antes da próxima entrar para evitar sobreposição de textos.
Não existe relógio, autoplay ou integração dependente da direção do gesto.

O limite do ambiente inicial e seu traço fino usam clip-path. Transform e opacity controlam
os demais elementos. Não há blur animado. IntersectionObserver evita atualizações
fora da seção; a aba oculta também pausa o desenho. AbortController, observers
e RAF são limpos no `astro:before-swap`. `pageshow` recalcula após restauração.

## Destinos e continuidade

“Ver demonstração” aponta para `#landing-transformation`, dentro do trecho de
transformação da Hero, usando scroll nativo. “Quero minha landing page” aponta
para o formulário existente na rota localizada `/services/#quote`.

`#landing-next`, marcado com `data-landing-demo-slot`, é o ponto de integração da
futura demonstração. Mostra os objetivos Atrair clientes/Vender um produto como
informação, sem controles fictícios ou uma demonstração ainda não implementada.
O desenvolvimento completo da demonstração, preços, FAQ e formulário fica fora
desta entrega. A condição comercial aprovada aparece no painel da Hero.

## Acessibilidade e fallback

A copy está no HTML inicial, os links recebem foco visível e a cena possui uma
descrição acessível. O botão demonstrativo dentro da ilustração é um span e não
compete com os CTAs reais. A decoração fica oculta da árvore acessível.

Sem JavaScript, sem suporte aos observers ou com prefers-reduced-motion, o painel
fica no fluxo normal, com a apresentação profissional estática, as mensagens e
o preço disponíveis. Janelas baixas preservam a timeline, permitindo que o início
do painel role para cima antes de fixar a área visual e a narrativa.

## Validação desta entrega

Executados: TypeScript estrito dos módulos, parsers Astro e CSS, paridade das
chaves de tradução e inspeção numérica de marcos da timeline. Aplicativo, build,
suíte de testes e navegador não executados: AGENTS.md exige autorização específica;
a resposta recebida confirmou a rota, sem autorizar essa execução.

Ainda precisam de observação em navegador: enquadramento real em diferentes
alturas, rolagem/âncoras, restauração do histórico, contraste da composição e
fluidez em aparelho intermediário. Não há medição de FPS, CLS ou Lighthouse.
