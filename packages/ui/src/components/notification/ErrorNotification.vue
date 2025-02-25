<template>
  <div v-if="visibleErrors.length > 0" class="fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-4 p-4">
    <div 
      v-for="error in visibleErrors" 
      :key="error.id"
      :id="`error-${error.id}`"
      class="flex w-full max-w-md rounded-md shadow-md transition-all" 
      :class="[
        getSeverityClass(error.severity),
        error.dismissed ? 'opacity-0 translate-y-[-1rem]' : 'opacity-100'
      ]"
      role="alert"
      :aria-live="error.severity === 'error' ? 'assertive' : 'polite'"
    >
      <div class="flex flex-1 p-4">
        <div class="flex-shrink-0 mr-3">
          <component 
            :is="getSeverityIcon(error.severity)" 
            class="h-5 w-5" 
            :class="getSeverityIconClass(error.severity)"
            aria-hidden="true"
          />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ error.message }}</p>
          <div v-if="error.action" class="mt-2">
            <button 
              class="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
              @click="handleAction(error)"
            >
              {{ error.action.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="flex">
        <button 
          type="button" 
          class="flex rounded-tr-md rounded-br-md p-1.5 focus:outline-none focus:ring-2"
          :class="getDismissClass(error.severity)"
          :aria-label="`Dismiss ${error.message}`"
          @click="handleDismiss(error.id)"
        >
          <XMarkIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { useErrorStore, type ErrorInfo, type ErrorSeverity } from '../../core/stores/error';

const props = defineProps({
  // If provided, only show errors from this source
  source: {
    type: String,
    required: false
  }
});

const emit = defineEmits(['action']);

const errorStore = useErrorStore();

const visibleErrors = computed(() => {
  let filtered = errorStore.errors.filter(error => !error.dismissed);
  
  if (props.source) {
    filtered = filtered.filter(error => error.source === props.source);
  }
  
  return filtered;
});

function getSeverityClass(severity: ErrorSeverity): string {
  switch (severity) {
    case 'error':
      return 'bg-red-50 border-l-4 border-red-400';
    case 'warning':
      return 'bg-yellow-50 border-l-4 border-yellow-400';
    case 'info':
    default:
      return 'bg-blue-50 border-l-4 border-blue-400';
  }
}

function getSeverityIcon(severity: ErrorSeverity) {
  switch (severity) {
    case 'error':
      return ExclamationCircleIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    case 'info':
    default:
      return InformationCircleIcon;
  }
}

function getSeverityIconClass(severity: ErrorSeverity): string {
  switch (severity) {
    case 'error':
      return 'text-red-400';
    case 'warning':
      return 'text-yellow-400';
    case 'info':
    default:
      return 'text-blue-400';
  }
}

function getDismissClass(severity: ErrorSeverity): string {
  switch (severity) {
    case 'error':
      return 'hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50';
    case 'warning':
      return 'hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50';
    case 'info':
    default:
      return 'hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50';
  }
}

function handleDismiss(id: string): void {
  errorStore.dismissError(id);
}

function handleAction(error: ErrorInfo): void {
  emit('action', error);
}
</script>

<style scoped>
.error-notification-enter-active,
.error-notification-leave-active {
  transition: all 0.3s ease;
}

.error-notification-enter-from,
.error-notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 