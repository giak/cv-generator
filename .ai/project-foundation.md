---
title: "Fondation de Projet - CV Generator"
version: "1.2.0"
description: "Document de fondation technique pour l'application CV Generator avec support du standard JSON Resume"
lastUpdated: "2025-03-11"
tags:
  [
    "project-setup",
    "architecture",
    "technical-stack",
    "foundation",
    "json-resume",
    "monorepo",
    "pnpm-workspace",
  ]
---

# 🏗️ Fondation de Projet - CV Generator

## 📋 Informations Générales du Projet

- **Nom du Projet**: CV Generator
- **Description Technique**: Application web moderne permettant de créer, éditer et exporter des CV au format JSON Resume standard (https://jsonresume.org/schema/) avec une architecture frontend propre et maintenable basée sur un monorepo PNPM.
- **Catégorie**: Web (Frontend)
- **Échelle Prévue**: Application légère destinée aux utilisateurs individuels, avec une estimation de quelques milliers d'utilisateurs actifs mensuels.
- **Contraintes Principales**:
  - Fonctionnement entièrement côté client sans backend
  - Persistance des données via localStorage
  - Performance (temps de réponse < 500ms)
  - Compatibilité avec les navigateurs modernes
  - Accessibilité (WCAG 2.1 AA)
  - Fonctionnement hors ligne
  - Support de l'export en JSON conforme au standard JSON Resume
  - Support d'exports additionnels en HTML et PDF
  - Maintenance facile via l'architecture monorepo

## 2️⃣ Vision Technique & Objectifs

- **Vision Technique**: Créer une application web légère et efficace qui propose une expérience utilisateur fluide pour l'édition de CV, avec une architecture robuste basée sur les principes de Clean Architecture, permettant une évolution et une maintenance à long terme. L'application doit produire des CV conformes au standard JSON Resume pour garantir l'interopérabilité avec d'autres outils et services.
- **Objectifs Techniques**:
  - Implémenter une architecture clean et modulaire pour faciliter la maintenance et l'évolution
  - Structurer le projet en monorepo avec des packages bien définis et des responsabilités claires
  - Offrir une validation complète des données en temps réel pour guider l'utilisateur
  - Garantir des performances optimales même sur des appareils de faible puissance
  - Permettre l'exportation des CV dans différents formats (JSON conforme au standard, HTML, PDF)
  - Assurer la compatibilité complète avec le standard JSON Resume (https://jsonresume.org/schema/)
  - Fournir des conseils d'optimisation ATS pour les utilisateurs
- **Principes Directeurs**:
  - **Séparation des préoccupations**: Organisation claire des couches selon Clean Architecture
  - **Entités riches**: Logique métier encapsulée dans les entités du domaine
  - **SOLID**: Application systématique des principes SOLID
  - **Immutabilité**: Utilisation de structures de données immuables pour une meilleure gestion d'état
  - **Simplicité**: Priorité aux solutions simples et directes
  - **Validation à plusieurs niveaux**: Validation dans l'UI et dans le domaine
  - **Interopérabilité**: Adhérence stricte au standard JSON Resume
  - **Modularité**: Organisation des packages avec des responsabilités claires et minimisation des dépendances

## 3️⃣ Stack Technologique

- **Frontend**:

  - Framework: Vue.js 3.4+
  - Langage: TypeScript 5.7+
  - Bibliothèques Principales:
    - Pinia 2.3+ (gestion d'état)
    - Vue Router 4.2+ (navigation)
    - Tailwind CSS 3.4+ (styling)
    - Zod 3.22+ (validation de schéma JSON Resume)
    - jsPDF 2.5+ (génération de PDF)
    - Heroicons Vue 2.2+ (icônes)
    - Lodash-es 4.17+ (utilitaires)
  - Outils de Build:
    - Vite 6.2+ (bundling et dev server)
    - Biome 1.9+ (linting et formatting)
    - TypeScript (type checking)

- **Backend**:

  - N/A (application frontend uniquement)

- **Données**:

  - Persistence: localStorage (stockage côté client)
  - Format: JSON Resume standard (https://jsonresume.org/schema/)
  - Stratégie de Migration: Mise à jour automatique des données en cas d'évolution du schéma
  - Stratégie de Caching: Mise en cache automatique via localStorage

- **Infrastructure**:

  - Environnement d'Hébergement: Service statique (GitHub Pages, Netlify, Vercel)
  - Conteneurisation: Docker pour le développement et le déploiement
  - CI/CD: GitHub Actions
  - Monorepo: PNPM Workspace avec packages isolés pour chaque couche

- **Monitoring & Observabilité**:
  - Logging: Console uniquement (application frontend)
  - Monitoring: N/A pour MVP (potentiel ajout ultérieur d'analytics anonymisés)
  - Analytics: N/A pour MVP
  - Tests: Vitest pour tests unitaires, Playwright pour tests E2E

## 4️⃣ Architecture Fondamentale

- **Pattern Architectural**: Clean Architecture simplifiée, monorepo PNPM avec structure en packages
- **Découpage Fonctionnel**:

  - **@cv-generator/core**: Entités de domaine (Resume, Work, Education, etc.) et cas d'utilisation basés sur le standard JSON Resume
  - **@cv-generator/ui**: Composants d'interface utilisateur, pages et stores (présentation)
  - **@cv-generator/infrastructure**: Implémentations concrètes pour localStorage et exports
  - **@cv-generator/shared**: Types et utilitaires partagés, incluant les schémas de validation Zod pour le format JSON Resume

- **Organisation Monorepo**:

  ```
  cv-generator/
  ├── packages/
  │   ├── core/           # Logique métier, entités et use cases
  │   ├── infrastructure/ # Implémentations concrètes (localStorage, exports)
  │   ├── shared/         # Types, constantes et utilitaires partagés
  │   └── ui/             # Interface utilisateur Vue.js
  ├── pnpm-workspace.yaml # Configuration du workspace
  └── package.json        # Scripts et dépendances racine
  ```

- **Flux de Données Principaux**:

  1. **Création/Édition de CV**:

     - L'utilisateur interagit avec les formulaires UI (@cv-generator/ui)
     - Les composables Vue.js appellent les use cases (@cv-generator/core)
     - Les entités du domaine valident et encapsulent la logique selon le standard JSON Resume
     - Les données sont persistées dans localStorage via repository (@cv-generator/infrastructure)

  2. **Exportation de CV**:

     - L'utilisateur demande une exportation (JSON, HTML ou PDF)
     - L'application prépare et formate les données selon le format
     - Pour l'export JSON, l'application vérifie la conformité au standard JSON Resume
     - Le fichier est généré et proposé en téléchargement (@cv-generator/infrastructure)

  3. **Optimisation ATS**:
     - L'application analyse le contenu du CV
     - Des conseils d'optimisation sont affichés en temps réel
     - Un score de lisibilité ATS est calculé

- **Points d'Intégration Externes**:
  - Possibilité d'importer des CV au format JSON Resume standard depuis d'autres outils
  - Possibilité d'exporter des CV au format JSON Resume standard pour utilisation dans d'autres services

## 5️⃣ Principes de Développement

- **Standards de Code**:

  - Conventions de nommage:
    - PascalCase pour composants, interfaces et types
    - camelCase pour variables, fonctions et propriétés
    - UPPER_CASE pour constantes
    - kebab-case pour les fichiers et dossiers (sauf composants Vue)
  - Biome pour la qualité du code et le formatting
  - Utilisation systématique des types TypeScript
  - Documentation JSDoc pour les APIs publiques
  - Immutabilité privilégiée
  - Composition API pour les composants Vue

- **Stratégie de Test**:

  - Tests unitaires avec Vitest pour la logique métier (@cv-generator/core)
  - Tests de composants pour l'UI avec Testing Library (@cv-generator/ui)
  - Tests E2E pour les flux utilisateurs complets avec Playwright
  - Validation automatique du format JSON Resume dans les tests
  - Couverture minimale: 80% pour le core, 70% pour l'UI

- **Modèle de Collaboration**:

  - GitHub Flow (branching model)
  - Pull Requests avec au moins un approbateur
  - Intégration continue (CI/CD)
  - Commits conventionnels (enforced via Husky)
  - Revue de code systématique

- **Documentation**:
  - README complet avec guide d'installation et utilisation
  - Documentation d'architecture (Clean Architecture)
  - Documentation des structures de données selon le standard JSON Resume
  - JSDoc pour les APIs publiques
  - Changelog maintenu automatiquement

## 6️⃣ Plan d'Implémentation

- **Phases Techniques**:

  1. **MVP (1-2 semaines)**:

     - Mise en place de la structure monorepo PNPM avec les packages essentiels
     - Implémentation complète du schéma JSON Resume standard
     - Formulaires basiques d'édition
     - Stockage localStorage
     - Export JSON conforme au standard JSON Resume
     - Validation complète du schéma

  2. **Améliorations UX et formats d'export (2-3 semaines)**:

     - Amélioration de l'interface utilisateur
     - Validation complète des formulaires
     - Prévisualisation du CV
     - Export HTML et PDF
     - Conseils ATS de base
     - Import de fichiers JSON Resume existants

  3. **Perfectionnement (2 semaines)**:
     - Améliorations basées sur les retours utilisateurs
     - Optimisation des performances
     - Améliorations des conseils ATS
     - Tests utilisateurs et ajustements finaux
     - Compatibilité renforcée avec les autres outils de l'écosystème JSON Resume

- **Priorités Techniques**:

  - **Haute**: Structure monorepo, core conforme au JSON Resume, validation complète du schéma, stockage localStorage, export JSON standard
  - **Moyenne**: UI/UX, prévisualisation CV, export HTML/PDF, conseils ATS basiques, import de CV existants
  - **Basse**: Animations UI, personnalisation templates, analytics d'utilisation

- **Proof of Concepts**:
  - POC pour la génération de PDF côté client
  - POC pour l'optimisation des performances avec des CV volumineux
  - POC pour la validation complète du schéma JSON Resume

## 7️⃣ Risques et Mitigations

- **Risques Techniques**:

  1. **Limitations du localStorage**:

     - Risque: Capacité de stockage limitée pour les CV volumineux
     - Mitigation: Compression des données, export JSON pour sauvegarde externe

  2. **Performance d'export PDF**:

     - Risque: Temps de génération PDF potentiellement lent sur appareils faibles
     - Mitigation: Optimisation du rendu, feedbacks visuels, génération asynchrone

  3. **Compatibilité navigateurs**:

     - Risque: Divergences de fonctionnalités entre navigateurs
     - Mitigation: Tests cross-browser, polyfills, détection de fonctionnalités

  4. **Évolution du standard JSON Resume**:

     - Risque: Le standard pourrait évoluer et nécessiter des adaptations
     - Mitigation: Architecture modulaire permettant des mises à jour faciles, système de migration de données

  5. **Expérience offline**:
     - Risque: Fonctionnalités limitées en mode hors ligne
     - Mitigation: Architecture PWA, synchronisation intelligente, mode offline explicite
  6. **Complexité du monorepo**:
     - Risque: Gestion des dépendances et intégration complexes
     - Mitigation: Scripts d'automatisation, CI/CD robuste, documentation claire

- **Stratégies de Mitigation**:

  - Tests automatisés extensifs
  - Monitoring des performances
  - Détection précoce des incompatibilités
  - Suivi régulier des évolutions du standard JSON Resume
  - Feedback utilisateur proactif
  - Documentation d'architecture et de développement complète

- **Alternatives Envisagées**:
  - Architecture avec backend léger (rejetée pour favoriser la simplicité et le fonctionnement offline)
  - Utilisation d'une base de données IndexedDB (conservée comme option future si localStorage devient limitant)
  - Framework React (Vue.js préféré pour sa simplicité et sa Composition API)
  - Format de CV propriétaire (rejeté en faveur du standard ouvert JSON Resume)
  - Structure en multirepo (rejetée en faveur du monorepo pour la cohérence et facilité de développement)
