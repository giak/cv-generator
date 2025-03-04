# Story: Refactorisation du composant App avec des Composables Vue 3

Epic-1: Amélioration de l'Architecture CV Generator
Story-14: Extraction de la Logique de App.vue en Composables

## Description de la Story

**En tant que** développeur Vue.js travaillant sur le CV Generator
**Je veux** refactoriser le composant App.vue en extrayant sa logique métier dans des composables
**afin de** améliorer la maintenabilité, la testabilité et la réutilisabilité du code en suivant les principes de Clean Architecture

## Statut

Draft

## Contexte

Le composant App.vue est actuellement surchargé avec une quantité importante d'initialisations de stores et de logique métier. Cela viole les principes de la règle 2003-vue3-composables, qui recommande d'extraire la logique dans des composables réutilisables, en particulier quand un composant dépasse 100 lignes ou quand la logique peut être réutilisée ailleurs.

La règle des composables Vue.js 3 nous guide dans cette refactorisation pour:

- Extraire la logique réutilisable dans des composables préfixés par `use`
- Organiser les composables par couche architecturale (domaine, application, infrastructure, UI)
- Assurer que chaque composable a une responsabilité unique (principe SOLID)
- Documenter clairement l'interface des composables

Cette story fait partie de l'effort global pour aligner notre codebase sur les principes de Clean Architecture définis dans notre document d'architecture.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. Étant donné le composant App.vue, quand la logique d'initialisation des stores est identifiée, alors elle doit être extraite dans un composable `useStores` avec documentation JSDoc
2. Étant donné le composant App.vue, quand la logique de gestion d'état locale est identifiée, alors elle doit être extraite dans des composables appropriés
3. Étant donné les nouveaux composables créés, quand ils sont implémentés, alors ils doivent suivre les conventions de nommage (`use` + nom en camelCase)
4. Étant donné les nouveaux composables créés, quand ils sont implémentés, alors ils doivent être organisés selon les principes de Clean Architecture
5. Étant donné les nouveaux composables créés, quand ils sont implémentés, alors ils doivent utiliser `toValue()` pour supporter les arguments de type ref ou getter
6. Étant donné le composant App.vue refactorisé, quand il est testé, alors il doit maintenir le même comportement qu'avant la refactorisation
7. Étant donné le composant App.vue refactorisé, quand il est analysé, alors sa complexité doit être réduite d'au moins 30%

## Tâches

1. - [ ] Analyser le composant App.vue
   1. - [ ] Identifier les initialisations de stores
   2. - [ ] Identifier la logique qui peut être extraite en composables
   3. - [ ] Définir les responsabilités de chaque composable à créer
2. - [ ] Créer les composables
   1. - [ ] Créer le composable `useStores` pour l'initialisation des stores
   2. - [ ] Créer le composable `useAppState` pour la gestion de l'état local
   3. - [ ] Créer d'autres composables spécifiques selon les besoins identifiés
3. - [ ] Documenter les composables
   1. - [ ] Ajouter des commentaires JSDoc pour chaque composable
   2. - [ ] Documenter les paramètres et valeurs de retour
4. - [ ] Refactoriser App.vue
   1. - [ ] Remplacer les initialisations directes par l'utilisation des composables
   2. - [ ] Nettoyer les imports non nécessaires
   3. - [ ] Vérifier que toutes les fonctionnalités sont préservées
5. - [ ] Tester
   1. - [ ] Écrire des tests unitaires pour les nouveaux composables
   2. - [ ] Vérifier que les tests existants passent toujours
   3. - [ ] Analyser la couverture de code

## Principes de Développement

#### Principes à Suivre

- **Simplicité**: Extraire uniquement la logique qui apporte une réelle valeur de réutilisabilité ou de clarté
- **Périmètre**: Se concentrer exclusivement sur la logique du composant App.vue
- **Cohérence**: Respecter l'architecture Clean et les patterns existants décrits dans la règle des composables
- **Performance**: S'assurer que les composables respectent la contrainte de performance (<500ms)

#### À Éviter

- Créer des composables pour des extractions triviales (<10 lignes)
- Implémenter des composables "fourre-tout" qui violent le principe de responsabilité unique
- Modifier la logique métier existante (uniquement refactoriser, pas redévelopper)
- Créer des composables qui ne respectent pas l'organisation par couche définie dans la règle

## Notes de Développement

### Structure proposée

```
composables/
├── ui/
│   ├── useStores.ts         # Initialisation et accès à tous les stores
│   ├── useAppState.ts       # Gestion de l'état UI local de l'application
│   ├── useNavigation.ts     # Gestion de la navigation
```

### Architecture des composables

1. **useStores.ts**:

   - Centralise l'initialisation de tous les stores (resume, work, education, etc.)
   - Fournit un point d'accès unifié aux stores
   - Évite la duplication d'initialisation dans plusieurs composants

2. **useAppState.ts**:

   - Gère l'état local de l'application (activeComponent, etc.)
   - Encapsule les transformations d'état et opérations locales
   - Isole la logique d'état UI du template

3. **useNavigation.ts**:
   - Gère la navigation entre les différentes sections de l'application
   - Encapsule la logique de changement de vue
   - Simplifie les transitions entre composants

## Journal de Communication

- Giak: Nous devons refactoriser App.vue selon notre règle de composables Vue.js 3
- AiAgent: J'ai analysé le composant et identifié plusieurs opportunités d'extraction en composables
  - Giak: Assurez-vous de bien suivre l'organisation par couche définie dans notre architecture
- AiAgent: Proposé une structure avec 3 composables principaux: useStores, useAppState et useNavigation
  - Giak: Ça semble bien. Veillez à ce que chaque composable ait une responsabilité unique

## Risques et Hypothèses

| Risque                                   | Impact | Probabilité | Mitigation                                                              |
| ---------------------------------------- | ------ | ----------- | ----------------------------------------------------------------------- |
| Régression fonctionnelle                 | Élevé  | Moyenne     | Mettre en place des tests automatisés complets avant la refactorisation |
| Dépassement du budget de performance     | Moyen  | Faible      | Mesurer les performances avant/après et optimiser si nécessaire         |
| Couplage excessif entre composables      | Moyen  | Moyenne     | Suivre strictement les principes SOLID et l'organisation par couche     |
| Incohérence avec le reste de la codebase | Faible | Faible      | Aligner avec les standards de la règle 2003-vue3-composables            |
