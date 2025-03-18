<template>
  <div
    class="tab-panel"
    :class="{
      'tab-panel-active': isActive,
      'tab-panel-with-transition': transition,
      [`tab-panel-transition-${transitionType}`]: transition
    }"
    :id="`panel-${value}`"
    role="tabpanel"
    :aria-labelledby="`tab-${value}`"
    :tabindex="isActive ? 0 : -1"
    :hidden="!isActive && !transition"
  >
    <slot v-if="isActive || keepAlive"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

// Function to safely handle translations with fallback

interface TabNavContext {
  activeTab: { value: string | number };
}

interface TabContentProps {
  value: string | number;
  keepAlive?: boolean;
  transition?: boolean;
  transitionType?: 'fade' | 'slide' | 'zoom';
}

const props = withDefaults(defineProps<TabContentProps>(), {
  keepAlive: false,
  transition: false,
  transitionType: 'fade'
});

// Récupérer le contexte depuis TabNav
const tabContext = inject<TabNavContext>('tabNavContext');

// Vérifier si le panel est actif
const isActive = computed(() => {
  if (!tabContext) return false;
  return tabContext.activeTab.value === props.value;
});
</script>

<style lang="scss">
.tab-panel {
  @apply outline-none;
}

/* Transitions */
.tab-panel-with-transition {
  @apply transition-all duration-300;
}

.tab-panel-transition-fade {
  @apply opacity-0 invisible;
}

.tab-panel-transition-fade.tab-panel-active {
  @apply opacity-100 visible;
}

.tab-panel-transition-slide {
  @apply opacity-0 invisible transform translate-y-4;
}

.tab-panel-transition-slide.tab-panel-active {
  @apply opacity-100 visible transform translate-y-0;
}

.tab-panel-transition-zoom {
  @apply opacity-0 invisible transform scale-95;
}

.tab-panel-transition-zoom.tab-panel-active {
  @apply opacity-100 visible transform scale-100;
}
</style> 