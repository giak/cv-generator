#!/bin/bash

# Script de vérification de santé pour les conteneurs Docker
# Ce script permet de s'assurer que les conteneurs Docker fonctionnent correctement

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

echo -e "${BLUE}🔍 CV Generator - Vérification de santé des conteneurs Docker${NC}"
echo "--------------------------------------------------------------"

# Vérifier si les conteneurs sont en cours d'exécution
CONTAINERS=$(docker-compose ps -q)
if [ -z "$CONTAINERS" ]; then
    echo -e "${YELLOW}⚠️ Aucun conteneur n'est en cours d'exécution.${NC}"
    echo -e "${BLUE}ℹ️ Utilisez './start.sh' ou 'pnpm docker:start' pour démarrer l'application.${NC}"
    exit 0
fi

echo -e "${BLUE}📋 Conteneurs en cours d'exécution :${NC}"
docker-compose ps

# Vérifier l'état de santé de chaque conteneur
echo -e "${BLUE}🔍 Vérification de l'état de santé des conteneurs...${NC}"
UNHEALTHY=0

for CONTAINER_ID in $CONTAINERS; do
    CONTAINER_NAME=$(docker inspect --format="{{.Name}}" $CONTAINER_ID | sed 's/^\///')
    CONTAINER_STATE=$(docker inspect --format="{{.State.Status}}" $CONTAINER_ID)
    
    if [ "$CONTAINER_STATE" == "running" ]; then
        echo -e "${GREEN}✅ $CONTAINER_NAME est en cours d'exécution${NC}"
        
        # Vérifier si le conteneur expose un port HTTP
        EXPOSED_PORT=$(docker port $CONTAINER_ID | grep -E '80/tcp|8080/tcp|3000/tcp' | head -n1 | awk '{print $3}')
        
        if [ ! -z "$EXPOSED_PORT" ]; then
            echo -e "${BLUE}   🌐 Port exposé : $EXPOSED_PORT${NC}"
            
            # Essayer d'accéder à l'application
            HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $EXPOSED_PORT)
            
            if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "304" ]; then
                echo -e "${GREEN}   ✅ Application accessible (HTTP $HTTP_CODE)${NC}"
            else
                echo -e "${YELLOW}   ⚠️ Application non accessible (HTTP $HTTP_CODE)${NC}"
                UNHEALTHY=1
            fi
        fi
        
        # Vérifier l'utilisation des ressources
        CPU=$(docker stats --no-stream $CONTAINER_ID --format "{{.CPUPerc}}")
        MEM=$(docker stats --no-stream $CONTAINER_ID --format "{{.MemUsage}}")
        
        echo -e "${BLUE}   💻 CPU : $CPU | Mémoire : $MEM${NC}"
    else
        echo -e "${RED}❌ $CONTAINER_NAME n'est pas en cours d'exécution (état : $CONTAINER_STATE)${NC}"
        UNHEALTHY=1
    fi
done

# Vérifier les logs pour détecter d'éventuelles erreurs
echo -e "${BLUE}🔍 Analyse des logs pour détecter d'éventuelles erreurs...${NC}"
ERROR_COUNT=$(docker-compose logs --tail=100 | grep -i "error\|exception\|fatal" | wc -l)

if [ $ERROR_COUNT -gt 0 ]; then
    echo -e "${YELLOW}⚠️ $ERROR_COUNT erreurs détectées dans les logs récents${NC}"
    echo -e "${BLUE}ℹ️ Utilisez 'docker-compose logs' pour voir les détails.${NC}"
    UNHEALTHY=1
else
    echo -e "${GREEN}✅ Aucune erreur détectée dans les logs récents${NC}"
fi

# Vérifier l'espace disque utilisé par Docker
echo -e "${BLUE}🔍 Vérification de l'espace disque utilisé par Docker...${NC}"
DISK_USAGE=$(docker system df)
echo "$DISK_USAGE"

# Déterminer si des actions sont nécessaires
if [ $UNHEALTHY -eq 1 ]; then
    echo
    echo -e "${YELLOW}⚠️ Des problèmes ont été détectés. Actions recommandées :${NC}"
    echo -e "${BLUE}   1. Consultez les logs avec 'docker-compose logs'${NC}"
    echo -e "${BLUE}   2. Redémarrez les conteneurs avec 'docker-compose restart'${NC}"
    echo -e "${BLUE}   3. Si le problème persiste, essayez 'docker-compose down' puis 'docker-compose up -d'${NC}"
    exit 1
else
    echo
    echo -e "${GREEN}✅ Tous les conteneurs sont en bonne santé !${NC}"
    exit 0
fi 