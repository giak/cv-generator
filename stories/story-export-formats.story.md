# Epic-2: Sections Avancées

# Story-1: Implémentation des Formats d'Export HTML et PDF

## Description de la Story

**En tant que** utilisateur du CV Generator  
**Je veux** pouvoir exporter mon CV en formats HTML et PDF  
**afin de** partager facilement mon CV avec des recruteurs ou le télécharger pour un usage personnel

## Statut

Draft

## Contexte

L'application permet actuellement l'export au format JSON, mais les utilisateurs ont besoin de formats plus universels pour partager leurs CV. L'export HTML permet une visualisation web standard, tandis que le PDF est le format le plus couramment accepté pour les candidatures.

Cette story est liée à l'Epic-2 qui vise à enrichir les fonctionnalités du CV Generator au-delà des fonctionnalités de base. Elle dépend des fonctionnalités d'édition et de stockage déjà implémentées dans l'Epic-1.

Les contraintes techniques incluent la génération de PDF côté client sans backend et la nécessité de maintenir une mise en page cohérente entre les différents formats.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. Étant donné que j'ai créé un CV, quand je clique sur "Exporter en HTML", alors un fichier HTML contenant mon CV formaté est téléchargé
2. Étant donné que j'ai créé un CV, quand je clique sur "Exporter en PDF", alors un fichier PDF contenant mon CV formaté est téléchargé
3. Étant donné que j'exporte mon CV en HTML, quand j'ouvre le fichier généré dans un navigateur, alors tous les champs de mon CV sont visibles et correctement formatés
4. Étant donné que j'exporte mon CV en PDF, quand j'ouvre le fichier généré dans un lecteur PDF, alors tous les champs de mon CV sont visibles et correctement formatés
5. Étant donné que j'ai modifié mon CV, quand j'exporte à nouveau en HTML ou PDF, alors les fichiers générés reflètent mes dernières modifications

## Tâches

1. - [ ] Implémentation de l'export HTML

   1. - [ ] Créer un template HTML pour le rendu du CV
   2. - [ ] Implémenter le service d'export HTML
   3. - [ ] Ajouter le support des styles CSS pour le rendu HTML
   4. - [ ] Développer les tests unitaires pour le service d'export HTML
   5. - [ ] Intégrer le bouton d'export HTML dans l'interface utilisateur

2. - [ ] Implémentation de l'export PDF

   1. - [ ] Évaluer et intégrer la bibliothèque jsPDF
   2. - [ ] Créer le service d'export PDF basé sur le rendu HTML
   3. - [ ] Configurer les options de mise en page (marges, orientation)
   4. - [ ] Implémenter la gestion des polices dans le PDF
   5. - [ ] Développer les tests unitaires pour le service d'export PDF
   6. - [ ] Intégrer le bouton d'export PDF dans l'interface utilisateur

3. - [ ] Intégration dans l'interface utilisateur
   1. - [ ] Créer une page ou modal d'options d'export
   2. - [ ] Implémenter les indicateurs de progression pendant la génération
   3. - [ ] Gérer les erreurs d'export et afficher des messages appropriés
   4. - [ ] Tester l'expérience utilisateur complète du processus d'export

## Principes de Développement

#### Principes à Suivre

- **Simplicité**: Solution minimale répondant aux critères d'acceptation (focus sur l'export fonctionnel sans options avancées pour l'instant)
- **Périmètre**: Se limiter strictement aux exigences documentées (export HTML et PDF de base)
- **Cohérence**: Respecter l'architecture Clean et les patterns existants

#### À Éviter

- Génération de fonctionnalités avancées comme l'édition des templates
- Création de multiples variantes de templates pour cette première version
- Implémentation d'options de personnalisation non couvertes par les critères d'acceptation

## Notes de Développement

- Utiliser jsPDF pour la génération de PDF côté client
- S'assurer que le rendu HTML utilise des styles compatibles avec la génération PDF
- Envisager l'utilisation de Web Workers pour la génération PDF afin d'éviter de bloquer l'UI
- Les templates doivent suivre les principes de design responsive pour s'adapter à différents formats

## Risques et Hypothèses

| Risque/Hypothèse                                          | Impact | Mitigation                                                                |
| --------------------------------------------------------- | ------ | ------------------------------------------------------------------------- |
| Performance de génération PDF sur appareils peu puissants | Moyen  | Optimiser le rendu, fournir des indicateurs de progression                |
| Divergences de rendu entre navigateurs                    | Élevé  | Utiliser des styles CSS compatibles et tester sur plusieurs navigateurs   |
| Taille des CV complexes dépassant les limites             | Faible | Tester avec des CV de grande taille, optimiser le processus de génération |
| Manque de personnalisation des templates                  | Moyen  | Planifier une story future pour la personnalisation des templates         |

## Journal de Communication

- N/A (story initiale)
