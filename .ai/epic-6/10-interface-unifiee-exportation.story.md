# Epic-6: CV Export et sauvegarde

Story-10: Interface unifiée d'exportation

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** avoir accès à une interface simple et unifiée pour toutes les options d'exportation  
**afin de** pouvoir facilement choisir le format et les options d'export sans confusion

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. Elle se concentre sur la création d'une interface utilisateur cohérente et intuitive qui regroupe toutes les fonctionnalités d'exportation développées dans les stories précédentes.

L'interface unifiée d'exportation permettra à l'utilisateur de choisir le format d'export (JSON, HTML, PDF), de sélectionner un template, de personnaliser l'apparence, et de prévisualiser le résultat final, le tout dans un flux cohérent et intuitif.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur qui souhaite exporter son CV, quand il clique sur le bouton d'exportation, alors une interface modale unique s'ouvre avec toutes les options disponibles
2. ✅ Étant donné un utilisateur dans l'interface d'exportation, quand il sélectionne un format, alors les options spécifiques à ce format sont affichées dynamiquement
3. ✅ Étant donné un utilisateur qui a configuré ses options d'exportation, quand il clique sur le bouton de prévisualisation, alors il peut voir le rendu avant de confirmer l'export
4. ✅ Étant donné un utilisateur qui a prévisualisé son CV, quand il clique sur le bouton d'exportation, alors le fichier est généré et téléchargé dans le format choisi
5. ✅ Étant donné un utilisateur sur mobile, quand il accède à l'interface d'exportation, alors celle-ci s'adapte correctement à la taille de l'écran

## Tâches

1. - [ ] Concevoir l'interface unifiée d'exportation

   1. - [ ] Créer les maquettes UI/UX pour l'interface
   2. - [ ] Valider l'ergonomie et l'accessibilité du design
   3. - [ ] Définir le flux utilisateur complet pour tous les formats d'export

2. - [ ] Développer le composant modal d'exportation

   1. - [ ] Créer le composant Vue.js pour l'interface d'exportation
   2. - [ ] Implémenter la navigation entre les différentes étapes du processus
   3. - [ ] Intégrer les transitions et animations pour une expérience fluide

3. - [ ] Intégrer les fonctionnalités existantes

   1. - [ ] Connecter le sélecteur de format (JSON, HTML, PDF)
   2. - [ ] Intégrer le sélecteur de templates
   3. - [ ] Incorporer le panneau de personnalisation
   4. - [ ] Ajouter le composant de prévisualisation

4. - [ ] Implémenter le processus d'exportation final

   1. - [ ] Développer le service d'exportation qui coordonne les différents formats
   2. - [ ] Ajouter les indicateurs de progression pendant l'exportation
   3. - [ ] Implémenter la gestion des erreurs et les messages utilisateur

5. - [ ] Optimiser l'expérience utilisateur
   1. - [ ] Assurer la compatibilité mobile et responsive
   2. - [ ] Ajouter des tooltips et aides contextuelles
   3. - [ ] Implémenter la mémorisation des préférences d'exportation

## Avancement

### 2024-05-22 - Conception de l'interface unifiée

Nous avons conçu l'interface unifiée d'exportation avec les caractéristiques suivantes:

1. **Structure en étapes**:

   - Étape 1: Choix du format (JSON, HTML, PDF)
   - Étape 2: Sélection du template (pour HTML et PDF)
   - Étape 3: Personnalisation (couleurs, polices, etc.)
   - Étape 4: Prévisualisation et téléchargement

2. **Navigation intuitive**:

   - Barre de progression pour indiquer l'étape actuelle
   - Boutons Précédent/Suivant pour naviguer entre les étapes
   - Possibilité de sauter certaines étapes pour les exports simples (ex: JSON)

3. **Adaptabilité contextuelle**:
   - Options affichées dynamiquement selon le format sélectionné
   - Interface simplifiée sur mobile avec vue par étapes distinctes
   - Prévisualisation adaptée à chaque format

## Principes de Développement

#### Principes à Suivre

- **Simplicité d'abord** : Interface claire et directe, évitant la surcharge cognitive
- **Cohérence** : Expérience unifiée pour tous les formats d'exportation
- **Progressivité** : Révélation progressive des options en fonction des choix de l'utilisateur
- **Feedback immédiat** : Retour visuel clair sur chaque action et état du processus
- **Accessibilité** : Interface utilisable par tous, y compris avec clavier et lecteurs d'écran

#### À Éviter

- Surcharge d'options visibles simultanément
- Interruptions du flux utilisateur par des modales superflues
- Terminologie technique peu claire pour l'utilisateur final
- Temps d'attente sans indication de progression
- Interface différente entre desktop et mobile

## Risques et Hypothèses

| Risque                                              | Probabilité | Impact | Mitigation                                                             |
| --------------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------- |
| Complexité excessive de l'interface                 | Moyenne     | Élevé  | Tests utilisateurs et simplification itérative du design               |
| Temps de chargement long entre les étapes           | Moyenne     | Moyen  | Préchargement des composants et optimisation des ressources            |
| Confusion utilisateur sur les différents formats    | Élevée      | Moyen  | Explications claires et exemples visuels pour chaque format            |
| Problèmes de compatibilité sur certains navigateurs | Basse       | Élevé  | Tests cross-browser extensifs et fallbacks appropriés                  |
| Difficulté d'utilisation sur appareils mobiles      | Moyenne     | Élevé  | Design mobile-first et simplification de l'interface sur petits écrans |

## Notes de Développement

### Composant principal d'exportation

```vue
<!-- src/ui/components/export/ExportModal.vue -->
<template>
  <div v-if="isVisible" class="export-modal" :class="{ 'is-mobile': isMobile }">
    <div class="export-modal__container">
      <header class="export-modal__header">
        <h2>{{ $t("ui.export.title") }}</h2>
        <button class="btn-close" @click="close">
          <span class="icon-close"></span>
        </button>
      </header>

      <!-- Barre de progression -->
      <div v-if="!isMobile" class="export-modal__progress">
        <div
          v-for="(step, index) in visibleSteps"
          :key="step.id"
          class="progress-step"
          :class="{
            'is-active': currentStepIndex === index,
            'is-completed': currentStepIndex > index,
          }"
          @click="goToStep(index)"
        >
          <div class="progress-step__indicator">
            <span v-if="currentStepIndex > index" class="icon-check"></span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="progress-step__label">{{ step.label }}</span>
        </div>
      </div>

      <!-- Contenu des étapes -->
      <div class="export-modal__content">
        <!-- Étape 1: Choix du format -->
        <div v-if="currentStep === 'format'" class="export-step">
          <h3>{{ $t("ui.export.steps.format.title") }}</h3>
          <p>{{ $t("ui.export.steps.format.description") }}</p>

          <div class="format-selector">
            <div
              v-for="format in availableFormats"
              :key="format.id"
              class="format-option"
              :class="{ 'is-selected': selectedFormat === format.id }"
              @click="selectFormat(format.id)"
            >
              <div class="format-option__icon">
                <span :class="`icon-${format.id}`"></span>
              </div>
              <div class="format-option__info">
                <h4>{{ format.label }}</h4>
                <p>{{ format.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Étape 2: Sélection du template -->
        <div v-else-if="currentStep === 'template'" class="export-step">
          <h3>{{ $t("ui.export.steps.template.title") }}</h3>
          <p>{{ $t("ui.export.steps.template.description") }}</p>

          <template-selector
            v-model:template="selectedTemplate"
            :disabled-templates="disabledTemplates"
          />
        </div>

        <!-- Étape 3: Personnalisation -->
        <div v-else-if="currentStep === 'customize'" class="export-step">
          <h3>{{ $t("ui.export.steps.customize.title") }}</h3>
          <p>{{ $t("ui.export.steps.customize.description") }}</p>

          <customization-panel
            v-model:customization="customization"
            :template-id="selectedTemplate"
          />
        </div>

        <!-- Étape 4: Prévisualisation et téléchargement -->
        <div v-else-if="currentStep === 'preview'" class="export-step">
          <h3>{{ $t("ui.export.steps.preview.title") }}</h3>

          <div
            class="preview-container"
            :class="{ 'is-loading': isPreviewLoading }"
          >
            <div v-if="isPreviewLoading" class="preview-loader">
              <div class="spinner"></div>
              <p>{{ $t("ui.export.generatingPreview") }}</p>
            </div>

            <template v-else>
              <!-- Prévisualisation selon le format -->
              <preview-content
                :format="selectedFormat"
                :template="selectedTemplate"
                :customization="customization"
                :resume-data="resumeData"
              />
            </template>
          </div>
        </div>
      </div>

      <!-- Barre d'actions -->
      <footer class="export-modal__footer">
        <button
          v-if="canGoBack"
          class="btn btn-secondary"
          @click="previousStep"
        >
          {{ $t("ui.export.back") }}
        </button>

        <div class="footer-right">
          <button
            v-if="currentStep !== 'preview'"
            class="btn btn-primary"
            :disabled="!canGoNext"
            @click="nextStep"
          >
            {{ $t("ui.export.next") }}
          </button>

          <button
            v-else
            class="btn btn-success"
            :disabled="isExporting"
            @click="exportResume"
          >
            <span v-if="isExporting">
              <span class="spinner-small"></span>
              {{ $t("ui.export.exporting") }}
            </span>
            <span v-else>
              {{ $t("ui.export.download") }}
            </span>
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useMediaQuery } from "@vueuse/core";
import { useResumeStore } from "@/modules/cv/presentation/stores/resume";
import { useExport } from "@/composables/useExport";
import TemplateSelector from "./TemplateSelector.vue";
import CustomizationPanel from "./CustomizationPanel.vue";
import PreviewContent from "./PreviewContent.vue";

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "export-success", format: string, filename: string): void;
}>();

const { t } = useI18n();
const resumeStore = useResumeStore();
const { exportResume } = useExport();
const isMobile = useMediaQuery("(max-width: 768px)");

// États locaux
const availableFormats = [
  {
    id: "json",
    label: t("ui.export.formats.json.label"),
    description: t("ui.export.formats.json.description"),
  },
  {
    id: "html",
    label: t("ui.export.formats.html.label"),
    description: t("ui.export.formats.html.description"),
  },
  {
    id: "pdf",
    label: t("ui.export.formats.pdf.label"),
    description: t("ui.export.formats.pdf.description"),
  },
];

const steps = [
  { id: "format", label: t("ui.export.steps.format.label") },
  { id: "template", label: t("ui.export.steps.template.label") },
  { id: "customize", label: t("ui.export.steps.customize.label") },
  { id: "preview", label: t("ui.export.steps.preview.label") },
];

const selectedFormat = ref("json");
const selectedTemplate = ref("");
const customization = ref({});
const currentStep = ref("format");
const isPreviewLoading = ref(false);
const isExporting = ref(false);
const resumeData = computed(() => resumeStore.resume);

// Étapes visibles selon le format
const visibleSteps = computed(() => {
  if (selectedFormat.value === "json") {
    return [steps[0], steps[3]]; // Seulement format et prévisualisation
  }
  return steps; // Toutes les étapes pour HTML et PDF
});

// Déterminer l'index actuel dans les étapes visibles
const currentStepIndex = computed(() => {
  return visibleSteps.value.findIndex((step) => step.id === currentStep.value);
});

// Templates désactivés selon le format
const disabledTemplates = computed(() => {
  // Dans une implémentation réelle, on pourrait avoir des templates
  // spécifiques à certains formats
  return [];
});

// Navigation possible
const canGoNext = computed(() => {
  if (currentStep.value === "format") {
    return !!selectedFormat.value;
  }
  if (currentStep.value === "template") {
    return !!selectedTemplate.value;
  }
  return true;
});

const canGoBack = computed(() => {
  return currentStepIndex.value > 0;
});

// Chargement initial
onMounted(() => {
  // Réinitialiser à l'étape initiale quand le modal s'ouvre
  if (props.isVisible) {
    currentStep.value = "format";
  }
});

// Réagir aux changements de format
watch(selectedFormat, (newFormat) => {
  // Ajuster l'étape suivante en fonction du format
  if (newFormat === "json") {
    // Pour JSON, passer directement à la prévisualisation
    selectedTemplate.value = "default"; // Template par défaut pour JSON
  }
});

// Sélectionner un format
function selectFormat(format: string) {
  selectedFormat.value = format;
}

// Navigation entre les étapes
function nextStep() {
  const nextIndex = currentStepIndex.value + 1;
  if (nextIndex < visibleSteps.value.length) {
    currentStep.value = visibleSteps.value[nextIndex].id;

    // Si on passe à la prévisualisation, charger l'aperçu
    if (currentStep.value === "preview") {
      loadPreview();
    }
  }
}

function previousStep() {
  const prevIndex = currentStepIndex.value - 1;
  if (prevIndex >= 0) {
    currentStep.value = visibleSteps.value[prevIndex].id;
  }
}

function goToStep(index: number) {
  // Ne permettre d'aller qu'aux étapes précédentes ou actuelle
  if (index <= currentStepIndex.value) {
    currentStep.value = visibleSteps.value[index].id;
  }
}

// Charger la prévisualisation
async function loadPreview() {
  isPreviewLoading.value = true;

  try {
    // Dans une implémentation réelle, on générerait la prévisualisation
    // via les services appropriés
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulation
  } catch (error) {
    console.error("Error loading preview:", error);
    // Afficher un message d'erreur
  } finally {
    isPreviewLoading.value = false;
  }
}

// Exporter le CV
async function exportResume() {
  isExporting.value = true;

  try {
    const exportOptions = {
      format: selectedFormat.value,
      templateId: selectedTemplate.value,
      customization: customization.value,
    };

    const result = await exportResume(resumeData.value, exportOptions);

    emit("export-success", selectedFormat.value, result.filename);
    close();
  } catch (error) {
    console.error("Export error:", error);
    // Afficher un message d'erreur
  } finally {
    isExporting.value = false;
  }
}

// Fermer le modal
function close() {
  emit("close");
}
</script>
```

### Composant de prévisualisation

```vue
<!-- src/ui/components/export/PreviewContent.vue -->
<template>
  <div class="preview-content">
    <!-- Prévisualisation JSON -->
    <div v-if="format === 'json'" class="preview-json">
      <pre><code>{{ formattedJson }}</code></pre>
    </div>

    <!-- Prévisualisation HTML -->
    <div v-else-if="format === 'html'" class="preview-html">
      <iframe
        ref="htmlPreview"
        class="preview-iframe"
        sandbox="allow-same-origin"
        :srcdoc="htmlContent"
      ></iframe>
    </div>

    <!-- Prévisualisation PDF -->
    <div v-else-if="format === 'pdf'" class="preview-pdf">
      <object
        v-if="pdfUrl"
        :data="pdfUrl"
        type="application/pdf"
        class="preview-pdf-object"
      >
        <p>{{ $t("ui.export.pdfViewerNotSupported") }}</p>
        <a :href="pdfUrl" target="_blank">{{ $t("ui.export.openInNewTab") }}</a>
      </object>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  format: string;
  template: string;
  customization: any;
  resumeData: any;
}>();

const { t } = useI18n();

const htmlContent = ref("");
const pdfUrl = ref("");
const htmlPreview = ref<HTMLIFrameElement | null>(null);

// Formatter le JSON pour l'affichage
const formattedJson = computed(() => {
  return JSON.stringify(props.resumeData, null, 2);
});

// Générer le contenu HTML ou PDF selon le format
watch(
  [() => props.format, () => props.template, () => props.customization],
  async () => {
    generatePreview();
  },
  { immediate: true }
);

// Générer la prévisualisation
async function generatePreview() {
  if (props.format === "html") {
    await generateHtmlPreview();
  } else if (props.format === "pdf") {
    await generatePdfPreview();
  }
}

// Générer la prévisualisation HTML
async function generateHtmlPreview() {
  try {
    // Dans une implémentation réelle, appeler le service de génération HTML
    // const htmlService = new HtmlExportService();
    // htmlContent.value = await htmlService.generateHtml(props.resumeData, props.template, props.customization);

    // Simulation pour cet exemple
    await new Promise((resolve) => setTimeout(resolve, 500));
    htmlContent.value = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CV Preview</title>
        <style>
          body { font-family: Arial; }
          h1 { color: ${props.customization.colors?.primary || "#2563EB"}; }
          /* Plus de styles seraient générés en fonction de la personnalisation */
        </style>
      </head>
      <body>
        <h1>${props.resumeData.basics?.name || "John Doe"}</h1>
        <p>${props.resumeData.basics?.label || "Web Developer"}</p>
        <!-- Plus de contenu serait généré ici -->
      </body>
      </html>
    `;
  } catch (error) {
    console.error("Error generating HTML preview:", error);
    htmlContent.value = `<p>${t("ui.export.previewError")}</p>`;
  }
}

// Générer la prévisualisation PDF
async function generatePdfPreview() {
  try {
    // Dans une implémentation réelle, appeler le service de génération PDF
    // const pdfService = new PdfExportService();
    // const pdfBlob = await pdfService.generatePdf(props.resumeData, props.template, props.customization);
    // pdfUrl.value = URL.createObjectURL(pdfBlob);

    // Simulation pour cet exemple
    await new Promise((resolve) => setTimeout(resolve, 800));
    pdfUrl.value = "/sample-cv.pdf"; // URL vers un PDF exemple
  } catch (error) {
    console.error("Error generating PDF preview:", error);
    pdfUrl.value = "";
  }
}

// Nettoyer les ressources à la destruction du composant
onUnmounted(() => {
  if (pdfUrl.value && pdfUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(pdfUrl.value);
  }
});
</script>
```

### Service d'exportation

```typescript
// src/composables/useExport.ts
import { ref } from "vue";
import { useResumeStore } from "@/modules/cv/presentation/stores/resume";
import { useNotification } from "@/composables/useNotification";

export function useExport() {
  const resumeStore = useResumeStore();
  const { showSuccess, showError } = useNotification();

  const isExporting = ref(false);

  /**
   * Exporte le CV dans le format spécifié
   */
  async function exportResume(
    resumeData: any,
    options: {
      format: string;
      templateId?: string;
      customization?: any;
    }
  ) {
    isExporting.value = true;

    try {
      const { format, templateId = "default", customization = {} } = options;

      let result;

      if (format === "json") {
        result = await exportJson(resumeData);
      } else if (format === "html") {
        result = await exportHtml(resumeData, templateId, customization);
      } else if (format === "pdf") {
        result = await exportPdf(resumeData, templateId, customization);
      } else {
        throw new Error(`Unsupported export format: ${format}`);
      }

      showSuccess(
        format === "json"
          ? "ui.export.success.json"
          : format === "html"
          ? "ui.export.success.html"
          : "ui.export.success.pdf"
      );

      return result;
    } catch (error) {
      console.error("Export error:", error);
      showError("ui.export.error");
      throw error;
    } finally {
      isExporting.value = false;
    }
  }

  /**
   * Exporte le CV au format JSON
   */
  async function exportJson(resumeData: any) {
    // Convertir les données en JSON
    const jsonContent = JSON.stringify(resumeData, null, 2);

    // Créer un Blob et le télécharger
    const blob = new Blob([jsonContent], { type: "application/json" });
    const filename = `cv_${Date.now()}.json`;

    downloadBlob(blob, filename);

    return { success: true, filename };
  }

  /**
   * Exporte le CV au format HTML
   */
  async function exportHtml(
    resumeData: any,
    templateId: string,
    customization: any
  ) {
    // Dans une implémentation réelle, utiliser le service d'export HTML
    // const htmlExportService = new HtmlExportService();
    // const htmlContent = await htmlExportService.generateHtml(resumeData, templateId, customization);

    // Simulation pour cet exemple
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const htmlContent = `<!DOCTYPE html><html>...</html>`;

    // Créer un Blob et le télécharger
    const blob = new Blob([htmlContent], { type: "text/html" });
    const filename = `cv_${Date.now()}.html`;

    downloadBlob(blob, filename);

    return { success: true, filename };
  }

  /**
   * Exporte le CV au format PDF
   */
  async function exportPdf(
    resumeData: any,
    templateId: string,
    customization: any
  ) {
    // Dans une implémentation réelle, utiliser le service d'export PDF
    // const pdfExportService = new PdfExportService();
    // const pdfBlob = await pdfExportService.generatePdf(resumeData, templateId, customization);

    // Simulation pour cet exemple
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const pdfBlob = new Blob(["PDF content"], { type: "application/pdf" });
    const filename = `cv_${Date.now()}.pdf`;

    downloadBlob(pdfBlob, filename);

    return { success: true, filename };
  }

  /**
   * Télécharge un Blob en tant que fichier
   */
  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return {
    exportResume,
    isExporting,
  };
}
```
