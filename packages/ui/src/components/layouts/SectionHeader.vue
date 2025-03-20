<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

// Initialize i18n
const { t } = useI18n();

interface Props {
  title: string;
  translationKey?: string;
  fallbackText?: string;
  showActions?: boolean;
}

// Default to empty strings to avoid undefined rendering
const props = withDefaults(defineProps<Props>(), {
  translationKey: '',
  fallbackText: '',
  showActions: true
});

// Function to safely translate with fallback
const safeTranslate = (key: string, fallback: string = 'Translation missing') => {
  if (!key) return fallback;
  
  try {
    const translated = t(key);
    // Check if translation exists and is not the same as the key
    return (translated && translated !== key) ? translated : fallback;
  } catch (error) {
    return fallback;
  }
};

// Computed title to display - prioritize translation if available
const displayTitle = computed(() => {
  if (props.translationKey) {
    return safeTranslate(props.translationKey, props.fallbackText || props.title);
  }
  return props.title;
});
</script>

<template>
  <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
    <h2 class="font-medium text-white">{{ displayTitle }}</h2>
    <div v-if="showActions">
      <slot name="actions">
        <!-- Default actions -->
        <button class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>
      </slot>
    </div>
  </div>
</template> 