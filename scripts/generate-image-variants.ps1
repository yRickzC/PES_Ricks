[CmdletBinding()]
param(
  [string]$FfmpegPath = ""
)

$ErrorActionPreference = "Stop"
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

if (-not $FfmpegPath) {
  $ffmpegCommand = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($ffmpegCommand) {
    $FfmpegPath = $ffmpegCommand.Source
  } else {
    $FfmpegPath = "C:\R\storage\ffmpeg\bin\ffmpeg.exe"
  }
}

if (-not (Test-Path -LiteralPath $FfmpegPath -PathType Leaf)) {
  throw "FFmpeg não encontrado. Informe -FfmpegPath ou adicione ffmpeg ao PATH."
}

$ffprobePath = Join-Path (Split-Path -Parent $FfmpegPath) "ffprobe.exe"
if (-not (Test-Path -LiteralPath $ffprobePath -PathType Leaf)) {
  $ffprobeCommand = Get-Command ffprobe -ErrorAction SilentlyContinue
  if ($ffprobeCommand) {
    $ffprobePath = $ffprobeCommand.Source
  } else {
    throw "ffprobe não encontrado ao lado do FFmpeg nem no PATH."
  }
}

$publicImages = Join-Path $projectRoot "public\images"
$rawImages = Join-Path $projectRoot "RAW\images"
$desktopOutput = Join-Path $publicImages "desktop"
$mobileOutput = Join-Path $publicImages "mobile\responsive"
$rasterExtensions = @(".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp")
$preferredRawExtensions = @(".png", ".webp", ".jpg", ".jpeg", ".avif", ".gif")

$inputs = @(
  Get-ChildItem -LiteralPath $publicImages -File |
    Where-Object { $rasterExtensions -contains $_.Extension.ToLowerInvariant() }
  Get-ChildItem -LiteralPath (Join-Path $projectRoot "frontend\paginas\services\assets") -File |
    Where-Object { $_.BaseName -match '^Ladding_Section_Step[1-3]$' -and $rasterExtensions -contains $_.Extension.ToLowerInvariant() }
)

New-Item -ItemType Directory -Force -Path $desktopOutput, $mobileOutput | Out-Null
$outputCount = 0

foreach ($inputFile in $inputs) {
  $sourceFile = $inputFile.FullName
  if (Test-Path -LiteralPath $rawImages -PathType Container) {
    $rawCandidates = @(Get-ChildItem -LiteralPath $rawImages -File -Filter "$($inputFile.BaseName).*" |
      Where-Object { $rasterExtensions -contains $_.Extension.ToLowerInvariant() } |
      Sort-Object { [Array]::IndexOf($preferredRawExtensions, $_.Extension.ToLowerInvariant()) })
    if ($rawCandidates.Count -gt 0) { $sourceFile = $rawCandidates[0].FullName }
  }

  $probe = & $ffprobePath -v error -select_streams v:0 -show_entries stream=width,height -of json $sourceFile
  if ($LASTEXITCODE -ne 0) { throw "ffprobe falhou para: $sourceFile" }
  $stream = ($probe | ConvertFrom-Json).streams | Select-Object -First 1
  if (-not $stream -or $stream.width -lt 1 -or $stream.height -lt 1) {
    throw "Não foi possível ler as dimensões de: $sourceFile"
  }

  $widths = @(@(480, 768, 1200, 1600) | Where-Object { $_ -le $stream.width })
  if ($widths.Count -eq 0) { $widths = @([int]$stream.width) }
  $desktopFile = Join-Path $desktopOutput "$($inputFile.BaseName).webp"
  $desktopArgs = @(
    "-hide_banner", "-loglevel", "error", "-y", "-i", $sourceFile,
    "-frames:v", "1", "-c:v", "libwebp", "-lossless", "1", "-quality", "100", "-preset", "picture",
    $desktopFile
  )
  & $FfmpegPath @desktopArgs
  if ($LASTEXITCODE -ne 0) { throw "FFmpeg falhou ao criar a versão desktop: $desktopFile" }
  $outputCount++

  foreach ($width in $widths) {
    $mobileFile = Join-Path $mobileOutput "$($inputFile.BaseName)-$width.webp"
    $scaleFilter = "scale=${width}:-2:flags=lanczos"
    $mobileArgs = @(
      "-hide_banner", "-loglevel", "error", "-y", "-i", $sourceFile,
      "-frames:v", "1", "-vf", $scaleFilter, "-c:v", "libwebp", "-lossless", "0", "-quality", "88", "-preset", "picture",
      $mobileFile
    )
    & $FfmpegPath @mobileArgs
    if ($LASTEXITCODE -ne 0) { throw "FFmpeg falhou ao criar a versão mobile: $mobileFile" }
    $outputCount++
  }
}

Write-Output "Imagens processadas: $($inputs.Count)"
Write-Output "Arquivos WebP criados/atualizados: $outputCount"
Write-Output "Desktop: WebP lossless, dimensões da origem escolhida"
Write-Output "Mobile: WebP com qualidade 88, Lanczos, larguras responsivas até 1600px"
