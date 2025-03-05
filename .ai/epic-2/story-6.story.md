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

- [x] 1. Analyser les implémentations existantes

  - [x] Examiner la structure de WorkList
  - [x] Examiner la structure de EducationList
  - [x] Examiner la structure de SkillList
  - [x] Identifier les patterns communs et les spécificités

- [x] 2. Concevoir le composant CollectionManager

  - [x] Définir l'interface du composant (props, events, slots)
  - [x] Concevoir la structure du template
  - [x] Définir la logique d'interaction

- [x] 3. Implémenter le composant CollectionManager

  - [x] Créer le fichier de composant
  - [x] Implémenter le template
  - [x] Implémenter la logique
  - [x] Intégrer avec useCollectionField

- [x] 4. Tester le composant

  - [x] Créer les tests unitaires
  - [x] Vérifier les cas d'utilisation principaux
  - [x] Tester les cas limites

- [x] 5. Documenter le composant

  - [x] Créer la documentation d'API
  - [x] Fournir des exemples d'utilisation
  - [x] Documenter les patterns de personnalisation

- [x] 6. Refactoriser un composant existant pour utiliser CollectionManager
  - [x] Choisir un composant (WorkList, EducationList ou SkillList)
  - [x] Refactoriser pour utiliser CollectionManager
  - [x] Vérifier que le comportement est identique

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

### Analyse des Implémentations Existantes

Après analyse des composants `WorkList`, `EducationList` et `SkillList`, voici les patterns communs et spécificités identifiés :

#### Patterns Communs

1. **Structure Générale**:

   - Titre de section avec bouton d'ajout
   - État vide avec message et bouton d'ajout
   - Liste d'éléments avec actions (édition, suppression)
   - Modal/Dialog pour l'ajout et l'édition

2. **Gestion d'État**:

   - Utilisation d'un store pour charger et manipuler les données
   - État local pour gérer le formulaire d'ajout/édition
   - État de chargement (loading)
   - État du dialogue (ouvert/fermé)
   - Mode du dialogue (ajout/édition)

3. **Actions Utilisateur**:

   - Ajout d'un nouvel élément
   - Édition d'un élément existant
   - Suppression d'un élément (avec confirmation)
   - Dans certains cas, réorganisation des éléments (moveUp/moveDown)

4. **Affichage des Éléments**:

   - Utilisation de cartes pour chaque élément
   - Affichage des détails principaux
   - Boutons d'action (édition, suppression)

5. **Formulaires**:
   - Composants de formulaire spécifiques pour chaque type d'élément
   - Validation des données
   - Boutons de sauvegarde et d'annulation

#### Spécificités

1. **WorkList**:

   - Fonctionnalités de réorganisation (moveUp/moveDown)
   - Affichage des dates formatées
   - Affichage des highlights sous forme de liste

2. **EducationList**:

   - Affichage des cours suivis
   - Affichage du score/résultat
   - Lien vers le site web de l'établissement

3. **SkillList**:
   - Affichage du niveau de compétence
   - Affichage des mots-clés sous forme de tags
   - Interface légèrement différente (fond de couleur différent)

#### Relation avec useCollectionField

Le composable `useCollectionField` développé dans la Story-4 fournit déjà la logique de gestion des collections :

- Ajout, suppression et mise à jour d'éléments
- Validation des éléments
- Gestion de l'état d'édition
- Réinitialisation des formulaires

Le composant `CollectionManager` devra s'appuyer sur ce composable pour la logique métier, tout en fournissant une interface utilisateur cohérente et personnalisable.

### Conception du Composant CollectionManager

Après l'analyse des implémentations existantes, voici la conception détaillée du composant `CollectionManager` :

#### Interface du Composant (Props, Events, Slots)

##### Props

```typescript
export interface CollectionManagerProps<T extends Record<string, any>> {
  /**
   * Collection d'éléments à afficher
   */
  items: T[];

  /**
   * Identifiant unique pour chaque élément (par défaut: 'id')
   */
  idField?: keyof T;

  /**
   * Titre de la section
   */
  title?: string;

  /**
   * Sous-titre ou description de la section
   */
  description?: string;

  /**
   * Texte du bouton d'ajout
   */
  addButtonText?: string;

  /**
   * Texte affiché quand la collection est vide
   */
  emptyStateTitle?: string;

  /**
   * Description affichée quand la collection est vide
   */
  emptyStateDescription?: string;

  /**
   * Texte du bouton d'ajout dans l'état vide
   */
  emptyStateButtonText?: string;

  /**
   * Indique si les données sont en cours de chargement
   */
  loading?: boolean;

  /**
   * Indique si les éléments peuvent être réordonnés
   */
  sortable?: boolean;

  /**
   * Texte de confirmation pour la suppression
   */
  deleteConfirmationText?: string;

  /**
   * Titre de la boîte de dialogue de confirmation de suppression
   */
  deleteConfirmationTitle?: string;

  /**
   * Indique si la confirmation de suppression est activée
   */
  confirmDelete?: boolean;
}
```

##### Events

```typescript
export interface CollectionManagerEmits<T extends Record<string, any>> {
  /**
   * Émis lorsque l'utilisateur clique sur le bouton d'ajout
   */
  (e: "add"): void;

  /**
   * Émis lorsque l'utilisateur clique sur le bouton d'édition d'un élément
   */
  (e: "edit", item: T): void;

  /**
   * Émis lorsque l'utilisateur confirme la suppression d'un élément
   */
  (e: "delete", item: T): void;

  /**
   * Émis lorsque l'utilisateur réordonne les éléments
   */
  (e: "reorder", newOrder: T[]): void;
}
```

##### Slots

```typescript
/**
 * Slots disponibles pour la personnalisation
 */
export interface CollectionManagerSlots<T extends Record<string, any>> {
  /**
   * Slot pour personnaliser l'en-tête de la section
   * @param title - Titre de la section
   * @param description - Description de la section
   */
  header: (props: { title?: string; description?: string }) => any;

  /**
   * Slot pour personnaliser le bouton d'ajout
   * @param text - Texte du bouton
   */
  addButton: (props: { text?: string }) => any;

  /**
   * Slot pour personnaliser l'affichage d'un élément
   * @param item - Élément à afficher
   * @param index - Index de l'élément dans la collection
   */
  item: (props: { item: T; index: number }) => any;

  /**
   * Slot pour personnaliser les actions sur un élément
   * @param item - Élément concerné
   * @param index - Index de l'élément dans la collection
   */
  itemActions: (props: { item: T; index: number }) => any;

  /**
   * Slot pour personnaliser l'état vide
   * @param title - Titre de l'état vide
   * @param description - Description de l'état vide
   */
  empty: (props: { title?: string; description?: string }) => any;

  /**
   * Slot pour personnaliser l'état de chargement
   */
  loading: () => any;

  /**
   * Slot pour personnaliser l'icône d'ajout
   */
  addIcon: () => any;

  /**
   * Slot pour personnaliser l'icône d'édition
   */
  editIcon: () => any;

  /**
   * Slot pour personnaliser l'icône de suppression
   */
  deleteIcon: () => any;

  /**
   * Slot pour personnaliser l'icône de déplacement (pour le tri)
   */
  moveIcon: () => any;
}
```

#### Structure du Template

```vue
<template>
  <div class="collection-manager">
    <!-- Header avec titre et bouton d'ajout -->
    <div class="collection-header">
      <slot name="header" :title="title" :description="description">
        <div>
          <h2 v-if="title" class="text-xl font-semibold">{{ title }}</h2>
          <p v-if="description" class="text-neutral-400 text-sm">
            {{ description }}
          </p>
        </div>
      </slot>

      <slot name="addButton" :text="addButtonText">
        <Button
          variant="primary"
          size="md"
          :disabled="loading"
          @click="$emit('add')"
        >
          <template #icon>
            <slot name="addIcon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </slot>
          </template>
          {{ addButtonText }}
        </Button>
      </slot>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="collection-loading">
      <slot name="loading">
        <div class="py-12 flex justify-center">
          <svg
            class="animate-spin h-8 w-8 text-primary-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </slot>
    </div>

    <!-- État vide -->
    <div v-else-if="!items || items.length === 0" class="collection-empty">
      <slot
        name="empty"
        :title="emptyStateTitle"
        :description="emptyStateDescription"
      >
        <EmptyState
          :title="emptyStateTitle"
          :description="emptyStateDescription"
          :actionLabel="emptyStateButtonText"
          @action="$emit('add')"
        >
          <template #icon>
            <slot name="emptyIcon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </slot>
          </template>
        </EmptyState>
      </slot>
    </div>

    <!-- Liste des éléments -->
    <div v-else class="collection-items space-y-4">
      <component
        :is="sortable ? 'draggable' : 'div'"
        v-bind="
          sortable
            ? {
                list: items,
                handle: '.handle',
                animation: 150,
                'item-key': idKey,
              }
            : {}
        "
        class="space-y-4"
        @change="handleReorder"
      >
        <template #item="{ element, index }">
          <Card class="collection-item transition-all duration-200">
            <div class="flex items-start">
              <!-- Poignée de tri (si activé) -->
              <div v-if="sortable" class="handle p-1 cursor-move">
                <slot name="moveIcon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-neutral-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                </slot>
              </div>

              <!-- Contenu de l'élément -->
              <div class="flex-grow">
                <slot name="item" :item="element" :index="index">
                  <!-- Contenu par défaut si aucun slot n'est fourni -->
                  <div>{{ element.toString() }}</div>
                </slot>
              </div>

              <!-- Actions sur l'élément -->
              <div class="flex flex-col space-y-2">
                <slot name="itemActions" :item="element" :index="index">
                  <button
                    type="button"
                    @click="$emit('edit', element)"
                    class="p-1 rounded text-neutral-400 hover:bg-primary-500/20 hover:text-primary-400 transition-colors"
                    title="Modifier"
                  >
                    <slot name="editIcon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        ></path>
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        ></path>
                      </svg>
                    </slot>
                  </button>

                  <button
                    type="button"
                    @click="handleDelete(element)"
                    class="p-1 rounded text-neutral-400 hover:bg-error-500/20 hover:text-error-400 transition-colors"
                    title="Supprimer"
                  >
                    <slot name="deleteIcon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        ></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </slot>
                  </button>
                </slot>
              </div>
            </div>
          </Card>
        </template>
      </component>
    </div>

    <!-- Modal de confirmation de suppression -->
    <ConfirmationModal
      v-if="showDeleteConfirmation"
      :title="deleteConfirmationTitle"
      :message="deleteConfirmationText"
      @confirm="confirmDeleteItem"
      @cancel="cancelDelete"
    />
  </div>
</template>
```

#### Logique d'Interaction

```typescript
<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, defineSlots, withDefaults } from 'vue'
import Button from '@ui/components/shared/Button.vue'
import Card from '@ui/components/shared/Card.vue'
import EmptyState from '@ui/components/shared/EmptyState.vue'
import ConfirmationModal from '@ui/components/shared/ConfirmationModal.vue'

// Définition des props avec valeurs par défaut
const props = withDefaults(defineProps<CollectionManagerProps<any>>(), {
  idField: 'id',
  addButtonText: 'Ajouter',
  emptyStateTitle: 'Aucun élément',
  emptyStateDescription: 'Commencez par ajouter un élément',
  emptyStateButtonText: 'Ajouter',
  loading: false,
  sortable: false,
  deleteConfirmationTitle: 'Confirmer la suppression',
  deleteConfirmationText: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
  confirmDelete: true
})

// Définition des événements
const emit = defineEmits<CollectionManagerEmits<any>>()

// Définition des slots
defineSlots<CollectionManagerSlots<any>>()

// État local
const showDeleteConfirmation = ref(false)
const itemToDelete = ref<any | null>(null)

// Computed pour la clé d'identification
const idKey = computed(() => props.idField)

// Gestion de la suppression
const handleDelete = (item: any) => {
  if (props.confirmDelete) {
    itemToDelete.value = item
    showDeleteConfirmation.value = true
  } else {
    emit('delete', item)
  }
}

// Confirmation de suppression
const confirmDeleteItem = () => {
  if (itemToDelete.value) {
    emit('delete', itemToDelete.value)
    cancelDelete()
  }
}

// Annulation de suppression
const cancelDelete = () => {
  showDeleteConfirmation.value = false
  itemToDelete.value = null
}

// Gestion du réordonnancement
const handleReorder = (event: any) => {
  if (props.sortable && event.moved) {
    emit('reorder', props.items)
  }
}
</script>
```

#### Stratégie de Personnalisation via Slots

Le composant `CollectionManager` utilise une approche basée sur les slots pour offrir une flexibilité maximale tout en maintenant une structure cohérente. Cette stratégie permet :

1. **Personnalisation complète de l'affichage des éléments** :

   - Le slot `item` permet de définir comment chaque élément est affiché
   - Le parent a un contrôle total sur le rendu tout en bénéficiant de la gestion standardisée

2. **Personnalisation des actions** :

   - Le slot `itemActions` permet de personnaliser ou d'étendre les actions disponibles sur chaque élément
   - Possibilité d'ajouter des actions spécifiques au contexte

3. **Personnalisation des états spéciaux** :

   - Slots pour l'état vide (`empty`), l'état de chargement (`loading`)
   - Permet d'adapter ces états au contexte spécifique

4. **Personnalisation des icônes** :

   - Slots dédiés pour chaque icône (`addIcon`, `editIcon`, `deleteIcon`, `moveIcon`)
   - Permet de maintenir une cohérence visuelle avec le reste de l'application

5. **Personnalisation de l'en-tête** :
   - Le slot `header` permet de personnaliser l'affichage du titre et de la description
   - Utile pour des mises en page spécifiques ou l'ajout d'éléments supplémentaires

Cette approche offre un équilibre entre standardisation (structure, comportement) et flexibilité (apparence, contenu), permettant au composant de s'adapter à différents contextes tout en maintenant une expérience utilisateur cohérente.

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
