<template>
  <div
    :class="[
      'fixed z-50 p-4 flex flex-col gap-3 w-full max-w-[350px]',
      positionClasses
    ]"
    role="status"
    aria-live="assertive"
  >
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      v-bind="toast"
      @dismiss="removeToast(toast.id)"
      @action="handleAction(toast.id, $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue';
import Toast from './Toast.vue';

export type ToastItem = {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  icon?: any;
  actionLabel?: string;
  actionCallback?: () => void;
  [key: string]: any;
};

export default defineComponent({
  name: 'ToastContainer',
  components: {
    Toast
  },
  props: {
    position: {
      type: String as PropType<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'>,
      default: 'top-right',
      validator: (value: string) => [
        'top-right', 'top-left', 'bottom-right', 
        'bottom-left', 'top-center', 'bottom-center'
      ].includes(value)
    },
    maxToasts: {
      type: Number,
      default: 5
    }
  },
  emits: ['dismiss', 'action'],
  setup(props, { emit }) {
    const toasts = ref<ToastItem[]>([]);
    
    const positionClasses = computed(() => {
      switch (props.position) {
        case 'top-right':
          return 'top-4 right-4';
        case 'top-left':
          return 'top-4 left-4';
        case 'bottom-right':
          return 'bottom-4 right-4';
        case 'bottom-left':
          return 'bottom-4 left-4';
        case 'top-center':
          return 'top-4 left-1/2 -translate-x-1/2';
        case 'bottom-center':
          return 'bottom-4 left-1/2 -translate-x-1/2';
        default:
          return 'top-4 right-4';
      }
    });
    
    const addToast = (toast: Omit<ToastItem, 'id'>): string => {
      const id = String(Date.now());
      
      // Limiter le nombre de toasts visibles
      if (toasts.value.length >= props.maxToasts) {
        toasts.value.shift(); // Enlever le plus ancien
      }
      
      toasts.value.push({
        id,
        ...toast
      });
      
      return id;
    };
    
    const removeToast = (id: string): void => {
      const index = toasts.value.findIndex(toast => toast.id === id);
      if (index !== -1) {
        toasts.value.splice(index, 1);
        emit('dismiss', id);
      }
    };
    
    const clearAll = (): void => {
      toasts.value = [];
    };
    
    const handleAction = (id: string, action: any): void => {
      emit('action', action);
      
      const toast = toasts.value.find(t => t.id === id);
      if (toast?.actionCallback) {
        toast.actionCallback();
      }
    };
    
    return {
      toasts,
      positionClasses,
      addToast,
      removeToast,
      clearAll,
      handleAction
    };
  }
});
</script> 