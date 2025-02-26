# Guide de déploiement Docker pour CV Generator

Ce guide vous explique comment déployer l'application CV Generator dans différents environnements en utilisant Docker, en suivant nos standards et bonnes pratiques.

## Table des matières

- [Prérequis](#prérequis)
- [Architecture Docker](#architecture-docker)
- [Méthodes de déploiement](#méthodes-de-déploiement)
  - [Déploiement local](#déploiement-local)
  - [Déploiement sur un serveur](#déploiement-sur-un-serveur)
  - [Déploiement avec Kubernetes](#déploiement-avec-kubernetes)
- [Configuration](#configuration)
- [Surveillance et maintenance](#surveillance-et-maintenance)
- [Dépannage](#dépannage)

## Prérequis

- Docker Engine (version 24.0.0+)
- Docker Compose (version 2.20.0+)
- Git
- 2GB de RAM minimum
- Accès réseau pour récupérer les images Docker

## Architecture Docker

Notre architecture Docker suit les principes de Clean Architecture avec une séparation claire des préoccupations :

### Structure des fichiers

```
/
├── .docker/
│   ├── config/                 # Fichiers de configuration Docker
│   ├── scripts/                # Scripts d'implémentation (legacy)
│   ├── Dockerfile              # Dockerfile de production
│   ├── Dockerfile.dev          # Dockerfile de développement
│   └── docker-compose.yml      # Configuration Docker Compose
├── docker-cleanup.sh           # Script de nettoyage des ressources Docker
├── docker-healthcheck.sh       # Script de vérification de l'état des conteneurs
├── start.sh                    # Script de démarrage des conteneurs
├── test-docker.sh              # Script d'exécution des tests dans Docker
├── update-docker.sh            # Script de mise à jour des images Docker
├── dev-environment.sh          # Script de configuration de l'environnement
└── .dockerignore               # Fichiers à exclure du contexte Docker
```

### Images Docker

#### Image de production

- **Base** : nginx:alpine
- **Ports exposés** : 80
- **Construction** : Multi-étapes pour optimiser la taille
- **Sécurité** : Exécution en tant qu'utilisateur non-root

#### Image de développement

- **Base** : node:22-alpine
- **Ports exposés** : 5173
- **Volumes** : Montage du code source et des node_modules

Notre configuration utilise un build multi-étapes pour l'optimisation :

1. **Builder** : Node.js avec les dépendances et la compilation
2. **Production** : Nginx optimisé pour servir une SPA Vue.js

## Méthodes de déploiement

### Déploiement local

Le déploiement local est idéal pour le développement ou pour tester l'application.

1. **Configuration rapide avec notre script**:

   ```bash
   # Configurer l'environnement de développement
   ./dev-environment.sh

   # Démarrer en mode production (port 8080 par défaut)
   ./start.sh
   # ou
   pnpm docker:start

   # Ou démarrer en mode développement avec rechargement à chaud
   ./start.sh development
   # ou
   pnpm docker:start:dev
   ```

2. **Configuration manuelle**:

   ```bash
   # Copier le fichier d'environnement
   cp .env.example .env

   # Éditer selon vos besoins
   nano .env

   # Construire et démarrer les conteneurs
   docker-compose build
   docker-compose up -d
   ```

Une fois démarré, accédez à l'application via :

- Mode production : http://localhost:8080
- Mode développement : http://localhost:8080

### Déploiement sur un serveur

Pour déployer sur un serveur de production:

1. **Préparer le serveur**:

   ```bash
   # Mettre à jour le système
   apt update && apt upgrade -y

   # Installer Docker
   curl -fsSL https://get.docker.com | sh

   # Installer Docker Compose
   curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   ```

2. **Configurer l'application**:

   ```bash
   # Cloner le dépôt
   git clone https://github.com/giak/cv-generator.git
   cd cv-generator

   # Configurer l'environnement
   cp .env.example .env
   nano .env

   # Définir les variables d'environnement adaptées à la production
   # APP_URL=https://votre-domaine.com
   ```

3. **Déployer**:

   ```bash
   ./start.sh
   # ou
   pnpm docker:start
   ```

4. **Configurer un proxy inverse (Nginx)**:

   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com;

       location / {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

5. **Configurer SSL avec Let's Encrypt**:

   ```bash
   apt install certbot python3-certbot-nginx
   certbot --nginx -d votre-domaine.com
   ```

### Déploiement avec Kubernetes

Pour les déploiements à grande échelle, utilisez nos manifestes Kubernetes:

1. **Appliquer les manifestes**:

   ```bash
   kubectl apply -f kubernetes/deployment.yaml
   ```

2. **Vérifier le déploiement**:

   ```bash
   kubectl get deployments
   kubectl get services
   kubectl get pods
   ```

## Configuration

Les principales variables d'environnement:

| Variable        | Description                                  | Valeur par défaut         |
| --------------- | -------------------------------------------- | ------------------------- |
| NODE_ENV        | Environnement (production/development)       | production                |
| PORT            | Port exposé par l'application                | 8080                      |
| API_URL         | URL de l'API (si externe)                    | http://localhost:3000/api |
| APP_TITLE       | Titre de l'application                       | CV Generator              |
| MAX_UPLOAD_SIZE | Taille maximale pour les uploads (en octets) | 5242880 (5MB)             |

## Surveillance et maintenance

### Vérification de l'état

```bash
# Vérifier l'état des conteneurs
./docker-healthcheck.sh
# ou
pnpm docker:health
```

Ce script vérifie :

- Si les conteneurs Docker sont en cours d'exécution
- L'utilisation des ressources (CPU et mémoire)
- L'accessibilité de l'application
- Les erreurs dans les logs

### Logs

```bash
# Voir les logs en temps réel
docker-compose logs -f
# ou
pnpm docker:logs

# Voir les logs d'un service spécifique
docker-compose logs -f app
```

### Mise à jour

```bash
# Mettre à jour l'application
./update-docker.sh
# ou
pnpm docker:update
```

Ce script :

- Sauvegarde l'environnement actuel
- Récupère les dernières images Docker
- Met à jour les images de base
- Reconstruit les conteneurs si nécessaire
- Redémarre les conteneurs en cours d'exécution
- Nettoie les anciennes images

### Nettoyage

```bash
# Nettoyage basique (ressources spécifiques au projet)
./docker-cleanup.sh
# ou
pnpm docker:clean

# Nettoyage complet (y compris les ressources système)
./docker-cleanup.sh full
# ou
pnpm docker:clean:full
```

### Backup

```bash
# Sauvegarde des volumes
docker run --rm --volumes-from cv-generator_app_1 -v $(pwd)/backup:/backup alpine sh -c "tar -czf /backup/volumes-backup-$(date +%Y%m%d).tar.gz /app/data"
```

## Dépannage

### Problèmes courants

1. **Conflits de ports** : Si le port 8080 est déjà utilisé, spécifiez un port différent :

   ```bash
   ./start.sh production 8081
   ```

2. **L'application n'est pas accessible**:

   - Vérifiez que les conteneurs sont en cours d'exécution : `docker-compose ps`
   - Vérifiez les logs : `docker-compose logs`
   - Vérifiez la configuration du port : `docker-compose port app 80`

3. **Problèmes de performance**:

   - Augmentez les ressources allouées à Docker
   - Vérifiez la charge du serveur : `docker stats`
   - Utilisez le script de vérification de l'état : `./docker-healthcheck.sh`

4. **Erreur de construction**:
   - Nettoyez le cache :
   ```bash
   ./docker-cleanup.sh
   docker-compose build --no-cache
   ```
   - Vérifiez l'espace disque : `df -h`

### Support

Si vous rencontrez des problèmes non résolus, veuillez :

1. Consulter notre [documentation Docker complète](../../README.docker.md)
2. Vérifier les logs Docker pour les messages d'erreur spécifiques
3. Exécuter le script de vérification de l'état pour obtenir des diagnostics
4. Consulter la documentation Docker pour les erreurs Docker spécifiques
5. Ouvrir une issue sur [GitHub](https://github.com/giak/cv-generator/issues)

---

&copy; 2024 CV Generator | [Accueil](../../README.md) | [Documentation Docker](../../README.docker.md)
