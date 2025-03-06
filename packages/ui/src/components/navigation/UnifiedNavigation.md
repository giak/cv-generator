# UnifiedNavigation

Un composant de navigation unifié pour les sections du CV, combinant les fonctionnalités de `NavMenu` et `CVNavigation` en une solution cohérente.

## Objectif

Ce composant a été créé pour résoudre la redondance entre deux composants de navigation similaires dans l'application :

1. `NavMenu.vue` : Gestion d'événements et support avancé d'icônes
2. `CVNavigation.vue` : Indicateurs de progression et de statut des sections

`UnifiedNavigation` offre une expérience utilisateur optimisée pour la navigation entre les sections du CV, avec des indicateurs visuels de progression et un système d'événements pour une intégration flexible.

## ⚠️ Avis de Dépréciation

**Important** : Les composants `NavMenu.vue` et `CVNavigation.vue` sont désormais dépréciés et seront supprimés dans une version future. Migrez vers `UnifiedNavigation` dès que possible.

## Guide de Migration

### Depuis NavMenu

Si vous utilisiez `NavMenu` :

```vue
<!-- Ancien code -->
<NavMenu
  :active-item="currentSection"
  :groups="navigationGroups"
  @navigate="handleNavigate"
/>
```

Remplacez par :

```vue
<!-- Nouveau code -->
<UnifiedNavigation
  :current-section="currentSection"
  @navigate="handleNavigate"
/>
```

### Depuis CVNavigation

Si vous utilisiez `CVNavigation` :

```vue
<!-- Ancien code -->
<CVNavigation :current-section="currentSection" />
```

Remplacez par :

```vue
<!-- Nouveau code -->
<UnifiedNavigation
  :current-section="currentSection"
  @navigate="handleNavigation"
/>
```

Et assurez-vous d'ajouter une fonction de gestion de la navigation :

```javascript
const handleNavigation = (path) => {
  // Extraire l'ID de section ou utiliser vue-router
  const sectionId = path.replace("#", "");
  currentSection.value = sectionId;
};
```

## Fonctionnalités

- Émission d'événements pour la navigation (remplace les liens href)
- Support avancé des icônes avec slots, props et fallback
- Indicateurs de progression pour chaque section et pour l'ensemble du CV
- Mise en évidence visuelle de la section courante
- Indicateur "Suivant" pour la prochaine section à compléter
- Bouton "Continuer avec" pour la section suivante incomplète
- Compatibilité avec le composable `useFormProgress`

## Utilisation

```vue
<template>
  <UnifiedNavigation
    :current-section="currentSection"
    @navigate="handleNavigation"
  >
    <!-- Optionnel: Personnalisation des icônes via slots -->
    <template #icon-basics>
      <YourCustomIcon />
    </template>
  </UnifiedNavigation>
</template>

<script setup>
import { ref } from "vue";
import { UnifiedNavigation } from "@cv-generator/ui";

const currentSection = ref("basics");

const handleNavigation = (path) => {
  // Gérer la navigation, par exemple en utilisant vue-router
  // ou en extrayant l'identifiant de section
  const sectionId = path.replace("#", "");
  currentSection.value = sectionId;
};
</script>
```

## Propriétés (Props)

| Nom              | Type      | Défaut | Description                                        |
| ---------------- | --------- | ------ | -------------------------------------------------- |
| `currentSection` | `string`  | `''`   | Identifiant de la section actuellement active      |
| `showProgress`   | `boolean` | `true` | Afficher ou masquer les indicateurs de progression |

## Événements émis

| Nom        | Paramètres       | Description                                                        |
| ---------- | ---------------- | ------------------------------------------------------------------ |
| `navigate` | `(path: string)` | Émis lorsqu'une section est cliquée, avec le chemin de destination |

## Personnalisation des icônes

Le composant supporte trois niveaux de personnalisation des icônes :

1. **Slots nommés** : Pour une personnalisation complète

   ```vue
   <template #icon-basics>
     <YourCustomIcon />
   </template>
   ```

2. **Via la propriété `icon` dans les données** : Si `icon` est défini dans le `sectionStatus`
3. **Icône par défaut** : Si aucune des options ci-dessus n'est fournie

## Intégration avec le router

Pour une intégration avec Vue Router, vous pouvez adapter la fonction de navigation :

```javascript
const handleNavigation = (path) => {
  // Si vous utilisez des ancres pour les sections
  if (path.startsWith("#")) {
    const sectionId = path.replace("#", "");
    currentSection.value = sectionId;
    // Facultatif: mettre à jour l'URL sans rechargement
    window.history.pushState({}, "", path);
  } else {
    // Si vous utilisez des routes complètes
    router.push(path);
  }
};
```

## Dépendances

- Le composable `useFormProgress` qui fournit les données de progression des sections

## Considérations sur les performances

Le composant utilise :

- Computed properties pour minimiser les recalculs
- Classes conditionnelles pour la mise en évidence visuelle
- Rendus conditionnels pour les éléments qui dépendent de l'état

## Points d'attention pour la migration

Lors du remplacement des composants existants par `UnifiedNavigation` :

1. Remplacer les attributs `href` par des gestionnaires d'événements
2. Mettre à jour les références à `CVNavigation` et `NavMenu`
3. Adapter les tests pour vérifier les événements émis plutôt que les liens

## Exemples

Pour voir un exemple complet d'implémentation, consultez `UnifiedNavigation.example.vue`.
