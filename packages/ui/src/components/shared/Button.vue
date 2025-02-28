<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost' | 'outline' | 'tech';
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

// Base classes that apply to all buttons
const baseClasses = computed(() => [
  'inline-flex items-center justify-center font-medium rounded transition-colors duration-200 select-none',
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

// Variant specific classes
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary-600 text-white border border-primary-600 hover:bg-primary-700 hover:border-primary-700 focus:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 active:bg-primary-800';
    case 'secondary':
      return 'bg-neutral-700 text-white border border-neutral-600 hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500/50 active:bg-neutral-800';
    case 'success':
      return 'bg-success-600 text-white border border-success-600 hover:bg-success-700 hover:border-success-700 focus:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-500/50 active:bg-success-800';
    case 'danger':
      return 'bg-error-600 text-white border border-error-600 hover:bg-error-700 hover:border-error-700 focus:bg-error-700 focus:outline-none focus:ring-2 focus:ring-error-500/50 active:bg-error-800';
    case 'warning':
      return 'bg-warning-600 text-white border border-warning-600 hover:bg-warning-700 hover:border-warning-700 focus:bg-warning-700 focus:outline-none focus:ring-2 focus:ring-warning-500/50 active:bg-warning-800';
    case 'info':
      return 'bg-info-600 text-white border border-info-600 hover:bg-info-700 hover:border-info-700 focus:bg-info-700 focus:outline-none focus:ring-2 focus:ring-info-500/50 active:bg-info-800';
    case 'ghost':
      return 'bg-transparent text-neutral-300 border border-transparent hover:bg-neutral-800 hover:text-white focus:bg-neutral-800 focus:text-white focus:outline-none focus:ring-2 focus:ring-neutral-700/50 active:bg-neutral-900';
    case 'outline':
      return 'bg-transparent text-neutral-300 border border-neutral-600 hover:border-neutral-500 hover:text-white focus:text-white focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700/50 active:bg-neutral-700';
    case 'tech':
      return 'bg-neutral-900 text-neutral-300 border border-neutral-700 border-b-2 border-b-primary-600 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 active:bg-neutral-850 shadow-md';
    default:
      return '';
  }
});

// Special case for outline variants with color
const outlineColorClasses = computed(() => {
  if (props.variant !== 'outline') return '';
  
  const variantMap = {
    primary: 'text-primary-400 border-primary-600 hover:bg-primary-600/10 hover:text-primary-300 hover:border-primary-500',
    success: 'text-success-400 border-success-600 hover:bg-success-600/10 hover:text-success-300 hover:border-success-500',
    danger: 'text-error-400 border-error-600 hover:bg-error-600/10 hover:text-error-300 hover:border-error-500',
    warning: 'text-warning-400 border-warning-600 hover:bg-warning-600/10 hover:text-warning-300 hover:border-warning-500',
    info: 'text-info-400 border-info-600 hover:bg-info-600/10 hover:text-info-300 hover:border-info-500'
  };
  
  return variantMap[props.variant as keyof typeof variantMap] || '';
});

// Special case for tech variants with color
const techColorClasses = computed(() => {
  if (props.variant !== 'tech') return '';
  
  const variantMap = {
    primary: 'border-b-primary-600 hover:border-b-primary-500 focus:border-b-primary-500',
    success: 'border-b-success-600 hover:border-b-success-500 focus:border-b-success-500',
    danger: 'border-b-error-600 hover:border-b-error-500 focus:border-b-error-500',
    warning: 'border-b-warning-600 hover:border-b-warning-500 focus:border-b-warning-500',
    info: 'border-b-info-600 hover:border-b-info-500 focus:border-b-info-500'
  };
  
  return variantMap[props.variant as keyof typeof variantMap] || '';
});

// Final computed classes
const buttonClasses = computed(() => [
  ...baseClasses.value,
  variantClasses.value,
  outlineColorClasses.value,
  techColorClasses.value
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
    :data-test="`button-${variant}`"
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