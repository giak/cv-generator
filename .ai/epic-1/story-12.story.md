# 📋 Story: Références - Création, édition et suppression

## 📝 Description

**Story #12: Implémentation de la fonctionnalité de gestion des références**

En tant qu'utilisateur de CV Generator, je souhaite pouvoir ajouter, modifier et supprimer mes références professionnelles afin d'enrichir mon CV avec des témoignages qui renforcent ma candidature, conformément au standard JSON Resume.

### Contexte Métier

La section "references" du standard JSON Resume permet aux utilisateurs d'inclure des témoignages ou références professionnelles dans leur CV. Cette section comprend le nom de la personne référente et le contenu du témoignage. Les références peuvent être un atout significatif pour une candidature en apportant une validation externe des compétences et qualités professionnelles du candidat.

### Valeur Ajoutée

- Renforce la crédibilité du candidat avec des témoignages de professionnels
- Fournit aux recruteurs des sources de validation externes
- Complète le profil professionnel avec des appréciations qualitatives
- Assure la conformité complète avec le standard JSON Resume

## ✅ Critères d'Acceptation

1. **Affichage des références**

   - [x] Les références existantes sont affichées dans une liste avec le nom du référent et le contenu du témoignage
   - [x] Un état vide est affiché quand aucune référence n'existe
   - [x] Les données sont chargées depuis le store avec indicateur de chargement

2. **Ajout d'une référence**

   - [x] Un formulaire permet d'ajouter une nouvelle référence avec un nom et un témoignage
   - [x] Les champs obligatoires sont validés (le nom et le témoignage sont requis)
   - [x] Une confirmation visuelle s'affiche après l'ajout réussi
   - [x] La référence ajoutée apparaît immédiatement dans la liste

3. **Modification d'une référence**

   - [x] Un clic sur le bouton d'édition ouvre le formulaire pré-rempli
   - [x] Les modifications sont validées avant enregistrement
   - [x] Une confirmation visuelle s'affiche après la modification
   - [x] Les changements sont immédiatement reflétés dans la liste

4. **Suppression d'une référence**

   - [x] Un dialogue de confirmation apparaît avant la suppression
   - [x] La suppression retire la référence de la liste avec animation
   - [x] Une confirmation visuelle s'affiche après la suppression

5. **Persistance**

   - [x] Les références sont correctement sauvegardées dans le localStorage
   - [x] Les données sont conformes au schéma JSON Resume

6. **Expérience utilisateur**
   - [x] Interface réactive et animée
   - [x] Feedback visuel pour toutes les actions (ajout, modification, suppression)
   - [x] Gestion appropriée des états de chargement
   - [x] Support mobile et responsive

## 📋 Tâches Techniques

1. **Modèles et validation (1/4)** - CORE

   - [x] S'assurer que l'interface `ReferenceInterface` dans le module shared est correctement configurée
   - [x] Vérifier le schéma de validation Zod pour les références
   - [x] Implémenter les entités de domaine pour les références
   - [x] Créer les cas d'utilisation pour la gestion des références

2. **Store et persistance (2/4)** - INFRASTRUCTURE

   - [x] Créer le store Pinia `useReferenceStore` avec les actions CRUD
   - [x] Implémenter la persistance localStorage
   - [x] Ajouter la gestion des états de chargement
   - [x] Implémenter la gestion des erreurs

3. **Composants UI (3/4)** - PRESENTATION

   - [x] Créer le composant `ReferenceList.vue` pour afficher la liste des références
   - [x] Développer le composant `ReferenceForm.vue` pour l'ajout et la modification
   - [x] Intégrer les modales et les confirmations de suppression
   - [x] Implémenter les notifications toast

4. **Intégration et tests (4/4)** - QUALITY
   - [x] Intégrer la fonctionnalité dans le routeur Vue
   - [ ] Écrire les tests unitaires pour les entités et le store
   - [ ] Écrire les tests de composants pour les formulaires
   - [x] Vérifier la conformité avec le standard JSON Resume

## 🏷️ Tags

`feature`, `ui`, `form`, `json-resume`, `references`

## 📊 Estimation

**Story Points**: 5
**Temps estimé**: 2 jours

## 🔄 Statut et Progression

**Statut**: ✅ Terminé
**Progression**: 90%

| Tâche                 | Statut            | Assigné à | Notes                                                   |
| --------------------- | ----------------- | --------- | ------------------------------------------------------- |
| Modèles et validation | ✅ Terminé        | -         | Interface et validation implémentées                    |
| Store et persistance  | ✅ Terminé        | -         | Store complet avec CRUD, localStorage et gestion d'état |
| Composants UI         | ✅ Terminé        | -         | Composants implémentés avec design harmonisé            |
| Intégration et tests  | ⏳ En cours (50%) | -         | Intégration complète, tests à finaliser                 |

## 🔗 Liens et Références

- [Standard JSON Resume](https://jsonresume.org/schema/)
- [Documentation architecture CV Generator](./arch.md)
- [PRD CV Generator](./prd.md)
- [Implémentation similaire: Intérêts](./Implementation_Fonctionnalite_Education_detail.md)

## 📌 Notes Techniques

- Suivre la même structure de composants que pour les fonctionnalités "education" et "interests"
- Le témoignage (reference) doit être implémenté comme un champ texte avec support multi-lignes
- Utiliser les composants partagés (Form, FormField, Card, etc.) pour maintenir la cohérence de l'UI
- Respecter les conventions de nommage et les standards de code définis dans le projet
- Assurer la validation côté client des champs pour une meilleure expérience utilisateur
- Considérer l'ajout d'une option pour marquer certaines références comme confidentielles dans une future itération

## 📅 Journal de développement

### 04/03/2024 - Implémentation complète de l'interface utilisateur

- Création du composant `ReferenceForm.vue` avec validation et design harmonisé
- Création du composant `ReferenceList.vue` avec gestion d'états, animations et notifications
- Finalisation du store `useReferenceStore` avec gestion CRUD et persistance
- Intégration de la fonctionnalité dans l'application principale
- Le design a été harmonisé avec les autres composants de l'application (comme LanguageForm et LanguageList)
- Adaptation pour le support mobile et responsive

### Tâches restantes

- Finaliser les tests unitaires pour les entités et le store
- Implémenter les tests de composants pour le formulaire de référence
