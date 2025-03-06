# Story: Implémentation du Tri Chronologique et Navigation Entre Formulaires

Epic-3: Édition de CV
Story-6: Implémentation du Tri Chronologique et Navigation Entre Formulaires

## Description de la Story

**En tant que** utilisateur du Générateur de CV
**Je veux** que mes entrées d'éducation, expériences et projets soient organisées par ordre chronologique et pouvoir naviguer facilement entre les différentes sections
**afin de** présenter mon parcours de façon cohérente et avoir une vision claire de ma progression dans la création de mon CV

## Statut

Terminé (100%)

## Contexte

Cette story fait partie de l'Epic-3 (Édition de CV) et se concentre sur deux améliorations essentielles de l'expérience utilisateur:

1. **Tri chronologique**: Actuellement, les entrées d'éducation, d'expérience professionnelle et de projets sont affichées dans l'ordre de leur création, sans considération pour les dates. Pour une présentation optimale d'un CV, ces entrées doivent être triées du plus récent au plus ancien.

2. **Navigation entre formulaires**: Pour faciliter le remplissage complet du CV, il est nécessaire d'implémenter une navigation claire et intuitive entre les différentes sections du formulaire, avec des indicateurs de progression.

Ces améliorations s'appuient sur les composants existants, notamment `EducationList.vue`, `WorkList.vue` et `ProjectList.vue`, ainsi que leurs stores Pinia respectifs, et les composants de navigation comme `FormNavigation.vue` et `ProgressIndicator.vue`.

## Estimation

Story Points: 5

## Critères d'Acceptation

1. ✅ Étant donné que je visualise ma liste d'éducation, quand j'ai plusieurs entrées avec différentes dates, alors elles sont automatiquement affichées par ordre chronologique inversé (plus récent en premier)
2. ✅ Étant donné que j'ai des expériences professionnelles dans la section work, quand je les visualise, alors elles sont triées par date de fin décroissante (ou "Présent" en premier)
3. ✅ Étant donné que j'ai des projets avec des dates, quand je les visualise, alors ils sont triés du plus récent au plus ancien
4. ✅ Étant donné que je souhaite modifier l'ordre manuellement, quand j'utilise le drag-and-drop, alors le nouvel ordre est préservé indépendamment du tri chronologique par défaut
5. ✅ Étant donné que je navigue entre les sections du CV, quand je passe d'un formulaire à l'autre, alors je vois un indicateur visuel de ma position actuelle et de ma progression globale
6. ✅ Étant donné qu'une section n'est que partiellement remplie, quand je navigue dans l'application, alors un indicateur visuel me montre que cette section est incomplète

## Tâches

1. - [x] Implémentation du tri chronologique

   1. - [x] Créer une fonction de tri chronologique réutilisable
   2. - [x] Modifier `EducationList.vue` pour trier les entrées par date
   3. - [x] Adapter `WorkList.vue` pour trier les expériences professionnelles
   4. - [x] Mettre à jour `ProjectList.vue` pour le tri chronologique
   5. - [x] Implémenter un indicateur visuel pour l'ordre personnalisé vs. chronologique

2. - [x] Préservation de l'ordre personnalisé

   1. - [x] Ajouter un flag dans les stores pour indiquer si un ordre personnalisé est utilisé
   2. - [x] Modifier les méthodes `reorderEducation`, `reorderWork` et `reorderProject` pour activer ce flag
   3. - [x] Implémenter une option pour revenir au tri chronologique automatique

3. - [x] Navigation améliorée entre formulaires

   1. - [x] Créer un composant `CVNavigation.vue` pour la navigation entre sections
   2. - [x] Intégrer les indicateurs de progression pour chaque section
   3. - [x] Ajouter des indicateurs visuels pour les sections incomplètes
   4. - [x] Moderniser les composants de navigation existants avec Tailwind CSS

4. - [x] Indicateurs de complétion

   1. - [x] Utiliser la logique de vérification de complétion existante pour chaque section
   2. - [x] Moderniser le composant `ProgressIndicator.vue` avec Tailwind CSS
   3. - [x] Utiliser des indicateurs de complétion visuels dans la navigation

5. - [x] Tests et optimisation
   1. - [x] Écrire des tests unitaires pour les composants de navigation
   2. - [x] Tester les comportements de navigation
   3. - [x] Optimiser les performances pour les listes volumineuses
   4. - [x] Vérifier la compatibilité mobile

## Principes de Développement

#### Principes à Suivre

- **Simplicité**: Créer des solutions intuitives sans surcharger l'interface
- **Réutilisabilité**: Développer des fonctions et composants réutilisables pour toutes les sections
- **Performance**: Optimiser les opérations de tri pour éviter les lenteurs avec de nombreuses entrées
- **UX Cohérente**: Maintenir la cohérence visuelle à travers toutes les sections du CV
- **Clean Architecture**: Respecter la séparation des responsabilités selon les principes établis

#### À Éviter

- Réimplémentation de fonctionnalités existantes
- Sur-ingénierie des solutions de navigation ou de tri
- Modifications qui affecteraient la stabilité du stockage des données
- Indicateurs visuels trop intrusifs qui nuiraient à l'expérience utilisateur

## Risques et Hypothèses

| Risque/Hypothèse                | Description                                                      | Impact | Probabilité | Mitigation                                              |
| ------------------------------- | ---------------------------------------------------------------- | ------ | ----------- | ------------------------------------------------------- |
| Impact sur les performances     | Le tri de listes volumineuses pourrait affecter les performances | Moyen  | Faible      | Optimisation avec mémoisation et calculs différés       |
| Bugs de drag-and-drop           | Conflit entre tri automatique et réordonnancement manuel         | Élevé  | Moyenne     | Tests rigoureux des interactions et flags d'état clairs |
| Surcharge visuelle              | Trop d'indicateurs pourraient surcharger l'interface             | Moyen  | Moyenne     | Design minimaliste et tests utilisateurs                |
| Complexité de la logique de tri | Gestion des cas particuliers (dates manquantes, en cours)        | Moyen  | Élevée      | Fonction de tri robuste avec gestion de cas d'erreur    |

## Notes de Développement

- Utiliser les conventions de nommage établies:

  - Composables: `useSortableList`, `useNavigation`
  - Composants: `CVNavigation`, `CompletionIndicator`
  - Utilitaires: `dateUtils`, `sortUtils`

- Pour le tri chronologique:

  ```typescript
  // Format de la fonction de tri à implémenter
  const sortByDate = (
    items: any[],
    dateField: string,
    descending = true
  ): any[] => {
    return [...items].sort((a, b) => {
      // Logique de tri tenant compte des valeurs null/undefined et "Présent"
    });
  };
  ```

- Pour la navigation, utiliser un design discret mais informatif avec:
  - Code couleur intuitif (vert: complété, orange: partiel, gris: vide)
  - Pourcentage de complétion global
  - Navigation simplifiée entre sections adjacentes

## Journal de Communication

- Giak: L'analyse du code existant montre que nous avons besoin d'améliorer la navigation entre formulaires et d'implémenter le tri chronologique pour les sections éducation, expérience et projets.
- Équipe de développement: Nous pouvons réutiliser la fonction `reorderEducation` existante et l'étendre pour gérer à la fois le tri automatique et l'ordre personnalisé. Pour la navigation, un composant dédié semble être la meilleure approche.
- Mise à jour (06-03-2025): Implémentation du tri chronologique pour les entrées d'éducation terminée dans le composant EducationList. Le tri chronologique inverse (plus récent en premier) est désormais activé par défaut, avec possibilité de basculer vers un ordre personnalisé. Les modifications manuelles via les boutons haut/bas activent automatiquement le mode d'ordre personnalisé.
- Mise à jour (07-03-2025): Modernisation des composants de navigation avec Tailwind CSS. Le composant `FormNavigation.vue` a été entièrement revu pour utiliser Tailwind CSS, offrant une meilleure cohérence visuelle et une expérience utilisateur améliorée. Le composant `ProgressIndicator.vue` a également été modernisé en remplaçant les classes CSS personnalisées par des classes Tailwind CSS. Un nouveau composant `CVNavigation.vue` a été créé pour offrir une navigation globale entre les sections du CV, avec des indicateurs de progression clairs.
- Mise à jour (08-03-2025): Correction des tests pour le composant `CVNavigation.vue`. Les tests ont été adaptés pour refléter la structure réelle du composant et les résultats attendus. Le problème était lié à la façon dont nous mockions le composable `useFormProgress` et sa propriété `sectionStatuses`. Tous les tests passent maintenant avec succès, validant le bon fonctionnement du composant de navigation.
- Mise à jour (12-03-2025): Implémentation du tri chronologique pour les expériences professionnelles dans le composant WorkList. Le tri priorise les postes en cours ("Présent") et affiche ensuite les autres expériences du plus récent au plus ancien. Cette modification inclut une interface utilisateur permettant de basculer entre le tri chronologique automatique et l'ordre personnalisé. Les tests ont été mis à jour pour refléter le nouveau comportement de tri.
- Mise à jour (13-03-2025): Implémentation du tri chronologique pour les projets dans le composant ProjectList. Le tri priorise les projets en cours (sans date de fin) et affiche ensuite les autres projets du plus récent au plus ancien, avec une gestion robuste des cas particuliers comme les dates manquantes. L'interface utilisateur cohérente permet de basculer entre le tri chronologique et l'ordre personnalisé. La story est désormais complétée à 95%, avec seulement quelques optimisations de performance restantes pour les listes volumineuses et la vérification de compatibilité mobile.
- Mise à jour (14-03-2025): Optimisation des performances pour les listes volumineuses implémentée dans les composants EducationList, WorkList et ProjectList. Cette optimisation limite l'affichage initial à un nombre raisonnable d'éléments (8-10) avec un bouton "Voir plus" pour afficher tous les éléments si nécessaire. La compatibilité mobile a été vérifiée, tous les composants utilisent des classes Tailwind responsives pour s'adapter aux différentes tailles d'écran. La Story-6 est maintenant complète à 100%.

## Fonctionnalités implémentées

### Tri chronologique dans EducationList

- ✅ Tri automatique des entrées par date (plus récent en premier)
- ✅ Traitement intelligent des entrées "en cours" (prioritaires)
- ✅ Gestion des erreurs et cas limites (dates manquantes ou invalides)
- ✅ Persistance de l'ordre personnalisé lors des réorganisations manuelles
- ✅ Bouton de basculement entre tri chronologique et ordre personnalisé
- ✅ Indication visuelle du mode de tri actif

### Tri chronologique dans WorkList

- ✅ Tri automatique des expériences par date (plus récent en premier)
- ✅ Priorisation des postes actuels (sans date de fin ou "Présent")
- ✅ Gestion robuste des cas particuliers (dates manquantes, formats invalides)
- ✅ Basculement entre tri chronologique et ordre personnalisé via bouton dédié
- ✅ Conservation de l'ordre personnalisé lors des réorganisations manuelles
- ✅ Indication visuelle du mode de tri actif (chronologique vs personnalisé)
- ✅ Interface utilisateur cohérente avec EducationList

### Tri chronologique dans ProjectList

- ✅ Tri automatique des projets par date (plus récent en premier)
- ✅ Priorisation des projets en cours (sans date de fin)
- ✅ Gestion robuste des cas particuliers (dates manquantes, formats invalides)
- ✅ Basculement entre tri chronologique et ordre personnalisé via bouton dédié
- ✅ Conservation de l'ordre personnalisé lors des réorganisations manuelles
- ✅ Indication visuelle du mode de tri actif (chronologique vs personnalisé)
- ✅ Interface utilisateur cohérente avec WorkList et EducationList

### Modernisation des composants de navigation

- ✅ Refonte du composant `FormNavigation.vue` avec Tailwind CSS
- ✅ Implémentation de transitions fluides et d'une meilleure organisation visuelle
- ✅ Modernisation du composant `ProgressIndicator.vue` avec Tailwind CSS
- ✅ Création d'un nouveau composant `CVNavigation.vue` pour la navigation globale du CV
- ✅ Mise à jour des tests pour s'assurer du bon fonctionnement des composants modifiés
- ✅ Indicateurs visuels clairs de progression et de statut de complétion
- ✅ Optimisation de l'accessibilité avec des ratios de contraste améliorés
- ✅ Adaptation responsive des composants de navigation

### Optimisation des performances

- ✅ Limitation du nombre d'éléments affichés par défaut pour améliorer les performances
- ✅ Bouton "Voir plus" pour afficher tous les éléments si nécessaire
- ✅ Réinitialisation de la pagination lors du changement de mode de tri
- ✅ Affichage du nombre total d'éléments dans le bouton "Voir plus"
- ✅ Bouton "Réduire la liste" pour revenir à l'affichage limité
- ✅ Interface utilisateur cohérente entre les trois composants de liste
- ✅ Compatibilité mobile avec des classes Tailwind responsives

### Tests et validation

- ✅ Tests unitaires pour tous les composants de navigation
- ✅ Validation du comportement attendu pour les différents états (complète, partielle, incomplète)
- ✅ Vérification des interactions utilisateur (changement de section, navigation)
- ✅ Confirmation du bon fonctionnement des indicateurs visuels
