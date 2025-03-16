<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div 
      class="bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 animate-fade-in"
      @click.stop
    >
      <h3 class="text-xl font-semibold text-white">{{ title }}</h3>
      
      <p class="text-neutral-300">{{ message }}</p>
      
      <div class="flex justify-end space-x-3 pt-2">
        <Button 
          variant="secondary" 
          size="md" 
          @click="$emit('cancel')"
        >
          {{ cancelText }}
        </Button>
        
        <Button 
          variant="danger" 
          size="md" 
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Button from './Button.vue'

defineProps({
  /**
   * Contrôle la visibilité du modal
   */
  modelValue: {
    type: Boolean,
    required: true
  },
  
  /**
   * Titre du modal de confirmation
   */
  title: {
    type: String,
    default: 'Confirmation'
  },
  
  /**
   * Message de confirmation
   */
  message: {
    type: String,
    required: true
  },
  
  /**
   * Texte du bouton de confirmation
   */
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  
  /**
   * Texte du bouton d'annulation
   */
  cancelText: {
    type: String,
    default: 'Annuler'
  }
})

defineEmits(['update:modelValue', 'confirm', 'cancel'])
</script>

<style scoped lang="scss">
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style> 