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

Story Points: 2 (2 jours de développement humain)

## Tasks

### 1. - [ ] Setup du Domain Layer

1. - [ ] Créer l'entité Basics
2. - [ ] Implémenter le schéma Zod pour la validation
3. - [ ] Créer les Value Objects pour email, phone, etc.
4. - [ ] Écrire les tests unitaires du domain

### 2. - [ ] Implémentation du Store

1. - [ ] Créer le store Pinia pour la gestion d'état
2. - [ ] Implémenter les actions CRUD
3. - [ ] Ajouter la persistence locale
4. - [ ] Écrire les tests du store

### 3. - [ ] Développement des Composants

1. - [ ] Créer le formulaire BasicsForm
2. - [ ] Implémenter les champs avec validation
3. - [ ] Ajouter le composant Location
4. - [ ] Créer le composant ProfileList
5. - [ ] Écrire les tests des composants

### 4. - [ ] Validation et Feedback

1. - [ ] Implémenter la validation temps réel
2. - [ ] Ajouter les messages d'erreur
3. - [ ] Créer les composants de feedback
4. - [ ] Tests d'intégration de la validation

### 5. - [ ] Documentation

1. - [ ] Documenter les composants
2. - [ ] Mettre à jour le README
3. - [ ] Ajouter des exemples d'utilisation
4. - [ ] Documenter les types et interfaces

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

## Configuration Files

### basicsSchema.ts

```typescript
import { z } from "zod";

export const locationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  countryCode: z.string().length(2).optional(),
  region: z.string().optional(),
});

export const profileSchema = z.object({
  network: z.string(),
  username: z.string(),
  url: z.string().url(),
});

export const basicsSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  image: z.string().url().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
  location: locationSchema.optional(),
  profiles: z.array(profileSchema).optional(),
});

export type BasicsType = z.infer<typeof basicsSchema>;
```

## Dev Notes

### Points Critiques

- Validation stricte des formats (email, URL, etc.)
- Gestion des erreurs utilisateur
- Performance du formulaire avec validation temps réel
- Tests exhaustifs des cas limites

### Décisions Techniques

- Utilisation de composables pour la logique réutilisable
- Validation côté client pour feedback immédiat
- Persistence locale avec LocalStorage/IndexedDB
- Architecture modulaire pour évolution future

## Chat Command Log

- User: Créer la Story-2 pour l'implémentation des basics
- Agent: Création de la structure de la story avec les tâches détaillées
- User: Validation du schéma et des composants prévus
- Agent: Ajout des contraintes et points critiques
