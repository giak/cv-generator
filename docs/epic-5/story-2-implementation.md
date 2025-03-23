# Documentation Technique: Implémentation de l'Internationalisation dans CV Generator

## Contexte de la Story

Hmm, je dois examiner la story Epic-5 / Story-2 sur la centralisation des clés de traduction et des messages. Cette story visait à extraire tous les textes en dur de l'application pour les remplacer par un système centralisé de clés de traduction, facilitant ainsi la maintenance et l'internationalisation.

Regardons les détails de cette story pour comprendre le contexte complet...

La story concerne la centralisation des clés de traduction et messages dans le système CV Generator. L'objectif principal était d'extraire tous les textes codés en dur dans différentes couches de l'application pour les remplacer par des clés de traduction structurées et centralisées.

## Historique d'Implémentation et Problèmes Rencontrés

En analysant notre historique de chat, je vois que nous avons rencontré et résolu un problème spécifique d'incohérence dans les conventions de nommage des clés de traduction. Voici ce qui s'est passé:

1. Nous avons commencé par rencontrer des erreurs dans les logs:

   ```
   [intlify] Not found 'resume.basics.helpText.name' key in 'en' locale messages.
   Missing translation key: resume.basics.helpText.name, using fallback
   ```

2. L'analyse a révélé une incohérence entre:

   - Les propriétés dans le fichier TypeScript (`HELP_TEXT` en majuscules)
   - Les chaînes de chemin dans ces propriétés
   - Les clés dans les fichiers JSON de traduction

3. Nous avons identifié que le problème venait d'une cascade de modifications:

   - La propriété dans TypeScript avait été renommée de `helpText` à `HELP_TEXT` (majuscules)
   - Les chaînes de chemin avaient été mises à jour pour utiliser `HELP_TEXT`
   - Les fichiers JSON avaient également été modifiés pour utiliser `HELP_TEXT`
   - Cependant, Vue i18n cherchait toujours les clés avec `helpText` en minuscules

4. La solution impliquait de rétablir la cohérence en:
   - Gardant la propriété TypeScript en majuscules (`HELP_TEXT`)
   - Mais en utilisant `helpText` en minuscules dans les chaînes de chemin
   - Et en revenant à `helpText` en minuscules dans les fichiers JSON

## Guide Technique: Principes à Respecter pour les Clés de Traduction

Voici un guide détaillé pour l'implémentation correcte des clés de traduction dans le projet CV Generator, basé sur les leçons apprises.

### 1. Structure des Clés de Traduction

#### 1.1 Organisation Hiérarchique des Clés

Les clés de traduction sont organisées de manière hiérarchique selon les domaines fonctionnels:

```typescript
export const TRANSLATION_KEYS = {
  COMMON: {
    ERRORS: {
      /* ... */
    },
    ACTIONS: {
      /* ... */
    },
    LABELS: {
      /* ... */
    },
  },
  RESUME: {
    SECTIONS: {
      /* ... */
    },
    BASICS: {
      /* ... */
    },
    WORK: {
      /* ... */
    },
  },
  // ...
};
```

#### 1.2 Convention de Nommage des Propriétés

- Les **propriétés** dans l'objet TypeScript sont toujours en **MAJUSCULES_AVEC_UNDERSCORES**
- Exemple: `HELP_TEXT`, `PLACEHOLDERS`, `LABELS`

#### 1.3 Convention pour les Valeurs de Chemin

- Les **valeurs de chemin** utilisent la notation pointée en **camelCase**
- Exemple: `'resume.basics.helpText.name'`, `'common.errors.requiredField'`

```typescript
HELP_TEXT: {
  NAME: 'resume.basics.helpText.name',
  EMAIL: 'resume.basics.helpText.email',
  // ...autres clés
}
```

### 2. Structure des Fichiers JSON de Traduction

#### 2.1 Organisation des Fichiers JSON

Les fichiers JSON de traduction doivent refléter exactement la structure décrite dans les chaînes de chemin:

```json
{
  "resume": {
    "basics": {
      "helpText": {
        // Note: utiliser camelCase ici
        "name": "Your full name as it will appear on your resume.",
        "email": "Your professional email address."
      }
    }
  }
}
```

#### 2.2 Convention de Nommage dans les JSON

- Toutes les clés dans les fichiers JSON doivent être en **camelCase**
- Les valeurs doivent toujours être des chaînes de caractères (ou des objets contenant des chaînes)

### 3. Processus d'Ajout de Nouvelles Clés de Traduction

Voici la procédure exacte à suivre pour ajouter de nouvelles clés de traduction sans introduire d'erreurs:

#### Étape 1: Ajouter la Propriété TypeScript

```typescript
// packages/shared/src/i18n/keys/index.ts
export const TRANSLATION_KEYS = {
  // ...existing keys
  RESUME: {
    // ...existing sections
    NEW_SECTION: {
      LABELS: {
        TITLE: "resume.newSection.labels.title",
        DESCRIPTION: "resume.newSection.labels.description",
      },
    },
  },
};
```

#### Étape 2: Ajouter les Entrées dans les Fichiers JSON

```json
// packages/ui/src/i18n/locales/en.json
{
  "resume": {
    // ...existing sections
    "newSection": {
      "labels": {
        "title": "Section Title",
        "description": "Section Description"
      }
    }
  }
}

// Répéter pour fr.json avec les traductions françaises
```

#### Étape 3: Utiliser les Clés dans les Composants

```vue
<template>
  <h2>{{ $t(TRANSLATION_KEYS.RESUME.NEW_SECTION.LABELS.TITLE) }}</h2>
  <p>{{ $t(TRANSLATION_KEYS.RESUME.NEW_SECTION.LABELS.DESCRIPTION) }}</p>
</template>

<script setup lang="ts">
import { TRANSLATION_KEYS } from "@cv-generator/shared";
</script>
```

### 4. Liste de Vérification pour Éviter les Erreurs

Avant de commit, toujours vérifier les points suivants:

- [x] Les **propriétés** dans `TRANSLATION_KEYS` sont en **UPPERCASE_WITH_UNDERSCORES**
- [x] Les **valeurs de chemin** dans `TRANSLATION_KEYS` sont en **camelCase** avec notation pointée
- [x] Les **clés JSON** dans les fichiers de traduction sont en **camelCase**
- [x] La structure des objets JSON correspond **exactement** aux chemins définis
- [x] Les traductions existent pour **toutes les langues supportées**
- [x] Les clés sont référencées correctement dans les composants sans typos

### 5. Bonnes Pratiques de Dépannage

Si des erreurs de traduction apparaissent:

1. Vérifier la console pour les messages d'erreur exacts:

   ```
   [intlify] Not found 'key.path' key in 'en' locale messages.
   ```

2. Comparer la clé manquante avec:

   - La définition dans `TRANSLATION_KEYS`
   - La structure dans les fichiers JSON

3. Vérifier la casse (minuscules/majuscules) à chaque niveau

4. Utiliser la fonction `safeTranslate` avec un fallback dans les cas critiques:
   ```typescript
   const safeTranslate = (
     key: string,
     fallback: string = "Translation missing"
   ) => {
     try {
       const result = t(key);
       // Si la clé est retournée telle quelle, c'est qu'elle n'existe pas
       if (result === key) {
         console.warn(`Missing translation key: ${key}, using fallback`);
         return fallback;
       }
       return result;
     } catch (error) {
       console.error(`Error translating key: ${key}`, error);
       return fallback;
     }
   };
   ```

## Plan d'Application à d'Autres Composants

Pour appliquer ces principes à d'autres composants de l'application, suivez ces étapes:

### 1. Analyse du Composant

1. Identifier tous les textes en dur dans le composant
2. Regrouper ces textes par catégorie fonctionnelle (labels, placeholders, help texts, etc.)
3. Déterminer la structure hiérarchique appropriée pour ces textes

### 2. Création des Clés de Traduction

1. Ajouter les nouvelles propriétés dans `TRANSLATION_KEYS` avec la convention UPPERCASE
2. Définir les valeurs de chemin en utilisant la convention camelCase
3. S'assurer que la structure hiérarchique est cohérente avec l'existant

### 3. Création des Traductions

1. Ajouter les entrées correspondantes dans `en.json` et `fr.json`
2. Utiliser exactement la même structure que celle définie dans les chemins
3. Utiliser la convention camelCase pour toutes les clés JSON

### 4. Remplacement dans le Composant

1. Importer `TRANSLATION_KEYS` from '@cv-generator/shared'
2. Remplacer tous les textes en dur par des appels à `$t(TRANSLATION_KEYS.PATH.TO.KEY)`
3. Utiliser `safeTranslate` pour les cas où un fallback est nécessaire

### 5. Test de Validation

1. Vérifier l'absence d'erreurs dans la console
2. Tester le composant avec les différentes langues supportées
3. Vérifier que tous les textes sont correctement traduits

## Vérification de la Logique

Notre approche garantit:

1. ✅ **Cohérence** dans les conventions de nommage
2. ✅ **Type Safety** grâce à la centralisation des clés dans TypeScript
3. ✅ **Maintenabilité** avec une structure hiérarchique claire
4. ✅ **Robustesse** avec la fonction safeTranslate pour les cas d'erreur
5. ✅ **Compatibilité** avec le fonctionnement interne de Vue i18n

Cette approche respecte le principe DRY (Don't Repeat Yourself) tout en maintenant une séparation claire des préoccupations: structure des clés, définition des traductions, et utilisation dans les composants.

## Conclusion

L'implémentation de l'internationalisation dans le projet CV Generator suit maintenant des principes clairs et cohérents. En respectant strictement les conventions définies dans ce document, nous pouvons éviter les erreurs de traduction et assurer une expérience utilisateur fluide dans toutes les langues supportées.

Cette documentation servira de référence pour toutes les futures implémentations et modifications liées à l'internationalisation dans le projet.

## Analyse des Composants Restants à Internationaliser

Suite à l'implémentation réussie de l'internationalisation dans le composant `BasicsForm.vue`, nous avons identifié plusieurs autres composants de formulaire qui nécessitent des modifications similaires. L'analyse a révélé que ces composants contiennent également des textes codés en dur qui doivent être remplacés par des références aux clés de traduction.

### Composants Identifiés

Voici la liste des composants qui nécessitent une internationalisation:

1. **WorkForm.vue**

   - Contient des textes codés en dur comme "Ex: Acme Inc.", "Nom de l'entreprise ou de l'organisation", etc.
   - Ne référence pas les clés de traduction centralisées

2. **SkillForm.vue**

   - Contient des messages d'erreur codés en dur comme "Le mot-clé ne peut pas être vide"
   - N'utilise pas le système de traduction pour les labels et placeholders

3. **EducationForm.vue**
4. **ProjectForm.vue**
5. **PublicationForm.vue**
6. **LanguageForm.vue**
7. **InterestForm.vue**
8. **AwardForm.vue**
9. **CertificateForm.vue**
10. **ReferenceForm.vue**
11. **VolunteerForm.vue**

Et leurs composants List correspondants:

12. **WorkList.vue**
13. **SkillList.vue**
14. **EducationList.vue**
15. **ProjectList.vue**
16. **PublicationList.vue**
17. **LanguageList.vue**
18. **InterestList.vue**
19. **AwardList.vue**
20. **CertificateList.vue**
21. **ReferenceList.vue**
22. **VolunteerList.vue**

### Plan d'Action

Pour chaque composant listé ci-dessus, les actions suivantes doivent être entreprises:

1. **Extension des Clés de Traduction**

   - Ajouter les nouvelles sections dans `TRANSLATION_KEYS` pour chaque type de formulaire
   - Suivre la structure existante (LABELS, PLACEHOLDERS, HELP_TEXT, etc.)
   - Maintenir la cohérence avec les conventions de nommage établies

2. **Ajout des Traductions**

   - Ajouter les entrées correspondantes dans `en.json` et `fr.json`
   - Assurer la cohérence entre les deux fichiers de langue
   - Utiliser systématiquement la convention camelCase pour les clés JSON

3. **Modification des Composants**

   - Importer `TRANSLATION_KEYS` depuis '@cv-generator/shared'
   - Remplacer les textes en dur par des appels à `$t(TRANSLATION_KEYS.PATH.TO.KEY)`
   - Utiliser `safeTranslate` pour les cas où un fallback est nécessaire
   - Ajouter la déclaration useI18n dans les composants

4. **Vérification**
   - Tester chaque composant après modification
   - Vérifier l'absence d'erreurs de console
   - S'assurer que tous les textes sont affichés correctement dans les deux langues

### Exemples de Modifications Requises pour WorkForm.vue

Voici un exemple concret des modifications à apporter au composant WorkForm.vue:

#### 1. Ajout des Clés de Traduction

```typescript
// Dans packages/shared/src/i18n/keys/index.ts
WORK: {
  LABELS: {
    COMPANY: 'resume.work.labels.company',
    POSITION: 'resume.work.labels.position',
    WEBSITE: 'resume.work.labels.website',
    START_DATE: 'resume.work.labels.startDate',
    END_DATE: 'resume.work.labels.endDate',
    CURRENT_POSITION: 'resume.work.labels.currentPosition',
    SUMMARY: 'resume.work.labels.summary',
    HIGHLIGHTS: 'resume.work.labels.highlights'
  },
  HELP_TEXT: {
    COMPANY: 'resume.work.helpText.company',
    POSITION: 'resume.work.helpText.position',
    WEBSITE: 'resume.work.helpText.website',
    START_DATE: 'resume.work.helpText.startDate',
    END_DATE: 'resume.work.helpText.endDate',
    SUMMARY: 'resume.work.helpText.summary',
    HIGHLIGHTS: 'resume.work.helpText.highlights'
  },
  PLACEHOLDERS: {
    COMPANY: 'resume.work.placeholders.company',
    POSITION: 'resume.work.placeholders.position',
    WEBSITE: 'resume.work.placeholders.website',
    START_DATE: 'resume.work.placeholders.startDate',
    END_DATE: 'resume.work.placeholders.endDate',
    SUMMARY: 'resume.work.placeholders.summary',
    HIGHLIGHT: 'resume.work.placeholders.highlight'
  },
  ERRORS: {
    EMPTY_HIGHLIGHT: 'resume.work.errors.emptyHighlight'
  }
}
```

#### 2. Ajout des Traductions (pour en.json)

```json
"work": {
  "labels": {
    "company": "Company",
    "position": "Position",
    "website": "Company Website",
    "startDate": "Start Date",
    "endDate": "End Date",
    "currentPosition": "Current Position",
    "summary": "Summary",
    "highlights": "Highlights"
  },
  "helpText": {
    "company": "Name of the company or organization.",
    "position": "Your job title at this company.",
    "website": "Company's website URL.",
    "startDate": "Format: YYYY-MM-DD (ex: 2020-01-15)",
    "endDate": "Leave empty if this is your current job.",
    "summary": "Brief description of your role and responsibilities.",
    "highlights": "Key achievements or responsibilities in this role."
  },
  "placeholders": {
    "company": "Ex: Acme Inc.",
    "position": "Ex: Full Stack Developer",
    "website": "Ex: https://acme.com",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "summary": "Describe your role and responsibilities...",
    "highlight": "Add a key achievement or responsibility"
  },
  "errors": {
    "emptyHighlight": "Highlight cannot be empty"
  }
}
```

#### 3. Modification du Composant

```vue
<script setup lang="ts">
import type { WorkInterface } from "@cv-generator/shared/src/types/resume.interface";
import Form from "@ui/components/shared/form/Form.vue";
import FormField from "@ui/components/shared/form/FormField.vue";
import DateRangeFields from "@ui/components/shared/form/DateRangeFields.vue";
import { useFormModel } from "@ui/modules/cv/presentation/composables/useFormModel";
import { useValidation } from "@ui/modules/cv/presentation/composables/useValidation";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { TRANSLATION_KEYS } from "@cv-generator/shared";

// Initialize i18n
const { t } = useI18n();

// Fonction pour gérer les erreurs de traduction
const safeTranslate = (
  key: string,
  fallback: string = "Translation missing"
) => {
  try {
    const result = t(key);
    if (result === key) {
      console.warn(`Missing translation key: ${key}, using fallback`);
      return fallback;
    }
    return result;
  } catch (error) {
    console.error(`Error translating key: ${key}`, error);
    return fallback;
  }
};

// Reste du code...
</script>

<template>
  <!-- Exemple de modification dans le template -->
  <FormField
    name="name"
    :label="t(TRANSLATION_KEYS.WORK.LABELS.COMPANY)"
    :model-value="localModel.name"
    :error="errors.name"
    :icon="icons.name"
    :placeholder="t(TRANSLATION_KEYS.WORK.PLACEHOLDERS.COMPANY)"
    :help-text="t(TRANSLATION_KEYS.WORK.HELP_TEXT.COMPANY)"
    required
    @update:model-value="(value) => updateField('name', value)"
    @blur="validateField('name', localModel.name)"
  />
  <!-- Autres modifications similaires... -->
</template>
```

### Priorités et Estimation

Ces modifications devraient être appliquées en suivant un ordre de priorité basé sur l'utilisation des composants:

1. **Haute priorité**: WorkForm/List, EducationForm/List, SkillForm/List
2. **Priorité moyenne**: ProjectForm/List, LanguageForm/List
3. **Basse priorité**: Autres composants (Publication, Award, etc.)

Estimation du temps nécessaire:

- 1 heure par composant Form
- 30 minutes par composant List
- Total: environ 33 heures de travail

### Risques Potentiels

1. **Incohérence entre composants**: Si certains composants sont mis à jour et d'autres non, cela peut créer une expérience utilisateur incohérente.
2. **Oubli de textes**: Certains textes dynamiques ou conditionnels pourraient être oubliés lors de l'extraction.
3. **Conflits de fusion**: Si plusieurs développeurs travaillent simultanément sur différents composants, des conflits de fusion pourraient survenir.

Ces risques peuvent être atténués par:

- Une approche systématique et documentée
- Des revues de code rigoureuses
- Une coordination étroite entre les développeurs

## Internationalisation des Entités et Value Objects du Domaine

En complément de l'internationalisation des composants de l'interface utilisateur, nous avons également entrepris l'extraction et la centralisation des messages en dur présents dans les entités et value objects du domaine. Cette étape était cruciale pour assurer la cohérence des messages d'erreur à travers toute l'application.

### Approche Adoptée

Pour les entités et value objects du domaine, nous avons suivi une approche légèrement différente de celle utilisée pour les composants UI, mais qui respecte les mêmes principes de base:

1. **Centralisation des clés**: Toutes les clés de traduction sont définies dans `TRANSLATION_KEYS` dans le package shared.
2. **Classes d'adaptateurs i18n**: Pour chaque entité ou value object, nous avons créé une classe adaptateur implémentant l'interface `DomainI18nPortInterface`.
3. **Valeurs par défaut**: Chaque adaptateur contient des valeurs par défaut pour garantir la compatibilité avec le code existant, même en l'absence de traductions.
4. **Injection de dépendance**: L'interface i18n est injectée dans les constructeurs des entités, permettant de passer différentes implémentations selon le contexte.

### Entités et Value Objects Mis à Jour

Nous avons appliqué cette approche aux composants suivants du domaine:

1. **Value Objects**:

   - `url.value-object.ts`: Validation d'URL (messsages pour URL manquante, invalide, non sécurisée, etc.)
   - `date-range.value-object.ts`: Validation de plages de dates (messages pour dates manquantes, invalides, incohérentes, etc.)
   - `work-date.value-object.ts`: Validation de dates professionnelles (format, cohérence, etc.)
   - `email.value-object.ts`: Validation d'email (messages pour email manquant, invalide, etc.)
   - `phone.value-object.ts`: Validation de numéros de téléphone (format, longueur, etc.)

2. **Entités**:
   - `Work.ts`: Validation des expériences professionnelles (entreprise, poste, dates, etc.)
   - `Resume.ts`: Validation des CV complets (données de base, expériences, formation, etc.)

### Structure Type d'une Mise à Jour

Voici la structure type que nous avons suivie pour chaque entité ou value object:

1. **Déclaration des clés de traduction**:

   ```typescript
   export const WORK_VALIDATION_KEYS = {
     MISSING_COMPANY: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.MISSING_COMPANY,
     MISSING_POSITION: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.MISSING_POSITION,
     // ...autres clés de validation
   };
   ```

2. **Création d'un adaptateur i18n par défaut**:

   ```typescript
   export class DefaultWorkI18nAdapter implements DomainI18nPortInterface {
     translate(key: string, _params?: Record<string, unknown>): string {
       const defaultMessages: Record<string, string> = {
         [WORK_VALIDATION_KEYS.MISSING_COMPANY]:
           "Le nom de l'entreprise est requis",
         // ...autres messages par défaut
       };
       return defaultMessages[key] || key;
     }
     exists(_key: string): boolean {
       return true;
     }
   }
   ```

3. **Modification des constructeurs pour accepter l'adaptateur i18n**:

   ```typescript
   private constructor(
     // ...autres propriétés
     private readonly _i18n: DomainI18nPortInterface
   ) {}
   ```

4. **Mise à jour des méthodes factory pour utiliser les clés de traduction**:
   ```typescript
   static create(
     data: Partial<WorkInterface>,
     i18n: DomainI18nPortInterface = defaultI18nAdapter
   ): WorkValidationResultType {
     const errors: string[] = []
     if (!data.name || data.name.trim().length === 0) {
       errors.push(i18n.translate(WORK_VALIDATION_KEYS.MISSING_COMPANY))
     }
     // ...autres validations
   }
   ```

### Avantages de cette Approche

1. **Cohérence des messages**: Les mêmes messages d'erreur sont utilisés peu importe où ils sont générés (UI ou domaine).
2. **Maintenabilité améliorée**: Toutes les clés sont centralisées, facilitant les modifications.
3. **Flexibilité**: L'injection de dépendance permet d'utiliser différentes implémentations selon le contexte (tests, UI, API, etc.).
4. **Compatibilité**: L'approche maintient la compatibilité avec le code existant grâce aux valeurs par défaut.

### Impact sur les Tests

Les tests ont été mis à jour pour inclure l'adaptateur i18n par défaut lorsque nécessaire, assurant ainsi que les validations continuent de fonctionner comme prévu.

### Prochaines Étapes

Avec cette mise à jour, toutes les entités et value objects du domaine utilisent désormais le système centralisé de clés de traduction. Pour compléter l'internationalisation complète de l'application, les étapes restantes sont:

1. Finaliser la mise à jour des composants UI comme décrit précédemment
2. Mettre à jour les messages d'erreur de l'API
3. Créer un mécanisme pour synchroniser les traductions entre le frontend et le backend
