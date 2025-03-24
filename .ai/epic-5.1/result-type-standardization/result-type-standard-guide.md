# Guide de standardisation du ResultType

## Objectif

Ce guide décrit le standard unifié pour la gestion des résultats d'opérations dans l'application CV Generator. Il vise à remplacer progressivement les différentes approches actuellement utilisées par un pattern cohérent et typé.

## Le standard ResultType

### Interface centrale

Tous les résultats d'opérations doivent implémenter l'interface `ResultTypeInterface<T>` :

```typescript
export interface ResultTypeInterface<T> {
  isSuccess(): boolean;
  isFailure(): boolean;
  getValue(): T | undefined;
  getErrors(): ValidationErrorInterface[];
  getWarnings(): ValidationErrorInterface[];
  hasWarnings(): boolean;
}
```

### Implémentations

Trois classes concrètes sont fournies pour implémenter cette interface :

1. **Success\<T\>** : Représente un résultat réussi

   ```typescript
   const result = new Success<User>(user);
   // result.isSuccess() === true
   // result.getValue() === user
   ```

2. **Failure\<T\>** : Représente un résultat en échec avec des erreurs

   ```typescript
   const result = new Failure<User>([
     { i18nKey: "error.invalid_email", message: "Invalid email format" },
   ]);
   // result.isFailure() === true
   // result.getErrors() === [{ i18nKey: 'error.invalid_email', message: 'Invalid email format' }]
   ```

3. **SuccessWithWarnings\<T\>** : Représente un résultat réussi avec des avertissements
   ```typescript
   const result = new SuccessWithWarnings<User>(user, [
     { i18nKey: "warning.missing_photo", message: "User has no profile photo" },
   ]);
   // result.isSuccess() === true
   // result.hasWarnings() === true
   // result.getValue() === user
   ```

### Fonctions utilitaires

Pour simplifier la création et la manipulation des résultats, plusieurs fonctions utilitaires sont fournies :

```typescript
// Création de résultats
export function createSuccess<T>(value: T): ResultTypeInterface<T>;
export function createFailure<T>(
  errors: ValidationErrorInterface[]
): ResultTypeInterface<T>;
export function createSuccessWithWarnings<T>(
  value: T,
  warnings: ValidationErrorInterface[]
): ResultTypeInterface<T>;

// Manipulation de résultats
export function map<T, U>(
  result: ResultTypeInterface<T>,
  fn: (value: T) => U
): ResultTypeInterface<U>;
export function flatMap<T, U>(
  result: ResultTypeInterface<T>,
  fn: (value: T) => ResultTypeInterface<U>
): ResultTypeInterface<U>;
```

## Migration

### Value Objects

#### Exemple : Migration de Email

L'ancien pattern :

```typescript
// Ancien pattern
public static create(value: string): EmailValidationResultType {
  if (!value || !EmailValidator.isValid(value)) {
    return {
      isSuccess: false,
      isFailure: true,
      errors: [{ i18nKey: 'error.invalid_email', message: 'Invalid email format' }]
    };
  }
  return {
    isSuccess: true,
    isFailure: false,
    data: new Email(value)
  };
}
```

Le nouveau pattern :

```typescript
// Nouveau pattern avec ResultTypeInterface
public static createWithResultType(value: string): ResultTypeInterface<Email> {
  if (!value || !EmailValidator.isValid(value)) {
    return createFailure<Email>([
      { i18nKey: 'error.invalid_email', message: 'Invalid email format' }
    ]);
  }
  return createSuccess<Email>(new Email(value));
}

// Méthode de compatibilité
/**
 * @deprecated Use createWithResultType instead
 */
public static create(value: string): EmailValidationResultType {
  const result = Email.createWithResultType(value);
  if (result.isFailure()) {
    return {
      isSuccess: false,
      isFailure: true,
      errors: result.getErrors()
    };
  }
  return {
    isSuccess: true,
    isFailure: false,
    data: result.getValue()!
  };
}
```

## Entités

### Exemple: Migration de Work

L'ancien pattern:

```typescript
// Ancien pattern avec WorkValidationResultType
public static create(data: Partial<WorkInterface>): WorkValidationResultType {
  const errors: ValidationErrorInterface[] = [];

  // Validation logic...

  if (errors.length > 0) {
    return {
      isSuccess: false,
      isFailure: true,
      errors
    };
  }

  return {
    isSuccess: true,
    isFailure: false,
    entity: new Work(data as Required<WorkInterface>)
  };
}
```

Le nouveau pattern:

```typescript
// Nouveau type spécifique à Work qui étend ResultTypeInterface
export type WorkResultType = ResultTypeInterface<Work>;

// Nouveau pattern avec ResultTypeInterface
public static createWithResultType(data: Partial<WorkInterface>): WorkResultType {
  const errors: ValidationErrorInterface[] = [];

  // Validation logic...

  if (errors.length > 0) {
    return createFailure<Work>(errors);
  }

  return createSuccess<Work>(new Work(data as Required<WorkInterface>));
}

// Méthode de compatibilité
/**
 * @deprecated Use createWithResultType instead
 */
public static create(data: Partial<WorkInterface>): WorkValidationResultType {
  const result = Work.createWithResultType(data);
  if (result.isFailure()) {
    return {
      isSuccess: false,
      isFailure: true,
      errors: result.getErrors()
    };
  }
  return {
    isSuccess: true,
    isFailure: false,
    entity: result.getValue()!
  };
}
```

### Exemple: Migration de Basics

L'ancien pattern:

```typescript
// Ancien pattern avec BasicsValidationResultType
public static create(data: Partial<BasicsInterface>): BasicsValidationResultType {
  const errors: ValidationErrorInterface[] = [];

  // Validation logic...

  if (errors.length > 0) {
    return {
      isSuccess: false,
      isFailure: true,
      errors
    };
  }

  return {
    isSuccess: true,
    isFailure: false,
    entity: new Basics(data as Required<BasicsInterface>)
  };
}
```

Le nouveau pattern:

```typescript
// Nouveau type spécifique à Basics qui étend ResultTypeInterface
export type BasicsResultType = ResultTypeInterface<Basics>;

// Nouveau pattern avec ResultTypeInterface
public static createWithResultType(data: Partial<BasicsInterface>): BasicsResultType {
  const errors: ValidationErrorInterface[] = [];

  // Validation logic...

  if (errors.length > 0) {
    return createFailure<Basics>(errors);
  }

  return createSuccess<Basics>(new Basics(data as Required<BasicsInterface>));
}

// Méthode de compatibilité
/**
 * @deprecated Use createWithResultType instead
 */
public static create(data: Partial<BasicsInterface>): BasicsValidationResultType {
  const result = Basics.createWithResultType(data);
  if (result.isFailure()) {
    return {
      isSuccess: false,
      isFailure: true,
      errors: result.getErrors()
    };
  }
  return {
    isSuccess: true,
    isFailure: false,
    entity: result.getValue()!
  };
}
```

### Exemple: Migration de Resume

L'ancien pattern:

```typescript
// Ancien pattern avec ResumeValidationResultType
public static create(data: Partial<ResumeInterface>): ResumeValidationResultType {
  const errors: ValidationErrorInterface[] = [];

  // Validation logic...

  if (errors.length > 0) {
    return {
      isSuccess: false,
      isFailure: true,
      errors
    };
  }

  return {
    isSuccess: true,
    isFailure: false,
    entity: new Resume(data as Required<ResumeInterface>)
  };
}
```

Le nouveau pattern:

```typescript
// Nouveau type spécifique à Resume qui étend ResultTypeInterface
export type ResumeResultType = ResultTypeInterface<Resume>;

// Nouveau pattern avec ResultTypeInterface
public static createWithResultType(data: Partial<ResumeInterface>): ResumeResultType {
  const errors: ValidationErrorInterface[] = [];

  // Validation logic pour les différentes sections...

  if (errors.length > 0) {
    return createFailure<Resume>(errors);
  }

  return createSuccess<Resume>(new Resume(data as Required<ResumeInterface>));
}

// Méthode de compatibilité
/**
 * @deprecated Use createWithResultType instead
 */
public static create(data: Partial<ResumeInterface>): ResumeValidationResultType {
  const result = Resume.createWithResultType(data);
  if (result.isFailure()) {
    return {
      isSuccess: false,
      isFailure: true,
      errors: result.getErrors()
    };
  }
  return {
    isSuccess: true,
    isFailure: false,
    entity: result.getValue()!
  };
}
```

## Utilisation dans les services et composants

Voici comment utiliser le nouveau pattern dans les services et composants:

```typescript
// Service
public createUser(userData: UserDTO): ResultTypeInterface<User> {
  // Validation, traitement...
  if (!isValid) {
    return createFailure<User>([
      { i18nKey: 'error.invalid_data', message: 'Invalid user data' }
    ]);
  }
  return createSuccess<User>(new User(userData));
}

// Composant
const result = userService.createUser(formData);
if (result.isSuccess()) {
  const user = result.getValue()!;
  // Utiliser l'utilisateur...
} else {
  const errors = result.getErrors();
  // Afficher les erreurs...
}

// Avec warnings
if (result.hasWarnings()) {
  const warnings = result.getWarnings();
  // Afficher les avertissements...
}
```

## Bonnes pratiques

1. **Toujours utiliser les méthodes `createWithResultType`** pour les nouvelles implémentations
2. **Maintenir la compatibilité** en conservant les anciennes méthodes avec `@deprecated`
3. **Exploiter les fonctions utilitaires** plutôt que de créer manuellement des instances
4. **Vérifier le succès avant d'utiliser `getValue()`** pour éviter les problèmes de nullité
5. **Utiliser le pattern de garde** pour simplifier le contrôle des erreurs

## Plan de dépréciation

1. **Phase 1** (Sprint actuel): Introduire le nouveau standard et migrer les Value Objects et entités
2. **Phase 2** (1-2 Sprints): Migrer les services et composants utilisateurs
3. **Phase 3** (2-3 Sprints): Marquer toutes les méthodes anciennes comme dépréciées
4. **Phase 4** (3-6 Sprints): Supprimer les méthodes dépréciées

## FAQ

**Q: Quand dois-je utiliser `SuccessWithWarnings` ?**
R: Utilisez-le lorsqu'une opération réussit mais présente des problèmes non critiques que l'utilisateur devrait connaître.

**Q: Comment gérer des opérations en chaîne ?**
R: Utilisez `flatMap` pour enchaîner des opérations qui dépendent du résultat précédent.

**Q: Comment migrer des services existants ?**
R: Commencez par adapter les services pour accepter et retourner le nouveau type, tout en maintenant la compatibilité avec l'ancien.

## Ressources additionnelles

- [Code source de l'interface](../../packages/shared/src/types/result.types.ts)
- [Fonctions utilitaires](../../packages/shared/src/utils/result.utils.ts)
- [Exemples de Value Objects migrés](../../packages/core/src/cv/domain/value-objects/)
- [Exemples d'entités migrées](../../packages/core/src/cv/domain/entities/)
