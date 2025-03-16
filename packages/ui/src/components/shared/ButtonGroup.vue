import { type } from '../../../../shared/dist/index';
<script setup lang="ts">
interface Props {
  vertical?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false
});
</script>

<template>
  <div 
    class="inline-flex rounded-md shadow-sm" 
    :class="{ 'flex-col': vertical }"
    role="group"
    data-test="button-group"
  >
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
/* These styles handle the connected appearance of buttons in the group */
:deep(button), :deep(a) {
  @apply rounded-none border-r-0 relative;
}

:deep(button:first-child), :deep(a:first-child) {
  @apply rounded-l;
}

:deep(button:last-child), :deep(a:last-child) {
  @apply rounded-r border-r;
}

:deep(button:focus), :deep(a:focus) {
  @apply z-10;
}

/* Vertical orientation styles */
.flex-col :deep(button), .flex-col :deep(a) {
  @apply border-r border-b-0;
}

.flex-col :deep(button:first-child), .flex-col :deep(a:first-child) {
  @apply rounded-t rounded-bl-none;
}

.flex-col :deep(button:last-child), .flex-col :deep(a:last-child) {
  @apply rounded-b rounded-tr-none border-b;
}
</style> 