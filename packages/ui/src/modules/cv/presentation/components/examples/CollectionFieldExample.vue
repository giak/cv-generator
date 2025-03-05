<template>
  <div class="space-y-6 p-6 bg-neutral-800 rounded-lg">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold">Collection Field Example</h2>
        <p class="text-neutral-400 text-sm">
          Démonstration du composable useCollectionField
        </p>
      </div>
      
      <button 
        @click="toggleAddForm"
        class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        {{ isAddingItem ? 'Annuler' : 'Ajouter un élément' }}
      </button>
    </div>
    
    <!-- Formulaire d'ajout -->
    <div v-if="isAddingItem" class="bg-neutral-700 p-4 rounded-lg">
      <h3 class="text-lg font-medium mb-4">{{ editingItemId ? 'Modifier l\'élément' : 'Nouvel élément' }}</h3>
      
      <!-- Champs du formulaire -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Titre</label>
          <input 
            v-model="newItem.title" 
            type="text" 
            class="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Entrez un titre"
          />
          <p v-if="validationErrors.title" class="mt-1 text-sm text-red-500">
            {{ validationErrors.title }}
          </p>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
            v-model="newItem.description"
            class="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="2"
            placeholder="Entrez une description"
          ></textarea>
          <p v-if="validationErrors.description" class="mt-1 text-sm text-red-500">
            {{ validationErrors.description }}
          </p>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="cancelOperation"
            class="px-3 py-2 bg-neutral-600 hover:bg-neutral-500 text-white rounded-md"
          >
            Annuler
          </button>
          <button 
            @click="saveItem"
            class="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md"
          >
            {{ editingItemId ? 'Mettre à jour' : 'Ajouter' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Liste des éléments -->
    <div v-if="items.length === 0" class="py-8 text-center bg-neutral-700/30 rounded-lg">
      <p class="text-neutral-400">Aucun élément dans la collection</p>
      <button 
        @click="toggleAddForm"
        class="mt-4 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md inline-flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter le premier élément
      </button>
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="item in items" 
        :key="item.id"
        class="p-4 bg-neutral-700 rounded-lg flex justify-between items-center"
      >
        <div>
          <h3 class="font-medium">{{ item.title }}</h3>
          <p class="text-sm text-neutral-400">{{ item.description }}</p>
        </div>
        
        <div class="flex space-x-2">
          <button 
            @click="editItem(item.id)"
            class="p-2 text-neutral-400 hover:text-white hover:bg-neutral-600 rounded-full"
            title="Modifier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button 
            @click="removeItem(item.id)"
            class="p-2 text-neutral-400 hover:text-red-500 hover:bg-neutral-600 rounded-full"
            title="Supprimer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCollectionField } from '../../composables/useCollectionField'

// Interface pour notre élément de collection
interface CollectionItem {
  id?: string
  title: string
  description: string
}

// Modèle de données parent
const formModel = reactive({
  items: [] as CollectionItem[]
})

// Valeur par défaut pour un nouvel élément
const defaultItem: CollectionItem = {
  title: '',
  description: ''
}

// Fonction de validation d'élément
const validateItem = (item: CollectionItem) => {
  const errors: Record<string, string> = {}
  
  if (!item.title.trim()) {
    errors.title = 'Le titre est requis'
  }
  
  if (item.title.length > 50) {
    errors.title = 'Le titre ne doit pas dépasser 50 caractères'
  }
  
  if (item.description.length > 200) {
    errors.description = 'La description ne doit pas dépasser 200 caractères'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Fonction de mise à jour du champ dans le modèle parent
const updateItemsField = (field: string, value: CollectionItem[]) => {
  formModel[field as keyof typeof formModel] = value
}

// Utilisation du composable useCollectionField
const {
  items,
  newItem,
  isAddingItem,
  editingItemId,
  validationErrors,
  addItem,
  removeItem: removeItemInternal,
  updateItem,
  startEditing,
  resetNewItem,
  toggleAddForm,
  cancelEditing
} = useCollectionField<CollectionItem>({
  fieldName: 'items',
  updateField: updateItemsField,
  collection: () => formModel.items,
  defaultItemValues: defaultItem,
  validateItem,
  enableLogging: true
})

// Fonction pour éditer un élément
const editItem = (id: string | undefined) => {
  if (!id) return;
  
  // Récupérer l'élément à éditer
  const itemToEdit = startEditing(id)
  
  // Mettre à jour newItem avec les valeurs de l'élément
  Object.keys(itemToEdit).forEach(key => {
    const typedKey = key as keyof CollectionItem
    if (typedKey !== 'id') {
      newItem.value[typedKey] = itemToEdit[typedKey]
    }
  })
  
  // Ouvrir le formulaire
  isAddingItem.value = true
}

// Fonction pour sauvegarder un élément (ajout ou mise à jour)
const saveItem = () => {
  if (editingItemId.value) {
    // Mise à jour d'un élément existant
    updateItem(editingItemId.value, newItem.value)
  } else {
    // Ajout d'un nouvel élément
    addItem()
  }
}

// Fonction pour annuler l'opération en cours
const cancelOperation = () => {
  if (editingItemId.value) {
    cancelEditing()
  }
  resetNewItem()
  isAddingItem.value = false
}

// Wrapper sur removeItem pour confirmation
const removeItem = (id: string | undefined) => {
  if (!id) return;
  
  if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
    removeItemInternal(id)
  }
}
</script> 