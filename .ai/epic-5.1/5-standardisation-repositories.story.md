# Epic-5: Amélioration de l'Architecture

Story-5: Standardisation des interfaces de repositories

## Description de la Story

**En tant qu'** équipe de développement du CV Generator  
**Je veux** standardiser les interfaces et implémentations des repositories  
**afin de** garantir une gestion de données cohérente et faciliter l'implémentation des fonctionnalités de sauvegarde et d'export

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-5 visant à améliorer l'architecture de l'application avant l'implémentation de l'Epic-6 (Export et sauvegarde du CV). L'analyse du code actuel a révélé des incohérences dans la façon dont les données sont gérées et stockées.

Le pattern Repository est utilisé pour abstraire la source de données, mais il n'existe pas de standard clair pour :

1. Les interfaces de repository à travers les différentes entités
2. Les méthodes de base communes à tous les repositories
3. L'interaction avec différents types de stockage (local, cloud)
4. La gestion des erreurs spécifiques à la persistance

Cette standardisation est particulièrement importante pour l'Epic-6 qui nécessitera de sauvegarder et d'exporter les CV dans différents formats et sur différentes plateformes. Une approche cohérente des repositories facilitera l'ajout de nouvelles sources de données et la gestion des différentes opérations de persistance.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. Étant donné un besoin de persistance, quand un développeur crée un nouveau repository, alors il suit un modèle standard et documenté
2. Étant donné une entité, quand elle doit être persistée, alors elle utilise un repository adhérant à l'interface standardisée
3. Étant donné plusieurs implémentations de repositories (local storage, cloud), quand elles sont utilisées, alors elles peuvent être permutées sans modifier les cas d'utilisation
4. Étant donné une opération de persistance, quand elle échoue, alors elle retourne un format d'erreur standardisé via le ResultType
5. Étant donné un besoin de récupérer des données avec filtrage, quand la méthode est appelée, alors elle utilise des critères de recherche standardisés

## Tâches

1. - [ ] Analyser les besoins en persistance de données
   1. - [ ] Identifier toutes les entités nécessitant un repository
   2. - [ ] Recenser les opérations communes (CRUD) et spécifiques
   3. - [ ] Analyser les patterns de requêtes et de filtrage
2. - [ ] Définir les interfaces standard des repositories
   1. - [ ] Créer une interface générique Repository<T> avec les méthodes de base
   2. - [ ] Définir des interfaces spécialisées pour les besoins spécifiques
   3. - [ ] Standardiser les patterns de gestion d'erreurs
3. - [ ] Implémenter des repositories de base
   1. - [ ] Créer une implémentation pour le stockage local (localStorage)
   2. - [ ] Préparer l'architecture pour d'autres implémentations (IndexedDB, cloud)
   3. - [ ] Tester les performances avec des ensembles de données variés
4. - [ ] Refactoriser les repositories existants
   1. - [ ] Adapter les repositories actuels aux nouvelles interfaces
   2. - [ ] Uniformiser la gestion des erreurs avec ResultType
   3. - [ ] Vérifier la compatibilité avec le code existant
5. - [ ] Préparer la migration vers des sources de données multiples
   1. - [ ] Implémenter une factory pour les repositories
   2. - [ ] Créer un mécanisme de configuration pour sélectionner la source
   3. - [ ] Documenter l'ajout de nouvelles implémentations
6. - [ ] Mettre à jour les tests unitaires
   1. - [ ] Développer des tests pour les interfaces communes
   2. - [ ] Créer des mocks standardisés pour les tests des cas d'utilisation
   3. - [ ] Vérifier que tous les tests passent

## Principes de Développement

#### Principes à Suivre

- **Interface Segregation (ISP)**: Interfaces spécifiques aux besoins des clients
- **Substitution de Liskov (LSP)**: Implémentations interchangeables des repositories
- **Gestion cohérente des erreurs**: Utilisation systématique du ResultType
- **Asynchronicité**: Toutes les opérations de persistance sont asynchrones (Promise)
- **Immutabilité**: Ne pas modifier les entités lors des opérations de lecture

#### À Éviter

- Dépendances spécifiques à une technologie de stockage dans les interfaces
- Logique métier dans les repositories (doit rester dans le domaine et l'application)
- Opérations de persistance synchrones bloquantes
- Duplication des méthodes et de la logique de persistance
- Types différents pour les erreurs de persistance

## Risques et Hypothèses

| Risque                                          | Probabilité | Impact | Stratégie de mitigation                        |
| ----------------------------------------------- | ----------- | ------ | ---------------------------------------------- |
| Performance dégradée avec la standardisation    | Moyenne     | Moyen  | Benchmarking, optimisations ciblées            |
| Complexité accrue pour les développeurs         | Faible      | Faible | Documentation claire, exemples                 |
| Compatibilité avec le code existant             | Moyenne     | Élevé  | Tests exhaustifs, approche incrémentale        |
| Difficulté à couvrir tous les cas d'utilisation | Moyenne     | Moyen  | Conception itérative, revues de code           |
| Surcharge de travail pour la migration          | Élevée      | Moyen  | Priorisation, focus sur les entities critiques |

## Notes de Développement

### Interface Repository générique

```typescript
// packages/core/src/shared/domain/repositories/repository.interface.ts

import { ResultType } from "../../domain/result-type";
import { Entity } from "../entities/entity.interface";

/**
 * Interface générique pour tous les repositories
 * T extend Entity pour garantir que seules les entités peuvent être persistées
 */
export interface Repository<T extends Entity> {
  /**
   * Trouver une entité par son identifiant unique
   */
  findById(id: string): Promise<ResultType<T>>;

  /**
   * Récupérer toutes les entités
   */
  findAll(): Promise<ResultType<T[]>>;

  /**
   * Sauvegarder une entité (création ou mise à jour)
   */
  save(entity: T): Promise<ResultType<T>>;

  /**
   * Supprimer une entité par son identifiant
   */
  delete(id: string): Promise<ResultType<void>>;

  /**
   * Vérifier si une entité avec cet identifiant existe
   */
  exists(id: string): Promise<ResultType<boolean>>;
}

/**
 * Interface pour les repositories avec support de filtrage
 */
export interface FilterableRepository<T extends Entity, F>
  extends Repository<T> {
  /**
   * Trouver des entités selon des critères de filtrage
   */
  findByFilter(filter: F): Promise<ResultType<T[]>>;

  /**
   * Compter le nombre d'entités correspondant aux critères
   */
  countByFilter(filter: F): Promise<ResultType<number>>;
}
```

### Implémentation LocalStorage

```typescript
// packages/core/src/shared/infrastructure/repositories/local-storage-repository.base.ts

import { ResultType } from "../../domain/result-type";
import { Entity } from "../../domain/entities/entity.interface";
import { Repository } from "../../domain/repositories/repository.interface";
import { defaultI18nAdapter } from "../../../shared/i18n/adapters/default-i18n.adapter";
import { DomainI18nPortInterface } from "../../../shared/i18n/domain-i18n.port";

/**
 * Implémentation de base pour le stockage local
 * Cette classe abstraite fournit les fonctionnalités communes à
 * tous les repositories utilisant localStorage
 */
export abstract class LocalStorageRepositoryBase<T extends Entity>
  implements Repository<T>
{
  constructor(
    protected readonly storageKey: string,
    protected readonly i18n: DomainI18nPortInterface = defaultI18nAdapter
  ) {}

  /**
   * Méthode abstraite que les classes filles doivent implémenter
   * pour reconstituer une entité à partir des données brutes
   */
  protected abstract deserialize(data: any): ResultType<T>;

  /**
   * Récupère toutes les données stockées pour ce repository
   */
  protected getStoredData(): Record<string, any> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      return {};
    }
  }

  /**
   * Sauvegarde les données dans localStorage
   */
  protected saveData(data: Record<string, any>): ResultType<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return ResultType.success(undefined);
    } catch (error) {
      return ResultType.failure({
        message: this.i18n.translate("errors.storage.save_failed"),
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Implémentation des méthodes de l'interface Repository
   */
  async findById(id: string): Promise<ResultType<T>> {
    try {
      const data = this.getStoredData();
      const entityData = data[id];

      if (!entityData) {
        return ResultType.failure({
          message: this.i18n.translate("errors.entity.not_found"),
          details: { id },
        });
      }

      return this.deserialize(entityData);
    } catch (error) {
      return ResultType.failure({
        message: this.i18n.translate("errors.storage.retrieve_failed"),
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async findAll(): Promise<ResultType<T[]>> {
    try {
      const data = this.getStoredData();
      const entities: T[] = [];
      const errors: string[] = [];

      for (const [id, entityData] of Object.entries(data)) {
        const result = await this.deserialize(entityData);
        if (result.isSuccess()) {
          entities.push(result.getValue());
        } else {
          errors.push(`ID ${id}: ${result.getError().message}`);
        }
      }

      if (errors.length > 0 && entities.length === 0) {
        return ResultType.failure({
          message: this.i18n.translate("errors.storage.deserialize_all_failed"),
          details: errors,
        });
      }

      return ResultType.success(entities);
    } catch (error) {
      return ResultType.failure({
        message: this.i18n.translate("errors.storage.retrieve_all_failed"),
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async save(entity: T): Promise<ResultType<T>> {
    try {
      const data = this.getStoredData();
      data[entity.id] = entity.toJSON();

      const saveResult = this.saveData(data);
      if (saveResult.isFailure()) {
        return ResultType.failure(saveResult.getError());
      }

      return ResultType.success(entity);
    } catch (error) {
      return ResultType.failure({
        message: this.i18n.translate("errors.storage.save_entity_failed"),
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async delete(id: string): Promise<ResultType<void>> {
    try {
      const data = this.getStoredData();

      if (!data[id]) {
        return ResultType.failure({
          message: this.i18n.translate("errors.entity.not_found"),
          details: { id },
        });
      }

      delete data[id];
      return this.saveData(data);
    } catch (error) {
      return ResultType.failure({
        message: this.i18n.translate("errors.storage.delete_failed"),
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async exists(id: string): Promise<ResultType<boolean>> {
    try {
      const data = this.getStoredData();
      return ResultType.success(id in data);
    } catch (error) {
      return ResultType.failure({
        message: this.i18n.translate("errors.storage.check_failed"),
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
```

### Exemple de repository spécifique

```typescript
// packages/core/src/cv/infrastructure/repositories/resume-repository.ts

import { Resume } from "../../domain/entities/Resume";
import { ResultType } from "../../../shared/domain/result-type";
import { LocalStorageRepositoryBase } from "../../../shared/infrastructure/repositories/local-storage-repository.base";
import { ResumeRepositoryPort } from "../../application/ports/repositories/resume-repository.port";
import { ResumeFilter } from "../../application/ports/repositories/resume-filter.interface";

/**
 * Port pour le repository de CV
 * Étend l'interface générique et ajoute des méthodes spécifiques au domaine
 */
export interface ResumeRepositoryPort extends Repository<Resume> {
  /**
   * Trouver des CV par titre
   */
  findByTitle(title: string): Promise<ResultType<Resume[]>>;

  /**
   * Filtrer les CV selon divers critères
   */
  findByFilter(filter: ResumeFilter): Promise<ResultType<Resume[]>>;
}

/**
 * Implémentation du repository de CV utilisant localStorage
 */
export class LocalStorageResumeRepository
  extends LocalStorageRepositoryBase<Resume>
  implements ResumeRepositoryPort
{
  constructor() {
    super("cv-generator-resumes");
  }

  protected deserialize(data: any): ResultType<Resume> {
    return Resume.fromJSON(data, this.i18n);
  }

  /**
   * Implémente les méthodes spécifiques au repository de CV
   */
  async findByTitle(title: string): Promise<ResultType<Resume[]>> {
    try {
      const allResult = await this.findAll();

      if (allResult.isFailure()) {
        return ResultType.failure(allResult.getError());
      }

      const resumes = allResult.getValue();
      const filtered = resumes.filter((resume) =>
        resume.title.toLowerCase().includes(title.toLowerCase())
      );

      return ResultType.success(filtered);
    } catch (error) {
      return ResultType.failure({
        message: this.i18n.translate("errors.resume.find_by_title_failed"),
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async findByFilter(filter: ResumeFilter): Promise<ResultType<Resume[]>> {
    try {
      const allResult = await this.findAll();

      if (allResult.isFailure()) {
        return ResultType.failure(allResult.getError());
      }

      const resumes = allResult.getValue();
      const filtered = resumes.filter((resume) => {
        let matches = true;

        if (filter.title) {
          matches =
            matches &&
            resume.title.toLowerCase().includes(filter.title.toLowerCase());
        }

        if (filter.language) {
          matches = matches && resume.language === filter.language;
        }

        // Autres critères de filtrage

        return matches;
      });

      return ResultType.success(filtered);
    } catch (error) {
      return ResultType.failure({
        message: this.i18n.translate("errors.resume.filter_failed"),
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
```

## Historique du Chat

**User:** Avant de se lancer dans l'EPIC 6, pourrais-tu analyser si l'application actuelle est robuste, stable et suffisamment bien conçue ? Il y a peut-être des améliorations à apporter.

**Assistant:** J'ai analysé l'architecture actuelle et j'ai remarqué que les repositories ne suivent pas toujours les mêmes patterns. Cela pourrait poser problème lors de l'implémentation des fonctionnalités d'export et de sauvegarde qui nécessiteront d'interagir avec différentes sources de données.

**User:** Quels problèmes spécifiques as-tu identifiés avec les repositories actuels ?

**Assistant:** J'ai observé plusieurs incohérences. Certains repositories ont des méthodes avec des signatures différentes pour des opérations similaires, la gestion des erreurs n'est pas standardisée, et il n'existe pas de structure claire pour gérer différentes sources de données (localStorage, cloud, etc.). Pour l'Epic 6, nous aurons besoin de sauvegarder les CV dans différents formats et sur différentes plateformes, ce qui nécessite une approche plus cohérente.

**User:** Comment pourrions-nous standardiser ces repositories pour préparer l'Epic 6 ?

**Assistant:** Je recommande de créer une interface Repository générique qui définit les opérations de base (CRUD) et de s'assurer que toutes les implémentations suivent cette interface. Nous devrions également standardiser la gestion des erreurs avec le pattern ResultType, implémenter une classe de base pour le stockage local, et préparer l'architecture pour d'autres types de stockage. Cette standardisation facilitera l'ajout des fonctionnalités d'export et de sauvegarde en nous permettant de permuter facilement entre différentes sources de données.
