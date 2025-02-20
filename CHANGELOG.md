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

#### Application Layer Implementation 🔄

- Implémentation du use case `ManageResume`
  - Interface `ResumeRepository` pour l'abstraction de la persistence
  - Méthodes CRUD pour la gestion des CV
  - Support de l'export en différents formats (JSON, PDF, HTML)
  - Gestion des erreurs avec types TypeScript

#### UI Layer Implementation 🎨

- Configuration du store Pinia pour la gestion d'état
  - Store `resume` avec gestion asynchrone
  - Actions pour charger, sauvegarder, exporter et importer
  - Gestion des états de chargement et des erreurs
  - Tests unitaires complets avec mocks

#### Testing Infrastructure 🧪

- Tests unitaires complets pour l'entité `Basics`

  - Tests de création avec données complètes et minimales
  - Validation des champs obligatoires
  - Validation des formats (email, URL)
  - Tests de mise à jour des champs
  - Tests de sérialisation JSON

- Tests du store Pinia
  - Tests des actions asynchrones
  - Mock du repository et des use cases
  - Tests des cas d'erreur
  - Tests de l'état de chargement

### Changed 🔄

- Optimisation de la configuration du projet
  - Migration vers pnpm pour une meilleure gestion des dépendances
  - Mise à jour des dépendances vers les dernières versions stables
  - Amélioration de la configuration TypeScript
  - Support des modules ES2022
  - Configuration de la résolution des modules en mode bundler
- Suppression des barrel files (index.ts) pour améliorer la maintenabilité
- Amélioration de la gestion des erreurs
  - Types d'erreur plus précis
  - Messages d'erreur plus descriptifs
  - Gestion des erreurs non-Error

### Technical Details 🔧

#### Domain Entities

```typescript
// Basics Entity - Core domain logic for CV basic information
class Basics {
  private constructor(
    private readonly _name: string,
    private readonly _email: string // ... autres champs
  ) {}

  // Factory method avec validation
  static create(data: Partial<BasicsInterface>): Result<Basics>;

  // Méthode de mise à jour immutable
  update(data: Partial<BasicsInterface>): Result<Basics>;

  // Sérialisation JSON avec gestion des champs optionnels
  toJSON(): BasicsInterface;
}
```

#### Use Cases

```typescript
// ManageResume - Application layer use case
export class ManageResume {
  constructor(private readonly repository: ResumeRepository) {}

  async loadResume(): Promise<Resume>;
  async createResume(data: ResumeInterface): Promise<void>;
  async exportResume(format: "json" | "pdf" | "html"): Promise<Blob>;
  async importResume(file: Blob): Promise<Resume>;
}
```

#### Store Implementation

```typescript
// Resume Store - UI layer state management
export const useResumeStore = defineStore("resume", () => {
  const resume = ref<Resume | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  async function loadResume(): Promise<void>;
  async function saveResume(data: Resume): Promise<void>;
  async function exportResume(format: string): Promise<Blob>;
  async function importResume(file: Blob): Promise<void>;
});
```

### Dependencies 📦

| Package                   | Version | Description              |
| :------------------------ | :-----: | :----------------------- |
| zod                       | ^3.22.4 | Validation de schéma     |
| vitest                    | ^1.4.0  | Framework de test        |
| @vitest/coverage-istanbul | ^1.4.0  | Couverture de code       |
| typescript                | ~5.7.3  | Langage de programmation |
| pinia                     | ^2.1.7  | Gestion d'état           |
| @pinia/testing            | ^1.0.0  | Tests de store           |

> 💡 **Prochaines étapes:** Implémentation des composants Vue pour l'édition des informations de base du CV.

### Story Progress 📋

| Story ID | Status | Description                                           |
| :------- | :----: | :---------------------------------------------------- |
| story-1  |   ✅   | Setup initial project structure and core architecture |
| story-2  |   🚧   | Implementation of Basics entity with validation       |
