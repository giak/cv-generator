<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;
  role?: string;
  avatarUrl?: string;
}

const props = defineProps<Props>();

// Generate initials from name for avatar fallback
const initials = computed(() => {
  if (!props.name) return '';
  
  const nameParts = props.name.split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }
  
  return props.name.substring(0, 2).toUpperCase();
});

// Emit menu click event
const emit = defineEmits<{
  (e: 'menu-click'): void
}>();

// Handle menu click
const handleMenuClick = () => {
  emit('menu-click');
};
</script>

<template>
  <div class="flex items-center" data-test="user-info">
    <!-- Avatar -->
    <div class="w-8 h-8 rounded-full mr-3 bg-neutral-700 flex items-center justify-center text-xs font-medium overflow-hidden">
      <img v-if="avatarUrl" :src="avatarUrl" :alt="name" class="w-full h-full object-cover">
      <span v-else>{{ initials }}</span>
    </div>
    
    <!-- User Details -->
    <div class="flex-1">
      <div class="text-sm font-medium text-white">{{ name }}</div>
      <div v-if="role" class="text-xs text-neutral-400">{{ role }}</div>
    </div>
    
    <!-- User Menu Button -->
    <button 
      class="text-neutral-400 hover:text-white transition-colors duration-200"
      @click="handleMenuClick"
      aria-label="User menu"
      data-test="user-menu-button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
        <path d="M6 9l6 6 6-6"></path>
      </svg>
    </button>
  </div>
</template> 