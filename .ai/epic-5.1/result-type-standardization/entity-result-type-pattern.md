# Pattern ResultType pour les Entités

Ce document définit le pattern standardisé pour l'implémentation du ResultType dans les entités du domaine.

## Contexte

Dans l'application CV Generator, les méthodes factory des entités doivent retourner des objets qui :

1. Implémentent l'interface `ResultTypeInterface<T>` définie dans le package shared
2. Incluent une référence à l'entité créée via une propriété `entity`

Actuellement, deux approches coexistent :

1. **Approche par déstructuration** (utilisée dans `Work`, `Resume`, `Basics`) : `{ ...createSuccess(data), entity: entity }`
2. **Approche par classes dédiées** (utilisée dans `User`) : `new EntitySuccess(entity)`

Ce document standardise l'**approche par classes dédiées** comme la méthode recommandée à utiliser dans toutes les entités.

## Problème avec l'approche par déstructuration

L'approche par déstructuration présente plusieurs inconvénients :

```typescript
const result = createSuccess(workData);
return { ...result, entity: work };
```

1. **Perte des méthodes** : La déstructuration (`...result`) ne copie que les propriétés, pas les méthodes définies sur le prototype, ce qui peut conduire à des erreurs lors de l'exécution.
2. **Incompatibilité avec TypeScript** : TypeScript ne peut pas garantir que l'objet retourné implémente correctement l'interface `ResultTypeInterface<T>`.
3. **Incohérence avec l'approche orientée objet** : Cette approche contredit les principes OO en créant un nouvel objet qui n'hérite pas du prototype original.

## Pattern recommandé

### 1. Définition du type et des classes

Pour chaque entité `Entity`, définir :

```typescript
// Type standard pour les résultats de l'entité
export type EntityResultType = ResultTypeInterface<EntityInterface> & {
  entity?: Entity;
};

// Classes d'implémentation
export class EntitySuccess
  extends Success<EntityInterface>
  implements EntityResultType
{
  public readonly entity: Entity;

  constructor(entity: Entity) {
    super(entity.toJSON());
    this.entity = entity;
  }
}

export class EntityFailure
  extends Failure<EntityInterface>
  implements EntityResultType
{
  public readonly entity?: undefined;

  constructor(errors: ValidationErrorInterface[]) {
    super(errors);
  }
}
```

### 2. Implémentation des méthodes factory

```typescript
public static createWithResultType(
  data: Partial<EntityInterface>,
  i18n: DomainI18nPortInterface = defaultI18nAdapter
): EntityResultType {
  const errors: ValidationErrorInterface[] = [];

  // Validation...

  // Si des erreurs sont présentes, retourne un résultat d'échec
  if (errors.length > 0) {
    return new EntityFailure(errors);
  }

  // Création de l'instance avec les données validées
  const entity = new Entity(/* ... */);

  // Retourner un résultat de succès avec l'entité attachée
  return new EntitySuccess(entity);
}
```

### 3. Implémentation des méthodes de mise à jour

```typescript
public updateWithResultType(
  props: Partial<EntityInterface>
): EntityResultType {
  // Validation et création d'une nouvelle entité

  // Si des erreurs sont présentes
  if (errors.length > 0) {
    return new EntityFailure(errors);
  }

  // Si succès
  return new EntitySuccess(updatedEntity);
}
```

## Avantages de cette approche

1. **Préservation des méthodes** : Les méthodes définies dans `ResultTypeInterface` sont correctement héritées.
2. **Sécurité des types** : TypeScript peut vérifier que l'objet retourné implémente correctement l'interface.
3. **Cohérence avec l'approche orientée objet** : Utilisation de l'héritage et du polymorphisme.
4. **Extensibilité** : Facilité d'ajout de nouvelles méthodes ou propriétés spécifiques aux entités.

## Exemples d'implémentation

### Exemple : User Entity

```typescript
// Type standard pour les résultats de l'entité User
export type UserResultType = ResultTypeInterface<User> & {
  entity?: User
};

// Classes d'implémentation pour UserResultType
export class UserSuccess extends Success<User> implements UserResultType {
  public readonly entity: User;

  constructor(user: User) {
    super(user);
    this.entity = user;
  }
}

export class UserFailure extends Failure<User> implements UserResultType {
  public readonly entity?: undefined;

  constructor(errors: ValidationErrorInterface[]) {
    super(errors);
  }
}

// Méthode factory
public static createWithResultType(
  id: string,
  email: string,
  name: string,
  i18n: DomainI18nPortInterface = defaultI18nAdapter
): UserResultType {
  // Validation...

  if (errors.length > 0) {
    return new UserFailure(errors);
  }

  const entity = new User(id, emailResult.getValue(), name.trim());
  return new UserSuccess(entity);
}
```

### Migration recommandée pour Work Entity

```typescript
// Classes d'implémentation pour WorkResultType
export class WorkSuccess extends Success<WorkInterface> implements WorkResultType {
  public readonly entity: Work;

  constructor(work: Work) {
    super(work.toJSON());
    this.entity = work;
  }
}

export class WorkFailure extends Failure<WorkInterface> implements WorkResultType {
  public readonly entity?: undefined;

  constructor(errors: ValidationErrorInterface[]) {
    super(errors);
  }
}

// Méthode factory mise à jour
static createWithResultType(
  data: Partial<WorkInterface>,
  i18n: DomainI18nPortInterface = defaultI18nAdapter
): WorkResultType {
  // Validation... (inchangée)

  if (errors.length > 0) {
    return new WorkFailure(errors);
  }

  const work = new Work(/* ... */);
  return new WorkSuccess(work);
}
```

## Conclusion

Cette standardisation du pattern ResultType pour les entités garantit une implémentation cohérente, orientée objet et typée du pattern ResultType à travers toute l'application CV Generator. Elle permettra d'éviter les erreurs d'exécution liées à la perte des méthodes et facilitera l'évolution future du code.

## Actions de migration

1. Identifier toutes les entités utilisant l'approche par déstructuration.
2. Créer les classes spécifiques `EntitySuccess` et `EntityFailure` pour chacune.
3. Mettre à jour les méthodes `createWithResultType` et `updateWithResultType`.
4. Vérifier que tous les tests passent après la migration.
