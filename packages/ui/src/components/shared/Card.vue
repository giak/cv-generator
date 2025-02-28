<script setup lang="ts">
interface Props {
  variant?: 'default' | 'hover' | 'selected' | 'shadowed';
  noPadding?: boolean;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  noPadding: false,
  compact: false
});

// Base card classes
const cardClasses = [
  'bg-neutral-850 border border-neutral-700 rounded-md overflow-hidden transition-all duration-200',
  // Variant styles
  props.variant === 'hover' ? 'hover:shadow-md hover:border-neutral-600' : '',
  props.variant === 'selected' ? 'border-primary-500 shadow-glow-primary' : '',
  props.variant === 'shadowed' ? 'shadow-md' : ''
];

// Body padding classes based on props
const bodyClasses = [
  'card-body',
  props.compact ? 'p-3' : 'p-4',
  props.noPadding ? 'p-0' : ''
];
</script>

<template>
  <div :class="cardClasses" data-test="card">
    <!-- Card Header (optional) -->
    <div 
      v-if="$slots.header" 
      :class="[
        'card-header flex items-center justify-between bg-neutral-900 border-b border-neutral-700',
        compact ? 'py-3 px-4' : 'p-4'
      ]"
    >
      <slot name="header"></slot>
    </div>
    
    <!-- Title slot for convenience (renders inside header) -->
    <div 
      v-if="$slots.title && !$slots.header" 
      :class="[
        'card-header flex items-center justify-between bg-neutral-900 border-b border-neutral-700',
        compact ? 'py-3 px-4' : 'p-4'
      ]"
    >
      <div class="flex items-center justify-between w-full">
        <div>
          <h3 class="text-md font-semibold text-white flex items-center">
            <span v-if="$slots.icon" class="flex items-center mr-2 text-primary-400">
              <slot name="icon"></slot>
            </span>
            <slot name="title"></slot>
          </h3>
          <p v-if="$slots.subtitle" class="text-sm text-neutral-400 mt-1">
            <slot name="subtitle"></slot>
          </p>
        </div>
        <div v-if="$slots.actions" class="flex items-center gap-2">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
    
    <!-- Card Body -->
    <div :class="bodyClasses">
      <slot></slot>
    </div>
    
    <!-- Card Footer (optional) -->
    <div 
      v-if="$slots.footer" 
      class="p-4 bg-neutral-900 border-t border-neutral-700 flex items-center justify-between"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template> 