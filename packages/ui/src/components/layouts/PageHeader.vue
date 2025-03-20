<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

// Initialize i18n
const { t } = useI18n();

interface Props {
  title: string;
  description?: string;
  translate?: boolean; // Whether to translate title and description as translation keys
  titleParams?: Record<string, any>; // For dynamic translation params
  descriptionParams?: Record<string, any>; // For dynamic translation params
}

const props = withDefaults(defineProps<Props>(), {
  translate: false,
  titleParams: () => ({}),
  descriptionParams: () => ({}),
});

// Computed properties for translated content
const translatedTitle = computed(() => {
  return props.translate ? t(props.title, props.titleParams) : props.title;
});

const translatedDescription = computed(() => {
  return props.description && props.translate
    ? t(props.description, props.descriptionParams)
    : props.description;
});
</script>

<template>
  <div class="mb-6" data-test="page-header">
    <div class="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-white mb-2">{{ translatedTitle }}</h1>
        <p v-if="description" class="text-sm text-neutral-400">{{ translatedDescription }}</p>
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