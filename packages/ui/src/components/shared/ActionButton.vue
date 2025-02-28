<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'primary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  type: 'button',
  disabled: false,
  title: '',
  ariaLabel: ''
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>();

// Handle click events, pass to parent if not disabled
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};

// Base classes for the action button
const baseClasses = 'inline-flex items-center justify-center rounded p-1.5 transition-colors duration-150';

// Default/neutral variant
const defaultClasses = 'text-neutral-400 hover:text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40';

// Variant specific classes
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-primary-400 hover:text-primary-300 hover:bg-primary-600/10 focus:outline-none focus:ring-2 focus:ring-primary-500/40';
    case 'danger':
      return 'text-error-400 hover:text-error-300 hover:bg-error-600/10 focus:outline-none focus:ring-2 focus:ring-error-500/40';
    default:
      return defaultClasses;
  }
});

// Disabled state classes
const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

// Final computed classes
const buttonClasses = computed(() => [
  baseClasses,
  variantClasses.value,
  props.disabled ? disabledClasses : ''
]);
</script>

<template>
  <button 
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
    :title="title"
    :aria-label="ariaLabel || title"
    data-test="action-button"
  >
    <slot></slot>
  </button>
</template> 