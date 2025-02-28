<template>
  <div class="relative flex items-start">
    <div class="flex h-5 items-center">
      <label 
        :for="id || name" 
        class="relative inline-flex items-center cursor-pointer"
        :class="{ 'cursor-not-allowed': disabled }"
      >
        <input 
          :id="id || name"
          type="checkbox"
          :name="name" 
          :value="value"
          :checked="modelValue"
          :disabled="disabled"
          class="sr-only peer"
          @change="updateValue"
          :data-testid="getTestId()"
        />
        <div class="w-10 h-5 bg-neutral-800 border border-neutral-700 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-primary-500/40 peer-focus:border-primary-500 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600 peer-checked:after:bg-white peer-checked:after:border-white peer-disabled:opacity-60 peer-disabled:bg-neutral-700"></div>
      </label>
    </div>
    <div class="ml-3 text-sm">
      <label 
        :for="id || name" 
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
import { computed } from 'vue';
import ValidationFeedback from './ValidationFeedback.vue';

interface Props {
  modelValue: boolean;
  label?: string;
  name: string;
  id?: string;
  value?: string;
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
  value: '',
  disabled: false,
  error: '',
  helpText: '',
  fieldPath: '',
  useErrorStore: false,
  testId: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};

const getTestId = () => {
  return props.testId || `switch-${props.name}`;
};
</script> 