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
      
      <template #itemActions="{ item: certificate, index }">
        <div class="flex flex-col gap-2">
          <!-- Reorder buttons -->
          <div class="flex gap-1">
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
          </div>
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
  items: certificates,
  reorderItems
} = useCollectionField<CertificateWithId>({
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
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style>
