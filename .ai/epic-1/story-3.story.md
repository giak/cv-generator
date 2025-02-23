# Epic-1: Core CV Management

# Story-3: JSON Resume Work Experience Implementation

## Story

**As a** user
**I want** to manage my work experience entries in my CV
**so that** I can showcase my professional background in a structured way following the JSON Resume format

## Status

Draft

## Context

Cette story fait suite à la Story-2 qui a implémenté la section "basics" du CV. Nous allons maintenant nous concentrer sur la section "work" qui permet de gérer les expériences professionnelles. Cette section est cruciale car elle représente une partie majeure du CV et nécessite une gestion plus complexe avec une liste d'entrées dynamiques.

### Technical Context

- Architecture Clean/DDD établie dans Story-1
- Composants de base et validation mis en place dans Story-2
- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Tests avec Vitest
- UI avec Tailwind CSS 4

### Business Drivers

- Besoin d'une interface intuitive pour gérer multiple entrées d'expérience
- Validation sophistiquée des dates et durées
- Support du format JSON Resume pour l'interopérabilité
- Capacité à réorganiser les expériences (drag & drop)

## Estimation

Story Points: 3 (3 jours de développement humain)

## Tasks

### 1. - [ ] Setup du Domain Layer

1. - [ ] Créer l'entité Work
   - [ ] Implémentation de la classe avec constructeur privé
   - [ ] Méthode factory create() avec validation
   - [ ] Méthode update() pour modifications immutables
   - [ ] Méthode toJSON() pour sérialisation
   - [ ] Tests unitaires complets

2. - [ ] Implémenter le schéma Zod pour la validation
   - [ ] Schéma pour les dates (startDate, endDate)
   - [ ] Validation des URLs (website)
   - [ ] Validation des champs requis/optionnels
   - [ ] Types TypeScript générés depuis les schémas
   - [ ] Tests de validation pour tous les cas

3. - [ ] Créer les Value Objects pour les dates
   - [ ] Value Object WorkDate avec validation
   - [ ] Méthodes de comparaison et formatage
   - [ ] Tests unitaires

### 2. - [ ] Implémentation du Store

1. - [ ] Étendre le store Pinia
   - [ ] État pour la liste des expériences
   - [ ] Actions CRUD pour les expériences
   - [ ] Gestion de l'ordre des expériences
   - [ ] Tests unitaires

2. - [ ] Implémenter la persistence
   - [ ] Mise à jour du repository
   - [ ] Gestion des erreurs
   - [ ] Tests d'intégration

### 3. - [ ] Développement des Composants

1. - [ ] Créer le composant WorkExperienceForm
   - [ ] Structure du formulaire
   - [ ] Validation en temps réel
   - [ ] Gestion des dates (début/fin)
   - [ ] Tests unitaires

2. - [ ] Implémenter WorkExperienceList
   - [ ] Liste des expériences avec drag & drop
   - [ ] Actions d'édition/suppression
   - [ ] Tri par date
   - [ ] Tests unitaires

3. - [ ] Créer les composants auxiliaires
   - [ ] DateRangePicker personnalisé
   - [ ] RichTextEditor pour la description
   - [ ] Tests unitaires

### 4. - [ ] Validation et UX

1. - [ ] Implémenter la validation avancée
   - [ ] Validation des dates (cohérence début/fin)
   - [ ] Validation des URLs
   - [ ] Messages d'erreur contextuels
   - [ ] Tests unitaires

2. - [ ] Ajouter les interactions avancées
   - [ ] Drag & drop pour réorganisation
   - [ ] Animations de transition
   - [ ] Feedback visuel
   - [ ] Tests d'intégration

### 5. - [ ] Documentation

1. - [ ] Documenter les composants
   - [ ] JSDoc pour WorkExperienceForm
   - [ ] JSDoc pour WorkExperienceList
   - [ ] Documentation des props et events
   - [ ] Documentation des composables

2. - [ ] Mettre à jour la documentation
   - [ ] Mise à jour du README
   - [ ] Exemples d'utilisation
   - [ ] Guide d'intégration
   - [ ] Documentation des types

## Constraints

- Strict respect du format JSON Resume
- Validation sophistiquée des dates
- Support du drag & drop pour la réorganisation
- Performance optimale avec de nombreuses entrées
- Accessibilité (ARIA) pour les interactions complexes

## Structure

```
src/
├── modules/
│   └── cv/
│       ├── domain/
│       │   ├── entities/
│       │   │   └── Work.ts
│       │   ├── validators/
│       │   │   └── workSchema.ts
│       │   └── value-objects/
│       │       └── WorkDate.ts
│       ├── application/
│       │   └── use-cases/
│       │       └── UpdateWork.ts
│       └── presentation/
│           ├── components/
│           │   ├── WorkExperienceForm/
│           │   │   ├── WorkExperienceForm.vue
│           │   │   └── DateRangePicker.vue
│           │   └── WorkExperienceList/
│           │       ├── WorkExperienceList.vue
│           │       └── WorkExperienceItem.vue
│           └── composables/
│               └── useWorkExperience.ts
```

## Dev Notes

### Points Critiques

- Gestion correcte des dates et durées
- Performance avec de nombreuses entrées
- Expérience utilisateur fluide pour le drag & drop
- Validation sophistiquée des données

### Décisions Techniques

- Utilisation de composables pour la logique réutilisable
- Implementation du drag & drop avec Vue.Draggable
- Validation côté client pour feedback immédiat
- Architecture modulaire pour évolution future

## Chat Command Log

- User: Créer la Story-3 pour l'implémentation des expériences professionnelles
- Agent: Création de la structure de la story avec les tâches détaillées
