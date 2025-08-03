#!/bin/bash

# Script para generar iconos específicos de Android desde nymia-app.png
# Mantiene las proporciones originales de la imagen (height auto)

SOURCE_IMAGE="src/assets/nymia-app.png"
ANDROID_RES="android/app/src/main/res"

# Verificar que existe la imagen fuente
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Error: No se encuentra la imagen fuente en $SOURCE_IMAGE"
    exit 1
fi

echo "Generando iconos de Android desde $SOURCE_IMAGE..."
echo "Manteniendo proporciones originales (height: auto)..."

# Usar magick para generar iconos
CONVERT_CMD="magick"

# Función para generar icono con proporciones mantenidas
generate_icon() {
    local width=$1
    local output_file=$2
    local bg_size=$3
    
    # Crear un fondo transparente del tamaño requerido y centrar la imagen
    $CONVERT_CMD "$SOURCE_IMAGE" -resize "${width}x" -background transparent -gravity center -extent "${bg_size}x${bg_size}" "$output_file"
}

# Generar iconos para diferentes densidades de Android
echo "Generando ic_launcher.png para diferentes densidades..."

# MDPI (48x48) - densidad media
generate_icon 40 "$ANDROID_RES/mipmap-mdpi/ic_launcher.png" 48
generate_icon 40 "$ANDROID_RES/mipmap-mdpi/ic_launcher_round.png" 48

# HDPI (72x72) - densidad alta  
generate_icon 60 "$ANDROID_RES/mipmap-hdpi/ic_launcher.png" 72
generate_icon 60 "$ANDROID_RES/mipmap-hdpi/ic_launcher_round.png" 72

# XHDPI (96x96) - densidad extra alta
generate_icon 80 "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png" 96
generate_icon 80 "$ANDROID_RES/mipmap-xhdpi/ic_launcher_round.png" 96

# XXHDPI (144x144) - densidad extra extra alta
generate_icon 120 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png" 144
generate_icon 120 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_round.png" 144

# XXXHDPI (192x192) - densidad extra extra extra alta
generate_icon 160 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png" 192
generate_icon 160 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_round.png" 192

# Generar también los foreground icons (para adaptive icons)
echo "Generando ic_launcher_foreground.png..."

generate_icon 90 "$ANDROID_RES/mipmap-mdpi/ic_launcher_foreground.png" 108
generate_icon 135 "$ANDROID_RES/mipmap-hdpi/ic_launcher_foreground.png" 162
generate_icon 180 "$ANDROID_RES/mipmap-xhdpi/ic_launcher_foreground.png" 216
generate_icon 270 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_foreground.png" 324
generate_icon 360 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_foreground.png" 432

echo "✅ Iconos de Android generados exitosamente:"
echo "   - ic_launcher.png (proporciones mantenidas en 48x48, 72x72, 96x96, 144x144, 192x192)"
echo "   - ic_launcher_round.png (mismos tamaños, centrados)"
echo "   - ic_launcher_foreground.png (para adaptive icons)"
echo ""
echo "Características:"
echo "   ✅ Proporciones originales mantenidas"
echo "   ✅ Imagen centrada en el canvas"
echo "   ✅ Fondo transparente"
echo "   ✅ Sin deformación"
echo ""
echo "Los iconos se han guardado en:"
echo "   - $ANDROID_RES/mipmap-*/ic_launcher*.png"
echo ""
echo "Ahora ejecuta: npx cap sync android && npx cap run android"