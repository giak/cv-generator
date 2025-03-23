# Epic-6: CV Export et sauvegarde

Story-12: Gestion multi-CV

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** pouvoir créer, gérer et basculer entre plusieurs CV  
**afin de** maintenir différentes versions pour différents types de candidatures

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. La gestion de plusieurs CV est une extension naturelle des fonctionnalités de sauvegarde, permettant aux utilisateurs de maintenir différentes versions de leur CV adaptées à différents contextes professionnels.

Un utilisateur typique pourrait avoir besoin de maintenir plusieurs CV, par exemple un CV orienté développement web, un autre pour la gestion de projet, ou encore des versions spécifiques pour certains employeurs. Cette story implémente les fonctionnalités nécessaires pour créer, renommer, dupliquer, supprimer et basculer entre ces différentes versions.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur connecté, quand il accède à la page d'accueil, alors il voit la liste de tous ses CV sauvegardés
2. ✅ Étant donné un utilisateur avec au moins un CV enregistré, quand il clique sur "Créer un nouveau CV", alors un nouveau CV vide est créé et il est redirigé vers l'éditeur
3. ✅ Étant donné un utilisateur visualisant la liste de ses CV, quand il clique sur "Dupliquer" pour un CV existant, alors une copie est créée avec un nom indiquant qu'il s'agit d'une copie
4. ✅ Étant donné un utilisateur avec plusieurs CV, quand il clique sur "Supprimer" pour un CV, alors une confirmation est demandée et le CV est supprimé après confirmation
5. ✅ Étant donné un utilisateur éditant un CV, quand il clique sur "Basculer de CV", alors une liste de ses CV s'affiche et il peut en sélectionner un autre pour l'éditer

## Tâches

1. - [ ] Concevoir l'interface de gestion multi-CV
   1. - [ ] Créer les maquettes UI/UX pour la liste des CV
   2. - [ ] Concevoir le composant de sélection rapide de CV
   3. - [ ] Définir le flux utilisateur pour la création, duplication et suppression
2. - [ ] Développer le système de stockage

   1. - [ ] Étendre le modèle de données pour supporter plusieurs CV par utilisateur
   2. - [ ] Implémenter la persistance dans le LocalStorage pour les utilisateurs non connectés
   3. - [ ] Étendre le système de synchronisation avec le compte utilisateur

3. - [ ] Implémenter la gestion des CV

   1. - [ ] Développer les fonctionnalités de création de CV
   2. - [ ] Ajouter les fonctionnalités de renommage et duplication
   3. - [ ] Implémenter la suppression avec confirmation
   4. - [ ] Gérer les métadonnées des CV (date de modification, modèle, etc.)

4. - [ ] Mettre en place la navigation entre CV

   1. - [ ] Créer le composant de sélection de CV dans l'éditeur
   2. - [ ] Implémenter la sauvegarde automatique avant changement de CV
   3. - [ ] Gérer la transition entre les différents CV

5. - [ ] Optimiser l'expérience utilisateur
   1. - [ ] Ajouter des indicateurs visuels du CV actif
   2. - [ ] Implémenter des fonctionnalités de recherche et tri des CV
   3. - [ ] Ajouter un système de tags pour catégoriser les CV

## Avancement

### 2024-05-24 - Conception du système de gestion multi-CV

Nous avons conçu l'architecture du système de gestion multi-CV avec les caractéristiques suivantes:

1. **Structure de données**:

   - `ResumeMetadata` - informations sur chaque CV (id, nom, date de création, date de modification, tags)
   - `ResumeCollection` - collection de CV appartenant à un utilisateur
   - Système de versioning pour suivre les modifications

2. **Architecture de storage**:

   - Utilisateurs non connectés: LocalStorage avec indexation des CV
   - Utilisateurs connectés: Synchronisation avec le backend + fallback local
   - Gestion de conflits lors de la synchronisation

3. **Interface utilisateur**:
   - Dashboard de CV - vue en grille avec options par CV
   - Sélecteur de CV - menu déroulant accessible depuis l'éditeur
   - Assistant de création - pour faciliter la création de nouveaux CV

## Principes de Développement

#### Principes à Suivre

- **Non-destructivité** : Ne jamais supprimer de données sans confirmation explicite
- **Contexte clair** : Indiquer clairement quel CV est actuellement actif
- **Sauvegarde automatique** : Éviter la perte de données lors des transitions
- **Performance** : Optimiser le chargement et la sauvegarde des CV multiples
- **Extensibilité** : Permettre l'ajout futur de fonctionnalités de collaboration

#### À Éviter

- Transitions brusques entre CV sans sauvegarde préalable
- Interfaces confuses avec trop de CV sans organisation
- Duplication silencieuse créant des copies non intentionnelles
- Limites arbitraires sur le nombre de CV
- Metadata insuffisante pour distinguer les différents CV

## Risques et Hypothèses

| Risque                                                  | Probabilité | Impact | Mitigation                                                             |
| ------------------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------- |
| Confusion utilisateur entre différentes versions        | Moyenne     | Moyen  | Interface claire avec métadonnées visibles (date, modèle, tags)        |
| Perte de données lors du basculement entre CV           | Basse       | Élevé  | Sauvegarde automatique et confirmation avant changement non sauvegardé |
| Performance dégradée avec un grand nombre de CV         | Moyenne     | Moyen  | Chargement paresseux et pagination des CV dans l'interface             |
| Conflits de synchronisation pour utilisateurs connectés | Moyenne     | Moyen  | Système robuste de résolution de conflits avec historique des versions |
| Difficultés à retrouver un CV spécifique                | Élevée      | Moyen  | Système de recherche, tri et filtrage par métadonnées et tags          |

## Notes de Développement

### Modèle de données pour la gestion multi-CV

```typescript
// src/modules/cv/domain/entities/ResumeCollection.ts
import { Resume } from "./Resume";

/**
 * Métadonnées associées à un CV
 */
export interface ResumeMetadata {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  tags?: string[];
  templateId?: string;
  thumbnail?: string;
}

/**
 * Référence à un CV avec ses métadonnées
 */
export interface ResumeReference {
  id: string;
  metadata: ResumeMetadata;
}

/**
 * Collection de CV d'un utilisateur
 */
export class ResumeCollection {
  private resumeMap: Map<string, Resume> = new Map();
  private resumeMetadataMap: Map<string, ResumeMetadata> = new Map();
  private activeResumeId: string | null = null;

  /**
   * Ajoute un CV à la collection
   */
  addResume(resume: Resume, metadata: ResumeMetadata): string {
    this.resumeMap.set(metadata.id, resume);
    this.resumeMetadataMap.set(metadata.id, metadata);

    if (!this.activeResumeId) {
      this.activeResumeId = metadata.id;
    }

    return metadata.id;
  }

  /**
   * Récupère un CV par son ID
   */
  getResume(id: string): Resume | undefined {
    return this.resumeMap.get(id);
  }

  /**
   * Récupère les métadonnées d'un CV
   */
  getResumeMetadata(id: string): ResumeMetadata | undefined {
    return this.resumeMetadataMap.get(id);
  }

  /**
   * Met à jour un CV existant
   */
  updateResume(id: string, resume: Resume): boolean {
    if (!this.resumeMap.has(id)) {
      return false;
    }

    this.resumeMap.set(id, resume);

    // Mettre à jour la date de modification
    const metadata = this.resumeMetadataMap.get(id);
    if (metadata) {
      metadata.updatedAt = new Date();
      this.resumeMetadataMap.set(id, metadata);
    }

    return true;
  }

  /**
   * Met à jour les métadonnées d'un CV
   */
  updateMetadata(id: string, metadata: Partial<ResumeMetadata>): boolean {
    if (!this.resumeMetadataMap.has(id)) {
      return false;
    }

    const currentMetadata = this.resumeMetadataMap.get(id) as ResumeMetadata;
    const updatedMetadata = {
      ...currentMetadata,
      ...metadata,
      updatedAt: new Date(),
    };

    this.resumeMetadataMap.set(id, updatedMetadata);
    return true;
  }

  /**
   * Supprime un CV de la collection
   */
  removeResume(id: string): boolean {
    if (!this.resumeMap.has(id)) {
      return false;
    }

    this.resumeMap.delete(id);
    this.resumeMetadataMap.delete(id);

    // Si le CV actif est supprimé, en sélectionner un autre
    if (this.activeResumeId === id) {
      this.activeResumeId =
        this.resumeMap.size > 0 ? Array.from(this.resumeMap.keys())[0] : null;
    }

    return true;
  }

  /**
   * Duplique un CV existant
   */
  duplicateResume(id: string, newName?: string): string | null {
    const resume = this.resumeMap.get(id);
    const metadata = this.resumeMetadataMap.get(id);

    if (!resume || !metadata) {
      return null;
    }

    const newId = generateUniqueId();
    const newMetadata: ResumeMetadata = {
      ...metadata,
      id: newId,
      name: newName || `${metadata.name} (copie)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Créer une copie profonde du CV
    const resumeCopy = JSON.parse(JSON.stringify(resume)) as Resume;

    this.addResume(resumeCopy, newMetadata);
    return newId;
  }

  /**
   * Change le CV actif
   */
  setActiveResume(id: string): boolean {
    if (!this.resumeMap.has(id)) {
      return false;
    }

    this.activeResumeId = id;
    return true;
  }

  /**
   * Récupère le CV actif
   */
  getActiveResume(): Resume | null {
    return this.activeResumeId
      ? this.resumeMap.get(this.activeResumeId) || null
      : null;
  }

  /**
   * Récupère l'ID du CV actif
   */
  getActiveResumeId(): string | null {
    return this.activeResumeId;
  }

  /**
   * Récupère la liste des références de tous les CV
   */
  getAllResumeReferences(): ResumeReference[] {
    return Array.from(this.resumeMetadataMap.entries()).map(
      ([id, metadata]) => ({
        id,
        metadata,
      })
    );
  }
}

/**
 * Génère un ID unique pour un nouveau CV
 */
function generateUniqueId(): string {
  return `resume_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
```

### Interface de gestion des CV

```vue
<!-- src/ui/components/resume/ResumeManagerDashboard.vue -->
<template>
  <div class="resume-manager">
    <div class="resume-manager__header">
      <h1>{{ $t("ui.resumeManager.title") }}</h1>
      <button class="btn btn-primary" @click="createNewResume">
        <span class="icon-plus"></span>
        {{ $t("ui.resumeManager.createNew") }}
      </button>
    </div>

    <div v-if="isLoading" class="resume-manager__loading">
      <div class="spinner"></div>
      <p>{{ $t("ui.resumeManager.loading") }}</p>
    </div>

    <div v-else-if="resumes.length === 0" class="resume-manager__empty">
      <div class="empty-state">
        <span class="icon-document"></span>
        <h2>{{ $t("ui.resumeManager.noResumes") }}</h2>
        <p>{{ $t("ui.resumeManager.getStarted") }}</p>
        <button class="btn btn-primary" @click="createNewResume">
          {{ $t("ui.resumeManager.createFirst") }}
        </button>
      </div>
    </div>

    <div v-else class="resume-manager__grid">
      <div
        v-for="resume in resumes"
        :key="resume.id"
        class="resume-card"
        :class="{ 'is-active': resume.id === activeResumeId }"
      >
        <div class="resume-card__preview">
          <img
            v-if="resume.metadata.thumbnail"
            :src="resume.metadata.thumbnail"
            :alt="resume.metadata.name"
            class="thumbnail"
          />
          <div v-else class="thumbnail-placeholder">
            <span class="icon-document-large"></span>
          </div>
        </div>

        <div class="resume-card__content">
          <div class="resume-info">
            <h3 class="resume-name">{{ resume.metadata.name }}</h3>
            <p class="resume-date">
              {{ formatDate(resume.metadata.updatedAt) }}
            </p>
            <div v-if="resume.metadata.tags?.length" class="resume-tags">
              <span v-for="tag in resume.metadata.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="resume-actions">
            <button
              class="btn btn-text btn-icon"
              title="Éditer"
              @click="editResume(resume.id)"
            >
              <span class="icon-edit"></span>
            </button>

            <button
              class="btn btn-text btn-icon"
              title="Renommer"
              @click="renameResume(resume.id)"
            >
              <span class="icon-rename"></span>
            </button>

            <button
              class="btn btn-text btn-icon"
              title="Dupliquer"
              @click="duplicateResume(resume.id)"
            >
              <span class="icon-duplicate"></span>
            </button>

            <button
              class="btn btn-text btn-icon btn-danger"
              title="Supprimer"
              @click="confirmDelete(resume.id)"
            >
              <span class="icon-trash"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de renommage -->
    <div v-if="renameModalVisible" class="modal rename-modal">
      <div class="modal-content">
        <h3>{{ $t("ui.resumeManager.rename") }}</h3>
        <input
          type="text"
          v-model="newResumeName"
          class="form-input"
          :placeholder="$t('ui.resumeManager.enterName')"
          ref="renameInput"
        />
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="cancelRename">
            {{ $t("ui.common.cancel") }}
          </button>
          <button
            class="btn btn-primary"
            @click="confirmRename"
            :disabled="!newResumeName.trim()"
          >
            {{ $t("ui.common.save") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="deleteModalVisible" class="modal delete-modal">
      <div class="modal-content">
        <h3>{{ $t("ui.resumeManager.confirmDelete") }}</h3>
        <p>{{ $t("ui.resumeManager.deleteWarning") }}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="cancelDelete">
            {{ $t("ui.common.cancel") }}
          </button>
          <button class="btn btn-danger" @click="confirmDeleteAction">
            {{ $t("ui.common.delete") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useResumeCollection } from "@/composables/useResumeCollection";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";

const { t, locale } = useI18n();
const router = useRouter();
const {
  getAllResumes,
  getActiveResumeId,
  createResume,
  duplicateResume: duplicateResumeById,
  removeResume,
  updateResumeMetadata,
  setActiveResume,
} = useResumeCollection();

// États locaux
const resumes = ref<any[]>([]);
const activeResumeId = ref<string | null>(null);
const isLoading = ref(true);

// États pour le modal de renommage
const renameModalVisible = ref(false);
const newResumeName = ref("");
const resumeToRename = ref<string | null>(null);
const renameInput = ref<HTMLInputElement | null>(null);

// États pour le modal de suppression
const deleteModalVisible = ref(false);
const resumeToDelete = ref<string | null>(null);

// Charger les données initiales
onMounted(async () => {
  try {
    await loadResumes();
  } finally {
    isLoading.value = false;
  }
});

// Charger tous les CV
async function loadResumes() {
  const loadedResumes = await getAllResumes();
  resumes.value = loadedResumes;
  activeResumeId.value = await getActiveResumeId();
}

// Créer un nouveau CV
async function createNewResume() {
  const newResumeId = await createResume(
    t("ui.resumeManager.defaultName"),
    t("ui.resumeManager.defaultDescription")
  );

  if (newResumeId) {
    router.push({
      name: "builder",
      params: { resumeId: newResumeId },
    });
  }
}

// Éditer un CV existant
function editResume(resumeId: string) {
  if (resumeId) {
    router.push({
      name: "builder",
      params: { resumeId },
    });
  }
}

// Afficher le modal de renommage
function renameResume(resumeId: string) {
  const resume = resumes.value.find((r) => r.id === resumeId);
  if (resume) {
    resumeToRename.value = resumeId;
    newResumeName.value = resume.metadata.name;
    renameModalVisible.value = true;

    // Focus sur l'input après l'affichage du modal
    nextTick(() => {
      renameInput.value?.focus();
    });
  }
}

// Confirmer le renommage
async function confirmRename() {
  if (resumeToRename.value && newResumeName.value.trim()) {
    await updateResumeMetadata(resumeToRename.value, {
      name: newResumeName.value.trim(),
    });

    await loadResumes();
    cancelRename();
  }
}

// Annuler le renommage
function cancelRename() {
  renameModalVisible.value = false;
  resumeToRename.value = null;
  newResumeName.value = "";
}

// Dupliquer un CV
async function duplicateResume(resumeId: string) {
  const newId = await duplicateResumeById(resumeId);
  if (newId) {
    await loadResumes();
  }
}

// Afficher le modal de confirmation de suppression
function confirmDelete(resumeId: string) {
  resumeToDelete.value = resumeId;
  deleteModalVisible.value = true;
}

// Confirmer la suppression
async function confirmDeleteAction() {
  if (resumeToDelete.value) {
    await removeResume(resumeToDelete.value);
    await loadResumes();
    cancelDelete();
  }
}

// Annuler la suppression
function cancelDelete() {
  deleteModalVisible.value = false;
  resumeToDelete.value = null;
}

// Formater la date pour l'affichage
function formatDate(date: Date | string) {
  const dateObj = date instanceof Date ? date : new Date(date);
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: locale.value === "fr" ? fr : enUS,
  });
}
</script>
```

### Sélecteur de CV dans l'éditeur

```vue
<!-- src/ui/components/resume/ResumeSwitcher.vue -->
<template>
  <div class="resume-switcher">
    <button class="resume-switcher__button" @click="toggleDropdown">
      <span class="resume-name">{{ currentResumeName }}</span>
      <span class="icon-chevron-down"></span>
    </button>

    <div v-if="isOpen" class="resume-switcher__dropdown">
      <div class="dropdown-header">
        <h3>{{ $t("ui.resumeSwitcher.selectResume") }}</h3>
        <button class="btn-close" @click="closeDropdown">
          <span class="icon-close"></span>
        </button>
      </div>

      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="$t('ui.resumeSwitcher.search')"
          class="search-input"
        />
        <span class="icon-search"></span>
      </div>

      <div class="resume-list">
        <div
          v-for="resume in filteredResumes"
          :key="resume.id"
          class="resume-item"
          :class="{ 'is-active': resume.id === activeResumeId }"
          @click="switchToResume(resume.id)"
        >
          <div class="resume-item__icon">
            <span class="icon-document"></span>
          </div>
          <div class="resume-item__details">
            <span class="resume-item__name">{{ resume.metadata.name }}</span>
            <span class="resume-item__date">
              {{ formatDate(resume.metadata.updatedAt) }}
            </span>
          </div>
        </div>
      </div>

      <div class="dropdown-footer">
        <button class="btn btn-primary btn-block" @click="createNewResume">
          <span class="icon-plus"></span>
          {{ $t("ui.resumeSwitcher.createNew") }}
        </button>
        <button class="btn btn-text btn-block" @click="goToManager">
          {{ $t("ui.resumeSwitcher.manageAll") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useResumeCollection } from "@/composables/useResumeCollection";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useEventListener } from "@vueuse/core";

const props = defineProps<{
  currentResumeId: string;
}>();

const emit = defineEmits<{
  (e: "switch", resumeId: string): void;
  (e: "create-new"): void;
}>();

const { t, locale } = useI18n();
const router = useRouter();
const { getAllResumes, getResumeMetadata, getActiveResumeId } =
  useResumeCollection();

// États locaux
const isOpen = ref(false);
const resumes = ref<any[]>([]);
const activeResumeId = ref<string>(props.currentResumeId);
const searchQuery = ref("");

// Charger les données initiales
onMounted(async () => {
  await loadResumes();
  useEventListener(document, "click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Observer les changements de l'ID du CV actif
watch(
  () => props.currentResumeId,
  (newId) => {
    activeResumeId.value = newId;
  }
);

// Charger tous les CV
async function loadResumes() {
  resumes.value = await getAllResumes();
}

// CV filtrés par la recherche
const filteredResumes = computed(() => {
  if (!searchQuery.value.trim()) {
    return resumes.value;
  }

  const query = searchQuery.value.toLowerCase();
  return resumes.value.filter(
    (resume) =>
      resume.metadata.name.toLowerCase().includes(query) ||
      (resume.metadata.description &&
        resume.metadata.description.toLowerCase().includes(query)) ||
      (resume.metadata.tags &&
        resume.metadata.tags.some((tag: string) =>
          tag.toLowerCase().includes(query)
        ))
  );
});

// Nom du CV courant
const currentResumeName = computed(() => {
  const metadata = resumes.value.find(
    (r) => r.id === activeResumeId.value
  )?.metadata;
  return metadata?.name || t("ui.resumeSwitcher.untitled");
});

// Basculer l'affichage du dropdown
function toggleDropdown(event: Event) {
  event.stopPropagation();
  isOpen.value = !isOpen.value;
}

// Fermer le dropdown
function closeDropdown() {
  isOpen.value = false;
}

// Gérer les clics en dehors du composant
function handleClickOutside(event: Event) {
  const el = event.target as HTMLElement;
  const switcher = document.querySelector(".resume-switcher");

  if (switcher && !switcher.contains(el)) {
    closeDropdown();
  }
}

// Changer de CV
function switchToResume(resumeId: string) {
  if (resumeId !== activeResumeId.value) {
    emit("switch", resumeId);
    closeDropdown();
  }
}

// Créer un nouveau CV
function createNewResume() {
  emit("create-new");
  closeDropdown();
}

// Aller à la page de gestion des CV
function goToManager() {
  router.push({ name: "resume-manager" });
  closeDropdown();
}

// Formater la date pour l'affichage
function formatDate(date: Date | string) {
  const dateObj = date instanceof Date ? date : new Date(date);
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: locale.value === "fr" ? fr : enUS,
  });
}
</script>
```
