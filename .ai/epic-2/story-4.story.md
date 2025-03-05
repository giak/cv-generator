# Epic-2: Refactorisation des Composants CV

# Story-4: Extraction du Composable useCollectionField

## Story

**En tant que** développeur
**Je veux** extraire la logique de gestion des champs de type collection dans un composable réutilisable
**afin de** standardiser la manipulation des collections, réduire la duplication de code et améliorer la maintenabilité

## Status

Done ✅

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

1. ✅ Étant donné un champ de type collection, quand le composable useCollectionField est implémenté, alors il doit gérer correctement l'ajout d'éléments
2. ✅ Étant donné une collection, quand un élément est supprimé, alors le composable doit mettre à jour la collection et émettre les événements appropriés
3. ✅ Étant donné une collection, quand un élément est modifié, alors le composable doit mettre à jour l'élément tout en préservant les autres
4. ✅ Étant donné une collection vide, quand un élément est ajouté, alors le composable doit initialiser correctement cet élément avec des valeurs par défaut
5. ✅ Étant donné l'implémentation du composable, quand il est testé, alors il doit maintenir ou améliorer les performances actuelles (<500ms)
6. ✅ Étant donné le composable useCollectionField, quand il est documenté, alors sa documentation doit inclure des exemples d'utilisation clairs

## Tasks

1. - [x] Analyse Détaillée des Implémentations Existantes

   1. - [x] Examiner la gestion des collections dans BasicsForm (profiles)
   2. - [x] Examiner la gestion des collections dans SkillForm
   3. - [x] Examiner la gestion des collections dans LanguageForm
   4. - [x] Identifier les patterns communs et les spécificités

2. - [x] Conception du Composable useCollectionField

   1. - [x] Définir l'interface du composable
   2. - [x] Concevoir la gestion des identifiants uniques
   3. - [x] Concevoir la logique d'ajout, suppression et mise à jour
   4. - [x] Définir la stratégie de gestion des valeurs par défaut

3. - [x] Implémentation du Composable

   1. - [x] Créer le fichier composable avec documentation JSDoc
   2. - [x] Implémenter la logique core du composable
   3. - [x] Ajouter la gestion des cas particuliers
   4. - [x] Optimiser les performances

4. - [x] Tests Unitaires

   1. - [x] Écrire les tests pour l'ajout d'éléments
   2. - [x] Écrire les tests pour la suppression d'éléments
   3. - [x] Écrire les tests pour la mise à jour d'éléments
   4. - [x] Écrire les tests de performance

5. - [x] Refactorisation d'un Composant Pilote

   1. - [x] Sélectionner un composant avec collection pour la première implémentation (BasicsForm)
   2. - [x] Refactoriser ce composant pour utiliser useCollectionField
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

Le composable `useCollectionField` a été implémenté avec succès selon les principes suivants :

- ✅ Utilisation du préfixe `use` conformément aux conventions Vue.js
- ✅ Acceptation d'une collection comme paramètre (ref, computed ou valeur directe)
- ✅ Retour des méthodes pour manipuler la collection (add, remove, update)
- ✅ Gestion correcte des identifiants uniques pour les éléments
- ✅ Support de l'initialisation avec des valeurs par défaut
- ✅ Typage fort avec TypeScript
- ✅ Utilisation d'approches immutables pour les mises à jour

### Interface Finale Implémentée

```typescript
export interface CollectionFieldOptions<T extends Record<string, any>> {
  /**
   * The field name in the parent model that contains the collection
   */
  fieldName: string;

  /**
   * Function to update the collection in the parent model
   */
  updateField: (field: string, value: T[]) => void;

  /**
   * Current collection from the parent model
   */
  collection: Ref<T[]> | (() => T[]);

  /**
   * Default values for a new item
   */
  defaultItemValues: T;

  /**
   * Optional validator function for items
   */
  validateItem?: (item: T) => {
    isValid: boolean;
    errors?: Record<string, string>;
  };

  /**
   * Optional field to use as a unique identifier (defaults to 'id')
   */
  identifierField?: keyof T;

  /**
   * Whether to enable performance logging
   */
  enableLogging?: boolean;
}

export interface CollectionFieldReturn<T extends Record<string, any>> {
  // Propriétés retournées par le composable
  items: Ref<T[]>;
  newItem: Ref<T>;
  isAddingItem: Ref<boolean>;
  editingItemId: Ref<string | null>;
  validationErrors: Ref<Record<string, string>>;

  // Méthodes pour manipuler la collection
  addItem: (item?: T) => void;
  removeItem: (idOrIndex: string | number) => void;
  updateItem: (id: string, updatedItem: T) => void;
  startEditing: (idOrIndex: string | number) => T;
  resetNewItem: () => void;
  toggleAddForm: () => void;
  cancelEditing: () => void;
  reorderItems: (newOrder: string[]) => void;

  // Métriques de performance optionnelles
  perfMetrics?: {
    addOperations: number;
    removeOperations: number;
    updateOperations: number;
    validationOperations: number;
  };
}
```

### Résultats et Bénéfices

1. **Réduction de la duplication**: Le code pour gérer les collections a été extrait et centralisé dans un composable réutilisable.
2. **Performance**: Les tests montrent que le composable maintient de bonnes performances (<500ms).
3. **Maintenabilité**: L'interface claire et la documentation détaillée facilitent l'utilisation du composable.
4. **Intégrité des données**: Le composable garantit l'intégrité des données lors des opérations sur les collections.
5. **Implémentation réussie**: Le composable a été utilisé avec succès dans le composant BasicsForm pour gérer les profils.

## Améliorations Futures

- Implémenter un support pour le drag-and-drop pour réordonner les éléments
- Ajouter un support pour la pagination pour les grandes collections
- Étendre le composable pour supporter la validation asynchrone
- Implémenter des hooks de cycle de vie pour les éléments (onAdd, onRemove, etc.)

## Journal de Communication

- Giak: Nous avons besoin d'extraire la logique de gestion des collections
- AiAgent: Je propose de créer un composable useCollectionField réutilisable
- Giak: Comment allez-vous gérer les identifiants uniques?
- AiAgent: Le composable supportera un champ ID configurable et générera des IDs uniques si nécessaire
- Giak: Assurez-vous que les performances restent bonnes avec de grandes collections
- AiAgent: J'ai optimisé les opérations avec des approches immutables et ajouté des métriques de performance
- Giak: Le type d'updateField pose un problème dans BasicsForm
- AiAgent: J'ai implémenté un wrapper type-safe pour résoudre ce problème de typage
