# Epic-6: CV Export et sauvegarde

Story-9: Sauvegarde du CV

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** pouvoir sauvegarder mon CV localement ou dans mon compte  
**afin de** pouvoir y accéder ultérieurement et continuer à le modifier

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. Elle se concentre sur la sauvegarde des données du CV pour permettre aux utilisateurs de conserver leurs informations et de pouvoir y revenir plus tard.

La sauvegarde est essentielle pour offrir une expérience utilisateur complète, en permettant aux utilisateurs de travailler sur leur CV en plusieurs sessions sans perdre leurs données. Cette story intègre à la fois la sauvegarde locale (pour les utilisateurs non connectés) et la sauvegarde dans le compte utilisateur (pour les utilisateurs connectés).

## Estimation

Story Points: 2

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur connecté, quand il modifie son CV, alors ses modifications sont automatiquement sauvegardées dans son compte
2. ✅ Étant donné un utilisateur non connecté, quand il modifie son CV, alors ses modifications sont automatiquement sauvegardées localement
3. ✅ Étant donné un utilisateur avec un CV sauvegardé localement, quand il se connecte, alors il peut choisir de transférer son CV local vers son compte
4. ✅ Étant donné un utilisateur connecté avec plusieurs CV, quand il accède à son compte, alors il peut voir la liste de tous ses CV sauvegardés
5. ✅ Étant donné un utilisateur qui modifie son CV, quand une erreur de sauvegarde se produit, alors il est informé et peut réessayer ou sauvegarder manuellement

## Tâches

1. - [ ] Améliorer le système de sauvegarde locale

   1. - [ ] Développer un service de sauvegarde périodique automatique
   2. - [ ] Implémenter un système de versionnement local pour éviter les pertes de données
   3. - [ ] Ajouter un mécanisme de récupération en cas de crash du navigateur

2. - [ ] Développer le système de sauvegarde dans le compte utilisateur

   1. - [ ] Créer les API nécessaires pour la sauvegarde des CV dans le compte
   2. - [ ] Implémenter la synchronisation entre le stockage local et le compte
   3. - [ ] Gérer les conflits potentiels entre les versions locales et serveur

3. - [ ] Implémenter la gestion de multiples CV

   1. - [ ] Développer l'interface de gestion des CV sauvegardés
   2. - [ ] Ajouter les fonctionnalités de duplication, renommage et suppression de CV
   3. - [ ] Mettre en place un système de métadonnées pour les CV (date de création, modification, etc.)

4. - [ ] Gérer les erreurs et la récupération

   1. - [ ] Implémenter des mécanismes de détection des erreurs de sauvegarde
   2. - [ ] Développer des stratégies de retry et de fallback
   3. - [ ] Créer des notifications claires pour informer l'utilisateur

5. - [ ] Optimiser l'expérience utilisateur
   1. - [ ] Ajouter des indicateurs visuels de l'état de sauvegarde (en cours, terminé, erreur)
   2. - [ ] Implémenter un bouton de sauvegarde manuelle comme alternative
   3. - [ ] Créer une interface pour gérer l'historique des versions d'un CV

## Avancement

### 2024-05-21 - Conception du système de sauvegarde

Nous avons conçu l'architecture du système de sauvegarde avec les caractéristiques suivantes :

1. **Sauvegarde locale** :

   - Utilisation de IndexedDB pour stocker les CV localement
   - Sauvegarde automatique toutes les 30 secondes après modification
   - Conservation des 5 dernières versions pour permettre la récupération
   - Compression des données pour optimiser l'espace de stockage

2. **Sauvegarde dans le compte** :

   - Synchronisation bidirectionnelle entre local et serveur
   - Stratégie de résolution de conflits basée sur les timestamps
   - Métadonnées enrichies pour chaque CV (template utilisé, date de dernière modification, etc.)
   - API RESTful pour la gestion des CV dans le compte utilisateur

3. **Gestion multi-CV** :
   - Interface de type "dashboard" pour visualiser et gérer les CV
   - Organisation par dossiers et tags
   - Recherche et filtres avancés
   - Prévisualisations miniatures des CV

## Principes de Développement

#### Principes à Suivre

- **Données utilisateur en premier** : Priorité absolue à la préservation des données saisies par l'utilisateur
- **Transparence** : Communication claire sur l'état de sauvegarde et les éventuels problèmes
- **Robustesse** : Multiples couches de protection contre les pertes de données
- **Performance** : Optimisation des opérations de sauvegarde pour ne pas affecter l'expérience utilisateur
- **Flexibilité** : Support de différentes stratégies de sauvegarde selon les préférences utilisateur

#### À Éviter

- Sauvegarde trop fréquente qui pourrait impacter les performances
- Interface complexe qui rendrait la gestion des CV difficile
- Dépendance excessive au réseau pour les utilisateurs non connectés
- Messages d'erreur techniques peu compréhensibles
- Perte silencieuse de données sans notification à l'utilisateur

## Risques et Hypothèses

| Risque                                              | Probabilité | Impact | Mitigation                                                   |
| --------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------ |
| Perte de données lors d'une coupure réseau          | Moyenne     | Élevé  | Sauvegarde locale préalable et synchronisation différée      |
| Conflit entre versions locale et serveur            | Basse       | Élevé  | Algorithme intelligent de fusion et option de choix manuel   |
| Espace de stockage local insuffisant                | Basse       | Moyen  | Compression des données et nettoyage des anciennes versions  |
| Problèmes de performance avec de nombreux CV        | Moyenne     | Moyen  | Chargement paginé et optimisation de la structure de données |
| Incompatibilité entre versions du schéma de données | Basse       | Élevé  | Migrations automatiques et versionnement du schéma           |

## Notes de Développement

### Service de sauvegarde automatique

```typescript
// src/cv/infrastructure/services/AutoSaveService.ts
import { Resume } from "@/cv/domain/entities/Resume";
import { ResumeRepository } from "@/cv/domain/repositories/ResumeRepository";
import { inject, injectable } from "inversify";
import { Subject, Subscription, debounceTime } from "rxjs";

@injectable()
export class AutoSaveService {
  private changes$ = new Subject<Resume>();
  private subscription: Subscription | null = null;
  private lastSavedVersion: string | null = null;
  private saveInterval = 30000; // 30 secondes

  constructor(
    @inject(ResumeRepository) private resumeRepository: ResumeRepository
  ) {}

  /**
   * Démarre le service de sauvegarde automatique
   */
  public start(): void {
    if (this.subscription) {
      return;
    }

    this.subscription = this.changes$
      .pipe(debounceTime(this.saveInterval))
      .subscribe(async (resume) => {
        try {
          // Vérifier si le CV a changé depuis la dernière sauvegarde
          const currentVersion = this.generateVersionHash(resume);
          if (currentVersion === this.lastSavedVersion) {
            console.log("No changes detected, skipping save");
            return;
          }

          // Sauvegarder le CV
          await this.resumeRepository.save(resume);
          this.lastSavedVersion = currentVersion;
          console.log("Resume auto-saved successfully");

          // Émettre un événement de sauvegarde réussie
          window.dispatchEvent(
            new CustomEvent("resume:auto-saved", {
              detail: { success: true, timestamp: new Date() },
            })
          );
        } catch (error) {
          console.error("Auto-save failed:", error);

          // Émettre un événement d'échec de sauvegarde
          window.dispatchEvent(
            new CustomEvent("resume:auto-save-failed", {
              detail: { error, timestamp: new Date() },
            })
          );
        }
      });

    console.log("Auto-save service started");
  }

  /**
   * Arrête le service de sauvegarde automatique
   */
  public stop(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
      console.log("Auto-save service stopped");
    }
  }

  /**
   * Notifie le service qu'un changement a été effectué sur le CV
   */
  public notifyChange(resume: Resume): void {
    this.changes$.next(resume);
  }

  /**
   * Force une sauvegarde immédiate
   */
  public async saveNow(resume: Resume): Promise<void> {
    try {
      await this.resumeRepository.save(resume);
      this.lastSavedVersion = this.generateVersionHash(resume);

      window.dispatchEvent(
        new CustomEvent("resume:saved", {
          detail: { success: true, timestamp: new Date() },
        })
      );

      console.log("Resume saved successfully");
    } catch (error) {
      console.error("Save failed:", error);

      window.dispatchEvent(
        new CustomEvent("resume:save-failed", {
          detail: { error, timestamp: new Date() },
        })
      );

      throw error;
    }
  }

  /**
   * Génère un hash simple pour détecter les changements dans le CV
   */
  private generateVersionHash(resume: Resume): string {
    // Dans une implémentation réelle, utiliser un algorithme de hash plus robuste
    return JSON.stringify(resume.toJSON());
  }
}
```

### Interface de gestion des CV

```vue
<!-- src/ui/pages/ResumeDashboard.vue -->
<template>
  <div class="resume-dashboard">
    <header class="resume-dashboard__header">
      <h1>{{ $t("resume.dashboard.title") }}</h1>
      <button class="btn btn-primary" @click="createNewResume">
        {{ $t("resume.dashboard.createNew") }}
      </button>
    </header>

    <div class="resume-dashboard__filters">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="$t('resume.dashboard.search')"
        class="search-input"
      />

      <div class="filter-group">
        <label>{{ $t("resume.dashboard.sortBy") }}:</label>
        <select v-model="sortOption">
          <option value="lastModified">
            {{ $t("resume.dashboard.lastModified") }}
          </option>
          <option value="name">{{ $t("resume.dashboard.name") }}</option>
          <option value="created">{{ $t("resume.dashboard.created") }}</option>
        </select>
      </div>
    </div>

    <!-- Liste des CV -->
    <div v-if="isLoading" class="resume-dashboard__loading">
      <div class="spinner"></div>
      <p>{{ $t("resume.dashboard.loading") }}</p>
    </div>

    <div
      v-else-if="filteredResumes.length === 0"
      class="resume-dashboard__empty"
    >
      <p>{{ $t("resume.dashboard.noResumes") }}</p>
      <button class="btn btn-primary" @click="createNewResume">
        {{ $t("resume.dashboard.createFirstResume") }}
      </button>
    </div>

    <div v-else class="resume-dashboard__grid">
      <div
        v-for="resume in filteredResumes"
        :key="resume.id"
        class="resume-card"
      >
        <div class="resume-card__preview" @click="openResume(resume.id)">
          <img
            v-if="resume.previewImage"
            :src="resume.previewImage"
            :alt="resume.name"
          />
          <div v-else class="resume-card__no-preview">
            {{ resume.name.charAt(0).toUpperCase() }}
          </div>
        </div>

        <div class="resume-card__info">
          <h3 class="resume-card__title">{{ resume.name }}</h3>
          <p class="resume-card__date">
            {{ $t("resume.dashboard.lastModified") }}:
            {{ formatDate(resume.lastModified) }}
          </p>
        </div>

        <div class="resume-card__actions">
          <button class="btn-icon" title="Edit" @click="openResume(resume.id)">
            <span class="icon-edit"></span>
          </button>

          <button
            class="btn-icon"
            title="Duplicate"
            @click="duplicateResume(resume.id)"
          >
            <span class="icon-duplicate"></span>
          </button>

          <button
            class="btn-icon"
            title="Export"
            @click="exportResume(resume.id)"
          >
            <span class="icon-export"></span>
          </button>

          <button
            class="btn-icon btn-danger"
            title="Delete"
            @click="confirmDelete(resume.id)"
          >
            <span class="icon-delete"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <confirm-modal
      v-if="showDeleteConfirm"
      :title="$t('resume.dashboard.deleteConfirmTitle')"
      :message="
        $t('resume.dashboard.deleteConfirmMessage', {
          name: resumeToDelete?.name || '',
        })
      "
      @confirm="deleteResume"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { format } from "date-fns";
import { useResumeRepository } from "@/composables/useResumeRepository";
import ConfirmModal from "@/ui/components/shared/ConfirmModal.vue";

const { t } = useI18n();
const router = useRouter();
const { getAll, remove, duplicate } = useResumeRepository();

const resumes = ref<any[]>([]);
const isLoading = ref(true);
const searchQuery = ref("");
const sortOption = ref("lastModified");
const showDeleteConfirm = ref(false);
const resumeToDelete = ref<any>(null);

// Charger les CV au montage du composant
onMounted(async () => {
  try {
    resumes.value = await getAll();
  } catch (error) {
    console.error("Error loading resumes:", error);
    // Afficher un message d'erreur
  } finally {
    isLoading.value = false;
  }
});

// Filtrer et trier les CV
const filteredResumes = computed(() => {
  let result = [...resumes.value];

  // Appliquer la recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((resume) =>
      resume.name.toLowerCase().includes(query)
    );
  }

  // Appliquer le tri
  result.sort((a, b) => {
    if (sortOption.value === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption.value === "created") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Par défaut, tri par dernière modification
      return (
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      );
    }
  });

  return result;
});

// Formatter les dates
function formatDate(dateString: string): string {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm");
}

// Actions
function createNewResume() {
  router.push({ name: "resume-create" });
}

function openResume(id: string) {
  router.push({ name: "resume-edit", params: { id } });
}

function exportResume(id: string) {
  router.push({ name: "resume-export", params: { id } });
}

async function duplicateResume(id: string) {
  try {
    const newResume = await duplicate(id);
    resumes.value.push(newResume);

    // Afficher un message de succès
  } catch (error) {
    console.error("Error duplicating resume:", error);
    // Afficher un message d'erreur
  }
}

function confirmDelete(id: string) {
  resumeToDelete.value = resumes.value.find((resume) => resume.id === id);
  showDeleteConfirm.value = true;
}

async function deleteResume() {
  if (!resumeToDelete.value) return;

  try {
    await remove(resumeToDelete.value.id);
    resumes.value = resumes.value.filter(
      (resume) => resume.id !== resumeToDelete.value.id
    );
    showDeleteConfirm.value = false;

    // Afficher un message de succès
  } catch (error) {
    console.error("Error deleting resume:", error);
    // Afficher un message d'erreur
  }
}
</script>
```
