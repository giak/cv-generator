# Stratégie de test pour les patterns de validation

## 1. Introduction

Ce document présente notre stratégie de test pour les patterns de validation utilisés dans l'application. L'objectif est d'assurer que le pattern Result/Option est correctement implémenté et testé à travers les différentes couches de l'application.

## 2. Principes et objectifs des tests

### 2.1 Objectifs principaux

1. **Cohérence du pattern** : Vérifier que le pattern Result/Option est utilisé de manière cohérente
2. **Propagation des erreurs** : Tester la propagation correcte des erreurs et des warnings à travers les couches
3. **Robustesse de la chaîne** : Assurer que la chaîne de validation complète fonctionne correctement
4. **Typage et sécurité** : Vérifier que le typage TypeScript fonctionne correctement

### 2.2 Approche TDD

Nous adoptons une approche TDD (Test-Driven Development) :

1. Écrire d'abord les tests qui définissent le comportement attendu
2. Implémenter le code pour faire passer les tests
3. Refactoriser le code tout en maintenant les tests passants

## 3. Structure des tests

### 3.1 Tests unitaires par couche

#### Couche Domain

- Tests pour les Value Objects
- Tests des entités avec leur validation
- Tests des services de domaine

#### Couche Application

- Tests des services d'application
- Tests des adaptateurs (ex: adaptateurs Zod)

#### Couche Présentation

- Tests des composables Vue
- Tests des composants Vue avec leur validation

### 3.2 Tests d'intégration

- Tests de la chaîne de validation complète (domain → application → présentation)
- Tests des flux de validation à travers les formulaires

## 4. Exemple de tests pour les différentes couches

### 4.1 Tests unitaires de Value Object (domaine)

```typescript
// EmailValueObject.spec.ts
describe("EmailValueObject", () => {
  it("devrait valider un email correct", () => {
    const result = EmailValueObject.create("test@example.com");
    expect(isSuccess(result)).toBe(true);
  });

  it("devrait rejeter un email invalide", () => {
    const result = EmailValueObject.create("invalid-email");
    expect(isFailure(result)).toBe(true);
  });
});
```

### 4.2 Tests de service (application)

```typescript
// EmailValidationService.spec.ts
describe("EmailValidationService", () => {
  it("devrait propager les erreurs du domaine", () => {
    const service = new EmailValidationService();
    const result = service.validate("");
    expect(isFailure(result)).toBe(true);
  });
});
```

### 4.3 Tests de composable (présentation)

```typescript
// useValidationResult.spec.ts
describe("useValidationResult", () => {
  it("devrait exposer l'état des erreurs", () => {
    const { setResult, isSuccess, isFailure, allErrors } =
      useValidationResult();
    setResult(
      createFailure([
        {
          /* erreur */
        },
      ])
    );
    expect(isSuccess.value).toBe(false);
    expect(isFailure.value).toBe(true);
    expect(allErrors.value.length).toBe(1);
  });
});
```

## 5. Test de la chaîne de validation complète

Le fichier `validationChain.spec.ts` teste l'intégration complète :

```typescript
describe("Chaîne de validation avec Result/Option", () => {
  it("devrait propager les erreurs de validation du domaine vers l'UI", () => {
    // 1. Valider au niveau du domaine
    const result = EmailValueObject.create("");

    // 2. Propager via le service (couche application)
    const service = new EmailValidationService();
    const serviceResult = service.validate("");

    // 3. Utiliser le composable UI (couche présentation)
    const { setResult, isFailure } = useValidationResult();
    setResult(serviceResult);

    // L'erreur est bien propagée jusqu'à l'UI
    expect(isFailure.value).toBe(true);
  });
});
```

## 6. Mocks et stubs

### 6.1 Stratégie de mock

- Couche domain : généralement testée sans mocks
- Couche application : mock des dépendances externes
- Couche présentation : mock des services d'application

### 6.2 Exemple de mocks

```typescript
// shared.ts (mock)
export const createSuccess = <T>(value: T) => ({ success: true, value });
export const createFailure = <T>(errors: any[]) => ({
  success: false,
  error: errors,
});
export const isSuccess = (result: any) => result.success;
export const isFailure = (result: any) => !result.success;
```

## 7. Bonnes pratiques

1. **Tests isolés** : Chaque test devrait être indépendant
2. **Cas de test clairs** : Tester un seul comportement par test
3. **Données de test réalistes** : Utiliser des données proches de la réalité
4. **Assertions précises** : Valider exactement ce qui est attendu
5. **Tests de bord** : Tester les cas limites et les erreurs

## 8. Mise en œuvre

### 8.1 Ordre de priorité des tests

1. Value objects et entités du domaine
2. Services de validation
3. Composables d'UI
4. Composants Vue et formulaires
5. Tests d'intégration

### 8.2 Couverture de test

Objectif : 100% de couverture pour le code de validation
Minimum requis : 90% de couverture pour les fonctions critiques

## 9. Outils

- **Framework** : Vitest
- **Mocking** : Fonctions de mock de Vitest
- **Assertions** : Expect de Vitest
- **Vue Test Utils** : Pour tester les composants Vue

## 10. Suivi et maintenance

- Les tests doivent être maintenus avec le code
- Ajouter des tests pour chaque nouveau cas de validation
- Revoir régulièrement la couverture de test

---

## Statut actuel (Mai 2024)

| Composant              | Tests écrits | Couverture |
| ---------------------- | ------------ | ---------- |
| Value Objects          | ✅           | 95%        |
| Services de domaine    | ✅           | 90%        |
| Services d'application | ✅           | 90%        |
| Composables Vue        | ✅           | 95%        |
| Composants Vue         | ✅           | 85%        |
| Intégration            | ✅           | 90%        |

Légende:

- ✅ Terminé
- 🔄 En cours
- 🟡 À démarrer

## Prochaines étapes

1. ✅ Implémenter des tests pour la chaîne de validation complète
2. ✅ Tester le composable `useValidationResult` avec les transitions warnings/erreurs
3. ✅ Adapter les tests existants à la nouvelle signature des fonctions de validation
4. ✅ Résoudre le problème des codes d'erreur pour assurer la cohérence (ERROR_CODES)
5. ✅ Finaliser les tests pour les composants Vue (BasicsForm)
6. 🔄 Implémenter des tests de bout en bout pour les scénarios critiques
