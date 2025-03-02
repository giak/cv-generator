# Stories du Projet CV Generator

Ce répertoire contient les user stories du projet CV Generator, structurées selon le template standardisé défini dans la règle `903-story-template-standardized.mdc`.

## Organisation des stories

Les stories sont organisées par Epic, avec la structure suivante:

- **Epic-0: Project Maintenance and Optimization**

  - Objectif: Amélioration et maintenance du projet
  - Stories:
    - [Story-5: Optimisation des Performances de l'Application](story-performance-optimization.story.md)

- **Epic-2: Sections Avancées**
  - Objectif: Enrichissement des fonctionnalités au-delà du MVP
  - Stories:
    - [Story-1: Implémentation des Formats d'Export HTML et PDF](story-export-formats.story.md)
    - [Story-2: Implémentation de la Prévisualisation du CV](story-cv-preview.story.md)
    - [Story-3: Implémentation des Conseils d'Optimisation ATS](story-ats-optimization.story.md)

## Statut global du projet

- **Fonctionnalités implémentées**:

  - ✅ Structure de données basée sur JSON Resume
  - ✅ Validation avec Zod et Value Objects
  - ✅ Persistance localStorage
  - ✅ Formulaires pour informations de base et expérience professionnelle
  - ✅ Tests unitaires pour le domaine core (couverture: 83%)
  - ✅ Export au format JSON

- **Fonctionnalités en cours**:

  - 🔄 Formulaires d'éducation (60% complété)
  - 🔄 Export HTML et PDF
  - 🔄 Amélioration UX des formulaires
  - 🔄 Tests E2E

- **Fonctionnalités planifiées**:
  - ⏳ Prévisualisation du CV
  - ⏳ Conseils d'optimisation ATS
  - ⏳ Templates multiples pour l'export
  - ⏳ Améliorations de performance

## Priorités de développement

1. **Priorité Haute**:

   - Export HTML et PDF (Story-1)

2. **Priorité Moyenne**:

   - Prévisualisation du CV (Story-2)
   - Conseils d'optimisation ATS (Story-3)

3. **Priorité Basse**:
   - Optimisation des performances (Story-5)

## Guide pour créer de nouvelles stories

Pour ajouter une nouvelle story, suivez ces étapes:

1. Créez un nouveau fichier dans ce répertoire avec le format `story-{nom-descriptif}.story.md`
2. Suivez le template standardisé défini dans `903-story-template-standardized.mdc`
3. Assurez-vous d'inclure toutes les sections obligatoires
4. Mettez à jour ce README.md pour référencer la nouvelle story

## Contribution

Avant de contribuer à une story:

1. Assurez-vous de comprendre les dépendances entre stories
2. Vérifiez que la story est cohérente avec l'architecture et les principes du projet
3. Suivez strictement le template pour garantir la cohérence

## Liens utiles

- [Document d'Architecture](.ai/arch.md)
- [Product Requirements Document (PRD)](.ai/prd.md)
- [Document de Fondation du Projet](project-foundation.md)
