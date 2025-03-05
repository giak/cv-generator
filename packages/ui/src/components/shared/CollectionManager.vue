<template>
  <div class="collection-manager">
    <!-- En-tête avec titre et bouton d'ajout -->
    <div class="flex justify-between items-start mb-4">
      <slot name="header" :title="title" :description="description">
        <div>
          <h2 v-if="title" class="text-xl font-semibold">{{ title }}</h2>
          <p v-if="description" class="text-neutral-400 text-sm">{{ description }}</p>
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
        >
          <Button
            variant="primary"
            size="md"
            @click="$emit('add')"
          >
            {{ emptyStateButtonText }}
          </Button>
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
      <div class="space-y-4">
        <Card 
          v-for="(item, index) in items" 
          :key="getItemKey(item)"
          class="collection-item transition-all duration-200"
        >
          <div class="flex items-start">
            <!-- Contenu de l'élément -->
            <div class="flex-grow">
              <slot name="item" :item="item" :index="index">
                <!-- Contenu par défaut si aucun slot n'est fourni -->
                <div>{{ item.toString() }}</div>
              </slot>
            </div>
            
            <!-- Actions sur l'élément -->
            <div class="flex flex-col space-y-2">
              <slot name="itemActions" :item="item" :index="index">
                <button
                  type="button"
                  @click="$emit('edit', item)"
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
                  @click="handleDelete(item)"
                  class="p-1 rounded text-neutral-400 hover:bg-danger-500/20 hover:text-danger-400 transition-colors"
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
      </div>
    </div>
    
    <!-- Modal de confirmation de suppression -->
    <ConfirmationModal
      v-model="showDeleteConfirmation"
      :title="deleteConfirmationTitle"
      :message="deleteConfirmationText"
      @confirm="confirmDeleteItem"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, withDefaults } from 'vue'
import Button from './Button.vue'
import Card from './Card.vue'
import EmptyState from './EmptyState.vue'
import ConfirmationModal from './ConfirmationModal.vue'

/**
 * Props du composant CollectionManager
 */
interface CollectionManagerProps<T extends Record<string, any>> {
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

/**
 * Événements émis par le composant CollectionManager
 */
interface CollectionManagerEmits<T extends Record<string, any>> {
  /**
   * Émis lorsque l'utilisateur clique sur le bouton d'ajout
   */
  (e: 'add'): void;
  
  /**
   * Émis lorsque l'utilisateur clique sur le bouton d'édition d'un élément
   */
  (e: 'edit', item: T): void;
  
  /**
   * Émis lorsque l'utilisateur confirme la suppression d'un élément
   */
  (e: 'delete', item: T): void;
}

// Définition des props avec valeurs par défaut
const props = withDefaults(defineProps<CollectionManagerProps<any>>(), {
  idField: 'id',
  addButtonText: 'Ajouter',
  emptyStateTitle: 'Aucun élément',
  emptyStateDescription: 'Commencez par ajouter un élément',
  emptyStateButtonText: 'Ajouter',
  loading: false,
  deleteConfirmationTitle: 'Confirmer la suppression',
  deleteConfirmationText: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
  confirmDelete: true
})

// Définition des événements
const emit = defineEmits<CollectionManagerEmits<any>>()

// État local
const showDeleteConfirmation = ref(false)
const itemToDelete = ref<any | null>(null)

/**
 * Récupère la clé unique d'un élément
 */
const getItemKey = (item: any) => {
  return item[props.idField as string]
}

/**
 * Gestion de la suppression
 */
const handleDelete = (item: any) => {
  if (props.confirmDelete) {
    itemToDelete.value = item
    showDeleteConfirmation.value = true
  } else {
    emit('delete', item)
  }
}

/**
 * Confirmation de suppression
 */
const confirmDeleteItem = () => {
  if (itemToDelete.value) {
    emit('delete', itemToDelete.value)
    cancelDelete()
  }
}

/**
 * Annulation de suppression
 */
const cancelDelete = () => {
  showDeleteConfirmation.value = false
  itemToDelete.value = null
}
</script>

<style scoped>
.collection-item:hover {
  @apply bg-neutral-750;
}
</style> 