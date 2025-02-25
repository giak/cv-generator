#!/bin/bash

# Script pour exécuter les tests dans un environnement Docker
# Ce script isole l'environnement de test pour assurer des résultats cohérents

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

# Définir le type de test par défaut
TEST_TYPE=${1:-"unit"}
WATCH_MODE=${2:-"false"}

# Fonction pour afficher l'utilisation
usage() {
    echo -e "${BLUE}Usage: $0 [unit|e2e|all] [true|false]${NC}"
    echo -e "  - Premier argument: type de test (unit, e2e, ou all)"
    echo -e "  - Deuxième argument: mode watch (true ou false, défaut: false)"
    echo -e "Exemples:"
    echo -e "  $0 unit         # Exécuter les tests unitaires"
    echo -e "  $0 e2e          # Exécuter les tests end-to-end"
    echo -e "  $0 all          # Exécuter tous les tests"
    echo -e "  $0 unit true    # Exécuter les tests unitaires en mode watch"
    exit 1
}

# Vérifier les arguments
if [[ "$TEST_TYPE" != "unit" && "$TEST_TYPE" != "e2e" && "$TEST_TYPE" != "all" ]]; then
    echo -e "${RED}❌ Type de test invalide: $TEST_TYPE${NC}"
    usage
fi

if [[ "$WATCH_MODE" != "true" && "$WATCH_MODE" != "false" ]]; then
    echo -e "${RED}❌ Mode watch invalide: $WATCH_MODE${NC}"
    usage
fi

# Afficher le type de test
echo -e "${BLUE}🧪 Exécution des tests ${YELLOW}$TEST_TYPE${BLUE} dans Docker${NC}"
if [[ "$WATCH_MODE" == "true" ]]; then
    echo -e "${BLUE}🔄 Mode watch activé${NC}"
fi

# Créer un conteneur temporaire pour exécuter les tests
echo -e "${BLUE}🏗️ Création d'un conteneur temporaire pour les tests...${NC}"

# Construire une image spécifique pour les tests
DOCKER_BUILDKIT=1 docker build \
    --target=dependencies \
    -t cv-generator-test \
    -f Dockerfile .

# Commande pour exécuter les tests
if [[ "$TEST_TYPE" == "unit" || "$TEST_TYPE" == "all" ]]; then
    echo -e "${BLUE}🧪 Exécution des tests unitaires...${NC}"
    
    WATCH_FLAG=""
    if [[ "$WATCH_MODE" == "true" ]]; then
        WATCH_FLAG="--watch"
    fi
    
    docker run --rm -it \
        -v "$(pwd):/app" \
        -w /app \
        cv-generator-test \
        pnpm test $WATCH_FLAG
    
    UNIT_EXIT_CODE=$?
    
    if [[ $UNIT_EXIT_CODE -ne 0 ]]; then
        echo -e "${RED}❌ Les tests unitaires ont échoué (code de sortie: $UNIT_EXIT_CODE)${NC}"
        if [[ "$TEST_TYPE" == "unit" ]]; then
            exit $UNIT_EXIT_CODE
        fi
    else
        echo -e "${GREEN}✅ Tests unitaires réussis${NC}"
    fi
fi

if [[ "$TEST_TYPE" == "e2e" || "$TEST_TYPE" == "all" ]]; then
    echo -e "${BLUE}🧪 Exécution des tests end-to-end...${NC}"
    
    WATCH_FLAG=""
    if [[ "$WATCH_MODE" == "true" ]]; then
        WATCH_FLAG="--watch"
    fi
    
    docker run --rm -it \
        -v "$(pwd):/app" \
        -w /app \
        cv-generator-test \
        pnpm test:e2e $WATCH_FLAG
    
    E2E_EXIT_CODE=$?
    
    if [[ $E2E_EXIT_CODE -ne 0 ]]; then
        echo -e "${RED}❌ Les tests end-to-end ont échoué (code de sortie: $E2E_EXIT_CODE)${NC}"
        exit $E2E_EXIT_CODE
    else
        echo -e "${GREEN}✅ Tests end-to-end réussis${NC}"
    fi
fi

# Si nous arrivons ici avec "all", vérifions si les tests unitaires ont échoué
if [[ "$TEST_TYPE" == "all" && $UNIT_EXIT_CODE -ne 0 ]]; then
    echo -e "${RED}❌ Certains tests ont échoué${NC}"
    exit $UNIT_EXIT_CODE
fi

echo -e "${GREEN}✅ Tous les tests demandés ont réussi !${NC}"
exit 0 