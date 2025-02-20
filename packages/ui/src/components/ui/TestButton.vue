<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <button class="test-btn">
    {{ label || 'Test Button' }}
  </button>
</template> 