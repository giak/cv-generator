# Epic-5: Internationalisation et Multilinguisme

Story-2: Centralisation des clés de traduction et des messages

## Description de la Story

**En tant que** développeur du projet CV Generator
**Je veux** centraliser toutes les clés de traduction et messages du système
**afin de** faciliter la maintenance, assurer la cohérence et préparer l'application pour le multilinguisme

## Statut

Draft

## Contexte

Cette story fait partie de l'Epic-5 qui vise à internationaliser notre application CV Generator. Elle s'appuie sur la Story-1 qui a établi l'architecture d'internationalisation avec le pattern Adapter.

Actuellement, l'application contient de nombreux messages et textes codés en dur dans différentes couches:

- Value Objects du domaine (ex: "Format email invalide" dans `email.value-object.ts`)
- Entités (ex: "L'email est requis" dans `Basics.ts`)
- Composants Vue (textes, placeholders dans `BasicsForm.vue`)
- Composables (ex: messages dans `useBasicsFormValidation.ts`)

Nous avons déjà une structure de codes d'erreur centralisée dans `@cv-generator/shared/src/constants/error-codes.const.ts` qui servira de base pour notre structure de clés de traduction.

Cette story vise à extraire tous ces messages en texte dur pour les remplacer par des clés de traduction structurées et centralisées, facilitant ainsi la maintenance et la traduction future de l'application.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. Étant donné la structure existante des codes d'erreur, quand nous créons les clés de traduction, alors elles suivent la même structure hiérarchique
2. Étant donné la nécessité de maintenir les clés, quand nous les définissons, alors elles sont centralisées dans le package @cv-generator/shared
3. Étant donné des messages en texte dur dans l'application, quand nous extrayons ces messages, alors ils sont remplacés par des clés de traduction
4. Étant donné le besoin de traductions complètes, quand nous créons les fichiers de traduction, alors ils contiennent tous les textes pour les langues français et anglais
5. Étant donné la structure des messages, quand nous les organisons, alors ils sont regroupés par domaine fonctionnel (UI, validation, etc.)
6. Étant donné le besoin de remplacement de variables, quand nous créons les messages, alors ils supportent l'interpolation de paramètres

## Tâches

1. - [ ] Créer la structure des clés de traduction

   1. - [ ] Définir les constantes pour les clés de traduction dans @cv-generator/shared
   2. - [ ] Organiser les clés selon la structure des codes d'erreur existants
   3. - [ ] Ajouter les typages TypeScript pour la sécurité des clés

2. - [ ] Créer les fichiers de traduction de base

   1. - [ ] Structurer les dossiers de traduction pour français et anglais
   2. - [ ] Créer les fichiers de traduction par domaine fonctionnel (UI, validation)
   3. - [ ] Implémenter le chargement des traductions dans Vue I18n

3. - [ ] Extraire les messages des composants UI
   1. - [ ] Identifier tous les textes en dur dans les composants Vue
   2. - [ ] Créer les clés correspondantes et les fichiers de traduction
   3. - [ ] Remplacer les textes par des appels à la fonction de traduction
4. - [ ] Extraire les messages des entités du domaine

   1. - [ ] Identifier tous les messages en dur dans les Value Objects
   2. - [ ] Identifier tous les messages en dur dans les Entités
   3. - [ ] Créer les clés correspondantes et les fichiers de traduction
   4. - [ ] Adapter les entités pour utiliser les clés de traduction

5. - [ ] Supporter l'interpolation de paramètres
   1. - [ ] Identifier les messages nécessitant des paramètres variables
   2. - [ ] Adapter les messages pour supporter l'interpolation
   3. - [ ] Documenter la syntaxe d'interpolation pour les développeurs

## Principes de Développement

#### Principes à Suivre

- **Centralisation**: Toutes les clés doivent être définies dans @cv-generator/shared
- **Hiérarchie**: Organiser les clés de façon hiérarchique pour faciliter la maintenance
- **DRY**: Éviter la duplication de clés ou de messages
- **Type Safety**: Assurer la sécurité de type pour toutes les clés de traduction
- **Cohérence**: Maintenir une structure cohérente entre les codes d'erreur et les clés de traduction

#### À Éviter

- La duplication des messages entre les couches
- L'utilisation de chaînes en dur pour les clés de traduction
- Des clés de traduction non structurées ou difficiles à maintenir
- La définition de clés ou messages en dehors du système centralisé
- Des messages trop spécifiques à une langue ou à un contexte culturel

## Risques et Hypothèses

| Risque                                           | Probabilité | Impact | Mitigation                                                           |
| ------------------------------------------------ | ----------- | ------ | -------------------------------------------------------------------- |
| Messages manqués lors de l'extraction            | Élevée      | Moyen  | Utiliser des outils d'analyse de code et des revues systématiques    |
| Incohérence des messages entre couches           | Moyenne     | Élevé  | Centraliser les clés et assurer une revue croisée des traductions    |
| Explosion du nombre de clés                      | Moyenne     | Moyen  | Concevoir une structure hiérarchique et éviter la sur-spécialisation |
| Difficulté à maintenir la cohérence des messages | Moyenne     | Élevé  | Documenter clairement la structure et les conventions de nommage     |
| Performance du chargement des traductions        | Faible      | Moyen  | Mettre en place un chargement paresseux des fichiers de traduction   |

## Notes de Développement

### Structure proposée des clés de traduction

```typescript
// packages/shared/src/i18n/keys/validation-keys.ts
export const VALIDATION_KEYS = {
  RESUME: {
    BASICS: {
      EMAIL: {
        REQUIRED: "validation.resume.basics.email.required",
        INVALID: "validation.resume.basics.email.invalid",
      },
      NAME: {
        REQUIRED: "validation.resume.basics.name.required",
        TOO_SHORT: "validation.resume.basics.name.tooShort",
      },
      // ...autres clés pour basics
    },
    WORK: {
      // ...clés pour work
    },
    // ...autres sections
  },
};

// packages/shared/src/i18n/keys/ui-keys.ts
export const UI_KEYS = {
  COMMON: {
    SAVE: "ui.common.save",
    CANCEL: "ui.common.cancel",
    CONFIRM: "ui.common.confirm",
    // ...autres clés communes
  },
  FORMS: {
    BASICS: {
      EMAIL_PLACEHOLDER: "ui.forms.basics.emailPlaceholder",
      NAME_LABEL: "ui.forms.basics.nameLabel",
      // ...autres clés pour le formulaire basics
    },
    // ...autres formulaires
  },
  // ...autres catégories UI
};
```

### Exemple de fichiers de traduction

```json
// packages/ui/src/locales/fr/validation.json
{
  "validation": {
    "resume": {
      "basics": {
        "email": {
          "required": "L'email est requis",
          "invalid": "Format d'email invalide"
        },
        "name": {
          "required": "Le nom est requis",
          "tooShort": "Le nom doit contenir au moins {min} caractères"
        }
      }
    }
  }
}

// packages/ui/src/locales/en/validation.json
{
  "validation": {
    "resume": {
      "basics": {
        "email": {
          "required": "Email is required",
          "invalid": "Invalid email format"
        },
        "name": {
          "required": "Name is required",
          "tooShort": "Name must contain at least {min} characters"
        }
      }
    }
  }
}
```

### Exemple d'usage dans les composants

```vue
<template>
  <div>
    <label>{{ $t(UI_KEYS.FORMS.BASICS.EMAIL_LABEL) }}</label>
    <input
      type="email"
      :placeholder="$t(UI_KEYS.FORMS.BASICS.EMAIL_PLACEHOLDER)"
    />
    <span v-if="error">{{ $t(error.i18nKey, error.i18nParams) }}</span>
  </div>
</template>

<script setup lang="ts">
import { UI_KEYS } from "@cv-generator/shared";
// ...reste du code
</script>
```

### Exemple d'usage dans les entités

```typescript
// Avant
return createFailure([
  {
    code: ERROR_CODES.RESUME.BASICS.INVALID_EMAIL,
    message: "Format email invalide", // Message en dur
    field: "email",
    severity: "error",
    layer: ValidationLayerType.DOMAIN,
  },
]);

// Après
return createFailure([
  {
    code: ERROR_CODES.RESUME.BASICS.INVALID_EMAIL,
    message: this.i18n.translate(VALIDATION_KEYS.RESUME.BASICS.EMAIL.INVALID),
    i18nKey: VALIDATION_KEYS.RESUME.BASICS.EMAIL.INVALID,
    field: "email",
    severity: "error",
    layer: ValidationLayerType.DOMAIN,
  },
]);
```

## Journal de Communication

- Dev: J'ai identifié de nombreux messages codés en dur dans toutes les couches de l'application
- Tech Lead: Nous devons définir une structure claire pour les clés de traduction
- Dev: Je propose de suivre la même structure que nos codes d'erreur
- Tech Lead: Bonne idée, cela facilitera la maintenance et assurera la cohérence
- Dev: Doit-on extraire absolument tous les textes, y compris les libellés techniques?
- Tech Lead: Oui, pour permettre une internationalisation complète, même les textes techniques doivent être traduits
- Dev: Comment gérer les messages avec des variables comme des nombres ou des noms?
- Tech Lead: Utiliser la fonctionnalité d'interpolation de Vue I18n avec une syntaxe cohérente
