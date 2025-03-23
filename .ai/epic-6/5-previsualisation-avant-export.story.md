# Epic-6: CV Export et sauvegarde

Story-5: Prévisualisation avant export

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** pouvoir prévisualiser mon CV avant de l'exporter  
**afin de** m'assurer qu'il correspond à mes attentes et effectuer des ajustements si nécessaire

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. Dans la continuité des stories précédentes, elle ajoute la fonctionnalité de prévisualisation qui permettra aux utilisateurs de voir comment leur CV apparaîtra dans les différents formats d'export avant de finaliser l'exportation.

La prévisualisation est une étape cruciale dans le processus d'exportation, car elle permet aux utilisateurs de vérifier la mise en page, la disposition des éléments et l'apparence globale du CV avant de le partager avec des recruteurs. Cette fonctionnalité s'appuiera sur les systèmes de rendu HTML et PDF développés dans les stories précédentes.

Cette story s'intègre avec l'interface unifiée d'exportation (Story-1) en ajoutant une étape de prévisualisation dans le flux d'exportation.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur dans le modal d'exportation, quand il sélectionne un format, alors il peut prévisualiser le CV dans ce format avant de l'exporter
2. ✅ Étant donné une prévisualisation HTML, quand l'utilisateur la consulte, alors elle reflète fidèlement ce que sera le fichier exporté final
3. ✅ Étant donné une prévisualisation PDF, quand l'utilisateur la consulte, alors elle représente exactement ce que sera le document PDF généré
4. ✅ Étant donné une prévisualisation, quand l'utilisateur modifie son CV, alors la prévisualisation est actualisée pour refléter les changements
5. ✅ Étant donné un utilisateur sur mobile, quand il prévisualise son CV, alors l'interface de prévisualisation est adaptée à la taille d'écran
6. ✅ Étant donné un utilisateur qui prévisualise son CV, quand il décide de l'exporter, alors le processus d'exportation commence immédiatement

## Tâches

1. - [ ] Concevoir le composant de prévisualisation

   1. - [ ] Créer une interface utilisateur pour la prévisualisation des différents formats
   2. - [ ] Développer un composant modal/overlay pour afficher les prévisualisations
   3. - [ ] Implémenter les contrôles de navigation et d'action (exporter, fermer, etc.)

2. - [ ] Implémenter la prévisualisation HTML

   1. - [ ] Utiliser le système de templates HTML existant pour générer la prévisualisation
   2. - [ ] Créer un iframe ou un conteneur sécurisé pour afficher le HTML rendu
   3. - [ ] Assurer que la prévisualisation HTML est identique au fichier exporté

3. - [ ] Mettre en place la prévisualisation PDF

   1. - [ ] Intégrer un viewer PDF léger pour afficher la prévisualisation
   2. - [ ] Connecter le service de génération PDF au composant de prévisualisation
   3. - [ ] Optimiser le processus pour éviter des temps de chargement excessifs

4. - [ ] Intégrer la prévisualisation dans le flux d'exportation

   1. - [ ] Modifier l'interface d'exportation pour inclure l'étape de prévisualisation
   2. - [ ] Gérer la transition fluide entre sélection du format, prévisualisation et exportation
   3. - [ ] Assurer que les actions utilisateur sont clairement indiquées et accessibles

5. - [ ] Optimiser l'expérience utilisateur
   1. - [ ] Ajouter des indicateurs de chargement pendant la génération des prévisualisations
   2. - [ ] Implémenter des transitions fluides entre les différentes vues
   3. - [ ] Assurer une expérience responsive sur tous les types d'appareils

## Avancement

### 2024-05-20 - Conception initiale du composant de prévisualisation

Nous avons commencé la conception du composant de prévisualisation avec les fonctionnalités suivantes :

1. **Architecture du composant** :

   - Un composant modal fullscreen pour maximiser l'espace de prévisualisation
   - Une barre d'outils supérieure avec les contrôles (format, exporter, fermer)
   - Une zone principale de rendu qui s'adapte au format sélectionné

2. **Prévisualisation HTML** :

   - Utilisation d'un iframe isolé pour rendre le HTML en toute sécurité
   - Contrôles de zoom et de défilement pour explorer le document
   - Rendu en temps réel basé sur le template sélectionné

3. **Prévisualisation PDF** :
   - Intégration d'un viewer PDF léger basé sur PDF.js
   - Génération à la demande du PDF pour prévisualisation
   - Pagination et navigation dans le document PDF

## Principes de Développement

#### Principes à Suivre

- **Fidélité de Rendu** : La prévisualisation doit correspondre exactement au fichier exporté final
- **Performance** : La génération de prévisualisations doit être rapide et fluide pour une bonne UX
- **Isolation** : Le contenu prévisualisé doit être isolé pour éviter des problèmes de sécurité ou de style
- **UX Intuitive** : L'interface de prévisualisation doit être simple et intuitive
- **Responsive Design** : La prévisualisation doit s'adapter à tous les formats d'écran

#### À Éviter

- Des temps de chargement excessifs qui frustreraient l'utilisateur
- Des prévisualisations qui ne correspondent pas au résultat final exporté
- Une interface trop complexe qui détournerait l'attention du contenu du CV
- Des problèmes de performance sur les appareils moins puissants
- Une expérience dégradée sur mobile ou tablette

## Risques et Hypothèses

| Risque                                                       | Probabilité | Impact | Mitigation                                                           |
| ------------------------------------------------------------ | ----------- | ------ | -------------------------------------------------------------------- |
| Génération lente des prévisualisations PDF                   | Élevée      | Élevé  | Optimiser le rendu et ajouter des indicateurs de chargement clairs   |
| Différences visuelles entre prévisualisation et export       | Moyenne     | Élevé  | Utiliser exactement le même moteur de rendu pour les deux            |
| Problèmes d'affichage sur certains navigateurs               | Moyenne     | Moyen  | Tester et adapter la prévisualisation pour différents navigateurs    |
| Conflit de styles entre l'application et la prévisualisation | Moyenne     | Moyen  | Isoler complètement le contenu prévisualisé via iframe ou shadow DOM |
| Performance dégradée sur appareils mobiles                   | Moyenne     | Élevé  | Optimiser le rendu et proposer une version allégée si nécessaire     |

## Notes de Développement

### Composant de prévisualisation

```vue
<!-- src/ui/components/export/PreviewModal.vue -->
<template>
  <div v-if="isVisible" class="preview-modal">
    <!-- Barre d'outils supérieure -->
    <div class="preview-modal__toolbar">
      <div class="preview-modal__format-selector">
        <label for="format-select">Format:</label>
        <select
          id="format-select"
          v-model="selectedFormat"
          @change="updatePreview"
        >
          <option value="html">HTML</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      <div class="preview-modal__actions">
        <button
          class="btn-export"
          @click="exportResume"
          :disabled="isExporting"
        >
          <span v-if="isExporting">{{ $t("ui.export.exporting") }}</span>
          <span v-else>{{ $t("ui.export.download") }}</span>
        </button>

        <button class="btn-close" @click="close">
          <span>{{ $t("common.actions.close") }}</span>
        </button>
      </div>
    </div>

    <!-- Zone de prévisualisation -->
    <div class="preview-modal__content" :class="{ 'is-loading': isLoading }">
      <!-- Overlay de chargement -->
      <div v-if="isLoading" class="preview-modal__loader">
        <div class="spinner"></div>
        <p>{{ $t("ui.export.generatingPreview") }}</p>
      </div>

      <!-- Prévisualisation HTML -->
      <iframe
        v-if="selectedFormat === 'html' && !isLoading && htmlContent"
        ref="htmlPreview"
        class="preview-modal__iframe"
        sandbox="allow-same-origin"
        :srcdoc="htmlContent"
      ></iframe>

      <!-- Prévisualisation PDF -->
      <div
        v-if="selectedFormat === 'pdf' && !isLoading && pdfUrl"
        class="preview-modal__pdf-container"
      >
        <object
          :data="pdfUrl"
          type="application/pdf"
          class="preview-modal__pdf-viewer"
        >
          <p>{{ $t("ui.export.pdfViewerNotSupported") }}</p>
          <a :href="pdfUrl" target="_blank">
            {{ $t("ui.export.openInNewTab") }}
          </a>
        </object>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useExport } from "@/composables/useExport";
import { useResumeStore } from "@/modules/cv/presentation/stores/resume";

const props = defineProps<{
  isVisible: boolean;
  initialFormat?: "html" | "pdf";
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "export-success"): void;
}>();

const { t } = useI18n();
const { exportResume } = useExport();
const resumeStore = useResumeStore();

// État local
const selectedFormat = ref(props.initialFormat || "html");
const isLoading = ref(false);
const isExporting = ref(false);
const htmlContent = ref<string | null>(null);
const pdfUrl = ref<string | null>(null);

// Références
const htmlPreview = ref<HTMLIFrameElement | null>(null);

// Initialisation
onMounted(() => {
  if (props.isVisible) {
    updatePreview();
  }
});

// Mise à jour lorsque le modal devient visible
watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      updatePreview();
    }
  }
);

// Mise à jour lorsque le format change
watch(selectedFormat, () => {
  updatePreview();
});

/**
 * Met à jour la prévisualisation selon le format sélectionné
 */
async function updatePreview() {
  isLoading.value = true;

  try {
    const resumeData = resumeStore.resume;

    if (selectedFormat.value === "html") {
      // Générer le contenu HTML
      const htmlExportService = new HtmlExportService();
      htmlContent.value = htmlExportService.exportToHtml(resumeData);
      pdfUrl.value = null;
    } else if (selectedFormat.value === "pdf") {
      // Générer le PDF et créer une URL pour la prévisualisation
      const htmlExportService = new HtmlExportService();
      const pdfExportService = new PdfExportService(htmlExportService);
      const pdfBlob = await pdfExportService.exportToPdf(resumeData);

      // Créer une URL de Blob pour la prévisualisation
      if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value); // Nettoyer l'URL précédente
      }
      pdfUrl.value = URL.createObjectURL(pdfBlob);
      htmlContent.value = null;
    }
  } catch (error) {
    console.error("Preview generation error:", error);
    // Afficher un message d'erreur à l'utilisateur
  } finally {
    isLoading.value = false;
  }
}

/**
 * Exporte le CV dans le format sélectionné
 */
async function exportResume() {
  isExporting.value = true;

  try {
    await exportResume(selectedFormat.value);
    emit("export-success");
  } catch (error) {
    console.error("Export error:", error);
    // Afficher un message d'erreur à l'utilisateur
  } finally {
    isExporting.value = false;
  }
}

/**
 * Ferme le modal de prévisualisation
 */
function close() {
  // Nettoyer les ressources
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value);
  }

  emit("close");
}
</script>

<style lang="scss" scoped>
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.9);

  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: var(--color-neutral-900);
    border-bottom: 1px solid var(--color-neutral-800);
  }

  &__format-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    select {
      background-color: var(--color-neutral-800);
      border: 1px solid var(--color-neutral-700);
      color: #fff;
      padding: 0.5rem;
      border-radius: 0.25rem;
    }
  }

  &__actions {
    display: flex;
    gap: 0.5rem;

    button {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      cursor: pointer;

      &.btn-export {
        background-color: var(--color-primary-600);
        color: #fff;
        border: none;

        &:hover:not(:disabled) {
          background-color: var(--color-primary-700);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      &.btn-close {
        background-color: var(--color-neutral-700);
        color: #fff;
        border: none;

        &:hover {
          background-color: var(--color-neutral-600);
        }
      }
    }
  }

  &__content {
    flex: 1;
    position: relative;
    overflow: auto;
    background-color: #f5f5f5;
  }

  &__loader {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;

    .spinner {
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top: 4px solid #fff;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
  }

  &__iframe {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #fff;
  }

  &__pdf-container {
    width: 100%;
    height: 100%;
  }

  &__pdf-viewer {
    width: 100%;
    height: 100%;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Styles responsives */
@media (max-width: 640px) {
  .preview-modal {
    &__toolbar {
      flex-direction: column;
      gap: 0.5rem;
      align-items: stretch;
    }

    &__format-selector {
      justify-content: space-between;
    }

    &__actions {
      justify-content: space-between;
    }
  }
}
</style>
```

### Intégration avec le composant d'exportation

```typescript
// Mise à jour du composant ExportModal.vue
<template>
  <div v-if="isVisible" class="export-modal">
    <!-- Contenu existant... -->

    <!-- Ajout d'un bouton de prévisualisation -->
    <div class="export-modal__footer">
      <button @click="close">{{ $t('common.actions.cancel') }}</button>

      <button
        :disabled="!canExport"
        @click="previewResume"
        class="btn-preview"
      >
        {{ $t('ui.export.preview') }}
      </button>

      <button
        :disabled="!canExport"
        @click="exportResume"
        :class="{ 'is-loading': isExporting }"
      >
        {{ $t('ui.export.download') }}
      </button>
    </div>
  </div>

  <!-- Modal de prévisualisation -->
  <PreviewModal
    :is-visible="showPreview"
    :initial-format="selectedFormat"
    @close="showPreview = false"
    @export-success="onExportSuccess"
  />
</template>

<script setup>
import { ref } from 'vue';
import PreviewModal from './PreviewModal.vue';

// État local
const showPreview = ref(false);

/**
 * Ouvre la prévisualisation avec le format sélectionné
 */
function previewResume() {
  showPreview.value = true;
}

/**
 * Gère le succès de l'exportation depuis la prévisualisation
 */
function onExportSuccess() {
  showPreview.value = false;
  close();
}
</script>
```

### Test de performances

Pour s'assurer que la prévisualisation est performante même sur des appareils moins puissants, nous mettrons en place des mécanismes de test et d'optimisation :

```typescript
// services/PreviewPerformanceMonitor.ts
export class PreviewPerformanceMonitor {
  private startTime: number = 0;
  private metrics: Record<string, number> = {};

  /**
   * Démarre le monitoring de performance
   * @param operation Nom de l'opération à monitorer
   */
  public start(operation: string): void {
    this.startTime = performance.now();
    console.log(`Starting ${operation} performance measurement`);
  }

  /**
   * Termine le monitoring et enregistre les métriques
   * @param operation Nom de l'opération
   */
  public end(operation: string): void {
    const endTime = performance.now();
    const duration = endTime - this.startTime;

    this.metrics[operation] = duration;
    console.log(`${operation} took ${duration.toFixed(2)}ms`);

    // Si la durée dépasse un seuil critique, logger un avertissement
    if (duration > 1000) {
      console.warn(
        `${operation} is slow (${duration.toFixed(
          2
        )}ms). Consider optimization.`
      );
    }
  }

  /**
   * Récupère les métriques collectées
   */
  public getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }

  /**
   * Réinitialise les métriques
   */
  public reset(): void {
    this.metrics = {};
  }
}
```
