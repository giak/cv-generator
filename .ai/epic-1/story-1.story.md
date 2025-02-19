# Epic-1: Core CV Management

# Story-1: Project Sxtup

## Story

**As a** developer
**I want** to set up the initial project infrastructure with Vue 3, TypeScript, and essential tools
**so that** we can start developing the CV Generator application with a solid foundation

## Status

Draft

## Context

Cette story est la première de l'Epic-1 qui implémente les fonctionnalités core du CV Generator. Elle établit la fondation technique du projet avec :

- Configuration de l'environnement de développement
- Setup des outils de qualité de code
- Mise en place de l'architecture Clean/DDD
- Configuration du pipeline CI/CD

### Technical Context

- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Architecture modulaire basée sur Clean Architecture et DDD
- Tailwind CSS 4 pour le design system
- Tests avec Vitest et Playwright

### Business Drivers

- Besoin d'une base technique solide pour supporter les futures fonctionnalités
- Importance de la maintenabilité et de la scalabilité
- Nécessité d'une haute qualité de code dès le début

## Estimation

Story Points: 3 (3 jours de développement humain)

## Tasks

### 1. - [x] Configuration de Base

1.  - [x] Créer le projet avec Vite et Vue 3
2.  - [x] Configurer TypeScript avec strict mode
3.  - [x] Setup pnpm et workspace
4.  - [x] Créer la structure de dossiers Clean Architecture

### 2. - [ ] Setup Tailwind CSS

1.  - [x] Installer et configurer Tailwind CSS 4
2.  - [x] Configurer le plugin Vite pour Tailwind
3.  - [x] Créer les fichiers de configuration du design system
4.  - [x] Setup du thème et des variables CSS

### 3. - [ ] Configuration des Tests

1.  - [x] Setup Vitest pour les tests unitaires
2.  - [x] Configurer Playwright pour les tests E2E
3.  - [x] Mettre en place la couverture de code
4.  - [x] Créer les tests de base

### 4. - [x] Setup Qualité de Code

1.  - [x] Configurer Biome pour le linting
2.  - [x] Setup Husky pour les pre-commits
3.  - [x] Configurer lint-staged
4.  - [x] Mettre en place les conventional commits

### 5. - [x] Configuration CI/CD

1.  - [x] Créer le pipeline GitHub Actions
2.  - [x] Configurer les environnements
3.  - [x] Setup des jobs de test et build
4.  - [x] Configurer les déploiements automatiques

## Constraints

- Compatibilité avec Node.js 22+
- Support des navigateurs modernes uniquement
- Respect des standards de sécurité
- Performance optimale requise

## Structure

```
src/
├── modules/
│   └── cv/
│       ├── domain/
│       │   ├── entities/
│       │   ├── validators/
│       │   └── services/
│       ├── application/
│       │   ├── use-cases/
│       │   └── services/
│       ├── infrastructure/
│       │   ├── repositories/
│       │   └── adapters/
│       └── presentation/
│           ├── components/
│           └── pages/
├── assets/
├── config/
├── stores/
├── types/
├── utils/
└── tests/
```

## Configuration Files

### package.json

```json
{
  "name": "cv-generator",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "biome check .",
    "format": "biome format ."
  }
}
```

### vite.config.ts

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Dev Notes

### Points Critiques

- Configuration correcte de TypeScript strict mode
- Setup approprié des alias de chemins
- Configuration des tests pour Clean Architecture
- Optimisation de la configuration Vite

### Décisions Techniques

- Utilisation de pnpm pour une meilleure gestion des dépendances
- Configuration monorepo pour scalabilité future
- Setup des tests par couche d'architecture
- Configuration CI/CD avec stages distincts

## Chat Command Log

- User: Initialiser le projet CV Generator
- Agent: Création de la structure de base avec Vite et Vue 3
- User: Configurer Tailwind CSS
- Agent: Setup du design system avec Tailwind 4
- User: Setup des tests
- Agent: Configuration de Vitest et Playwright
