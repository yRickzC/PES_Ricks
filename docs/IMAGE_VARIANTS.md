# Variantes de imagem

O site serve imagens locais em duas camadas:

- `public/images/desktop/`: WebP lossless na resolução da origem. O encoder ainda comprime os dados, mas não descarta informação visual.
- `public/images/mobile/responsive/`: WebP redimensionado com Lanczos e qualidade 88, nas larguras responsivas de 480, 768, 1200 e 1600 px que não excedem a origem.

Quando existe uma fonte raster de mesmo nome em `RAW/images/`, ela é usada como entrada. As três etapas de construção em `frontend/paginas/services/assets/` também são incluídas. SVGs permanecem vetoriais. Variantes manuais já presentes em `public/images/mobile/` são preservadas.

Para regenerar no Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\generate-image-variants.ps1
```

Se FFmpeg não estiver no `PATH`, informe o executável:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\generate-image-variants.ps1 -FfmpegPath "C:\R\storage\ffmpeg\bin\ffmpeg.exe"
```

`frontend/utils/image-variants.ts` mantém os caminhos e descritores `srcset` alinhados ao esquema de arquivos.
