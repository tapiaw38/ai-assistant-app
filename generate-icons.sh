#!/bin/bash

# Script para generar iconos de diferentes tamaños desde la imagen principal
# Incluye iconos para móviles (Apple Touch Icon, Android, PWA)
# Uso: ./generate-icons.sh

SOURCE_IMAGE="src/assets/nymia-app.png"
ICONS_DIR="public/icons"

# Verificar que existe la imagen fuente
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Error: No se encuentra la imagen fuente en $SOURCE_IMAGE"
    exit 1
fi

# Crear directorio de iconos si no existe
mkdir -p "$ICONS_DIR"

echo "Generando iconos desde $SOURCE_IMAGE..."

# Usar magick en lugar de convert (más moderno)
CONVERT_CMD="magick"

# Generar favicons en diferentes tamaños
$CONVERT_CMD "$SOURCE_IMAGE" -resize 16x16 "$ICONS_DIR/favicon-16x16.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 32x32 "$ICONS_DIR/favicon-32x32.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 96x96 "$ICONS_DIR/favicon-96x96.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 128x128 "$ICONS_DIR/favicon-128x128.png"

# Generar iconos para móviles
echo "Generando iconos para móviles..."

# Apple Touch Icons (iOS)
$CONVERT_CMD "$SOURCE_IMAGE" -resize 180x180 "$ICONS_DIR/apple-touch-icon.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 152x152 "$ICONS_DIR/apple-touch-icon-152x152.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 144x144 "$ICONS_DIR/apple-touch-icon-144x144.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 120x120 "$ICONS_DIR/apple-touch-icon-120x120.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 114x114 "$ICONS_DIR/apple-touch-icon-114x114.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 76x76 "$ICONS_DIR/apple-touch-icon-76x76.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 72x72 "$ICONS_DIR/apple-touch-icon-72x72.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 60x60 "$ICONS_DIR/apple-touch-icon-60x60.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 57x57 "$ICONS_DIR/apple-touch-icon-57x57.png"

# Android/Chrome icons
$CONVERT_CMD "$SOURCE_IMAGE" -resize 192x192 "$ICONS_DIR/android-chrome-192x192.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 512x512 "$ICONS_DIR/android-chrome-512x512.png"

# PWA icons (Progressive Web App)
$CONVERT_CMD "$SOURCE_IMAGE" -resize 144x144 "$ICONS_DIR/icon-144x144.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 192x192 "$ICONS_DIR/icon-192x192.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 256x256 "$ICONS_DIR/icon-256x256.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 384x384 "$ICONS_DIR/icon-384x384.png"
$CONVERT_CMD "$SOURCE_IMAGE" -resize 512x512 "$ICONS_DIR/icon-512x512.png"

# Generar favicon.ico (combinando múltiples tamaños)
$CONVERT_CMD "$SOURCE_IMAGE" -resize 16x16 \
        "$SOURCE_IMAGE" -resize 32x32 \
        "$SOURCE_IMAGE" -resize 48x48 \
        public/favicon.ico

echo "✅ Iconos generados exitosamente:"
echo "   Favicons:"
echo "   - favicon-16x16.png, favicon-32x32.png, favicon-96x96.png, favicon-128x128.png"
echo "   - favicon.ico"
echo ""
echo "   Iconos para iOS:"
echo "   - apple-touch-icon.png (180x180)"
echo "   - apple-touch-icon-152x152.png, apple-touch-icon-144x144.png"
echo "   - apple-touch-icon-120x120.png, apple-touch-icon-114x114.png"
echo "   - apple-touch-icon-76x76.png, apple-touch-icon-72x72.png"
echo "   - apple-touch-icon-60x60.png, apple-touch-icon-57x57.png"
echo ""
echo "   Iconos para Android:"
echo "   - android-chrome-192x192.png, android-chrome-512x512.png"
echo ""
echo "   Iconos PWA:"
echo "   - icon-144x144.png, icon-192x192.png, icon-256x256.png"
echo "   - icon-384x384.png, icon-512x512.png"

echo ""
echo "Los iconos se han guardado en:"
echo "   - $ICONS_DIR/"
echo "   - public/favicon.ico"