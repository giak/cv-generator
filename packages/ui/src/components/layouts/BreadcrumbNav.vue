<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

// Initialize i18n
const { t } = useI18n();

// Function to safely handle translations with fallback

interface BreadcrumbItem {
  id: string;
  label: string;
  path?: string;
}

interface Props {
  items: BreadcrumbItem[];
  translate?: boolean; // Whether to translate breadcrumb labels
}

const props = withDefaults(defineProps<Props>(), {
  translate: false
});

// Emit events for navigation
const emit = defineEmits<{
  (e: 'navigate', path: string): void
}>();

// Handle breadcrumb click
const handleBreadcrumbClick = (path: string | undefined) => {
  if (path) {
    emit('navigate', path);
  }
};

// Process items to translate labels if needed
const processedItems = computed(() => {
  if (!props.translate) {
    return props.items;
  }
  
  return props.items.map(item => {
    const translatedLabel = t(item.label, item.label); // Translate label, with fallback to original label
    return {
      ...item,
      label: translatedLabel
    };
  });
});
</script>

<template>
  <div class="flex items-center text-sm" data-test="breadcrumb">
    <div 
      v-for="(item, index) in processedItems" 
      :key="item.id"
      class="flex items-center text-neutral-400"
      :class="{ 'text-white': index === processedItems.length - 1 }"
      :data-test="`breadcrumb-item-${item.id}`"
    >
      <!-- Breadcrumb item -->
      <template v-if="item.path && index !== processedItems.length - 1">
        <a 
          href="#" 
          class="hover:text-primary-400 transition-colors duration-200"
          @click.prevent="handleBreadcrumbClick(item.path)"
        >
          {{ item.label }}
        </a>
      </template>
      <template v-else>
        <span>{{ item.label }}</span>
      </template>
      
      <!-- Separator (except for the last item) -->
      <span 
        v-if="index !== processedItems.length - 1" 
        class="mx-2 text-neutral-600"
        aria-hidden="true"
      >/</span>
    </div>
  </div>
</template> 