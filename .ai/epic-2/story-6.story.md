# Epic-2: Refactorisation des Composants CV

# Story-6: Création du Composant CollectionManager

## Story

**En tant que** développeur
**Je veux** extraire la logique de gestion des listes d'éléments dans un composant réutilisable
**afin de** standardiser l'interface utilisateur des collections, réduire la duplication de code et améliorer l'expérience utilisateur

## Status

Draft

## Context

Cette story fait partie de l'Epic-2 qui vise à refactoriser les composants du module CV. L'analyse des composants existants a révélé une duplication importante de code liée à la gestion des listes d'éléments (WorkList, EducationList, SkillList, etc.) dans plusieurs composants.

Actuellement, chaque composant de liste :

- Duplique la structure d'affichage des éléments
- Réimplémente les boutons d'ajout, de modification et de suppression
- Gère de façon similaire les interactions utilisateur (ajout, édition, suppression)
- Duplique la logique de confirmation de suppression
- Réimplémente la gestion des états vides

Cette duplication viole le principe DRY (Don't Repeat Yourself) et rend les composants plus difficiles à maintenir. L'extraction de cette logique dans un composant `CollectionManager` permettra de standardiser la gestion des listes d'éléments à travers l'application.

### Technical Context

- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Structure de données JSON Resume avec plusieurs entités sous forme de collections
- Besoin de maintenir la cohérence de l'interface utilisateur
- Contrainte de performance (<500ms) mentionnée dans l'architecture
- Besoin de supporter différents types d'affichage selon le type d'élément

### Business Drivers

- Besoin d'améliorer la cohérence de l'interface utilisateur pour les collections
- Réduction du temps de développement pour les nouvelles fonctionnalités
- Amélioration de la testabilité des interactions utilisateur
- Réduction des risques de bugs liés à la gestion des collections
- Amélioration de l'expérience utilisateur lors de la manipulation des collections

## Estimation

Story Points: 3 (3 jours de développement)

## Acceptance Criteria

1. Étant donné une collection d'éléments, quand le composant CollectionManager est implémenté, alors il doit afficher correctement la liste des éléments
2. Étant donné une collection vide, quand le composant est rendu, alors il doit afficher un message approprié et un bouton d'ajout
3. Étant donné une collection, quand l'utilisateur clique sur le bouton d'ajout, alors le composant doit déclencher l'événement approprié
4. Étant donné une collection, quand l'utilisateur clique sur le bouton de modification d'un élément, alors le composant doit déclencher l'événement approprié
5. Étant donné une collection, quand l'utilisateur clique sur le bouton de suppression d'un élément, alors le composant doit demander confirmation avant de déclencher l'événement de suppression
6. Étant donné l'implémentation du composant, quand il est testé, alors il doit maintenir ou améliorer les performances actuelles (<500ms)
7. Étant donné le composant CollectionManager, quand il est documenté, alors sa documentation doit inclure des exemples d'utilisation clairs

## Tasks

1. - [ ] Analyse Détaillée des Implémentations Existantes

   1. - [ ] Examiner la structure de WorkList
   2. - [ ] Examiner la structure de EducationList
   3. - [ ] Examiner la structure de SkillList
   4. - [ ] Identifier les patterns communs et les spécificités

2. - [ ] Conception du Composant CollectionManager

   1. - [ ] Définir l'interface du composant (props, events, slots)
   2. - [ ] Concevoir la structure du template
   3. - [ ] Concevoir la logique d'interaction
   4. - [ ] Définir la stratégie de personnalisation via slots

3. - [ ] Implémentation du Composant

   1. - [ ] Créer le fichier composant avec documentation JSDoc
   2. - [ ] Implémenter le template et la logique
   3. - [ ] Ajouter la gestion des cas particuliers
   4. - [ ] Optimiser les performances

4. - [ ] Tests Unitaires

   1. - [ ] Écrire les tests pour l'affichage des éléments
   2. - [ ] Écrire les tests pour l'état vide
   3. - [ ] Écrire les tests pour les interactions utilisateur
   4. - [ ] Écrire les tests de performance

5. - [ ] Refactorisation d'un Composant Pilote

   1. - [ ] Sélectionner un composant de liste pour la première implémentation
   2. - [ ] Refactoriser ce composant pour utiliser CollectionManager
   3. - [ ] Vérifier le fonctionnement et les performances
   4. - [ ] Documenter les changements et les bénéfices

6. - [ ] Documentation
   1. - [ ] Documenter l'interface du composant
   2. - [ ] Créer des exemples d'utilisation
   3. - [ ] Documenter les bonnes pratiques
   4. - [ ] Mettre à jour la documentation de l'architecture

## Principes de Développement

#### Principes à Suivre

- **Simplicité**: Concevoir une API simple et intuitive
- **Flexibilité**: Supporter différents types d'affichage via slots
- **Cohérence**: Maintenir une apparence et un comportement cohérents avec le reste de l'application
- **Accessibilité**: S'assurer que le composant est accessible (ARIA, navigation clavier)
- **Réutilisabilité**: Concevoir le composant pour qu'il soit facilement réutilisable
- **Testabilité**: Concevoir le composant pour qu'il soit facilement testable

#### À Éviter

- Créer une abstraction trop complexe ou trop spécifique
- Introduire des dépendances supplémentaires non nécessaires
- Modifier le comportement fonctionnel des composants existants
- Créer un composant qui viole le principe de responsabilité unique
- Utiliser des approches qui pourraient compromettre l'expérience utilisateur

## Risques et Hypothèses

| Risque                                                      | Impact | Probabilité | Mitigation                                         |
| ----------------------------------------------------------- | ------ | ----------- | -------------------------------------------------- |
| Incompatibilité avec certains cas d'utilisation spécifiques | Moyen  | Moyenne     | Analyse préalable approfondie et API extensible    |
| Dégradation de l'expérience utilisateur                     | Élevé  | Faible      | Tests utilisateurs et revues de design             |
| Complexité accrue de l'API                                  | Moyen  | Moyenne     | Conception itérative avec revues de code           |
| Difficulté à supporter tous les cas d'affichage             | Élevé  | Moyenne     | Utilisation de slots pour maximiser la flexibilité |

## Notes de Développement

Le composant `CollectionManager` devra suivre ces principes :

- Utiliser des slots pour permettre la personnalisation de l'affichage des éléments
- Accepter une collection d'éléments comme prop
- Émettre des événements pour les actions utilisateur (ajout, modification, suppression)
- Gérer correctement les confirmations de suppression
- Supporter l'affichage d'un état vide avec message personnalisable
- Être fortement typé avec TypeScript
- Supporter l'internationalisation des libellés

### Exemple d'Interface Proposée

```vue
<template>
  <div class="collection-manager">
    <!-- Header avec titre et bouton d'ajout -->
    <div class="collection-header">
      <h3 v-if="title">{{ title }}</h3>
      <button
        class="add-button"
        @click="$emit('add')"
        :aria-label="addButtonLabel"
      >
        <slot name="add-icon">
          <PlusIcon />
        </slot>
        {{ addButtonText }}
      </button>
    </div>

    <!-- Liste des éléments -->
    <div v-if="items.length > 0" class="collection-items">
      <div
        v-for="item in items"
        :key="getItemKey(item)"
        class="collection-item"
      >
        <!-- Contenu de l'élément via slot -->
        <slot name="item" :item="item">
          {{ item.toString() }}
        </slot>

        <!-- Actions sur l'élément -->
        <div class="item-actions">
          <button
            class="edit-button"
            @click="$emit('edit', item)"
            :aria-label="editButtonLabel"
          >
            <slot name="edit-icon">
              <EditIcon />
            </slot>
          </button>

          <button
            class="delete-button"
            @click="confirmDelete(item)"
            :aria-label="deleteButtonLabel"
          >
            <slot name="delete-icon">
              <TrashIcon />
            </slot>
          </button>
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="empty-state">
      <slot name="empty">
        <p>{{ emptyStateText }}</p>
        <button class="add-button" @click="$emit('add')">
          {{ addFirstItemText }}
        </button>
      </slot>
    </div>

    <!-- Modal de confirmation de suppression -->
    <ConfirmationModal
      v-if="showDeleteConfirmation"
      :title="deleteConfirmationTitle"
      :message="deleteConfirmationMessage"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>

<script setup lang="ts">
// Implementation...
</script>
```

## Journal de Communication

- Giak: Nous avons besoin d'extraire la logique de gestion des listes d'éléments
- AiAgent: Je propose de créer un composant CollectionManager réutilisable
- Giak: Comment allez-vous gérer les différents types d'affichage?
- AiAgent: Le composant utilisera des slots pour permettre une personnalisation maximale de l'affichage
- Giak: Assurez-vous que l'interface utilisateur reste cohérente avec le reste de l'application
- AiAgent: Je vais maintenir la cohérence visuelle tout en offrant la flexibilité nécessaire via les slots
