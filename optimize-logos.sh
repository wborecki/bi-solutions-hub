#!/bin/bash

# Script para otimizar logos dos clientes
# Remove backgrounds brancos e otimiza tamanho

echo "🎨 Otimização de Logos - Solutions in BI"
echo "========================================"
echo ""

# Diretório de assets
ASSETS_DIR="src/assets"

# Logos que precisam de otimização
LOGOS=(
  "logo-oab-parana.png"
  "logo-c3.png"
)

echo "📋 Logos a serem otimizados:"
for logo in "${LOGOS[@]}"; do
  echo "  - $logo"
done
echo ""

echo "⚠️  IMPORTANTE:"
echo "Este script requer ImageMagick instalado."
echo ""
echo "Para instalar no Ubuntu/Debian:"
echo "  sudo apt-get install imagemagick"
echo ""
echo "Para instalar no macOS:"
echo "  brew install imagemagick"
echo ""

# Verificar se ImageMagick está instalado
if ! command -v convert &> /dev/null; then
  echo "❌ ImageMagick não encontrado. Por favor, instale-o primeiro."
  echo ""
  echo "ALTERNATIVA: Use ferramentas online como:"
  echo "  • https://remove.bg - Remove background automaticamente"
  echo "  • https://www.photopea.com - Editor online gratuito"
  echo "  • https://squoosh.app - Otimiza e converte imagens"
  exit 1
fi

cd "$ASSETS_DIR" || exit 1

echo "🔨 Processando imagens..."
echo ""

for logo in "${LOGOS[@]}"; do
  if [ -f "$logo" ]; then
    echo "Processando: $logo"
    
    # Backup do original
    cp "$logo" "${logo}.backup"
    
    # Remover fundo branco e converter para PNG transparente
    # Ajusta o threshold para remover brancos (fuzz=10% permite variação)
    convert "$logo" \
      -fuzz 10% \
      -transparent white \
      -background none \
      -trim \
      +repage \
      "${logo%.png}-nobg.png"
    
    echo "  ✓ Criado: ${logo%.png}-nobg.png"
    echo "  ✓ Backup: ${logo}.backup"
    echo ""
  else
    echo "  ⚠️  Arquivo não encontrado: $logo"
    echo ""
  fi
done

echo "✅ Processamento concluído!"
echo ""
echo "📁 Arquivos gerados:"
echo "  - *-nobg.png : Versões sem background"
echo "  - *.backup   : Backups dos originais"
echo ""
echo "🔄 Próximo passo: Atualize as importações no código:"
echo "  import logoOAB from '@/assets/logo-oab-parana-nobg.png';"
echo "  import logoOthree from '@/assets/logo-c3-nobg.png';"
echo ""
