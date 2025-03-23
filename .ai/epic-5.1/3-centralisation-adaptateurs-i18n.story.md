# Epic-5: Amélioration de l'Architecture

Story-3: Centralisation des adaptateurs i18n

## Description de la Story

**En tant qu'** équipe de développement du CV Generator  
**Je veux** centraliser les adaptateurs d'internationalisation (i18n)  
**afin de** éliminer la duplication et assurer une gestion cohérente des traductions dans toute l'application

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-5 visant à améliorer l'architecture de l'application avant l'implémentation de l'Epic-6 (Export et sauvegarde du CV). L'analyse du code a révélé que chaque classe de domaine définit son propre adaptateur i18n par défaut, entraînant :

1. Duplication significative de code entre les classes
2. Risque d'incohérence dans les messages par défaut
3. Difficultés de maintenance lors de l'ajout ou la modification de traductions
4. Définitions redondantes des clés de traduction dans différents fichiers

La centralisation des adaptateurs i18n permettra d'éliminer cette duplication, d'assurer une gestion cohérente des traductions, et de simplifier l'internationalisation des nouvelles fonctionnalités à venir.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. Étant donné plusieurs classes de domaine, quand elles sont refactorisées, alors elles utilisent un adaptateur i18n centralisé au lieu d'adaptateurs locaux
2. Étant donné des clés de traduction définies dans plusieurs fichiers, quand le code est refactorisé, alors ces clés sont centralisées dans un seul module
3. Étant donné une classe de domaine utilisant i18n, quand elle est instanciée, alors elle utilise l'adaptateur par défaut sans duplication de messages
4. Étant donné un nouveau message à traduire, quand il est ajouté, alors il n'est défini qu'une seule fois dans un emplacement centralisé
5. Étant donné l'adaptateur i18n centralisé, quand le projet est compilé, alors il est accessible par tous les packages sans duplication

## Tâches

1. - [ ] Analyser l'utilisation actuelle des adaptateurs i18n
   1. - [ ] Recenser toutes les classes avec leurs propres adaptateurs
   2. - [ ] Identifier les messages et clés dupliqués
   3. - [ ] Déterminer les patterns d'utilisation communs
2. - [ ] Créer un module centralisé pour les adaptateurs i18n
   1. - [ ] Définir l'interface DomainI18nPortInterface dans un endroit central
   2. - [ ] Implémenter l'adaptateur par défaut comme singleton réutilisable
   3. - [ ] Centraliser les messages par défaut dans un seul fichier
3. - [ ] Centraliser les clés de traduction
   1. - [ ] Regrouper toutes les clés dans des fichiers organisés par domaine
   2. - [ ] Standardiser le format des clés
   3. - [ ] Documenter la structure des clés
4. - [ ] Refactoriser les classes existantes
   1. - [ ] Mettre à jour les imports pour utiliser l'adaptateur centralisé
   2. - [ ] Remplacer les adaptateurs locaux par l'instance partagée
   3. - [ ] Vérifier que les traductions fonctionnent correctement
5. - [ ] Mettre à jour les tests
   1. - [ ] Adapter les tests unitaires pour les classes refactorisées
   2. - [ ] Ajouter des tests pour l'adaptateur centralisé
   3. - [ ] Vérifier que tous les tests passent

## Principes de Développement

#### Principes à Suivre

- **DRY (Don't Repeat Yourself)**: Éliminer la duplication de code et de messages
- **Singleton**: Utiliser un pattern singleton pour l'adaptateur par défaut
- **Séparation des préoccupations**: Séparer les clés de traduction de leur utilisation
- **Cohérence**: Maintenir un format cohérent pour toutes les clés et messages
- **Extensibilité**: Faciliter l'ajout de nouvelles traductions

#### À Éviter

- Duplication des messages par défaut dans différentes classes
- Définition de nouvelles clés en dehors des fichiers centralisés
- Implémentations divergentes de l'interface DomainI18nPortInterface
- Couplage fort entre les messages et les classes qui les utilisent

## Risques et Hypothèses

| Risque                                                  | Probabilité | Impact | Stratégie de mitigation                              |
| ------------------------------------------------------- | ----------- | ------ | ---------------------------------------------------- |
| Modifications de la logique de traduction existante     | Moyenne     | Moyen  | Tests exhaustifs, vérification manuelle des messages |
| Impact sur la performance avec singleton centralisé     | Faible      | Faible | Benchmarking, optimisation si nécessaire             |
| Renommage des clés affectant les traductions existantes | Moyenne     | Moyen  | Mapping des anciennes clés vers les nouvelles        |
| Résistance au changement                                | Faible      | Faible | Documentation claire, démonstration des bénéfices    |

## Notes de Développement

### Implémentation de l'adaptateur i18n centralisé

```typescript
// packages/core/src/shared/i18n/adapters/default-i18n.adapter.ts

import { DomainI18nPortInterface } from "../domain-i18n.port";
import { DEFAULT_MESSAGES } from "./default-messages";

/**
 * Adaptateur i18n par défaut pour le domaine
 * Implémentation singleton pour éviter la duplication
 */
export class DefaultI18nAdapter implements DomainI18nPortInterface {
  private static instance: DefaultI18nAdapter;

  private constructor() {}

  public static getInstance(): DefaultI18nAdapter {
    if (!DefaultI18nAdapter.instance) {
      DefaultI18nAdapter.instance = new DefaultI18nAdapter();
    }
    return DefaultI18nAdapter.instance;
  }

  translate(key: string, params?: Record<string, unknown>): string {
    // Utilisation des messages par défaut centralisés
    const message = DEFAULT_MESSAGES[key];

    if (!message) {
      return key;
    }

    // Remplacement des paramètres si présents
    if (params) {
      return Object.entries(params).reduce(
        (result, [param, value]) =>
          result.replace(`{{${param}}}`, String(value)),
        message
      );
    }

    return message;
  }

  exists(key: string): boolean {
    return key in DEFAULT_MESSAGES;
  }
}

// Exporter l'instance singleton pour utilisation dans l'application
export const defaultI18nAdapter = DefaultI18nAdapter.getInstance();
```

### Centralisation des messages par défaut

```typescript
// packages/core/src/shared/i18n/adapters/default-messages.ts

import { TRANSLATION_KEYS } from "@cv-generator/shared";

/**
 * Messages par défaut centralisés pour toutes les entités de domaine
 * Organisés par domaine pour maintenir la structure
 */
export const DEFAULT_MESSAGES: Record<string, string> = {
  // Clés communes
  [TRANSLATION_KEYS.COMMON.VALIDATION.MISSING_DATE]: "La date est requise",
  [TRANSLATION_KEYS.COMMON.VALIDATION.INVALID_DATE_FORMAT]:
    "La date doit être au format YYYY-MM-DD",
  [TRANSLATION_KEYS.COMMON.VALIDATION.INVALID_DATE]: "Date invalide",

  // Clés URL
  [TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_URL]: "L'URL est requise",
  [TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_URL]:
    "Format d'URL invalide",
  [TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INSECURE_URL]:
    "URL non sécurisée (HTTP)",
  [TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.TEMPORARY_DOMAIN]:
    "Domaine temporaire ou de test détecté",

  // Clés Work
  [TRANSLATION_KEYS.RESUME.WORK.VALIDATION.MISSING_COMPANY]:
    "Le nom de l'entreprise est requis",
  [TRANSLATION_KEYS.RESUME.WORK.VALIDATION.MISSING_POSITION]:
    "Le poste est requis",
  [TRANSLATION_KEYS.RESUME.WORK.VALIDATION.MISSING_START_DATE]:
    "La date de début est requise",
  [TRANSLATION_KEYS.RESUME.WORK.VALIDATION.INVALID_START_DATE]:
    "Date de début invalide",
  [TRANSLATION_KEYS.RESUME.WORK.VALIDATION.INVALID_END_DATE]:
    "Date de fin invalide",
  [TRANSLATION_KEYS.RESUME.WORK.VALIDATION.END_BEFORE_START]:
    "La date de fin doit être postérieure à la date de début",
  [TRANSLATION_KEYS.RESUME.WORK.VALIDATION.FUTURE_DATE]:
    "La date indiquée est dans le futur",

  // Autres domaines...
};
```

### Exemple de refactorisation de classe

```typescript
// Avant
export class Url {
  // Définition locale de l'adaptateur
  class DefaultI18nAdapter implements DomainI18nPortInterface {
    translate(key: string, _params?: Record<string, unknown>): string {
      const defaultMessages: Record<string, string> = {
        [URL_VALIDATION_KEYS.MISSING_URL]: "L'URL est requise",
        // Autres messages...
      };
      return defaultMessages[key] || key;
    }
    exists(_key: string): boolean {
      return true;
    }
  }

  // Instance locale
  const defaultI18nAdapter = new DefaultI18nAdapter();

  // Utilisation dans la classe
  public static create(
    url: string,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ResultType<Url> {
    // ...
  }
}

// Après
import { defaultI18nAdapter } from '../../../shared/i18n/adapters/default-i18n.adapter';

export class Url {
  // Utilisation de l'adaptateur centralisé
  public static create(
    url: string,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ResultType<Url> {
    // ...
  }
}
```

## Historique du Chat

**User:** Avant de se lancer dans l'EPIC 6, pourrais-tu analyser si l'application actuelle est robuste, stable et suffisamment bien conçue ? Il y a peut-être des améliorations à apporter.

**Assistant:** J'ai analysé le code et j'ai remarqué qu'il y a une duplication significative dans la gestion de l'internationalisation. Chaque classe de domaine comme `Url`, `DateRange` et `WorkDate` définit son propre adaptateur i18n avec des messages par défaut similaires. Cette approche crée de la redondance et augmente le risque d'incohérences.

**User:** Comment pourrions-nous améliorer cette situation ?

**Assistant:** Je recommande de centraliser les adaptateurs i18n dans un module partagé. Actuellement, chaque classe réimplémente la même logique et duplique les messages par défaut. En créant un adaptateur singleton centralisé et en regroupant tous les messages dans un seul fichier organisé, nous pourrions éliminer cette duplication et assurer une gestion cohérente des traductions.

**User:** Quels seraient les bénéfices de cette centralisation ?

**Assistant:** Les bénéfices seraient multiples : réduction de code dupliqué, maintenance simplifiée (un seul endroit à modifier pour les messages), cohérence garantie des traductions, et structure plus claire des clés de traduction. De plus, l'ajout de nouvelles traductions pour les fonctionnalités d'export serait beaucoup plus simple, car il n'y aurait pas besoin de créer de nouveaux adaptateurs pour chaque nouvelle classe.
