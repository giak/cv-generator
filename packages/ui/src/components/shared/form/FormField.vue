<script setup lang="ts">
import { computed, ref } from 'vue';
import { useErrorStore as errorStoreComposable } from '../../../core/stores/error';
import ValidationFeedback from '../../../components/form/ValidationFeedback.vue';
import { type PiniaPluginContext } from 'pinia';

interface Props {
  label: string
  modelValue: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'url'
  error?: string
  required?: boolean
  fieldPath?: string
  useErrorStore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  error: '',
  required: false,
  fieldPath: '',
  useErrorStore: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur', value: string): void
}>()

// Utiliser error store si activé et disponible
const errorStore = ref<ReturnType<typeof errorStoreComposable> | null>(null);
const hasFieldError = computed(() => {
  if (props.useErrorStore && props.fieldPath && errorStore.value) {
    return errorStore.value.hasFieldError(props.fieldPath);
  }
  return false;
});

try {
  errorStore.value = errorStoreComposable();
} catch (e) {
  console.warn('Error store not available in testing environment');
}
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
      :aria-required="required ? 'true' : 'false'"
      :aria-invalid="(!!error || hasFieldError) ? 'true' : 'false'"
      :aria-describedby="(!!error || hasFieldError) ? `${name}-error` : undefined"
      :data-test="`${name}-input`"
      class="mt-1 block w-full rounded-md border-[var(--color-neutral-300)] 
             focus:border-[var(--color-primary-500)] focus:ring focus:ring-[var(--color-primary-200)]
             disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed
             aria-invalid:border-[var(--color-error-500)]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur', ($event.target as HTMLInputElement).value)"
    />
    
    <ValidationFeedback
      :error="error"
      :field-path="fieldPath"
      :use-error-store="props.useErrorStore"
      :name="name"
    />
  </label>
</template> 