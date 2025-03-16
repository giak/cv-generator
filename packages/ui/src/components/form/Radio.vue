<template>
  <div class="relative flex items-start">
    <div class="flex h-5 items-center">
      <input 
        :id="id || `${name}-${value}`"
        type="radio"
        :name="name" 
        :value="value"
        :checked="modelValue === value"
        :disabled="disabled"
        class="h-5 w-5 rounded-full border-neutral-700 bg-neutral-800 text-primary-600 focus:ring-1 focus:ring-primary-500/40 focus:border-primary-500 disabled:opacity-60 disabled:bg-neutral-700 transition-all duration-200 cursor-pointer"
        @change="updateValue"
        :data-testid="getTestId()"
      />
    </div>
    <div class="ml-2 text-sm">
      <label 
        :for="id || `${name}-${value}`" 
        class="text-sm text-neutral-300 select-none cursor-pointer"
        :class="{ 'text-neutral-500 cursor-not-allowed': disabled }"
      >
        <slot>{{ label }}</slot>
      </label>
      <p v-if="helpText" class="mt-1 text-xs text-neutral-400">
        {{ helpText }}
      </p>
      <ValidationFeedback 
        v-if="error || (useErrorStore && fieldPath)"
        :error="error"
        :field-path="fieldPath"
        :use-error-store="useErrorStore"
        :name="name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ValidationFeedback from './ValidationFeedback.vue';

interface Props {
  modelValue: string;
  value: string;
  label?: string;
  name: string;
  id?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  fieldPath?: string;
  useErrorStore?: boolean;
  testId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  id: '',
  disabled: false,
  error: '',
  helpText: '',
  fieldPath: '',
  useErrorStore: false,
  testId: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const getTestId = () => {
  return props.testId || `radio-${props.name}-${props.value}`;
};
</script> 