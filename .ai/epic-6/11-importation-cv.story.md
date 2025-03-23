# Epic-6: CV Export et sauvegarde

Story-11: Importation de CV

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** pouvoir importer un CV depuis un fichier JSON ou un service externe  
**afin de** récupérer des données existantes sans avoir à tout ressaisir

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. L'importation est le complément naturel de l'exportation, permettant aux utilisateurs de charger des données précédemment exportées ou provenant d'autres services.

L'importation devra principalement supporter le format JSON Resume, qui est devenu un standard de facto dans le domaine, tout en prévoyant des extensions futures pour d'autres formats ou services (LinkedIn, Indeed, etc.).

## Estimation

Story Points: 3

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur sur la page d'accueil, quand il clique sur "Importer un CV", alors une interface modale s'ouvre avec les options d'importation disponibles
2. ✅ Étant donné un utilisateur dans l'interface d'importation, quand il sélectionne un fichier JSON valide, alors le système analyse et valide le fichier selon le standard JSON Resume
3. ✅ Étant donné un utilisateur ayant importé un fichier JSON valide, quand le système a terminé l'analyse, alors un aperçu des données à importer est affiché avec les sections qui seront créées ou mises à jour
4. ✅ Étant donné un utilisateur visualisant l'aperçu d'importation, quand il confirme l'importation, alors les données sont correctement intégrées dans l'application et le CV est mis à jour
5. ✅ Étant donné un utilisateur tentant d'importer un fichier invalide ou corrompu, quand le système détecte une erreur, alors un message clair explique le problème et propose des solutions

## Tâches

1. - [ ] Concevoir l'interface d'importation

   1. - [ ] Créer les maquettes UI/UX pour le modal d'importation
   2. - [ ] Définir le flux utilisateur pour l'importation (sélection, validation, aperçu, confirmation)
   3. - [ ] Concevoir l'affichage des erreurs et des avertissements

2. - [ ] Développer le service d'importation JSON

   1. - [ ] Créer le validateur de schéma JSON Resume
   2. - [ ] Implémenter le parser pour transformer le JSON en entités du domaine
   3. - [ ] Développer la gestion des versions du schéma JSON Resume

3. - [ ] Implémenter l'aperçu des données

   1. - [ ] Créer le composant d'aperçu des sections à importer
   2. - [ ] Développer la comparaison entre données existantes et données importées
   3. - [ ] Ajouter la possibilité de sélectionner les sections à importer

4. - [ ] Développer l'intégration avec l'application

   1. - [ ] Créer le service de fusion des données importées avec les données existantes
   2. - [ ] Implémenter la gestion des conflits de données
   3. - [ ] Ajouter la persistance des données importées

5. - [ ] Optimiser l'expérience utilisateur
   1. - [ ] Ajouter le drag & drop pour les fichiers
   2. - [ ] Implémenter des messages d'erreur détaillés et actionnables
   3. - [ ] Ajouter des exemples et un guide d'importation

## Avancement

### 2024-05-23 - Conception du service d'importation

Nous avons conçu l'architecture du service d'importation avec les caractéristiques suivantes:

1. **Structure modulaire**:

   - Module de validation (vérifie la conformité au schéma JSON Resume)
   - Module de transformation (convertit le JSON en entités du domaine)
   - Module de fusion (intègre les données importées avec les données existantes)
   - Module de résolution de conflits (gère les conflits entre données existantes et importées)

2. **Approche par étapes**:

   - Étape 1: Validation technique du fichier (format JSON valide)
   - Étape 2: Validation structurelle (conformité au schéma JSON Resume)
   - Étape 3: Analyse et prévisualisation (mapping vers le modèle interne)
   - Étape 4: Confirmation et intégration (fusion avec données existantes)

3. **Gestion des erreurs**:
   - Erreurs de format (JSON mal formé)
   - Erreurs de schéma (structure non conforme au standard)
   - Erreurs sémantiques (données valides mais incohérentes)
   - Résolution intelligente pour les erreurs mineures

## Principes de Développement

#### Principes à Suivre

- **Robustesse** : Gérer tous les cas d'erreur possibles avec des messages clairs et actionnables
- **Transparence** : Montrer clairement quelles données seront importées et modifiées
- **Cohérence** : Maintenir l'intégrité des données lors de l'importation
- **Récupération** : Permettre à l'utilisateur de corriger facilement les erreurs détectées
- **Progressivité** : Guider l'utilisateur à travers un processus d'importation étape par étape

#### À Éviter

- Importation silencieuse sans aperçu des modifications
- Messages d'erreur techniques incompréhensibles pour l'utilisateur
- Remplacement automatique des données sans confirmation
- Interfaces complexes avec trop d'options simultanées
- Validations bloquantes là où des avertissements suffiraient

## Risques et Hypothèses

| Risque                                               | Probabilité | Impact | Mitigation                                                               |
| ---------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------ |
| Fichiers JSON mal formés ou corrompus                | Élevée      | Moyen  | Validation robuste et messages d'erreur détaillés et actionnables        |
| Incompatibilité entre versions du schéma JSON Resume | Moyenne     | Élevé  | Support de plusieurs versions et conversion automatique si possible      |
| Perte de données existantes lors de l'importation    | Basse       | Élevé  | Prévisualisation obligatoire et confirmation explicite des remplacements |
| Importation de données incomplètes ou incorrectes    | Élevée      | Moyen  | Validation sémantique et suggestions de correction                       |
| Confusion utilisateur sur le processus d'importation | Moyenne     | Moyen  | Interface guidée étape par étape et documentation claire                 |

## Notes de Développement

### Service d'importation

```typescript
// src/modules/import/application/services/ImportService.ts
import { injectable, inject } from "inversify";
import { Resume } from "@/modules/cv/domain/entities/Resume";
import { ResumeRepository } from "@/modules/cv/domain/repositories/ResumeRepository";
import { JsonSchemaValidator } from "../validators/JsonSchemaValidator";
import { JsonResumeMapper } from "../mappers/JsonResumeMapper";
import { ImportResult, SectionImportStatus } from "../models/ImportResult";
import { TYPES } from "@/core/di/types";

@injectable()
export class ImportService {
  constructor(
    @inject(TYPES.ResumeRepository) private resumeRepository: ResumeRepository,
    @inject(TYPES.JsonSchemaValidator) private validator: JsonSchemaValidator,
    @inject(TYPES.JsonResumeMapper) private mapper: JsonResumeMapper
  ) {}

  /**
   * Analyse un fichier JSON et retourne un aperçu de l'importation
   * sans effectuer l'importation réelle
   */
  async analyzeJsonFile(file: File): Promise<ImportResult> {
    try {
      // Lire le contenu du fichier
      const content = await this.readFileAsText(file);

      // Valider le format JSON
      let jsonData: any;
      try {
        jsonData = JSON.parse(content);
      } catch (error) {
        return {
          success: false,
          errors: [
            {
              code: "INVALID_JSON",
              message: "Le fichier n'est pas un JSON valide",
              details: (error as Error).message,
            },
          ],
          sections: [],
        };
      }

      // Valider la structure selon le schéma JSON Resume
      const validationResult = this.validator.validate(jsonData);
      if (!validationResult.valid) {
        return {
          success: false,
          errors: validationResult.errors.map((err) => ({
            code: "SCHEMA_ERROR",
            message: `Erreur de schéma: ${err.message}`,
            path: err.path,
          })),
          sections: [],
        };
      }

      // Mapper le JSON en modèle interne pour l'aperçu
      const importPreview = this.mapper.mapToPreview(jsonData);

      // Récupérer le CV actuel pour comparer
      const currentResume = await this.resumeRepository.getCurrentResume();

      // Analyser les sections qui seront importées
      const sectionStatuses = this.analyzeSections(
        currentResume,
        importPreview
      );

      return {
        success: true,
        jsonData, // Données JSON validées
        importPreview, // Modèle interne mappé
        sections: sectionStatuses, // Statut des sections
        warnings: validationResult.warnings || [], // Éventuels avertissements
      };
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            code: "IMPORT_ERROR",
            message: "Une erreur est survenue lors de l'analyse du fichier",
            details: (error as Error).message,
          },
        ],
        sections: [],
      };
    }
  }

  /**
   * Effectue l'importation réelle des données validées
   */
  async importJsonResume(
    jsonData: any,
    selectedSections: string[] = []
  ): Promise<Resume> {
    try {
      // Récupérer le CV actuel
      const currentResume = await this.resumeRepository.getCurrentResume();

      // Mapper le JSON en entité Resume
      const importedResume = this.mapper.mapToEntity(jsonData);

      // Si des sections spécifiques sont sélectionnées,
      // ne fusionner que ces sections
      let mergedResume: Resume;

      if (selectedSections.length > 0) {
        mergedResume = { ...currentResume };
        selectedSections.forEach((section) => {
          // @ts-ignore - Section dynamique
          if (importedResume[section]) {
            // @ts-ignore - Section dynamique
            mergedResume[section] = importedResume[section];
          }
        });
      } else {
        // Sinon, fusionner toutes les sections non vides du CV importé
        mergedResume = {
          ...currentResume,
          ...Object.entries(importedResume).reduce((acc, [key, value]) => {
            // Ne remplacer les sections que si elles ne sont pas vides
            if (value && (Array.isArray(value) ? value.length > 0 : true)) {
              // @ts-ignore - Section dynamique
              acc[key] = value;
            }
            return acc;
          }, {} as Partial<Resume>),
        };
      }

      // Sauvegarder le CV fusionné
      await this.resumeRepository.saveResume(mergedResume);

      return mergedResume;
    } catch (error) {
      console.error("Error importing resume:", error);
      throw new Error(`L'importation a échoué: ${(error as Error).message}`);
    }
  }

  /**
   * Analyse les différences entre le CV actuel et celui à importer
   */
  private analyzeSections(
    currentResume: Resume,
    importedResume: Partial<Resume>
  ): SectionImportStatus[] {
    return Object.entries(importedResume)
      .map(([section, value]) => {
        // Ignorer les propriétés non-sections
        if (typeof value === "string" || typeof value === "number") {
          return null;
        }

        // @ts-ignore - Section dynamique
        const currentSection = currentResume[section];
        const hasExistingData =
          currentSection &&
          (Array.isArray(currentSection)
            ? currentSection.length > 0
            : Object.keys(currentSection).length > 0);

        const hasImportData =
          value &&
          (Array.isArray(value)
            ? value.length > 0
            : Object.keys(value).length > 0);

        return {
          section,
          status: !hasExistingData ? "new" : hasImportData ? "update" : "skip",
          currentItems: Array.isArray(currentSection)
            ? currentSection.length
            : 1,
          importItems: Array.isArray(value) ? value.length : 1,
        };
      })
      .filter(Boolean) as SectionImportStatus[];
  }

  /**
   * Lit un fichier comme texte
   */
  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
      reader.readAsText(file);
    });
  }
}
```

### Composant d'importation

```vue
<!-- src/ui/components/import/ImportModal.vue -->
<template>
  <div v-if="isVisible" class="import-modal">
    <div class="import-modal__container">
      <header class="import-modal__header">
        <h2>{{ $t("ui.import.title") }}</h2>
        <button class="btn-close" @click="close">
          <span class="icon-close"></span>
        </button>
      </header>

      <div class="import-modal__content">
        <!-- Étape 1: Sélection du fichier -->
        <div v-if="currentStep === 'select'" class="import-step">
          <h3>{{ $t("ui.import.steps.select.title") }}</h3>
          <p>{{ $t("ui.import.steps.select.description") }}</p>

          <div
            class="file-drop-area"
            :class="{ 'is-dragover': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop($event)"
          >
            <div class="file-drop-content">
              <div class="file-icon">
                <span class="icon-upload"></span>
              </div>
              <p>{{ $t("ui.import.dropFileHere") }}</p>
              <p>{{ $t("ui.import.or") }}</p>
              <label class="btn btn-primary">
                {{ $t("ui.import.browseFiles") }}
                <input
                  type="file"
                  accept="application/json"
                  @change="handleFileSelect"
                  class="visually-hidden"
                />
              </label>
            </div>
          </div>

          <div class="format-info">
            <h4>{{ $t("ui.import.supportedFormats") }}</h4>
            <ul>
              <li>
                <strong>JSON Resume</strong> -
                <a href="https://jsonresume.org/schema/" target="_blank">
                  {{ $t("ui.import.learnMore") }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Étape 2: Analyse et validation -->
        <div v-else-if="currentStep === 'analyze'" class="import-step">
          <h3>{{ $t("ui.import.steps.analyze.title") }}</h3>

          <div
            class="analysis-container"
            :class="{ 'is-loading': isAnalyzing }"
          >
            <div v-if="isAnalyzing" class="analysis-loader">
              <div class="spinner"></div>
              <p>{{ $t("ui.import.analyzing") }}</p>
            </div>

            <template v-else-if="analysisError">
              <div class="analysis-error">
                <span class="icon-error"></span>
                <h4>{{ analysisError.message }}</h4>
                <p v-if="analysisError.details">{{ analysisError.details }}</p>

                <div class="error-actions">
                  <button
                    class="btn btn-secondary"
                    @click="currentStep = 'select'"
                  >
                    {{ $t("ui.import.tryAnotherFile") }}
                  </button>
                </div>
              </div>
            </template>

            <template v-else-if="analysisResult?.success">
              <div class="analysis-success">
                <span class="icon-check"></span>
                <h4>{{ $t("ui.import.fileIsValid") }}</h4>

                <div class="import-sections">
                  <h5>{{ $t("ui.import.sectionsToImport") }}</h5>

                  <div
                    v-for="section in analysisResult.sections"
                    :key="section.section"
                    class="section-row"
                  >
                    <div class="section-info">
                      <div
                        class="section-status"
                        :class="`status-${section.status}`"
                      >
                        <span
                          :class="
                            section.status === 'new'
                              ? 'icon-plus'
                              : section.status === 'update'
                              ? 'icon-refresh'
                              : 'icon-skip'
                          "
                        ></span>
                      </div>
                      <div class="section-details">
                        <h6>{{ $t(`ui.sections.${section.section}`) }}</h6>
                        <p v-if="section.status === 'new'">
                          {{
                            $t("ui.import.newSection", {
                              count: section.importItems,
                            })
                          }}
                        </p>
                        <p v-else-if="section.status === 'update'">
                          {{
                            $t("ui.import.replaceItems", {
                              current: section.currentItems,
                              imported: section.importItems,
                            })
                          }}
                        </p>
                        <p v-else>
                          {{ $t("ui.import.noChanges") }}
                        </p>
                      </div>
                    </div>

                    <div class="section-action">
                      <label class="checkbox">
                        <input
                          type="checkbox"
                          :checked="selectedSections.includes(section.section)"
                          @change="toggleSection(section.section)"
                          :disabled="section.status === 'skip'"
                        />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div
                  v-if="analysisResult.warnings?.length"
                  class="import-warnings"
                >
                  <h5>{{ $t("ui.import.warnings") }}</h5>
                  <ul>
                    <li
                      v-for="(warning, index) in analysisResult.warnings"
                      :key="index"
                    >
                      {{ warning.message }}
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Étape 3: Importation en cours -->
        <div v-else-if="currentStep === 'import'" class="import-step">
          <h3>{{ $t("ui.import.steps.import.title") }}</h3>

          <div class="import-progress">
            <div class="spinner"></div>
            <p>{{ $t("ui.import.importing") }}</p>
          </div>
        </div>

        <!-- Étape 4: Importation terminée -->
        <div v-else-if="currentStep === 'complete'" class="import-step">
          <div class="import-complete">
            <span class="icon-success"></span>
            <h3>{{ $t("ui.import.importComplete") }}</h3>
            <p>
              {{
                $t("ui.import.sectionsImported", { count: importedSections })
              }}
            </p>

            <div class="complete-actions">
              <button class="btn btn-primary" @click="goToResume">
                {{ $t("ui.import.viewResume") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Barre d'actions -->
      <footer class="import-modal__footer">
        <button
          v-if="currentStep === 'analyze'"
          class="btn btn-secondary"
          @click="currentStep = 'select'"
        >
          {{ $t("ui.import.back") }}
        </button>

        <div class="footer-right">
          <button
            v-if="currentStep === 'analyze'"
            class="btn btn-primary"
            :disabled="!canImport"
            @click="startImport"
          >
            {{ $t("ui.import.importSelected") }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useImportService } from "@/composables/useImportService";

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "import-complete"): void;
}>();

const { t } = useI18n();
const router = useRouter();
const { analyzeJsonFile, importJsonResume } = useImportService();

// États locaux
const currentStep = ref("select");
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);
const isAnalyzing = ref(false);
const analysisResult = ref<any>(null);
const analysisError = ref<any>(null);
const selectedSections = ref<string[]>([]);
const importedSections = ref(0);

// Vérifier si l'importation est possible
const canImport = computed(() => {
  return analysisResult.value?.success && selectedSections.value.length > 0;
});

// Gérer la sélection de fichier via le bouton
function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
    analyzeFile(selectedFile.value);
  }
}

// Gérer le glisser-déposer de fichier
function handleFileDrop(event: DragEvent) {
  isDragging.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    selectedFile.value = event.dataTransfer.files[0];
    analyzeFile(selectedFile.value);
  }
}

// Analyser le fichier sélectionné
async function analyzeFile(file: File) {
  if (!file || file.type !== "application/json") {
    analysisError.value = {
      message: t("ui.import.errors.invalidFileType"),
      details: t("ui.import.errors.jsonRequired"),
    };
    currentStep.value = "analyze";
    return;
  }

  currentStep.value = "analyze";
  isAnalyzing.value = true;
  analysisResult.value = null;
  analysisError.value = null;
  selectedSections.value = [];

  try {
    const result = await analyzeJsonFile(file);
    analysisResult.value = result;

    if (result.success) {
      // Présélectionner toutes les sections nouvelles ou à mettre à jour
      selectedSections.value = result.sections
        .filter((s) => s.status !== "skip")
        .map((s) => s.section);
    } else {
      analysisError.value = result.errors?.[0] || {
        message: t("ui.import.errors.unknownError"),
      };
    }
  } catch (error) {
    analysisError.value = {
      message: t("ui.import.errors.analysisError"),
      details: (error as Error).message,
    };
  } finally {
    isAnalyzing.value = false;
  }
}

// Activer/désactiver une section pour l'importation
function toggleSection(section: string) {
  if (selectedSections.value.includes(section)) {
    selectedSections.value = selectedSections.value.filter(
      (s) => s !== section
    );
  } else {
    selectedSections.value.push(section);
  }
}

// Démarrer le processus d'importation
async function startImport() {
  currentStep.value = "import";

  try {
    await importJsonResume(
      analysisResult.value.jsonData,
      selectedSections.value
    );

    importedSections.value = selectedSections.value.length;
    currentStep.value = "complete";
    emit("import-complete");
  } catch (error) {
    console.error("Import error:", error);
    // Revenir à l'étape d'analyse avec message d'erreur
    currentStep.value = "analyze";
    analysisError.value = {
      message: t("ui.import.errors.importError"),
      details: (error as Error).message,
    };
  }
}

// Aller vers la page du CV
function goToResume() {
  router.push("/builder");
  close();
}

// Fermer le modal
function close() {
  emit("close");
}
</script>
```
