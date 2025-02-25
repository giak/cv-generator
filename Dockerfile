# Étape 1: Base pour installation des dépendances et build
FROM node:22-alpine AS base

# Installation de PNPM
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

# Définir le répertoire de travail
WORKDIR /app

# Étape 2: Installation des dépendances
FROM base AS dependencies

# Copier les fichiers de configuration pour optimiser le cache Docker
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/core/package.json ./packages/core/
COPY packages/shared/package.json ./packages/shared/
COPY packages/infrastructure/package.json ./packages/infrastructure/

# Installer les dépendances avec PNPM
RUN pnpm install --frozen-lockfile

# Étape 3: Build de l'application
FROM dependencies AS build

# Copier tout le code source
COPY . .

# Construire tous les packages
RUN pnpm build

# Étape 4: Image finale légère de production
FROM nginx:alpine AS production

# Supprimer la configuration nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de build depuis l'étape précédente
COPY --from=build /app/packages/ui/dist /usr/share/nginx/html

# Vérifier que nginx démarre correctement avec notre configuration
RUN nginx -t

# Exposer le port 80
EXPOSE 80

# Définir la commande de démarrage
CMD ["nginx", "-g", "daemon off;"]

# Métadonnées
LABEL name="cv-generator" \
      description="CV Generator avec support JSON Resume" \
      version="0.1.0" 