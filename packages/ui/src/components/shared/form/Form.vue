<script setup lang="ts">
interface Props {
  loading?: boolean
  submitLabel?: string
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
  <form
    class="container mx-auto p-6 space-y-8 bg-[var(--color-neutral-50)] rounded-lg shadow-sm"
    @submit="handleSubmit"
  >
    <div class="space-y-4">
      <slot />
    </div>
    
    <div class="flex justify-end">
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-md
               hover:bg-[var(--color-primary-600)] 
               focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors"
      >
        <span v-if="loading" class="inline-block animate-spin mr-2">⌛</span>
        {{ submitLabel || 'Sauvegarder' }}
      </button>
    </div>
  </form>
</template> 