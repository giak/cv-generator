<template>
  <Form 
    :loading="loading"
    :title="isEditing ? t(TRANSLATION_KEYS.RESUME.PROJECTS.FORM.EDIT_TITLE) : t(TRANSLATION_KEYS.RESUME.PROJECTS.FORM.ADD_TITLE)"
    :subtitle="isEditing ? t(TRANSLATION_KEYS.RESUME.PROJECTS.FORM.EDIT_SUBTITLE) : t(TRANSLATION_KEYS.RESUME.PROJECTS.FORM.ADD_SUBTITLE)"
    @submit="handleSubmit"
    @cancel="$emit('cancel')"
    :submit-label="submitButtonLabel"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Champ pour le nom du projet -->
      <FormField
        name="name"
        :label="t(TRANSLATION_KEYS.RESUME.PROJECTS.LABELS.NAME)"
        :model-value="localModel.name"
        :error="errors.name"
        :icon="icons.name"
        :placeholder="t(TRANSLATION_KEYS.RESUME.PROJECTS.PLACEHOLDERS.NAME)"
        :help-text="t(TRANSLATION_KEYS.RESUME.PROJECTS.HELP_TEXT.NAME)"
        required
        @update:model-value="(value) => updateField('name', value)"
        @blur="validateField('name', localModel.name)"
      />
      
      <!-- Champ pour l'URL -->
      <FormField
        name="url"
        :label="t(TRANSLATION_KEYS.RESUME.PROJECTS.LABELS.URL)"
        :model-value="localModel.url || ''"
        :error="errors.url"
        :icon="icons.url"
        :placeholder="t(TRANSLATION_KEYS.RESUME.PROJECTS.PLACEHOLDERS.URL)"
        :help-text="t(TRANSLATION_KEYS.RESUME.PROJECTS.HELP_TEXT.URL)"
        @update:model-value="(value) => updateField('url', value)"
        @blur="validateField('url', localModel.url)"
      />
      
      <!-- Champ pour l'entité -->
      <FormField
        name="entity"
        :label="t(TRANSLATION_KEYS.RESUME.PROJECTS.LABELS.ENTITY)"
        :model-value="localModel.entity || ''"
        :error="errors.entity"
        :icon="icons.entity"
        :placeholder="t(TRANSLATION_KEYS.RESUME.PROJECTS.PLACEHOLDERS.ENTITY)"
        :help-text="t(TRANSLATION_KEYS.RESUME.PROJECTS.HELP_TEXT.ENTITY)"
        @update:model-value="(value) => updateField('entity', value)"
        @blur="validateField('entity', localModel.entity)"
      />
      
      <!-- Champ pour le type -->
      <FormField
        name="type"
        :label="t(TRANSLATION_KEYS.RESUME.PROJECTS.LABELS.TYPE)"
        :model-value="localModel.type || ''"
        :error="errors.type"
        :icon="icons.type"
        :placeholder="t(TRANSLATION_KEYS.RESUME.PROJECTS.PLACEHOLDERS.TYPE)"
        :help-text="t(TRANSLATION_KEYS.RESUME.PROJECTS.HELP_TEXT.TYPE)"
        @update:model-value="(value) => updateField('type', value)"
        @blur="validateField('type', localModel.type)"
      />
    </div>
    
    <!-- Champs de dates -->
    <div class="mt-6">
      <DateRangeFields
        :start-date="localModel.startDate || ''"
        :end-date="localModel.endDate || ''"
        :start-date-error="errors.startDate"
        :end-date-error="errors.endDate"
        @update:start-date="(value) => updateField('startDate', value)"
        @update:end-date="(value) => updateField('endDate', value)"
        @start-date-blur="() => validateField('startDate', localModel.startDate)"
        @end-date-blur="() => validateField('endDate', localModel.endDate)"
        @date-range-change="validateDateRange"
      />
    </div>
    
    <!-- Champ pour la description -->
    <div class="mt-6">
      <FormField
        name="description"
        :label="t(TRANSLATION_KEYS.RESUME.PROJECTS.LABELS.DESCRIPTION)"
        :model-value="localModel.description || ''"
        :error="errors.description"
        :icon="icons.description"
        :placeholder="t(TRANSLATION_KEYS.RESUME.PROJECTS.PLACEHOLDERS.DESCRIPTION)"
        :help-text="t(TRANSLATION_KEYS.RESUME.PROJECTS.HELP_TEXT.DESCRIPTION)"
        textarea
        :rows="4"
        @update:model-value="(value) => updateField('description', value)"
        @blur="validateField('description', localModel.description)"
      />
    </div>
    
    <!-- Champ pour les points forts / réalisations -->
    <div class="mt-6">
      <label class="block text-sm font-medium mb-1">
        {{ t(TRANSLATION_KEYS.RESUME.PROJECTS.LABELS.HIGHLIGHTS) }}
        <span class="text-neutral-400 font-normal ml-1">({{ safeTranslate('resume.projects.form.onePerLine', 'un par ligne') }})</span>
      </label>
      
      <div class="flex items-start">
        <div class="mt-1 mr-2 text-neutral-400">
          <span v-html="icons.highlight"></span>
        </div>
        
        <div class="w-full">
          <textarea
            v-model="highlightsText"
            rows="4"
            class="block w-full bg-neutral-800 border border-neutral-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500/20 p-3 text-sm"
            :placeholder="t(TRANSLATION_KEYS.RESUME.PROJECTS.PLACEHOLDERS.HIGHLIGHT)"
            @blur="validateField('highlights', localModel.highlights)"
          ></textarea>
          
          <p class="mt-1 text-sm text-neutral-400">
            {{ t(TRANSLATION_KEYS.RESUME.PROJECTS.HELP_TEXT.HIGHLIGHTS) }}
          </p>
          
          <p v-if="errors.highlights" class="mt-1 text-sm text-red-400">
            {{ errors.highlights }}
          </p>
        </div>
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import DateRangeFields from '@ui/components/shared/form/DateRangeFields.vue'
import type { ProjectInterface } from '@cv-generator/shared/src/types/resume.interface'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

const props = defineProps<{
  project?: ProjectInterface
  isLoading?: boolean
  projectId?: string | null
}>()

const emit = defineEmits<{
  (e: 'submit', project: ProjectInterface): void
  (e: 'cancel'): void
}>()

// Initialize i18n
const { t } = useI18n()

// Fonction pour gérer les erreurs de traduction
const safeTranslate = (key: string, fallback: string = 'Translation missing') => {
  try {
    const result = t(key);
    // Si la clé est retournée telle quelle, c'est qu'elle n'existe pas
    if (result === key) {
      return fallback;
    }
    return result;
  } catch (error) {
    return fallback;
  }
};

// État du formulaire
const loading = computed(() => props.isLoading || isSubmitting.value)
const isSubmitting = ref(false)

// Texte pour les highlights (un par ligne)
const highlightsText = ref('')

// État d'édition
const isEditing = computed(() => !!props.projectId || !!props.project)

// Label du bouton de soumission
const submitButtonLabel = computed(() => {
  return isEditing.value ? t(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE) : t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD)
})

// Model wrapped in a computed to handle the case of editing
const modelValue = computed<ProjectInterface>(() => {
  // Si un projet est fourni, l'utiliser
  if (props.project) {
    return props.project
  }
  
  // Sinon, retourner un modèle vide
  return {
    name: '',
    description: undefined,
    url: undefined,
    startDate: undefined,
    endDate: undefined,
    highlights: [],
    entity: undefined,
    type: undefined,
    keywords: [],
    roles: []
  }
})

// Form model
const { 
  localModel, 
  updateField
} = useFormModel<ProjectInterface>({
  modelValue,
  emit: () => {}, // Nous n'émettons pas directement update:modelValue
  defaultValues: {
    name: '',
    description: undefined,
    url: undefined,
    startDate: undefined,
    endDate: undefined,
    highlights: [],
    entity: undefined,
    type: undefined,
    keywords: [],
    roles: []
  }
})

// Form validation
const { 
  errors, 
  validateField, 
  validateForm
} = useValidation<ProjectInterface>(undefined, {
  requiredFields: ['name']
})

// Synchronisation des highlights
watch(highlightsText, (newValue) => {
  const highlights = newValue
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
  
  updateField('highlights', highlights)
})

// Validation spécifique pour les dates
const validateDateRange = ({ startDate, endDate }: { startDate: string, endDate?: string }) => {
  validateField('startDate', startDate)
  if (endDate) validateField('endDate', endDate)
  
  if (startDate && endDate && startDate > endDate) {
    errors.value.endDate = safeTranslate(TRANSLATION_KEYS.RESUME.PROJECTS.VALIDATION.END_BEFORE_START, 'La date de fin doit être postérieure à la date de début')
    return false
  }
  
  return true
}

// Gestion de la soumission du formulaire
const handleSubmit = () => {
  // Valider tous les champs du formulaire
  if (!validateForm(localModel)) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    emit('submit', {
      name: localModel.name,
      description: localModel.description,
      url: localModel.url,
      startDate: localModel.startDate,
      endDate: localModel.endDate,
      highlights: localModel.highlights?.length ? localModel.highlights : undefined,
      entity: localModel.entity,
      type: localModel.type,
      keywords: localModel.keywords?.length ? localModel.keywords : undefined,
      roles: localModel.roles?.length ? localModel.roles : undefined
    })
  } finally {
    isSubmitting.value = false
  }
}

// Initialisation du formulaire
onMounted(() => {
  if (props.project) {
    // Initialiser le texte des highlights
    highlightsText.value = props.project.highlights?.join('\n') || ''
  }
})

// Icônes pour les champs du formulaire
const icons = {
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>`,
  description: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="3" x2="17" y2="21"></line><path d="M4 17l6-6-6-6"></path></svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  date: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  highlight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
  entity: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  type: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style>
