<template>
  <Form 
    :loading="loading"
    :title="isEditing ? 'Modifier l\'intérêt' : 'Ajouter un intérêt'"
    :subtitle="isEditing ? 'Mettez à jour les informations de cet intérêt.' : 'Ajoutez un nouvel intérêt à votre CV.'"
    @submit="saveInterest"
  >
    <div class="grid grid-cols-1 gap-6">
      <!-- Champ pour le nom de l'intérêt -->
      <FormField
        name="name"
        label="Intérêt"
        :model-value="form.name"
        :error="errors.name"
        :icon="icons.interest"
        placeholder="Programmation, Photographie, Voyages..."
        help-text="Nom de l'intérêt ou de l'activité."
        required
        @update:model-value="(value) => form.name = value"
        @blur="validateField('name', form.name)"
      />
      
      <!-- Champ pour les mots-clés -->
      <div>
        <label class="block text-sm font-medium text-neutral-200 mb-1">Mots-clés</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <div 
            v-for="(keyword, index) in form.keywords" 
            :key="index"
            class="flex items-center bg-neutral-800 px-3 py-1 rounded-full"
          >
            <span class="mr-2 text-sm">{{ keyword }}</span>
            <button 
              type="button" 
              class="text-neutral-400 hover:text-white"
              @click="removeKeyword(index)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="flex">
          <FormField
            name="newKeyword"
            label="Nouveau mot-clé"
            :model-value="newKeyword"
            :icon="icons.keyword"
            placeholder="Ajouter un mot-clé..."
            class="flex-grow"
            @update:model-value="(value) => newKeyword = value"
            @keydown.enter.prevent="addKeyword"
          />
          <button
            type="button"
            class="ml-2 px-3 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
            @click="addKeyword"
          >
            Ajouter
          </button>
        </div>
        <p class="text-neutral-400 text-xs mt-1">
          Appuyez sur Entrée ou cliquez sur Ajouter pour ajouter un mot-clé.
        </p>
        <p v-if="errors.keywords" class="text-error-500 text-xs mt-1">
          {{ errors.keywords }}
        </p>
      </div>
    </div>
    
    <!-- Boutons d'action -->
    <div class="flex justify-end space-x-4 mt-8">
      <button
        type="button"
        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
        @click="cancel"
      >
        Annuler
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting" class="flex items-center">
          <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
        </span>
        <span v-else>
          {{ isEditing ? 'Enregistrer' : 'Ajouter' }}
        </span>
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useInterestStore } from '../stores/interest'
import type { InterestInterface } from '@cv-generator/shared/src/types/resume.interface'

// Props
const props = defineProps<{
  interestId: string | null
}>()

// Emits
const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancelled'): void
}>()

// Store
const interestStore = useInterestStore()

// State
const form = ref<InterestInterface>({
  name: '',
  keywords: []
})

const errors = ref({
  name: '',
  keywords: ''
})

const loading = ref(false)
const isSubmitting = ref(false)
const newKeyword = ref('')

// Computed
const isEditing = computed(() => !!props.interestId)

// Methods
const loadInterest = async () => {
  if (!props.interestId || !interestStore.interests) return
  
  loading.value = true
  
  try {
    // Load interests if not already loaded
    if (!interestStore.interests) {
      await interestStore.loadInterests()
    }
    
    // Find the interest by ID
    const interest = interestStore.interests.find(i => i.id === props.interestId)
    
    if (interest) {
      form.value = {
        name: interest.name,
        keywords: [...interest.keywords] // Clone the array to prevent mutations
      }
    } else {
      console.error('Interest not found')
    }
  } catch (error) {
    console.error('Failed to load interest:', error)
  } finally {
    loading.value = false
  }
}

const validateField = (field: keyof InterestInterface, value: any): boolean => {
  if (field === 'name') {
    if (!value || !value.trim()) {
      errors.value.name = 'Veuillez entrer un nom d\'intérêt'
      return false
    }
  } else if (field === 'keywords') {
    // Keywords are optional, but we might want to validate their format
    if (value && !Array.isArray(value)) {
      errors.value.keywords = 'Format de mots-clés invalide'
      return false
    }
  }
  
  // Use indexing with type safety
  if (field === 'name' || field === 'keywords') {
    errors.value[field] = ''
  }
  
  return true
}

const validateForm = (): boolean => {
  let isValid = true
  
  isValid = validateField('name', form.value.name) && isValid
  isValid = validateField('keywords', form.value.keywords) && isValid
  
  return isValid
}

const addKeyword = () => {
  if (!newKeyword.value.trim()) return
  
  // Add the keyword if it doesn't already exist
  const keyword = newKeyword.value.trim()
  if (!form.value.keywords) {
    form.value.keywords = []
  }
  
  if (!form.value.keywords.includes(keyword)) {
    form.value.keywords.push(keyword)
  }
  
  // Clear the input
  newKeyword.value = ''
}

const removeKeyword = (index: number) => {
  if (form.value.keywords && index >= 0 && index < form.value.keywords.length) {
    form.value.keywords.splice(index, 1)
  }
}

const saveInterest = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    if (isEditing.value && props.interestId) {
      // Update existing interest
      await interestStore.updateInterest(props.interestId, form.value)
    } else {
      // Add new interest
      await interestStore.addInterest(form.value)
    }
    
    emit('saved')
  } catch (error) {
    console.error('Failed to save interest:', error)
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  emit('cancelled')
}

// Icônes pour les champs du formulaire
const icons = {
  interest: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1-5.16V14a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1 2 2 0 1 0-2-2 1 1 0 0 1-2 0 4 4 0 1 1 5 3.84z"></path></svg>`,
  keyword: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`
}

// Lifecycle
onMounted(async () => {
  if (props.interestId) {
    await loadInterest()
  }
})
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style> 