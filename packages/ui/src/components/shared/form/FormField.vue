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
  const isInvalid = !!props.error || hasFieldError.value;
  
  return {
    'block w-full py-2.5 px-3 text-sm leading-6 text-white bg-neutral-800 border rounded transition-all duration-200': true,
    'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-750': !isInvalid && !isFocused.value,
    'border-primary-500 bg-neutral-800 outline-none ring-1 ring-primary-500/40': isFocused.value && !isInvalid,
    'border-error-500/70 ring-1 ring-error-500/30': isInvalid,
    'pl-10': !!props.icon,
    'opacity-70 cursor-not-allowed': false // pour disabled state, ajouté pour complétude
  };
});

const hasError = computed(() => {
  return !!props.error || hasFieldError.value;
});
</script>

<template>
  <div class="mb-5 last:mb-0">
    <label :for="name" class="block mb-1.5 text-xs font-medium text-neutral-300 tracking-wide">
      {{ label }}
      <span v-if="required" class="text-error-400 ml-1">*</span>
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
        :aria-required="required ? 'true' : 'false'"
        :aria-invalid="hasError ? 'true' : 'false'"
        :aria-describedby="(hasError || helpText) ? `${name}-description` : undefined"
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
      
      <div v-if="helpText && !error && !hasFieldError" class="mt-1 text-xs text-neutral-400">
        {{ helpText }}
      </div>
    </div>
  </div>
</template> 