<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-bold">Certifications</h2>
        <p class="text-neutral-400 text-sm">
          Gérez vos certifications et diplômes professionnels
        </p>
      </div>
      
      <Button
        @click="openAddDialog"
        variant="primary"
        size="md"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </template>
        Ajouter une certification
      </Button>
    </div>

    <!-- État de chargement -->
    <div v-if="loading.certificates" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-3 text-neutral-400">Chargement des certifications...</span>
    </div>

    <!-- État vide -->
    <EmptyState 
      v-else-if="!certificates.length"
      title="Aucune certification"
      description="Commencez par ajouter une certification pour enrichir votre CV."
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      </template>
      
      <Button 
        variant="primary"
        size="md"
        @click="openAddDialog"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </template>
        Ajouter une certification
      </Button>
    </EmptyState>

    <!-- Liste des certifications -->
    <div v-else class="space-y-4">
      <Card
        v-for="(certificate, index) in certificates"
        :key="`certificate-${certificate.id}`"
        class="hover:border-indigo-500/50 transition-colors"
      >
        <div class="flex flex-col md:flex-row justify-between">
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
                Voir la certification
              </a>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex mt-4 md:mt-0 md:ml-4 md:flex-col space-x-2 md:space-x-0 md:space-y-2">
            <button
              type="button"
              @click="openEditDialog(certificate, index)"
              class="p-1 rounded text-neutral-400 hover:bg-primary-500/20 hover:text-primary-400 transition-colors"
              title="Modifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            
            <button
              type="button"
              @click="confirmDelete(certificate)"
              class="p-1 rounded text-neutral-400 hover:bg-error-500/20 hover:text-error-400 transition-colors"
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
      </Card>
    </div>
    
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
          <h3 class="text-xl font-semibold mb-4">Supprimer cette certification</h3>
          <p class="mb-6 text-neutral-300">
            Êtes-vous sûr de vouloir supprimer cette certification ? Cette action est irréversible.
          </p>
          
          <div class="flex justify-end space-x-4">
            <Button 
              variant="ghost"
              @click="cancelDelete"
            >
              Annuler
            </Button>
            <Button 
              variant="danger"
              :loading="loading.deleting"
              @click="deleteCertificate"
            >
              Supprimer
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
import Card from '@ui/components/shared/Card.vue'
import Button from '@ui/components/shared/Button.vue'
import EmptyState from '@ui/components/shared/EmptyState.vue'
import CertificateForm from './CertificateForm.vue'

// State for managing the certificate list
const certificateStore = useCertificateStore()
const certificates = computed(() => certificateStore.certificates || [])
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
const openEditDialog = (certificate: CertificateWithId, index: number) => {
  editingCertificate.value = { ...certificate }
  editingCertificateIndex.value = index
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
  } catch (error) {
    console.error('Error saving certificate:', error)
  }
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
  } catch (error) {
    console.error('Error deleting certificate:', error)
  }
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style> 