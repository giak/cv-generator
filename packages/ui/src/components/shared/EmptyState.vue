<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center" data-test="empty-state">
    <div v-if="$slots.icon" class="text-neutral-600 mb-4">
      <slot name="icon">
        <!-- Default empty state icon -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="w-12 h-12"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </slot>
    </div>
    
    <h3 class="text-white text-lg font-medium mb-2">{{ title }}</h3>
    
    <p v-if="description" class="text-neutral-400 text-sm max-w-md mx-auto mb-6">{{ description }}</p>
    
    <div v-if="$slots.default" class="flex flex-wrap justify-center gap-3">
      <slot></slot>
    </div>
  </div>
</template> 