<script setup lang="ts">
import ResumeForm from "./modules/cv/presentation/components/ResumeForm.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4">
        <h1 class="text-3xl font-bold text-gray-900">CV Generator</h1>
        <p class="text-sm text-gray-500">Build your professional CV</p>
      </div>
    </header>
    <main>
      <ResumeForm />
    </main>
  </div>
</template> 