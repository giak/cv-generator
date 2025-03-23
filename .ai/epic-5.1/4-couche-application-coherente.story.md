# Epic-5: Amélioration de l'Architecture

Story-4: Implémentation d'une couche d'application cohérente

## Description de la Story

**En tant qu'** équipe de développement du CV Generator  
**Je veux** implémenter une couche d'application cohérente avec des cas d'utilisation bien définis  
**afin de** améliorer la séparation des préoccupations et faciliter l'implémentation des fonctionnalités d'export et de sauvegarde

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-5 visant à améliorer l'architecture de l'application avant l'implémentation de l'Epic-6 (Export et sauvegarde du CV). L'analyse du code actuel a révélé que la couche d'application est inconsistante, avec des responsabilités parfois mélangées entre les composants UI, les services et le domaine.

L'architecture Clean Architecture distingue clairement une couche d'application qui contient les cas d'utilisation (use cases) de l'application, orchestrant les entités du domaine et interagissant avec l'infrastructure via des ports et adaptateurs. Cette couche est essentielle pour :

1. Maintenir la séparation des préoccupations
2. Faciliter les tests des règles métier
3. Permettre l'évolution indépendante de l'interface utilisateur et de l'infrastructure
4. Simplifier l'ajout de nouvelles fonctionnalités comme l'export et la sauvegarde

La création d'une couche d'application cohérente fournira un framework solide pour implémenter les fonctionnalités d'export et de sauvegarde de manière modulaire et testable.

## Estimation

Story Points: 5

## Critères d'Acceptation

1. Étant donné un besoin d'interaction avec le domaine, quand un composant UI doit manipuler des données, alors il utilise un cas d'utilisation dédié depuis la couche d'application
2. Étant donné un cas d'utilisation, quand il est implémenté, alors il respecte le principe de responsabilité unique (SRP)
3. Étant donné un cas d'utilisation, quand il est testé, alors les tests peuvent être exécutés sans dépendance à l'interface utilisateur
4. Étant donné la couche d'application, quand elle est conçue, alors elle définit clairement des ports pour interagir avec l'infrastructure
5. Étant donné plusieurs composants UI, quand ils ont besoin de la même logique métier, alors ils réutilisent le même cas d'utilisation
6. Étant donné un besoin d'ajouter un cas d'utilisation, quand un développeur l'implémente, alors il suit un modèle cohérent et documenté

## Tâches

1. - [ ] Analyser l'architecture actuelle
   1. - [ ] Identifier les responsabilités dispersées dans les composants UI
   2. - [ ] Cartographier les opérations qui devraient être des cas d'utilisation
   3. - [ ] Identifier les patrons communs à standardiser
2. - [ ] Définir l'architecture de la couche d'application
   1. - [ ] Établir une structure de répertoires cohérente
   2. - [ ] Définir une interface standard pour les cas d'utilisation
   3. - [ ] Documenter le modèle à suivre pour de nouveaux cas d'utilisation
3. - [ ] Implémenter les cas d'utilisation prioritaires
   1. - [ ] Créer des cas d'utilisation pour la gestion du CV (création, mise à jour)
   2. - [ ] Implémenter des cas d'utilisation pour la manipulation des sections du CV
   3. - [ ] Développer les ports nécessaires pour l'infrastructure
4. - [ ] Refactoriser les composants UI existants
   1. - [ ] Extraire la logique métier des composants vers les cas d'utilisation
   2. - [ ] Mettre à jour les composants pour utiliser les cas d'utilisation
   3. - [ ] Vérifier que les fonctionnalités existantes continuent de fonctionner
5. - [ ] Mettre en place les fondations pour les fonctionnalités d'export
   1. - [ ] Définir les interfaces des cas d'utilisation pour l'export
   2. - [ ] Établir les ports pour les adaptateurs d'export
   3. - [ ] Créer des cas d'utilisation squelettes pour l'export et la sauvegarde
6. - [ ] Créer des tests pour les cas d'utilisation
   1. - [ ] Développer des tests unitaires pour chaque cas d'utilisation
   2. - [ ] Mettre en place des tests d'intégration entre les cas d'utilisation et le domaine
   3. - [ ] Vérifier que tous les tests passent

## Principes de Développement

#### Principes à Suivre

- **Responsabilité Unique (SRP)**: Chaque cas d'utilisation a une seule responsabilité
- **Inversion de Dépendance (DIP)**: Les cas d'utilisation dépendent des abstractions (ports)
- **Testabilité**: Conception facilitant les tests automatisés
- **Composition**: Favoriser la composition plutôt que l'héritage pour les cas d'utilisation complexes
- **Immutabilité**: Privilégier les structures de données immuables

#### À Éviter

- Mélange des responsabilités entre UI et logique métier
- Dépendances directes à l'infrastructure depuis les cas d'utilisation
- Duplication de logique métier entre différents cas d'utilisation
- Cas d'utilisation trop larges avec des responsabilités multiples
- Contamination des cas d'utilisation par la logique de présentation

## Risques et Hypothèses

| Risque                                           | Probabilité | Impact | Stratégie de mitigation                       |
| ------------------------------------------------ | ----------- | ------ | --------------------------------------------- |
| Refactorisation introduisant des régressions     | Moyenne     | Élevé  | Tests exhaustifs, approche incrémentale       |
| Sur-ingénierie de la couche d'application        | Moyenne     | Moyen  | Revues de code, focus sur les besoins réels   |
| Résistance au changement d'architecture          | Moyenne     | Moyen  | Documentation claire, formation de l'équipe   |
| Délai supplémentaire avant de commencer l'Epic-6 | Élevée      | Moyen  | Priorisation des cas d'utilisation essentiels |
| Complexité accrue pour les développeurs          | Moyenne     | Faible | Documentation avec exemples, modèles à suivre |

## Notes de Développement

### Structure de la couche d'application

```
packages/
  core/
    src/
      cv/
        application/
          use-cases/             # Cas d'utilisation
            resume/              # Groupés par fonctionnalité
              create-resume.use-case.ts
              update-resume.use-case.ts
            sections/
              work/
                add-work-experience.use-case.ts
                update-work-experience.use-case.ts
              education/
                add-education.use-case.ts
            export/
              export-to-json.use-case.ts
              export-to-pdf.use-case.ts
            import/
              import-from-json.use-case.ts
          ports/                 # Ports pour l'infrastructure
            storage/
              resume-storage.port.ts
            export/
              pdf-exporter.port.ts
              json-exporter.port.ts
            import/
              json-importer.port.ts
```

### Interface standard pour les cas d'utilisation

```typescript
// packages/core/src/shared/application/use-case.interface.ts

import { ResultType } from "../../shared/domain/result-type";

/**
 * Interface générique pour tous les cas d'utilisation
 * Suit le pattern Command pour les opérations
 */
export interface UseCase<TInput, TOutput> {
  /**
   * Exécute le cas d'utilisation avec les données d'entrée fournies
   * Retourne un ResultType contenant soit le résultat, soit une erreur
   */
  execute(input: TInput): Promise<ResultType<TOutput>>;
}

/**
 * Interface pour les cas d'utilisation sans données d'entrée
 */
export interface NoInputUseCase<TOutput> {
  execute(): Promise<ResultType<TOutput>>;
}

/**
 * Interface pour les cas d'utilisation sans valeur de retour
 */
export interface VoidOutputUseCase<TInput> {
  execute(input: TInput): Promise<ResultType<void>>;
}

/**
 * Interface pour les cas d'utilisation sans entrée ni sortie
 */
export interface NoInputVoidOutputUseCase {
  execute(): Promise<ResultType<void>>;
}
```

### Exemple d'implémentation d'un cas d'utilisation

```typescript
// packages/core/src/cv/application/use-cases/resume/create-resume.use-case.ts

import { UseCase } from "../../../../shared/application/use-case.interface";
import { ResultType } from "../../../../shared/domain/result-type";
import { Resume } from "../../../domain/entities/Resume";
import { ResumeStoragePort } from "../../ports/storage/resume-storage.port";
import { defaultI18nAdapter } from "../../../../shared/i18n/adapters/default-i18n.adapter";
import { DomainI18nPortInterface } from "../../../../shared/i18n/domain-i18n.port";

/**
 * Données d'entrée pour la création d'un CV
 */
export interface CreateResumeInput {
  title: string;
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  summary?: string;
  language?: string;
}

/**
 * Cas d'utilisation pour créer un nouveau CV
 */
export class CreateResumeUseCase implements UseCase<CreateResumeInput, Resume> {
  constructor(
    private readonly resumeStorage: ResumeStoragePort,
    private readonly i18n: DomainI18nPortInterface = defaultI18nAdapter
  ) {}

  /**
   * Crée un nouveau CV avec les informations de base
   */
  async execute(input: CreateResumeInput): Promise<ResultType<Resume>> {
    // Créer une nouvelle entité Resume
    const resumeResult = Resume.create(
      {
        title: input.title,
        basics: {
          name: input.name || "",
          email: input.email,
          phone: input.phone,
          url: input.website,
          summary: input.summary,
        },
        language: input.language || "fr",
      },
      this.i18n
    );

    // Si la création échoue, retourner l'erreur
    if (resumeResult.isFailure()) {
      return ResultType.failure(resumeResult.getError());
    }

    // Récupérer le CV créé
    const resume = resumeResult.getValue();

    // Sauvegarder dans le stockage
    const saveResult = await this.resumeStorage.save(resume);

    // Si la sauvegarde échoue, retourner l'erreur
    if (saveResult.isFailure()) {
      return ResultType.failure(saveResult.getError());
    }

    // Retourner le CV créé
    return ResultType.success(resume);
  }
}
```

### Exemple d'utilisation dans un composant Vue

```typescript
// packages/ui/src/modules/cv/presentation/pages/CreateResumePage.vue

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { CreateResumeUseCase, CreateResumeInput } from '@cv-generator/core/cv/application/use-cases/resume/create-resume.use-case';
import { LocalStorageResumeAdapter } from '@cv-generator/core/cv/infrastructure/adapters/storage/local-storage-resume.adapter';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';

const { t } = useI18n();
const router = useRouter();
const { showSuccess, showError } = useToast();

// Créer le cas d'utilisation avec son adaptateur
const resumeStorage = new LocalStorageResumeAdapter();
const createResumeUseCase = new CreateResumeUseCase(resumeStorage);

// État du formulaire
const title = ref('');
const name = ref('');
const email = ref('');
const phone = ref('');
const website = ref('');
const summary = ref('');
const isLoading = ref(false);

// Soumettre le formulaire
async function handleSubmit() {
  if (!title.value) {
    showError(t('errors.resume_title_required'));
    return;
  }

  isLoading.value = true;

  try {
    // Préparer les données d'entrée
    const input: CreateResumeInput = {
      title: title.value,
      name: name.value,
      email: email.value,
      phone: phone.value,
      website: website.value,
      summary: summary.value,
      language: 'fr'
    };

    // Exécuter le cas d'utilisation
    const result = await createResumeUseCase.execute(input);

    if (result.isSuccess()) {
      // Récupérer le CV créé
      const resume = result.getValue();

      showSuccess(t('success.resume_created'));

      // Rediriger vers l'édition du CV
      router.push({
        name: 'edit-resume',
        params: { id: resume.id }
      });
    } else {
      // Afficher l'erreur
      showError(result.getError().message);
    }
  } catch (error) {
    showError(t('errors.unexpected_error'));
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <!-- Interface utilisateur pour créer un CV -->
</template>
```

## Historique du Chat

**User:** Avant de se lancer dans l'EPIC 6, pourrais-tu analyser si l'application actuelle est robuste, stable et suffisamment bien conçue ? Il y a peut-être des améliorations à apporter.

**Assistant:** J'ai analysé l'architecture actuelle du projet et j'ai remarqué que la séparation des préoccupations n'est pas toujours respectée. Il y a notamment un manque de clarté dans la couche d'application qui devrait contenir les cas d'utilisation. Certains composants UI contiennent de la logique métier qui devrait être extraite.

**User:** Peux-tu me donner plus de détails sur ces problèmes de séparation des préoccupations ?

**Assistant:** J'ai observé que certains composants Vue manipulent directement les entités du domaine et contiennent de la logique qui devrait être encapsulée dans des cas d'utilisation dédiés. Par exemple, la logique d'ajout d'expériences professionnelles est parfois directement implémentée dans les composants, ce qui complique les tests et limite la réutilisabilité. Une couche d'application bien définie avec des cas d'utilisation clairs faciliterait l'implémentation des fonctionnalités d'export et de sauvegarde.

**User:** Comment pourrions-nous remédier à cette situation pour préparer l'Epic 6 ?

**Assistant:** Je recommande d'implémenter une couche d'application cohérente suivant les principes de Clean Architecture. Nous devrions créer des cas d'utilisation dédiés pour chaque opération métier (création de CV, ajout d'expérience, etc.), avec des interfaces claires (ports) pour l'interaction avec l'infrastructure. Cette couche servira de point central pour toute la logique métier et simplifiera grandement l'implémentation des fonctionnalités d'export et de sauvegarde, tout en rendant le code plus testable et maintenable.
