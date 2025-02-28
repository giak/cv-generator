<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      :class="[
        'w-full max-w-sm bg-neutral-800 shadow-lg rounded-lg pointer-events-auto border-l-4',
        typeClasses,
        positionClasses
      ]"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="flex items-start p-4">
        <!-- Icon -->
        <div v-if="hasIcon" class="flex-shrink-0">
          <slot name="icon">
            <component
              :is="icon || defaultIcon"
              class="h-5 w-5"
              :class="iconColorClass"
              aria-hidden="true"
            />
          </slot>
        </div>

        <!-- Content -->
        <div class="ml-3 w-0 flex-1">
          <div v-if="hasTitle" class="text-sm font-semibold text-white">
            <slot name="title">{{ title }}</slot>
          </div>
          <div class="mt-1 text-xs text-neutral-300">
            <slot>{{ message }}</slot>
          </div>
          
          <!-- Actions -->
          <div v-if="hasAction || $slots.actions" class="mt-3 flex gap-x-3">
            <slot name="actions">
              <button
                v-if="actionLabel"
                type="button"
                class="rounded-md bg-neutral-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                @click="handleAction"
              >
                {{ actionLabel }}
              </button>
            </slot>
          </div>
        </div>

        <!-- Close button -->
        <div v-if="dismissible" class="ml-4 flex flex-shrink-0">
          <button
            type="button"
            class="inline-flex rounded-md bg-transparent text-neutral-400 hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            @click="dismiss"
          >
            <span class="sr-only">Fermer</span>
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, onBeforeUnmount, computed } from 'vue';

// Icônes par défaut (à remplacer par vos propres imports d'icônes)
const InfoIcon = defineComponent({
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
});

const SuccessIcon = defineComponent({
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
});

const WarningIcon = defineComponent({
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>`
});

const ErrorIcon = defineComponent({
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
});

export default defineComponent({
  name: 'Toast',
  components: {
    InfoIcon,
    SuccessIcon,
    WarningIcon,
    ErrorIcon
  },
  props: {
    type: {
      type: String as PropType<'info' | 'success' | 'warning' | 'error'>,
      default: 'info',
      validator: (value: string) => ['info', 'success', 'warning', 'error'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 5000
    },
    position: {
      type: String as PropType<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'>,
      default: 'top-right',
      validator: (value: string) => [
        'top-right', 'top-left', 'bottom-right', 
        'bottom-left', 'top-center', 'bottom-center'
      ].includes(value)
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    icon: {
      type: Object as PropType<any>,
      default: null
    },
    actionLabel: {
      type: String,
      default: ''
    },
    actionData: {
      type: [Object, String, Number, Boolean, Array],
      default: null
    }
  },
  emits: ['dismiss', 'action'],
  setup(props, { emit, slots }) {
    const isVisible = ref(true);
    const timeout = ref<number | null>(null);

    const hasTitle = computed(() => !!props.title || !!slots.title);
    const hasIcon = computed(() => !!props.icon || props.type !== null);
    const hasAction = computed(() => !!props.actionLabel);
    
    const typeClasses = computed(() => {
      switch (props.type) {
        case 'success':
          return 'border-success-500';
        case 'warning':
          return 'border-warning-500';
        case 'error':
          return 'border-error-500';
        case 'info':
        default:
          return 'border-info-500';
      }
    });
    
    const iconColorClass = computed(() => {
      switch (props.type) {
        case 'success':
          return 'text-success-400';
        case 'warning':
          return 'text-warning-400';
        case 'error':
          return 'text-error-400';
        case 'info':
        default:
          return 'text-info-400';
      }
    });
    
    const positionClasses = computed(() => {
      // Ces classes seront appliquées par le conteneur parent (ToastContainer)
      return '';
    });
    
    const defaultIcon = computed(() => {
      switch (props.type) {
        case 'success':
          return SuccessIcon;
        case 'warning':
          return WarningIcon;
        case 'error':
          return ErrorIcon;
        case 'info':
        default:
          return InfoIcon;
      }
    });
    
    const dismiss = () => {
      isVisible.value = false;
      if (timeout.value !== null) {
        clearTimeout(timeout.value);
        timeout.value = null;
      }
      emit('dismiss');
    };
    
    const handleAction = () => {
      emit('action', props.actionData || props.actionLabel);
      if (props.dismissible) {
        dismiss();
      }
    };
    
    const setupAutoClose = () => {
      if (props.duration > 0) {
        timeout.value = window.setTimeout(() => {
          dismiss();
        }, props.duration);
      }
    };
    
    onMounted(() => {
      setupAutoClose();
    });
    
    onBeforeUnmount(() => {
      if (timeout.value !== null) {
        clearTimeout(timeout.value);
      }
    });
    
    return {
      isVisible,
      typeClasses,
      positionClasses,
      iconColorClass,
      hasTitle,
      hasIcon,
      hasAction,
      defaultIcon,
      dismiss,
      handleAction
    };
  }
});
</script> 