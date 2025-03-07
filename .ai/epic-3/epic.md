# Epic-3: Édition de CV

## Statut: En cours (95% complété)

**Date de début**: 2025-03-10
**Date de fin prévue**: 2025-04-15
**Responsable**: Giak

## Description

Cet Epic concerne le développement de l'ensemble des formulaires d'édition nécessaires à la création et à la modification d'un CV complet selon le standard JSON Resume. L'utilisateur doit pouvoir saisir toutes les informations requises avec une validation en temps réel et une sauvegarde automatique des données.

## Objectifs

- Développer des formulaires intuitifs pour toutes les sections du format JSON Resume
- Implémenter une validation en temps réel des données saisies
- Assurer la sauvegarde automatique des données dans le localStorage
- Créer une interface utilisateur cohérente et facile à utiliser
- Garantir la conformité avec le standard JSON Resume pour toutes les sections

## Dépendances

- Epic-1: Configuration initiale du projet (Complété)
- Epic-2: Refactorisation et optimisation des composants (Complété)

## Impact sur

- Epic-4: Export de CV (Planifié)

## Liste des Stories

| ID    | Titre                                                                       | Statut            | Points | Priorité |
| ----- | --------------------------------------------------------------------------- | ----------------- | ------ | -------- |
| S-1   | Finalisation des formulaires d'édition de CV                                | Terminée (100%)   | 13     | Élevée   |
| S-2   | Implémentation des formulaires de compétences                               | Terminée (100%)   | 5      | Moyenne  |
| S-3   | Finalisation des formulaires d'éducation et de formations                   | Terminée (100%)   | 8      | Élevée   |
| S-4   | Implémentation des formulaires de projets                                   | Terminée (100%)   | 8      | Moyenne  |
| S-5   | Finalisation et Optimisation des Formulaires CV Existants                   | Terminée (100%)   | 8      | Élevée   |
| S-5.1 | Fusion des Composants de Navigation pour une Expérience Utilisateur Unifiée | Terminée (100%)   | 5      | Élevée   |
| S-6   | Implémentation du Tri Chronologique et Navigation Entre Formulaires         | Terminée (100%)   | 5      | Élevée   |
| S-7   | Finalisation Globale et Consolidation de l'Epic-3                           | In Progress (70%) | 8      | Critique |

## Progression

- Formulaires de base (informations personnelles): 100%
- Formulaires d'expérience professionnelle: 100%
- Formulaires d'éducation: 100%
- Formulaires de compétences: 100%
- Formulaires de projets: 100%
- Formulaires de bénévolat: 100%
- Formulaires de publications: 100%
- Formulaires de certificats: 100%
- Formulaires de distinctions: 100%
- Formulaires de langues: 100%
- Formulaires d'intérêts: 100%
- Formulaires de références: 100%
- Navigation entre formulaires: 100%
- Tests et documentation: 60%
- Tri chronologique: 100%

## Critères de Succès

- Tous les formulaires sont fonctionnels et permettent la saisie complète d'un CV
- La validation des données est effectuée en temps réel avec des messages d'erreur contextuels
- Les données sont automatiquement sauvegardées dans le localStorage
- L'interface utilisateur est intuitive et cohérente entre les différentes sections
- Les formulaires respectent les standards d'accessibilité WCAG 2.1 AA
- Les tests unitaires couvrent au moins 80% du code
- Les entrées chronologiques sont correctement triées et organisées
- La navigation entre formulaires est intuitive et indique clairement la progression

## Risques Identifiés

| Risque                                               | Impact | Probabilité | Mitigation                                                  |
| ---------------------------------------------------- | ------ | ----------- | ----------------------------------------------------------- |
| Complexité excessive des formulaires                 | Élevé  | Faible      | Design UX simplifié et feedback utilisateur précoce         |
| Incohérence entre les sections du CV                 | Moyen  | Faible      | Définition claire des standards et revue régulière          |
| Performance lente avec beaucoup de données           | Moyen  | Moyenne     | Optimisation de la gestion d'état et tests de charge        |
| Validation insuffisante des données                  | Élevé  | Faible      | Tests exhaustifs et validation multi-niveaux                |
| Compatibilité du format d'export                     | Moyen  | Moyenne     | Adhérence stricte au standard JSON Resume                   |
| Complexité des listes imbriquées                     | Élevé  | Faible      | Conception UI/UX optimisée et tests utilisateurs            |
| Conflit entre tri automatique et ordre personnalisé  | Moyen  | Faible      | Flags d'état clairs et tests d'interaction rigoureux        |
| Retard dans la finalisation des formulaires restants | Élevé  | Faible      | Story de consolidation spécifique (S-7) avec vision globale |

## Points Techniques Clés

- Utilisation des composables Vue.js pour la logique de formulaire
- Validation multi-niveaux (UI, composants, état global)
- Architecture Clean avec séparation des responsabilités
- Gestion d'état via Pinia
- Fonctionnalité de drag-and-drop standardisée pour toutes les listes
- Algorithmes de tri optimisés pour les listes chronologiques
- Système de navigation intuitive entre formulaires

## Revue et Validation

La validation de l'Epic sera effectuée par:

- Tests unitaires automatisés pour chaque composant
- Tests d'intégration pour l'ensemble des formulaires
- Test utilisateur avec un panel représentatif
- Revue de code par les pairs
- Validation finale par le Product Owner

## Notes et Décisions

- Tous les formulaires utiliseront une structure commune pour maximiser la réutilisation
- Chaque composant de formulaire sera accompagné d'un composant de liste correspondant
- L'approche de validation sera progressive (premier feedback après perte de focus)
- Les données seront sauvegardées automatiquement à chaque modification validée
- Le tri chronologique sera activé par défaut mais pourra être personnalisé via drag-and-drop
- Une story de consolidation (S-7) a été ajoutée pour garantir la finalisation complète de l'Epic
- Les composants WorkForm.vue et WorkList.vue servent de référence pour l'implémentation des autres composants de formulaire et de liste
- Tous les formulaires ont été finalisés selon les standards établis et sont maintenant fonctionnels à 100%
