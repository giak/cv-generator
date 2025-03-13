# Epic-5: Internationalisation et Multilinguisme

Story-4: Fonctionnalités d'internationalisation et expérience utilisateur

## Description de la Story

**En tant qu'** utilisateur du CV Generator
**Je veux** pouvoir changer la langue de l'interface et avoir une détection automatique de ma langue préférée
**afin de** utiliser l'application dans ma langue maternelle et bénéficier d'une meilleure expérience utilisateur

## Statut

Draft

## Contexte

Cette story fait partie de l'Epic-5 qui vise à internationaliser notre application CV Generator. Elle s'appuie sur les Stories 1, 2 et 3 qui ont établi l'architecture d'internationalisation, centralisé les clés de traduction et adapté les composants existants.

Maintenant que l'infrastructure technique d'internationalisation est en place, cette story se concentre sur les aspects d'expérience utilisateur liés au changement de langue. Elle vise à créer une interface intuitive permettant à l'utilisateur de sélectionner sa langue préférée, avec une détection automatique basée sur la langue du navigateur et une persistance de ce choix.

Cette story est cruciale pour rendre l'internationalisation visible et utile pour l'utilisateur final, et pour assurer une expérience cohérente à travers toute l'application.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. Étant donné un utilisateur qui ouvre l'application pour la première fois, quand l'application se charge, alors la langue détectée du navigateur est automatiquement utilisée si elle est supportée
2. Étant donné un utilisateur qui souhaite changer de langue, quand il clique sur le sélecteur de langue, alors il peut choisir parmi les langues disponibles (français, anglais)
3. Étant donné qu'un utilisateur a choisi une langue, quand il revient sur l'application ultérieurement, alors sa préférence est conservée
4. Étant donné un utilisateur qui change de langue, quand la langue est modifiée, alors tous les textes de l'interface sont immédiatement mis à jour dans la nouvelle langue
5. Étant donné un sélecteur de langue, quand il est visible dans l'interface, alors il indique clairement la langue actuellement sélectionnée
6. Étant donné la nature responsive de l'application, quand le sélecteur de langue est implémenté, alors il est utilisable sur tous les formats d'écran supportés

## Tâches

1. - [ ] Implémenter la détection de langue du navigateur

   1. - [ ] Créer une fonction d'initialisation qui détecte la langue du navigateur
   2. - [ ] Mettre en place la logique de fallback vers la langue par défaut (français)
   3. - [ ] Intégrer cette détection au démarrage de l'application

2. - [ ] Créer le composant de sélection de langue

   1. - [ ] Concevoir le sélecteur de langue avec une UI accessible
   2. - [ ] Implémenter la logique de changement de langue
   3. - [ ] Ajouter des icônes ou drapeaux pour les langues disponibles
   4. - [ ] Tester l'accessibilité du composant (navigation clavier, etc.)

3. - [ ] Implémenter la persistance des préférences linguistiques

   1. - [ ] Stocker la préférence de langue dans localStorage
   2. - [ ] Créer une logique de récupération au démarrage de l'application
   3. - [ ] Gérer la synchronisation entre locales et préférences stockées

4. - [ ] Ajouter le sélecteur de langue dans l'interface

   1. - [ ] Intégrer le sélecteur dans l'en-tête de l'application
   2. - [ ] Assurer sa visibilité sur tous les écrans de l'application
   3. - [ ] Adapter le design pour les différentes tailles d'écran

5. - [ ] Implémenter le rafraîchissement global de l'interface
   1. - [ ] Assurer que tous les composants réagissent au changement de langue
   2. - [ ] Vérifier que les messages d'erreur sont mis à jour correctement
   3. - [ ] Tester le comportement des formulaires lors du changement de langue

## Principes de Développement

#### Principes à Suivre

- **UX First**: Concevoir en priorisant l'expérience utilisateur et l'intuitivité
- **Accessibilité**: Respecter les standards WCAG AA pour le sélecteur de langue
- **Performance**: Assurer que le changement de langue est immédiat et fluide
- **Persistance**: Garantir la conservation des préférences utilisateur
- **Feedback visuel**: Fournir un retour clair lors du changement de langue

#### À Éviter

- Une interface de sélection de langue trop complexe ou peu intuitive
- Des incohérences visuelles lors du changement de langue
- Des performances dégradées lors du chargement des fichiers de traduction
- Une détection de langue qui override la préférence explicite de l'utilisateur
- Un sélecteur de langue difficile à trouver dans l'interface

## Risques et Hypothèses

| Risque                                                     | Probabilité | Impact | Mitigation                                                                       |
| ---------------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------- |
| Performance dégradée lors du changement de langue          | Moyenne     | Élevé  | Implémenter un chargement optimisé des fichiers de traduction                    |
| Incohérences visuelles avec textes de longueurs variables  | Élevée      | Moyen  | Concevoir une interface flexible qui s'adapte aux différentes longueurs de texte |
| Problèmes avec la détection de langue du navigateur        | Moyenne     | Faible | Avoir un fallback robuste vers la langue par défaut                              |
| Conflit entre localStorage et préférences de l'utilisateur | Faible      | Moyen  | Prioriser clairement les préférences explicites de l'utilisateur                 |
| Accessibilité réduite pour certains utilisateurs           | Moyenne     | Élevé  | Tester rigoureusement l'accessibilité du sélecteur de langue                     |

## Notes de Développement

### Détection de la langue du navigateur

```typescript
// packages/ui/src/i18n/language-detection.ts
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@cv-generator/shared";

export function detectBrowserLanguage(): string {
  // Récupérer les langues préférées du navigateur
  const browserLangs = navigator.languages || [
    navigator.language || navigator.userLanguage,
  ];

  // Trouver la première langue correspondant à nos locales supportées
  for (const lang of browserLangs) {
    // Vérifier la correspondance exacte (fr-FR)
    if (SUPPORTED_LOCALES.includes(lang)) {
      return lang;
    }

    // Vérifier la correspondance de base (fr)
    const baseLang = lang.split("-")[0];
    if (SUPPORTED_LOCALES.includes(baseLang)) {
      return baseLang;
    }
  }

  // Fallback sur la locale par défaut
  return DEFAULT_LOCALE;
}
```

### Composant de sélection de langue

```vue
<!-- packages/ui/src/components/LanguageSelector.vue -->
<template>
  <div class="language-selector" aria-label="Sélecteur de langue">
    <button
      type="button"
      class="language-selector__button"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggleDropdown"
    >
      <span class="language-selector__current">
        {{ getLanguageLabel(currentLocale) }}
      </span>
      <span class="language-selector__icon" aria-hidden="true">▼</span>
    </button>

    <ul
      v-if="isOpen"
      class="language-selector__dropdown"
      role="listbox"
      :aria-activedescendant="`locale-${currentLocale}`"
    >
      <li
        v-for="locale in SUPPORTED_LOCALES"
        :key="locale"
        :id="`locale-${locale}`"
        role="option"
        class="language-selector__item"
        :class="{
          'language-selector__item--selected': locale === currentLocale,
        }"
        :aria-selected="locale === currentLocale"
        @click="changeLocale(locale)"
        @keydown.enter="changeLocale(locale)"
        @keydown.space="changeLocale(locale)"
        tabindex="0"
      >
        {{ getLanguageLabel(locale) }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { SUPPORTED_LOCALES } from "@cv-generator/shared";

const { locale: currentLocale } = useI18n();
const isOpen = ref(false);

const languageLabels = {
  fr: "Français",
  en: "English",
};

function getLanguageLabel(locale: string): string {
  return languageLabels[locale] || locale;
}

function toggleDropdown(): void {
  isOpen.value = !isOpen.value;
}

function changeLocale(newLocale: string): void {
  if (currentLocale.value !== newLocale) {
    currentLocale.value = newLocale;

    // Sauvegarder la préférence
    localStorage.setItem("cv-generator-locale", newLocale);
  }

  isOpen.value = false;
}

// Fermer le dropdown quand on clique ailleurs
function handleClickOutside(event: MouseEvent): void {
  const target = event.target as Element;
  if (isOpen.value && !target.closest(".language-selector")) {
    isOpen.value = false;
  }
}

// Ajouter/supprimer les écouteurs d'événements
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Styles de base, à adapter selon le design system du projet */
.language-selector {
  position: relative;
  display: inline-block;
}

.language-selector__button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.language-selector__dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  margin-top: 0.25rem;
  padding: 0.5rem 0;
  min-width: 150px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--background-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  list-style: none;
}

.language-selector__item {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.language-selector__item:hover,
.language-selector__item:focus {
  background: var(--hover-color);
}

.language-selector__item--selected {
  font-weight: bold;
  background: var(--selected-color);
}
</style>
```

### Initialisation des préférences linguistiques

```typescript
// packages/ui/src/i18n/setup.ts
import { createI18n } from "vue-i18n";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@cv-generator/shared";
import { detectBrowserLanguage } from "./language-detection";

// Charger les traductions (ici avec un import statique pour simplifier,
// en production on utiliserait probablement un chargement dynamique)
import fr from "../locales/fr";
import en from "../locales/en";

export function setupI18n() {
  // Récupérer la locale stockée ou détecter celle du navigateur
  let locale = localStorage.getItem("cv-generator-locale");

  // Vérifier si la locale est supportée, sinon détecter celle du navigateur
  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    locale = detectBrowserLanguage();
  }

  // Créer l'instance i18n
  const i18n = createI18n({
    legacy: false, // Utiliser Composition API
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    messages: {
      fr,
      en,
    },
  });

  return i18n;
}
```

## Journal de Communication

- UX Designer: Le sélecteur de langue doit être accessible depuis toutes les pages de l'application
- Dev: Où placer le sélecteur de langue dans l'interface?
- UX Designer: Dans l'en-tête, côté droit, avec une indication visuelle claire
- Dev: Faut-il utiliser des drapeaux pour représenter les langues?
- UX Designer: Non, préférer les noms des langues dans leur propre langue (Français, English) pour plus de clarté
- Dev: Comment gérer le cas où la langue détectée n'est pas supportée?
- Tech Lead: Avoir un fallback sur la langue par défaut (français) et permettre à l'utilisateur de changer facilement
- Dev: Quel comportement adopter si l'utilisateur change de langue en plein formulaire?
- UX Designer: Tous les textes doivent être mis à jour immédiatement, mais les données saisies doivent être préservées
- Dev: Faut-il un message de confirmation lors du changement de langue?
- UX Designer: Non, le changement doit être immédiat avec un feedback visuel clair (le nom de la langue actuelle)
