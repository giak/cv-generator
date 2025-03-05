# Epic-2: Refactorisation des Composants CV

# Story-3: Extraction du Composable useFormValidation

## Story

**En tant que** développeur
**Je veux** extraire la logique de validation des formulaires dans un composable réutilisable
**afin de** standardiser la validation, réduire la duplication de code et améliorer la qualité des retours utilisateur

## Status

Draft

## Context

Cette story fait partie de l'Epic-2 qui vise à refactoriser les composants du module CV. L'analyse des composants existants a révélé une duplication importante de code liée à la validation des formulaires dans tous les composants Form (BasicsForm, WorkForm, EducationForm, etc.).

Actuellement, chaque formulaire :

- Implémente sa propre logique de validation
- Gère ses propres messages d'erreur
- Duplique la logique de validation des champs obligatoires
- Réimplémente la validation des formats (email, URL, dates)

Cette duplication viole le principe DRY (Don't Repeat Yourself) et rend les composants plus difficiles à maintenir. L'extraction de cette logique dans un composable `useFormValidation` permettra de standardiser la validation des formulaires à travers l'application, tout en respectant les principes de validation à plusieurs niveaux définis dans l'architecture.

### Technical Context

- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Validation à plusieurs niveaux (UI et domaine)
- Utilisation potentielle de Zod pour la validation
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

1. Étant donné un composant Form, quand le composable useFormValidation est implémenté, alors il doit gérer correctement la validation des champs obligatoires
2. Étant donné un champ de formulaire, quand sa valeur est mise à jour, alors le composable doit valider cette valeur en temps réel
3. Étant donné un formulaire complet, quand l'utilisateur tente de le soumettre, alors le composable doit effectuer une validation complète et retourner les erreurs
4. Étant donné des règles de validation personnalisées, quand elles sont fournies au composable, alors il doit les appliquer correctement
5. Étant donné l'implémentation du composable, quand il est testé, alors il doit maintenir ou améliorer les performances actuelles (<500ms)
6. Étant donné le composable useFormValidation, quand il est documenté, alors sa documentation doit inclure des exemples d'utilisation clairs

## Tasks

1. - [ ] Analyse Détaillée des Validations Existantes

   1. - [ ] Examiner la validation dans BasicsForm
   2. - [ ] Examiner la validation dans WorkForm
   3. - [ ] Examiner la validation dans EducationForm
   4. - [ ] Identifier les patterns communs et les spécificités

2. - [ ] Conception du Composable useFormValidation

   1. - [ ] Définir l'interface du composable
   2. - [ ] Concevoir la gestion des règles de validation
   3. - [ ] Concevoir la logique de validation en temps réel
   4. - [ ] Définir la stratégie de gestion des messages d'erreur

3. - [ ] Implémentation du Composable

   1. - [ ] Créer le fichier composable avec documentation JSDoc
   2. - [ ] Implémenter les validateurs de base (requis, email, URL, date)
   3. - [ ] Implémenter la logique de validation de formulaire complet
   4. - [ ] Optimiser les performances

4. - [ ] Tests Unitaires

   1. - [ ] Écrire les tests pour les validateurs de base
   2. - [ ] Écrire les tests pour la validation de formulaire complet
   3. - [ ] Écrire les tests pour les cas d'erreur
   4. - [ ] Écrire les tests de performance

5. - [ ] Refactorisation d'un Composant Pilote

   1. - [ ] Sélectionner un composant Form pour la première implémentation
   2. - [ ] Refactoriser ce composant pour utiliser useFormValidation
   3. - [ ] Vérifier le fonctionnement et les performances
   4. - [ ] Documenter les changements et les bénéfices

6. - [ ] Documentation
   1. - [ ] Documenter l'interface du composable
   2. - [ ] Créer des exemples d'utilisation
   3. - [ ] Documenter les bonnes pratiques
   4. - [ ] Mettre à jour la documentation de l'architecture

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

Le composable `useFormValidation` devra suivre ces principes :

- Utiliser le préfixe `use` conformément aux conventions Vue.js
- Accepter un modèle de formulaire et des règles de validation
- Supporter la validation en temps réel et la validation à la soumission
- Retourner des états de validation et des messages d'erreur
- Supporter l'extension avec des validateurs personnalisés
- Être fortement typé avec TypeScript
- Respecter la séparation entre validation UI et validation domaine

### Exemple d'Interface Proposée

```typescript
function useFormValidation<T extends Record<string, any>>(options: {
  model: MaybeRef<T>;
  rules: ValidationRules<T>;
  validateOnChange?: boolean;
}) {
  // Implementation...

  return {
    errors, // Ref<Record<keyof T, string | null>>
    validateField, // (field: keyof T) => boolean
    validateForm, // () => boolean
    isValid, // ComputedRef<boolean>
    isDirty, // ComputedRef<boolean>
    resetValidation, // () => void
  };
}

// Types
type ValidationRule = (value: any) => boolean | string;
type ValidationRules<T> = Partial<
  Record<keyof T, ValidationRule | ValidationRule[]>
>;
```

## Journal de Communication

- Giak: Nous avons besoin d'extraire la logique de validation des formulaires
- AiAgent: Je propose de créer un composable useFormValidation réutilisable
- Giak: Comment allez-vous gérer la séparation entre validation UI et domaine?
- AiAgent: Le composable se concentrera sur la validation UI, tout en respectant les contraintes du domaine
- Giak: Assurez-vous que les performances restent optimales
- AiAgent: Je vais implémenter une validation asynchrone pour les formulaires complexes
