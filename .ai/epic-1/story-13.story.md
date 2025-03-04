# 📋 Story: Projets - Création, édition et suppression

## 📝 Description

**Story #13: Implémentation de la fonctionnalité de gestion des projets**

En tant qu'utilisateur de CV Generator, je souhaite pouvoir ajouter, modifier et supprimer mes projets professionnels et personnels afin d'enrichir mon CV avec des réalisations concrètes qui démontrent mes compétences et expériences, conformément au standard JSON Resume.

### Contexte Métier

La section "projects" du standard JSON Resume permet aux utilisateurs d'inclure des projets significatifs dans leur CV. Cette section comprend le nom du projet, les dates de début et de fin, une description, des points forts (highlights) et une URL associée. Les projets constituent un élément différenciateur important, particulièrement pour les profils techniques, en démontrant des réalisations concrètes et des compétences appliquées.

### Valeur Ajoutée

- Permet de mettre en avant des réalisations pratiques et des applications concrètes de compétences
- Offre une vision plus complète du parcours professionnel et personnel
- Différencie le CV par rapport aux candidatures ne listant que des expériences professionnelles
- Permet de combler des périodes d'inactivité professionnelle par des projets personnels
- Assure la conformité complète avec le standard JSON Resume

## ✅ Critères d'Acceptation

1. **Affichage des projets**

   - [ ] Les projets existants sont affichés dans une liste avec leur nom, dates et description
   - [ ] Un état vide est affiché quand aucun projet n'existe
   - [ ] Les données sont chargées depuis le store avec indicateur de chargement

2. **Ajout d'un projet**

   - [ ] Un formulaire permet d'ajouter un nouveau projet avec tous les champs du standard JSON Resume
   - [ ] Les champs obligatoires sont validés (au minimum le nom du projet)
   - [ ] Une confirmation visuelle s'affiche après l'ajout réussi
   - [ ] Le projet ajouté apparaît immédiatement dans la liste

3. **Modification d'un projet**

   - [ ] Un clic sur le bouton d'édition ouvre le formulaire pré-rempli
   - [ ] Les modifications sont validées avant enregistrement
   - [ ] Une confirmation visuelle s'affiche après la modification
   - [ ] Les changements sont immédiatement reflétés dans la liste

4. **Suppression d'un projet**

   - [ ] Un dialogue de confirmation apparaît avant la suppression
   - [ ] La suppression retire le projet de la liste avec animation
   - [ ] Une confirmation visuelle s'affiche après la suppression

5. **Gestion des champs spécifiques**

   - [ ] Support pour les points forts (highlights) avec ajout/suppression dynamique
   - [ ] Validation et formatage des dates de début et fin
   - [ ] Validation de l'URL du projet (optionnelle mais valide si fournie)

6. **Persistance**

   - [x] Les projets sont correctement sauvegardés dans le localStorage
   - [x] Les données sont conformes au schéma JSON Resume

7. **Expérience utilisateur**
   - [ ] Interface réactive et animée
   - [ ] Feedback visuel pour toutes les actions (ajout, modification, suppression)
   - [ ] Gestion appropriée des états de chargement
   - [ ] Support mobile et responsive

## 📋 Tâches Techniques

1. **Modèles et validation (1/4)** - CORE

   - [x] S'assurer que l'interface `ProjectInterface` dans le module shared est correctement configurée
   - [x] Vérifier le schéma de validation Zod pour les projets
   - [x] Implémenter les entités de domaine pour les projets
   - [x] Créer les cas d'utilisation pour la gestion des projets

2. **Store et persistance (2/4)** - INFRASTRUCTURE

   - [x] Créer le store Pinia `useProjectStore` avec les actions CRUD
   - [x] Implémenter la persistance localStorage
   - [x] Ajouter la gestion des états de chargement
   - [x] Implémenter la gestion des erreurs

3. **Composants UI (3/4)** - PRESENTATION

   - [ ] Créer le composant `ProjectList.vue` pour afficher la liste des projets
   - [ ] Développer le composant `ProjectForm.vue` pour l'ajout et la modification
   - [ ] Implémenter la gestion des points forts (highlights) avec ajout/suppression dynamique
   - [ ] Intégrer les modales et les confirmations de suppression
   - [ ] Implémenter les notifications toast

4. **Intégration et tests (4/4)** - QUALITY
   - [x] Intégrer la fonctionnalité dans `App.vue` (navigation, chargement de données)
   - [x] Mettre à jour les breadcrumbs pour inclure la section Projets
   - [x] Écrire les tests unitaires pour les entités et le store
   - [ ] Écrire les tests de composants pour les formulaires
   - [x] Vérifier la conformité avec le standard JSON Resume

## 🏷️ Tags

`feature`, `ui`, `form`, `json-resume`, `projects`

## 📊 Estimation

**Story Points**: 5
**Temps estimé**: 2 jours

## 🔄 Statut et Progression

**Statut**: 🔄 En cours
**Progression**: 50%

| Tâche                 | Statut      | Assigné à | Notes                                                 |
| --------------------- | ----------- | --------- | ----------------------------------------------------- |
| Modèles et validation | ✅ Terminé  | -         | Interfaces et schémas implémentés                     |
| Store et persistance  | ✅ Terminé  | -         | Store fonctionnel avec sauvegarde dans localStorage   |
| Composants UI         | ⏳ À faire  | -         | Créer en suivant la structure des autres composants   |
| Intégration et tests  | 🔄 En cours | -         | Navigation intégrée, tests des composants UI restants |

## 🔗 Liens et Références

- [Standard JSON Resume](https://jsonresume.org/schema/)
- [Documentation architecture CV Generator](./arch.md)
- [PRD CV Generator](./prd.md)
- [Implémentation similaire: Education](./Implementation_Fonctionnalite_Education_detail.md)

## 📌 Notes Techniques

- Suivre la même structure de composants que pour les fonctionnalités "work" et "education"
- La description du projet doit être implémentée comme un champ texte avec support multi-lignes
- Implémenter les highlights comme une liste dynamique, similaire aux skills ou awards
- Utiliser les composants partagés (Form, FormField, Card, Button, etc.) pour maintenir la cohérence de l'UI
- Utiliser des pickers de date pour les champs startDate et endDate
- Implémenter la validation de l'URL (optionnelle mais valide si fournie)
- Respecter les conventions de nommage et les standards de code définis dans le projet
- Assurer la validation côté client des champs pour une meilleure expérience utilisateur

#### Principes à Suivre

- **Simplicité**: Solution minimale répondant aux critères d'acceptation (focus sur les fonctionnalités essentielles)
- **Clean Architecture**: Respecter la séparation des responsabilités entre domaine, infrastructure et présentation
- **SOLID**: Appliquer les principes SOLID, particulièrement pour l'encapsulation de la logique métier
- **Cohérence**: Maintenir une cohérence avec les autres composants déjà implémentés (work, education, references)

#### À Éviter

- Génération de code pour des fonctionnalités avancées non spécifiées
- Création de champs additionnels non présents dans le standard JSON Resume
- Complexité excessive dans la gestion de l'état

## 🧪 Corrections et Améliorations

- ✅ Correction du problème de propriété en lecture seule sur `resume.projects` dans la fonction `saveProjects`
- ✅ Amélioration de la gestion des erreurs dans le store des projets
- ✅ Intégration avec le store principal du CV pour assurer la cohérence des données
