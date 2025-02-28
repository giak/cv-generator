# Composant Toast

Le composant Toast permet d'afficher des notifications temporaires aux utilisateurs. Cette documentation explique comment utiliser le système de notifications Toast dans l'application CV Generator.

## Table des matières

- [Installation](#installation)
- [Utilisation directe du composant](#utilisation-directe-du-composant)
- [Utilisation du plugin Toast](#utilisation-du-plugin-toast)
- [API](#api)
- [Personnalisation](#personnalisation)
- [Exemples](#exemples)

## Installation

Le composant Toast est déjà installé et configuré dans l'application. Le plugin est enregistré dans `main.ts` :

```typescript
import { createApp } from "vue";
import App from "./App/App.vue";
import ToastPlugin from "./plugins/toast";

const app = createApp(App);
app.use(ToastPlugin, {
  position: "top-right",
  maxToasts: 5,
});
app.mount("#app");
```

## Utilisation directe du composant

Pour utiliser directement le composant Toast dans vos templates :

```vue
<template>
  <Toast
    type="success"
    title="Opération réussie"
    message="Les données ont été enregistrées avec succès."
    :duration="5000"
    dismissible
  />
</template>

<script setup lang="ts">
import Toast from "@ui/components/notification/Toast.vue";
</script>
```

## Utilisation du plugin Toast

Pour utiliser le plugin Toast dans vos composants Vue :

### Avec Composition API (recommandé)

```typescript
import { useToast } from "@ui/plugins/toast";

// Dans votre setup()
const toast = useToast();

// Afficher une notification
toast.success("Opération réussie");

// Avec plus d'options
toast.error("Une erreur est survenue", {
  title: "Erreur",
  duration: 10000,
});

// Avec un bouton d'action
toast.warning("Votre session va expirer", {
  title: "Attention",
  actionLabel: "Prolonger la session",
  actionData: { action: "extend_session" },
});
```

### Avec Options API

```typescript
export default {
  methods: {
    showSuccessToast() {
      this.$toast.success("Opération réussie");
    },

    showErrorToast() {
      this.$toast.error("Une erreur est survenue", {
        title: "Erreur",
      });
    },
  },
};
```

## API

### Propriétés du composant Toast

| Propriété     | Type                                                                                                        | Par défaut    | Description                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `type`        | `'info'` \| `'success'` \| `'warning'` \| `'error'`                                                         | `'info'`      | Type de toast                                                               |
| `title`       | `string`                                                                                                    | `''`          | Titre du toast                                                              |
| `message`     | `string`                                                                                                    | `''`          | Message principal                                                           |
| `duration`    | `number`                                                                                                    | `5000`        | Durée d'affichage en ms (0 = persistant)                                    |
| `position`    | `'top-right'` \| `'top-left'` \| `'bottom-right'` \| `'bottom-left'` \| `'top-center'` \| `'bottom-center'` | `'top-right'` | Position                                                                    |
| `dismissible` | `boolean`                                                                                                   | `true`        | Si le toast peut être fermé manuellement                                    |
| `icon`        | `Component`                                                                                                 | `undefined`   | Composant d'icône personnalisé                                              |
| `actionLabel` | `string`                                                                                                    | `''`          | Texte du bouton d'action                                                    |
| `actionData`  | `any`                                                                                                       | `null`        | Données associées à l'action (transmises lors de l'émission de l'événement) |

### Événements

| Événement | Payload      | Description                                |
| --------- | ------------ | ------------------------------------------ |
| `dismiss` | -            | Émis lorsque le toast est fermé            |
| `action`  | `actionData` | Émis lorsque le bouton d'action est cliqué |

### API du plugin Toast

| Méthode      | Paramètres                                         | Description                                  |
| ------------ | -------------------------------------------------- | -------------------------------------------- |
| `show`       | `options: ToastOptions`                            | Affiche un toast avec les options spécifiées |
| `success`    | `message: string, options?: Partial<ToastOptions>` | Affiche un toast de succès                   |
| `error`      | `message: string, options?: Partial<ToastOptions>` | Affiche un toast d'erreur                    |
| `warning`    | `message: string, options?: Partial<ToastOptions>` | Affiche un toast d'avertissement             |
| `info`       | `message: string, options?: Partial<ToastOptions>` | Affiche un toast d'information               |
| `dismiss`    | `id: number`                                       | Ferme un toast spécifique                    |
| `dismissAll` | -                                                  | Ferme tous les toasts                        |

## Personnalisation

### Slots

Le composant Toast prend en charge les slots suivants :

| Slot      | Description                                         |
| --------- | --------------------------------------------------- |
| `default` | Contenu principal (remplace la propriété `message`) |
| `title`   | Titre personnalisé                                  |
| `icon`    | Icône personnalisée                                 |
| `actions` | Actions personnalisées                              |

### Exemple d'utilisation des slots

```vue
<Toast type="warning">
  <template #title>
    <span class="flex items-center">
      <AlertIcon class="w-4 h-4 mr-1" />
      Attention
    </span>
  </template>
  
  <p>Votre abonnement expire dans <strong>3 jours</strong>.</p>
  
  <template #actions>
    <button @click="renewSubscription" class="text-primary-400 text-sm font-medium hover:text-primary-300">
      Renouveler
    </button>
  </template>
</Toast>
```

## Exemples

### Notification de succès

```typescript
toast.success("CV enregistré avec succès");
```

### Notification avec titre et durée personnalisée

```typescript
toast.info("Nouvelle version disponible", {
  title: "Mise à jour",
  duration: 10000,
});
```

### Notification persistante

```typescript
toast.warning("Votre session va expirer dans 5 minutes", {
  title: "Session",
  duration: 0, // Persistant jusqu'à fermeture manuelle
  dismissible: true,
});
```

### Notification avec bouton d'action

```typescript
toast.warning("Votre session va expirer bientôt", {
  title: "Session",
  actionLabel: "Prolonger la session",
  actionData: { action: "extend_session" },
  duration: 0, // Persistant
});

// Gérer l'action
toast.on("action", (data) => {
  if (data.action === "extend_session") {
    // Prolonger la session...
  }
});
```

### Notification avec position personnalisée

```typescript
toast.error("Impossible de se connecter au serveur", {
  title: "Erreur réseau",
  position: "bottom-center",
});
```
