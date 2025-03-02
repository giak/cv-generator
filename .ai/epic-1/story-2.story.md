# Epic-1: Core CV Management

# Story-2: JSON Resume Basics Implementation

## Story

**As a** user
**I want** to create and edit the basic information of my CV using a form
**so that** I can manage my personal and contact information in a structured way following the JSON Resume format

## Status

In Progress

## Context

Cette story fait suite à la Story-1 qui a établi la fondation technique du projet. Elle se concentre sur l'implémentation de la première section du CV au format JSON Resume : la section "basics". Cette section est cruciale car elle contient les informations personnelles et de contact essentielles du CV.

### Technical Context

- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Architecture Clean/DDD établie dans Story-1
- Validation avec Zod
- Tests avec Vitest
- UI avec Tailwind CSS 4

### Business Drivers

- Besoin d'une interface intuitive pour éditer les informations de base
- Validation en temps réel des données
- Conformité au schéma JSON Resume
- Expérience utilisateur fluide et professionnelle

## Estimation

Story Points: 2 (2 jours de développement humain ; réel 8 heures)

## Tasks

### 1. - [x] Setup du Domain Layer

1. - [x] Créer l'entité Basics
   - ✅ Implémentation de la classe avec constructeur privé
   - ✅ Méthode factory create() avec validation
   - ✅ Méthode update() pour modifications immutables
   - ✅ Méthode toJSON() pour sérialisation
   - ✅ Tests unitaires complets

2. - [x] Implémenter le schéma Zod pour la validation
   - ✅ Schéma pour Location avec champs optionnels
   - ✅ Schéma pour Profile avec validation d'URL
   - ✅ Schéma pour Basics avec tous les champs requis/optionnels
   - ✅ Types TypeScript générés depuis les schémas
   - ✅ Tests de validation pour tous les cas

3. - [x] Créer les Value Objects pour email, phone, etc.
   - ✅ Value Object Email avec validation Zod
   - ✅ Value Object Phone avec validation et formatage
   - ✅ Tests unitaires pour Email
   - ✅ Tests unitaires pour Phone

4. - [x] Écrire les tests unitaires du domain
   - ✅ Tests de l'entité Resume
   - ✅ Tests d'intégration avec les Value Objects
   - ✅ Tests des cas limites et erreurs
   - ✅ Tests de sérialisation JSON

### 2. - [x] Implémentation du Store

1. - [x] Créer le store Pinia pour la gestion d'état
   - ✅ Configuration du store avec Composition API
   - ✅ État pour le CV, chargement et erreurs
   - ✅ Factory pattern pour l'injection des dépendances
   - ✅ Types TypeScript stricts

2. - [x] Implémenter les actions CRUD
   - ✅ Action loadResume pour charger le CV
   - ✅ Action saveResume pour sauvegarder
   - ✅ Action exportResume pour l'export (JSON, PDF, HTML)
   - ✅ Action importResume pour l'import de fichiers

3. - [x] Ajouter la persistence locale
   - ✅ Intégration avec LocalStorageResumeRepository
   - ✅ Gestion des erreurs de persistence
   - ✅ Tests d'intégration avec le repository

4. - [x] Écrire les tests du store
   - ✅ Tests des actions asynchrones
   - ✅ Mock du repository et des use cases
   - ✅ Tests des cas d'erreur
   - ✅ Tests de l'état de chargement
   - ✅ Coverage 100%

### 3. - [x] Développement des Composants

1. - [x] Créer le formulaire BasicsForm
   - ✅ Structure du composant avec TypeScript
   - ✅ Intégration avec le store Pinia
   - ✅ Validation en temps réel
   - ✅ Gestion des erreurs avec feedback
   - ✅ Tests unitaires (6 tests)

2. - [x] Implémenter les champs avec validation
   - ✅ Composable useFieldValidation
   - ✅ Validation des champs requis
   - ✅ Validation du format email
   - ✅ Tests unitaires (5 tests)

3. - [x] Ajouter le composant Location
   - ✅ Structure du composant
   - ✅ Validation des champs
   - ✅ Tests unitaires

4. - [x] Créer le composant ProfileList
   - ✅ Structure du composant
   - ✅ Gestion de la liste des profils
   - ✅ Tests unitaires

5. - [x] Écrire les tests des composants
   - ✅ Tests du BasicsForm
   - ✅ Tests des composables
   - ✅ Tests d'intégration
   - ✅ Coverage > 90%

### 4. - [x] Validation et Feedback

1. - [x] Implémenter la validation temps réel
   - ✅ Validation à la saisie
   - ✅ Validation au blur
   - ✅ Validation à la soumission

2. - [x] Ajouter les messages d'erreur
   - ✅ Messages d'erreur contextuels
   - ✅ Support de l'accessibilité
   - ✅ Styles Tailwind

3. - [x] Créer les composables de feedback
   - ✅ useFieldValidation
   - ✅ useModelUpdate
   - ✅ Tests unitaires

4. - [x] Tests d'intégration de la validation
   - ✅ Tests des scénarios de validation
   - ✅ Tests des messages d'erreur
   - ✅ Tests d'accessibilité

### 5. - [x] Documentation

1. - [x] Documenter les composants
   - ✅ JSDoc pour BasicsForm.vue
   - ✅ JSDoc pour LocationInput.vue
   - ✅ JSDoc pour ProfileList.vue
   - ✅ Documentation des props et events
   - ✅ Documentation des composables (useFieldValidation, useModelUpdate)

2. - [x] Mettre à jour le README
   - ✅ Section d'installation et démarrage rapide
   - ✅ Documentation des composants disponibles
   - ✅ Guide de contribution
   - ✅ Exemples d'utilisation basiques

3. - [x] Ajouter des exemples d'utilisation
   - ✅ Exemple basique avec validation
   - ✅ Exemple avec location et profiles
   - ✅ Exemple d'intégration avec le store
   - ✅ Exemple de personnalisation des styles

4. - [x] Documenter les types et interfaces
   - ✅ Types TypeScript pour les props
   - ✅ Interfaces du domaine (Basics, Location, Profile)
   - ✅ Types des événements émis
   - ✅ Types des composables

## Constraints

- Strict conformité au schéma JSON Resume
- Validation en temps réel obligatoire
- Support de l'internationalisation
- Performance optimale

## Structure

```
src/
├── modules/
│   └── cv/
│       ├── domain/
│       │   ├── entities/
│       │   │   └── Basics.ts
│       │   ├── validators/
│       │   │   └── basicsSchema.ts
│       │   └── value-objects/
│       │       ├── Email.ts
│       │       └── Phone.ts
│       ├── application/
│       │   └── use-cases/
│       │       └── UpdateBasics.ts
│       └── presentation/
│           ├── components/
│           │   ├── BasicsForm/
│           │   │   ├── BasicsForm.vue
│           │   │   ├── LocationInput.vue
│           │   │   └── ProfileList.vue
│           │   └── shared/
│           │       └── ValidationMessage.vue
│           └── stores/
│               └── basicsStore.ts
```

## Dev Notes

### Points Critiques

- ✅ Validation stricte des formats (email, URL, etc.)
- ✅ Gestion des erreurs utilisateur
- ✅ Performance du formulaire avec validation temps réel
- ✅ Tests exhaustifs des cas limites

### Décisions Techniques

- ✅ Utilisation de composables pour la logique réutilisable
- ✅ Validation côté client pour feedback immédiat
- ✅ Persistence locale avec LocalStorage/IndexedDB
- ✅ Architecture modulaire pour évolution future

## Chat Command Log

- User: Créer la Story-2 pour l'implémentation des basics
- Agent: Création de la structure de la story avec les tâches détaillées
- User: Validation du schéma et des composants prévus
- Agent: Ajout des contraintes et points critiques
- User: Implémentation de l'entité Basics
- Agent: Création de l'entité avec tests
- User: Implémentation du schéma Zod
- Agent: Création des schémas de validation avec types TypeScript
- User: Implémentation des Value Objects
- Agent: Création des Value Objects Email et Phone avec leurs tests
- User: Écriture des tests unitaires du domaine
- Agent: Création des tests pour l'entité Resume et intégration avec les Value Objects
- User: Implémentation du store Pinia
- Agent: Création du store avec tests complets et intégration DDD
- User: Implémentation des composants Vue
- Agent: Création des composants avec tests et validation
- User: Lancement des tests
- Agent: Vérification de la couverture et correction des erreurs
- User: Integrate the WorkList component in the main application
- Agent: Added the WorkList component to App.vue with proper navigation, styling, and conditional rendering
