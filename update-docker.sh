#!/bin/bash

# Script pour mettre à jour l'application CV Generator en environnement Docker
# Ce script permet de mettre à jour l'application vers la dernière version de manière sécurisée

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    echo "👉 https://docs.docker.com/get-docker/"
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    echo "👉 https://docs.docker.com/compose/install/"
    exit 1
fi

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    exit 1
fi

# Variables
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TARGET_BRANCH=${1:-"main"}
ENV_MODE=${2:-"production"} # production ou development

echo -e "${BLUE}🔄 CV Generator - Mise à jour Docker${NC}"
echo "--------------------------------------------------------------"
echo -e "${YELLOW}Branche actuelle : ${CURRENT_BRANCH}${NC}"
echo -e "${YELLOW}Branche cible    : ${TARGET_BRANCH}${NC}"
echo -e "${YELLOW}Mode             : ${ENV_MODE}${NC}"

# Demander confirmation
echo
echo -e "${YELLOW}⚠️ Cette opération va mettre à jour l'application vers la dernière version.${NC}"
echo -e "${YELLOW}⚠️ Un backup des données sera effectué avant la mise à jour.${NC}"
read -p "Voulez-vous continuer? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Mise à jour annulée.${NC}"
    exit 0
fi

# Créer le répertoire de backup
mkdir -p "$BACKUP_DIR"
echo -e "${BLUE}📁 Répertoire de backup créé : ${BACKUP_DIR}${NC}"

# Sauvegarder le fichier .env s'il existe
if [ -f .env ]; then
    echo -e "${BLUE}💾 Sauvegarde du fichier .env...${NC}"
    cp .env "${BACKUP_DIR}/.env.backup"
    echo -e "${GREEN}✅ Fichier .env sauvegardé${NC}"
fi

# Sauvegarder les données utilisateur (si elles existent)
echo -e "${BLUE}💾 Sauvegarde des données utilisateur...${NC}"
if [ -d data ]; then
    tar -czf "${BACKUP_DIR}/data.tar.gz" data
    echo -e "${GREEN}✅ Données utilisateur sauvegardées${NC}"
else
    echo -e "${YELLOW}⚠️ Aucun répertoire de données trouvé${NC}"
fi

# Arrêter les conteneurs Docker
echo -e "${BLUE}🛑 Arrêt des conteneurs Docker...${NC}"
docker-compose down
echo -e "${GREEN}✅ Conteneurs arrêtés${NC}"

# Sauvegarder les images Docker actuelles
echo -e "${BLUE}💾 Sauvegarde des images Docker actuelles (tags)...${NC}"
docker images | grep "cv-generator" | awk '{print $1 ":" $2}' > "${BACKUP_DIR}/docker_images.txt"
echo -e "${GREEN}✅ Liste des images sauvegardée${NC}"

# Afficher l'état actuel du Git
echo -e "${BLUE}📊 État Git actuel :${NC}"
git status --short

# Vérifier s'il y a des modifications locales
if [[ $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️ Des modifications locales ont été détectées.${NC}"
    echo -e "${YELLOW}⚠️ La mise à jour pourrait écraser ces modifications.${NC}"
    read -p "Voulez-vous stasher ces modifications? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}📦 Stash des modifications locales...${NC}"
        git stash save "Modifications avant mise à jour $(date)"
        echo -e "${GREEN}✅ Modifications locales sauvegardées dans le stash${NC}"
    else
        echo -e "${RED}❌ La mise à jour nécessite un dépôt Git propre.${NC}"
        echo -e "${RED}❌ Veuillez commiter ou stasher vos modifications avant de continuer.${NC}"
        exit 1
    fi
fi

# Mettre à jour le code source
echo -e "${BLUE}🔄 Mise à jour du code source...${NC}"
git fetch origin

# Vérifier si la branche cible existe
if ! git show-ref --verify --quiet refs/remotes/origin/"$TARGET_BRANCH"; then
    echo -e "${RED}❌ La branche '$TARGET_BRANCH' n'existe pas sur le dépôt distant.${NC}"
    exit 1
fi

# Si on est sur une autre branche que celle ciblée, basculer
if [[ "$CURRENT_BRANCH" != "$TARGET_BRANCH" ]]; then
    echo -e "${BLUE}🔄 Basculement vers la branche '$TARGET_BRANCH'...${NC}"
    git checkout "$TARGET_BRANCH"
    echo -e "${GREEN}✅ Basculement effectué${NC}"
fi

# Tirer les dernières modifications
echo -e "${BLUE}🔄 Récupération des dernières modifications...${NC}"
git pull origin "$TARGET_BRANCH"
echo -e "${GREEN}✅ Code source mis à jour${NC}"

# Vérifier si le fichier .env existe toujours
if [ ! -f .env ] && [ -f "${BACKUP_DIR}/.env.backup" ]; then
    echo -e "${BLUE}🔄 Restauration du fichier .env...${NC}"
    cp "${BACKUP_DIR}/.env.backup" .env
    echo -e "${GREEN}✅ Fichier .env restauré${NC}"
elif [ ! -f .env ] && [ -f .env.example ]; then
    echo -e "${BLUE}🔄 Création d'un nouveau fichier .env à partir de .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️ Un nouveau fichier .env a été créé. Veuillez le configurer.${NC}"
fi

# Mettre les scripts à jour
echo -e "${BLUE}🔄 Mise à jour des permissions des scripts...${NC}"
chmod +x start.sh test-docker.sh docker-cleanup.sh dev-environment.sh update-docker.sh
echo -e "${GREEN}✅ Permissions mises à jour${NC}"

# Reconstruire les conteneurs Docker
echo -e "${BLUE}🏗️ Reconstruction des conteneurs Docker...${NC}"
docker-compose build
echo -e "${GREEN}✅ Conteneurs reconstruits${NC}"

# Démarrer l'application
echo -e "${BLUE}🚀 Démarrage de l'application...${NC}"
if [[ "$ENV_MODE" == "development" ]]; then
    ./start.sh development
else
    ./start.sh
fi
echo -e "${GREEN}✅ Application démarrée${NC}"

# Afficher les informations de version
echo -e "${BLUE}📋 Informations sur la version :${NC}"
echo -e "${YELLOW}Branche      : ${TARGET_BRANCH}${NC}"
echo -e "${YELLOW}Commit       : $(git rev-parse HEAD)${NC}"
echo -e "${YELLOW}Date du commit : $(git log -1 --format=%cd --date=local)${NC}"
echo -e "${YELLOW}Auteur       : $(git log -1 --format=%an)${NC}"
echo -e "${YELLOW}Message      : $(git log -1 --format=%s)${NC}"

echo
echo -e "${GREEN}✅ Mise à jour terminée avec succès !${NC}"
echo -e "${BLUE}ℹ️ L'application est maintenant à jour et en cours d'exécution.${NC}"
echo -e "${BLUE}ℹ️ Backup disponible dans : ${BACKUP_DIR}${NC}"
exit 0 