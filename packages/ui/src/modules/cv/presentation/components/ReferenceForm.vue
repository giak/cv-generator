<template>
  <Form 
    :loading="loading"
    :title="isEditing ? t(TRANSLATION_KEYS.RESUME.REFERENCES.FORM.EDIT_TITLE) : t(TRANSLATION_KEYS.RESUME.REFERENCES.FORM.ADD_TITLE)"
    :subtitle="isEditing ? t(TRANSLATION_KEYS.RESUME.REFERENCES.FORM.EDIT_SUBTITLE) : t(TRANSLATION_KEYS.RESUME.REFERENCES.FORM.ADD_SUBTITLE)"
    @submit="handleSubmit"
    @cancel="$emit('cancel')"
    :submit-label="submitButtonLabel"
  >
    <div class="grid grid-cols-1 gap-6">
      <!-- Champ pour le nom -->
      <FormField
        name="name"
        :label="t(TRANSLATION_KEYS.RESUME.REFERENCES.LABELS.NAME)"
        :model-value="localModel.name"
        :error="errors.name"
        :icon="icons.name"
        :placeholder="t(TRANSLATION_KEYS.RESUME.REFERENCES.PLACEHOLDERS.NAME)"
        :help-text="t(TRANSLATION_KEYS.RESUME.REFERENCES.HELP_TEXT.NAME)"
        required
        @update:model-value="(value) => updateField('name', value)"
        @blur="validateField('name', localModel.name)"
      />
      
      <!-- Champ pour le témoignage -->
      <FormField
        name="reference"
        :label="t(TRANSLATION_KEYS.RESUME.REFERENCES.LABELS.REFERENCE)"
        :model-value="localModel.reference"
        :error="errors.reference"
        :icon="icons.reference"
        :placeholder="t(TRANSLATION_KEYS.RESUME.REFERENCES.PLACEHOLDERS.REFERENCE)"
        :help-text="t(TRANSLATION_KEYS.RESUME.REFERENCES.HELP_TEXT.REFERENCE)"
        required
        textarea
        :rows="4"
        @update:model-value="(value) => updateField('reference', value)"
        @blur="validateField('reference', localModel.reference)"
      />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import type { ReferenceInterface } from '@cv-generator/shared/src/types/resume.interface'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

const props = defineProps<{
  reference?: ReferenceInterface
  isLoading?: boolean
  referenceId?: string | null
}>()

const emit = defineEmits<{
  (e: 'submit', reference: ReferenceInterface): void
  (e: 'cancel'): void
}>()

// Initialize i18n
const { t } = useI18n()

// Fonction pour gérer les erreurs de traduction

// État du formulaire
const loading = ref(false)
const isEditing = computed(() => !!props.referenceId || !!props.reference)

// Label du bouton de soumission
const submitButtonLabel = computed(() => {
  return isEditing.value ? t(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE) : t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD)
})

// Modèle initial
const initialModel = computed<ReferenceInterface>(() => {
  if (props.reference) {
    return { ...props.reference }
  }
  return {
    name: '',
    reference: ''
  }
})

// Utilisation du composable useFormModel
const { localModel, updateField } = useFormModel<ReferenceInterface>({
  modelValue: initialModel,
  emit: () => {}, // Nous n'utilisons pas update:modelValue ici
  defaultValues: {
    name: '',
    reference: ''
  }
})

// Utilisation du composable useValidation
const { errors, validateField, validateForm } = useValidation<ReferenceInterface>(undefined, {
  requiredFields: ['name', 'reference']
})

// Initialisation du formulaire
onMounted(() => {
  // Le modèle est déjà initialisé par useFormModel
  if (props.reference) {
    // Validation après initialisation
    validateField('name', props.reference.name || '')
    validateField('reference', props.reference.reference || '')
  }
})

// Gestion de la soumission du formulaire
const handleSubmit = () => {
  // Valider tous les champs
  if (!validateForm(localModel)) {
    return
  }
  
  emit('submit', {
    name: localModel.name.trim(),
    reference: localModel.reference.trim()
  })
}

// Icônes pour les champs du formulaire
const icons = {
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  reference: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style> 