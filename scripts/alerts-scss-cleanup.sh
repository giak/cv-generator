#!/bin/bash

# Script de nettoyage pour le fichier _alerts.scss
# Ce script supprime les styles liés aux notifications toast qui ont été migrés vers Tailwind
# Tout en préservant les styles d'alerte qui n'ont pas encore été complètement migrés

echo "Nettoyage du fichier _alerts.scss - Suppression des styles toast..."

ALERTS_FILE="packages/ui/src/assets/styles/components/_alerts.scss"
BACKUP_FILE="${ALERTS_FILE}.bak"

# Vérifier si le fichier existe
if [ ! -f "$ALERTS_FILE" ]; then
    echo "Erreur: Le fichier $ALERTS_FILE n'existe pas."
    exit 1
fi

# Créer une copie de sauvegarde
cp "$ALERTS_FILE" "$BACKUP_FILE"
echo "Sauvegarde créée: $BACKUP_FILE"

# Supprimer les sections liées aux toasts tout en préservant les styles d'alerte
# On utilise sed pour supprimer tout le bloc de code entre le début du toast container
# et la fin des styles de toast, tout en conservant les styles d'alerte

sed -i '/\/\* Toast Container \*\//,/\/\* End Toast Styles \*\//d' "$ALERTS_FILE"

# Supprimer les keyframes pour les animations de toast
sed -i '/@keyframes slideIn/,/}/d' "$ALERTS_FILE"
sed -i '/@keyframes slideOut/,/}/d' "$ALERTS_FILE"
sed -i '/@keyframes fadeIn/,/}/d' "$ALERTS_FILE"
sed -i '/@keyframes fadeOut/,/}/d' "$ALERTS_FILE"

# Supprimer les commentaires vides ou lignes vides consécutives
sed -i '/^\s*$/N;/^\s*\n\s*$/D' "$ALERTS_FILE"

echo "Nettoyage terminé. Les styles toast ont été supprimés du fichier _alerts.scss"
echo "Taille avant: $(wc -l "$BACKUP_FILE" | awk '{print $1}') lignes"
echo "Taille après: $(wc -l "$ALERTS_FILE" | awk '{print $1}') lignes"
echo "Réduction: $(( $(wc -l "$BACKUP_FILE" | awk '{print $1}') - $(wc -l "$ALERTS_FILE" | awk '{print $1}') )) lignes"

# Rendre le script exécutable
chmod +x "$0"

echo "Script terminé!" 