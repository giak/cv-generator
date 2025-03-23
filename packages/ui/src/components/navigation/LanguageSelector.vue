<template>
  <div class="relative z-[100]" data-test="language-selector" ref="languageSelectorRef">
    <button
      class="flex items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 transition-colors duration-150 ease-in-out w-full"
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      data-test="language-button"
      @click="toggleDropdown"
    >
      <span class="text-lg" aria-hidden="true">{{ getFlagEmoji(currentLocaleValue) }}</span>
      <span data-test="language-current">{{ LOCALE_NAMES[currentLocaleValue] }}</span>
      <span class="ml-1" aria-hidden="true">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        >
          <path 
            fill-rule="evenodd" 
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </button>
    
    <!-- Dropdown menu -->
    <div 
      v-if="isOpen"
      class="absolute z-[99999] left-0 mt-1 w-full min-w-[150px] origin-top-left rounded-md bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="listbox"
      tabindex="-1"
      data-test="language-dropdown"
    >
      <div class="py-1">
        <button
          v-for="locale in SUPPORTED_LOCALES"
          :key="locale"
          @click="switchLanguage(locale)"
          class="flex w-full items-center space-x-2 px-4 py-2 text-sm text-white hover:bg-neutral-700 transition-colors duration-150"
          role="option"
          :aria-selected="locale === currentLocaleValue"
          :data-test="`language-option-${locale}`"
        >
          <span class="text-lg">{{ getFlagEmoji(locale) }}</span>
          <span>{{ LOCALE_NAMES[locale] }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SUPPORTED_LOCALES, LOCALE_NAMES, type SupportedLocale } from '@cv-generator/shared';

// Définir les évènements que ce composant peut émettre
const emit = defineEmits<{
  'change-locale': [locale: SupportedLocale];
}>();

// Initialisation de i18n
const { locale } = useI18n();

// Références et état
const languageSelectorRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

// Valeur locale actuelle typée correctement
const currentLocaleValue = computed(() => locale.value as SupportedLocale);

// Méthodes pour obtenir les emojis des drapeaux
function getFlagEmoji(locale: SupportedLocale): string {
  const flags: Record<SupportedLocale, string> = {
    fr: '🇫🇷',
    en: '🇬🇧'
  };
  return flags[locale];
}

function toggleDropdown(): void {
  isOpen.value = !isOpen.value;
}

function closeDropdown(): void {
  isOpen.value = false;
}

function switchLanguage(newLocale: SupportedLocale): void {
  if (newLocale !== currentLocaleValue.value) {
    emit('change-locale', newLocale);
    locale.value = newLocale;
  }
  closeDropdown();
}

function handleClickOutside(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (languageSelectorRef.value && !languageSelectorRef.value.contains(target)) {
    closeDropdown();
  }
}

// Gestion du cycle de vie du composant
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Styles sont directement intégrés avec les classes Tailwind */
</style>
