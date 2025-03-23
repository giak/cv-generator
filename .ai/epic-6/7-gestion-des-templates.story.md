# Epic-6: CV Export et sauvegarde

Story-7: Gestion des templates

## Description de la Story

**En tant qu'** administrateur du CV Generator  
**Je veux** pouvoir gérer (ajouter, modifier, supprimer) les templates disponibles  
**afin d'** offrir une variété de designs adaptés aux besoins des utilisateurs

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. Elle se concentre sur la création d'un système de gestion administratif des templates qui permettra d'enrichir l'offre de designs disponibles pour les exports HTML et PDF.

La story s'appuie sur le système de templates développé dans la Story-6, en ajoutant les fonctionnalités nécessaires pour que les administrateurs puissent facilement ajouter, modifier ou supprimer des templates sans nécessiter de modifications directes du code de l'application.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. ✅ Étant donné un administrateur connecté, quand il accède à l'interface de gestion des templates, alors il peut voir la liste des templates existants
2. ✅ Étant donné un administrateur dans l'interface de gestion, quand il décide d'ajouter un nouveau template, alors il peut téléverser les fichiers nécessaires et définir les métadonnées
3. ✅ Étant donné un administrateur qui modifie un template, quand il sauvegarde ses changements, alors le template est mis à jour et disponible immédiatement pour les utilisateurs
4. ✅ Étant donné un administrateur qui supprime un template, quand il confirme la suppression, alors le template n'est plus disponible pour les nouveaux exports
5. ✅ Étant donné un template en cours d'utilisation, quand l'administrateur tente de le supprimer, alors un avertissement est affiché pour prévenir des conséquences

## Tâches

1. - [ ] Développer l'interface de gestion des templates

   1. - [ ] Créer la page d'administration des templates
   2. - [ ] Implémenter la liste des templates avec prévisualisation
   3. - [ ] Ajouter les contrôles pour ajouter, modifier et supprimer des templates

2. - [ ] Mettre en place le formulaire d'ajout/modification de template

   1. - [ ] Créer le formulaire de saisie des métadonnées (nom, description, etc.)
   2. - [ ] Implémenter le téléversement des fichiers du template (HTML, CSS, images)
   3. - [ ] Ajouter la validation des fichiers et métadonnées

3. - [ ] Implémenter les contrôles de sécurité

   1. - [ ] Limiter l'accès à l'interface de gestion aux administrateurs
   2. - [ ] Valider les fichiers téléversés pour éviter les failles de sécurité
   3. - [ ] Mettre en place un système de logs pour les actions effectuées

4. - [ ] Développer le système de stockage et déploiement des templates

   1. - [ ] Créer le service d'enregistrement des templates dans le système de fichiers
   2. - [ ] Mettre en place un mécanisme de rechargement des templates sans redémarrage
   3. - [ ] Implémenter un système de versionning des templates

5. - [ ] Ajouter les fonctionnalités de prévisualisation et test
   1. - [ ] Développer un système de prévisualisation des templates avec des données de test
   2. - [ ] Ajouter des validations automatiques pour s'assurer de la compatibilité des templates
   3. - [ ] Implémenter un système de débogage pour les templates

## Avancement

### 2024-05-21 - Conception de l'interface d'administration

Nous avons conçu l'interface d'administration des templates avec les fonctionnalités suivantes:

1. **Liste des templates**:

   - Affichage sous forme de grille avec prévisualisations
   - Indicateurs de statut (actif, en test, désactivé)
   - Filtres par catégorie, auteur, date d'ajout
   - Compteurs d'utilisation par template

2. **Formulaire d'édition**:

   - Champs pour les métadonnées (nom, description, auteur, version, etc.)
   - Interface de téléversement de fichiers avec validation en temps réel
   - Éditeur intégré pour les fichiers HTML et CSS
   - Système de tags pour la catégorisation

3. **Système de validation**:
   - Tests automatisés de compatibilité avec différents navigateurs
   - Vérification de la structure et des balises requises
   - Validation des performances et du poids des ressources

## Principes de Développement

#### Principes à Suivre

- **Sécurité avant tout**: Valider rigoureusement tous les fichiers téléversés
- **Expérience utilisateur**: Interface admin intuitive et efficace
- **Versionnement**: Conserver l'historique des modifications des templates
- **Documentation**: Documenter clairement le processus de création de templates
- **Testabilité**: Permettre de tester facilement les templates avec des données variées

#### À Éviter

- Permettre le téléversement de fichiers potentiellement dangereux (scripts, etc.)
- Interface trop complexe qui découragerait la création de nouveaux templates
- Rechargement de tous les templates lors d'une simple modification
- Suppression irréversible de templates qui pourraient encore être référencés
- Dupliquer les fichiers statiques entre différents templates

## Risques et Hypothèses

| Risque                                                   | Probabilité | Impact | Mitigation                                                   |
| -------------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------ |
| Failles de sécurité via téléversement de fichiers        | Moyenne     | Élevé  | Validation stricte des fichiers et isolation des templates   |
| Corruption de templates existants                        | Basse       | Élevé  | Système de versionnement et possibilité de rollback          |
| Confusion des utilisateurs face aux changements          | Moyenne     | Moyen  | Communication claire et prévisualisation avant publication   |
| Performance dégradée avec trop de templates              | Basse       | Moyen  | Optimisation du chargement et système de cache efficace      |
| Incompatibilité entre templates et structure des données | Moyenne     | Élevé  | Tests automatisés et validation lors de l'ajout/modification |

## Notes de Développement

### Interface d'administration des templates

```vue
<!-- src/ui/pages/admin/TemplatesManager.vue -->
<template>
  <div class="admin-templates">
    <header class="admin-templates__header">
      <h1>{{ $t("admin.templates.title") }}</h1>
      <button class="btn-primary" @click="createNewTemplate">
        {{ $t("admin.templates.addNew") }}
      </button>
    </header>

    <!-- Liste des templates -->
    <div class="admin-templates__list">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-item"
      >
        <div class="template-item__preview">
          <img :src="template.previewImage" :alt="template.name" />
          <div class="template-item__status" :class="template.status">
            {{ $t(`admin.templates.status.${template.status}`) }}
          </div>
        </div>

        <div class="template-item__info">
          <h3>{{ template.name }}</h3>
          <p>{{ template.description }}</p>
          <div class="template-item__meta">
            <span>{{ $t("admin.templates.by") }} {{ template.author }}</span>
            <span>v{{ template.version }}</span>
          </div>
        </div>

        <div class="template-item__actions">
          <button @click="editTemplate(template.id)">
            {{ $t("admin.actions.edit") }}
          </button>
          <button @click="previewTemplate(template.id)">
            {{ $t("admin.actions.preview") }}
          </button>
          <button class="btn-danger" @click="confirmDelete(template.id)">
            {{ $t("admin.actions.delete") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal pour l'édition de template -->
    <template-editor-modal
      v-if="showEditor"
      :template-id="editingTemplateId"
      @close="showEditor = false"
      @save="onTemplateSaved"
    />

    <!-- Modal de confirmation de suppression -->
    <confirm-modal
      v-if="showDeleteConfirm"
      :title="$t('admin.templates.deleteConfirmTitle')"
      :message="$t('admin.templates.deleteConfirmMessage')"
      @confirm="deleteTemplate"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useTemplateAdmin } from "@/composables/useTemplateAdmin";
import TemplateEditorModal from "@/ui/components/admin/TemplateEditorModal.vue";
import ConfirmModal from "@/ui/components/shared/ConfirmModal.vue";
import type { TemplateMetadata } from "@/export/infrastructure/services/TemplateManager";

const { t } = useI18n();
const {
  getAllTemplates,
  deleteTemplate: removeTemplate,
  createTemplate,
  getTemplateUsage,
} = useTemplateAdmin();

const templates = ref<(TemplateMetadata & { status: string })[]>([]);
const showEditor = ref(false);
const showDeleteConfirm = ref(false);
const editingTemplateId = ref<string | null>(null);
const templateToDelete = ref<string | null>(null);

onMounted(async () => {
  await loadTemplates();
});

async function loadTemplates() {
  try {
    const templatesList = await getAllTemplates();

    // Ajouter le statut à chaque template
    templates.value = await Promise.all(
      templatesList.map(async (template) => {
        const usage = await getTemplateUsage(template.id);

        // Déterminer le statut en fonction de propriétés ou d'usage
        let status = "active";
        if (template.metadata?.isTest) status = "testing";
        if (template.metadata?.isDisabled) status = "disabled";

        return {
          ...template,
          status,
          usageCount: usage.count,
        };
      })
    );
  } catch (error) {
    console.error("Error loading templates:", error);
    // Afficher un message d'erreur
  }
}

function createNewTemplate() {
  editingTemplateId.value = null;
  showEditor.value = true;
}

function editTemplate(id: string) {
  editingTemplateId.value = id;
  showEditor.value = true;
}

function previewTemplate(id: string) {
  // Ouvrir une prévisualisation du template
  // Implémentation à déterminer
}

function confirmDelete(id: string) {
  templateToDelete.value = id;
  showDeleteConfirm.value = true;
}

async function deleteTemplate() {
  if (!templateToDelete.value) return;

  try {
    await removeTemplate(templateToDelete.value);
    await loadTemplates();
    showDeleteConfirm.value = false;

    // Afficher un message de succès
  } catch (error) {
    console.error("Error deleting template:", error);
    // Afficher un message d'erreur
  }
}

async function onTemplateSaved() {
  showEditor.value = false;
  await loadTemplates();

  // Afficher un message de succès
}
</script>
```

### Service de gestion administrative des templates

```typescript
// src/export/infrastructure/services/TemplateAdminService.ts
// Note: Ce service serait simplifié en production et utiliserait des API backend
import { TemplateManager, TemplateMetadata } from "./TemplateManager";
import { writeFile, mkdir, rm, rename } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export interface TemplateUsage {
  count: number;
  lastUsed?: Date;
  users?: string[];
}

export class TemplateAdminService {
  private templateManager: TemplateManager;
  private templatesDir: string;

  constructor(templateManager: TemplateManager, templatesDir: string) {
    this.templateManager = templateManager;
    this.templatesDir = templatesDir;
  }

  /**
   * Crée un nouveau template
   */
  public async createTemplate(
    metadata: Omit<TemplateMetadata, "id">,
    files: {
      html: string;
      css: string;
      preview: Buffer;
    }
  ): Promise<string> {
    // Génération d'un ID unique
    const id = `template-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      // Créer le répertoire pour le nouveau template
      const templateDir = path.join(this.templatesDir, id);
      await mkdir(templateDir, { recursive: true });

      // Écrire les fichiers
      await writeFile(path.join(templateDir, "template.html"), files.html);
      await writeFile(path.join(templateDir, "styles.css"), files.css);
      await writeFile(path.join(templateDir, "preview.png"), files.preview);

      // Écrire les métadonnées
      await writeFile(
        path.join(templateDir, "metadata.json"),
        JSON.stringify(
          {
            ...metadata,
            id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );

      // Recharger les templates pour inclure le nouveau
      await this.templateManager.loadTemplates();

      return id;
    } catch (error) {
      console.error("Error creating template:", error);
      throw new Error("Failed to create template");
    }
  }

  /**
   * Met à jour un template existant
   */
  public async updateTemplate(
    id: string,
    metadata: Partial<TemplateMetadata>,
    files?: {
      html?: string;
      css?: string;
      preview?: Buffer;
    }
  ): Promise<void> {
    const templateDir = path.join(this.templatesDir, id);

    // Vérifier que le template existe
    if (!existsSync(templateDir)) {
      throw new Error(`Template "${id}" not found`);
    }

    try {
      // Mettre à jour les fichiers si fournis
      if (files) {
        if (files.html) {
          await writeFile(path.join(templateDir, "template.html"), files.html);
        }

        if (files.css) {
          await writeFile(path.join(templateDir, "styles.css"), files.css);
        }

        if (files.preview) {
          await writeFile(path.join(templateDir, "preview.png"), files.preview);
        }
      }

      // Mettre à jour les métadonnées
      const metadataPath = path.join(templateDir, "metadata.json");
      const currentMetadata = JSON.parse(await readFile(metadataPath, "utf-8"));

      await writeFile(
        metadataPath,
        JSON.stringify(
          {
            ...currentMetadata,
            ...metadata,
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );

      // Recharger les templates
      await this.templateManager.loadTemplates();
    } catch (error) {
      console.error(`Error updating template "${id}":`, error);
      throw new Error(`Failed to update template "${id}"`);
    }
  }

  /**
   * Supprime un template
   */
  public async deleteTemplate(id: string): Promise<void> {
    const templateDir = path.join(this.templatesDir, id);

    // Vérifier que le template existe
    if (!existsSync(templateDir)) {
      throw new Error(`Template "${id}" not found`);
    }

    // Vérifier l'usage du template avant suppression
    const usage = await this.getTemplateUsage(id);
    if (usage.count > 0) {
      // Option 1: Rejeter la suppression
      // throw new Error(`Cannot delete template "${id}" as it is being used`);

      // Option 2: Archive instead of delete
      const archiveDir = path.join(this.templatesDir, "_archived");
      await mkdir(archiveDir, { recursive: true });
      await rename(templateDir, path.join(archiveDir, id));
    } else {
      // Supprimer le répertoire du template
      await rm(templateDir, { recursive: true });
    }

    // Recharger les templates
    await this.templateManager.loadTemplates();
  }

  /**
   * Récupère les statistiques d'utilisation d'un template
   */
  public async getTemplateUsage(id: string): Promise<TemplateUsage> {
    // Cette implémentation est simplifiée et devrait être remplacée
    // par une vraie requête à la base de données dans un système réel

    // Simuler des statistiques d'utilisation
    return {
      count: Math.floor(Math.random() * 10),
      lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    };
  }
}
```
