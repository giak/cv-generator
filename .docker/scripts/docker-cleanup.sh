#!/bin/bash

# Script pour nettoyer les ressources Docker inutilisées
# Permet de libérer de l'espace disque et de maintenir un environnement propre

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

# Type de nettoyage
CLEANUP_TYPE=${1:-"basic"}

# Afficher le type de nettoyage
echo -e "${BLUE}🧹 CV Generator - Nettoyage Docker (Type: ${YELLOW}$CLEANUP_TYPE${BLUE})${NC}"
echo "--------------------------------------------------------------"

# Fonction pour afficher l'utilisation
usage() {
    echo -e "${BLUE}Usage: $0 [basic|full]${NC}"
    echo -e "  - basic: Nettoie les conteneurs, images et volumes associés au projet CV Generator"
    echo -e "  - full: Nettoie toutes les ressources Docker inutilisées (conteneurs arrêtés, images sans tag, etc.)"
    exit 1
}

# Vérifier les arguments
if [[ "$CLEANUP_TYPE" != "basic" && "$CLEANUP_TYPE" != "full" ]]; then
    echo -e "${RED}❌ Type de nettoyage invalide: $CLEANUP_TYPE${NC}"
    usage
fi

# Arrêter les conteneurs du projet s'ils sont en cours d'exécution
echo -e "${BLUE}🛑 Arrêt des conteneurs du projet...${NC}"
docker-compose down --remove-orphans

# Supprimer les conteneurs et images spécifiques au projet CV Generator
echo -e "${BLUE}🗑️ Suppression des conteneurs associés au projet...${NC}"
docker ps -a | grep "cv-generator" | awk '{print $1}' | xargs -r docker rm -f
echo -e "${GREEN}✅ Conteneurs du projet supprimés${NC}"

# Supprimer l'image de test si elle existe
echo -e "${BLUE}🗑️ Suppression de l'image de test...${NC}"
docker images | grep "cv-generator-test" | awk '{print $3}' | xargs -r docker rmi -f
echo -e "${GREEN}✅ Image de test supprimée${NC}"

# Si nettoyage complet demandé
if [[ "$CLEANUP_TYPE" == "full" ]]; then
    echo -e "${YELLOW}⚠️ Nettoyage complet demandé${NC}"
    
    echo -e "${BLUE}🗑️ Suppression de tous les conteneurs arrêtés...${NC}"
    docker container prune -f
    
    echo -e "${BLUE}🗑️ Suppression des images sans tag (dangling)...${NC}"
    docker image prune -f
    
    echo -e "${BLUE}🗑️ Suppression des volumes non utilisés...${NC}"
    docker volume prune -f
    
    echo -e "${BLUE}🗑️ Suppression des réseaux non utilisés...${NC}"
    docker network prune -f
    
    echo -e "${GREEN}✅ Nettoyage complet terminé${NC}"
else
    # Nettoyage basique
    echo -e "${BLUE}🗑️ Suppression des images du projet...${NC}"
    docker images | grep "cv-generator" | awk '{print $3}' | xargs -r docker rmi -f
    echo -e "${GREEN}✅ Images du projet supprimées${NC}"
    
    echo -e "${BLUE}🗑️ Suppression des volumes du projet...${NC}"
    docker volume ls | grep "cv-generator" | awk '{print $2}' | xargs -r docker volume rm
    echo -e "${GREEN}✅ Volumes du projet supprimés${NC}"
fi

# Afficher les ressources restantes
echo -e "${BLUE}📊 Ressources Docker restantes :${NC}"
echo -e "${YELLOW}Conteneurs en cours d'exécution :${NC}"
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}"

echo -e "${YELLOW}Images :${NC}"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo -e "${GREEN}✅ Nettoyage Docker terminé avec succès !${NC}"
exit 0 