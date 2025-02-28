<script setup lang="ts">
interface BreadcrumbItem {
  id: string;
  label: string;
  path?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

const props = defineProps<Props>();

// Emit events for navigation
const emit = defineEmits<{
  (e: 'navigate', path: string): void
}>();

// Handle breadcrumb click
const handleBreadcrumbClick = (path: string | undefined, index: number) => {
  if (path) {
    emit('navigate', path);
  }
};
</script>

<template>
  <div class="flex items-center text-sm" data-test="breadcrumb">
    <div 
      v-for="(item, index) in items" 
      :key="item.id"
      class="flex items-center text-neutral-400"
      :class="{ 'text-white': index === items.length - 1 }"
      :data-test="`breadcrumb-item-${item.id}`"
    >
      <!-- Breadcrumb item -->
      <template v-if="item.path && index !== items.length - 1">
        <a 
          href="#" 
          class="hover:text-primary-400 transition-colors duration-200"
          @click.prevent="handleBreadcrumbClick(item.path, index)"
        >
          {{ item.label }}
        </a>
      </template>
      <template v-else>
        <span>{{ item.label }}</span>
      </template>
      
      <!-- Separator (except for the last item) -->
      <span 
        v-if="index !== items.length - 1" 
        class="mx-2 text-neutral-600"
        aria-hidden="true"
      >/</span>
    </div>
  </div>
</template> 