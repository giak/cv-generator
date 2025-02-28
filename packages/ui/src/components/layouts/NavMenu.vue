<script setup lang="ts">
interface NavItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  active?: boolean;
  children?: NavItem[];
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

interface Props {
  groups: NavGroup[];
}

const props = defineProps<Props>();

// Emit events for navigation
const emit = defineEmits<{
  (e: 'navigate', path: string): void
}>();

// Handle navigation click
const handleNavClick = (path: string | undefined) => {
  if (path) {
    emit('navigate', path);
  }
};
</script>

<template>
  <nav class="nav-menu" aria-label="Main Navigation" data-test="nav-menu">
    <div
      v-for="group in groups"
      :key="group.id"
      class="mb-6"
      :data-test="`nav-group-${group.id}`"
    >
      <!-- Group Title -->
      <div class="px-4 py-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
        {{ group.title }}
      </div>
      
      <!-- Group Items -->
      <ul class="space-y-1">
        <li 
          v-for="item in group.items" 
          :key="item.id"
          class="nav-item"
          :data-test="`nav-item-${item.id}`"
        >
          <!-- Main Nav Link -->
          <div
            class="flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors duration-200 rounded-sm mx-2 cursor-pointer"
            :class="{ 'bg-primary-500/10 text-primary-400 font-medium': item.active }"
            @click="handleNavClick(item.path)"
            :data-test="`nav-link-${item.id}`"
          >
            <!-- Icon -->
            <span class="mr-3 text-neutral-400 flex items-center justify-center w-5 h-5" :class="{ 'text-primary-400': item.active }">
              <!-- If icon is provided as a slot -->
              <slot :name="`icon-${item.id}`" v-if="$slots[`icon-${item.id}`]"></slot>
              
              <!-- Default icon -->
              <span v-else-if="item.icon" v-html="item.icon"></span>
              
              <!-- Fallback icon -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                <circle cx="12" cy="12" r="1"></circle>
              </svg>
            </span>
            
            <!-- Label -->
            <span>{{ item.label }}</span>
          </div>
          
          <!-- Dropdown Items (if any) -->
          <ul v-if="item.children && item.children.length > 0" class="pl-4">
            <li 
              v-for="child in item.children" 
              :key="child.id"
              :data-test="`dropdown-item-${child.id}`"
            >
              <div
                class="flex items-center px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-sm transition-colors duration-200 mx-2 cursor-pointer"
                :class="{ 'text-primary-400 font-medium': child.active }"
                @click="handleNavClick(child.path)"
              >
                {{ child.label }}
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template> 