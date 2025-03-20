# Story: Amélioration du système de gestion des traductions

Epic-5: Internationalisation et Multilinguisme
Story-6: Amélioration robuste du script i18n-guardian

## Description de la Story

**En tant que** développeur du projet CV Generator
**Je veux** améliorer le script i18n-guardian pour qu'il détecte correctement tous les motifs de traduction
**afin de** éviter la suppression accidentelle de clés et assurer une gestion fiable des traductions

## Statut

Complete

## Contexte

Cette story fait partie de l'Epic-5 qui concerne l'internationalisation et le multilinguisme de l'application CV Generator. Le script i18n-guardian est essentiel pour la gestion des traductions, mais il présentait des problèmes sérieux qui ont conduit à la suppression accidentelle de nombreuses clés de traduction.

La version précédente du script ne détectait que 17 clés au lieu des centaines réellement utilisées. Cette défaillance a causé la suppression massive de clés légitimes lors de son exécution, compromettant les fonctionnalités d'internationalisation.

Le script devait être amélioré pour prendre en compte tous les patterns d'utilisation des traductions, notamment ceux utilisés dans les services de validation du package core et les composants utilisant les patterns de l'EPIC 5 avec `i18n.translate()`, `i18n.exists()`, etc.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. Étant donné le codebase avec divers patterns de traduction, quand j'exécute le script i18n-guardian, alors il doit détecter au moins 100 clés de traduction utilisées
2. Étant donné un nouveau pattern d'utilisation comme `i18n.translate()`, quand j'exécute le script, alors ces références doivent être correctement identifiées
3. Étant donné des services de validation avec des clés de traduction comme `AWARD_VALIDATION_KEYS`, quand j'analyse le code, alors ces clés doivent être extraites et protégées
4. Étant donné l'importance des traductions, quand j'exécute le script, alors il doit créer automatiquement des backups avant toute modification
5. Étant donné l'exécution du script, quand des clés sont identifiées comme inutilisées, alors les clés essentielles respectant certains patterns doivent être protégées contre la suppression
6. Étant donné l'exécution du script, quand l'analyse est terminée, alors un rapport détaillé doit être généré avec les clés utilisées, manquantes, inutilisées et protégées

## Tâches

1. - [x] Analyser et comprendre les problèmes du script actuel

   1. - [x] Identifier les patterns de traduction non détectés
   2. - [x] Vérifier les faux positifs et faux négatifs actuels
   3. - [x] Analyser les cas de suppression incorrecte de clés

2. - [x] Améliorer les patterns de détection des clés de traduction

   1. - [x] Ajouter pattern pour `i18n.translate('key')`
   2. - [x] Ajouter pattern pour `i18n.translate(TRANSLATION_KEYS.X.Y.Z)`
   3. - [x] Ajouter pattern pour `i18n.exists(key)`
   4. - [x] Ajouter détection pour les constantes de validation

3. - [x] Implémenter l'analyse des constantes `TRANSLATION_KEYS`

   1. - [x] Capturer les déclarations de constantes de validation
   2. - [x] Analyser les importations depuis `@cv-generator/shared`
   3. - [x] Suivre les références aux constantes importées

4. - [x] Renforcer la sécurité et la fiabilité

   1. - [x] Améliorer le système de backup automatique
   2. - [x] Implémenter la protection de clés essentielles
   3. - [x] Ajouter des confirmations pour les actions destructives

5. - [x] Améliorer la génération de rapports

   1. - [x] Créer structure de rapport JSON avancée
   2. - [x] Inclure les contextes de code pour les clés
   3. - [x] Ajouter les constantes et mappings de validation au rapport

6. - [x] Tester et valider les améliorations
   1. - [x] Exécuter sur le codebase et vérifier les résultats
   2. - [x] Vérifier que les clés de packages core et infrastructure sont détectées
   3. - [x] S'assurer que les clés protégées ne sont pas supprimées

## Principes de Développement

#### Principes à Suivre

- **Sécurité avant tout**: Protéger les clés essentielles et créer des backups
- **Détection exhaustive**: Capturer tous les patterns d'utilisation de traduction
- **Clarté**: Générer des rapports détaillés et compréhensibles
- **Compatibilité**: S'assurer que le script fonctionne avec tous les packages du monorepo
- **Confirmations explicites**: Demander des confirmations claires pour les actions destructives

#### À Éviter

- Suppression automatique de clés sans confirmation
- Faux positifs qui pollueraient les rapports
- Analyses incomplètes qui manqueraient certains patterns d'utilisation
- Modifications sans création préalable de backups
- Scripts trop lents sur de grandes bases de code

## Risques et Hypothèses

| Risque                                         | Probabilité | Impact | Mitigation                                                         |
| ---------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------ |
| Faux positifs dans la détection                | Moyenne     | Moyen  | Affiner les règles de filtrage et la liste des exclusions          |
| Suppressions accidentelles de clés             | Faible      | Élevé  | Système de backup robuste et protection des clés essentielles      |
| Performance dégradée avec beaucoup de fichiers | Moyenne     | Faible | Optimiser les patterns regex et la lecture de fichiers             |
| Incompatibilité avec certains patterns futurs  | Moyenne     | Moyen  | Architecture modulaire pour faciliter l'ajout de nouveaux patterns |
| Faux négatifs (clés utilisées non détectées)   | Moyenne     | Élevé  | Tests extensifs sur différents patterns d'utilisation              |

## Notes Techniques

### Architecture du script amélioré

Le script `i18n-guardian.js` a été restructuré pour améliorer sa robustesse et sa fiabilité avec les composants suivants :

1. **Système de détection des clés**:

   - 20+ patterns regex pour capturer différentes façons d'utiliser les traductions
   - Analyse en profondeur des constantes et des structures imbriquées
   - Filtrage intelligent des faux positifs

2. **Système de protection des clés**:

   - Protection des clés essentielles basée sur des patterns (common._, resume._, ui.\*, etc.)
   - Maintien des clés malgré leur absence apparente dans le code

3. **Système de backup**:

   - Création automatique de backups horodatés avant toute modification
   - Stockage dans `packages/ui/src/i18n/locales/backups/{timestamp}/`

4. **Système de reporting**:
   - Génération d'un rapport détaillé au format JSON
   - Inclusion des contextes de code pour faciliter le débogage
   - Statistiques précises sur les clés utilisées, manquantes, inutilisées et protégées

### Améliorations clés

1. **Détection avancée**:

   - Support pour `i18n.translate()` utilisé dans l'EPIC 5
   - Détection des références à `TRANSLATION_KEYS.X.Y.Z`
   - Extraction des clés des constantes de validation comme `AWARD_VALIDATION_KEYS`

2. **Analyse contextuelle**:
   - Suivi des importations depuis `@cv-generator/shared`
   - Traçage des références aux constantes importées
   - Extraction du contexte de code pour chaque clé détectée

## Journal de Communication

- Dev: "Le script i18n-guardian a un problème grave : il a supprimé presque toutes nos traductions!"
- AI: "Je vais analyser le problème. Il semble que le script ne détecte que 17 clés au lieu de centaines."
- Dev: "Je pense qu'il ne détecte pas correctement les patterns de traduction, notamment ceux de l'EPIC 5."
- AI: "Vous avez raison. Je vais améliorer le script pour détecter tous les patterns, notamment i18n.translate() et les constantes de validation."
- Dev: "N'oubliez pas les traductions dans @award-validation.service.ts et les clés dans @index.ts."
- AI: "J'ai ajouté ces patterns et amélioré la détection des constantes. Le script détecte maintenant 180 clés au lieu de 17."
- Dev: "Il faudrait aussi prendre en compte les exemples dans i18n-usage-examples.md de l'EPIC 5."
- AI: "J'ai intégré ces patterns et testé le script. Il détecte maintenant correctement les clés et crée des backups avant toute modification."
- Dev: "Le script fonctionne maintenant parfaitement, il a maintenant correctement détecté et géré nos clés de traduction!"
