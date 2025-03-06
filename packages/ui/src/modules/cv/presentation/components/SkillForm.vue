<template>
  <Form 
    :loading="loading"
    :title="isNew ? 'Ajouter une compétence' : 'Modifier la compétence'"
    :subtitle="isNew ? 'Détaillez vos compétences techniques et soft skills.' : 'Mettez à jour les détails de cette compétence.'"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="name"
        label="Nom de la compétence"
        :model-value="localModel.name"
        :error="errors.name"
        :icon="icons.name"
        placeholder="Ex: JavaScript"
        help-text="Nom de la compétence ou technologie."
        required
        @update:model-value="(value) => updateField('name', value)"
        @blur="validateField('name', localModel.name)"
      />

      <FormField
        name="level"
        label="Niveau de maîtrise"
        :model-value="localModel.level || ''"
        :error="errors.level"
        :icon="icons.level"
        placeholder="Ex: Expert, Intermédiaire, Débutant"
        help-text="Votre niveau de maîtrise de cette compétence (optionnel)."
        @update:model-value="(value) => updateField('level', value)"
        @blur="validateField('level', localModel.level)"
      />
    </div>

    <!-- Keywords section -->
    <div class="mt-8 border-t border-neutral-700 pt-6">
      <h3 class="text-lg font-medium mb-4 flex items-center">
        <span class="mr-2" v-html="icons.keywords"></span>
        Mots-clés
      </h3>
      
      <div class="mb-4">
        <label class="text-sm mb-1 block">Ajoutez des mots-clés pour préciser cette compétence</label>
        
        <div class="flex">
          <input 
            v-model="newKeyword"
            type="text"
            placeholder="Ex: React, TypeScript, Node.js"
            class="flex-grow rounded-l bg-neutral-700 border-neutral-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @keydown.enter.prevent="addKeyword"
          />
          <button 
            type="button"
            class="rounded-r bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="addKeyword"
          >
            Ajouter
          </button>
        </div>
        <p v-if="keywordError" class="text-red-500 text-sm mt-1">{{ keywordError }}</p>
      </div>
      
      <!-- Keywords list -->
      <div v-if="localModel.keywords && localModel.keywords.length > 0" class="mt-4">
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="(keyword, index) in localModel.keywords" 
            :key="index"
            class="bg-neutral-700 text-white px-3 py-1 rounded-full flex items-center"
          >
            <span class="mr-2">{{ keyword }}</span>
            <button 
              type="button"
              class="text-neutral-400 hover:text-white focus:outline-none"
              @click="removeKeyword(index)"
              aria-label="Supprimer ce mot-clé"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="mt-4 text-neutral-400 italic">
        Aucun mot-clé ajouté. Utilisez le champ ci-dessus pour ajouter des mots-clés pertinents.
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import type { SkillInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { computed, ref } from 'vue'

interface Props {
  modelValue: SkillInterface
  loading?: boolean
  isNew?: boolean
}

const props = defineProps<Props>()

// Type-safe emits declaration
const emit = defineEmits<{
  (e: 'update:modelValue', value: SkillInterface): void
  (e: 'validate'): void
  (e: 'cancel'): void
}>()

// Create a computed model value for useFormModel
const modelValue = computed<SkillInterface>(() => props.modelValue)

// Keywords management
const newKeyword = ref('')
const keywordError = ref('')

// Use the new composables
const { localModel, updateField } = useFormModel<SkillInterface>({
  modelValue,
  emit: (event, value) => emit('update:modelValue', value),
  defaultValues: {
    name: '',
    level: '',
    keywords: []
  }
})

const { errors, validateField, validateForm } = useValidation<SkillInterface>(undefined, {
  requiredFields: ['name']
})

// Handle adding a keyword
const addKeyword = () => {
  if (!newKeyword.value.trim()) {
    keywordError.value = 'Le mot-clé ne peut pas être vide'
    return
  }
  
  keywordError.value = ''
  const updatedKeywords = [...(localModel.keywords || []), newKeyword.value.trim()]
  
  updateField('keywords', updatedKeywords)
  newKeyword.value = ''
}

// Handle removing a keyword
const removeKeyword = (index: number) => {
  const updatedKeywords = [...(localModel.keywords || [])]
  updatedKeywords.splice(index, 1)
  
  updateField('keywords', updatedKeywords)
}

// Handle form submission
const handleSubmit = async () => {
  console.log('Skill form submission - Current model:', JSON.parse(JSON.stringify(localModel)))
  
  // Validate all fields
  const formIsValid = validateForm(localModel)
  console.log('Form validation result:', formIsValid)
  
  if (formIsValid) {
    // Ensure required fields are present
    if (!localModel.name) {
      console.error('Required fields missing:', {
        name: !localModel.name
      })
      return
    }
    
    emit('validate')
  }
}

// Handle cancellation
const handleCancel = () => {
  emit('cancel')
}

// Icons for form fields
const icons = {
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  level: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17L12 22L22 17"></path><path d="M2 12L12 17L22 12"></path><path d="M12 2L2 7L12 12L22 7L12 2Z"></path></svg>`,
  keywords: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style> 