# Epic-4: Internationalisation et Multilinguisme

Story-1: Implémentation de Vue I18n pour centraliser les messages

## Description de la Story

**En tant que** développeur du projet CV Generator
**Je veux** implémenter Vue I18n et centraliser tous les messages du système
**afin de** faciliter la maintenance des textes, préparer l'application pour le multilinguisme et assurer la cohérence des messages à travers toutes les couches architecturales

## Statut

Draft

## Contexte

Cette Story fait partie de l'Epic-4 qui vise à internationaliser notre application CV Generator. Actuellement, l'application contient de nombreux messages d'erreur et textes d'interface codés en dur dans différentes couches (UI, application, domaine) comme observé dans le processus de validation d'email documenté dans `email-validation-flow.md`.

Les messages sont actuellement dispersés dans:

- Value Objects du domaine (ex: `"Format email invalide"` dans `email.value-object.ts`)
- Entités (ex: `"L'email est requis"` dans `Basics.ts`)
- Composants Vue (textes, placeholders dans `BasicsForm.vue`)
- Composables (ex: messages dans `useBasicsFormValidation.ts`)

Nous avons déjà une structure de codes d'erreur centralisée dans `@cv-generator/shared/src/constants/error-codes.const.ts` qui peut servir de base pour notre structure de clés de traduction.

## Estimation

Story Points: 5

## Critères d'Acceptation

1. Étant donné l'architecture Clean/DDD existante, quand nous utilisons Vue I18n, alors nous devons respecter les principes de séparation des préoccupations et les règles de dépendance de Clean Architecture
2. Étant donné des messages codés en dur dans les Value Objects du domaine, quand nous les remplaçons par des clés, alors le domaine ne doit pas dépendre de l'UI ou des frameworks externes
3. Étant donné la structure des codes d'erreur existante dans `error-codes.const.ts`, quand nous ajoutons des clés de traduction, alors elles doivent suivre la même structure hiérarchique
4. Étant donné différentes langues configurées (FR, EN), quand l'utilisateur change de langue, alors tous les messages du système (y compris les erreurs de validation) doivent être traduits
5. Étant donné des messages d'erreur provenant de différentes couches, quand une erreur est affichée dans l'UI, alors la source de l'erreur (domaine, application, UI) doit être transparente pour l'utilisateur
6. Étant donné la nécessité de paramètres dans certains messages, quand un message contient des variables, alors nous devons pouvoir les interpoler dans toutes les couches
7. Étant donné les composables existants comme `useValidationCatalogue` et `useValidationResult`, quand ces composables sont utilisés, alors ils doivent fonctionner avec le système i18n sans modifications majeures de leur API

## Tâches

1. - [ ] Préparation de l'architecture i18n

   1. - [ ] Définir la structure des packages i18n dans le monorepo
   2. - [ ] Configurer le plugin Vue I18n dans le projet UI
   3. - [ ] Créer une interface "port" pour l'i18n dans le domaine
   4. - [ ] Implémenter l'adaptateur Vue I18n pour le UI
   5. - [ ] Implémenter un adaptateur "fallback" pour le domaine (tests unitaires)

2. - [ ] Centralisation des messages

   1. - [ ] Créer la structure des clés de traduction dans `@cv-generator/shared/src/i18n/keys`
   2. - [ ] Extraire tous les textes en dur des composants UI vers des fichiers de traduction
   3. - [ ] Extraire tous les messages d'erreur des Value Objects et Entities vers des constantes de clés
   4. - [ ] Adapter `useValidationCatalogue` pour utiliser les clés i18n

3. - [ ] Adaptation des composants/services existants

   1. - [ ] Modifier les Value Objects pour utiliser les clés plutôt que des textes en dur
   2. - [ ] Adapter les services d'application pour injecter l'adaptateur i18n
   3. - [ ] Mettre à jour les composants Vue pour utiliser le plugin i18n
   4. - [ ] Adapter `useValidationResult` pour fonctionner avec les messages traduits

4. - [ ] Fonctionnalités i18n et UX

   1. - [ ] Implémenter un sélecteur de langue dans l'UI
   2. - [ ] Ajouter la détection automatique de la langue du navigateur
   3. - [ ] Persister la préférence linguistique de l'utilisateur
   4. - [ ] Créer un composant de changement de langue accessible globalement

5. - [ ] Tests et validation
   1. - [ ] Écrire des tests pour valider le fonctionnement des traductions dans chaque couche
   2. - [ ] Vérifier la couverture de tous les textes de l'application
   3. - [ ] Tester les scénarios de changement de langue
   4. - [ ] Valider que les adaptateurs fonctionnent correctement

## Principes de Développement

#### Principes à Suivre

- **Clean Architecture**: Respecter strictement les règles de dépendance (le domaine ne doit pas dépendre de l'UI)
- **Pattern Adapter**: Utiliser le pattern adaptateur pour isoler le domaine de l'implémentation i18n
- **DRY**: Centraliser les clés de traduction pour éviter la duplication
- **Maintenabilité**: Organiser les traductions de manière hiérarchique pour faciliter la maintenance
- **Type Safety**: Assurer la sécurité de type pour les clés de traduction

#### À Éviter

- L'introduction de dépendances directes à Vue I18n dans le domaine
- La duplication des messages entre les couches
- Le mélange des responsabilités (ex: logique de validation et affichage des messages)
- Des clés de traduction non structurées ou difficiles à maintenir
- La modification des signatures des fonctions/méthodes existantes quand possible

## Risques et Hypothèses

| Risque                                       | Probabilité | Impact | Mitigation                                                                  |
| -------------------------------------------- | ----------- | ------ | --------------------------------------------------------------------------- |
| Violation des principes Clean Architecture   | Moyenne     | Élevé  | Utiliser le pattern adaptateur pour isoler le domaine                       |
| Incohérence des messages entre couches       | Élevée      | Moyen  | Centraliser les clés dans shared et assurer une synchronisation             |
| Performance des traductions                  | Faible      | Moyen  | Utiliser le lazy loading des fichiers de traduction                         |
| Maintenance des traductions                  | Moyenne     | Élevé  | Structurer hiérarchiquement et utiliser des outils d'extraction automatique |
| Compatibilité avec les composables existants | Moyenne     | Élevé  | Création de tests unitaires et préservation des API publiques               |

## Notes de Développement

### Structure proposée des packages

```
packages/
├── core/ (domaine)
│   └── src/
│       └── shared/
│           └── i18n/
│               └── domain-i18n.port.ts
├── shared/
│   └── src/
│       ├── constants/
│       │   └── error-codes.const.ts (existant)
│       └── i18n/
│           ├── keys/
│           │   ├── validation-keys.ts
│           │   ├── ui-keys.ts
│           │   └── index.ts
│           └── constants/
│               └── supported-locales.ts
├── ui/
│   └── src/
│       ├── i18n/
│       │   ├── vue-i18n-adapter.ts
│       │   ├── index.ts
│       │   └── setup.ts
│       └── locales/
│           ├── fr/
│           │   ├── validation.json
│           │   ├── ui.json
│           │   └── index.json
│           └── en/
│               ├── validation.json
│               ├── ui.json
│               └── index.json
```

### Exemple d'interface port i18n dans le domaine

```typescript
// packages/core/src/shared/i18n/domain-i18n.port.ts
export interface DomainI18nPortInterface {
  translate(key: string, params?: Record<string, any>): string;
  exists(key: string): boolean;
}
```

### Exemple d'extension de ValidationErrorInterface

```typescript
// Extended ValidationErrorInterface
export interface I18nValidationErrorInterface extends ValidationErrorInterface {
  /* Clé de traduction au lieu d'un message direct */
  i18nKey?: string;

  /* Paramètres pour l'interpolation */
  i18nParams?: Record<string, any>;
}
```

### Exemple d'usage dans Email Value Object

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
    message: this.i18n.translate(
      I18N_KEYS.VALIDATION.RESUME.BASICS.EMAIL.INVALID
    ),
    i18nKey: I18N_KEYS.VALIDATION.RESUME.BASICS.EMAIL.INVALID,
    field: "email",
    severity: "error",
    layer: ValidationLayerType.DOMAIN,
  },
]);
```

### Exemple d'adaptateur Vue I18n

```typescript
// packages/ui/src/i18n/vue-i18n-adapter.ts
import { DomainI18nPort } from "@cv-generator/core";
import { useI18n } from "vue-i18n";

export class VueI18nAdapter implements DomainI18nPort {
  constructor() {
    this.i18n = useI18n();
  }

  translate(key: string, params?: Record<string, any>): string {
    return this.i18n.t(key, params || {});
  }

  exists(key: string): boolean {
    return this.i18n.te(key);
  }
}
```

## Journal de Communication

- Équipe: Nous avons identifié de nombreux messages codés en dur dans toutes les couches de l'application
- Tech Lead: L'intégration de Vue I18n doit respecter les principes Clean Architecture
- Dev: Comment gérer les messages dans le domaine sans créer une dépendance à Vue?
- Tech Lead: Nous devrons utiliser le pattern adaptateur et centraliser les clés dans shared
- Dev: Que faire des composables spécialisés comme useValidationCatalogue?
- Tech Lead: Les adapter pour qu'ils fonctionnent avec i18n mais préserver leur API
- Dev: Comment gérer les tests unitaires du domaine qui n'auront pas accès à Vue I18n?
- Tech Lead: Créer un adaptateur "mock" ou "fallback" pour les tests
