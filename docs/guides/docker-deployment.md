# Guide de déploiement Docker pour CV Generator

Ce guide vous explique comment déployer l'application CV Generator dans différents environnements en utilisant Docker.

## Table des matières

- [Prérequis](#prérequis)
- [Méthodes de déploiement](#méthodes-de-déploiement)
  - [Déploiement local](#déploiement-local)
  - [Déploiement sur un serveur](#déploiement-sur-un-serveur)
  - [Déploiement avec Kubernetes](#déploiement-avec-kubernetes)
- [Configuration](#configuration)
- [Architecture Docker](#architecture-docker)
- [Surveillance et maintenance](#surveillance-et-maintenance)
- [Dépannage](#dépannage)

## Prérequis

- Docker (version 24.0.0+)
- Docker Compose (version 2.20.0+)
- Git
- 2GB de RAM minimum
- Accès réseau pour récupérer les images Docker

## Méthodes de déploiement

### Déploiement local

Le déploiement local est idéal pour le développement ou pour tester l'application.

1. **Configuration rapide avec notre script**:

   ```bash
   # Rendre le script exécutable
   chmod +x start.sh

   # Démarrer en mode production (port 8080 par défaut)
   ./start.sh

   # Ou démarrer en mode développement avec rechargement à chaud
   ./start.sh development
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
- Mode développement : http://localhost:3000

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

## Architecture Docker

Notre solution Docker comprend:

1. **Multi-stage build**: Optimise la taille de l'image finale
2. **Base Alpine**: Minimise la surface d'attaque
3. **Nginx optimisé**: Configuration haute performance pour Single Page Applications
4. **Réplication**: Support pour la mise à l'échelle horizontale via Kubernetes

**Structure des images**:

- `base`: Image Node.js avec les dépendances de base
- `dependencies`: Installation des dépendances avec PNPM
- `build`: Compilation de l'application
- `production`: Image Nginx légère servant l'application compilée

## Surveillance et maintenance

### Logs

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f app
```

### Mise à jour

```bash
# Arrêter les conteneurs
docker-compose down

# Récupérer les derniers changements
git pull

# Reconstruire et redémarrer
docker-compose build
docker-compose up -d
```

### Backup

```bash
# Sauvegarde des volumes
docker run --rm --volumes-from cv-generator_app_1 -v $(pwd)/backup:/backup alpine sh -c "tar -czf /backup/volumes-backup-$(date +%Y%m%d).tar.gz /app/data"
```

## Dépannage

### Problèmes courants

1. **L'application n'est pas accessible**:

   - Vérifiez que les conteneurs sont en cours d'exécution: `docker-compose ps`
   - Vérifiez les logs: `docker-compose logs`
   - Vérifiez la configuration du port: `docker-compose port app 80`

2. **Problèmes de performance**:

   - Augmentez les ressources allouées à Docker
   - Vérifiez la charge du serveur: `docker stats`

3. **Erreur de construction**:
   - Nettoyez le cache: `docker-compose build --no-cache`
   - Vérifiez l'espace disque: `df -h`

### Support

Si vous rencontrez des problèmes non résolus, veuillez:

- Consulter notre [documentation](../../README.md)
- Ouvrir une issue sur [GitHub](https://github.com/giak/cv-generator/issues)
- Contacter notre support: support@exemple.com

---

&copy; 2024 CV Generator | [Accueil](../../README.md) | [Documentation Docker](../../README.docker.md)
