# Logo com transparência

- Origem: `RAW/images/Rick_Logo.png`, preservado como backup.
- Resultado aplicado no cabeçalho: `public/images/Rick_Logo.webp`.
- Resultado aplicado no hero dos projetos: `public/images/Rick_Logo_Transparent.webp`, WebP com alpha convertido do PNG RGBA de 1254 × 1254 preservado em `RAW/images/`.
- Método: ferramenta imagegen integrada, edição da imagem original com `transparent_background: true`; sem CLI/API externa adicional.
- Duas variantes foram geradas. A segunda foi escolhida após inspeção e comparação local de pixels, pois preservou melhor as formas brancas e removeu mais áreas escuras.
- Verificação por amostragem a cada cinco pixels: 18.614 de 18.779 amostras claras mantidas claras e opacas; 42.395 de 43.116 amostras escuras com alpha inferior a 30. Canto e interior escuro do rosto transparentes. Não é uma extração matematicamente idêntica; bordas e pequenos detalhes podem variar.
- Os dois WebP foram codificados com FFmpeg/libwebp; a versão transparente mantém canal alpha. Referências nos componentes conferidas estaticamente. Aplicativo, navegador, testes e build não executados; composição final no site pendente de validação.

## Prompt da variante aplicada

> Remove only the dark navy/black ink/background from this exact white stencil logo. IMPORTANT: retain ONLY the white pixels/shapes already present in the original; every dark pixel, including the face interior, black hair gaps, dark clothing gaps, the hat interior and the entire background, must become fully transparent. Do not replace black regions with white! Do not fill the character silhouette. Do not create a solid white face or solid white hat. Preserve the original white line artwork pixel-for-pixel as closely as possible. Clean sharp white logo on an alpha-transparent canvas, no added dots, no texture, no stray pixels, no new strokes. Original square framing. The resulting visible white artwork must match the original white artwork exactly when placed over a black background.
