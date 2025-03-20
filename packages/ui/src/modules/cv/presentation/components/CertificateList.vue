<template>
  <div class="space-y-6">
    <CollectionManager
      :items="certificates"
      :title="t(TRANSLATION_KEYS.RESUME.CERTIFICATES.LIST.TITLE)"
      :description="t(TRANSLATION_KEYS.RESUME.CERTIFICATES.LIST.DESCRIPTION)"
      :addButtonText="t(TRANSLATION_KEYS.RESUME.CERTIFICATES.LIST.ADD_BUTTON)"
      :emptyStateTitle="t(TRANSLATION_KEYS.RESUME.CERTIFICATES.LIST.EMPTY_STATE_TITLE)"
      :emptyStateDescription="t(TRANSLATION_KEYS.RESUME.CERTIFICATES.LIST.EMPTY_STATE_DESCRIPTION)"
      :loading="loading.certificates"
      @add="openAddDialog"
      @edit="openEditDialog"
      @delete="confirmDelete"
      @reorder="handleReorder"
    >
      <template #emptyIcon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      </template>
      
      <template #item="{ item: certificate }">
        <div class="flex-grow">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 class="font-semibold text-lg">{{ certificate.name }}</h3>
            <span class="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-xs font-medium">
              {{ certificate.issuer }}
            </span>
          </div>
          
          <div class="flex items-center text-neutral-400 text-sm mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{{ formatDate(certificate.date) }}</span>
          </div>
          
          <div v-if="certificate.url" class="mb-3">
            <a :href="certificate.url" target="_blank" rel="noopener noreferrer" class="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              {{ safeTranslate('resume.certificates.list.viewCertification', 'Voir la certification') }}
            </a>
          </div>
        </div>
      </template>
      
      <template #item-actions="{ item, index }">
        <div class="flex gap-1">
          <!-- Boutons de réorganisation (optionnels, car CollectionManager supporte déjà le drag-and-drop) -->
          <button
            type="button"
            @click="moveUp(index)"
            :disabled="index === 0"
            class="p-1 rounded text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
            :title="t(TRANSLATION_KEYS.RESUME.CERTIFICATES.LIST.MOVE_UP)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          
          <button
            type="button"
            @click="moveDown(index)"
            :disabled="index === certificates.length - 1"
            class="p-1 rounded text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
            :title="t(TRANSLATION_KEYS.RESUME.CERTIFICATES.LIST.MOVE_DOWN)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <!-- Boutons d'édition et de suppression -->
          <button
            type="button"
            @click="openEditDialog(item)"
            class="p-1 rounded text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
            :title="t(TRANSLATION_KEYS.COMMON.ACTIONS.EDIT)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          
          <button
            type="button"
            @click="confirmDelete(item)"
            class="p-1 rounded text-neutral-400 hover:bg-red-700 hover:text-white transition-colors"
            :title="t(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </template>
      
      <!-- Empty state -->
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-10 text-center">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-4">
            <path d="M47.5454 63.2727C57.4694 63.2727 65.5454 55.1967 65.5454 45.2727C65.5454 35.3487 57.4694 27.2727 47.5454 27.2727C37.6214 27.2727 29.5454 35.3487 29.5454 45.2727C29.5454 55.1967 37.6214 63.2727 47.5454 63.2727Z" stroke="#4338CA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M47.5455 54.5455C52.6775 54.5455 56.8183 50.4047 56.8183 45.2727C56.8183 40.1408 52.6775 36 47.5455 36C42.4135 36 38.2728 40.1408 38.2728 45.2727C38.2728 50.4047 42.4135 54.5455 47.5455 54.5455Z" stroke="#4338CA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M38.2727 69.8182H12V76.3636C12 76.3636 18.5455 82.9091 25.0909 82.9091C31.6364 82.9091 38.2727 76.3636 38.2727 76.3636V69.8182Z" stroke="#4338CA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M56.8182 69.8182H83.0909V76.3636C83.0909 76.3636 76.5454 82.9091 70 82.9091C63.4545 82.9091 56.8182 76.3636 56.8182 76.3636V69.8182Z" stroke="#4338CA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M47.5454 63.2727V84" stroke="#4338CA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M80 14.9091L65.5454 20L80 25.0909L85.0909 38L91.6364 25.0909L80 14.9091Z" stroke="#4338CA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3 class="text-lg font-medium text-neutral-200 mb-1">{{ t(TRANSLATION_KEYS.RESUME.CERTIFICATES.LIST.EMPTY_STATE_TITLE) }}</h3>
          <p class="text-sm text-neutral-400 max-w-md">
            {{ t(TRANSLATION_KEYS.RESUME.CERTIFICATES.LIST.EMPTY_STATE_DESCRIPTION) }}
          </p>
        </div>
      </template>
    </CollectionManager>
    
    <!-- Dialog for adding/editing certificates -->
    <div v-if="showDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6">
          <CertificateForm
            v-model="editingCertificate"
            :loading="loading.updating || loading.creating"
            :is-new="dialogMode === 'add'"
            @validate="saveCertificate"
            @cancel="closeDialog"
          />
        </div>
      </div>
    </div>
    
    <!-- Confirmation dialog for deleting certificates -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-4">{{ safeTranslate('resume.certificates.list.confirmDelete', 'Supprimer cette certification') }}</h3>
          <p class="mb-6 text-neutral-300">
            {{ safeTranslate('resume.certificates.list.deleteWarning', 'Êtes-vous sûr de vouloir supprimer cette certification ? Cette action est irréversible.') }}
          </p>
          
          <div class="flex justify-end space-x-4">
            <Button 
              variant="ghost"
              @click="cancelDelete"
            >
              {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL) }}
            </Button>
            <Button 
              variant="danger"
              :loading="loading.deleting"
              @click="deleteCertificate"
            >
              {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE) }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CertificateWithId } from '@ui/modules/cv/presentation/stores/certificate'
import type { CertificateInterface } from '@cv-generator/shared/src/types/resume.interface'
import { useCertificateStore } from '@ui/modules/cv/presentation/stores/certificate'
import { computed, onMounted, ref } from 'vue'
import Button from '@ui/components/shared/Button.vue'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'
import CertificateForm from './CertificateForm.vue'
import { useCollectionField } from '@ui/modules/cv/presentation/composables/useCollectionField'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

// Fonction de traduction
const { t } = useI18n()

// Fonction pour gérer les erreurs de traduction
const safeTranslate = (key: string, fallback: string) => {
  try {
    const translation = t(key)
    return translation !== key ? translation : fallback
  } catch (e) {
    return fallback
  }
}

// State for managing the certificate list
const certificateStore = useCertificateStore()

// Set up useCollectionField for managing certificates
const { 
  items: certificates} = useCollectionField<CertificateWithId>({
  fieldName: 'certificates',
  collection: computed(() => certificateStore.certificates || []),
  updateField: () => {}, // Using the store directly
  defaultItemValues: {
    id: '',
    name: '',
    date: '',
    issuer: '',
    url: ''
  },
  identifierField: 'id'
})

const loading = computed(() => certificateStore.loading)

// Active dialog state
const showDialog = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingCertificateIndex = ref<number | null>(null)
const editingCertificate = ref<CertificateInterface>({
  name: '',
  date: '',
  issuer: '',
  url: ''
})

// Confirmation dialog state
const showDeleteConfirmation = ref(false)
const certificateToDelete = ref<CertificateWithId | null>(null)

// Load certificates on component mount
onMounted(async () => {
  await certificateStore.loadCertificates()
})

// Format date for display
const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('fr-FR', options)
}

// Open dialog for adding a new certificate
const openAddDialog = () => {
  editingCertificate.value = {
    name: '',
    date: '',
    issuer: '',
    url: ''
  }
  dialogMode.value = 'add'
  showDialog.value = true
}

// Open dialog for editing an existing certificate
const openEditDialog = (certificate: CertificateWithId) => {
  editingCertificate.value = { ...certificate }
  editingCertificateIndex.value = certificates.value.findIndex(c => c.id === certificate.id)
  dialogMode.value = 'edit'
  showDialog.value = true
}

// Close dialog
const closeDialog = () => {
  showDialog.value = false
  editingCertificateIndex.value = null
}

// Save certificate
const saveCertificate = async () => {
  try {
    if (dialogMode.value === 'add') {
      await certificateStore.addCertificate(editingCertificate.value)
    } else if (dialogMode.value === 'edit' && editingCertificateIndex.value !== null) {
      const certificate = certificates.value[editingCertificateIndex.value]
      await certificateStore.updateCertificate({
        ...editingCertificate.value,
        id: certificate.id
      })
    }
    closeDialog()
  } catch (error) {}
}

// Open delete confirmation dialog
const confirmDelete = (certificate: CertificateWithId) => {
  certificateToDelete.value = certificate
  showDeleteConfirmation.value = true
}

// Cancel delete operation
const cancelDelete = () => {
  showDeleteConfirmation.value = false
  setTimeout(() => {
    certificateToDelete.value = null
  }, 300)
}

// Delete certificate
const deleteCertificate = async () => {
  if (!certificateToDelete.value) return
  
  try {
    await certificateStore.deleteCertificate(certificateToDelete.value.id)
    showDeleteConfirmation.value = false
  } catch (error) {}
}

// Reorder certificates up
const moveUp = async (index: number) => {
  if (index <= 0) return
  
  try {
    // Swap the items directly in a new array
    const newOrder = [...certificates.value]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index - 1]
    newOrder[index - 1] = temp
    
    await certificateStore.reorderCertificates(newOrder)
  } catch (error) {}
}

// Reorder certificates down
const moveDown = async (index: number) => {
  if (index >= certificates.value.length - 1) return
  
  try {
    // Swap the items directly in a new array
    const newOrder = [...certificates.value]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index + 1]
    newOrder[index + 1] = temp
    
    await certificateStore.reorderCertificates(newOrder)
  } catch (error) {}
}

// Function to handle reordering from CollectionManager
const handleReorder = async (newOrder: string[]) => {
  try {
    // Convert string IDs to CertificateWithId objects
    const orderedCertificates = newOrder
      .map(id => certificates.value.find(cert => cert.id === id))
      .filter((cert): cert is CertificateWithId => cert !== undefined)
    
    await certificateStore.reorderCertificates(orderedCertificates)
  } catch (error) {
    console.error('Error reordering certificates:', error)
  }
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style>
