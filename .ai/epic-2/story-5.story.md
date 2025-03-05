# Epic-2: Refactorisation des Composants CV

# Story-5: Création du Composant DateRangeFields

## Story

**En tant que** développeur
**Je veux** extraire la logique de gestion des plages de dates dans un composant réutilisable
**afin de** standardiser la saisie des périodes, réduire la duplication de code et améliorer l'expérience utilisateur

## Status

Draft

## Context

Cette story fait partie de l'Epic-2 qui vise à refactoriser les composants du module CV. L'analyse des composants existants a révélé une duplication importante de code liée à la gestion des plages de dates (startDate, endDate, isCurrentlyWorking) dans plusieurs composants (WorkForm, EducationForm, VolunteerForm, etc.).

Actuellement, chaque composant nécessitant des plages de dates :

- Duplique les champs de formulaire pour les dates de début et de fin
- Réimplémente la logique de gestion de "période en cours"
- Gère de façon similaire la validation des dates (date de début antérieure à la date de fin)
- Duplique l'interface utilisateur pour ces champs

Cette duplication viole le principe DRY (Don't Repeat Yourself) et rend les composants plus difficiles à maintenir. L'extraction de cette logique dans un composant `DateRangeFields` permettra de standardiser la gestion des plages de dates à travers l'application.

### Technical Context

- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Structure de données JSON Resume avec plusieurs entités nécessitant des plages de dates
- Utilisation de composants Form et FormField existants
- Besoin de maintenir la cohérence de l'interface utilisateur
- Contrainte de performance (<500ms) mentionnée dans l'architecture

### Business Drivers

- Besoin d'améliorer la cohérence de l'interface utilisateur pour les plages de dates
- Réduction du temps de développement pour les nouvelles fonctionnalités
- Amélioration de la testabilité des manipulations de dates
- Réduction des risques de bugs liés à la validation des dates
- Amélioration de l'expérience utilisateur lors de la saisie des périodes

## Estimation

Story Points: 2 (2 jours de développement)

## Acceptance Criteria

1. Étant donné un formulaire nécessitant une plage de dates, quand le composant DateRangeFields est implémenté, alors il doit gérer correctement la saisie des dates de début et de fin
2. Étant donné une plage de dates, quand l'option "en cours" est sélectionnée, alors le champ de date de fin doit être désactivé et vidé
3. Étant donné une plage de dates, quand une date de début est saisie après la date de fin, alors une validation d'erreur appropriée doit s'afficher
4. Étant donné le composant DateRangeFields, quand il est utilisé dans différents formulaires, alors il doit maintenir une apparence et un comportement cohérents
5. Étant donné l'implémentation du composant, quand il est testé, alors il doit maintenir ou améliorer les performances actuelles (<500ms)
6. Étant donné le composant DateRangeFields, quand il est documenté, alors sa documentation doit inclure des exemples d'utilisation clairs

## Tasks

1. - [ ] Analyse Détaillée des Implémentations Existantes

   1. - [ ] Examiner la gestion des dates dans WorkForm
   2. - [ ] Examiner la gestion des dates dans EducationForm
   3. - [ ] Examiner la gestion des dates dans VolunteerForm
   4. - [ ] Identifier les patterns communs et les spécificités

2. - [ ] Conception du Composant DateRangeFields

   1. - [ ] Définir l'interface du composant (props, events)
   2. - [ ] Concevoir la structure du template
   3. - [ ] Concevoir la logique de validation
   4. - [ ] Définir la stratégie de gestion de "période en cours"

3. - [ ] Implémentation du Composant

   1. - [ ] Créer le fichier composant avec documentation JSDoc
   2. - [ ] Implémenter le template et la logique
   3. - [ ] Ajouter la gestion des cas particuliers
   4. - [ ] Optimiser les performances

4. - [ ] Tests Unitaires

   1. - [ ] Écrire les tests pour la saisie des dates
   2. - [ ] Écrire les tests pour l'option "en cours"
   3. - [ ] Écrire les tests pour la validation des dates
   4. - [ ] Écrire les tests de performance

5. - [ ] Refactorisation d'un Composant Pilote

   1. - [ ] Sélectionner un composant avec plage de dates pour la première implémentation
   2. - [ ] Refactoriser ce composant pour utiliser DateRangeFields
   3. - [ ] Vérifier le fonctionnement et les performances
   4. - [ ] Documenter les changements et les bénéfices

6. - [ ] Documentation
   1. - [ ] Documenter l'interface du composant
   2. - [ ] Créer des exemples d'utilisation
   3. - [ ] Documenter les bonnes pratiques
   4. - [ ] Mettre à jour la documentation de l'architecture

## Principes de Développement

#### Principes à Suivre

- **Simplicité**: Concevoir une API simple et intuitive
- **Cohérence**: Maintenir une apparence et un comportement cohérents avec le reste de l'application
- **Accessibilité**: S'assurer que le composant est accessible (ARIA, navigation clavier)
- **Réutilisabilité**: Concevoir le composant pour qu'il soit facilement réutilisable
- **Testabilité**: Concevoir le composant pour qu'il soit facilement testable
- **Documentation**: Documenter clairement l'interface et l'utilisation

#### À Éviter

- Créer une abstraction trop complexe ou trop spécifique
- Introduire des dépendances supplémentaires non nécessaires
- Modifier le comportement fonctionnel des composants existants
- Créer un composant qui viole le principe de responsabilité unique
- Utiliser des approches qui pourraient compromettre l'expérience utilisateur

## Risques et Hypothèses

| Risque                                                      | Impact | Probabilité | Mitigation                                          |
| ----------------------------------------------------------- | ------ | ----------- | --------------------------------------------------- |
| Incompatibilité avec certains cas d'utilisation spécifiques | Moyen  | Moyenne     | Analyse préalable approfondie et API extensible     |
| Dégradation de l'expérience utilisateur                     | Élevé  | Faible      | Tests utilisateurs et revues de design              |
| Complexité accrue de l'API                                  | Moyen  | Moyenne     | Conception itérative avec revues de code            |
| Problèmes de localisation des dates                         | Moyen  | Moyenne     | Support de l'internationalisation dès la conception |

## Notes de Développement

Le composant `DateRangeFields` devra suivre ces principes :

- Utiliser les composants Form et FormField existants
- Accepter des props pour les valeurs initiales (startDate, endDate, isCurrentlyWorking)
- Émettre des événements pour les changements de valeurs
- Gérer correctement la validation des dates
- Supporter la désactivation du champ de date de fin lorsque "en cours" est sélectionné
- Être fortement typé avec TypeScript
- Supporter l'internationalisation des libellés

### Exemple d'Interface Proposée

```vue
<template>
  <div class="date-range-fields">
    <FormField
      v-model="startDateModel"
      type="date"
      :label="startDateLabel"
      :placeholder="startDatePlaceholder"
      :error="startDateError"
      @update:model-value="handleStartDateChange"
    />

    <div class="currently-working">
      <input
        type="checkbox"
        :id="currentlyWorkingId"
        v-model="isCurrentlyWorkingModel"
        @change="handleCurrentlyWorkingChange"
      />
      <label :for="currentlyWorkingId">{{ currentlyWorkingLabel }}</label>
    </div>

    <FormField
      v-if="!isCurrentlyWorkingModel"
      v-model="endDateModel"
      type="date"
      :label="endDateLabel"
      :placeholder="endDatePlaceholder"
      :error="endDateError"
      @update:model-value="handleEndDateChange"
    />
  </div>
</template>

<script setup lang="ts">
// Implementation...
</script>
```

## Journal de Communication

- Giak: Nous avons besoin d'extraire la logique de gestion des plages de dates
- AiAgent: Je propose de créer un composant DateRangeFields réutilisable
- Giak: Comment allez-vous gérer la validation des dates?
- AiAgent: Le composant validera que la date de début est antérieure à la date de fin et gérera le cas "en cours"
- Giak: Assurez-vous que l'interface utilisateur reste cohérente avec le reste de l'application
- AiAgent: Je vais utiliser les composants Form et FormField existants pour maintenir la cohérence visuelle
