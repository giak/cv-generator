---
title: CV Generator Changelog
author: Giak
date: 2025-03-02
status: maintained
version: 1.1.0
---

# Changelog

> ℹ️ **Note:** Ce fichier suit les recommandations de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et respecte [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added 🎉

- Intégration complète de la section "Work Experience" (Expérience Professionnelle)
  - Création du formulaire d'édition avec validation en temps réel
  - Gestion des points forts (highlights) avec ajout/suppression dynamique
  - Tri automatique des expériences par ordre chronologique inverse
  - Navigation entre les sections "Basic Information" et "Work Experience"
  - Implémentation complète selon le standard JSON Resume

### Progress 📊

- Epic-2 "Édition de CV" complété à 60%
  - ✅ Formulaires pour les informations de base (basics)
  - ✅ Formulaires pour l'expérience professionnelle (work)
  - 🔄 Implémentation des formulaires pour l'éducation (education)
  - ⏳ Formulaires pour les compétences (skills) et autres sections
  - ⏳ Support des sections optionnelles du standard JSON Resume

### Technical Details 🔧

> 💡 **Work Experience Implementation**

```typescript
// WorkStore with Result pattern integration
export const useWorkStore = defineStore('work', () => {
  // State using reactive for proper typing
  const works = ref<WorkWithId[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Load works with Result pattern for error handling
  async function loadWorks(): Promise<Result<WorkWithId[]>> {
    loading.value = true;
    try {
      const resumeStore = useResumeStore();
      const resume = await resumeStore.loadResume();

      if (resume.isValid && resume.value.work) {
        works.value = resume.value.work.map((work, index) => ({
          ...work,
          id: `work-${index}`
        }));
        return Result.success(works.value);
      }
      return Result.success([]);
    } catch (e) {
      error.value = e as Error;
      return Result.failure([(e as Error).message]);
    } finally {
      loading.value = false;
    }
  }
}
```

```mermaid
---
title: Work Experience Data Flow
---
graph TD
    A[WorkList Component] -->|Displays| B[Work Items]
    A -->|Opens| C[WorkForm]
    C -->|Updates| D[Work Store]
    D -->|Validates| E[Domain Entity]
    E -->|Result Pattern| F[Valid/Invalid]
    F -->|If Valid| G[Save to Repository]
    G -->|Updates| H[LocalStorage]
    F -->|If Invalid| I[Error Feedback]
    I -->|Displayed in| C
```

### Planned Features 🔮

- Support pour l'édition collaborative
- Intégration avec les API LinkedIn et GitHub
- Mode hors-ligne complet avec synchronisation
- Analyses de CV et suggestions d'amélioration
- Interface administrateur pour la gestion des modèles
- Internationalisation (i18n) pour l'interface utilisateur

### Technical Improvements 🔧

- Migration de Tailwind CSS v4.0.0 vers v3.4.0
- Harmonisation des styles SCSS avec Tailwind classes
- Optimisation des composants d'interface utilisateur
- Migration des polices web Google Fonts vers des polices locales (InterTight, FiraCode)
- Amélioration des performances de chargement des pages grâce aux polices auto-hébergées
- Correction des références de polices dans les variables CSS pour une cohérence globale
- Mise à jour complète des fallback fonts pour une meilleure accessibilité

## [1.1.0] - 2024-05-15

### Added 🎉

- Implémentation du pattern Result pour la validation
- Support complet des bounded contexts dans l'architecture DDD
- Nouvelle interface pour la validation en temps réel
- Documentation technique détaillée avec diagrammes améliorés

### Changed 🔄

- Réorganisation complète du package core en bounded contexts (CV, Export, User)
- Amélioration de la gestion des erreurs dans toute l'application
- Mise à jour de la structure du projet basée sur les principes DDD
- Correction de plusieurs problèmes d'interface utilisateur avec le design responsive

### Technical Details 🔧

> 💡 **Implementation Details**

```typescript
// Result pattern implementation
export class Result<T> {
  private constructor(
    public readonly isValid: boolean,
    public readonly errors: string[],
    private readonly _value?: T
  ) {}

  static success<T>(value: T): Result<T> {
    return new Result<T>(true, [], value);
  }

  static failure<T>(errors: string[]): Result<T> {
    return new Result<T>(false, errors);
  }

  get value(): T {
    if (!this.isValid) {
      throw new Error("Cannot access value of invalid result");
    }
    return this._value as T;
  }
}
```

## [1.0.0] - 2024-04-20

### Added 🎉

- Support complet du format JSON Resume
- Validation en temps réel des champs avec feedback utilisateur
- Export multiple (PDF, HTML, JSON) avec options de personnalisation
- Sauvegarde automatique dans le localStorage avec historique des versions
- Interface utilisateur entièrement responsive
- Thèmes personnalisables pour les CV générés
- Structure complète Clean Architecture + DDD

### Core Features 🏗️

#### Domain Layer

> 💡 **Domain Entities and Business Logic**

| Component     | Status | Description                    |
| :------------ | :----: | :----------------------------- |
| Basics Entity |   ✅   | Core CV information management |
| Resume Entity |   ✅   | Complete resume aggregation    |
| Validation    |   ✅   | Zod schema implementation      |

```typescript
// Example: Basics Entity Implementation
class Basics {
  private constructor(
    private readonly _name: string,
    private readonly _email: string
  ) {}

  static create(data: Partial<BasicsInterface>): Result<Basics>;
  update(data: Partial<BasicsInterface>): Result<Basics>;
  toJSON(): BasicsInterface;
}
```

#### Application Layer

> 💡 **Use Cases and Application Services**

```mermaid
---
title: ManageResume Use Case Flow
---
graph TD
    A[Start] --> B[Load Resume]
    B --> C{Resume Exists?}
    C -->|Yes| D[Update Resume]
    C -->|No| E[Create Resume]
    D --> F[Save Resume]
    E --> F
    F --> G[End]
```

| Use Case     | Status | Description                 |
| :----------- | :----: | :-------------------------- |
| ManageResume |   ✅   | CRUD operations for resumes |
| ExportResume |   ✅   | Multiple format exports     |
| ImportResume |   ✅   | Resume data import          |

#### Infrastructure Layer

> 💡 **External Integrations and Persistence**

- Repository Implementations
- External Service Adapters
- Storage Solutions

### UI Components 🎨

#### Form Components

> 💡 **Core Form Implementation**

| Component  | Tests | Status |
| :--------- | :---: | :----: |
| BasicsForm |  6/6  |   ✅   |
| FormField  |  4/4  |   ✅   |
| Form       |  3/3  |   ✅   |

#### Composables

> 💡 **Reusable Logic**

| Composable         | Tests | Status |
| :----------------- | :---: | :----: |
| useFieldValidation |  5/5  |   ✅   |
| useModelUpdate     |  3/3  |   ✅   |

### Test Coverage 🧪

```mermaid
---
title: Test Coverage by Package
---
pie
    title Package Test Coverage
    "UI" : 29
    "Core" : 15
    "Shared" : 1
```

| Package        | Files | Tests | Status |
| :------------- | :---: | :---: | :----: |
| shared         |   1   |   1   |   ✅   |
| core           |   2   |  15   |   ✅   |
| ui             |   6   |  29   |   ✅   |
| infrastructure |   2   |   8   |   ✅   |

### Dependencies 📦

| Package     | Version | Status |
| :---------- | :-----: | :----: |
| vue         | ^3.4.15 |   ✅   |
| typescript  | ~5.7.3  |   ✅   |
| zod         | ^3.22.4 |   ✅   |
| vitest      | ^1.6.1  |   ✅   |
| pinia       | ^2.1.7  |   ✅   |
| tailwindcss | ^3.4.0  |   ✅   |

### Story Progress 📋

> 🚀 **Implementation Progress**

| Story   | Status | Description                  |
| :------ | :----: | :--------------------------- |
| Story-1 |   ✅   | Project Setup & Architecture |
| Story-2 |   ✅   | Basics Implementation        |
| Story-3 |   ✅   | Form Components              |
| Story-4 |   ✅   | Resume Management            |
| Story-5 |   ✅   | Export/Import Features       |
| Story-6 |   ✅   | UI/UX Improvements           |
| Story-7 |   ✅   | Performance Optimizations    |
| Story-8 |   ✅   | Documentation & Testing      |

### Technical Highlights 💡

- Architecture Clean avec séparation stricte des couches
- Tests unitaires et d'intégration avec couverture > 75%
- Validation stricte des données avec Zod et TypeScript
- Composables réutilisables pour la gestion des formulaires
- Performance optimisée avec lazy loading des composants
- Support complet du format JSON Resume
- Implementation DDD avec agrégats, entités et value objects

## [0.1.2] - 2024-02-20

### Added 🎉

- Configuration TypeScript avec support strict mode
- Configuration Vitest pour les tests
- Configuration Biome pour le linting
- Structure de dossiers Clean Architecture

### Changed 🔄

- Migration de `ResumeForm` vers `BasicsForm`
- Amélioration de la gestion d'état avec Pinia
- Optimisation de la configuration TypeScript
- Suppression des barrel files (index.ts)

### Technical Details 🔧

> 💡 **Implementation Details**

```typescript
// ManageResume Use Case
export class ManageResume {
  constructor(private readonly repository: ResumeRepository) {}

  async loadResume(): Promise<Resume>;
  async createResume(data: ResumeInterface): Promise<void>;
  async exportResume(format: "json" | "pdf" | "html"): Promise<Blob>;
  async importResume(file: Blob): Promise<Resume>;
}
```

## [0.1.1] - 2024-02-15

### Added 🎉

- Support initial du format JSON Resume
- Validation de base des données
- Interface utilisateur minimale

### Changed 🔄

- Refactoring de la structure du projet
- Amélioration des tests unitaires

## [0.1.0] - 2024-02-10

### Added 🎉

- Configuration initiale du projet
- Setup de base Vue.js avec TypeScript
- Premiers composants UI

[Unreleased]: https://github.com/giak/cv-generator/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/giak/cv-generator/compare/v0.1.1...v1.1.0
[0.1.1]: https://github.com/giak/cv-generator/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/giak/cv-generator/releases/tag/v0.1.0
