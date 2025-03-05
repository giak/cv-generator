# Epic-2: Refactorisation des Composants CV

# Story-2: Extraction du Composable useFormModel

## Story

**En tant que** développeur
**Je veux** extraire la logique de gestion des modèles de formulaire dans un composable réutilisable
**afin de** réduire la duplication de code, améliorer la cohérence et faciliter la maintenance des formulaires CV

## Status

Completed

## Context

Cette story fait partie de l'Epic-2 qui vise à refactoriser les composants du module CV. L'analyse des composants existants a révélé une duplication importante de code liée à la gestion des modèles de formulaire dans tous les composants Form (BasicsForm, WorkForm, EducationForm, etc.).

Actuellement, chaque formulaire :

- Définit sa propre logique de création et mise à jour du modèle local
- Implémente sa propre gestion des événements de mise à jour
- Duplique la logique de synchronisation entre le modèle local et les props
- Réimplémente la logique d'initialisation des valeurs par défaut

Cette duplication viole le principe DRY (Don't Repeat Yourself) et rend les composants plus difficiles à maintenir. L'extraction de cette logique dans un composable `useFormModel` permettra de standardiser la gestion des modèles de formulaire à travers l'application.

### Technical Context

- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Utilisation de props `modelValue` avec pattern v-model dans les composants
- Validation à plusieurs niveaux (UI et domaine)
- Contrainte de performance (<500ms) mentionnée dans l'architecture

### Business Drivers

- Besoin d'améliorer la maintenabilité du code pour les évolutions futures
- Réduction du temps de développement pour les nouvelles fonctionnalités
- Amélioration de la testabilité des composants
- Réduction des risques de bugs lors des modifications

## Estimation

Story Points: 3 (3 jours de développement)

## Acceptance Criteria

1. ✅ Étant donné un composant Form, quand le composable useFormModel est implémenté, alors il doit gérer correctement l'initialisation du modèle local
2. ✅ Étant donné un modèle de formulaire, quand une valeur est mise à jour, alors le composable doit émettre les événements appropriés pour maintenir la synchronisation avec v-model
3. ✅ Étant donné un changement de prop modelValue, quand le composable détecte ce changement, alors il doit mettre à jour le modèle local en conséquence
4. ✅ Étant donné des valeurs par défaut, quand un nouveau formulaire est créé, alors le composable doit initialiser correctement les champs avec ces valeurs
5. ✅ Étant donné l'implémentation du composable, quand il est testé, alors il doit maintenir ou améliorer les performances actuelles (<500ms)
6. ✅ Étant donné le composable useFormModel, quand il est documenté, alors sa documentation doit inclure des exemples d'utilisation clairs

## Tasks

1. - [x] Analyse Détaillée des Implémentations Existantes

   1. - [x] Examiner la gestion des modèles dans BasicsForm
   2. - [x] Examiner la gestion des modèles dans WorkForm
   3. - [x] Examiner la gestion des modèles dans EducationForm
   4. - [x] Identifier les patterns communs et les spécificités

2. - [x] Conception du Composable useFormModel

   1. - [x] Définir l'interface du composable
   2. - [x] Concevoir la gestion des valeurs par défaut
   3. - [x] Concevoir la logique de synchronisation
   4. - [x] Définir la stratégie de gestion des types génériques

3. - [x] Implémentation du Composable

   1. - [x] Créer le fichier composable avec documentation JSDoc
   2. - [x] Implémenter la logique core du composable
   3. - [x] Ajouter la gestion des cas particuliers
   4. - [x] Optimiser les performances

4. - [x] Tests Unitaires

   1. - [x] Écrire les tests pour l'initialisation du modèle
   2. - [x] Écrire les tests pour la mise à jour du modèle
   3. - [x] Écrire les tests pour la synchronisation avec v-model
   4. - [x] Écrire les tests de performance

5. - [x] Refactorisation d'un Composant Pilote

   1. - [x] Sélectionner un composant Form pour la première implémentation
   2. - [x] Refactoriser ce composant pour utiliser useFormModel
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
- **Flexibilité**: Supporter différents types de modèles via génériques TypeScript
- **Performance**: Maintenir des performances optimales (<500ms)
- **Testabilité**: Concevoir le composable pour qu'il soit facilement testable
- **Documentation**: Documenter clairement l'interface et l'utilisation

#### À Éviter

- Créer une abstraction trop complexe ou trop générique
- Introduire des dépendances supplémentaires non nécessaires
- Modifier le comportement fonctionnel des composants existants
- Créer un composable qui viole le principe de responsabilité unique

## Risques et Hypothèses

| Risque                                                | Impact | Probabilité | Mitigation                                             |
| ----------------------------------------------------- | ------ | ----------- | ------------------------------------------------------ |
| Incompatibilité avec certains formulaires spécifiques | Moyen  | Moyenne     | Analyse préalable approfondie et tests exhaustifs      |
| Dégradation des performances                          | Élevé  | Faible      | Benchmarks avant/après et optimisation                 |
| Complexité accrue de l'API                            | Moyen  | Moyenne     | Conception itérative avec revues de code               |
| Difficulté de typage avec TypeScript                  | Moyen  | Élevée      | Utilisation judicieuse des génériques et tests de type |

## Notes de Développement

Le composable `useFormModel` devra suivre ces principes :

- Utiliser le préfixe `use` conformément aux conventions Vue.js
- Accepter un modelValue comme paramètre (ref, computed ou valeur directe)
- Utiliser `toValue()` pour supporter différents types d'entrée
- Retourner un modèle local réactif et des méthodes de mise à jour
- Gérer correctement les événements d'update:modelValue
- Supporter l'initialisation avec des valeurs par défaut
- Être fortement typé avec TypeScript

### Exemple d'Interface Proposée

```typescript
function useFormModel<T extends Record<string, any>>(options: {
  modelValue: MaybeRef<T>;
  defaultValues?: Partial<T>;
  emit: (event: "update:modelValue", value: T) => void;
  onUpdate?: (field: keyof T, value: any) => void;
}) {
  // Implementation...

  return {
    localModel, // Ref<T>
    updateField, // (field: keyof T, value: any) => void
    resetToDefault, // () => void
    isDirty, // ComputedRef<boolean>
  };
}
```

## Journal de Communication

- Giak: Nous avons besoin d'extraire la logique de gestion des modèles de formulaire
- AiAgent: Je propose de créer un composable useFormModel réutilisable
- Giak: Assurez-vous qu'il soit compatible avec tous nos formulaires existants
- AiAgent: Je vais analyser tous les formulaires pour garantir la compatibilité
- Giak: N'oubliez pas les contraintes de performance
- AiAgent: Je vais inclure des tests de performance dans l'implémentation
- AiAgent: J'ai implémenté le composable useFormModel avec tous les tests qui passent
- AiAgent: J'ai créé une documentation complète avec des exemples d'utilisation
- AiAgent: J'ai également créé un exemple de composant pour démontrer l'utilisation du composable
- Giak: Excellent travail, nous devons maintenant l'intégrer dans un composant existant
- AiAgent: J'ai refactorisé le composant BasicsForm pour utiliser useFormModel
- AiAgent: Tous les tests du composant BasicsForm passent avec succès
- AiAgent: Les performances sont maintenues et le code est plus maintenable
- Giak: Story complétée avec succès, nous pouvons maintenant passer à la refactorisation des autres composants

## Résultats et Bénéfices

- ✅ Réduction significative de la duplication de code dans les composants Form
- ✅ API cohérente pour la gestion des modèles de formulaire
- ✅ Amélioration de la maintenabilité et de la testabilité
- ✅ Performances maintenues ou améliorées (<500ms)
- ✅ Documentation complète avec exemples d'utilisation
- ✅ Premier composant (BasicsForm) refactorisé avec succès
