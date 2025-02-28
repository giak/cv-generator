<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  iconOnly?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  iconOnly: false,
  href: '',
  target: '',
  rel: ''
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>();

// Handle click events, pass to parent if not disabled
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

// Base classes for the tech button style
const baseClasses = computed(() => [
  // Common styles for all tech buttons
  'inline-flex items-center justify-center font-medium rounded transition-colors duration-200 select-none',
  'bg-neutral-900 text-neutral-300 border border-neutral-700 border-b-2 shadow-md',
  'hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-1 active:bg-neutral-850',
  
  // Size classes
  props.size === 'sm' ? 'px-2.5 py-1 text-xs' : 
  props.size === 'lg' ? 'px-5 py-2.5 text-base' : 
  'px-4 py-2 text-sm',
  
  // Block/full width
  props.block ? 'w-full flex justify-center' : '',
  
  // Icon only button
  props.iconOnly ? (
    props.size === 'sm' ? 'p-1.5' : 
    props.size === 'lg' ? 'p-3' : 
    'p-2'
  ) : '',
  
  // Disabled state
  (props.disabled || props.loading) ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
]);

// Variant specific classes (focusing on the bottom border accent color)
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'border-b-primary-600 hover:border-b-primary-500 focus:border-b-primary-500 focus:ring-primary-500';
    case 'success':
      return 'border-b-success-600 hover:border-b-success-500 focus:border-b-success-500 focus:ring-success-500';
    case 'danger':
      return 'border-b-error-600 hover:border-b-error-500 focus:border-b-error-500 focus:ring-error-500';
    case 'warning':
      return 'border-b-warning-600 hover:border-b-warning-500 focus:border-b-warning-500 focus:ring-warning-500';
    case 'info':
      return 'border-b-info-600 hover:border-b-info-500 focus:border-b-info-500 focus:ring-info-500';
    case 'neutral':
      return 'border-b-neutral-600 hover:border-b-neutral-500 focus:border-b-neutral-500 focus:ring-neutral-500';
    default:
      return 'border-b-primary-600 hover:border-b-primary-500 focus:border-b-primary-500 focus:ring-primary-500';
  }
});

// Final computed classes
const buttonClasses = computed(() => [
  ...baseClasses.value,
  variantClasses.value
]);

// Determine whether to render as a button or anchor
const isLink = computed(() => !!props.href);
</script>

<template>
  <component 
    :is="isLink ? 'a' : 'button'" 
    :href="isLink ? href : undefined" 
    :type="!isLink ? type : undefined"
    :target="isLink && target ? target : undefined"
    :rel="isLink && rel ? rel : undefined"
    :disabled="!isLink && (disabled || loading)"
    :aria-disabled="disabled || loading ? 'true' : undefined"
    :class="buttonClasses"
    @click="handleClick"
    :data-test="`tech-button-${variant}`"
  >
    <!-- Loading indicator -->
    <span v-if="loading" class="mr-2 animate-spin">
      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    
    <!-- Icon slot (before text) -->
    <span v-if="$slots.icon && !iconOnly" class="w-4 h-4 flex-shrink-0" :class="{ 'mr-2': $slots.default }">
      <slot name="icon"></slot>
    </span>
    
    <!-- Main content -->
    <span v-if="!iconOnly && $slots.default" class="btn-text">
      <slot></slot>
    </span>
    
    <!-- Icon only content -->
    <span v-if="iconOnly" :class="size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'">
      <slot name="icon">
        <slot></slot>
      </slot>
    </span>
    
    <!-- Icon slot (after text) -->
    <span v-if="$slots.iconRight && !iconOnly" class="w-4 h-4 flex-shrink-0 ml-2">
      <slot name="iconRight"></slot>
    </span>
  </component>
</template> 