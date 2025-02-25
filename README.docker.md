# Configuration Docker pour CV Generator

Ce document présente l'ensemble de la configuration Docker mise en place pour le projet CV Generator, offrant un environnement de développement et de déploiement standardisé et reproductible.

## Fonctionnalités principales

- **Environnement de développement** : Configuration complète pour le développement local
- **Tests automatisés** : Exécution des tests unitaires et e2e dans un environnement isolé
- **Optimisation production** : Build multi-étapes avec Nginx optimisé pour les SPA
- **Scripts utilitaires** : Outils pour faciliter le déploiement, les tests et la maintenance
- **Intégration CI/CD** : Support pour l'intégration continue et le déploiement continu

## Scripts disponibles

Tous les scripts sont accessibles via `npm`/`pnpm` ou directement en ligne de commande :

### Configuration et déploiement

| Script               | Description                                               | Commande npm                                   |
| -------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| `start.sh`           | Démarre l'application en mode production ou développement | `pnpm docker:start` ou `pnpm docker:start:dev` |
| `dev-environment.sh` | Configure un environnement de développement complet       | `pnpm docker:setup`                            |
| `update-docker.sh`   | Met à jour l'application vers la dernière version         | -                                              |

### Tests et qualité

| Script           | Description                                    | Commande npm                                                         |
| ---------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| `test-docker.sh` | Exécute les tests dans un environnement Docker | `pnpm docker:test`, `pnpm docker:test:e2e` ou `pnpm docker:test:all` |

### Maintenance

| Script              | Description                               | Commande npm                                    |
| ------------------- | ----------------------------------------- | ----------------------------------------------- |
| `docker-cleanup.sh` | Nettoie les ressources Docker inutilisées | `pnpm docker:clean` ou `pnpm docker:clean:full` |

## Commandes npm disponibles

```bash
# Démarrage et déploiement
pnpm docker:start          # Démarre l'application en mode production
pnpm docker:start:dev      # Démarre l'application en mode développement
pnpm docker:build          # Construit les images Docker sans démarrer les conteneurs

# Tests
pnpm docker:test           # Exécute les tests unitaires
pnpm docker:test:e2e       # Exécute les tests end-to-end
pnpm docker:test:all       # Exécute tous les tests

# Utilitaires
pnpm docker:setup          # Configure l'environnement de développement
pnpm docker:clean          # Nettoie les ressources Docker du projet
pnpm docker:clean:full     # Nettoie toutes les ressources Docker inutilisées
pnpm docker:logs           # Affiche les logs des conteneurs en temps réel
pnpm docker:ps             # Affiche l'état des conteneurs
pnpm docker:stop           # Arrête les conteneurs
pnpm docker:restart        # Redémarre les conteneurs
```

## Démarrage rapide

### Installation et configuration

```bash
# Cloner le dépôt
git clone https://github.com/giak/cv-generator.git
cd cv-generator

# Configuration rapide
pnpm docker:setup
# ou
./dev-environment.sh
```

### Démarrer l'application

```bash
# Mode production
pnpm docker:start
# ou
./start.sh

# Mode développement avec hot-reload
pnpm docker:start:dev
# ou
./start.sh development
```

### Mise à jour de l'application

```bash
# Mise à jour vers la dernière version de la branche principale
./update-docker.sh

# Mise à jour vers une branche spécifique
./update-docker.sh develop

# Mise à jour et démarrage en mode développement
./update-docker.sh main development
```

## Architecture Docker

### Structure des images

Notre configuration utilise un build multi-étapes :

1. **Base** : Node.js + PNPM
2. **Dependencies** : Installation des dépendances
3. **Build** : Compilation de l'application
4. **Production** : Nginx optimisé pour SPA

### Volumes et persistance

Les données sont persistées dans les volumes Docker suivants :

- `cv-generator_data` : Données utilisateur
- `cv-generator_node_modules` : Dépendances Node.js (mode développement)

## Optimisations de performance

- Caching optimisé des dépendances PNPM
- Construction multi-étapes pour minimiser la taille de l'image
- Configuration Nginx avec compression gzip et cache efficace
- Support des headers d'API modernes

## Sécurité

- Exécution en tant qu'utilisateur non-root dans les conteneurs
- Images réduites au minimum nécessaire
- Headers de sécurité configurés dans Nginx
- Isolation des environnements de développement et production

## Déploiement en production

Pour un déploiement en production, consultez notre [Guide de déploiement Docker](docs/guides/docker-deployment.md) qui fournit des instructions détaillées pour :

- Déploiement sur serveur Linux
- Configuration avec proxy inverse
- Mise en place de SSL/TLS
- Déploiement avec Kubernetes
- Stratégies de mise à l'échelle

## Intégration continue

Notre configuration s'intègre facilement avec les plates-formes CI/CD comme GitHub Actions et GitLab CI. Voir `.github/workflows/docker.yml` pour un exemple d'implémentation.

## Dépannage

En cas de problème avec Docker, utilisez les commandes suivantes :

```bash
# Voir les logs
pnpm docker:logs

# Nettoyer et reconstruire
pnpm docker:clean
pnpm docker:build
pnpm docker:start

# Réinitialiser complètement l'environnement
pnpm docker:clean:full
pnpm docker:setup
```

Pour plus d'informations sur le dépannage, consultez la section "Dépannage" du [Guide de déploiement Docker](docs/guides/docker-deployment.md).

## Ressources additionnelles

- [Guide de déploiement Docker](docs/guides/docker-deployment.md)
- [Documentation Docker officielle](https://docs.docker.com/)
- [Documentation Nginx](https://nginx.org/en/docs/)
- [Documentation Kubernetes](https://kubernetes.io/docs/home/)
