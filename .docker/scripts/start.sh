#!/bin/bash

# Script de démarrage pour l'application CV Generator
# Ce script facilite le déploiement avec Docker

# Variables
ENV=${1:-"production"}
PORT=${2:-"8080"}

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 CV Generator - Script de déploiement Docker${NC}"
echo "--------------------------------------------"

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Mode de déploiement : ${ENV}${NC}"
echo -e "${YELLOW}🔌 Port exposé : ${PORT}${NC}"

# Arrêter les conteneurs existants
echo -e "${BLUE}🛑 Arrêt des conteneurs existants...${NC}"
docker-compose down

# Construire l'image Docker
echo -e "${BLUE}🏗️ Construction des images Docker...${NC}"
if [ "$ENV" = "production" ]; then
    # Modifier le port dans docker-compose.yml
    sed -i.bak "s/\"[0-9]\+:80\"/\"${PORT}:80\"/" docker-compose.yml
    
    # Démarrer le service de production
    echo -e "${BLUE}🚀 Démarrage du service de production...${NC}"
    docker-compose up -d cv-generator
    
    # Attendre que le conteneur soit en cours d'exécution
    echo -e "${BLUE}⏳ Attente du démarrage des services...${NC}"
    sleep 5
    
    echo -e "${GREEN}✅ Application déployée avec succès !${NC}"
    echo -e "${GREEN}🌐 Accédez à l'application sur http://localhost:${PORT}${NC}"
else
    # Démarrer le service de développement
    echo -e "${BLUE}🚀 Démarrage du service de développement...${NC}"
    
    # Reconstruire l'image de développement pour s'assurer que toutes les dépendances sont installées
    docker-compose build dev
    
    # Modifier le port dans docker-compose.yml
    sed -i.bak "s/\"[0-9]\+:3000\"/\"${PORT}:3000\"/" docker-compose.yml
    
    # Démarrer en mode interactif pour voir les logs
    echo -e "${GREEN}✅ Démarrage du serveur de développement...${NC}"
    echo -e "${GREEN}🌐 Accédez à l'application sur http://localhost:${PORT}${NC}"
    docker-compose up dev
fi

# Restaurer le fichier docker-compose.yml
mv docker-compose.yml.bak docker-compose.yml 