# Toast Notification Component Plan

## Vue 3 + Tailwind CSS Implementation

### Overview

Le composant `Toast` sera responsable de l'affichage des notifications temporaires qui apparaissent et disparaissent automatiquement. Il remplacera les styles SCSS existants dans `_alerts.scss` qui n'ont pas encore été migrés vers Tailwind.

### Spécifications

#### Propriétés

| Propriété     | Type      | Par défaut    | Description                                                                                     |
| ------------- | --------- | ------------- | ----------------------------------------------------------------------------------------------- |
| `type`        | `String`  | `'info'`      | Type de toast: 'info', 'success', 'warning', 'error'                                            |
| `title`       | `String`  | `''`          | Titre du toast (optionnel)                                                                      |
| `message`     | `String`  | `''`          | Message principal du toast                                                                      |
| `duration`    | `Number`  | `5000`        | Durée d'affichage en ms (0 = permanent)                                                         |
| `position`    | `String`  | `'top-right'` | Position: 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center' |
| `dismissible` | `Boolean` | `true`        | Si le toast peut être fermé manuellement                                                        |
| `icon`        | `String`  | `null`        | Icône à afficher (optionnel)                                                                    |

#### Événements

| Événement | Description                                                     |
| --------- | --------------------------------------------------------------- |
| `dismiss` | Émis quand le toast est fermé (manuellement ou automatiquement) |
| `action`  | Émis quand un bouton d'action est cliqué                        |

#### Slots

| Slot      | Description                                         |
| --------- | --------------------------------------------------- |
| `default` | Contenu principal (remplace la propriété `message`) |
| `title`   | Titre du toast (remplace la propriété `title`)      |
| `icon`    | Icône personnalisée (remplace la propriété `icon`)  |
| `actions` | Boutons d'action supplémentaires                    |

### Structure du composant

```vue
<!-- Toast.vue -->
<template>
  <transition name="toast">
    <div v-if="isVisible" :class="toastClasses">
      <!-- Icône -->
      <slot name="icon">
        <div v-if="icon || defaultIcon" class="toast-icon">
          <component :is="icon || defaultIcon" />
        </div>
      </slot>

      <!-- Contenu -->
      <div class="toast-content">
        <!-- Titre -->
        <div v-if="hasTitle" class="toast-title">
          <slot name="title">{{ title }}</slot>
        </div>

        <!-- Message -->
        <div class="toast-message">
          <slot>{{ message }}</slot>
        </div>
      </div>

      <!-- Actions -->
      <slot name="actions"></slot>

      <!-- Bouton de fermeture -->
      <button v-if="dismissible" @click="dismiss" class="toast-close">
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  </transition>
</template>
```

### Styles Tailwind

```vue
<script>
export default {
  name: "Toast",
  props: {
    type: {
      type: String,
      default: "info",
      validator: (value) =>
        ["info", "success", "warning", "error"].includes(value),
    },
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 5000,
    },
    position: {
      type: String,
      default: "top-right",
      validator: (value) =>
        [
          "top-right",
          "top-left",
          "bottom-right",
          "bottom-left",
          "top-center",
          "bottom-center",
        ].includes(value),
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: [Object, Function],
      default: null,
    },
  },
  emits: ["dismiss", "action"],
  data() {
    return {
      isVisible: true,
      timeout: null,
    };
  },
  computed: {
    hasTitle() {
      return !!this.title || !!this.$slots.title;
    },
    toastClasses() {
      return [
        "toast",
        `toast-${this.type}`,
        {
          "toast-dismissible": this.dismissible,
        },
      ];
    },
    defaultIcon() {
      // Logique pour déterminer l'icône par défaut en fonction du type
    },
  },
  mounted() {
    this.setupAutoClose();
  },
  methods: {
    setupAutoClose() {
      if (this.duration > 0) {
        this.timeout = setTimeout(() => {
          this.dismiss();
        }, this.duration);
      }
    },
    dismiss() {
      clearTimeout(this.timeout);
      this.isVisible = false;
      this.$emit("dismiss");
    },
  },
};
</script>
```

### Gestionnaire de Toasts

Un service/composant global pour gérer les toasts au niveau de l'application :

```vue
<!-- ToastContainer.vue -->
<template>
  <div :class="['toast-container', position]">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      v-bind="toast"
      @dismiss="dismissToast(toast.id)"
    />
  </div>
</template>

<script>
import Toast from "./Toast.vue";

export default {
  name: "ToastContainer",
  components: {
    Toast,
  },
  props: {
    position: {
      type: String,
      default: "top-right",
    },
  },
  data() {
    return {
      toasts: [],
    };
  },
  methods: {
    addToast(toast) {
      const id = Date.now();
      this.toasts.push({
        id,
        ...toast,
      });
      return id;
    },
    dismissToast(id) {
      const index = this.toasts.findIndex((toast) => toast.id === id);
      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    },
  },
};
</script>
```

## Dépendances et Intégration

1. Le composant `Toast` utilisera Tailwind CSS pour tous les styles
2. Les animations de transition seront gérées via des classes Tailwind
3. Les icônes seront intégrées via un système d'icônes compatible (FontAwesome, Heroicons, etc.)

## Utilisation dans le projet

### Utilisation individuelle de Toast

```vue
<template>
  <Toast
    type="success"
    title="Sauvegarde réussie"
    message="Votre CV a été sauvegardé avec succès"
    duration="3000"
  />
</template>
```

### Utilisation du conteneur de Toasts

```js
// Dans un composant
this.$toast.show({
  type: "success",
  title: "Sauvegarde réussie",
  message: "Votre CV a été sauvegardé avec succès",
  duration: 3000,
});
```

## Plan d'implémentation

1. Créer le composant `Toast.vue` avec Tailwind CSS
2. Créer le gestionnaire de Toasts `ToastContainer.vue`
3. Créer un plugin Vue pour faciliter l'utilisation globale
4. Intégrer dans l'application et tester
5. Mettre à jour la documentation
6. Finaliser le nettoyage de `_alerts.scss` une fois le composant pleinement intégré

## Migration depuis SCSS

Voici comment les classes SCSS seront migrées vers les classes Tailwind :

| Classe SCSS                  | Équivalent Tailwind                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `.toast-container`           | `fixed z-50 p-4 flex flex-col gap-3 max-w-[350px] w-full`                                                |
| `.toast-container.top-right` | `top-0 right-0`                                                                                          |
| `.toast`                     | `relative p-4 rounded-md shadow-lg flex items-start w-full bg-neutral-800 border-l-4 border-neutral-600` |
| `.toast-success`             | `border-l-success-500`                                                                                   |
| `.toast-icon`                | `mr-3 w-5 h-5 flex-shrink-0 text-neutral-400`                                                            |
| etc.                         | ...                                                                                                      |
