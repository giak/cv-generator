<template>
  <div class="p-6 space-y-6 bg-neutral-900 rounded-lg">
    <h2 class="text-xl font-semibold text-white">Toast Notification Examples</h2>
    
    <div class="flex flex-wrap gap-3">
      <button 
        @click="showSuccessToast" 
        class="px-4 py-2 bg-success-500 text-white rounded hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-400"
      >
        Success Toast
      </button>
      
      <button 
        @click="showErrorToast" 
        class="px-4 py-2 bg-error-500 text-white rounded hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-error-400"
      >
        Error Toast
      </button>
      
      <button 
        @click="showWarningToast" 
        class="px-4 py-2 bg-warning-500 text-white rounded hover:bg-warning-600 focus:outline-none focus:ring-2 focus:ring-warning-400"
      >
        Warning Toast
      </button>
      
      <button 
        @click="showInfoToast" 
        class="px-4 py-2 bg-info-500 text-white rounded hover:bg-info-600 focus:outline-none focus:ring-2 focus:ring-info-400"
      >
        Info Toast
      </button>
    </div>
    
    <div class="flex flex-wrap gap-3">
      <button 
        @click="showToastWithAction" 
        class="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500"
      >
        Toast with Action
      </button>
      
      <button 
        @click="showPersistentToast" 
        class="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500"
      >
        Persistent Toast
      </button>
      
      <button 
        @click="showPositionedToast" 
        class="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500"
      >
        Bottom-Right Toast
      </button>
    </div>
    
    <div class="mt-6">
      <h3 class="text-lg font-medium text-white mb-2">Toast Component Usage</h3>
      <pre class="p-4 bg-neutral-800 text-neutral-300 rounded overflow-x-auto text-sm">
import { useToast } from '@/plugins/toast';

const toast = useToast();

// Success toast
toast.success('Operation completed successfully!');

// Error toast with title
toast.error('Failed to save changes', { 
  title: 'Error' 
});

// Warning toast with action
toast.warning('Your session will expire soon', {
  title: 'Warning',
  actionLabel: 'Extend Session',
  actionData: { action: 'extend' },
  duration: 0 // Persistent
});
      </pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useToast } from '../../plugins/toast';

export default defineComponent({
  name: 'ToastExample',
  setup() {
    const toast = useToast();
    
    const showSuccessToast = () => {
      toast.success('Operation completed successfully!', {
        title: 'Success'
      });
    };
    
    const showErrorToast = () => {
      toast.error('Failed to save changes. Please try again.', {
        title: 'Error Occurred'
      });
    };
    
    const showWarningToast = () => {
      toast.warning('Your session will expire in 5 minutes.', {
        title: 'Session Expiring'
      });
    };
    
    const showInfoToast = () => {
      toast.info('New version available. Refresh to update.', {
        title: 'Information'
      });
    };
    
    const showToastWithAction = () => {
      toast.warning('Your session will expire soon', {
        title: 'Session Expiring',
        actionLabel: 'Extend Session',
        actionData: { action: 'extend_session' },
        duration: 10000
      });
    };
    
    const showPersistentToast = () => {
      toast.info('This is a persistent toast that will not auto-dismiss.', {
        title: 'Persistent Toast',
        duration: 0, // 0 means it won't auto-dismiss
        dismissible: true
      });
    };
    
    const showPositionedToast = () => {
      toast.success('This toast appears at the bottom right.', {
        title: 'Position Example',
        position: 'bottom-right'
      });
    };
    
    return {
      showSuccessToast,
      showErrorToast,
      showWarningToast,
      showInfoToast,
      showToastWithAction,
      showPersistentToast,
      showPositionedToast
    };
  }
});
</script> 