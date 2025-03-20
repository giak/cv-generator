<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

// Function to safely handle translations with fallback
const safeTranslate = (key: string, fallback: string = 'Translation missing') => {
  try {
    const translated = t(key);
    // Check if translation exists and is not the same as the key
    return (translated && translated !== key) ? translated : fallback;
  } catch (error) {

    return fallback;
  }
};

interface Props {
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...'
});

const searchQuery = ref('');

// Emit search event
const emit = defineEmits<{
  (e: 'search', query: string): void
}>();

// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
  emit('search', searchQuery.value);
};

// Clear search
const clearSearch = () => {
  searchQuery.value = '';
  emit('search', '');
};
</script>

<template>
  <div class="relative w-full" data-test="search-input-container">
    <!-- Search Icon -->
    <div class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-neutral-500">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
    
    <!-- Input -->
    <input
      type="text"
      :placeholder="placeholder"
      v-model="searchQuery"
      @input="handleInput"
      class="w-full bg-neutral-800 border border-neutral-700 rounded-md py-1.5 pl-8 pr-8 text-sm text-white placeholder-neutral-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all duration-200"
      data-test="search-input"
    />
    
    <!-- Clear Button (visible when there is input) -->
    <button
      v-if="searchQuery"
      @click="clearSearch"
      class="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors duration-200"
      :aria-label="safeTranslate('ui.search.clearSearch', 'Clear search')"
      data-test="clear-search-button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>
