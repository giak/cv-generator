#!/bin/bash

# Script pour configurer un environnement de développement local avec Docker
# Il configure tout ce dont vous avez besoin pour travailler sur le projet CV Generator

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 CV Generator - Configuration de l'environnement de développement${NC}"
echo "--------------------------------------------------------------"

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

# Vérifier si git est installé
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    exit 1
fi

# Vérifier les permissions des scripts
echo -e "${BLUE}🔍 Vérification des permissions des scripts...${NC}"
chmod +x start.sh
chmod +x test-docker.sh
chmod +x docker-cleanup.sh
echo -e "${GREEN}✅ Permissions des scripts mises à jour${NC}"

# Copier le fichier .env.example en .env s'il n'existe pas déjà
if [ ! -f .env ]; then
    echo -e "${BLUE}📄 Création du fichier .env à partir de .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Fichier .env créé${NC}"
else
    echo -e "${YELLOW}⚠️ Le fichier .env existe déjà, il n'a pas été modifié${NC}"
fi

# Vérifier si les dossiers essentiels existent
echo -e "${BLUE}🔍 Vérification des dossiers essentiels...${NC}"
mkdir -p .github/workflows
mkdir -p kubernetes
mkdir -p docs/guides
echo -e "${GREEN}✅ Dossiers essentiels créés${NC}"

# Proposer de construire l'image Docker
echo -e "${BLUE}🏗️ Souhaitez-vous construire l'image Docker maintenant ? (y/n)${NC}"
read -p "" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🏗️ Construction de l'image Docker...${NC}"
    docker-compose build
    echo -e "${GREEN}✅ Image Docker construite avec succès${NC}"
fi

# Proposer d'exécuter les tests
echo -e "${BLUE}🧪 Souhaitez-vous exécuter les tests dans Docker maintenant ? (y/n)${NC}"
read -p "" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🧪 Exécution des tests unitaires...${NC}"
    ./test-docker.sh unit
    echo -e "${GREEN}✅ Tests exécutés avec succès${NC}"
fi

# Proposer de démarrer l'application en mode développement
echo -e "${BLUE}🚀 Souhaitez-vous démarrer l'application en mode développement maintenant ? (y/n)${NC}"
read -p "" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚀 Démarrage de l'application en mode développement...${NC}"
    ./start.sh development
else
    echo -e "${BLUE}ℹ️ Pour démarrer l'application en mode développement plus tard, exécutez :${NC}"
    echo -e "${YELLOW}   ./start.sh development${NC}"
    echo -e "${BLUE}ℹ️ Pour démarrer l'application en mode production, exécutez :${NC}"
    echo -e "${YELLOW}   ./start.sh${NC}"
fi

echo -e "${GREEN}✅ Configuration de l'environnement de développement terminée !${NC}"
echo -e "${BLUE}ℹ️ Documentation Docker disponible dans README.docker.md${NC}"
echo -e "${BLUE}ℹ️ Guide de déploiement Docker disponible dans docs/guides/docker-deployment.md${NC}"

echo -e "${YELLOW}=== Commandes npm disponibles ===${NC}"
echo -e "${YELLOW}pnpm docker:start${NC} - Démarrer l'application en mode production"
echo -e "${YELLOW}pnpm docker:start:dev${NC} - Démarrer l'application en mode développement"
echo -e "${YELLOW}pnpm docker:test${NC} - Exécuter les tests unitaires dans Docker"
echo -e "${YELLOW}pnpm docker:test:e2e${NC} - Exécuter les tests end-to-end dans Docker"
echo -e "${YELLOW}pnpm docker:clean${NC} - Nettoyer les artefacts Docker inutilisés"

exit 0 