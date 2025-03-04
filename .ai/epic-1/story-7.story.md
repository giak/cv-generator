# Epic-1: Core CV Management

# Story-7: Certificates Form Implementation

## Story

**As a** user
**I want** to create and edit my certificates and certifications using a form
**so that** I can showcase my professional certifications in a structured way following the JSON Resume format

## Status

En cours

## Context

Cette story fait suite à la Story-6 qui a mis en place les prix et distinctions (awards) du CV. Elle se concentre sur l'implémentation de la section "certificates" du format JSON Resume, qui représente les certifications professionnelles et diplômes obtenus par le candidat. Cette section est importante car elle permet de mettre en valeur les qualifications reconnues par l'industrie, renforçant ainsi la crédibilité professionnelle du candidat dans son domaine d'expertise.

### Technical Context

- Vue 3.4+ avec Composition API et TypeScript 5.7+
- Architecture Clean/DDD établie dans Story-1
- Validation avec Zod
- Tests avec Vitest
- UI avec Tailwind CSS 3
- La structure sera similaire à celle mise en place pour les sections précédentes (work, volunteer, education, awards)
- Les composants et le store seront créés en suivant le même pattern

### Business Drivers

- Besoin d'une interface intuitive pour éditer les certifications professionnelles
- Validation en temps réel des données
- Facilité d'ajout, modification et suppression d'entrées multiples
- Gestion des dates d'obtention des certifications
- Support des URLs pour les certifications vérifiables en ligne
- Organisation claire des certifications par importance ou chronologie

## Estimation

Story Points: 2 (1.5 jours de développement humain estimés ; 2 heures réelles)

## Critères d'Acceptation

1. Étant donné que l'application est chargée, quand un utilisateur navigue vers la section "Certificates", alors une liste des certifications existantes est affichée ou un message indiquant qu'aucune certification n'a été ajoutée
2. Étant donné que l'utilisateur est dans la section "Certificates", quand il clique sur "Ajouter une certification", alors un formulaire d'ajout de certification apparaît
3. Étant donné un formulaire de certification, quand l'utilisateur remplit tous les champs requis (nom, émetteur, date) et soumet le formulaire, alors une nouvelle certification est ajoutée à la liste
4. Étant donné un formulaire de certification avec des données incomplètes, quand l'utilisateur tente de soumettre, alors des messages d'erreur appropriés sont affichés
5. Étant donné une liste de certifications, quand l'utilisateur clique sur "Modifier" pour une certification, alors un formulaire pré-rempli avec les données de cette certification s'affiche
6. Étant donné une liste de certifications, quand l'utilisateur clique sur "Supprimer" pour une certification, alors cette certification est retirée de la liste après confirmation
7. Étant donné une liste de certifications, quand l'utilisateur change l'ordre des certifications par glisser-déposer, alors le nouvel ordre est sauvegardé
8. Étant donné que l'utilisateur a ajouté des certifications, quand il navigue vers d'autres sections du CV puis revient, alors les certifications précédemment ajoutées sont toujours présentes

## Tâches

### 1. - [x] Création du composant CertificateForm

1. - [x] Créer le composant CertificateForm.vue

   1. - [x] Structure du composant avec TypeScript
   2. - [x] Intégration avec le store certificate
   3. - [x] Validation en temps réel
   4. - [x] Gestion des erreurs avec feedback

2. - [x] Implémenter les champs avec validation

   1. - [x] Champ pour le nom de la certification (requis)
   2. - [x] Champ pour l'organisme émetteur (issuer) (requis)
   3. - [x] Champ pour la date d'obtention (requis)
   4. - [x] Champ pour l'URL de vérification (optionnel, avec validation URL)

3. - [ ] Écrire les tests du composant
   1. - [ ] Tests unitaires pour la validation des champs
   2. - [ ] Tests d'intégration avec le store
   3. - [ ] Tests de rendu conditionnel

### 2. - [x] Intégration dans l'interface principale

1. - [x] Créer le composant CertificateList pour afficher les certifications

   1. - [x] Affichage de la liste des certifications
   2. - [x] Options pour éditer/supprimer chaque entrée
   3. - [x] Interface pour réorganiser les entrées

2. - [x] Implémenter le dialogue d'ajout/édition

   1. - [x] Modale pour ajouter une nouvelle certification
   2. - [x] Intégration du formulaire CertificateForm dans la modale
   3. - [x] Gestion des actions (sauvegarder/annuler)

3. - [x] Intégrer dans la navigation principale

   1. - [x] Ajout d'un onglet "Certificates"
   2. - [x] Transition fluide entre les sections

4. - [x] Ajouter la gestion des états vides
   1. - [x] Message pour guider l'utilisateur lorsqu'aucune certification n'est ajoutée
   2. - [x] Call-to-action pour ajouter une première certification

### 3. - [x] Création du store certificate

1. - [x] Implémenter le store certificate

   1. - [x] Définir les interfaces CertificateWithId et ValidatedCertificate
   2. - [x] Implémenter les actions (loadCertificates, addCertificate, updateCertificate, deleteCertificate, reorderCertificates)
   3. - [x] Gérer les états de chargement et d'erreur
   4. - [x] Intégrer avec le repository pour la persistance

2. - [ ] Écrire les tests du store
   1. - [ ] Tests unitaires pour chaque action
   2. - [ ] Tests d'intégration avec le repository
   3. - [ ] Tests de gestion d'erreur

### 4. - [ ] Tests et validation

1. - [ ] Écrire les tests d'intégration

   1. - [ ] Tests du flux complet (ajout/édition/suppression)
   2. - [ ] Tests de validation des données
   3. - [ ] Tests de persistance avec le store

2. - [ ] Tests utilisateur

   1. - [ ] Vérification de l'UX sur différents scénarios
   2. - [ ] Validation de l'accessibilité
   3. - [ ] Vérification des comportements sur différentes tailles d'écran

3. - [ ] Validation de conformité
   1. - [ ] Vérification que le format de données correspond au standard JSON Resume
   2. - [ ] Validation des exports/imports

### 5. - [ ] Documentation

1. - [ ] Documenter le composant CertificateForm

   1. - [ ] JSDoc pour le composant et ses méthodes
   2. - [ ] Documentation des props et events
   3. - [ ] Exemples d'utilisation

2. - [ ] Mettre à jour la documentation du projet
   1. - [ ] Ajout des informations sur la gestion des certifications
   2. - [ ] Mise à jour du guide d'utilisation

## Principes de Développement

#### Principes à Suivre

- **Simplicité**: Solution minimale répondant aux critères d'acceptation (focus sur un formulaire fonctionnel sans fonctionnalités avancées)
- **Périmètre**: Se limiter strictement aux exigences documentées
- **Cohérence**: Respecter l'architecture Vue du projet et les patterns existants

#### À Éviter

- Génération de code pour des fonctionnalités non demandées
- Création de fichiers supplémentaires non nécessaires
- Sur-ingénierie des composants ou du store

## Constraints

- Strict conformité au schéma JSON Resume pour la section "certificates"
- Validation en temps réel obligatoire
- UX intuitive pour la gestion de multiples entrées
- Support de la réorganisation des certifications
- Validation de la date d'obtention (format valide, pas dans le futur)
- Validation des URLs (optionnelles mais valides si fournies)
- Persistance des données entre les différentes sections du CV
- Réutilisation des patterns établis dans les stories précédentes

## Structure

```
packages/
├── ui/
│   └── src/
│       └── modules/
│           └── cv/
│               └── presentation/
│                   ├── components/
│                   │   ├── CertificateForm.vue  (implémenté)
│                   │   └── CertificateList.vue  (implémenté)
│                   └── stores/
│                       └── certificate.ts       (implémenté)
├── core/
│   └── src/
│       └── cv/
│           └── domain/
│               └── entities/
│                   └── Resume.ts (existant)
```

## Notes de Développement

### Points Critiques

- Validation des dates (format international)
- Validation des URLs pour les certifications en ligne
- Performance avec de nombreuses certifications
- UX pour la réorganisation des certifications
- Cohérence avec les autres sections du CV (work, education, awards)
- Support pour différents types de certifications

### Décisions Techniques

- Réutilisation des patterns établis pour les sections précédentes
- Structure de composants similaire pour maintenir la cohérence
- Partage de code là où c'est possible (ex: gestion des dates, validation d'URL)
- Validation côté client pour feedback immédiat
- Tests exhaustifs pour garantir la fiabilité

### Points d'Attention

- S'assurer que les modifications n'affectent pas les fonctionnalités existantes
- Vérifier la persistance correcte des données entre sections
- Tester les cas limites (grand nombre d'entrées, champs longs, URLs complexes)
- Garantir l'accessibilité des formulaires
- Considérer les différents formats de date selon les régions

## Résultats Intermédiaires

L'implémentation de la fonctionnalité de gestion des certifications est bien avancée. Les points clés suivants ont été réalisés:

1. **Composants UI**

   - Création du composant CertificateForm avec validation en temps réel
   - Création du composant CertificateList avec gestion des états vides et options d'édition/suppression

2. **Store pour la gestion des données**

   - Implémentation complète du store avec opérations CRUD
   - Gestion des états de chargement
   - Intégration avec le repository de persistance

3. **Intégration dans l'application**
   - Ajout dans la navigation principale
   - Mise en place d'une vue dédiée
   - Configuration des transitions entre les sections

Il reste à compléter les tests unitaires et d'intégration, ainsi que la documentation, avant de pouvoir considérer cette fonctionnalité comme terminée.

## Journal de Communication

- Giak: Création de la Story-7 pour l'implémentation des certifications
- Assistant: Implémentation des composants UI (CertificateForm, CertificateList)
- Assistant: Intégration de la section certificates dans la navigation principale
