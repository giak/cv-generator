# Story: Gestion des Langues dans le CV

Epic-2: Édition de CV
Story-10: Implémentation du Formulaire des Langues

## Description de la Story

**En tant que** utilisateur de CV Generator
**Je veux** pouvoir ajouter, modifier, supprimer et réorganiser mes compétences linguistiques
**afin de** présenter clairement mes capacités linguistiques aux recruteurs

## Statut

Draft

## Contexte

Cette story fait partie de l'Epic-2 "Édition de CV" qui vise à développer les formulaires d'édition pour toutes les sections du CV conformes au standard JSON Resume. La section des langues est une composante importante du CV selon le standard JSON Resume et doit être implémentée de manière cohérente avec les autres sections déjà développées (basics, work, education, skills).

Le format JSON Resume pour les langues est le suivant:

```json
"languages": [
  {
    "language": "English",
    "fluency": "Native speaker"
  }
]
```

Cette story s'inscrit dans la continuité des développements précédents et suit la même architecture Clean Architecture et les mêmes principes SOLID que les autres sections du CV.

## Estimation

Story Points: 3 

## Critères d'Acceptation

1. Étant donné que je suis sur la page d'édition du CV, quand j'accède à la section "Langues", alors je vois la liste de mes langues déjà enregistrées
2. Étant donné que je suis dans la section "Langues", quand je clique sur "Ajouter une langue", alors un formulaire d'ajout s'ouvre avec les champs langue et niveau
3. Étant donné que j'ai ouvert le formulaire d'ajout/modification de langue, quand je soumets le formulaire avec des données valides, alors la langue est ajoutée/mise à jour dans mon CV
4. Étant donné que j'ai ouvert le formulaire d'ajout/modification de langue, quand je soumets le formulaire avec des données invalides, alors des messages d'erreur appropriés s'affichent
5. Étant donné que je suis dans la section "Langues", quand je clique sur le bouton d'édition d'une langue, alors un formulaire pré-rempli s'ouvre avec les informations de cette langue
6. Étant donné que je suis dans la section "Langues", quand je clique sur le bouton de suppression d'une langue, alors une confirmation m'est demandée avant la suppression
7. Étant donné que je suis dans la section "Langues", quand je confirme la suppression d'une langue, alors cette langue est retirée de mon CV
8. Étant donné que je suis dans la section "Langues", quand je glisse-dépose une langue dans la liste, alors l'ordre des langues est mis à jour

## Tâches

1. - [ ] Création des Modèles et Interfaces

   1. - [ ] Définir l'interface `LanguageInterface` conforme au standard JSON Resume
   2. - [ ] Créer l'interface `LanguageWithId` pour la gestion interne
   3. - [ ] Définir l'interface `ValidatedLanguage` pour les langues validées
   4. - [ ] Ajouter les types au schéma de validation Zod

2. - [ ] Implémentation du Store de Langues

   1. - [ ] Créer le store `useLanguageStore` avec Pinia
   2. - [ ] Implémenter la méthode `loadLanguages` pour charger les langues depuis le CV
   3. - [ ] Implémenter la méthode `addLanguage` pour ajouter une nouvelle langue
   4. - [ ] Implémenter la méthode `updateLanguage` pour mettre à jour une langue existante
   5. - [ ] Implémenter la méthode `deleteLanguage` pour supprimer une langue
   6. - [ ] Implémenter la méthode `reorderLanguages` pour réorganiser les langues
   7. - [ ] Ajouter la gestion des erreurs et le state loading

3. - [ ] Création des Composants UI

   1. - [ ] Développer le composant `LanguageList.vue` pour afficher la liste des langues
   2. - [ ] Créer le composant `LanguageForm.vue` pour le formulaire d'ajout/modification
   3. - [ ] Implémenter la logique de validation du formulaire
   4. - [ ] Ajouter le support du glisser-déposer pour la réorganisation
   5. - [ ] Intégrer le composant dans la navigation du CV

4. - [ ] Tests et Validation

   1. - [ ] Écrire les tests unitaires pour le store de langues
   2. - [ ] Écrire les tests de composants pour les composants UI
   3. - [ ] Vérifier la conformité avec le standard JSON Resume
   4. - [ ] Tester l'intégration avec le reste de l'application

5. - [ ] Documentation
   1. - [ ] Documenter les interfaces et le store
   2. - [ ] Ajouter des commentaires explicatifs dans le code
   3. - [ ] Mettre à jour la documentation utilisateur

## Principes de Développement

#### Principes à Suivre

- **Simplicité**: Solution minimale répondant aux critères d'acceptation, évitant toute complexité inutile
- **Périmètre**: Se limiter strictement aux exigences documentées pour la gestion des langues
- **Cohérence**: Respecter l'architecture Clean Architecture existante et les patterns établis
- **SOLID**: Appliquer les principes SOLID dans la conception des classes et interfaces
- **DRY**: Éviter la duplication de code, réutiliser les composants et logiques existants

#### À Éviter

- Sur-ingénierie des composants ou du store
- Ajout de fonctionnalités non spécifiées dans les critères d'acceptation
- Modification des autres sections du CV ou de l'architecture globale
- Implémentation de validations ou règles métier non documentées

## Notes de Développement

- L'implémentation suivra le modèle établi pour les autres sections du CV, notamment skills
- Le store language sera implémenté selon le même pattern que les autres stores
- Les données seront persistées dans localStorage via le `LocalStorageResumeRepository`
- L'interface utilisateur respectera les standards de design de l'application
- La validation des données sera effectuée à plusieurs niveaux (UI et domaine)

## Risques et Hypothèses

| Risque                                                    | Impact | Probabilité | Mitigation                                                   |
| --------------------------------------------------------- | ------ | ----------- | ------------------------------------------------------------ |
| Problèmes de compatibilité avec le format JSON Resume     | Moyen  | Faible      | Valider l'implémentation avec le schéma officiel JSON Resume |
| Conflits avec d'autres composants lors de l'intégration   | Faible | Faible      | Tests d'intégration approfondis                              |
| Performance lors de la manipulation de nombreuses langues | Faible | Faible      | Optimisation du rendu et de la gestion d'état                |
| Problèmes d'UX lors du glisser-déposer                    | Moyen  | Moyen       | Tests utilisateurs et ajustements itératifs                  |

## Journal de Communication

- GiakAI: Story initiée selon le standard JSON Resume et en suivant le pattern des autres sections
- En attente de validation par l'équipe avant de commencer l'implémentation
