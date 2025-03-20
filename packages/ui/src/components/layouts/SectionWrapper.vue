<script setup lang="ts">
import SectionHeader from './SectionHeader.vue';

interface Props {
  title?: string;
  translationKey?: string;
  fallbackText?: string;
  currentSection?: string; // For navigation highlighting
  showNavigation?: boolean;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  translationKey: '',
  fallbackText: '',
  currentSection: '',
  showNavigation: true,
  showActions: true
});

const emit = defineEmits<{
  (event: 'navigate', section: string): void
}>();

// Function to handle navigation events from child components
const handleNavigation = (section: string) => {
  emit('navigate', section);
};
</script>

<template>
  <div class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
    <!-- Section Header - only show if title is provided -->
    <SectionHeader 
      v-if="title"
      :title="title" 
      :translation-key="translationKey" 
      :fallback-text="fallbackText"
      :show-actions="showActions"
    >
      <!-- Pass through any custom actions -->
      <template #actions>
        <slot name="header-actions"></slot>
      </template>
    </SectionHeader>
    
    <!-- Section Content -->
    <div class="p-6">
      <!-- Main content slot -->
      <slot></slot>
      
      <!-- Navigation slot with fallback -->
      <slot 
        name="navigation" 
        v-if="showNavigation"
        :current-section="currentSection"
        :on-navigate="handleNavigation"
      >
        <!-- If no custom navigation provided, this will be used -->
        <div v-if="$slots.default && showNavigation" class="mt-6">
          <slot name="default-navigation"></slot>
        </div>
      </slot>
    </div>
  </div>
</template> 