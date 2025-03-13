# Epic-5: Internationalisation et Multilinguisme

Story-5: Tests et validation de l'internationalisation

## Description de la Story

**En tant que** développeur du projet CV Generator
**Je veux** tester et valider rigoureusement l'implémentation de l'internationalisation
**afin de** garantir une application entièrement traduite, sans erreurs et offrant une expérience utilisateur cohérente dans toutes les langues supportées

## Statut

Draft

## Contexte

Cette story fait partie de l'Epic-5 qui vise à internationaliser notre application CV Generator. Elle vient compléter les Stories 1 à 4 qui ont établi l'architecture d'internationalisation, centralisé les clés de traduction, adapté les composants existants et implémenté les fonctionnalités UX liées au changement de langue.

Cette story est cruciale pour garantir la qualité de l'internationalisation avant la mise en production. Elle vise à mettre en place des tests automatisés pour vérifier la couverture et la cohérence des traductions, ainsi qu'à réaliser des tests manuels d'interface utilisateur pour s'assurer que l'expérience est fluide et cohérente dans toutes les langues supportées.

## Estimation

Story Points: 1

## Critères d'Acceptation

1. Étant donné l'ensemble de l'application, quand nous exécutons les tests automatisés, alors la couverture des traductions est d'au moins 95% pour toutes les langues
2. Étant donné des textes avec interpolation de paramètres, quand les tests sont exécutés, alors tous les paramètres sont correctement interpolés dans toutes les langues
3. Étant donné le changement de langue par l'utilisateur, quand les tests automatisés sont exécutés, alors tous les composants UI sont correctement mis à jour
4. Étant donné les tests d'intégration du domaine, quand ils sont exécutés, alors les messages d'erreur sont correctement localisés
5. Étant donné la structure hiérarchique des clés de traduction, quand les tests sont exécutés, alors aucune clé manquante n'est détectée
6. Étant donné l'interface utilisateur complète, quand un testeur manuel navigue dans l'application, alors tous les textes sont traduits sans incohérences visuelles

## Tâches

1. - [ ] Créer des tests unitaires pour le système d'internationalisation

   1. - [ ] Tester le port d'internationalisation du domaine
   2. - [ ] Tester l'adaptateur Vue I18n
   3. - [ ] Tester la détection de la langue du navigateur
   4. - [ ] Tester la persistance des préférences linguistiques

2. - [ ] Développer des tests de validation des traductions

   1. - [ ] Créer un utilitaire pour vérifier la complétude des traductions
   2. - [ ] Écrire des tests pour vérifier la correspondance entre les langues
   3. - [ ] Vérifier la présence de toutes les clés dans toutes les langues
   4. - [ ] Créer des tests pour les cas d'interpolation de paramètres

3. - [ ] Implémenter des tests d'intégration pour les composants

   1. - [ ] Tester le changement de langue dans les composants UI
   2. - [ ] Vérifier le bon fonctionnement des formulaires lors des changements de langue
   3. - [ ] Tester l'affichage correct des erreurs de validation localisées
   4. - [ ] Vérifier la persistance des données lors du changement de langue

4. - [ ] Créer un plan de test manuel

   1. - [ ] Définir les scénarios de test pour les différentes langues
   2. - [ ] Préparer une liste de vérification pour l'UI dans chaque langue
   3. - [ ] Documenter les cas de test pour les fonctionnalités critiques
   4. - [ ] Créer des matrices de test pour les combinaisons de langues et fonctionnalités

5. - [ ] Exécuter les tests manuels et documenter les résultats
   1. - [ ] Tester l'application complète en français
   2. - [ ] Tester l'application complète en anglais
   3. - [ ] Vérifier les transitions entre langues
   4. - [ ] Documenter les problèmes trouvés et les corriger

## Principes de Développement

#### Principes à Suivre

- **Couverture complète**: Tester toutes les parties de l'application pour l'internationalisation
- **Automatisation**: Privilégier les tests automatisés pour la couverture des traductions
- **Tests visuels**: Vérifier que l'UI s'adapte aux différentes longueurs de texte
- **Approche systématique**: Utiliser une méthode structurée pour tester toutes les combinaisons
- **Documentation**: Documenter clairement les problèmes trouvés et les corrections apportées

#### À Éviter

- Les tests manuels exhaustifs qui pourraient être automatisés
- L'ignorance des cas limites (textes très courts ou très longs)
- La négligence des cas d'interpolation complexes
- Les tests insuffisants des transitions de langue
- L'oubli de tester avec des données réelles

## Risques et Hypothèses

| Risque                                                | Probabilité | Impact | Mitigation                                                                     |
| ----------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------ |
| Clés de traduction manquantes                         | Élevée      | Moyen  | Utiliser des tests automatisés pour vérifier l'exhaustivité des traductions    |
| Problèmes d'interpolation dans certaines langues      | Moyenne     | Moyen  | Créer des tests spécifiques pour chaque cas d'interpolation                    |
| Inconsistances visuelles avec les longueurs de texte  | Élevée      | Moyen  | Tester avec des textes de différentes longueurs et adapter l'UI                |
| Performance dégradée par les tests automatiques       | Faible      | Faible | Optimiser les tests pour minimiser leur impact sur le temps d'exécution        |
| Difficulté à tester toutes les combinaisons possibles | Moyenne     | Moyen  | Prioriser les scénarios critiques et utiliser une approche par échantillonnage |

## Notes de Développement

### Utilitaire de validation des traductions

```typescript
// packages/ui/src/i18n/validation/translation-validator.ts
import { SUPPORTED_LOCALES } from "@cv-generator/shared";
import fr from "../../locales/fr";
import en from "../../locales/en";

const translations = {
  fr,
  en,
};

/**
 * Vérifie la complétude des traductions pour toutes les langues supportées
 * @returns Un objet contenant les résultats de validation
 */
export function validateTranslations() {
  const results = {
    missingKeys: {} as Record<string, string[]>,
    coverage: {} as Record<string, number>,
  };

  // Extraire toutes les clés uniques à travers toutes les langues
  const allKeys = extractAllKeys(translations);

  // Vérifier chaque langue pour les clés manquantes
  for (const locale of SUPPORTED_LOCALES) {
    const localeTranslation = translations[locale];
    const localeKeys = extractKeys(localeTranslation);
    const missingKeys = findMissingKeys(allKeys, localeKeys);

    results.missingKeys[locale] = missingKeys;

    // Calculer la couverture
    const coverage =
      ((allKeys.length - missingKeys.length) / allKeys.length) * 100;
    results.coverage[locale] = Number(coverage.toFixed(2));
  }

  return results;
}

/**
 * Extrait toutes les clés uniques de toutes les traductions
 */
function extractAllKeys(translations: Record<string, any>): string[] {
  const allKeys = new Set<string>();

  for (const locale in translations) {
    const keys = extractKeys(translations[locale]);
    keys.forEach((key) => allKeys.add(key));
  }

  return Array.from(allKeys);
}

/**
 * Extrait les clés d'un objet de traduction de manière récursive
 */
function extractKeys(obj: any, prefix = ""): string[] {
  if (!obj || typeof obj !== "object") return [];

  let keys: string[] = [];

  for (const key in obj) {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      // Récursion pour les objets imbriqués
      keys = [...keys, ...extractKeys(value, fullKey)];
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

/**
 * Trouve les clés qui sont dans allKeys mais pas dans localeKeys
 */
function findMissingKeys(allKeys: string[], localeKeys: string[]): string[] {
  const localeKeySet = new Set(localeKeys);
  return allKeys.filter((key) => !localeKeySet.has(key));
}
```

### Test pour le composant de changement de langue

```typescript
// packages/ui/tests/components/LanguageSelector.spec.ts
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import LanguageSelector from "../../src/components/LanguageSelector.vue";
import { SUPPORTED_LOCALES } from "@cv-generator/shared";

describe("LanguageSelector", () => {
  // Setup de base pour les tests
  const setupTest = (initialLocale = "fr") => {
    const i18n = createI18n({
      legacy: false,
      locale: initialLocale,
      messages: {
        fr: { test: "Bonjour" },
        en: { test: "Hello" },
      },
    });

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n],
        stubs: {
          // Stubber les composants non nécessaires
        },
      },
    });

    return { wrapper, i18n, localStorageMock };
  };

  it("affiche correctement la langue actuelle", () => {
    const { wrapper } = setupTest("fr");
    expect(wrapper.find(".language-selector__current").text()).toBe("Français");

    const { wrapper: wrapperEn } = setupTest("en");
    expect(wrapperEn.find(".language-selector__current").text()).toBe(
      "English"
    );
  });

  it("ouvre le dropdown au clic sur le bouton", async () => {
    const { wrapper } = setupTest();

    // Vérifier que le dropdown est initialement fermé
    expect(wrapper.find(".language-selector__dropdown").exists()).toBe(false);

    // Cliquer sur le bouton
    await wrapper.find(".language-selector__button").trigger("click");

    // Vérifier que le dropdown est ouvert
    expect(wrapper.find(".language-selector__dropdown").exists()).toBe(true);
  });

  it("change la langue au clic sur une option", async () => {
    const { wrapper, i18n, localStorageMock } = setupTest("fr");

    // Ouvrir le dropdown
    await wrapper.find(".language-selector__button").trigger("click");

    // Cliquer sur l'option anglais
    const enOption = wrapper
      .findAll(".language-selector__item")
      .find((item) => item.text() === "English");
    await enOption.trigger("click");

    // Vérifier que la langue a changé
    expect(i18n.global.locale.value).toBe("en");

    // Vérifier que localStorage a été mis à jour
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "cv-generator-locale",
      "en"
    );

    // Vérifier que le dropdown est fermé
    expect(wrapper.find(".language-selector__dropdown").exists()).toBe(false);
  });

  it("supporte la navigation au clavier", async () => {
    const { wrapper, i18n } = setupTest("fr");

    // Ouvrir le dropdown
    await wrapper.find(".language-selector__button").trigger("click");

    // Simuler l'appui sur la touche Enter sur l'option anglais
    const enOption = wrapper
      .findAll(".language-selector__item")
      .find((item) => item.text() === "English");
    await enOption.trigger("keydown.enter");

    // Vérifier que la langue a changé
    expect(i18n.global.locale.value).toBe("en");
  });
});
```

### Plan de test manuel pour l'internationalisation

```markdown
# Plan de Test Manuel pour l'Internationalisation

## Objectif

Vérifier que toute l'application est correctement traduite et que l'expérience utilisateur est cohérente dans toutes les langues supportées.

## Prérequis

- Application déployée en environnement de test
- Accès aux fonctionnalités de changement de langue
- Compte test avec données préexistantes

## Scénarios de Test

### 1. Navigation de base

- [ ] Vérifier que tous les éléments de navigation sont traduits
- [ ] Vérifier que les titres de page sont traduits
- [ ] Vérifier que les tooltips et infobulles sont traduits
- [ ] Vérifier que les menus déroulants sont traduits

### 2. Formulaires

- [ ] Vérifier que tous les labels sont traduits
- [ ] Vérifier que les placeholders sont traduits
- [ ] Vérifier que les messages d'erreur sont traduits
- [ ] Vérifier que les boutons d'action sont traduits
- [ ] Vérifier que les valeurs par défaut sont cohérentes avec la langue

### 3. Messages et Notifications

- [ ] Vérifier que les messages de succès sont traduits
- [ ] Vérifier que les messages d'erreur système sont traduits
- [ ] Vérifier que les confirmations sont traduites
- [ ] Vérifier que les notifications sont traduites

### 4. Changement de Langue

- [ ] Vérifier que le changement de français à anglais fonctionne
- [ ] Vérifier que le changement d'anglais à français fonctionne
- [ ] Vérifier que la préférence est conservée après rafraîchissement
- [ ] Vérifier que la préférence est conservée dans une nouvelle session

### 5. Adaptation Visuelle

- [ ] Vérifier que l'interface s'adapte aux textes plus longs
- [ ] Vérifier que l'interface s'adapte aux textes plus courts
- [ ] Vérifier que les alignements et espacements sont cohérents
- [ ] Vérifier que les éléments interactifs restent utilisables

### 6. Fonctionnalités Spécifiques

- [ ] Vérifier que la validation de CV fonctionne dans toutes les langues
- [ ] Vérifier que l'export fonctionne dans toutes les langues
- [ ] Vérifier que les conseils ATS sont traduits
- [ ] Vérifier que l'import fonctionne dans toutes les langues

## Matrice de Test

| Fonctionnalité       | FR  | EN  | Notes |
| -------------------- | --- | --- | ----- |
| Page d'accueil       | [ ] | [ ] |       |
| Formulaire Basics    | [ ] | [ ] |       |
| Formulaire Work      | [ ] | [ ] |       |
| Formulaire Education | [ ] | [ ] |       |
| Validation           | [ ] | [ ] |       |
| Export JSON          | [ ] | [ ] |       |
| Export PDF           | [ ] | [ ] |       |
| Conseils ATS         | [ ] | [ ] |       |
| Changement de langue | [ ] | [ ] |       |
```

## Journal de Communication

- QA: Nous avons besoin d'une stratégie pour tester l'internationalisation
- Dev: Comment prioriser les tests entre automatisation et tests manuels?
- QA: Automatiser la vérification de complétude des traductions, mais faire des tests manuels pour l'UX
- Dev: Comment gérer les clés manquantes découvertes pendant les tests?
- Tech Lead: Créer un processus de correction et de validation en deux temps
- QA: Faut-il tester les cas limites comme les textes très longs?
- UX Designer: Oui, c'est crucial, surtout pour certaines langues qui peuvent être 30% plus longues
- Dev: Comment gérer les problèmes d'encodage des caractères spéciaux?
- Tech Lead: Utiliser un jeu de test avec des caractères spéciaux dans chaque langue
- QA: Comment vérifier l'accessibilité avec différentes langues?
- UX Designer: Préparer des scénarios de test spécifiques pour l'accessibilité dans chaque langue
