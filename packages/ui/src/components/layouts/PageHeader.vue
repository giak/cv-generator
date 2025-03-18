<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

// Function to safely handle translations with fallback

interface Props {
  title: string;
  description?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="mb-6" data-test="page-header">
    <div class="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-white mb-2">{{ title }}</h1>
        <p v-if="description" class="text-sm text-neutral-400">{{ description }}</p>
      </div>
      
      <!-- Action buttons slot -->
      <div v-if="$slots.actions" class="mt-4 md:mt-0 flex items-center space-x-3">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <!-- Extra content slot -->
    <div v-if="$slots.default" class="mt-4">
      <slot></slot>
    </div>
  </div>
</template> 