<template>
  <Form 
    :loading="loading"
    :title="isEditing ? t(TRANSLATION_KEYS.RESUME.LANGUAGES.FORM.EDIT_TITLE) : t(TRANSLATION_KEYS.RESUME.LANGUAGES.FORM.ADD_TITLE)"
    :subtitle="isEditing ? t(TRANSLATION_KEYS.RESUME.LANGUAGES.FORM.EDIT_SUBTITLE) : t(TRANSLATION_KEYS.RESUME.LANGUAGES.FORM.ADD_SUBTITLE)"
    @submit="saveLanguage"
    @cancel="cancel"
    :submit-label="isEditing ? t(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE) : t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD)"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Champ pour le nom de la langue -->
      <FormField
        name="language"
        :label="t(TRANSLATION_KEYS.RESUME.LANGUAGES.LABELS.LANGUAGE)"
        :model-value="localModel.language"
        :error="errors.language"
        :icon="icons.language"
        :placeholder="t(TRANSLATION_KEYS.RESUME.LANGUAGES.PLACEHOLDERS.LANGUAGE)"
        :help-text="t(TRANSLATION_KEYS.RESUME.LANGUAGES.HELP_TEXT.LANGUAGE)"
        required
        @update:model-value="(value) => updateField('language', value)"
        @blur="validateField('language', localModel.language)"
      />
      
      <!-- Champ pour le niveau de compétence -->
      <FormField
        name="fluency"
        :label="t(TRANSLATION_KEYS.RESUME.LANGUAGES.LABELS.FLUENCY)"
        :model-value="localModel.fluency"
        :error="errors.fluency"
        :icon="icons.fluency"
        :placeholder="t(TRANSLATION_KEYS.RESUME.LANGUAGES.PLACEHOLDERS.FLUENCY)"
        :help-text="t(TRANSLATION_KEYS.RESUME.LANGUAGES.HELP_TEXT.FLUENCY)"
        required
        @update:model-value="(value) => updateField('fluency', value)"
        @blur="validateField('fluency', localModel.fluency)"
      />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useLanguageStore } from '../stores/language'
import type { LanguageInterface } from '@cv-generator/shared/src/types/resume.interface'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

// Props
const props = defineProps<{
  languageId: string | null
}>()

// Emits
const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancelled'): void
}>()

// Initialize i18n
const { t } = useI18n()

// Fonction pour gérer les erreurs de traduction

// Store
const languageStore = useLanguageStore()

// State
const loading = ref(false)
const isSubmitting = ref(false)

// Model wrapped in a computed to handle the case of editing
const modelValue = computed<LanguageInterface>(() => {
  // Return empty model when creating a new language
  if (!props.languageId || !languageStore.languages) {
    return {
      language: '',
      fluency: ''
    }
  }
  
  // Find the language by ID
  const language = languageStore.languages.find(l => l.id === props.languageId)
  return language || { language: '', fluency: '' }
})

// Form model
const { 
  localModel, 
  updateField
} = useFormModel<LanguageInterface>({
  modelValue,
  emit: () => {}, // We don't emit updates directly to parent
  defaultValues: {
    language: '',
    fluency: ''
  }
})

// Form validation
const { 
  errors, 
  validateField, 
  validateForm 
} = useValidation<LanguageInterface>(undefined, {
  requiredFields: ['language', 'fluency']
})

// Computed
const isEditing = computed(() => !!props.languageId)

// Methods
const loadLanguage = async () => {
  if (!props.languageId) return
  
  loading.value = true
  
  try {
    // Load languages if not already loaded
    if (!languageStore.languages || languageStore.languages.length === 0) {
      await languageStore.loadLanguages()
    }
    
    // The modelValue computed will update the localModel automatically
  } catch (error) {} finally {
    loading.value = false
  }
}

const saveLanguage = async () => {
  if (!validateForm(localModel)) return
  
  isSubmitting.value = true
  
  try {
    if (isEditing.value && props.languageId) {
      // Update existing language
      await languageStore.updateLanguage(props.languageId, localModel)
    } else {
      // Add new language
      await languageStore.addLanguage(localModel)
    }
    
    emit('saved')
  } catch (error) {} finally {
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
