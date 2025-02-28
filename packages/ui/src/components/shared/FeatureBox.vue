<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div 
    class="bg-neutral-800 bg-opacity-30 border border-neutral-700 rounded-md p-4 transition-all duration-200 hover:bg-opacity-40 hover:border-neutral-600"
    data-test="feature-box"
  >
    <div v-if="$slots.icon" class="text-primary-400 mb-3">
      <slot name="icon">
        <!-- Default icon if none provided -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="w-6 h-6"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      </slot>
    </div>
    
    <h3 class="text-white text-lg font-medium mb-2">{{ title }}</h3>
    
    <p v-if="description" class="text-neutral-400 text-sm">{{ description }}</p>
    
    <div v-if="$slots.default" class="text-neutral-400 text-sm">
      <slot></slot>
    </div>
  </div>
</template> 