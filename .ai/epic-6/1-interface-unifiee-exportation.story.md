# Epic-6: CV Export et sauvegarde

Story-1: Interface unifiée d'exportation

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** avoir accès à une interface unifiée et intuitive pour l'exportation de mon CV  
**afin de** pouvoir facilement choisir le format d'exportation souhaité (JSON, HTML, PDF) et lancer le processus d'export depuis n'importe quelle page

## Statut

En cours

## Contexte

Cette story est la première de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. L'application dispose déjà d'une infrastructure pour exporter le CV au format JSON, mais elle nécessite une interface utilisateur cohérente et intuitive, ainsi que l'implémentation complète de l'exportation vers d'autres formats (HTML, PDF).

La structure technique est partiellement en place, avec :

- Une classe `ExportFormat` qui définit les formats supportés (PDF, JSON, HTML)
- Une méthode `export` dans l'interface `ResumeRepository`
- Une implémentation partielle dans `LocalStorageResumeRepository` (seul le format JSON est actuellement fonctionnel)
- Des traductions existantes pour certains éléments de l'interface d'exportation

Cette story se concentre sur la création d'une interface utilisateur unifiée pour l'exportation, facilitant l'accès à cette fonctionnalité depuis n'importe quelle section de l'application.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur sur n'importe quelle page, quand il clique sur le bouton d'exportation, alors un modal s'ouvre avec les options d'exportation disponibles
2. ✅ Étant donné un utilisateur dans le modal d'exportation, quand il sélectionne un format d'export, alors il voit une description claire de ce format
3. ✅ Étant donné un utilisateur qui a sélectionné un format d'export, quand il lance l'exportation, alors le fichier est généré au format choisi et proposé au téléchargement
4. ✅ Étant donné un utilisateur qui lance une exportation, quand le processus est en cours, alors un indicateur de chargement est affiché
5. ✅ Étant donné un utilisateur qui a lancé une exportation, quand celle-ci se termine avec succès, alors un message de confirmation est affiché
6. ✅ Étant donné un utilisateur qui a lancé une exportation, quand celle-ci échoue, alors un message d'erreur clair est affiché avec les raisons de l'échec
7. ✅ Étant donné qu'un format d'export n'est pas encore implémenté, quand l'utilisateur le sélectionne, alors un message indique clairement que la fonctionnalité est en cours de développement

## Tâches

1. - [ ] Créer un composant modal d'exportation réutilisable

   1. - [ ] Concevoir l'interface utilisateur du modal avec l'esthétique cohérente de l'application
   2. - [ ] Implémenter la logique d'ouverture/fermeture du modal depuis diverses parties de l'application
   3. - [ ] Structurer le contenu du modal avec les sections pour chaque format d'export

2. - [ ] Implémenter la sélection des formats d'exportation

   1. - [ ] Créer un composant de sélection de format avec icônes et descriptions
   2. - [ ] Connecter ce composant à la liste des formats disponibles depuis `ExportFormat`
   3. - [ ] Ajouter des indicateurs pour les formats non encore implémentés

3. - [ ] Développer la logique d'exportation dans l'interface utilisateur

   1. - [ ] Connecter le bouton d'export du modal au service d'exportation existant
   2. - [ ] Implémenter la gestion des états de chargement, succès et erreur
   3. - [ ] Intégrer la fonction de téléchargement du fichier généré

4. - [ ] Intégrer le bouton d'exportation dans l'interface principale

   1. - [ ] Ajouter un bouton d'export bien visible dans l'en-tête de l'application
   2. - [ ] Connecter ce bouton à l'ouverture du modal d'exportation
   3. - [ ] Assurer que le bouton est accessible depuis toutes les sections

5. - [ ] Internationaliser l'interface d'exportation
   1. - [ ] Assurer que tous les textes du modal sont traduits (français/anglais)
   2. - [ ] Inclure des traductions pour les messages de statut (chargement, succès, erreur)
   3. - [ ] Maintenir la cohérence linguistique dans tout le processus d'exportation

## Avancement

### 2024-05-19 - Planning initial et recherche

Nous avons effectué une analyse du système d'exportation existant et identifié les points suivants :

1. **Architecture actuelle** :

   - L'application dispose déjà d'une méthode `export` dans le repository qui prend en charge l'exportation au format JSON
   - Les formats HTML et PDF sont définis mais non implémentés
   - Des traductions existent déjà pour certains éléments de l'interface d'exportation

2. **Composants UI existants pouvant être réutilisés** :

   - L'application utilise des modaux similaires pour d'autres fonctionnalités (ajout/édition d'éléments du CV)
   - Des composants de boutons et d'actions sont disponibles avec différentes variantes
   - Un système de toast existe pour les notifications de succès/erreur

3. **Plan d'implémentation** :
   - Créer un composant modal d'exportation réutilisable
   - Mettre en place une interface intuitive pour la sélection du format
   - Intégrer la logique d'exportation existante et ajouter les indicateurs d'état
   - Ajouter un bouton d'export dans l'en-tête de l'application

## Principes de Développement

#### Principes à Suivre

- **UX Cohérente** : Intégrer l'interface d'exportation en harmonie avec le reste de l'application
- **Accessibilité** : S'assurer que les boutons et contrôles d'exportation sont accessibles selon les standards WCAG
- **Retour utilisateur** : Fournir des indications claires sur le statut du processus d'exportation
- **Progressive Enhancement** : Permettre l'utilisation de l'interface même si certains formats ne sont pas encore disponibles
- **Réactivité** : Assurer que l'interface d'exportation fonctionne bien sur tous les appareils

#### À Éviter

- Un modal trop complexe qui surcharge l'utilisateur d'options inutiles
- Des temps d'attente sans indication visuelle lors de l'exportation
- Des messages d'erreur cryptiques en cas d'échec
- Une interface qui ne reflète pas l'état réel des fonctionnalités implémentées
- Des options d'exportation cachées ou difficiles à trouver dans l'interface

## Risques et Hypothèses

| Risque                                                      | Probabilité | Impact | Mitigation                                                               |
| ----------------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------ |
| Exportation échouant avec de gros volumes de données        | Moyenne     | Élevé  | Implémenter une gestion robuste des erreurs et un feedback utilisateur   |
| Confusion utilisateur sur les formats non disponibles       | Moyenne     | Moyen  | Indiquer clairement quels formats sont fonctionnels vs. en développement |
| Téléchargement ne fonctionnant pas sur certains navigateurs | Faible      | Élevé  | Tester l'exportation sur différents navigateurs et environnements        |
| Mauvaise expérience mobile pour l'interface d'exportation   | Moyenne     | Moyen  | Concevoir l'interface responsive dès le départ                           |
| Incohérences visuelles après le changement de langue        | Faible      | Moyen  | Tester l'interface dans toutes les langues supportées                    |

## Notes de Développement

### Structure du composant modal d'exportation

Le composant d'exportation sera structuré comme suit :

```vue
<!-- ExportModal.vue -->
<template>
  <div v-if="isVisible" class="export-modal">
    <div class="export-modal__content">
      <!-- En-tête -->
      <div class="export-modal__header">
        <h2>{{ $t("ui.export.title") }}</h2>
        <button @click="close">×</button>
      </div>

      <!-- Corps - Options d'exportation -->
      <div class="export-modal__body">
        <div
          v-for="format in exportFormats"
          :key="format.id"
          class="export-format-option"
          :class="{ 'is-selected': selectedFormat === format.id }"
          @click="selectFormat(format.id)"
        >
          <div class="export-format-option__icon">
            <!-- Icône spécifique au format -->
          </div>
          <div class="export-format-option__content">
            <h3>{{ $t(`ui.export.${format.id}Format`) }}</h3>
            <p>{{ $t(`ui.export.${format.id}Description`) }}</p>
            <span
              v-if="!isFormatAvailable(format.id)"
              class="coming-soon-badge"
            >
              {{ $t("ui.export.comingSoon") }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pied - Actions -->
      <div class="export-modal__footer">
        <button @click="close">{{ $t("common.actions.cancel") }}</button>
        <button
          :disabled="!canExport"
          @click="exportResume"
          :class="{ 'is-loading': isExporting }"
        >
          {{ $t("ui.export.download") }}
        </button>
      </div>
    </div>
  </div>
</template>
```

### Intégration dans l'en-tête de l'application

Le bouton d'exportation sera ajouté dans la section `header-actions` du composant `DashboardLayout.vue` :

```vue
<template #header-actions>
  <Button
    variant="primary"
    size="md"
    @click="openExportModal"
    class="flex items-center"
  >
    <template #icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    </template>
    {{ $t("ui.export.button") }}
  </Button>
</template>
```

### Gestion du processus d'exportation

La logique d'exportation sera implémentée comme suit :

```typescript
// Dans le composable useExport.ts
export function useExport() {
  const resumeStore = useResumeStore();
  const { addToast } = useToast();
  const { t } = useI18n();

  const isExporting = ref(false);
  const exportError = ref<string | null>(null);

  async function exportResume(format: "json" | "pdf" | "html") {
    isExporting.value = true;
    exportError.value = null;

    try {
      // Appel au store pour l'exportation
      const blob = await resumeStore.exportResume(format);

      // Création du lien de téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const timestamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `resume-${timestamp}.${format}`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      // Notification de succès
      addToast({
        type: "success",
        message: t("ui.export.successMessage"),
        duration: 3000,
      });

      return true;
    } catch (error) {
      console.error("Export error:", error);
      exportError.value =
        error instanceof Error ? error.message : String(error);

      // Notification d'erreur
      addToast({
        type: "error",
        message: t("ui.export.errorMessage"),
        duration: 5000,
      });

      return false;
    } finally {
      isExporting.value = false;
    }
  }

  return {
    exportResume,
    isExporting,
    exportError,
  };
}
```
