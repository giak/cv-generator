# Epic-5: Amélioration de l'Architecture

Story-2: Unification des méthodes de validation avec Zod

## Description de la Story

**En tant qu'** équipe de développement du CV Generator  
**Je veux** unifier les méthodes de validation à travers l'application en utilisant Zod  
**afin d'** avoir une approche cohérente, typesafe et maintenable pour la validation des données

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-5 visant à améliorer l'architecture de l'application avant l'implémentation de l'Epic-6 (Export et sauvegarde du CV). L'analyse du code a révélé un mélange d'approches pour la validation des données :

1. Validation manuelle avec des conditions if/else (exemple dans `Url.create()`)
2. Validation avec Zod (exemple dans `DateRange`)
3. Validation avec des helpers personnalisés (exemple dans `Work.create()`)

Cette inconsistance rend le code difficile à maintenir et à étendre. Zod est déjà utilisé dans certaines parties de l'application, et offre une solution robuste et typesafe pour la validation des données. L'unification autour de Zod permettra d'avoir une approche cohérente qui facilitera l'implémentation des nouvelles fonctionnalités.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. Étant donné une classe de domaine avec validation, quand cette classe est refactorisée, alors elle utilise Zod pour sa validation
2. Étant donné les schémas Zod dans différentes classes, quand le projet est refactorisé, alors les schémas communs sont centralisés et réutilisés
3. Étant donné une erreur de validation Zod, quand cette erreur est retournée, alors elle est convertie au format ValidationErrorInterface standardisé
4. Étant donné une entité complexe, quand elle est validée, alors les validations imbriquées utilisent également Zod
5. Étant donné des validations similaires dans différentes classes, quand elles sont refactorisées, alors elles utilisent les mêmes schémas Zod réutilisables

## Tâches

1. - [ ] Analyser l'utilisation actuelle des méthodes de validation
   1. - [ ] Recenser toutes les classes avec validation manuelle
   2. - [ ] Identifier les schémas Zod existants
   3. - [ ] Identifier les validations communes à plusieurs classes
2. - [ ] Centraliser les schémas Zod communs
   1. - [ ] Créer un module pour les schémas Zod réutilisables
   2. - [ ] Implémenter les schémas pour les types courants (URL, email, date, etc.)
   3. - [ ] Documenter l'utilisation des schémas
3. - [ ] Créer un système standardisé de conversion d'erreurs
   1. - [ ] Implémenter une fonction de conversion Zod → ValidationErrorInterface
   2. - [ ] Ajouter la gestion des messages i18n dans les schémas
   3. - [ ] Tester avec différents types d'erreurs
4. - [ ] Migrer les validations manuelles vers Zod
   1. - [ ] Refactoriser la classe Url
   2. - [ ] Refactoriser la classe Work
   3. - [ ] Refactoriser les autres classes avec validation manuelle
5. - [ ] Mettre à jour les tests
   1. - [ ] Adapter les tests unitaires pour les classes refactorisées
   2. - [ ] Ajouter des tests pour les nouvelles fonctionnalités de validation
   3. - [ ] Vérifier que tous les tests passent

## Principes de Développement

#### Principes à Suivre

- **Cohérence**: Utiliser Zod de manière uniforme dans toute l'application
- **Réutilisation**: Créer des schémas modulaires et réutilisables
- **Typesafety**: Tirer parti du système de types de TypeScript avec Zod
- **Lisibilité**: Rendre les validations explicites et compréhensibles
- **Internationalisation**: Intégrer correctement l'i18n dans les messages d'erreur

#### À Éviter

- Introduction de nouvelles bibliothèques de validation
- Validation manuelle complexe dans le code
- Duplication des schémas de validation
- Perte de messages d'erreur personnalisés durant la migration

## Risques et Hypothèses

| Risque                                         | Probabilité | Impact | Stratégie de mitigation                         |
| ---------------------------------------------- | ----------- | ------ | ----------------------------------------------- |
| Modification du comportement des validations   | Moyenne     | Élevé  | Tests exhaustifs, migration progressive         |
| Complexité accrue pour des validations simples | Faible      | Moyen  | Créer des helpers simples pour les cas courants |
| Impact sur les performances                    | Faible      | Moyen  | Benchmarking, optimisation si nécessaire        |
| Résistance à l'adoption de Zod                 | Faible      | Faible | Formation et documentation claire               |

## Notes de Développement

### Centralisation des schémas Zod

```typescript
// packages/shared/src/validation/schemas.ts

import { z } from "zod";
import { defaultI18nAdapter } from "../i18n/adapters/default-i18n.adapter";
import { TRANSLATION_KEYS } from "../i18n/keys";

// Schéma URL réutilisable
export const createUrlSchema = (i18n = defaultI18nAdapter) =>
  z
    .string({
      required_error: i18n.translate(
        TRANSLATION_KEYS.COMMON.VALIDATION.MISSING_URL
      ),
    })
    .min(1, {
      message: i18n.translate(TRANSLATION_KEYS.COMMON.VALIDATION.MISSING_URL),
    })
    .refine(
      (url) => {
        if (!url) return false;

        // Normalisation de l'URL
        let normalizedUrl = url.trim();
        if (
          !normalizedUrl.startsWith("http://") &&
          !normalizedUrl.startsWith("https://")
        ) {
          normalizedUrl = "https://" + normalizedUrl;
        }

        try {
          const urlObj = new URL(normalizedUrl);
          return (
            urlObj.hostname.includes(".") &&
            !/[^a-zA-Z0-9.-]/.test(urlObj.hostname)
          );
        } catch (e) {
          return false;
        }
      },
      {
        message: i18n.translate(
          TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_URL
        ),
      }
    );

// Schéma Date réutilisable
export const createDateSchema = (i18n = defaultI18nAdapter) =>
  z
    .string({
      required_error: i18n.translate(
        TRANSLATION_KEYS.COMMON.VALIDATION.MISSING_DATE
      ),
    })
    .min(1, {
      message: i18n.translate(TRANSLATION_KEYS.COMMON.VALIDATION.MISSING_DATE),
    })
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
      message: i18n.translate(
        TRANSLATION_KEYS.COMMON.VALIDATION.INVALID_DATE_FORMAT
      ),
    })
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: i18n.translate(TRANSLATION_KEYS.COMMON.VALIDATION.INVALID_DATE),
    });

// Helper pour convertir les erreurs Zod en format standardisé
export function convertZodErrorsToValidationErrors(
  zodError: z.ZodError,
  layer: ValidationLayerType = ValidationLayerType.DOMAIN
): ValidationErrorInterface[] {
  return zodError.errors.map((err) => {
    const field = err.path.join(".") || "unknown";
    return {
      code: `invalid_${field}`, // Peut être amélioré avec une logique plus précise
      message: err.message,
      field,
      severity: "error",
      layer,
      i18nKey: err.message, // Peut être amélioré pour extraire la clé i18n originale
      suggestion: `Vérifiez la valeur de ${field}`,
    };
  });
}
```

### Exemple de refactorisation de Url avec Zod

```typescript
// packages/core/src/cv/domain/value-objects/url.value-object.ts

import { z } from 'zod';
import {
  ResultType,
  createSuccess,
  createFailure,
  createSuccessWithWarnings
} from '@cv-generator/shared';
import { createUrlSchema, convertZodErrorsToValidationErrors } from '@cv-generator/shared/validation/schemas';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';
import { defaultI18nAdapter } from '../../../shared/i18n/adapters/default-i18n.adapter';

// Reste de la classe...

public static create(
  url: string,
  i18n: DomainI18nPortInterface = defaultI18nAdapter
): ResultType<Url> {
  // Création du schéma Zod avec i18n
  const urlSchema = createUrlSchema(i18n);

  // Validation avec Zod
  const result = urlSchema.safeParse(url);

  if (!result.success) {
    return createFailure(convertZodErrorsToValidationErrors(result.error));
  }

  // Normalisation de l'URL
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  // Vérifications supplémentaires (warnings)
  const warnings = [];

  // Vérification HTTP vs HTTPS
  if (normalizedUrl.startsWith('http://')) {
    warnings.push({
      code: ERROR_CODES.COMMON.INVALID_FORMAT,
      message: i18n.translate(URL_VALIDATION_KEYS.INSECURE_URL),
      i18nKey: URL_VALIDATION_KEYS.INSECURE_URL,
      field: "url",
      severity: "warning",
      layer: ValidationLayerType.DOMAIN,
      suggestion: "Préférez une URL sécurisée (HTTPS) pour une meilleure sécurité"
    });
  }

  // Vérification domaines temporaires
  const domain = new URL(normalizedUrl).hostname;
  const temporaryDomains = ['example.com', 'test.com', 'localhost'];

  if (temporaryDomains.some(tempDomain => domain.includes(tempDomain)) && warnings.length === 0) {
    warnings.push({
      code: ERROR_CODES.COMMON.INVALID_FORMAT,
      message: i18n.translate(URL_VALIDATION_KEYS.TEMPORARY_DOMAIN),
      i18nKey: URL_VALIDATION_KEYS.TEMPORARY_DOMAIN,
      field: "url",
      severity: "warning",
      layer: ValidationLayerType.DOMAIN,
      suggestion: "Utilisez une URL définitive plutôt qu'une URL de test ou d'exemple"
    });
  }

  // Création de l'objet avec ou sans warnings
  if (warnings.length > 0) {
    return createSuccessWithWarnings(new Url(normalizedUrl, i18n), warnings);
  }

  return createSuccess(new Url(normalizedUrl, i18n));
}
```

## Historique du Chat

**User:** Avant de se lancer dans l'EPIC 6, pourrais-tu analyser si l'application actuelle est robuste, stable et suffisamment bien conçue ? Il y a peut-être des améliorations à apporter.

**Assistant:** J'ai analysé le code et j'ai remarqué que l'application utilise différentes approches pour la validation des données. Par exemple, `DateRange` utilise Zod pour la validation tandis que `Url` et d'autres classes utilisent des validations manuelles. Cette incohérence pourrait poser problème à l'avenir, notamment pour les fonctionnalités d'export qui nécessitent une validation robuste.

**User:** Peux-tu me donner plus de détails sur ces incohérences de validation ?

**Assistant:** Dans le code actuel, j'ai identifié trois approches de validation différentes : validation manuelle avec des if/else, validation avec Zod, et validation avec des méthodes personnalisées. Cette variété d'approches complique la maintenance et l'extension. Zod étant déjà présent dans le projet, standardiser autour de cette bibliothèque serait bénéfique pour la typesafety et la cohérence.

**User:** Est-ce qu'on pourrait standardiser sur Zod pour toutes les validations ?

**Assistant:** Tout à fait. Je recommande de créer des schémas Zod réutilisables pour les validations communes (URL, date, etc.), de centraliser ces schémas dans un module partagé, et de refactoriser progressivement les validations manuelles pour utiliser Zod. Cela améliorerait la cohérence du code et réduirait la duplication, tout en tirant parti des avantages de typesafety de Zod.
