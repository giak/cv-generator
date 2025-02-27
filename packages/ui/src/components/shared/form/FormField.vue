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
  placeholder?: string
  helpText?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  error: '',
  required: false,
  fieldPath: '',
  useErrorStore: false,
  placeholder: '',
  helpText: '',
  icon: ''
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

// Variables pour suivre l'état du focus
const isFocused = ref(false);
const toggleFocus = (focusState: boolean) => {
  isFocused.value = focusState;
};

// Classes calculées pour l'input
const inputClasses = computed(() => {
  return {
    'form-control': true,
    'is-invalid': !!props.error || hasFieldError.value,
    'is-focused': isFocused.value
  };
});
</script>

<template>
  <div class="form-group">
    <label :for="name" class="form-label">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </label>
    
    <div class="relative">
      <!-- Icône à gauche (si fournie) -->
      <div v-if="icon" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
        <span v-html="icon"></span>
      </div>
      
      <input
        :id="name"
        :value="modelValue"
        :type="type"
        :name="name"
        :required="required"
        :placeholder="placeholder"
        :class="inputClasses"
        :style="icon ? 'padding-left: 2.5rem' : ''"
        :aria-required="required ? 'true' : 'false'"
        :aria-invalid="(!!error || hasFieldError) ? 'true' : 'false'"
        :aria-describedby="(!!error || hasFieldError || helpText) ? `${name}-description` : undefined"
        :data-test="`${name}-input`"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="emit('blur', ($event.target as HTMLInputElement).value); toggleFocus(false)"
        @focus="toggleFocus(true)"
      />
    </div>
    
    <!-- Message d'aide ou erreur -->
    <div :id="`${name}-description`">
      <ValidationFeedback
        :error="error"
        :field-path="fieldPath"
        :use-error-store="props.useErrorStore"
        :name="name"
      />
      
      <div v-if="helpText && !error && !hasFieldError" class="form-text mt-1">
        {{ helpText }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.is-focused {
  border-color: rgb(var(--color-primary-400));
  box-shadow: 0 0 0 3px rgba(var(--color-primary-400), 0.15);
}
</style> 