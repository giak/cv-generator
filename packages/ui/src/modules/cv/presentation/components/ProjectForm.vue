<template>
  <Form 
    :loading="loading"
    :title="isEditing ? 'Modifier le projet' : 'Ajouter un projet'"
    :subtitle="isEditing ? 'Mettez à jour les informations de ce projet.' : 'Ajoutez un nouveau projet à votre CV.'"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Champ pour le nom du projet -->
      <FormField
        name="name"
        label="Nom du projet"
        :model-value="form.name"
        :error="errors.name.length > 0 ? errors.name.join(', ') : ''"
        :icon="icons.name"
        placeholder="Portfolio, Application mobile..."
        help-text="Nom du projet réalisé."
        required
        @update:model-value="(value) => form.name = value"
        @blur="validateField('name')"
      />
      
      <!-- Champ pour l'URL -->
      <FormField
        name="url"
        label="URL"
        :model-value="form.url || ''"
        :error="errors.url.length > 0 ? errors.url.join(', ') : ''"
        :icon="icons.url"
        placeholder="https://monprojet.com"
        help-text="Lien vers le projet en ligne."
        @update:model-value="(value) => form.url = value"
        @blur="validateField('url')"
      />
      
      <!-- Champ pour l'entité -->
      <FormField
        name="entity"
        label="Entité"
        :model-value="form.entity || ''"
        :error="errors.entity.length > 0 ? errors.entity.join(', ') : ''"
        :icon="icons.entity"
        placeholder="Université, Entreprise, Personnel..."
        help-text="Organisation pour laquelle le projet a été réalisé."
        @update:model-value="(value) => form.entity = value"
        @blur="validateField('entity')"
      />
      
      <!-- Champ pour le type -->
      <FormField
        name="type"
        label="Type"
        :model-value="form.type || ''"
        :error="errors.type.length > 0 ? errors.type.join(', ') : ''"
        :icon="icons.type"
        placeholder="Application Web, Mobile, Site vitrine..."
        help-text="Type ou catégorie du projet."
        @update:model-value="(value) => form.type = value"
        @blur="validateField('type')"
      />
      
      <!-- Champ pour la date de début -->
      <FormField
        name="startDate"
        label="Date de début"
        :model-value="form.startDate || ''"
        :error="errors.startDate.length > 0 ? errors.startDate.join(', ') : ''"
        :icon="icons.date"
        placeholder="YYYY-MM-DD"
        help-text="Date de début du projet (YYYY-MM-DD)."
        @update:model-value="(value) => form.startDate = value"
        @blur="validateField('startDate')"
      />
      
      <!-- Champ pour la date de fin -->
      <FormField
        name="endDate"
        label="Date de fin"
        :model-value="form.endDate || ''"
        :error="errors.endDate.length > 0 ? errors.endDate.join(', ') : ''"
        :icon="icons.date"
        placeholder="YYYY-MM-DD"
        help-text="Date de fin du projet (YYYY-MM-DD)."
        @update:model-value="(value) => form.endDate = value"
        @blur="validateField('endDate')"
      />
    </div>
    
    <!-- Champ pour la description -->
    <div class="mt-6">
      <FormField
        name="description"
        label="Description"
        :model-value="form.description || ''"
        :error="errors.description.length > 0 ? errors.description.join(', ') : ''"
        :icon="icons.description"
        placeholder="Décrivez le projet et son contexte..."
        help-text="Description détaillée du projet."
        textarea
        :rows="4"
        @update:model-value="(value) => form.description = value"
        @blur="validateField('description')"
      />
    </div>
    
    <!-- Champ pour les points forts / réalisations -->
    <div class="mt-6">
      <label class="block text-sm font-medium mb-1">
        Points forts
        <span class="text-neutral-400 font-normal ml-1">(un par ligne)</span>
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
            placeholder="Entrez un point fort par ligne..."
            @blur="validateField('highlights')"
          ></textarea>
          
          <p class="mt-1 text-sm text-neutral-400">
            Détaillez les points forts ou réalisations du projet.
          </p>
          
          <p v-if="errors.highlights.length > 0" class="mt-1 text-sm text-red-400">
            {{ errors.highlights.join(', ') }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Boutons d'action -->
    <div class="flex justify-end space-x-4 mt-8">
      <button
        type="button"
        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
        @click="$emit('cancel')"
      >
        Annuler
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
        :disabled="!isFormValid || isSubmitting"
      >
        <span v-if="isSubmitting" class="flex items-center">
          <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ submitButtonLabel }}
        </span>
        <span v-else>
          {{ submitButtonLabel }}
        </span>
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, watch } from 'vue'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import type { ProjectInterface } from '@cv-generator/shared/src/types/resume.interface'

const props = defineProps<{
  project?: ProjectInterface
  isLoading?: boolean
  projectId?: string | null
}>()

const emit = defineEmits<{
  (e: 'submit', project: ProjectInterface): void
  (e: 'cancel'): void
}>()

// Formulaire
const form = reactive<ProjectInterface>({
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
})

// Texte pour les highlights (un par ligne)
const highlightsText = ref('')

// Erreurs de validation
const errors = reactive({
  name: [] as string[],
  description: [] as string[],
  url: [] as string[],
  startDate: [] as string[],
  endDate: [] as string[],
  highlights: [] as string[],
  entity: [] as string[],
  type: [] as string[],
  keywords: [] as string[],
  roles: [] as string[]
})

// État du formulaire
const loading = ref(false)
const isSubmitting = ref(false)

// Label du bouton de soumission
const submitButtonLabel = computed(() => {
  return isEditing.value ? 'Enregistrer' : 'Ajouter'
})

// État d'édition
const isEditing = computed(() => !!props.projectId || !!props.project)

// Validation d'un champ du formulaire
const validateField = (field: string) => {
  if (!errors[field as keyof typeof errors]) {
    errors[field as keyof typeof errors] = []
  } else {
    errors[field as keyof typeof errors] = []
  }
  
  if (field === 'name') {
    if (!form.name.trim()) {
      errors.name.push('Le nom du projet est obligatoire')
    }
  } else if (field === 'url') {
    if (form.url && form.url.trim() !== '') {
      try {
        new URL(form.url)
      } catch (e) {
        errors.url.push('L\'URL n\'est pas valide')
      }
    }
  } else if (field === 'startDate') {
    if (form.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.startDate)) {
      errors.startDate.push('La date doit être au format YYYY-MM-DD')
    }
  } else if (field === 'endDate') {
    if (form.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.endDate)) {
      errors.endDate.push('La date doit être au format YYYY-MM-DD')
    }
    
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      errors.endDate.push('La date de fin doit être postérieure à la date de début')
    }
  }
}

// Synchronisation des highlights
watch(highlightsText, (newValue) => {
  form.highlights = newValue
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
})

// Validation de tout le formulaire
const validateForm = () => {
  validateField('name')
  validateField('url')
  validateField('startDate')
  validateField('endDate')
  validateField('description')
  validateField('highlights')
  validateField('entity')
  validateField('type')
  
  return isFormValid.value
}

// État de la validation du formulaire
const isFormValid = computed(() => {
  return form.name.trim() !== '' && 
         Object.values(errors).every(errorArr => errorArr.length === 0)
})

// Gestion de la soumission du formulaire
const handleSubmit = () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    emit('submit', {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      url: form.url?.trim() || undefined,
      startDate: form.startDate?.trim() || undefined,
      endDate: form.endDate?.trim() || undefined,
      highlights: form.highlights?.length ? form.highlights : undefined,
      entity: form.entity?.trim() || undefined,
      type: form.type?.trim() || undefined,
      keywords: form.keywords?.length ? form.keywords : undefined,
      roles: form.roles?.length ? form.roles : undefined
    })
  } finally {
    isSubmitting.value = false
  }
}

// Initialisation du formulaire si un projet existe
onMounted(() => {
  if (props.project) {
    form.name = props.project.name || ''
    form.description = props.project.description
    form.url = props.project.url
    form.startDate = props.project.startDate
    form.endDate = props.project.endDate
    form.highlights = props.project.highlights || []
    form.entity = props.project.entity
    form.type = props.project.type
    form.keywords = props.project.keywords || []
    form.roles = props.project.roles || []
    
    // Mettre à jour le texte des highlights
    highlightsText.value = form.highlights.join('\n')
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