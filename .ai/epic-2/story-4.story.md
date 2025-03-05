# Epic-2: Refactorisation des Composants CV

# Story-4: Extraction du Composable useCollectionField

## Story

**En tant que** développeur
**Je veux** extraire la logique de gestion des champs de type collection dans un composable réutilisable
**afin de** standardiser la manipulation des collections, réduire la duplication de code et améliorer la maintenabilité

## Status

Draft

## Context

Cette story fait partie de l'Epic-2 qui vise à refactoriser les composants du module CV. L'analyse des composants existants a révélé une duplication importante de code liée à la gestion des champs de type collection (profiles, skills, languages, etc.) dans plusieurs composants (BasicsForm, SkillForm, LanguageForm, etc.).

Actuellement, chaque composant gérant des collections :

- Implémente sa propre logique d'ajout d'éléments
- Duplique la logique de suppression d'éléments
- Réimplémente la gestion des identifiants uniques
- Gère de façon similaire la mise à jour des éléments de la collection

Cette duplication viole le principe DRY (Don't Repeat Yourself) et rend les composants plus difficiles à maintenir. L'extraction de cette logique dans un composable `useCollectionField` permettra de standardiser la gestion des collections à travers l'application.

### Technical Context

- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Structure de données JSON Resume avec plusieurs champs de type collection
- Contrainte de performance (<500ms) mentionnée dans l'architecture
- Besoin de maintenir l'intégrité des données lors des manipulations de collections

### Business Drivers

- Besoin d'améliorer la cohérence de la gestion des collections à travers l'application
- Réduction du temps de développement pour les nouvelles fonctionnalités
- Amélioration de la testabilité des manipulations de collections
- Réduction des risques de bugs liés à la gestion des collections
- Amélioration de l'expérience utilisateur lors de la manipulation des collections

## Estimation

Story Points: 3 (3 jours de développement)

## Acceptance Criteria

1. Étant donné un champ de type collection, quand le composable useCollectionField est implémenté, alors il doit gérer correctement l'ajout d'éléments
2. Étant donné une collection, quand un élément est supprimé, alors le composable doit mettre à jour la collection et émettre les événements appropriés
3. Étant donné une collection, quand un élément est modifié, alors le composable doit mettre à jour l'élément tout en préservant les autres
4. Étant donné une collection vide, quand un élément est ajouté, alors le composable doit initialiser correctement cet élément avec des valeurs par défaut
5. Étant donné l'implémentation du composable, quand il est testé, alors il doit maintenir ou améliorer les performances actuelles (<500ms)
6. Étant donné le composable useCollectionField, quand il est documenté, alors sa documentation doit inclure des exemples d'utilisation clairs

## Tasks

1. - [ ] Analyse Détaillée des Implémentations Existantes

   1. - [ ] Examiner la gestion des collections dans BasicsForm (profiles)
   2. - [ ] Examiner la gestion des collections dans SkillForm
   3. - [ ] Examiner la gestion des collections dans LanguageForm
   4. - [ ] Identifier les patterns communs et les spécificités

2. - [ ] Conception du Composable useCollectionField

   1. - [ ] Définir l'interface du composable
   2. - [ ] Concevoir la gestion des identifiants uniques
   3. - [ ] Concevoir la logique d'ajout, suppression et mise à jour
   4. - [ ] Définir la stratégie de gestion des valeurs par défaut

3. - [ ] Implémentation du Composable

   1. - [ ] Créer le fichier composable avec documentation JSDoc
   2. - [ ] Implémenter la logique core du composable
   3. - [ ] Ajouter la gestion des cas particuliers
   4. - [ ] Optimiser les performances

4. - [ ] Tests Unitaires

   1. - [ ] Écrire les tests pour l'ajout d'éléments
   2. - [ ] Écrire les tests pour la suppression d'éléments
   3. - [ ] Écrire les tests pour la mise à jour d'éléments
   4. - [ ] Écrire les tests de performance

5. - [ ] Refactorisation d'un Composant Pilote

   1. - [ ] Sélectionner un composant avec collection pour la première implémentation
   2. - [ ] Refactoriser ce composant pour utiliser useCollectionField
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
- **Flexibilité**: Supporter différents types de collections via génériques TypeScript
- **Performance**: Maintenir des performances optimales (<500ms)
- **Testabilité**: Concevoir le composable pour qu'il soit facilement testable
- **Documentation**: Documenter clairement l'interface et l'utilisation
- **Immutabilité**: Privilégier les approches immutables pour les mises à jour

#### À Éviter

- Créer une abstraction trop complexe ou trop générique
- Introduire des dépendances supplémentaires non nécessaires
- Modifier le comportement fonctionnel des composants existants
- Créer un composable qui viole le principe de responsabilité unique
- Utiliser des approches qui pourraient compromettre l'intégrité des données

## Risques et Hypothèses

| Risque                                                   | Impact | Probabilité | Mitigation                                      |
| -------------------------------------------------------- | ------ | ----------- | ----------------------------------------------- |
| Incompatibilité avec certaines collections spécifiques   | Moyen  | Moyenne     | Analyse préalable approfondie et API extensible |
| Dégradation des performances avec de grandes collections | Élevé  | Moyenne     | Optimisation et pagination si nécessaire        |
| Complexité accrue de l'API                               | Moyen  | Moyenne     | Conception itérative avec revues de code        |
| Perte d'intégrité des données                            | Élevé  | Faible      | Tests exhaustifs et approches immutables        |

## Notes de Développement

Le composable `useCollectionField` devra suivre ces principes :

- Utiliser le préfixe `use` conformément aux conventions Vue.js
- Accepter une collection comme paramètre (ref, computed ou valeur directe)
- Utiliser `toValue()` pour supporter différents types d'entrée
- Retourner des méthodes pour manipuler la collection (add, remove, update)
- Gérer correctement les identifiants uniques pour les éléments
- Supporter l'initialisation avec des valeurs par défaut
- Être fortement typé avec TypeScript
- Utiliser des approches immutables pour les mises à jour

### Exemple d'Interface Proposée

```typescript
function useCollectionField<T extends Record<string, any>>(options: {
  collection: MaybeRef<T[]>;
  defaultItem?: Partial<T>;
  idField?: keyof T;
  emit: (event: "update:collection", value: T[]) => void;
}) {
  // Implementation...

  return {
    items, // Ref<T[]>
    addItem, // (item?: Partial<T>) => void
    removeItem, // (id: string | number) => void
    updateItem, // (id: string | number, updates: Partial<T>) => void
    findItem, // (predicate: (item: T) => boolean) => T | undefined
    isEmpty, // ComputedRef<boolean>
  };
}
```

## Journal de Communication

- Giak: Nous avons besoin d'extraire la logique de gestion des collections
- AiAgent: Je propose de créer un composable useCollectionField réutilisable
- Giak: Comment allez-vous gérer les identifiants uniques?
- AiAgent: Le composable supportera un champ ID configurable et générera des IDs uniques si nécessaire
- Giak: Assurez-vous que les performances restent bonnes avec de grandes collections
- AiAgent: Je vais optimiser les opérations et envisager une pagination pour les grandes collections
