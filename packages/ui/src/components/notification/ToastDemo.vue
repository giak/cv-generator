<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-neutral-100">Toast Notification Component</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Direct Component Usage Example -->
      <div class="bg-neutral-800 p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-4 text-white">Direct Component Usage</h3>
        
        <div class="space-y-6">
          <div class="relative h-60 bg-neutral-900 rounded border border-neutral-700 overflow-hidden">
            <div class="p-4">
              <!-- Exemple d'utilisation directe du composant -->
              <Toast 
                v-if="showDirectToast"
                :type="directToastType"
                :title="directToastTitle"
                :message="directToastMessage"
                :duration="directToastDuration"
                :dismissible="true"
                @dismiss="showDirectToast = false"
              />
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex gap-3 flex-wrap">
              <label class="flex items-center">
                <span class="text-sm text-neutral-300 mr-2">Type:</span>
                <select 
                  v-model="directToastType"
                  class="bg-neutral-700 text-white text-sm rounded px-2 py-1 border-none focus:ring-1 focus:ring-neutral-500"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </label>
              
              <label class="flex items-center">
                <span class="text-sm text-neutral-300 mr-2">Duration:</span>
                <select 
                  v-model="directToastDuration"
                  class="bg-neutral-700 text-white text-sm rounded px-2 py-1 border-none focus:ring-1 focus:ring-neutral-500"
                >
                  <option :value="3000">3 seconds</option>
                  <option :value="5000">5 seconds</option>
                  <option :value="10000">10 seconds</option>
                  <option :value="0">Persistent</option>
                </select>
              </label>
            </div>
            
            <div>
              <input 
                type="text" 
                v-model="directToastTitle" 
                placeholder="Toast Title"
                class="w-full bg-neutral-700 text-white rounded px-3 py-2 mb-2 border-none focus:ring-1 focus:ring-neutral-500"
              />
              
              <textarea 
                v-model="directToastMessage" 
                placeholder="Toast Message"
                class="w-full bg-neutral-700 text-white rounded px-3 py-2 border-none focus:ring-1 focus:ring-neutral-500 resize-none h-20"
              ></textarea>
            </div>
            
            <button 
              @click="showDirectToast = true"
              class="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              Show Toast
            </button>
          </div>
        </div>
      </div>
      
      <!-- Plugin Usage Example -->
      <div class="bg-neutral-800 p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-4 text-white">Plugin Usage</h3>
        
        <div class="space-y-6">
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
              Bottom Position
            </button>
          </div>
          
          <div>
            <h4 class="text-lg font-medium text-white mb-2">Implementation</h4>
            <pre class="p-4 bg-neutral-900 text-neutral-300 rounded overflow-x-auto text-sm">
import { useToast } from '@/plugins/toast';

// Dans un composant
const toast = useToast();

// Basic usage
toast.success('Operation completed!');

// With title and action
toast.warning('Session expiring', {
  title: 'Warning',
  actionLabel: 'Extend Session'
});
            </pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useToast } from '../../plugins/toast';
import Toast from './Toast.vue';

export default defineComponent({
  name: 'ToastDemo',
  components: {
    Toast
  },
  setup() {
    const toast = useToast();
    
    // Direct component props
    const showDirectToast = ref(false);
    const directToastType = ref<'info' | 'success' | 'warning' | 'error'>('info');
    const directToastTitle = ref('Example Toast');
    const directToastMessage = ref('This is a direct toast component example');
    const directToastDuration = ref(5000);
    
    // Plugin methods
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
      toast.success('This toast appears at the bottom.', {
        title: 'Position Example',
        position: 'bottom-center'
      });
    };
    
    return {
      // Direct component props
      showDirectToast,
      directToastType,
      directToastTitle,
      directToastMessage,
      directToastDuration,
      
      // Plugin methods
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