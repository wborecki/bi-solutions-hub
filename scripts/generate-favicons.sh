#!/bin/bash

# Script para gerar favicons a partir do logo principal
# Requer ImageMagick instalado

echo "🎨 Gerando Favicons - Solutions in BI"
echo "====================================="
echo ""

# Verificar ImageMagick
if ! command -v convert &> /dev/null; then
  echo "❌ ImageMagick não encontrado!"
  echo ""
  echo "Instale com:"
  echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
  echo "  macOS: brew install imagemagick"
  echo ""
  echo "ALTERNATIVA: Use https://realfavicongenerator.net"
  echo "  1. Acesse o site"
  echo "  2. Upload de src/assets/logo-sbi-nobg.png"
  echo "  3. Download do pacote de favicons"
  echo "  4. Substitua os arquivos em /public/"
  exit 1
fi

cd "$(dirname "$0")" || exit 1

SOURCE="../src/assets/logo-sbi-nobg.png"
OUTPUT_DIR="../public"

if [ ! -f "$SOURCE" ]; then
  echo "❌ Arquivo fonte não encontrado: $SOURCE"
  exit 1
fi

echo "📁 Fonte: $SOURCE"
echo "📁 Destino: $OUTPUT_DIR"
echo ""

# Backup dos favicons antigos
echo "💾 Criando backup dos favicons antigos..."
[ -f "$OUTPUT_DIR/favicon.ico" ] && cp "$OUTPUT_DIR/favicon.ico" "$OUTPUT_DIR/favicon.ico.backup"
[ -f "$OUTPUT_DIR/favicon.png" ] && cp "$OUTPUT_DIR/favicon.png" "$OUTPUT_DIR/favicon.png.backup"
echo ""

echo "🎨 Gerando favicons em múltiplos tamanhos..."

# Gerar favicon.png (192x192 para manifest)
echo "  → favicon.png (192x192)"
convert "$SOURCE" -resize 192x192 -background none -gravity center -extent 192x192 "$OUTPUT_DIR/favicon.png"

# Gerar favicon.ico (multi-resolução: 16, 32, 48)
echo "  → favicon.ico (16x16, 32x32, 48x48)"
convert "$SOURCE" \
  \( -clone 0 -resize 16x16 -background none -gravity center -extent 16x16 \) \
  \( -clone 0 -resize 32x32 -background none -gravity center -extent 32x32 \) \
  \( -clone 0 -resize 48x48 -background none -gravity center -extent 48x48 \) \
  -delete 0 "$OUTPUT_DIR/favicon.ico"

# Gerar apple-touch-icon (180x180)
echo "  → apple-touch-icon.png (180x180)"
convert "$SOURCE" -resize 180x180 -background none -gravity center -extent 180x180 "$OUTPUT_DIR/apple-touch-icon.png"

# Gerar icon-512.png para manifest
echo "  → icon-512.png (512x512)"
convert "$SOURCE" -resize 512x512 -background none -gravity center -extent 512x512 "$OUTPUT_DIR/icon-512.png"

echo ""
echo "✅ Favicons gerados com sucesso!"
echo ""
echo "📦 Arquivos criados:"
echo "  ✓ favicon.ico (16, 32, 48px)"
echo "  ✓ favicon.png (192px)"
echo "  ✓ apple-touch-icon.png (180px)"
echo "  ✓ icon-512.png (512px)"
echo ""
echo "💾 Backups:"
echo "  • favicon.ico.backup"
echo "  • favicon.png.backup"
echo ""
echo "🔄 Próximos passos:"
echo "  1. Limpe o cache do navegador (Ctrl+F5)"
echo "  2. Verifique em modo anônimo"
echo "  3. Teste instalação PWA"
echo ""
