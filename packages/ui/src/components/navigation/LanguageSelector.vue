<template>
  <div 
    class="language-selector" 
    :class="{ 'language-selector--open': isOpen }"
    ref="languageSelectorRef"
  >
    <button
      type="button"
      class="language-selector__button"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      data-test="language-button"
      @click="toggleDropdown"
      @keydown.enter="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @keydown.down="openDropdown"
      @keydown.esc="closeDropdown"
    >
      <span class="language-selector__flag" aria-hidden="true">
        {{ getFlagEmoji(currentLocaleValue) }}
      </span>
      <span class="language-selector__current" data-test="language-current">
        {{ getCurrentLanguageLabel() }}
      </span>
      <span class="language-selector__icon" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="language-selector__icon-svg"
          :class="{ 'language-selector__icon-svg--open': isOpen }"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </button>

    <transition name="dropdown">
      <ul
        v-if="isOpen"
        class="language-selector__dropdown"
        role="listbox"
        :aria-activedescendant="`language-item-${currentLocaleValue}`"
        data-test="language-dropdown"
      >
        <li
          v-for="locale in SUPPORTED_LOCALES"
          :key="locale"
          :id="`language-item-${locale}`"
          role="option"
          class="language-selector__item"
          :class="{
            'language-selector__item--selected': locale === currentLocaleValue,
          }"
          :aria-selected="locale === currentLocaleValue"
          :data-test="`language-item language-item-${locale}`"
          @click="changeLocale(locale)"
          @keydown.enter="changeLocale(locale)"
          @keydown.space.prevent="changeLocale(locale)"
          tabindex="0"
        >
          <span class="language-selector__flag" aria-hidden="true">
            {{ getFlagEmoji(locale) }}
          </span>
          <span class="language-selector__name">{{ LOCALE_NAMES[locale] }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SUPPORTED_LOCALES, LOCALE_NAMES, type SupportedLocale } from '@cv-generator/shared';
import { LOCALE_STORAGE_KEY } from '../../i18n/setup';
import { loadLocaleMessages } from '../../i18n/setup';

// Référence à l'élément du sélecteur
const languageSelectorRef = ref<HTMLElement | null>(null);

// État du dropdown
const isOpen = ref(false);

// Instance i18n
const { locale: currentLocale } = useI18n();

// Calculer la valeur actuelle de la locale (pour éviter les problèmes de typage)
const currentLocaleValue = computed<SupportedLocale>(() => {
  return currentLocale.value as SupportedLocale;
});

// Obtenir le label de la langue actuelle
function getCurrentLanguageLabel(): string {
  return LOCALE_NAMES[currentLocaleValue.value] || currentLocaleValue.value;
}

// Obtenir l'emoji de drapeau pour la locale
function getFlagEmoji(locale: SupportedLocale): string {
  const flagMap: Record<SupportedLocale, string> = {
    fr: '🇫🇷',
    en: '🇬🇧'
  };
  
  return flagMap[locale] || '';
}

// Basculer l'état du dropdown
function toggleDropdown(): void {
  isOpen.value = !isOpen.value;
}

// Ouvrir le dropdown
function openDropdown(): void {
  isOpen.value = true;
}

// Fermer le dropdown
function closeDropdown(): void {
  isOpen.value = false;
}

// Changer de langue
async function changeLocale(newLocale: SupportedLocale): Promise<void> {
  if (currentLocale.value !== newLocale) {
    // Charger les messages de traduction
    await loadLocaleMessages(newLocale);
    
    // Mettre à jour la locale
    currentLocale.value = newLocale;
    
    // Sauvegarder la préférence de l'utilisateur
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch (error) {
      console.error('Failed to save locale preference:', error);
    }
    
    // Émettre un événement personnalisé pour informer l'application du changement
    const event = new CustomEvent('localeChanged', { detail: { locale: newLocale } });
    document.dispatchEvent(event);
    
    // Émettre un événement pour les tests
    emit('change-locale', newLocale);
  }
  
  // Fermer le dropdown
  closeDropdown();
}

// Définir les événements émis
const emit = defineEmits<{
  (event: 'change-locale', locale: SupportedLocale): void
}>();

// Gestionnaire de clic en dehors du composant pour fermer le dropdown
function handleClickOutside(event: MouseEvent): void {
  const target = event.target as Node;
  
  if (isOpen.value && languageSelectorRef.value && !languageSelectorRef.value.contains(target)) {
    closeDropdown();
  }
}

// Ajouter/supprimer les écouteurs d'événements
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      closeDropdown();
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.language-selector {
  position: relative;
  display: inline-block;
  font-family: var(--font-family, sans-serif);
}

.language-selector__button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  backdrop-filter: blur(4px);
  min-width: 110px;
}

.language-selector__button:hover {
  background-color: rgba(45, 45, 45, 0.7);
  border-color: rgba(255, 255, 255, 0.2);
}

.language-selector__button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  border-color: rgba(66, 153, 225, 0.6);
}

.language-selector__current {
  font-weight: 500;
}

.language-selector__flag {
  display: inline-flex;
  margin-right: 0.25rem;
}

.language-selector__icon {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.language-selector__icon-svg {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.language-selector__icon-svg--open {
  transform: rotate(180deg);
}

.language-selector__dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 50;
  min-width: 150px;
  margin: 0;
  padding: 0.375rem 0;
  list-style: none;
  background-color: rgba(25, 25, 25, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
}

.language-selector__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  color: rgba(255, 255, 255, 0.8);
}

.language-selector__item:hover,
.language-selector__item:focus {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
  outline: none;
}

.language-selector__item--selected {
  background-color: rgba(66, 153, 225, 0.15);
  color: rgba(255, 255, 255, 1);
  font-weight: 500;
}

.language-selector__flag {
  font-size: 1.25rem;
  line-height: 1;
}

.language-selector__name {
  font-size: 0.875rem;
}

/* Animation du dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

/* Position du dropdown pour éviter les débordements */
.language-selector__dropdown::before {
  content: '';
  position: absolute;
  top: -4px;
  right: 1rem;
  width: 8px;
  height: 8px;
  background: rgba(25, 25, 25, 0.95);
  transform: rotate(45deg);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive */
@media (max-width: 640px) {
  .language-selector__dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 0.75rem 0.75rem 0 0;
    box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.3);
    padding: 1rem 0;
    backdrop-filter: blur(10px);
  }
  
  .language-selector__dropdown::before {
    display: none;
  }
  
  .language-selector__item {
    padding: 0.875rem 1.5rem;
    justify-content: center;
    font-size: 1rem;
  }
  
  .language-selector__flag {
    font-size: 1.5rem;
  }
  
  .language-selector__name {
    font-size: 1rem;
  }
}
</style> 