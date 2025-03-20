<template>
  <p
    v-if="errorMessage"
    role="alert"
    aria-live="polite"
    class="mt-1 text-sm text-red-500 font-medium"
    :class="$attrs.class"
    :data-test="getTestId()"
  >
    {{ errorMessage }}
  </p>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useErrorStore as errorStoreComposable } from '../../core/stores/error';

interface Props {
  error?: string;
  fieldPath?: string;
  useErrorStore?: boolean;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
  fieldPath: '',
  useErrorStore: false,
  name: ''
});

// Utiliser error store si disponible
const errorStore = ref<ReturnType<typeof errorStoreComposable> | null>(null);

try {
  errorStore.value = errorStoreComposable();
} catch (e) {}

// Logique pour récupérer le message d'erreur
const errorMessage = computed(() => {
  // Si useErrorStore est activé et qu'un fieldPath est fourni, 
  // chercher l'erreur pour ce champ dans le store
  if (props.useErrorStore && props.fieldPath && errorStore.value && errorStore.value.hasFieldError(props.fieldPath)) {
    const fieldError = errorStore.value.getFieldError(props.fieldPath);
    return fieldError?.message || '';
  }
  
  // Sinon, utiliser l'erreur fournie directement en prop
  return props.error;
});

// Generate appropriate test ID
const getTestId = () => {
  if (props.name) {
    return `${props.name}-error`;
  }
  
  if (props.fieldPath) {
    // Use the full fieldPath for the test ID instead of just the last part
    return `${props.fieldPath}-error`;
  }
  
  return 'validation-error';
};
</script>
