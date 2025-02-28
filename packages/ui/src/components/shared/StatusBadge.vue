<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  label: string;
  dot?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  dot: false
});

// Base classes for all status badges
const baseClasses = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full';

// Variant specific classes
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-success-500/20 text-success-400 border border-success-500/20';
    case 'warning':
      return 'bg-warning-500/20 text-warning-400 border border-warning-500/20';
    case 'danger':
      return 'bg-error-500/20 text-error-400 border border-error-500/20';
    case 'info':
      return 'bg-info-500/20 text-info-400 border border-info-500/20';
    case 'neutral':
    default:
      return 'bg-neutral-500/20 text-neutral-400 border border-neutral-500/20';
  }
});

// Dot indicator color classes
const dotColorClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-success-400';
    case 'warning':
      return 'bg-warning-400';
    case 'danger':
      return 'bg-error-400';
    case 'info':
      return 'bg-info-400';
    case 'neutral':
    default:
      return 'bg-neutral-400';
  }
});
</script>

<template>
  <span :class="[baseClasses, variantClasses]" :data-test="`status-badge-${variant}`">
    <!-- Status dot indicator (optional) -->
    <span 
      v-if="dot" 
      class="w-1.5 h-1.5 rounded-full mr-1.5"
      :class="dotColorClasses"
      aria-hidden="true"
    ></span>
    {{ label }}
  </span>
</template> 