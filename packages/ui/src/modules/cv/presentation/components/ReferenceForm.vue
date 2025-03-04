<template>
  <Form 
    :loading="loading"
    :title="isEditing ? 'Modifier la référence' : 'Ajouter une référence'"
    :subtitle="isEditing ? 'Mettez à jour les informations de cette référence.' : 'Ajoutez une nouvelle référence à votre CV.'"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 gap-6">
      <!-- Champ pour le nom -->
      <FormField
        name="name"
        label="Nom"
        :model-value="form.name"
        :error="errors.name.length > 0 ? errors.name.join(', ') : ''"
        :icon="icons.name"
        placeholder="John Doe, Jane Smith..."
        help-text="Nom de la personne qui vous recommande."
        required
        @update:model-value="(value) => form.name = value"
        @blur="validateField('name')"
      />
      
      <!-- Champ pour le témoignage -->
      <FormField
        name="reference"
        label="Témoignage"
        :model-value="form.reference"
        :error="errors.reference.length > 0 ? errors.reference.join(', ') : ''"
        :icon="icons.reference"
        placeholder="Entrez le témoignage de cette personne..."
        help-text="Le témoignage professionnel de cette personne."
        required
        textarea
        :rows="4"
        @update:model-value="(value) => form.reference = value"
        @blur="validateField('reference')"
      />
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
        :disabled="!isFormValid || isLoading"
      >
        <span v-if="isLoading" class="flex items-center">
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
import { computed, reactive, ref, onMounted } from 'vue'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import type { ReferenceInterface } from '@cv-generator/shared/src/types/resume.interface'

const props = defineProps<{
  reference?: ReferenceInterface
  isLoading?: boolean
  referenceId?: string | null
}>()

const emit = defineEmits<{
  (e: 'submit', reference: ReferenceInterface): void
  (e: 'cancel'): void
}>()

// Formulaire
const form = reactive<ReferenceInterface>({
  name: '',
  reference: ''
})

// Erreurs de validation
const errors = reactive({
  name: [] as string[],
  reference: [] as string[]
})

// État du formulaire
const loading = ref(false)
const isEditing = computed(() => !!props.referenceId || !!props.reference)

// Label du bouton de soumission
const submitButtonLabel = computed(() => {
  return isEditing.value ? 'Enregistrer' : 'Ajouter'
})

// Validation d'un champ du formulaire
const validateField = (field: keyof ReferenceInterface) => {
  errors[field] = []
  
  if (field === 'name') {
    if (!form.name.trim()) {
      errors.name.push('Le nom est obligatoire')
    }
  } else if (field === 'reference') {
    if (!form.reference.trim()) {
      errors.reference.push('Le témoignage est obligatoire')
    }
  }
}

// Validation de tout le formulaire
const validateForm = () => {
  validateField('name')
  validateField('reference')
  return isFormValid.value
}

// État de la validation du formulaire
const isFormValid = computed(() => {
  return form.name.trim() !== '' && 
         form.reference.trim() !== '' && 
         errors.name.length === 0 && 
         errors.reference.length === 0
})

// Gestion de la soumission du formulaire
const handleSubmit = () => {
  if (!validateForm()) {
    return
  }
  
  emit('submit', {
    name: form.name.trim(),
    reference: form.reference.trim()
  })
}

// Initialisation du formulaire si une référence existe
onMounted(() => {
  if (props.reference) {
    form.name = props.reference.name || ''
    form.reference = props.reference.reference || ''
  }
})

// Icônes pour les champs du formulaire
const icons = {
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  reference: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style> 