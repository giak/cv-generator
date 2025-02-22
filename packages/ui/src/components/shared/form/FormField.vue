<script setup lang="ts">
interface Props {
  label: string
  modelValue: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'url'
  error?: string
  required?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur', value: string): void
}>()
</script>

<template>
  <label :for="name" class="block">
    <span class="text-[var(--color-neutral-700)] font-medium flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-[var(--color-error-500)]">*</span>
    </span>
    
    <input
      :id="name"
      :value="modelValue"
      :type="type"
      :name="name"
      :required="required"
      :aria-required="required"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${name}-error` : undefined"
      class="mt-1 block w-full rounded-md border-[var(--color-neutral-300)] 
             focus:border-[var(--color-primary-500)] focus:ring focus:ring-[var(--color-primary-200)]
             disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed
             aria-invalid:border-[var(--color-error-500)]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur', ($event.target as HTMLInputElement).value)"
    />
    
    <p
      v-if="error"
      :id="`${name}-error`"
      class="mt-1 text-sm text-[var(--color-error-500)]"
    >
      {{ error }}
    </p>
  </label>
</template> 