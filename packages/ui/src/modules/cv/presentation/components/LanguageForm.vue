<template>
  <Form 
    :loading="loading"
    :title="isEditing ? 'Modifier la langue' : 'Ajouter une langue'"
    :subtitle="isEditing ? 'Mettez à jour les informations de cette langue.' : 'Ajoutez une nouvelle langue à votre CV.'"
    @submit="saveLanguage"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Champ pour le nom de la langue -->
      <FormField
        name="language"
        label="Langue"
        :model-value="form.language"
        :error="errors.language"
        :icon="icons.language"
        placeholder="Français, Anglais, Espagnol..."
        help-text="Nom de la langue que vous parlez."
        required
        @update:model-value="(value) => form.language = value"
        @blur="validateField('language', form.language)"
      />
      
      <!-- Champ pour le niveau de compétence -->
      <FormField
        name="fluency"
        label="Niveau de compétence"
        :model-value="form.fluency"
        :error="errors.fluency"
        :icon="icons.fluency"
        placeholder="Courant, Intermédiaire, Débutant..."
        help-text="Votre niveau de maîtrise de cette langue."
        required
        @update:model-value="(value) => form.fluency = value"
        @blur="validateField('fluency', form.fluency)"
      />
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
import { useLanguageStore } from '../stores/language'
import type { LanguageInterface } from '@cv-generator/shared/src/types/resume.interface'

// Props
const props = defineProps<{
  languageId: string | null
}>()

// Emits
const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancelled'): void
}>()

// Store
const languageStore = useLanguageStore()

// State
const form = ref<LanguageInterface>({
  language: '',
  fluency: ''
})

const errors = ref({
  language: '',
  fluency: ''
})

const loading = ref(false)
const isSubmitting = ref(false)

// Computed
const isEditing = computed(() => !!props.languageId)

// Methods
const loadLanguage = async () => {
  if (!props.languageId || !languageStore.languages) return
  
  loading.value = true
  
  try {
    // Load languages if not already loaded
    if (!languageStore.languages) {
      await languageStore.loadLanguages()
    }
    
    // Find the language by ID
    const language = languageStore.languages.find(l => l.id === props.languageId)
    
    if (language) {
      form.value = {
        language: language.language,
        fluency: language.fluency
      }
    } else {
      console.error('Language not found')
    }
  } catch (error) {
    console.error('Failed to load language:', error)
  } finally {
    loading.value = false
  }
}

const validateField = (field: keyof LanguageInterface, value: string): boolean => {
  if (field === 'language') {
    if (!value.trim()) {
      errors.value.language = 'Veuillez entrer une langue'
      return false
    }
  } else if (field === 'fluency') {
    if (!value.trim()) {
      errors.value.fluency = 'Veuillez indiquer votre niveau'
      return false
    }
  }
  
  errors.value[field] = ''
  return true
}

const validateForm = (): boolean => {
  let isValid = true
  
  isValid = validateField('language', form.value.language) && isValid
  isValid = validateField('fluency', form.value.fluency) && isValid
  
  return isValid
}

const saveLanguage = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    if (isEditing.value && props.languageId) {
      // Update existing language
      await languageStore.updateLanguage(props.languageId, form.value)
    } else {
      // Add new language
      await languageStore.addLanguage(form.value)
    }
    
    emit('saved')
  } catch (error) {
    console.error('Failed to save language:', error)
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  emit('cancelled')
}

// Icônes pour les champs du formulaire
const icons = {
  language: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M12 2v20M4.5 9.5h3M16.5 9.5h3M5.5 14.5h4M14.5 14.5h4"></path></svg>`,
  fluency: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l4 4M17 5l-4 4M14 17l4 4M16 19l-4-4"></path></svg>`
}

// Lifecycle
onMounted(async () => {
  if (props.languageId) {
    await loadLanguage()
  }
})
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style> 