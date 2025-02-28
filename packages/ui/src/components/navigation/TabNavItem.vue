<template>
  <button
    class="tab-nav-item"
    :class="[
      `tab-item-${variant}`,
      {
        'tab-item-active': isActive,
        'tab-item-disabled': localDisabled,
        'tab-item-vertical': isVertical,
        'tab-item-horizontal': !isVertical,
        'tab-item-with-icon': $slots.icon
      }
    ]"
    :id="`tab-${value}`"
    role="tab"
    :aria-selected="isActive.toString()"
    :aria-controls="`panel-${value}`"
    :tabindex="isActive ? 0 : -1"
    :disabled="localDisabled"
    @click="!localDisabled && onTabClick()"
    @keydown.space.enter.prevent="!localDisabled && onTabClick()"
  >
    <div class="tab-item-content">
      <span v-if="$slots.icon" class="tab-item-icon">
        <slot name="icon"></slot>
      </span>
      <slot>{{ label }}</slot>
      <span v-if="badge" class="tab-item-badge" :class="`badge-${badgeVariant}`">
        {{ badge }}
      </span>
    </div>
    <div v-if="variant === 'underline' && isActive" class="tab-item-indicator"></div>
  </button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

interface TabNavContext {
  activeTab: { value: string | number };
  setActiveTab: (value: string | number) => void;
  disabled: { value: boolean };
}

interface TabNavItemProps {
  value: string | number;
  label?: string;
  disabled?: boolean;
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  variant?: 'default' | 'minimal' | 'underline' | 'contained';
  vertical?: boolean;
}

const props = withDefaults(defineProps<TabNavItemProps>(), {
  label: '',
  disabled: false,
  badge: '',
  badgeVariant: 'default',
  variant: 'default',
  vertical: false
});

// Récupérer le contexte depuis TabNav
const tabContext = inject<TabNavContext>('tabNavContext');

// Vérifier si l'onglet est actif
const isActive = computed(() => {
  if (!tabContext) return false;
  return tabContext.activeTab.value === props.value;
});

// Gérer le clic sur l'onglet
const onTabClick = () => {
  if (!tabContext) return;
  tabContext.setActiveTab(props.value);
};

// Calculer l'état désactivé (combinaison des props locales et du parent)
const localDisabled = computed(() => {
  if (!tabContext) return props.disabled;
  return props.disabled || tabContext.disabled.value;
});

// Calculer la direction
const isVertical = computed(() => props.vertical);
</script>

<style lang="postcss">
.tab-nav-item {
  @apply relative px-4 py-2 transition-all duration-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/40;
}

/* Variants */
.tab-item-default {
  @apply text-neutral-400 hover:text-white;
}

.tab-item-default.tab-item-active {
  @apply text-primary-400 hover:text-primary-300;
}

.tab-item-default.tab-item-horizontal {
  @apply border-b-2 border-transparent;
}

.tab-item-default.tab-item-horizontal.tab-item-active {
  @apply border-b-2 border-primary-500;
}

.tab-item-default.tab-item-vertical {
  @apply border-l-2 border-transparent;
}

.tab-item-default.tab-item-vertical.tab-item-active {
  @apply border-l-2 border-primary-500;
}

.tab-item-minimal {
  @apply rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800/50;
}

.tab-item-minimal.tab-item-active {
  @apply text-primary-400 bg-primary-500/10 hover:bg-primary-500/15;
}

.tab-item-underline {
  @apply text-neutral-400 hover:text-white;
}

.tab-item-underline.tab-item-active {
  @apply text-primary-400 hover:text-primary-300;
}

.tab-item-underline .tab-item-indicator {
  @apply absolute bottom-0 left-0 h-0.5 w-full bg-primary-500 transition-all duration-200;
}

.tab-item-contained {
  @apply text-neutral-400 hover:text-white rounded-md;
}

.tab-item-contained.tab-item-active {
  @apply bg-neutral-800 text-white;
}

/* Orientation */
.tab-item-vertical {
  @apply text-left;
}

.tab-item-horizontal {
  @apply text-center;
}

/* État désactivé */
.tab-item-disabled {
  @apply opacity-50 cursor-not-allowed hover:text-neutral-400;
}

/* Contenu */
.tab-item-content {
  @apply flex items-center justify-center gap-2;
}

.tab-item-with-icon.tab-item-vertical .tab-item-content {
  @apply justify-start;
}

.tab-item-icon {
  @apply flex-shrink-0 w-4 h-4 text-neutral-400;
}

.tab-item-active .tab-item-icon {
  @apply text-primary-400;
}

.tab-item-badge {
  @apply ml-1.5 text-xs py-0.5 px-1.5 rounded-full bg-neutral-700/50 text-neutral-400;
}

.tab-item-badge.badge-primary {
  @apply bg-primary-500/15 text-primary-400;
}

.tab-item-badge.badge-success {
  @apply bg-success-500/15 text-success-400;
}

.tab-item-badge.badge-warning {
  @apply bg-warning-500/15 text-warning-400;
}

.tab-item-badge.badge-danger {
  @apply bg-error-500/15 text-error-400;
}
</style> 