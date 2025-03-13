# Epic-5: Internationalisation et Multilinguisme

Story-3: Internationalisation des Composants UI Restants

## Description de la Story

**En tant que** développeur du projet CV Generator
**Je veux** remplacer tous les textes codés en dur dans les composants UI restants par des appels aux clés de traduction
**afin de** compléter l'internationalisation de l'interface utilisateur et fournir une expérience cohérente dans toutes les langues supportées

## Statut

Draft

## Contexte

Cette story fait partie de l'Epic-5 qui vise à internationaliser notre application CV Generator. Elle est une suite directe de la Story-2 qui a établi la centralisation des clés de traduction et a mis en place la structure d'internationalisation.

Dans la Story-2, nous avons:

- Créé la structure des clés de traduction dans `@cv-generator/shared`
- Mis en place les fichiers de traduction en français et anglais
- Implémenté l'internationalisation complète du composant `BasicsForm.vue`

Cependant, il reste 21 autres composants UI qui contiennent encore des textes codés en dur, comme identifié dans la documentation technique d'implémentation [docs/epic-5/story-2-implementation.md](../../docs/epic-5/story-2-implementation.md). Cette story se concentre sur l'application systématique du même pattern d'internationalisation à ces composants restants.

Cette story est basée sur l'analyse détaillée réalisée dans le document d'implémentation de la Story-2, qui a évalué les composants restants à internationaliser, identifié les patrons à suivre, et établi une priorisation du travail. Toute la méthodologie et la planification de cette story sont directement issues de cette analyse.

Le travail s'appuiera sur les conventions et la structure établies dans la Story-2, en utilisant le composant `BasicsForm.vue` comme modèle de référence. Nous devrons nous assurer que toutes les clés de traduction nécessaires sont ajoutées dans la structure centralisée et que les fichiers de traduction sont mis à jour de manière cohérente.

## Estimation

Story Points: 5

## Critères d'Acceptation

1. Étant donné les 21 composants UI identifiés, quand j'examine leur code, alors aucun texte destiné à l'utilisateur ne doit être codé en dur
2. Étant donné un composant modifié, quand je l'utilise avec la langue française, alors tous ses textes sont affichés en français
3. Étant donné un composant modifié, quand je l'utilise avec la langue anglaise, alors tous ses textes sont affichés en anglais
4. Étant donné l'ajout de nouvelles clés de traduction, quand j'examine la structure, alors elle respecte strictement les conventions établies dans la documentation technique
5. Étant donné le contexte de traduction, quand une erreur de traduction survient, alors le composant utilise la fonction `safeTranslate` pour afficher un texte de repli
6. Étant donné les modifications apportées, quand je lance la suite de tests, alors tous les tests passent sans erreur

## Tâches

1. - [ ] Préparation des clés de traduction pour les composants restants

   1. - [ ] Analyser chaque composant pour identifier tous les textes à internationaliser
   2. - [ ] Étendre la structure des clés de traduction dans `@cv-generator/shared`
   3. - [ ] Ajouter les nouvelles entrées dans les fichiers de traduction français et anglais

2. - [ ] Mise à jour des composants de formulaire (Form)

   1. - [ ] Mettre à jour WorkForm.vue
   2. - [ ] Mettre à jour SkillForm.vue
   3. - [ ] Mettre à jour EducationForm.vue
   4. - [ ] Mettre à jour ProjectForm.vue
   5. - [ ] Mettre à jour PublicationForm.vue
   6. - [ ] Mettre à jour LanguageForm.vue
   7. - [ ] Mettre à jour InterestForm.vue
   8. - [ ] Mettre à jour AwardForm.vue
   9. - [ ] Mettre à jour CertificateForm.vue
   10. - [ ] Mettre à jour ReferenceForm.vue
   11. - [ ] Mettre à jour VolunteerForm.vue

3. - [ ] Mise à jour des composants de liste (List)

   1. - [ ] Mettre à jour WorkList.vue
   2. - [ ] Mettre à jour SkillList.vue
   3. - [ ] Mettre à jour EducationList.vue
   4. - [ ] Mettre à jour ProjectList.vue
   5. - [ ] Mettre à jour PublicationList.vue
   6. - [ ] Mettre à jour LanguageList.vue
   7. - [ ] Mettre à jour InterestList.vue
   8. - [ ] Mettre à jour AwardList.vue
   9. - [ ] Mettre à jour CertificateList.vue
   10. - [ ] Mettre à jour ReferenceList.vue
   11. - [ ] Mettre à jour VolunteerList.vue

4. - [ ] Tests et validation

   1. - [ ] Adapter les tests unitaires pour prendre en compte l'internationalisation
   2. - [ ] Tester tous les composants avec les deux langues supportées
   3. - [ ] Vérifier l'absence d'erreurs de console liées aux traductions manquantes
   4. - [ ] S'assurer que les textes de repli fonctionnent correctement en cas d'erreur

5. - [ ] Documentation et finalisation
   1. - [ ] Mettre à jour la documentation technique si nécessaire
   2. - [ ] Créer un guide de référence pour l'ajout futur de nouvelles clés de traduction
   3. - [ ] Organiser une revue de code pour valider l'implémentation

## État d'Avancement

### Réalisations

- ✅ Analyse complète des composants à internationaliser réalisée (voir le document d'analyse [docs/epic-5/story-2-implementation.md](../../docs/epic-5/story-2-implementation.md))
- ✅ Structure existante des clés de traduction et conventions documentées
- ✅ Composant BasicsForm.vue servant de modèle de référence fonctionnel

### Reste à Faire

- 📌 Extension de la structure des clés pour tous les composants
- 📌 Adaptation de chaque composant pour utiliser les clés de traduction
- 📌 Tests complets dans les deux langues
- 📌 Mise à jour de la documentation

### Problèmes Identifiés et Solutions

- ⚠️ Volume important de composants à modifier (21 au total)
- ✅ Solution: Approche systématique et priorisation des composants les plus utilisés
- ⚠️ Risque de duplication ou d'incohérence dans les clés de traduction
- ✅ Solution: Revue régulière et utilisation stricte des conventions établies

## Principes de Développement

#### Principes à Suivre

- **Cohérence**: Suivre exactement le même pattern que celui utilisé dans BasicsForm.vue
- **TDD**: Adapter d'abord les tests, puis modifier le code pour qu'ils passent
- **DRY**: Éviter la duplication de clés ou de logique de traduction
- **Simplicité**: Préférer la clarté du code à l'optimisation prématurée
- **Robustesse**: Utiliser systématiquement `safeTranslate` pour gérer les erreurs de traduction

#### À Éviter

- La création de nouvelles conventions ou patterns différents de ceux établis
- L'ajout de fonctionnalités non liées à l'internationalisation
- La modification de la logique métier des composants
- L'overengineering avec des abstractions excessives
- Le contournement du système centralisé de traduction

## Risques et Hypothèses

| Risque                                             | Probabilité | Impact | Mitigation                                                     |
| -------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------- |
| Incohérence entre les composants internationalisés | Moyenne     | Élevé  | Suivre strictement le modèle de BasicsForm.vue                 |
| Oubli de textes à internationaliser                | Élevée      | Moyen  | Analyse systématique et revue de code détaillée                |
| Erreurs de traduction à l'exécution                | Moyenne     | Élevé  | Utilisation systématique de safeTranslate et tests approfondis |
| Délai important dû au volume de composants         | Élevée      | Moyen  | Priorisation des composants et approche incrémentale           |
| Conflit avec d'autres développements en cours      | Faible      | Moyen  | Coordination avec l'équipe et planification des merges         |

## Documentation d'Implémentation

### Approche Méthodologique

Pour chaque composant à internationaliser, nous suivrons systématiquement ces étapes:

1. **Analyse du composant**

   - Identifier tous les textes en dur (labels, placeholders, messages d'erreur, etc.)
   - Regrouper ces textes par catégorie fonctionnelle
   - Déterminer la structure hiérarchique appropriée pour ces textes

2. **Extension des clés de traduction**

   - Ajouter les nouvelles propriétés dans `TRANSLATION_KEYS` avec la convention UPPERCASE
   - Définir les valeurs de chemin en utilisant la convention camelCase
   - S'assurer que la structure hiérarchique est cohérente avec l'existant

3. **Ajout des traductions**

   - Ajouter les entrées correspondantes dans `en.json` et `fr.json`
   - Utiliser exactement la même structure que celle définie dans les chemins
   - Utiliser la convention camelCase pour toutes les clés JSON

4. **Adaptation du composant**

   - Importer `TRANSLATION_KEYS` from '@cv-generator/shared'
   - Ajouter l'initialisation de useI18n et la fonction safeTranslate
   - Remplacer tous les textes en dur par des appels à `$t(TRANSLATION_KEYS.PATH.TO.KEY)`
   - Utiliser `safeTranslate` pour les cas où un fallback est nécessaire

5. **Test et validation**
   - Vérifier l'absence d'erreurs dans la console
   - Tester le composant avec les différentes langues supportées
   - S'assurer que tous les textes sont correctement traduits

### Ordre de Priorité

Les composants seront mis à jour dans cet ordre de priorité, conformément à l'analyse dans le document d'implémentation:

1. **Haute priorité**: WorkForm/List, EducationForm/List, SkillForm/List
2. **Priorité moyenne**: ProjectForm/List, LanguageForm/List
3. **Basse priorité**: Autres composants (Publication, Award, etc.)

## Journal de Communication

- Dev: J'ai analysé les 21 composants restants à internationaliser et estimé l'effort à environ 33 heures de travail
- Tech Lead: Nous devons prioriser les composants les plus utilisés et suivre strictement les conventions établies
- Dev: Je propose de commencer par les formulaires de travail, éducation et compétences qui sont les plus critiques
- Tech Lead: Bonne approche, assurez-vous de maintenir une cohérence parfaite avec BasicsForm.vue
- Dev: Comment gérer les cas où les traductions pourraient être manquantes temporairement?
- Tech Lead: Utilisez systématiquement safeTranslate avec un fallback explicite pour chaque clé

## Références

- [Documentation technique d'implémentation de la Story-2](../../docs/epic-5/story-2-implementation.md) - Document d'analyse détaillée qui a servi de base à cette story
- [Story-2: Centralisation des clés de traduction](../epic-5/2-centralisation-messages.story.md) - Story précédente dont celle-ci est la continuation
- [BasicsForm.vue](../../packages/ui/src/modules/cv/presentation/components/BasicsForm.vue) - Composant de référence pour l'implémentation
