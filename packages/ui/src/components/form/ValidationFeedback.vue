<template>
  <p
    v-if="error && error.length > 0"
    role="alert"
    aria-live="polite"
    class="mt-1 text-sm text-red-500"
    :class="$attrs.class"
  >
    {{ error }}
  </p>
</template>

<script setup lang="ts">
defineProps<{
  error: string
}>()
</script> 