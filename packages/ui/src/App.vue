<script setup lang="ts">
import BasicsForm from "./modules/cv/presentation/components/BasicsForm.vue";
import { useResumeStore } from "./stores/resume";
import { onMounted } from "vue";

const store = useResumeStore();

onMounted(() => {
  store.loadResume();
});
</script>

<template>
  <div class="min-h-screen bg-[var(--color-neutral-100)]">
    <header class="bg-[var(--color-neutral-50)] shadow-sm">
      <div class="container mx-auto py-6 px-4">
        <h1 class="text-3xl font-bold text-[var(--color-neutral-900)]">CV Generator</h1>
        <p class="mt-1 text-sm text-[var(--color-neutral-500)]">Build your professional CV</p>
      </div>
    </header>

    <!-- Section de tests Tailwind v4 -->
    <div class="max-w-7xl mx-auto py-6 px-4 space-y-8">
      <!-- Test 1: Couleurs et Typographie -->
      <div class="rounded-lg bg-[var(--color-neutral-50)] p-6 shadow-sm">
        <h2 class="text-2xl font-semibold text-[var(--color-primary-500)]">Test des Couleurs et Typographie</h2>
        <div class="mt-4 space-y-4">
          <p class="text-[var(--color-neutral-700)]">Texte normal avec couleur neutre</p>
          <p class="text-[var(--color-primary-500)] font-medium">Texte en couleur primaire</p>
          <p class="text-[var(--color-error-500)]">Message d'erreur</p>
        </div>
      </div>

      <!-- Test 2: Bordures et Ombres -->
      <div class="rounded-lg border-2 border-[var(--color-neutral-200)] p-6">
        <h2 class="text-xl font-medium text-[var(--color-neutral-800)]">Test des Bordures</h2>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="rounded p-4 border border-[var(--color-primary-400)] bg-[var(--color-neutral-50)]">
            Bordure primaire
          </div>
          <div class="rounded p-4 border-2 border-[var(--color-neutral-300)] shadow-sm">
            Bordure neutre
          </div>
        </div>
      </div>

      <!-- Test 3: États Interactifs -->
      <div class="rounded-lg bg-[var(--color-neutral-50)] p-6">
        <h2 class="text-xl font-medium text-[var(--color-neutral-800)]">Test des États Interactifs</h2>
        <div class="mt-4 space-x-4">
          <button class="px-4 py-2 rounded-md bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 active:bg-[var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed">
            Bouton Principal
          </button>
          <button class="px-4 py-2 rounded-md border border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)] focus:outline-none focus:ring-2 focus:ring-[var(--color-neutral-400)] focus:ring-offset-2 active:bg-[var(--color-neutral-100)]">
            Bouton Secondaire
          </button>
        </div>
      </div>

      <!-- Test 4: Formulaires -->
      <div class="rounded-lg bg-[var(--color-neutral-50)] p-6">
        <h2 class="text-xl font-medium text-[var(--color-neutral-800)]">Test des Formulaires</h2>
        <div class="mt-4 space-y-4">
          <label class="block">
            <span class="text-sm font-medium text-[var(--color-neutral-700)]">Input Standard</span>
            <input
              type="text"
              class="mt-1 block w-full rounded-md border-[var(--color-neutral-300)] bg-white focus:border-[var(--color-primary-500)] focus:ring focus:ring-[var(--color-primary-200)] focus:ring-opacity-50"
              placeholder="Placeholder..."
            />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-[var(--color-neutral-700)]">Input avec Erreur</span>
            <input
              type="text"
              class="mt-1 block w-full rounded-md border-[var(--color-error-500)] bg-white focus:border-[var(--color-error-500)] focus:ring focus:ring-[var(--color-error-200)] focus:ring-opacity-50"
              placeholder="Erreur..."
            />
            <p class="mt-1 text-sm text-[var(--color-error-500)]">Message d'erreur</p>
          </label>
        </div>
      </div>

      <!-- Test 5: Grille et Espacement -->
      <div class="rounded-lg bg-[var(--color-neutral-50)] p-6">
        <h2 class="text-xl font-medium text-[var(--color-neutral-800)]">Test de la Grille</h2>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-4 rounded bg-[var(--color-primary-400)] text-white">Item 1</div>
          <div class="p-4 rounded bg-[var(--color-primary-500)] text-white">Item 2</div>
          <div class="p-4 rounded bg-[var(--color-primary-600)] text-white">Item 3</div>
        </div>
      </div>
    </div>

    <main class="container mx-auto py-6 px-4">
      <div v-if="store.loading" class="flex items-center justify-center py-12">
        <p class="text-[var(--color-neutral-600)]">Loading your CV data...</p>
      </div>
      <div v-else-if="store.error" class="flex items-center justify-center py-12">
        <p class="text-[var(--color-error-600)]">{{ store.error.message }}</p>
      </div>
      <BasicsForm
        v-else-if="store.resume"
        v-model="store.resume.basics"
        @validate="store.saveResume(store.resume)"
      />
      <div v-else class="flex items-center justify-center py-12">
        <p class="text-[var(--color-error-600)]">Failed to load resume data</p>
      </div>
    </main>
  </div>
</template> 