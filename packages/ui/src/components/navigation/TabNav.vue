<template>
  <div class="tab-container">
    <!-- Navigation des onglets -->
    <div
      class="tab-nav"
      :class="[
        `tab-nav-${variant}`,
        {
          'tab-nav-vertical': isVertical,
          'tab-nav-horizontal': !isVertical,
          'tab-nav-bordered': bordered,
          'tab-nav-pills': pills,
          'tab-nav-stretched': stretched
        }
      ]"
      role="tablist"
      :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
    >
      <slot></slot>
    </div>
    
    <!-- Contenu des onglets, lorsque géré par ce composant -->
    <div v-if="$slots.content" class="tab-content" :class="{ 'ml-4': isVertical }">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

// Function to safely handle translations with fallback

export interface TabNavProps {
  modelValue?: string | number;
  defaultTab?: string | number;
  variant?: 'default' | 'minimal' | 'underline' | 'contained';
  vertical?: boolean;
  bordered?: boolean;
  pills?: boolean;
  stretched?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<TabNavProps>(), {
  modelValue: undefined,
  defaultTab: '',
  variant: 'default',
  vertical: false,
  bordered: false,
  pills: false,
  stretched: false,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
}>();

// État local pour le tab actif
const localActiveTab = ref<string | number>(props.modelValue || props.defaultTab || '');

// Gestion de la sélection du tab
const setActiveTab = (value: string | number) => {
  localActiveTab.value = value;
  emit('update:modelValue', value);
  emit('change', value);
};

// Mise à jour de l'état local quand les props changent
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined && newValue !== localActiveTab.value) {
    localActiveTab.value = newValue;
  }
});

// Fournir le contexte à TabNavItem
provide('tabNavContext', {
  activeTab: computed(() => localActiveTab.value),
  setActiveTab,
  disabled: computed(() => props.disabled)
});

// Calcul de la direction
const isVertical = computed(() => props.vertical);
</script>

<style lang="scss">
.tab-container {
  @apply w-full flex;
}

.tab-nav {
  @apply flex transition-all duration-200;
}

.tab-nav-vertical {
  @apply flex-col;
}

.tab-nav-horizontal {
  @apply flex-row items-center flex-wrap;
}

.tab-nav-default {
  @apply border-b border-neutral-800;
}

.tab-nav-minimal {
  @apply gap-2;
}

.tab-nav-underline {
  @apply border-b border-neutral-800;
}

.tab-nav-contained {
  @apply bg-neutral-900 rounded-md p-1;
}

.tab-nav-bordered {
  @apply border border-neutral-800 rounded-md;
}

.tab-nav-pills.tab-nav-horizontal {
  @apply gap-2;
}

.tab-nav-stretched.tab-nav-horizontal {
  @apply w-full;
}

.tab-nav-stretched .tab-nav-item {
  @apply flex-1;
}

.tab-content {
  @apply flex-1 pt-4;
}
</style> 