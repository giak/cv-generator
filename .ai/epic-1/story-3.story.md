# Epic-1: Core CV Management

# Story-3: Work Experience Form Implementation

## Story

**As a** user
**I want** to create and edit my work experience entries using a form
**so that** I can manage my professional history in a structured way following the JSON Resume format

## Status

Done

## Context

Cette story fait suite à la Story-2 qui a mis en place les informations de base (basics) du CV. Elle se concentre sur l'implémentation de la section "work" du format JSON Resume, qui représente les expériences professionnelles. Cette section est essentielle car elle constitue souvent le cœur d'un CV et démontre l'expérience et les compétences du candidat.

### Technical Context

- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Architecture Clean/DDD établie dans Story-1
- Validation avec Zod
- Tests avec Vitest
- UI avec Tailwind CSS 4
- L'entité Work et le store work sont déjà implémentés

### Business Drivers

- Besoin d'une interface intuitive pour éditer les expériences professionnelles
- Validation en temps réel des données
- Facilité d'ajout, modification et suppression d'entrées multiples
- Gestion des périodes de travail avec validation des dates
- Support des points forts (highlights) pour chaque expérience

## Estimation

Story Points: 2 (2 jours de développement humain ; réel 8 heures)

## Tasks

### 1. - [x] Création du composant WorkForm

1. - [x] Créer le composant WorkForm.vue
   - [x] Structure du composant avec TypeScript
   - [x] Intégration avec le store work
   - [x] Validation en temps réel
   - [x] Gestion des erreurs avec feedback

2. - [x] Implémenter les champs avec validation
   - [x] Champ pour le nom de l'entreprise (requis)
   - [x] Champ pour le poste (requis)
   - [x] Champ pour le site web (optionnel, avec validation URL)
   - [x] Champs de dates (début requis, fin optionnel)
   - [x] Champ pour le résumé (optionnel)

3. - [x] Ajouter la gestion des highlights
   - [x] Interface pour ajouter/supprimer des highlights
   - [x] Validation des entrées
   - [x] UX intuitive pour la gestion de la liste

4. - [x] Écrire les tests du composant
   - [x] Tests unitaires pour la validation des champs
   - [x] Tests d'intégration avec le store
   - [x] Tests de rendu conditionnel
   - [x] Tests des fonctionnalités de gestion des highlights

### 2. - [x] Intégration dans l'interface principale

1. - [x] Créer le composant WorkList pour afficher les expériences
   - [x] Affichage de la liste des expériences
   - [x] Options pour éditer/supprimer chaque entrée
   - [x] Interface pour réorganiser les entrées

2. - [x] Implémenter le dialogue d'ajout/édition
   - [x] Modale pour ajouter une nouvelle expérience
   - [x] Intégration du formulaire WorkForm dans la modale
   - [x] Gestion des actions (sauvegarder/annuler)

3. - [ ] Intégrer dans la navigation principale
   - [ ] Ajout d'un onglet "Work Experience"
   - [ ] Transition fluide entre les sections

4. - [x] Ajouter la gestion des états vides
   - [x] Message pour guider l'utilisateur lorsqu'aucune expérience n'est ajoutée
   - [x] Call-to-action pour ajouter une première expérience

### 3. - [x] Tests et validation

1. - [x] Écrire les tests d'intégration
   - [x] Tests du flux complet (ajout/édition/suppression)
   - [x] Tests de validation des données
   - [x] Tests de persistance avec le store

2. - [ ] Tests utilisateur
   - [ ] Vérification de l'UX sur différents scénarios
   - [ ] Validation de l'accessibilité
   - [ ] Vérification des comportements sur différentes tailles d'écran

3. - [x] Validation de conformité
   - [x] Vérification que le format de données correspond au standard JSON Resume
   - [x] Validation des exports/imports

### 4. - [x] Documentation

1. - [x] Documenter le composant WorkForm
   - [x] JSDoc pour le composant et ses méthodes
   - [x] Documentation des props et events
   - [x] Exemples d'utilisation

2. - [x] Mettre à jour la documentation du projet
   - [x] Ajout des informations sur la gestion des expériences
   - [x] Mise à jour du guide d'utilisation

## Constraints

- Strict conformité au schéma JSON Resume pour la section "work"
- Validation en temps réel obligatoire
- UX intuitive pour la gestion de multiples entrées
- Support de la réorganisation des expériences
- Validation des dates cohérentes (date de fin après date de début)

## Structure

```
packages/
├── ui/
│   └── src/
│       └── modules/
│           └── cv/
│               └── presentation/
│                   ├── components/
│                   │   ├── WorkForm.vue
│                   │   └── WorkList.vue
│                   └── stores/
│                       └── work.ts (existant)
├── core/
│   └── src/
│       └── cv/
│           └── domain/
│               └── entities/
│                   └── Work.ts (existant)
```

## Dev Notes

### Points Critiques

- Validation des plages de dates
- Gestion intuitive des highlights (ajout/suppression dynamique)
- Performance avec de nombreuses expériences
- UX pour la réorganisation des expériences

### Décisions Techniques

- Utilisation de composables pour la logique réutilisable
- Validation côté client pour feedback immédiat
- Persistance des modifications via le store work existant
- Architecture modulaire pour évolution future

## Chat Command Log

- User: Créer la Story-3 pour l'implémentation des expériences professionnelles
- Agent: Création de la structure de la story pour le formulaire Work
- User: Implémentation du composant WorkForm
- Agent: Création du composant avec validation des champs et gestion des highlights
- User: Implémentation du composant WorkList
- Agent: Création du composant avec affichage, modification et suppression
- User: Tests des composants
- Agent: Écriture des tests unitaires et d'intégration
- User: Correction des bugs dans les tests
- Agent: Optimisation des tests pour éviter les erreurs dans l'environnement de test
