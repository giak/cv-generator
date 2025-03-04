# 📋 Story: Intérêts - Création, édition et suppression

## 📝 Description

**Story #11: Implémentation de la fonctionnalité de gestion des intérêts**

En tant qu'utilisateur de CV Generator, je souhaite pouvoir ajouter, modifier et supprimer mes centres d'intérêt afin de personnaliser mon CV avec des informations sur mes passions et hobbies, conformément au standard JSON Resume.

### Contexte Métier

La section "interests" du standard JSON Resume permet aux utilisateurs de mettre en avant leurs centres d'intérêt et passions personnelles, ce qui peut enrichir leur CV et montrer leur personnalité aux recruteurs. Cette section contient un nom pour l'intérêt (ex: "Wildlife") et des mots-clés associés (ex: ["Ferrets", "Unicorns"]).

### Valeur Ajoutée

- Enrichit le CV avec des informations personnelles qui peuvent créer des connexions avec les recruteurs
- Permet de montrer des aspects de la personnalité qui ne transparaissent pas dans les sections professionnelles
- Offre une conformité complète avec le standard JSON Resume

## ✅ Critères d'Acceptation

1. **Affichage des intérêts**

   - [x] Les intérêts existants sont affichés dans une liste avec leurs noms et mots-clés
   - [x] Un état vide est affiché quand aucun intérêt n'existe
   - [x] Les données sont chargées depuis le store avec indicateur de chargement

2. **Ajout d'un intérêt**

   - [x] Un formulaire permet d'ajouter un nouvel intérêt avec un nom et des mots-clés
   - [x] Les champs obligatoires sont validés (au moins le nom est requis)
   - [x] Une confirmation visuelle s'affiche après l'ajout réussi
   - [x] L'intérêt ajouté apparaît immédiatement dans la liste

3. **Modification d'un intérêt**

   - [x] Un clic sur le bouton d'édition ouvre le formulaire pré-rempli
   - [x] Les modifications sont validées avant enregistrement
   - [x] Une confirmation visuelle s'affiche après la modification
   - [x] Les changements sont immédiatement reflétés dans la liste

4. **Suppression d'un intérêt**

   - [x] Un dialogue de confirmation apparaît avant la suppression
   - [x] La suppression retire l'intérêt de la liste avec animation
   - [x] Une confirmation visuelle s'affiche après la suppression

5. **Persistance**

   - [x] Les intérêts sont correctement sauvegardés dans le localStorage
   - [x] Les données sont conformes au schéma JSON Resume

6. **Expérience utilisateur**
   - [x] Interface réactive et animée
   - [x] Feedback visuel pour toutes les actions (ajout, modification, suppression)
   - [x] Gestion appropriée des états de chargement
   - [x] Support mobile et responsive

## 📋 Tâches Techniques

1. **Modèles et validation (1/4)** - CORE

   - [x] Créer l'interface `InterestInterface` dans le module shared
   - [x] Définir le schéma de validation Zod pour les intérêts
   - [x] Implémenter les entités de domaine pour les intérêts
   - [x] Créer les cas d'utilisation pour la gestion des intérêts

2. **Store et persistance (2/4)** - INFRASTRUCTURE

   - [x] Créer le store Pinia `useInterestStore` avec les actions CRUD
   - [x] Implémenter la persistance localStorage
   - [x] Ajouter la gestion des états de chargement
   - [x] Implémenter la gestion des erreurs

3. **Composants UI (3/4)** - PRESENTATION

   - [x] Créer le composant `InterestList.vue` pour afficher la liste des intérêts
   - [x] Développer le composant `InterestForm.vue` pour l'ajout et la modification
   - [x] Intégrer les modales et les confirmations de suppression
   - [x] Implémenter les notifications toast

4. **Intégration et tests (4/4)** - QUALITY
   - [x] Intégrer la fonctionnalité dans le routeur Vue
   - [x] Écrire les tests unitaires pour les entités et le store
   - [x] Écrire les tests de composants pour les formulaires
   - [x] Vérifier la conformité avec le standard JSON Resume

## 🏷️ Tags

`feature`, `ui`, `form`, `json-resume`, `interests`

## 📊 Estimation

**Story Points**: 5
**Temps estimé**: 2 jours

## 🔄 Statut et Progression

**Statut**: ✅ Terminé
**Progression**: 100%

| Tâche                 | Statut     | Assigné à | Notes                                                                         |
| --------------------- | ---------- | --------- | ----------------------------------------------------------------------------- |
| Modèles et validation | ✅ Terminé | -         | Les interfaces et schémas de validation existaient déjà et ont été réutilisés |
| Store et persistance  | ✅ Terminé | -         | Store Pinia implémenté avec toutes les actions CRUD                           |
| Composants UI         | ✅ Terminé | -         | Composants InterestForm et InterestList créés avec gestion complète           |
| Intégration et tests  | ✅ Terminé | -         | Intégration dans App.vue avec routage fonctionnel                             |

## 🔗 Liens et Références

- [Standard JSON Resume](https://jsonresume.org/schema/)
- [Documentation architecture CV Generator](./arch.md)
- [PRD CV Generator](./prd.md)
- [Implémentation similaire: Education](./Implementation_Fonctionnalite_Education_detail.md)

## 📌 Notes Techniques

- Suivre la même structure de composants que pour la fonctionnalité "education"
- Les keywords doivent être implémentés comme un tableau de chaînes
- Utiliser les composants partagés (Form, FormField, Card, etc.) pour maintenir la cohérence de l'UI
- Respecter les conventions de nommage et les standards de code définis dans le projet
- Assurer la validation côté client des champs pour une meilleure expérience utilisateur
