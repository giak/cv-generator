<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
});

// Border and icon color classes based on variant
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'border-l-primary-500';
    case 'success':
      return 'border-l-success-500';
    case 'warning':
      return 'border-l-warning-500';
    case 'error':
      return 'border-l-error-500';
    default:
      return 'border-l-neutral-600';
  }
});

// Icon color based on variant
const iconColorClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-primary-400';
    case 'success':
      return 'text-success-400';
    case 'warning':
      return 'text-warning-400';
    case 'error':
      return 'text-error-400';
    default:
      return 'text-neutral-400';
  }
});
</script>

<template>
  <div 
    class="bg-neutral-800 bg-opacity-20 border-l-4 rounded-sm p-3 flex items-start"
    :class="variantClasses"
    data-test="info-box"
    role="alert"
  >
    <div v-if="$slots.icon" :class="['mr-3', iconColorClass]">
      <slot name="icon">
        <!-- Default info icon if none provided -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="w-5 h-5"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </slot>
    </div>
    
    <div class="text-sm text-neutral-300">
      <slot></slot>
    </div>
  </div>
</template> 