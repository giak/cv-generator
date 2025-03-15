# Guide de Référence pour l'Internationalisation

## Introduction

Ce guide fournit les conventions, patterns et meilleures pratiques pour maintenir et étendre l'internationalisation dans le projet CV Generator. Il est destiné aux développeurs qui doivent ajouter de nouvelles fonctionnalités nécessitant des textes traduits ou qui doivent modifier des composants existants.

## Structure des Traductions

### Organisation des Fichiers

Les fichiers de traduction sont centralisés dans le package `@cv-generator/shared` :

```
@cv-generator/shared/
├── src/
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── fr.json      # Traductions françaises
│   │   │   └── en.json      # Traductions anglaises
│   │   └── translation-keys.ts  # Constantes pour les chemins de traduction
```

### Clés de Traduction

Les clés de traduction sont définies dans `translation-keys.ts` sous forme de constantes. Exemple :

```typescript
export const TRANSLATION_KEYS = {
  CV: {
    FORMS: {
      COMMON: {
        BUTTONS: {
          SAVE: "cv.forms.common.buttons.save",
          CANCEL: "cv.forms.common.buttons.cancel",
        },
      },
      WORK: {
        TITLE: "cv.forms.work.title",
        COMPANY_LABEL: "cv.forms.work.companyLabel",
        // ...
      },
    },
  },
} as const;
```

## Ajouter une Nouvelle Clé de Traduction

### Étape 1 : Identifier le besoin

Avant d'ajouter une nouvelle clé, vérifiez si :

- Une clé existante peut être réutilisée (surtout pour les éléments communs comme "Enregistrer", "Annuler")
- La nouvelle clé s'inscrit dans une catégorie existante ou nécessite une nouvelle catégorie

### Étape 2 : Ajouter la définition de la clé

1. Ouvrez `translation-keys.ts`
2. Localisez la section appropriée ou créez-en une nouvelle
3. Ajoutez la nouvelle constante en respectant les conventions :
   - Noms de propriétés en MAJUSCULES pour les constantes
   - Chemins de traduction en camelCase
   - Structurez hiérarchiquement selon la fonctionnalité

Exemple d'ajout :

```typescript
export const TRANSLATION_KEYS = {
  CV: {
    FORMS: {
      // ... existing code ...
      NEW_FEATURE: {
        TITLE: "cv.forms.newFeature.title",
        DESCRIPTION: "cv.forms.newFeature.description",
      },
    },
  },
} as const;
```

### Étape 3 : Ajouter les traductions

1. Ouvrez `fr.json` et `en.json`
2. Ajoutez les traductions correspondantes en suivant exactement la même structure :

Dans `fr.json` :

```json
{
  "cv": {
    "forms": {
      "newFeature": {
        "title": "Nouvelle Fonctionnalité",
        "description": "Description de la nouvelle fonctionnalité"
      }
    }
  }
}
```

Dans `en.json` :

```json
{
  "cv": {
    "forms": {
      "newFeature": {
        "title": "New Feature",
        "description": "Description of the new feature"
      }
    }
  }
}
```

### Étape 4 : Utiliser la traduction dans les composants

```vue
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { TRANSLATION_KEYS } from "@cv-generator/shared";

const { t } = useI18n();

// Fonction de sécurité pour les traductions manquantes
function safeTranslate(key: string, fallback: string = ""): string {
  const translation = t(key);
  // Si la traduction est égale à la clé, c'est qu'elle n'existe pas
  return translation === key ? fallback : translation;
}
</script>

<template>
  <div>
    <h2>{{ t(TRANSLATION_KEYS.CV.FORMS.NEW_FEATURE.TITLE) }}</h2>
    <p>
      {{
        safeTranslate(
          TRANSLATION_KEYS.CV.FORMS.NEW_FEATURE.DESCRIPTION,
          "Texte de secours"
        )
      }}
    </p>
  </div>
</template>
```

## Meilleures Pratiques

### Sécurité des Traductions

Toujours utiliser la fonction `safeTranslate` pour gérer les cas où une traduction pourrait être manquante :

```typescript
function safeTranslate(key: string, fallback: string = ""): string {
  const translation = t(key);
  return translation === key ? fallback : translation;
}
```

### Tests d'Internationalisation

Pour chaque composant internationalisé, créez des tests vérifiant :

1. Le rendu correct dans chaque langue supportée
2. L'absence d'erreurs de console liées à l'internationalisation
3. Le comportement correct lors du changement dynamique de langue

Utilisez les utilitaires de test fournis :

- `testComponentInMultipleLanguages` : Vérifie le rendu dans les deux langues
- `testNoI18nConsoleErrors` : Détecte les erreurs de console liées à l'i18n
- `testDynamicLocaleChange` : Teste le changement dynamique de langue

Exemple :

```typescript
import { testComponentInMultipleLanguages } from "@ui/test-utils/language-testing";
import { testNoI18nConsoleErrors } from "@ui/test-utils/i18n-console-errors";
import MyComponent from "../MyComponent.vue";

describe("MyComponent i18n", () => {
  const textSelectors = {
    h2: {
      fr: "Titre en Français",
      en: "Title in English",
    },
    ".button": {
      fr: "Enregistrer",
      en: "Save",
    },
  };

  // Test du rendu dans les deux langues
  testComponentInMultipleLanguages(MyComponent, {}, textSelectors);

  // Test de l'absence d'erreurs de console
  testNoI18nConsoleErrors(MyComponent);
});
```

### Convention de Nommage

- **Clés de constantes** : UPPERCASE_WITH_UNDERSCORES
- **Chemins de traduction** : camelCase.avec.points
- **Propriétés JSON** : camelCase

### Organisation des Traductions

Organisez les traductions par domaine fonctionnel, puis par composant, puis par élément :

```
domain.component.element
```

Exemple :

```
cv.forms.work.companyLabel
cv.lists.skills.emptyState
```

## Résolution des Problèmes Courants

### Traduction Manquante

Si une traduction semble manquer :

1. Vérifiez que la clé existe dans `translation-keys.ts`
2. Vérifiez que les traductions existent dans `fr.json` et `en.json`
3. Assurez-vous que la structure hiérarchique est identique
4. Utilisez `safeTranslate` pour fournir un texte de repli

### Erreurs de Console

Les erreurs de console communes liées à l'i18n :

1. `[intlify] Not found ...` : La clé de traduction n'existe pas
2. `[vue-i18n] Cannot translate ...` : Problème avec le contexte de traduction
3. `t is not a function` : Le hook useI18n() n'est pas initialisé correctement

### Tests Échouant

Si les tests d'internationalisation échouent :

1. Vérifiez que le mock de i18n est correctement configuré
2. Assurez-vous que les sélecteurs CSS correspondent aux éléments rendus
3. Confirmez que les textes attendus correspondent exactement aux traductions
