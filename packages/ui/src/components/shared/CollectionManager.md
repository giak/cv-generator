# CollectionManager

Le composant `CollectionManager` est un composant réutilisable pour gérer des collections d'éléments. Il fournit une interface utilisateur cohérente pour afficher, ajouter, éditer et supprimer des éléments d'une collection.

## Fonctionnalités

- Affichage d'une liste d'éléments avec des actions (édition, suppression)
- Bouton d'ajout d'un nouvel élément
- État vide avec message et bouton d'ajout
- État de chargement
- Confirmation de suppression
- Personnalisation via slots

## Utilisation de base

```vue
<template>
  <CollectionManager
    :items="skills"
    title="Compétences"
    description="Ajoutez vos compétences professionnelles"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
  >
    <template #item="{ item }">
      <div class="flex flex-col">
        <h3 class="font-medium">{{ item.name }}</h3>
        <p class="text-sm text-neutral-400">{{ item.level }}</p>
      </div>
    </template>
  </CollectionManager>
</template>

<script setup>
import { ref } from "vue";
import CollectionManager from "@ui/components/shared/CollectionManager.vue";

const skills = ref([
  { id: "1", name: "JavaScript", level: "Expert" },
  { id: "2", name: "Vue.js", level: "Avancé" },
  { id: "3", name: "TypeScript", level: "Intermédiaire" },
]);

const handleAdd = () => {
  // Logique pour ajouter un élément
};

const handleEdit = (item) => {
  // Logique pour éditer un élément
};

const handleDelete = (item) => {
  // Logique pour supprimer un élément
};
</script>
```

## Intégration avec useCollectionField

Le composant `CollectionManager` est conçu pour fonctionner avec le composable `useCollectionField` pour une gestion complète des collections.

```vue
<template>
  <div>
    <CollectionManager
      :items="items.value"
      title="Expériences professionnelles"
      description="Ajoutez vos expériences professionnelles"
      @add="isAddingItem = true"
      @edit="startEditingItem"
      @delete="removeItem"
    >
      <template #item="{ item }">
        <div class="flex flex-col">
          <h3 class="font-medium">{{ item.title }}</h3>
          <p class="text-sm">{{ item.company }}</p>
          <p class="text-xs text-neutral-400">
            {{ formatDateRange(item.startDate, item.endDate) }}
          </p>
        </div>
      </template>
    </CollectionManager>

    <!-- Formulaire d'ajout/édition -->
    <Dialog v-model="isAddingItem || !!editingItemId">
      <WorkForm
        v-if="isAddingItem"
        :work="newItem"
        @save="addItem"
        @cancel="isAddingItem = false"
      />
      <WorkForm
        v-else-if="editingItemId"
        :work="currentEditingItem"
        @save="updateCurrentItem"
        @cancel="cancelEditing"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCollectionField } from "@ui/modules/cv/presentation/composables/useCollectionField";
import CollectionManager from "@ui/components/shared/CollectionManager.vue";
import WorkForm from "./WorkForm.vue";
import Dialog from "@ui/components/shared/Dialog.vue";

// Modèle du formulaire
const model = ref({
  works: [],
});

// Utilisation du composable useCollectionField
const {
  items,
  newItem,
  isAddingItem,
  editingItemId,
  addItem,
  removeItem,
  updateItem,
  startEditing,
  cancelEditing,
} = useCollectionField({
  fieldName: "works",
  updateField: (field, value) => (model.value[field] = value),
  collection: computed(() => model.value.works),
  defaultItemValues: {
    id: "",
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  },
});

// Item en cours d'édition
const currentEditingItem = ref(null);

// Démarrer l'édition d'un élément
const startEditingItem = (item) => {
  currentEditingItem.value = startEditing(item.id);
};

// Mettre à jour l'élément en cours d'édition
const updateCurrentItem = () => {
  if (currentEditingItem.value && editingItemId.value) {
    updateItem(editingItemId.value, currentEditingItem.value);
  }
};

// Formater une plage de dates
const formatDateRange = (start, end) => {
  return `${start} - ${end || "Présent"}`;
};
</script>
```

## Props

| Prop                      | Type      | Default                                                                             | Description                                                  |
| ------------------------- | --------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `items`                   | `Array`   | Required                                                                            | Collection d'éléments à afficher                             |
| `idField`                 | `String`  | `'id'`                                                                              | Champ utilisé comme identifiant unique                       |
| `title`                   | `String`  | `undefined`                                                                         | Titre de la section                                          |
| `description`             | `String`  | `undefined`                                                                         | Description de la section                                    |
| `addButtonText`           | `String`  | `'Ajouter'`                                                                         | Texte du bouton d'ajout                                      |
| `emptyStateTitle`         | `String`  | `'Aucun élément'`                                                                   | Titre affiché quand la collection est vide                   |
| `emptyStateDescription`   | `String`  | `'Commencez par ajouter un élément'`                                                | Description affichée quand la collection est vide            |
| `emptyStateButtonText`    | `String`  | `'Ajouter'`                                                                         | Texte du bouton d'ajout dans l'état vide                     |
| `loading`                 | `Boolean` | `false`                                                                             | Indique si les données sont en cours de chargement           |
| `deleteConfirmationTitle` | `String`  | `'Confirmer la suppression'`                                                        | Titre de la boîte de dialogue de confirmation de suppression |
| `deleteConfirmationText`  | `String`  | `'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.'` | Texte de confirmation pour la suppression                    |
| `confirmDelete`           | `Boolean` | `true`                                                                              | Indique si la confirmation de suppression est activée        |

## Events

| Event    | Payload | Description                                                            |
| -------- | ------- | ---------------------------------------------------------------------- |
| `add`    | None    | Émis lorsque l'utilisateur clique sur le bouton d'ajout                |
| `edit`   | `item`  | Émis lorsque l'utilisateur clique sur le bouton d'édition d'un élément |
| `delete` | `item`  | Émis lorsque l'utilisateur confirme la suppression d'un élément        |

## Slots

| Slot          | Props                    | Description                             |
| ------------- | ------------------------ | --------------------------------------- |
| `header`      | `{ title, description }` | Personnalise l'en-tête de la section    |
| `addButton`   | `{ text }`               | Personnalise le bouton d'ajout          |
| `item`        | `{ item, index }`        | Personnalise l'affichage d'un élément   |
| `itemActions` | `{ item, index }`        | Personnalise les actions sur un élément |
| `empty`       | `{ title, description }` | Personnalise l'état vide                |
| `loading`     | None                     | Personnalise l'état de chargement       |
| `addIcon`     | None                     | Personnalise l'icône d'ajout            |
| `editIcon`    | None                     | Personnalise l'icône d'édition          |
| `deleteIcon`  | None                     | Personnalise l'icône de suppression     |
| `emptyIcon`   | None                     | Personnalise l'icône de l'état vide     |
