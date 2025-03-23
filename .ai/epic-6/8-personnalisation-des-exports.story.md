# Epic-6: CV Export et sauvegarde

Story-8: Personnalisation des exports

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** pouvoir personnaliser l'apparence de mes exports HTML et PDF  
**afin de** créer un CV qui reflète ma personnalité et s'adapte au contexte de ma candidature

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. Elle se concentre sur les options de personnalisation que les utilisateurs pourront appliquer aux exports HTML et PDF, au-delà du simple choix de template.

Cette fonctionnalité permet aux utilisateurs d'ajuster l'apparence de leur CV sans avoir à créer un template complet, en offrant des options comme le choix des couleurs, des polices, des marges, etc. Elle s'appuie sur le système de templates développé dans la Story-6.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur qui exporte son CV, quand il accède aux options de personnalisation, alors il peut modifier les couleurs principales du template
2. ✅ Étant donné un utilisateur qui personnalise son CV, quand il change les polices de caractères, alors ces modifications sont appliquées dans la prévisualisation en temps réel
3. ✅ Étant donné un utilisateur qui a défini des personnalisations, quand il exporte son CV, alors les modifications sont bien appliquées dans le fichier généré
4. ✅ Étant donné un utilisateur qui a défini des personnalisations, quand il change de template, alors les personnalisations compatibles sont reportées sur le nouveau template
5. ✅ Étant donné des options de personnalisation, quand l'utilisateur y accède, alors elles sont organisées de manière intuitive et cohérente

## Tâches

1. - [ ] Concevoir le système de personnalisation

   1. - [ ] Définir les catégories de personnalisation (couleurs, typographie, mise en page, etc.)
   2. - [ ] Identifier les éléments personnalisables communs à tous les templates
   3. - [ ] Mettre en place un système de variables CSS pour faciliter la personnalisation

2. - [ ] Développer l'interface de personnalisation

   1. - [ ] Créer les composants d'interface pour chaque type de personnalisation
   2. - [ ] Intégrer l'interface dans le modal d'exportation
   3. - [ ] Implémenter la prévisualisation en temps réel des modifications

3. - [ ] Implémenter le système de sauvegarde des personnalisations

   1. - [ ] Créer un modèle de données pour les personnalisations utilisateur
   2. - [ ] Développer la persistance des préférences de personnalisation
   3. - [ ] Permettre la réutilisation des personnalisations entre les templates

4. - [ ] Intégrer les personnalisations au processus d'exportation

   1. - [ ] Modifier le service d'exportation HTML pour appliquer les personnalisations
   2. - [ ] Adapter le service d'exportation PDF pour inclure les personnalisations
   3. - [ ] Assurer la cohérence visuelle entre les prévisualisations et les exports finaux

5. - [ ] Optimiser l'expérience utilisateur
   1. - [ ] Ajouter des thèmes prédéfinis pour faciliter la personnalisation rapide
   2. - [ ] Implémenter des validations pour éviter les combinaisons illisibles
   3. - [ ] Ajouter des conseils contextuels pour guider l'utilisateur

## Avancement

### 2024-05-21 - Conception du système de personnalisation

Nous avons défini l'architecture du système de personnalisation avec les fonctionnalités suivantes:

1. **Catégories de personnalisation**:

   - Couleurs (primaire, secondaire, accent, texte, fond)
   - Typographie (famille de police, taille, espacement)
   - Mise en page (marges, espacement des sections)
   - Style (bordures, ombres, icônes)

2. **Système de variables CSS**:

   ```css
   :root {
     /* Couleurs */
     --cv-color-primary: #2563eb;
     --cv-color-secondary: #1e40af;
     --cv-color-accent: #3b82f6;
     --cv-color-text: #1f2937;
     --cv-color-background: #ffffff;

     /* Typographie */
     --cv-font-heading: "Montserrat", sans-serif;
     --cv-font-body: "Open Sans", sans-serif;
     --cv-font-size-base: 16px;
     --cv-line-height: 1.5;

     /* Mise en page */
     --cv-spacing-unit: 8px;
     --cv-section-spacing: calc(var(--cv-spacing-unit) * 3);
     --cv-page-margin: calc(var(--cv-spacing-unit) * 4);

     /* Style */
     --cv-border-radius: 4px;
     --cv-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
   }
   ```

3. **Approche d'implémentation**:
   - Système modulaire permettant de personnaliser indépendamment chaque aspect
   - Mécanisme de validation pour garantir l'accessibilité (contraste, lisibilité)
   - Préréglages (presets) pour une personnalisation rapide et cohérente

## Principes de Développement

#### Principes à Suivre

- **Cohérence visuelle** : Assurer que les personnalisations préservent l'harmonie du design
- **Simplicité d'usage** : Rendre les options de personnalisation intuitives pour tous les utilisateurs
- **Prévisibilité** : Garantir que ce que l'utilisateur voit en prévisualisation est fidèle au résultat final
- **Accessibilité** : S'assurer que les personnalisations respectent les normes d'accessibilité
- **Performance** : Optimiser les rendus pour éviter les latences pendant la personnalisation

#### À Éviter

- Trop d'options qui rendraient l'interface complexe et intimidante
- Personnalisations qui compromettraient la lisibilité du CV
- Fonctionnalités qui fonctionneraient différemment entre les exports HTML et PDF
- Expérience lente ou saccadée lors de l'application des modifications
- Solutions qui ne seraient pas compatibles avec tous les templates

## Risques et Hypothèses

| Risque                                                | Probabilité | Impact | Mitigation                                                     |
| ----------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------- |
| Incompatibilité des personnalisations entre templates | Moyenne     | Élevé  | Définir un ensemble commun de variables applicables partout    |
| Problèmes de rendu entre prévisualisation et export   | Moyenne     | Élevé  | Utiliser le même moteur de rendu pour la prévisualisation      |
| Combinaisons de couleurs à faible contraste           | Élevée      | Moyen  | Intégrer un validateur de contraste WCAG                       |
| Performance lente sur les modifications en temps réel | Moyenne     | Moyen  | Optimiser le processus de rendu et débouncer les modifications |
| Complexité excessive pour l'utilisateur               | Moyenne     | Élevé  | Proposer des préréglages et une interface progressive          |

## Notes de Développement

### Interface de personnalisation

```vue
<!-- src/ui/components/export/CustomizationPanel.vue -->
<template>
  <div class="customization-panel">
    <div class="customization-panel__header">
      <h3>{{ $t("ui.export.customize.title") }}</h3>

      <!-- Sélecteur de préréglages -->
      <div class="preset-selector">
        <label for="preset-select"
          >{{ $t("ui.export.customize.presets") }}:</label
        >
        <select
          id="preset-select"
          v-model="selectedPreset"
          @change="applyPreset"
        >
          <option value="default">
            {{ $t("ui.export.customize.presets.default") }}
          </option>
          <option value="professional">
            {{ $t("ui.export.customize.presets.professional") }}
          </option>
          <option value="creative">
            {{ $t("ui.export.customize.presets.creative") }}
          </option>
          <option value="minimal">
            {{ $t("ui.export.customize.presets.minimal") }}
          </option>
          <option value="custom">
            {{ $t("ui.export.customize.presets.custom") }}
          </option>
        </select>
      </div>
    </div>

    <!-- Onglets de personnalisation -->
    <div class="customization-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ 'is-active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Contenu des onglets -->
    <div class="customization-content">
      <!-- Panneau des couleurs -->
      <div v-if="activeTab === 'colors'" class="tab-panel colors-panel">
        <div class="color-picker" v-for="color in colorOptions" :key="color.id">
          <label :for="`color-${color.id}`">{{ color.label }}</label>
          <div class="color-input-wrapper">
            <input
              :id="`color-${color.id}`"
              type="color"
              v-model="customization.colors[color.id]"
              @change="updateCustomization"
            />
            <input
              type="text"
              v-model="customization.colors[color.id]"
              @change="updateCustomization"
            />
          </div>
        </div>
      </div>

      <!-- Panneau de typographie -->
      <div v-if="activeTab === 'typography'" class="tab-panel typography-panel">
        <!-- Familles de polices -->
        <div class="form-group">
          <label for="heading-font">{{
            $t("ui.export.customize.typography.headingFont")
          }}</label>
          <select
            id="heading-font"
            v-model="customization.typography.headingFont"
            @change="updateCustomization"
          >
            <option
              v-for="font in fontOptions"
              :key="font.value"
              :value="font.value"
            >
              {{ font.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="body-font">{{
            $t("ui.export.customize.typography.bodyFont")
          }}</label>
          <select
            id="body-font"
            v-model="customization.typography.bodyFont"
            @change="updateCustomization"
          >
            <option
              v-for="font in fontOptions"
              :key="font.value"
              :value="font.value"
            >
              {{ font.label }}
            </option>
          </select>
        </div>

        <!-- Tailles de police -->
        <div class="form-group">
          <label for="base-size">{{
            $t("ui.export.customize.typography.baseSize")
          }}</label>
          <div class="range-input">
            <input
              id="base-size"
              type="range"
              min="12"
              max="20"
              step="1"
              v-model.number="customization.typography.baseSize"
              @change="updateCustomization"
            />
            <span>{{ customization.typography.baseSize }}px</span>
          </div>
        </div>

        <div class="form-group">
          <label for="line-height">{{
            $t("ui.export.customize.typography.lineHeight")
          }}</label>
          <div class="range-input">
            <input
              id="line-height"
              type="range"
              min="1"
              max="2"
              step="0.1"
              v-model.number="customization.typography.lineHeight"
              @change="updateCustomization"
            />
            <span>{{ customization.typography.lineHeight }}</span>
          </div>
        </div>
      </div>

      <!-- Panneau de mise en page -->
      <div v-if="activeTab === 'layout'" class="tab-panel layout-panel">
        <!-- Marges -->
        <div class="form-group">
          <label for="page-margin">{{
            $t("ui.export.customize.layout.pageMargin")
          }}</label>
          <div class="range-input">
            <input
              id="page-margin"
              type="range"
              min="8"
              max="48"
              step="4"
              v-model.number="customization.layout.pageMargin"
              @change="updateCustomization"
            />
            <span>{{ customization.layout.pageMargin }}px</span>
          </div>
        </div>

        <div class="form-group">
          <label for="section-spacing">{{
            $t("ui.export.customize.layout.sectionSpacing")
          }}</label>
          <div class="range-input">
            <input
              id="section-spacing"
              type="range"
              min="8"
              max="48"
              step="4"
              v-model.number="customization.layout.sectionSpacing"
              @change="updateCustomization"
            />
            <span>{{ customization.layout.sectionSpacing }}px</span>
          </div>
        </div>
      </div>

      <!-- Panneau de style -->
      <div v-if="activeTab === 'style'" class="tab-panel style-panel">
        <!-- Bordures -->
        <div class="form-group">
          <label for="border-radius">{{
            $t("ui.export.customize.style.borderRadius")
          }}</label>
          <div class="range-input">
            <input
              id="border-radius"
              type="range"
              min="0"
              max="16"
              step="1"
              v-model.number="customization.style.borderRadius"
              @change="updateCustomization"
            />
            <span>{{ customization.style.borderRadius }}px</span>
          </div>
        </div>

        <!-- Style d'ombre -->
        <div class="form-group">
          <label for="shadow-style">{{
            $t("ui.export.customize.style.shadow")
          }}</label>
          <select
            id="shadow-style"
            v-model="customization.style.shadow"
            @change="updateCustomization"
          >
            <option value="none">
              {{ $t("ui.export.customize.style.shadow.none") }}
            </option>
            <option value="light">
              {{ $t("ui.export.customize.style.shadow.light") }}
            </option>
            <option value="medium">
              {{ $t("ui.export.customize.style.shadow.medium") }}
            </option>
            <option value="strong">
              {{ $t("ui.export.customize.style.shadow.strong") }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { debounce } from "lodash-es";

const props = defineProps<{
  initialCustomization?: any;
  templateId: string;
}>();

const emit = defineEmits<{
  (e: "update:customization", value: any): void;
}>();

const { t } = useI18n();

// Tabs configuration
const tabs = [
  { id: "colors", label: t("ui.export.customize.tabs.colors") },
  { id: "typography", label: t("ui.export.customize.tabs.typography") },
  { id: "layout", label: t("ui.export.customize.tabs.layout") },
  { id: "style", label: t("ui.export.customize.tabs.style") },
];

const activeTab = ref("colors");
const selectedPreset = ref("default");

// Options for dropdowns
const colorOptions = [
  { id: "primary", label: t("ui.export.customize.colors.primary") },
  { id: "secondary", label: t("ui.export.customize.colors.secondary") },
  { id: "accent", label: t("ui.export.customize.colors.accent") },
  { id: "text", label: t("ui.export.customize.colors.text") },
  { id: "background", label: t("ui.export.customize.colors.background") },
];

const fontOptions = [
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Merriweather, serif", label: "Merriweather" },
  { value: "Georgia, serif", label: "Georgia" },
];

// Default values for each preset
const presets = {
  default: {
    colors: {
      primary: "#2563EB",
      secondary: "#1E40AF",
      accent: "#3B82F6",
      text: "#1F2937",
      background: "#FFFFFF",
    },
    typography: {
      headingFont: "Montserrat, sans-serif",
      bodyFont: "Open Sans, sans-serif",
      baseSize: 16,
      lineHeight: 1.5,
    },
    layout: {
      pageMargin: 32,
      sectionSpacing: 24,
    },
    style: {
      borderRadius: 4,
      shadow: "light",
    },
  },
  professional: {
    colors: {
      primary: "#0F172A",
      secondary: "#334155",
      accent: "#64748B",
      text: "#0F172A",
      background: "#F8FAFC",
    },
    typography: {
      headingFont: "Georgia, serif",
      bodyFont: "Roboto, sans-serif",
      baseSize: 16,
      lineHeight: 1.5,
    },
    layout: {
      pageMargin: 40,
      sectionSpacing: 32,
    },
    style: {
      borderRadius: 0,
      shadow: "none",
    },
  },
  // Autres préréglages...
};

// Current customization state
const customization = reactive(
  props.initialCustomization || JSON.parse(JSON.stringify(presets.default))
);

// Watch for template changes to adapt customization
watch(
  () => props.templateId,
  () => {
    // Dans une implémentation réelle, on ajusterait les personnalisations
    // en fonction des spécificités du template sélectionné
  }
);

// Apply a preset
function applyPreset() {
  if (selectedPreset.value === "custom") {
    return; // Garder les personnalisations actuelles
  }

  const preset = presets[selectedPreset.value as keyof typeof presets];
  Object.keys(preset).forEach((category) => {
    Object.keys(preset[category as keyof typeof preset]).forEach((key) => {
      customization[category][key] =
        preset[category as keyof typeof preset][key];
    });
  });

  updateCustomization();
}

// Update customization (debounced to avoid too many updates)
const updateCustomization = debounce(() => {
  // Valider les couleurs (vérifier le contraste, etc.)
  validateColors();

  // Définir comme personnalisé si ce n'est pas un préréglage standard
  if (selectedPreset.value !== "custom") {
    const currentPresetKey = selectedPreset.value as keyof typeof presets;
    const currentPreset = presets[currentPresetKey];

    let isCustomized = false;
    outer: for (const category in currentPreset) {
      for (const key in currentPreset[category as keyof typeof currentPreset]) {
        if (
          customization[category][key] !==
          currentPreset[category as keyof typeof currentPreset][key]
        ) {
          isCustomized = true;
          break outer;
        }
      }
    }

    if (isCustomized) {
      selectedPreset.value = "custom";
    }
  }

  // Émettre les changements
  emit("update:customization", JSON.parse(JSON.stringify(customization)));
}, 300);

// Validate color contrast
function validateColors() {
  // Dans une implémentation réelle, vérifier le contraste entre le texte et le fond
  // Ajuster si nécessaire pour garantir l'accessibilité
}
</script>
```

### Service d'application des personnalisations

```typescript
// src/export/infrastructure/services/CustomizationService.ts
import { Resume } from "@/cv/domain/entities/Resume";

export interface ResumeCustomization {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: number;
    lineHeight: number;
  };
  layout: {
    pageMargin: number;
    sectionSpacing: number;
  };
  style: {
    borderRadius: number;
    shadow: "none" | "light" | "medium" | "strong";
  };
}

export class CustomizationService {
  /**
   * Génère les variables CSS à partir des personnalisations
   */
  public generateCustomCss(customization: ResumeCustomization): string {
    const shadowValues = {
      none: "none",
      light: "0 1px 3px rgba(0, 0, 0, 0.1)",
      medium: "0 4px 6px rgba(0, 0, 0, 0.1)",
      strong: "0 10px 15px rgba(0, 0, 0, 0.1)",
    };

    return `
      :root {
        /* Couleurs */
        --cv-color-primary: ${customization.colors.primary};
        --cv-color-secondary: ${customization.colors.secondary};
        --cv-color-accent: ${customization.colors.accent};
        --cv-color-text: ${customization.colors.text};
        --cv-color-background: ${customization.colors.background};
        
        /* Typographie */
        --cv-font-heading: ${customization.typography.headingFont};
        --cv-font-body: ${customization.typography.bodyFont};
        --cv-font-size-base: ${customization.typography.baseSize}px;
        --cv-line-height: ${customization.typography.lineHeight};
        
        /* Mise en page */
        --cv-spacing-unit: 8px;
        --cv-section-spacing: ${customization.layout.sectionSpacing}px;
        --cv-page-margin: ${customization.layout.pageMargin}px;
        
        /* Style */
        --cv-border-radius: ${customization.style.borderRadius}px;
        --cv-box-shadow: ${shadowValues[customization.style.shadow]};
      }
    `;
  }

  /**
   * Applique les personnalisations au HTML généré
   */
  public applyCustomizationToHtml(
    html: string,
    customization: ResumeCustomization
  ): string {
    const customCss = this.generateCustomCss(customization);

    // Injecter les styles personnalisés dans le HTML
    return html.replace("</head>", `<style>${customCss}</style></head>`);
  }

  /**
   * Convertit les personnalisations pour un template spécifique
   * Utile lors du changement de template
   */
  public adaptCustomizationForTemplate(
    customization: ResumeCustomization,
    templateId: string
  ): ResumeCustomization {
    // Dans une implémentation réelle, cette méthode pourrait adapter
    // les personnalisations aux spécificités de chaque template

    // Pour cet exemple, on retourne simplement les personnalisations telles quelles
    return { ...customization };
  }
}
```
