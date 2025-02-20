# Changelog

---

title: CV Generator Changelog
date: 2024-02-20
status: maintained
version: 0.1.0

---

> ℹ️ **Note:** Ce fichier suit les recommandations de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et respecte [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added 🎉

#### Core Module Setup 🏗️

- Configuration TypeScript avec support strict mode
- Configuration Vitest pour les tests
- Configuration Biome pour le linting
- Structure de dossiers Clean Architecture

#### Domain Layer Implementation ✨

- Implémentation de l'entité `Basics` pour le CV
  - Support complet du schéma JSON Resume
  - Validation stricte via Zod
  - Pattern Result pour la gestion des erreurs
  - Méthodes de création et mise à jour immutables
  - Sérialisation JSON avec gestion des champs optionnels

#### Testing Infrastructure 🧪

- Tests unitaires complets pour l'entité `Basics`
  - Tests de création avec données complètes et minimales
  - Validation des champs obligatoires
  - Validation des formats (email, URL)
  - Tests de mise à jour des champs
  - Tests de sérialisation JSON

### Changed 🔄

- Optimisation de la configuration du projet
  - Migration vers pnpm pour une meilleure gestion des dépendances
  - Mise à jour des dépendances vers les dernières versions stables
  - Amélioration de la configuration TypeScript
- Suppression des barrel files (index.ts) pour améliorer la maintenabilité

### Technical Details 🔧

#### Domain Entities

```typescript
// Basics Entity - Core domain logic for CV basic information
class Basics {
  private constructor(
    private readonly _name: string,
    private readonly _email: string
  ) // ... autres champs
  {}

  // Factory method avec validation
  static create(data: Partial<BasicsInterface>): Result<Basics>;

  // Méthode de mise à jour immutable
  update(data: Partial<BasicsInterface>): Result<Basics>;

  // Sérialisation JSON avec gestion des champs optionnels
  toJSON(): BasicsInterface;
}
```

#### Validation Schema

```typescript
// Schéma Zod pour la validation stricte
export const basicsSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    // ... autres champs avec leurs règles de validation
  })
  .strict();
```

### Dependencies 📦

| Package                   | Version | Description              |
| :------------------------ | :-----: | :----------------------- |
| zod                       | ^3.22.4 | Validation de schéma     |
| vitest                    | ^1.4.0  | Framework de test        |
| @vitest/coverage-istanbul | ^1.4.0  | Couverture de code       |
| typescript                | ~5.7.3  | Langage de programmation |

> 💡 **Prochaines étapes:** Implémentation du store Pinia et des composants Vue pour l'édition des informations de base du CV.

### Story Progress 📋

| Story ID | Status | Description                                           |
| :------- | :----: | :---------------------------------------------------- |
| story-1  |   ✅   | Setup initial project structure and core architecture |
| story-2  |   🚧   | Implementation of Basics entity with validation       |
