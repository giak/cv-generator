# Epic-5: Amélioration de l'Architecture

Story-1: Standardisation du pattern ResultType

## Description de la Story

**En tant qu'** équipe de développement du CV Generator  
**Je veux** standardiser le pattern ResultType à travers l'application  
**afin de** disposer d'une gestion des erreurs et des succès cohérente pour toutes les opérations

## Statut

À faire

## Contexte

Cette story est la première d'une série visant à améliorer l'architecture de l'application avant l'implémentation de l'Epic-6 (Export et sauvegarde du CV). L'analyse du code a révélé que plusieurs approches coexistent pour la gestion des résultats d'opérations :

1. Un ancien pattern avec `isSuccess`/`isFailure` (exemple dans `WorkDate.create()`)
2. Le nouveau pattern `ResultType<T>` (exemple dans `WorkDate.createWithResultType()`)
3. Des types de résultat spécifiques (exemple `WorkValidationResultType`)

Cette inconsistance complique la maintenance, augmente le risque d'erreurs, et rend le code moins prévisible. La standardisation vers le pattern ResultType permettra d'avoir une approche unifiée et plus robuste qui bénéficiera à toutes les nouvelles fonctionnalités.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. Étant donné une classe de domaine avec différentes méthodes factory, quand ces méthodes sont standardisées, alors elles retournent toutes un objet de type ResultType<T>
2. Étant donné une entité ou value object existante, quand on utilise sa méthode create(), alors elle retourne un ResultType<T> et non plus un type personnalisé ou legacy
3. Étant donné une méthode legacy avec `isSuccess`/`isFailure`, quand elle est utilisée dans le code, alors un avertissement de dépréciation est affiché
4. Étant donné une méthode ResultType, quand elle produit une erreur, alors le format de l'erreur est standardisé (code, message, champ, etc.)
5. Étant donné le package shared, quand le projet est compilé, alors il existe une implémentation standard de ResultType disponible pour tous les autres packages

## Tâches

1. - [ ] Analyser l'utilisation actuelle des méthodes de résultat
   1. - [ ] Recenser toutes les classes utilisant des patterns différents
   2. - [ ] Quantifier l'impact du changement (nombre de fichiers, méthodes, etc.)
   3. - [ ] Documenter les différentes implémentations existantes
2. - [ ] Standardiser l'interface ResultType
   1. - [ ] Définir l'interface complète dans le package shared
   2. - [ ] Créer les fonctions helpers standardisées (createSuccess, createFailure, etc.)
   3. - [ ] Implémenter les classes Success, Failure et SuccessWithWarnings
3. - [ ] Migrer les Value Objects existants
   1. - [ ] Mettre à jour WorkDate
   2. - [ ] Mettre à jour DateRange
   3. - [ ] Mettre à jour Url
4. - [ ] Gérer la compatibilité
   1. - [ ] Marquer les anciennes méthodes comme dépréciées
   2. - [ ] Rediriger les anciennes méthodes vers les nouvelles
   3. - [ ] Documenter la migration pour les autres développeurs
5. - [ ] Mettre à jour les tests unitaires
   1. - [ ] Adapter les tests pour utiliser le nouveau pattern
   2. - [ ] Ajouter des tests pour les nouvelles fonctionnalités
   3. - [ ] Vérifier que tous les tests passent

## Principes de Développement

#### Principes à Suivre

- **Cohérence**: Appliquer le même pattern de manière uniforme
- **Compatibilité**: Maintenir la compatibilité avec le code existant pendant la transition
- **Encapsulation**: Encapsuler toute la logique de gestion des résultats dans l'implémentation de ResultType
- **Tests**: S'assurer que chaque changement est couvert par des tests
- **Documentation**: Documenter clairement l'usage du pattern standardisé

#### À Éviter

- Introduction de nouveaux patterns concurrents
- Suppression immédiate des méthodes legacy sans période de dépréciation
- Modification du comportement fonctionnel des méthodes
- Solutions spécifiques non généralisables

## Risques et Hypothèses

| Risque                                           | Probabilité | Impact | Stratégie de mitigation                              |
| ------------------------------------------------ | ----------- | ------ | ---------------------------------------------------- |
| Régressions dans le code existant                | Moyenne     | Élevé  | Tests exhaustifs, déploiement progressif             |
| Incompatibilité avec des bibliothèques externes  | Faible      | Moyen  | Créer des adaptateurs pour les interfaces externes   |
| Résistance au changement dans l'équipe           | Faible      | Faible | Documentation claire, démonstration des avantages    |
| Impact performance sur les opérations fréquentes | Faible      | Moyen  | Benchmarking avant/après, optimisation si nécessaire |

## Notes de Développement

### Implémentation du ResultType standardisé

```typescript
// packages/shared/src/types/result.type.ts

export interface ResultType<T> {
  isSuccess(): boolean;
  isFailure(): boolean;
  getValue(): T;
  getErrors(): ValidationErrorInterface[];
  getWarnings(): ValidationErrorInterface[];
  hasWarnings(): boolean;
}

export function createSuccess<T>(value: T): ResultType<T> {
  return new Success(value);
}

export function createFailure<T>(
  errors: ValidationErrorInterface[]
): ResultType<T> {
  return new Failure<T>(errors);
}

export function createSuccessWithWarnings<T>(
  value: T,
  warnings: ValidationErrorInterface[]
): ResultType<T> {
  return new SuccessWithWarnings(value, warnings);
}

// Implémentations privées
class Success<T> implements ResultType<T> {
  constructor(private readonly value: T) {}

  isSuccess(): boolean {
    return true;
  }
  isFailure(): boolean {
    return false;
  }
  getValue(): T {
    return this.value;
  }
  getErrors(): ValidationErrorInterface[] {
    return [];
  }
  getWarnings(): ValidationErrorInterface[] {
    return [];
  }
  hasWarnings(): boolean {
    return false;
  }
}

class Failure<T> implements ResultType<T> {
  constructor(private readonly errors: ValidationErrorInterface[]) {}

  isSuccess(): boolean {
    return false;
  }
  isFailure(): boolean {
    return true;
  }
  getValue(): T {
    throw new Error("Cannot get value from a failure result");
  }
  getErrors(): ValidationErrorInterface[] {
    return this.errors;
  }
  getWarnings(): ValidationErrorInterface[] {
    return [];
  }
  hasWarnings(): boolean {
    return false;
  }
}

class SuccessWithWarnings<T> implements ResultType<T> {
  constructor(
    private readonly value: T,
    private readonly warnings: ValidationErrorInterface[]
  ) {}

  isSuccess(): boolean {
    return true;
  }
  isFailure(): boolean {
    return false;
  }
  getValue(): T {
    return this.value;
  }
  getErrors(): ValidationErrorInterface[] {
    return [];
  }
  getWarnings(): ValidationErrorInterface[] {
    return this.warnings;
  }
  hasWarnings(): boolean {
    return true;
  }
}
```

### Exemple de migration pour WorkDate

```typescript
// Avant
export class WorkDate {
  public static create(dateStr: string): LegacyDateResult {
    // ...
  }

  public static createWithResultType(dateStr: string): ResultType<WorkDate> {
    // ...
  }
}

// Après
export class WorkDate {
  /**
   * Create a new WorkDate instance
   * @param dateStr Date string in YYYY-MM-DD format
   * @returns Result containing WorkDate or validation errors
   */
  public static create(dateStr: string): ResultType<WorkDate> {
    return this.createWithResultType(dateStr);
  }

  /**
   * @deprecated Use create() instead which now returns ResultType
   */
  public static createLegacy(dateStr: string): LegacyDateResult {
    // Original implementation moved here
    const result = this.create(dateStr);
    return {
      isSuccess: result.isSuccess(),
      isFailure: result.isFailure(),
      getValue: result.isSuccess() ? () => result.getValue() : undefined,
      error: result.isFailure() ? result.getErrors()[0]?.message : undefined,
    };
  }
}
```

## Historique du Chat

**User:** Avant de se lancer dans l'EPIC 6, pourrais-tu analyser si l'application actuelle est robuste, stable et suffisamment bien conçue ? Il y a peut-être des améliorations à apporter (design pattern, refactorisation, etc).

**Assistant:** J'ai analysé le code actuel et remarqué que plusieurs approches coexistent pour la gestion des résultats d'opérations. Par exemple, `WorkDate` a deux méthodes : `create()` qui retourne un type legacy, et `createWithResultType()` qui utilise le pattern ResultType moderne. Cette inconsistance pourrait causer des problèmes lors de l'implémentation des fonctionnalités d'export et sauvegarde.

**User:** Peux-tu approfondir cette analyse et me proposer un plan d'amélioration ?

**Assistant:** J'ai approfondi l'analyse et recommande de standardiser le pattern ResultType à travers toute l'application. Ce pattern est plus robuste pour la gestion des erreurs et des succès, et permettrait d'avoir une approche cohérente dans le code. Il faudrait refactoriser toutes les classes de domaine pour utiliser ce pattern, tout en maintenant la compatibilité pendant la transition.

**User:** Cette story semble volumineuse, ne faudrait-il pas la diviser ?

**Assistant:** Vous avez raison, j'ai identifié que cette story sur la standardisation est trop large. Je propose de la diviser en plusieurs stories plus petites, dont celle-ci qui se concentre uniquement sur la standardisation du pattern ResultType, séparément des autres améliorations architecturales.
