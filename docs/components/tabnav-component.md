# TabNav Component

## Overview

Le composant `TabNav` est un système d'onglets moderne et accessible, conçu avec Tailwind CSS. Il permet de créer facilement des interfaces à onglets pour organiser le contenu en sections distinctes mais reliées.

## Structure des composants

Le système d'onglets est composé de trois composants principaux:

1. `TabNav` - Conteneur principal qui gère l'état des onglets
2. `TabNavItem` - Représente un onglet individuel
3. `TabContent` - Contient le contenu associé à un onglet spécifique

## Installation

Les composants sont disponibles dans le package `@cv-generator/ui`:

```js
import { TabNav, TabNavItem, TabContent } from "@cv-generator/ui";
```

## Usage de base

```vue
<template>
  <TabNav v-model="activeTab">
    <TabNavItem value="profile" label="Profil" />
    <TabNavItem value="experience" label="Expérience" />
    <TabNavItem value="education" label="Formation" />

    <template #content>
      <TabContent value="profile"> Contenu du profil... </TabContent>
      <TabContent value="experience"> Contenu de l'expérience... </TabContent>
      <TabContent value="education"> Contenu de la formation... </TabContent>
    </template>
  </TabNav>
</template>

<script setup>
import { ref } from "vue";
import { TabNav, TabNavItem, TabContent } from "@cv-generator/ui";

const activeTab = ref("profile");
</script>
```

## Variants

### Styles d'onglets

Le composant `TabNav` supporte plusieurs variantes visuelles:

```vue
<TabNav variant="default"> <!-- Style par défaut avec bordure inférieure -->
<TabNav variant="minimal"> <!-- Style minimaliste sans bordures -->
<TabNav variant="underline"> <!-- Style avec indicateur souligné animé -->
<TabNav variant="contained"> <!-- Style avec fond et onglets contenus -->
```

### Orientation

Les onglets peuvent être affichés horizontalement (par défaut) ou verticalement:

```vue
<TabNav vertical>
  <!-- Onglets en colonne verticale -->
</TabNav>
```

### Options supplémentaires

```vue
<TabNav bordered> <!-- Ajoute une bordure autour du conteneur -->
<TabNav pills> <!-- Style pill pour les onglets -->
<TabNav stretched> <!-- Étire les onglets pour remplir la largeur -->
```

## Onglets avec icônes

Les onglets peuvent inclure des icônes:

```vue
<TabNavItem value="profile">
  <template #icon>
    <UserIcon class="w-4 h-4" />
  </template>
  Profil
</TabNavItem>
```

## Onglets avec badges

Les onglets peuvent afficher des badges:

```vue
<TabNavItem
  value="messages"
  label="Messages"
  badge="5"
  badgeVariant="primary"
/>
<TabNavItem value="alerts" label="Alertes" badge="New" badgeVariant="warning" />
```

## Onglets désactivés

Les onglets peuvent être désactivés individuellement ou tous ensemble:

```vue
<!-- Désactiver un onglet spécifique -->
<TabNavItem value="settings" label="Paramètres" disabled />

<!-- Désactiver tous les onglets -->
<TabNav disabled>
  <!-- Tous les onglets seront désactivés -->
</TabNav>
```

## Gestion du contenu

Il existe deux façons de gérer le contenu des onglets:

### 1. Contenu géré par TabNav (recommandé)

```vue
<TabNav v-model="activeTab">
  <TabNavItem value="tab1" label="Onglet 1" />
  <TabNavItem value="tab2" label="Onglet 2" />
  
  <template #content>
    <TabContent value="tab1">Contenu 1</TabContent>
    <TabContent value="tab2">Contenu 2</TabContent>
  </template>
</TabNav>
```

### 2. Contenu géré manuellement

```vue
<TabNav v-model="activeTab">
  <TabNavItem value="tab1" label="Onglet 1" />
  <TabNavItem value="tab2" label="Onglet 2" />
</TabNav>

<div v-if="activeTab === 'tab1'">
  Contenu de l'onglet 1
</div>
<div v-else-if="activeTab === 'tab2'">
  Contenu de l'onglet 2
</div>
```

## Transitions

`TabContent` supporte les animations de transition:

```vue
<TabContent value="profile" transition transitionType="fade">
  Contenu avec transition de type fade
</TabContent>

<TabContent value="profile" transition transitionType="slide">
  Contenu avec transition de type slide
</TabContent>

<TabContent value="profile" transition transitionType="zoom">
  Contenu avec transition de type zoom
</TabContent>
```

## Performances

Pour optimiser les performances avec un contenu complexe, utilisez l'option `keepAlive`:

```vue
<TabContent value="tab1" keepAlive>
  <!-- Le contenu reste dans le DOM mais est caché -->
</TabContent>
```

## Accessibilité

Le composant `TabNav` suit les meilleures pratiques d'accessibilité:

- Utilisation appropriée des rôles ARIA (`tablist`, `tab`, `tabpanel`)
- Support de navigation au clavier
- Attributs `aria-selected` et `aria-controls` correctement définis
- Focus visible et gestion du tabindex

## API

### TabNav Props

| Prop         | Type                                                   | Default     | Description                                            |
| ------------ | ------------------------------------------------------ | ----------- | ------------------------------------------------------ |
| `modelValue` | `string \| number`                                     | `undefined` | Valeur de l'onglet actif (pour v-model)                |
| `defaultTab` | `string \| number`                                     | `''`        | Onglet actif par défaut si modelValue n'est pas fourni |
| `variant`    | `'default' \| 'minimal' \| 'underline' \| 'contained'` | `'default'` | Style visuel des onglets                               |
| `vertical`   | `boolean`                                              | `false`     | Affiche les onglets verticalement                      |
| `bordered`   | `boolean`                                              | `false`     | Ajoute une bordure autour du conteneur                 |
| `pills`      | `boolean`                                              | `false`     | Style pill pour les onglets                            |
| `stretched`  | `boolean`                                              | `false`     | Étire les onglets pour remplir la largeur              |
| `disabled`   | `boolean`                                              | `false`     | Désactive tous les onglets                             |

### TabNavItem Props

| Prop           | Type                                                           | Default      | Description                                        |
| -------------- | -------------------------------------------------------------- | ------------ | -------------------------------------------------- |
| `value`        | `string \| number`                                             | **Required** | Identifiant unique de l'onglet                     |
| `label`        | `string`                                                       | `''`         | Texte de l'onglet (alternative au slot par défaut) |
| `disabled`     | `boolean`                                                      | `false`      | Désactive cet onglet spécifique                    |
| `badge`        | `string \| number`                                             | `''`         | Texte du badge à afficher                          |
| `badgeVariant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'`  | Style du badge                                     |

### TabContent Props

| Prop             | Type                          | Default      | Description                                     |
| ---------------- | ----------------------------- | ------------ | ----------------------------------------------- |
| `value`          | `string \| number`            | **Required** | Doit correspondre à la valeur d'un TabNavItem   |
| `keepAlive`      | `boolean`                     | `false`      | Garde le contenu dans le DOM même quand inactif |
| `transition`     | `boolean`                     | `false`      | Active les animations de transition             |
| `transitionType` | `'fade' \| 'slide' \| 'zoom'` | `'fade'`     | Type d'animation de transition                  |

## Événements

- `update:modelValue` - Émis quand l'onglet actif change (pour v-model)
- `change` - Émis quand l'onglet actif change (avec la nouvelle valeur)
