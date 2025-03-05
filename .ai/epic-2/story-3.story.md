# Epic-2: Refactorisation des Composants CV

# Story-3: Extraction du Composable useValidation

## Story

**En tant que** développeur
**Je veux** extraire la logique de validation des formulaires dans un composable réutilisable
**afin de** standardiser la validation, réduire la duplication de code et améliorer la qualité des retours utilisateur

## Status

Completed ✅

## Context

Cette story fait partie de l'Epic-2 qui vise à refactoriser les composants du module CV. L'analyse des composants existants a révélé une duplication importante de code liée à la validation des formulaires dans tous les composants Form (BasicsForm, WorkForm, EducationForm, etc.).

Actuellement, chaque formulaire :

- Implémente sa propre logique de validation
- Gère ses propres messages d'erreur
- Duplique la logique de validation des champs obligatoires
- Réimplémente la validation des formats (email, URL, dates)

Cette duplication viole le principe DRY (Don't Repeat Yourself) et rend les composants plus difficiles à maintenir. L'extraction de cette logique dans un composable `useValidation` permettra de standardiser la validation des formulaires à travers l'application, tout en respectant les principes de validation à plusieurs niveaux définis dans l'architecture.

### Technical Context

- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Validation à plusieurs niveaux (UI et domaine)
- Utilisation de Zod pour la validation basée sur des schémas
- Contrainte de performance (<500ms) mentionnée dans l'architecture
- Schéma JSON Resume comme référence pour les validations

### Business Drivers

- Besoin d'améliorer la cohérence des validations à travers l'application
- Amélioration de l'expérience utilisateur avec des messages d'erreur clairs
- Réduction du temps de développement pour les nouvelles fonctionnalités
- Amélioration de la testabilité des validations
- Réduction des risques de bugs liés à la validation

## Estimation

Story Points: 3 (3 jours de développement)

## Acceptance Criteria

1. ✅ Étant donné un composant Form, quand le composable useValidation est implémenté, alors il doit gérer correctement la validation des champs obligatoires
2. ✅ Étant donné un champ de formulaire, quand sa valeur est mise à jour, alors le composable doit valider cette valeur en temps réel
3. ✅ Étant donné un formulaire complet, quand l'utilisateur tente de le soumettre, alors le composable doit effectuer une validation complète et retourner les erreurs
4. ✅ Étant donné des règles de validation personnalisées, quand elles sont fournies au composable, alors il doit les appliquer correctement
5. ✅ Étant donné l'implémentation du composable, quand il est testé, alors il doit maintenir ou améliorer les performances actuelles (<500ms)
6. ✅ Étant donné le composable useValidation, quand il est documenté, alors sa documentation doit inclure des exemples d'utilisation clairs

## Tasks

1. - [x] Analyse Détaillée des Validations Existantes

   1. - [x] Examiner la validation dans BasicsForm
   2. - [x] Examiner la validation dans WorkForm
   3. - [x] Examiner la validation dans EducationForm
   4. - [x] Identifier les patterns communs et les spécificités

2. - [x] Conception du Composable useValidation

   1. - [x] Définir l'interface du composable
   2. - [x] Concevoir la gestion des règles de validation
   3. - [x] Concevoir la logique de validation en temps réel
   4. - [x] Définir la stratégie de gestion des messages d'erreur

3. - [x] Implémentation du Composable

   1. - [x] Créer le fichier composable avec documentation JSDoc
   2. - [x] Implémenter les validateurs de base (requis, email, URL, date)
   3. - [x] Implémenter la logique de validation de formulaire complet
   4. - [x] Optimiser les performances

4. - [x] Tests Unitaires

   1. - [x] Écrire les tests pour les validateurs de base
   2. - [x] Écrire les tests pour la validation de formulaire complet
   3. - [x] Écrire les tests pour les cas d'erreur
   4. - [x] Écrire les tests de performance

5. - [x] Refactorisation d'un Composant Pilote

   1. - [x] Sélectionner un composant Form pour la première implémentation
   2. - [x] Refactoriser ce composant pour utiliser useValidation
   3. - [x] Vérifier le fonctionnement et les performances
   4. - [x] Documenter les changements et les bénéfices

6. - [x] Documentation
   1. - [x] Documenter l'interface du composable
   2. - [x] Créer des exemples d'utilisation
   3. - [x] Documenter les bonnes pratiques
   4. - [x] Mettre à jour la documentation de l'architecture

## Principes de Développement

#### Principes à Suivre

- **Simplicité**: Concevoir une API simple et intuitive
- **Flexibilité**: Supporter différents types de validation via une API extensible
- **Performance**: Maintenir des performances optimales (<500ms)
- **Testabilité**: Concevoir le composable pour qu'il soit facilement testable
- **Documentation**: Documenter clairement l'interface et l'utilisation
- **Cohérence**: Assurer une expérience de validation cohérente dans toute l'application

#### À Éviter

- Créer une abstraction trop complexe ou trop générique
- Introduire des dépendances supplémentaires non nécessaires
- Modifier le comportement fonctionnel des composants existants
- Créer un composable qui viole le principe de responsabilité unique
- Dupliquer la validation du domaine dans l'UI

## Risques et Hypothèses

| Risque                                                 | Impact | Probabilité | Mitigation                                             |
| ------------------------------------------------------ | ------ | ----------- | ------------------------------------------------------ |
| Incompatibilité avec certaines validations spécifiques | Moyen  | Moyenne     | Analyse préalable approfondie et API extensible        |
| Dégradation des performances                           | Élevé  | Faible      | Validation asynchrone et optimisation                  |
| Complexité accrue de l'API                             | Moyen  | Moyenne     | Conception itérative avec revues de code               |
| Confusion entre validation UI et domaine               | Élevé  | Moyenne     | Documentation claire et séparation des responsabilités |

## Notes de Développement

Le composable `useValidation` a été implémenté avec les fonctionnalités suivantes :

- Utilisation de Zod pour la validation basée sur des schémas
- Support pour la validation de champs individuels et de formulaires complets
- Gestion des champs requis et validation de format d'email
- Suivi des performances de validation
- Support pour la validation asynchrone avec debounce
- Formatage personnalisable des messages d'erreur
- Support pour la validation de champs imbriqués avec notation par points

### Interface Implémentée

```typescript
function useValidation<T extends Record<string, any>>(
  schema?: z.ZodType,
  options: ValidationOptions = {}
): ValidationResult<T> {
  // Implementation...

  return {
    validateValue,
    validateField,
    validateForm,
    checkRequiredFields,
    error,
    errors,
    isValid,
    isDirty,
    perfMetrics,
  };
}

// Types
interface ValidationOptions {
  debounceTime?: number;
  formatError?: (error: z.ZodError) => string;
  enableLogging?: boolean;
  requiredFields?: string[];
}

interface ValidationResult<T> {
  validateValue: (value: any) => boolean | void;
  validateField: (field: keyof T, value: any) => boolean;
  validateForm: (data: T) => boolean;
  checkRequiredFields: (data: T) => { valid: boolean; missing: string[] };
  error: Ref<string>;
  errors: Ref<Record<string, string>>;
  isValid: Ref<boolean>;
  isDirty: Ref<boolean>;
  perfMetrics?: {
    validationCount: number;
    validationTime: number;
  };
}
```

## Exemples d'Utilisation

Plusieurs composants d'exemple ont été créés pour démontrer l'utilisation du composable :

- **ValidationFormExample.vue** : Exemple complet de formulaire avec validation
- **CombinedFormExample.vue** : Exemple combinant useValidation avec useFormModel
- **AdvancedValidationExample.vue** : Formulaire complexe avec champs imbriqués et validation personnalisée

## Journal de Communication

- Giak: Nous avons besoin d'extraire la logique de validation des formulaires
- AiAgent: Je propose de créer un composable useValidation réutilisable basé sur Zod
- Giak: Comment allez-vous gérer la séparation entre validation UI et domaine?
- AiAgent: Le composable se concentrera sur la validation UI, tout en respectant les contraintes du domaine
- Giak: Assurez-vous que les performances restent optimales
- AiAgent: J'ai implémenté une validation asynchrone avec debounce pour les formulaires complexes et un suivi des performances
- Giak: Avez-vous prévu des tests pour le composable?
- AiAgent: Oui, j'ai créé une suite de tests complète couvrant la validation de schéma, la validation de champs, la validation de formulaire et les métriques de performance
- Giak: Comment pouvons-nous documenter l'utilisation du composable?
- AiAgent: J'ai créé une documentation complète avec des exemples d'utilisation, des bonnes pratiques et des considérations de performance
