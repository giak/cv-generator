<script setup lang="ts">
interface Props {
  loading?: boolean
  submitLabel?: string
  title?: string
  subtitle?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'submit'): void
}>()

const handleSubmit = (e: Event) => {
  e.preventDefault()
  emit('submit')
}
</script>

<template>
  <form @submit="handleSubmit">
    <!-- En-tête du formulaire optionnel -->
    <div v-if="title || subtitle" class="mb-6">
      <h3 v-if="title" class="text-xl font-semibold mb-1">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-neutral-400">{{ subtitle }}</p>
    </div>
    
    <!-- Contenu du formulaire -->
    <div class="space-y-6">
      <slot />
    </div>
    
    <!-- Boutons d'action -->
    <div class="flex justify-end mt-8">
      <button
        type="button"
        class="px-4 py-2 mr-3 border border-neutral-600 rounded-md text-neutral-200 bg-transparent hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
      >
        Annuler
      </button>
      
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <span v-if="loading" class="mr-2">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        {{ submitLabel || 'Enregistrer' }}
      </button>
    </div>
  </form>
</template> 