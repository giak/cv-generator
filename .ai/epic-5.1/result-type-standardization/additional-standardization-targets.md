# Cibles additionnelles pour la standardisation du ResultType

Ce document identifie les autres parties de l'application qui pourraient bénéficier de la standardisation du pattern ResultType.

## Entités à standardiser

### 1. Entité User

L'entité `User` dans `packages/core/src/user/domain/entities/User.ts` utilise actuellement un mélange d'approches:

```typescript
public static create(id: string, email: string, name: string): User {
  const emailResult = Email.create(email);
  if (!isSuccess(emailResult)) {
    throw new Error(`Invalid email: ${email}`);
  }
  return new User(id, emailResult.value, name);
}
```

**Améliorations recommandées:**

- Remplacer la fonction `isSuccess()` par la méthode `isSuccess()` de l'objet résultat
- Ajouter une méthode `createWithResultType()` qui retourne un `ResultTypeInterface<User>` au lieu de lancer une exception
- Utiliser les fonctions utilitaires `createSuccess` et `createFailure`

**Implémentation proposée:**

```typescript
public static createWithResultType(id: string, email: string, name: string): ResultTypeInterface<User> {
  const emailResult = Email.create(email);

  if (emailResult.isFailure()) {
    return createFailure<User>([{
      code: ERROR_CODES.USER.INVALID_EMAIL,
      message: `Invalid email: ${email}`,
      field: 'email',
      severity: 'error',
      layer: ValidationLayerType.DOMAIN
    }]);
  }

  return createSuccess(new User(id, emailResult.getValue(), name));
}

/**
 * @deprecated Utilisez createWithResultType à la place, qui retourne un ResultTypeInterface standard
 */
public static create(id: string, email: string, name: string): User {
  const emailResult = Email.create(email);
  if (!isSuccess(emailResult)) {
    throw new Error(`Invalid email: ${email}`);
  }
  return new User(id, emailResult.value, name);
}
```

### 2. Services d'application

Les services d'application qui interagissent avec les entités de domaine devraient être mis à jour pour utiliser le pattern ResultType standardisé:

#### Services ciblés:

- Services de validation
- Services de transformation
- Services métier qui traitent les résultats d'opérations

**Améliorations recommandées:**

- Utiliser uniformément `ResultTypeInterface<T>` pour les retours de service
- Transformer les exceptions en résultats d'erreur typés
- Encapsuler les erreurs externes (bases de données, API) dans le format standard

### 3. Composants d'interface utilisateur

Les composants qui interagissent avec les résultats devraient être standardisés:

- Remplacer les vérifications manuelles de succès/échec par les méthodes standardisées
- Utiliser un affichage cohérent des erreurs et avertissements
- Implémenter des hooks React personnalisés pour traiter les ResultType

## Classes utilitaires à standardiser

### 1. Adaptateurs de validation

Pour les adaptateurs de validation externe (comme Zod, Yup, etc.):

- Étendre les fonctions utilitaires existantes (comme `zodToResult`)
- Créer des adaptateurs pour d'autres bibliothèques de validation

### 2. Gestionnaires d'erreurs HTTP

Les gestionnaires d'erreurs qui convertissent les résultats en réponses HTTP:

```typescript
// Exemple d'implémentation recommandée
export function resultToHttpResponse<T>(
  result: ResultTypeInterface<T>,
  options: {
    successStatus?: number;
    failureStatus?: number;
  } = {}
): {
  status: number;
  body: unknown;
} {
  const { successStatus = 200, failureStatus = 400 } = options;

  if (result.isSuccess()) {
    return {
      status: successStatus,
      body: {
        success: true,
        data: result.getValue(),
        warnings: result.hasWarnings() ? result.getWarnings() : undefined,
      },
    };
  }

  return {
    status: failureStatus,
    body: {
      success: false,
      errors: result.getErrors(),
    },
  };
}
```

## Cas d'usage spécifiques

### 1. Chaînage d'opérations

Encourager l'utilisation de `flatMap` pour chaîner des opérations:

```typescript
// Avant la standardisation
const emailResult = Email.create(emailInput);
if (!emailResult.isSuccess) {
  return { isSuccess: false, errors: emailResult.errors };
}
const userResult = User.create(userId, emailResult.data, name);
if (!userResult.isSuccess) {
  return { isSuccess: false, errors: userResult.errors };
}
// ...etc

// Après la standardisation
const emailResult = Email.createWithResultType(emailInput);
return flatMap(emailResult, (email) => {
  return User.createWithResultType(userId, email, name);
});
```

### 2. Combinaison de validations

Utiliser `combineValidationResults` pour valider plusieurs champs et combiner les résultats:

```typescript
function validateRegistration(
  data: RegistrationFormData
): ResultTypeInterface<ValidatedData> {
  const emailResult = Email.createWithResultType(data.email);
  const passwordResult = validatePassword(data.password);
  const nameResult = validateName(data.name);

  return combineValidationResults({
    email: emailResult,
    password: passwordResult,
    name: nameResult,
  });
}
```

## Plan de mise en œuvre

1. **Priorisation**:

   - User entity (priorité haute)
   - Services d'application (priorité moyenne)
   - Composants UI (priorité basse)

2. **Chronologie**:

   - Planifier ces changements après la finalisation de la Phase 1 du plan de suppression
   - Aligner avec les versions mineurs de l'application

3. **Stratégie**:
   - Implémenter selon le même pattern que pour les entités principales
   - Maintenir la compatibilité arrière pendant la transition
   - Documenter les changements et fournir des exemples
