# Epic-5: Amélioration de l'Architecture

Story-6: Amélioration de la communication UI/domaine

## Description de la Story

**En tant qu'** équipe de développement du CV Generator  
**Je veux** améliorer la communication entre les composants UI et le domaine  
**afin de** réduire le couplage, standardiser la gestion des erreurs, et faciliter l'implémentation des fonctionnalités d'export

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-5 visant à améliorer l'architecture de l'application avant l'implémentation de l'Epic-6 (Export et sauvegarde du CV). L'analyse du code actuel a révélé des problèmes dans la communication entre la couche UI (composants Vue) et le domaine :

1. Les composants UI manipulent parfois directement les entités du domaine
2. La gestion des erreurs du domaine n'est pas toujours standardisée dans l'UI
3. Il n'existe pas de mécanisme clair pour traduire les erreurs du domaine en messages utilisateur
4. Le binding de données entre formulaires UI et entités du domaine est souvent manuel et répétitif

L'Epic-6 ajoutera de nombreuses fonctionnalités d'interaction avec le domaine (export, import, sauvegarde), ce qui rend essentiel l'établissement d'un pattern clair de communication entre l'UI et le domaine.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. Étant donné un composant UI, quand il a besoin d'interagir avec le domaine, alors il utilise un cas d'utilisation via un adaptateur ou un service Vue dédié
2. Étant donné une erreur du domaine, quand elle est retournée à l'UI, alors elle est traduite en message utilisateur compréhensible
3. Étant donné un formulaire UI, quand il est soumis, alors les données sont validées selon les règles du domaine avant création d'entités
4. Étant donné un composant UI, quand il affiche des données du domaine, alors il utilise des interfaces dédiées pour la présentation
5. Étant donné une opération asynchrone sur le domaine, quand elle est en cours, alors l'UI affiche un indicateur de chargement cohérent

## Tâches

1. - [ ] Analyser les interactions UI/domaine actuelles
   1. - [ ] Identifier les points de couplage direct
   2. - [ ] Recenser les patterns de traitement d'erreurs
   3. - [ ] Analyser les formulaires et leurs validations
2. - [ ] Concevoir des services Vue pour l'interaction avec le domaine
   1. - [ ] Créer un pattern standard pour les services Vue
   2. - [ ] Implémenter un système de gestion d'état réactif
   3. - [ ] Définir une interface claire pour les interactions asynchrones
3. - [ ] Standardiser la gestion des erreurs du domaine dans l'UI
   1. - [ ] Créer un système de traduction des erreurs domaine → utilisateur
   2. - [ ] Implémenter un service de notification d'erreurs
   3. - [ ] Standardiser l'affichage des erreurs dans les formulaires
4. - [ ] Concevoir des modèles de présentation (ViewModel)
   1. - [ ] Définir des interfaces pour la présentation des entités
   2. - [ ] Implémenter des adaptateurs domaine → présentation
   3. - [ ] Documenter l'utilisation des modèles de présentation
5. - [ ] Améliorer les formulaires et la validation
   1. - [ ] Créer des composables Vue pour la validation côté UI
   2. - [ ] Synchroniser la validation UI avec les règles du domaine
   3. - [ ] Améliorer le retour utilisateur pendant la saisie
6. - [ ] Refactoriser les composants existants
   1. - [ ] Mettre à jour les composants pour utiliser les nouveaux services
   2. - [ ] Standardiser la gestion des états de chargement
   3. - [ ] Vérifier que les fonctionnalités existantes continuent de fonctionner

## Principes de Développement

#### Principes à Suivre

- **Séparation des préoccupations**: Séparer clairement présentation et logique métier
- **Composition**: Favoriser les composables Vue pour la réutilisation de la logique
- **Réactivité**: Utiliser le système réactif de Vue pour les mises à jour d'UI
- **Adaptateurs**: Utiliser le pattern adaptateur pour convertir les données entre domaine et UI
- **Gestion proactive des erreurs**: Anticiper et gérer les erreurs à tous les niveaux

#### À Éviter

- Manipulation directe des entités du domaine dans les composants UI
- Duplication des règles de validation entre UI et domaine
- Messages d'erreur techniques exposés directement à l'utilisateur
- Couplage fort entre les composants UI et les structures du domaine
- Logique métier dans les composants Vue

## Risques et Hypothèses

| Risque                                       | Probabilité | Impact | Stratégie de mitigation                                 |
| -------------------------------------------- | ----------- | ------ | ------------------------------------------------------- |
| Complexité accrue avec les nouveaux patterns | Moyenne     | Moyen  | Documentation claire, exemples, formation               |
| Régressions lors de la refactorisation       | Moyenne     | Élevé  | Tests exhaustifs, approche incrémentale                 |
| Surcharge de boilerplate code                | Moyenne     | Faible | Utilisation de générateurs, composables réutilisables   |
| Performance UI dégradée avec les adaptateurs | Faible      | Moyen  | Optimisation, utilisation judicieuse de la mémorisation |
| Résistance au changement                     | Moyenne     | Moyen  | Démonstration des bénéfices, approche collaborative     |

## Notes de Développement

### Service Vue pour interagir avec le domaine

```typescript
// packages/ui/src/modules/cv/services/resume.service.ts

import { ref, computed, Ref } from "vue";
import {
  CreateResumeUseCase,
  CreateResumeInput,
} from "@cv-generator/core/cv/application/use-cases/resume/create-resume.use-case";
import { UpdateResumeUseCase } from "@cv-generator/core/cv/application/use-cases/resume/update-resume.use-case";
import { GetResumeUseCase } from "@cv-generator/core/cv/application/use-cases/resume/get-resume.use-case";
import { Resume } from "@cv-generator/core/cv/domain/entities/Resume";
import { ResumeViewModel } from "../models/resume.view-model";
import { mapDomainErrorToUI } from "@/utils/error-mapper";
import { ResumeRepositoryFactory } from "@cv-generator/core/cv/infrastructure/repositories/resume-repository.factory";

/**
 * Service pour gérer les interactions avec les CV
 * Encapsule les cas d'utilisation du domaine et expose une API adaptée à Vue
 */
export function useResumeService() {
  // Injection des cas d'utilisation
  const resumeRepository = ResumeRepositoryFactory.create();
  const createResumeUseCase = new CreateResumeUseCase(resumeRepository);
  const updateResumeUseCase = new UpdateResumeUseCase(resumeRepository);
  const getResumeUseCase = new GetResumeUseCase(resumeRepository);

  // État réactif
  const currentResume: Ref<ResumeViewModel | null> = ref(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const hasResume = computed(() => currentResume.value !== null);

  /**
   * Convertit une entité Resume du domaine en ViewModel pour l'UI
   */
  function mapResumeToViewModel(resume: Resume): ResumeViewModel {
    return {
      id: resume.id,
      title: resume.title,
      basics: {
        name: resume.basics.name,
        email: resume.basics.email,
        phone: resume.basics.phone,
        url: resume.basics.url,
        summary: resume.basics.summary,
      },
      language: resume.language,
      // Autres mappings...
    };
  }

  /**
   * Charge un CV par son ID
   */
  async function loadResume(id: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await getResumeUseCase.execute({ id });

      if (result.isSuccess()) {
        currentResume.value = mapResumeToViewModel(result.getValue());
        return true;
      } else {
        error.value = mapDomainErrorToUI(result.getError());
        return false;
      }
    } catch (e) {
      error.value = "Une erreur inattendue est survenue";
      console.error(e);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Crée un nouveau CV
   */
  async function createResume(
    input: CreateResumeInput
  ): Promise<string | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await createResumeUseCase.execute(input);

      if (result.isSuccess()) {
        const resume = result.getValue();
        currentResume.value = mapResumeToViewModel(resume);
        return resume.id;
      } else {
        error.value = mapDomainErrorToUI(result.getError());
        return null;
      }
    } catch (e) {
      error.value = "Une erreur inattendue est survenue";
      console.error(e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Met à jour le CV courant
   */
  async function updateResume(
    data: Partial<ResumeViewModel>
  ): Promise<boolean> {
    if (!currentResume.value || !currentResume.value.id) {
      error.value = "Aucun CV actif à mettre à jour";
      return false;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const result = await updateResumeUseCase.execute({
        id: currentResume.value.id,
        changes: {
          title: data.title,
          basics: data.basics,
          language: data.language,
          // Autres champs à mettre à jour...
        },
      });

      if (result.isSuccess()) {
        currentResume.value = {
          ...currentResume.value,
          ...data,
        };
        return true;
      } else {
        error.value = mapDomainErrorToUI(result.getError());
        return false;
      }
    } catch (e) {
      error.value = "Une erreur inattendue est survenue";
      console.error(e);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Exposer l'API du service
  return {
    // État
    currentResume,
    isLoading,
    error,
    hasResume,

    // Méthodes
    loadResume,
    createResume,
    updateResume,
  };
}
```

### Mapper d'erreurs domaine vers UI

```typescript
// packages/ui/src/utils/error-mapper.ts

import { useI18n } from "vue-i18n";
import { DomainError } from "@cv-generator/core/shared/domain/domain-error.interface";

// Map des codes d'erreur du domaine vers les clés de traduction UI
const ERROR_MAP: Record<string, string> = {
  "VALIDATION.MISSING_REQUIRED_FIELD": "errors.validation.required_field",
  "VALIDATION.INVALID_FORMAT": "errors.validation.invalid_format",
  "VALIDATION.INVALID_EMAIL": "errors.validation.invalid_email",
  "VALIDATION.INVALID_URL": "errors.validation.invalid_url",
  "VALIDATION.INVALID_DATE": "errors.validation.invalid_date",
  "ENTITY.NOT_FOUND": "errors.entity.not_found",
  "STORAGE.SAVE_FAILED": "errors.storage.save_failed",
  "STORAGE.RETRIEVE_FAILED": "errors.storage.retrieve_failed",
  // Autres mappings...
};

/**
 * Convertit une erreur du domaine en message utilisateur
 */
export function mapDomainErrorToUI(error: DomainError): string {
  const { t } = useI18n();

  // Si l'erreur a un code connu, utiliser la traduction correspondante
  if (error.code && ERROR_MAP[error.code]) {
    return t(ERROR_MAP[error.code], error.details || {});
  }

  // Si l'erreur a un message mais pas de code reconnu
  if (error.message) {
    return error.message;
  }

  // Message par défaut
  return t("errors.unexpected");
}

/**
 * Hook composable pour la gestion des erreurs dans les composants
 */
export function useErrorHandler() {
  const { t } = useI18n();

  function handleError(error: unknown): string {
    // Si c'est une erreur du domaine (avec une structure connue)
    if (typeof error === "object" && error !== null && "code" in error) {
      return mapDomainErrorToUI(error as DomainError);
    }

    // Si c'est une erreur standard
    if (error instanceof Error) {
      return error.message;
    }

    // Fallback pour les erreurs inconnues
    return t("errors.unexpected");
  }

  return {
    handleError,
  };
}
```

### ViewModel pour la présentation

```typescript
// packages/ui/src/modules/cv/models/resume.view-model.ts

/**
 * Modèle de présentation pour un CV
 * Adapté aux besoins de l'UI, indépendant des structures du domaine
 */
export interface ResumeViewModel {
  id: string;
  title: string;
  language: string;
  basics: {
    name: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
  };
  isNew?: boolean;
  lastUpdated?: Date;
  // Autres propriétés spécifiques à l'UI...
}

/**
 * Interface pour les données d'entrée d'un formulaire de CV
 * Représente ce que l'utilisateur peut saisir
 */
export interface ResumeFormData {
  title: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  language: string;
}

/**
 * Convertit les données de formulaire en ViewModel
 */
export function mapFormDataToViewModel(
  formData: ResumeFormData,
  id?: string
): ResumeViewModel {
  return {
    id: id || "",
    title: formData.title,
    basics: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      url: formData.website,
      summary: formData.summary,
    },
    language: formData.language,
    isNew: !id,
    lastUpdated: new Date(),
  };
}

/**
 * Convertit un ViewModel en données de formulaire
 */
export function mapViewModelToFormData(
  viewModel: ResumeViewModel
): ResumeFormData {
  return {
    title: viewModel.title,
    name: viewModel.basics.name,
    email: viewModel.basics.email || "",
    phone: viewModel.basics.phone || "",
    website: viewModel.basics.url || "",
    summary: viewModel.basics.summary || "",
    language: viewModel.language,
  };
}
```

### Exemple d'utilisation dans un composant Vue

```vue
<!-- packages/ui/src/modules/cv/presentation/pages/EditResumePage.vue -->

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useResumeService } from "../../services/resume.service";
import {
  ResumeFormData,
  mapViewModelToFormData,
} from "../../models/resume.view-model";
import { useToast } from "@/composables/useToast";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { showSuccess, showError } = useToast();

// Utilisation du service qui encapsule l'interaction avec le domaine
const { currentResume, isLoading, error, loadResume, updateResume } =
  useResumeService();

// État local du formulaire
const formData = ref<ResumeFormData>({
  title: "",
  name: "",
  email: "",
  phone: "",
  website: "",
  summary: "",
  language: "fr",
});

// Erreurs de validation du formulaire
const validationErrors = ref<Record<string, string>>({});

// ID du CV depuis les paramètres de route
const resumeId = computed(() => route.params.id as string);

// Chargement initial du CV
onMounted(async () => {
  if (resumeId.value) {
    const success = await loadResume(resumeId.value);

    if (success && currentResume.value) {
      // Mapper les données du domaine vers le formulaire
      formData.value = mapViewModelToFormData(currentResume.value);
    } else if (error.value) {
      showError(error.value);
      router.push({ name: "resumes" });
    }
  }
});

// Validation du formulaire côté UI
function validateForm(): boolean {
  validationErrors.value = {};

  if (!formData.value.title.trim()) {
    validationErrors.value.title = t("validation.required");
    return false;
  }

  if (!formData.value.name.trim()) {
    validationErrors.value.name = t("validation.required");
    return false;
  }

  // Validation email si présent
  if (
    formData.value.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
  ) {
    validationErrors.value.email = t("validation.invalid_email");
    return false;
  }

  return true;
}

// Soumission du formulaire
async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  // Mise à jour via le service
  const success = await updateResume({
    title: formData.value.title,
    basics: {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      url: formData.value.website,
      summary: formData.value.summary,
    },
    language: formData.value.language,
  });

  if (success) {
    showSuccess(t("resume.update_success"));
  } else if (error.value) {
    showError(error.value);
  }
}
</script>

<template>
  <div class="edit-resume-page">
    <h1>{{ t("resume.edit_title") }}</h1>

    <!-- État de chargement -->
    <div v-if="isLoading" class="loading-indicator">
      {{ t("common.loading") }}
    </div>

    <!-- Formulaire -->
    <form v-else @submit.prevent="handleSubmit" class="resume-form">
      <!-- Champs du formulaire avec gestion des erreurs -->
      <!-- ... -->

      <button type="submit" :disabled="isLoading">
        {{ t("common.save") }}
      </button>
    </form>
  </div>
</template>
```

## Historique du Chat

**User:** Avant de se lancer dans l'EPIC 6, pourrais-tu analyser si l'application actuelle est robuste, stable et suffisamment bien conçue ? Il y a peut-être des améliorations à apporter.

**Assistant:** J'ai analysé l'application et j'ai remarqué des problèmes dans la communication entre l'UI et le domaine. Les composants Vue interagissent parfois directement avec les entités du domaine, ce qui crée un couplage fort et rend difficile la gestion cohérente des erreurs.

**User:** Comment se manifestent ces problèmes concrètement ?

**Assistant:** Par exemple, certains composants manipulent directement les entités du domaine au lieu de passer par des cas d'utilisation, ce qui mélange les responsabilités. Les erreurs du domaine sont parfois exposées directement à l'utilisateur sans traduction appropriée. La validation est souvent dupliquée entre l'UI et le domaine, et le mapping des données entre formulaires et entités est répétitif et propice aux erreurs.

**User:** Quelles améliorations suggères-tu pour faciliter l'implémentation de l'Epic 6 ?

**Assistant:** Je recommande de créer une couche intermédiaire avec des services Vue dédiés qui encapsulent les cas d'utilisation du domaine, standardiser la gestion des erreurs avec un système de traduction domaine → UI, introduire des ViewModels pour découpler la présentation du domaine, et améliorer la validation des formulaires pour qu'elle soit cohérente avec les règles du domaine. Ces changements faciliteront l'implémentation des fonctionnalités d'export et de sauvegarde de l'Epic 6 en rendant plus claire et plus cohérente l'interaction entre l'UI et le domaine.
