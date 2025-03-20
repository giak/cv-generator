<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LanguageSelector from '../navigation/LanguageSelector.vue';

// Initialize i18n
const { t } = useI18n();

// Function to safely handle translations with fallback
const safeTranslate = (key: string, fallback: string = 'Translation missing') => {
  try {
    const translated = t(key);
    // Check if translation exists and is not the same as the key
    return (translated && translated !== key) ? translated : fallback;
  } catch (error) {

    return fallback;
  }
};

interface Props {
  title?: string;
  subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: ''
});

// State for mobile sidebar toggle
const isSidebarOpen = ref(false);

// Toggle sidebar visibility on mobile
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  
  // Prevent body scrolling when sidebar is open on mobile
  if (isSidebarOpen.value) {
    document.body.classList.add('sidebar-open');
  } else {
    document.body.classList.remove('sidebar-open');
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen w-full bg-neutral-900 text-white relative">
    <!-- Dashboard Sidebar -->
    <aside 
      class="fixed md:static inset-y-0 left-0 z-30 w-64 bg-neutral-850 border-r border-neutral-700 flex flex-col transition-transform duration-300 ease-in-out overflow-y-auto h-screen"
      :class="{ 
        'translate-x-0 shadow-lg': isSidebarOpen, 
        '-translate-x-full md:translate-x-0': !isSidebarOpen 
      }"
      :data-open="isSidebarOpen"
      data-test="dashboard-sidebar"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center p-4 h-14 border-b border-neutral-700 sticky top-0 bg-neutral-850 z-10">
        <div class="flex justify-center items-center w-8 h-8 mr-3">
          <!-- Logo Slot -->
          <slot name="logo">
            <!-- Default logo -->
            <div class="text-primary-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
          </slot>
        </div>
        <h1 class="font-semibold text-sm tracking-wider text-white uppercase">
          <slot name="brand-name">{{ safeTranslate('ui.app.brandName', 'CV Generator') }}</slot>
        </h1>
      </div>
      
      <!-- Sidebar Content -->
      <div class="flex-1 py-4 overflow-y-auto">
        <slot name="sidebar-content"></slot>
      </div>
      
      <!-- Sidebar Footer (optional) -->
      <div class="px-4 py-3 border-t border-neutral-700 bg-neutral-850 mt-auto" v-if="$slots['sidebar-footer']">
        <slot name="sidebar-footer"></slot>
      </div>
    </aside>
    
    <!-- Dashboard Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Dashboard Header -->
      <header class="bg-neutral-850 border-b border-neutral-700 flex items-center justify-between h-14 px-4 sticky top-0 z-20">
        <!-- Header Left -->
        <div class="flex items-center">
          <!-- Mobile Sidebar Toggle -->
          <button 
            class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white mr-3 transition-colors duration-200 lg:hidden"
            @click="toggleSidebar"
            :aria-label="safeTranslate('ui.sidebar.toggle', 'Toggle sidebar')"
            data-test="toggle-sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <!-- Breadcrumb -->
          <div class="hidden md:flex items-center text-sm">
            <slot name="breadcrumb"></slot>
          </div>
        </div>
        
        <!-- Header Search (optional) -->
        <div class="relative hidden md:block max-w-md w-full mx-4" v-if="$slots.search">
          <slot name="search"></slot>
        </div>
        
        <!-- Header Right -->
        <div class="flex items-center space-x-3">
          <div class="mr-2">
            <LanguageSelector />
          </div>
          <slot name="header-actions"></slot>
        </div>
      </header>
      
      <!-- Dashboard Main Content -->
      <main class="p-4 md:p-6 flex-1 overflow-y-auto bg-neutral-900">
        <!-- Page Header (optional) -->
        <div class="mb-6" v-if="title || subtitle || $slots['page-header']">
          <slot name="page-header">
            <h1 class="text-xl font-semibold text-white mb-2">{{ title }}</h1>
            <p v-if="subtitle" class="text-sm text-neutral-400">{{ subtitle }}</p>
          </slot>
        </div>
        
        <!-- Main Content -->
        <slot></slot>
      </main>
    </div>
  </div>
</template>
