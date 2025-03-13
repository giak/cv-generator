# Epic-5: Internationalisation et Multilinguisme

Story-3: Adaptation des composants et services existants

## Description de la Story

**En tant que** développeur du projet CV Generator
**Je veux** adapter les composants, les Value Objects et les services existants pour utiliser l'internationalisation
**afin de** garantir une expérience utilisateur cohérente et multilingue dans toutes les couches de l'application

## Statut

Draft

## Contexte

Cette story fait partie de l'Epic-5 qui vise à internationaliser notre application CV Generator. Elle s'appuie sur les Stories 1 et 2 qui ont établi l'architecture d'internationalisation et centralisé les clés de traduction.

Une fois les fondations architecturales en place et les clés de traduction définies, nous devons modifier les composants UI, les Value Objects du domaine et les composables existants pour qu'ils utilisent ces clés plutôt que des messages en dur. Cette étape est cruciale pour assurer un comportement cohérent de l'application lors des changements de langue.

Cette story se concentre spécifiquement sur l'adaptation technique des composants existants, et requiert une attention particulière pour préserver l'API des composables comme `useValidationCatalogue` et `useValidationResult` tout en les adaptant pour utiliser l'internationalisation.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. Étant donné des Value Objects avec des messages en dur, quand ils sont adaptés, alors ils utilisent l'interface DomainI18nPort pour les traductions
2. Étant donné des composants Vue avec des textes codés en dur, quand ils sont adaptés, alors ils utilisent la fonction $t pour les traductions
3. Étant donné les composables spécialisés comme useValidationCatalogue, quand ils sont adaptés, alors leur API publique reste compatible avec le code existant
4. Étant donné les retours d'erreurs de validation du domaine, quand ils remontent à l'interface utilisateur, alors les messages sont correctement traduits dans la langue sélectionnée
5. Étant donné des messages contenant des paramètres, quand ils sont adaptés, alors l'interpolation des paramètres fonctionne correctement dans toutes les couches
6. Étant donné une modification de langue par l'utilisateur, quand cette modification est effectuée, alors tous les composants affichent immédiatement les textes dans la nouvelle langue

## Tâches

1. - [ ] Adapter les Value Objects du domaine

   1. - [ ] Modifier les Value Objects pour injecter le port d'internationalisation
   2. - [ ] Remplacer les messages en dur par des appels au port
   3. - [ ] Ajouter l'information de clé i18n dans les erreurs
   4. - [ ] Tester les Value Objects avec l'adaptateur mock

2. - [ ] Adapter les entités du domaine

   1. - [ ] Modifier les entités pour injecter le port d'internationalisation
   2. - [ ] Remplacer les messages en dur par des appels au port
   3. - [ ] Ajouter l'information de clé i18n dans les erreurs
   4. - [ ] Tester les entités avec l'adaptateur mock

3. - [ ] Adapter les composants Vue

   1. - [ ] Identifier tous les textes en dur dans les templates
   2. - [ ] Remplacer les textes par des appels à la fonction $t
   3. - [ ] Ajouter les imports des clés UI depuis @cv-generator/shared
   4. - [ ] Tester les composants avec différentes langues

4. - [ ] Adapter le composable useValidationCatalogue

   1. - [ ] Modifier le composable pour utiliser les clés de traduction
   2. - [ ] Préserver l'API publique existante
   3. - [ ] Ajouter le support des paramètres pour l'interpolation
   4. - [ ] Tester avec différentes langues

5. - [ ] Adapter le composable useValidationResult
   1. - [ ] Modifier le composable pour traiter les clés i18n dans les erreurs
   2. - [ ] Préserver l'API publique existante
   3. - [ ] Ajouter le support pour l'interpolation des paramètres
   4. - [ ] Tester avec différentes langues et scénarios d'erreur

## Principes de Développement

#### Principes à Suivre

- **Compatibilité API**: Maintenir la compatibilité des API existantes tout en ajoutant l'internationalisation
- **Clean Architecture**: Respecter les règles de dépendance entre les couches
- **Séparation des préoccupations**: Séparer clairement la logique métier de la logique d'internationalisation
- **Tests**: Vérifier le bon fonctionnement avec différentes langues
- **Type Safety**: Assurer la sécurité de type pour toutes les clés et les paramètres

#### À Éviter

- Les changements d'API qui nécessiteraient des modifications importantes dans le code client
- L'introduction de dépendances cycliques entre les couches
- La duplication de logique de traduction
- Les textes en dur qui contourneraient le système d'internationalisation
- La génération de nombres excessifs de clés de traduction

## Risques et Hypothèses

| Risque                                                | Probabilité | Impact | Mitigation                                                         |
| ----------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------ |
| Modifications incompatibles des API existantes        | Moyenne     | Élevé  | Bien documenter les changements et tester l'intégration            |
| Oubli de messages lors de l'adaptation                | Élevée      | Moyen  | Utiliser des revues de code et des tests d'interface utilisateur   |
| Performance dégradée par les appels de traduction     | Faible      | Moyen  | Profiler les performances et optimiser si nécessaire               |
| Complexité accrue des Value Objects du domaine        | Moyenne     | Moyen  | Maintenir une interface simple pour le port d'internationalisation |
| Erreurs dans l'interpolation des paramètres complexes | Moyenne     | Moyen  | Créer des tests unitaires spécifiques pour les cas d'interpolation |

## Notes de Développement

### Modification des Value Objects

```typescript
// Avant
export class Email implements ValueObject<string> {
  private constructor(private readonly value: string) {}

  public static create(email: string): ValidationResult<Email> {
    if (!email) {
      return createFailure([
        {
          code: ERROR_CODES.RESUME.BASICS.REQUIRED_EMAIL,
          message: "L'email est requis", // Message en dur
          field: "email",
          severity: "error",
          layer: ValidationLayerType.DOMAIN,
        },
      ]);
    }

    // Validation de format...

    return createSuccess(new Email(email));
  }
}

// Après
export class Email implements ValueObject<string> {
  private constructor(
    private readonly value: string,
    private readonly i18n: DomainI18nPortInterface
  ) {}

  public static create(
    email: string,
    i18n: DomainI18nPortInterface
  ): ValidationResult<Email> {
    if (!email) {
      return createFailure([
        {
          code: ERROR_CODES.RESUME.BASICS.REQUIRED_EMAIL,
          message: i18n.translate(VALIDATION_KEYS.RESUME.BASICS.EMAIL.REQUIRED),
          i18nKey: VALIDATION_KEYS.RESUME.BASICS.EMAIL.REQUIRED,
          field: "email",
          severity: "error",
          layer: ValidationLayerType.DOMAIN,
        },
      ]);
    }

    // Validation de format...

    return createSuccess(new Email(email, i18n));
  }
}
```

### Modification des composables

```typescript
// Avant
export function useValidationCatalogue() {
  const catalogue = {
    [ERROR_CODES.RESUME.BASICS.REQUIRED_EMAIL]: "L'email est requis",
    [ERROR_CODES.RESUME.BASICS.INVALID_EMAIL]: "Format email invalide",
    // ...autres messages
  };

  return {
    getMessage(code: string): string {
      return catalogue[code] || "Erreur inconnue";
    },
  };
}

// Après
export function useValidationCatalogue() {
  const { t } = useI18n();

  // Mapping des codes d'erreur vers les clés de traduction
  const keyMapping = {
    [ERROR_CODES.RESUME.BASICS.REQUIRED_EMAIL]:
      VALIDATION_KEYS.RESUME.BASICS.EMAIL.REQUIRED,
    [ERROR_CODES.RESUME.BASICS.INVALID_EMAIL]:
      VALIDATION_KEYS.RESUME.BASICS.EMAIL.INVALID,
    // ...autres mappings
  };

  return {
    // Préservation de l'API existante
    getMessage(code: string, params?: Record<string, any>): string {
      const i18nKey = keyMapping[code] || "errors.unknown";
      return t(i18nKey, params || {});
    },
  };
}
```

### Modification des composants Vue

```vue
<!-- Avant -->
<template>
  <div>
    <label>Email</label>
    <input type="email" placeholder="Entrez votre email" v-model="email" />
    <span v-if="error">{{ error.message }}</span>
  </div>
</template>

<!-- Après -->
<template>
  <div>
    <label>{{ $t(UI_KEYS.FORMS.BASICS.EMAIL_LABEL) }}</label>
    <input
      type="email"
      :placeholder="$t(UI_KEYS.FORMS.BASICS.EMAIL_PLACEHOLDER)"
      v-model="email"
    />
    <span v-if="error">
      {{ error.i18nKey ? $t(error.i18nKey, error.i18nParams) : error.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { UI_KEYS } from "@cv-generator/shared";
// ...reste du code
</script>
```

### Modification du composable useValidationResult

```typescript
// Avant
export function useValidationResult() {
  const validationCatalogue = useValidationCatalogue();

  function getErrorMessage(error: ValidationError): string {
    return validationCatalogue.getMessage(error.code);
  }

  return {
    getErrorMessage,
  };
}

// Après
export function useValidationResult() {
  const validationCatalogue = useValidationCatalogue();
  const { t } = useI18n();

  function getErrorMessage(error: ValidationError): string {
    // Si l'erreur a une clé i18n, l'utiliser directement
    if (error.i18nKey) {
      return t(error.i18nKey, error.i18nParams || {});
    }

    // Sinon, utiliser le catalogue (pour la compatibilité)
    return validationCatalogue.getMessage(error.code, error.i18nParams);
  }

  return {
    getErrorMessage,
  };
}
```

## Journal de Communication

- Dev: Comment adapter les Value Objects sans casser leur API?
- Tech Lead: Ajouter le paramètre i18n aux méthodes factory, mais le rendre optionnel pour la transition
- Dev: Faut-il modifier tous les composables de validation en même temps?
- Tech Lead: Commencer par useValidationCatalogue et useValidationResult, car ils sont utilisés partout
- Dev: Comment gérer le cas où une erreur n'a pas encore de clé i18n?
- Tech Lead: Prévoir un fallback avec le message en dur pour assurer une transition progressive
- Dev: Que faire des tests existants qui n'utilisent pas l'internationalisation?
- Tech Lead: Adapter les tests pour qu'ils injectent l'adaptateur mock, mais il faudra une phase de transition
- Dev: La modification du composable useValidationResult risque d'impacter beaucoup de composants?
- Tech Lead: Son API publique doit rester identique, seule l'implémentation interne change pour gérer les clés i18n
