# Product Requirements Document (PRD) pour CV Generator

**Status**: Draft  
**Version**: 1.4.0  
**Date**: 2025-03-15  
**Auteur(s)**: Giak

## Historique des modifications

| Date       | Version | Auteur | Description des modifications                                                                                |
| ---------- | ------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| 2025-02-28 | 1.0.0   | Giak   | Version initiale du document                                                                                 |
| 2025-03-01 | 1.1.0   | Giak   | Ajout de l'optimisation ATS comme fonctionnalité                                                             |
| 2025-03-01 | 1.2.0   | Giak   | Simplification du projet (localStorage uniquement, édition JSON Resume)                                      |
| 2025-03-01 | 1.3.0   | Giak   | Clarification des formats d'export et mise à jour des parcours utilisateur                                   |
| 2025-03-15 | 1.4.0   | Giak   | Enrichissement des personas, ajout classification MoSCoW et amélioration de la section UX/UI                 |
| 2025-03-16 | 1.5.0   | Giak   | Alignement avec le document de fondation technique et mise à jour des détails d'interopérabilité JSON Resume |

## Introduction

### Description du projet

CV Generator est une application web légère qui permet aux utilisateurs de créer, éditer et exporter des CV au format JSON Resume standard (https://jsonresume.org/schema/). L'application offre une interface intuitive pour la saisie des données, avec validation en temps réel, et permet d'exporter le CV en plusieurs formats (JSON, HTML, PDF). L'application fonctionne entièrement côté client avec persistance dans localStorage, sans nécessiter de backend.

### Contexte business et motivations

Le format JSON Resume offre une solution structurée et standardisée pour stocker les données de CV, mais manque d'outils conviviaux pour les utilisateurs non techniques. CV Generator comble cette lacune en proposant:

- Une interface utilisateur simple pour l'édition du format JSON Resume
- La validation des données selon le schéma JSON Resume standard
- Des exports en plusieurs formats utilisables (JSON conforme au standard, HTML, PDF)
- Des conseils pour optimiser le CV pour les systèmes ATS (Applicant Tracking Systems)
- Le fonctionnement entièrement hors ligne via localStorage

#### Positionnement produit

CV Generator se positionne comme une alternative légère et conviviale aux éditeurs de CV en ligne qui nécessitent un compte ou une connexion Internet permanente. Contrairement aux solutions SaaS comme Canva, Resume.io ou LinkedIn, notre application:

- Ne nécessite aucune inscription ni abonnement
- Fonctionne 100% hors ligne
- Offre l'exportation libre dans des formats standards
- Garantit le contrôle total des données par l'utilisateur
- Assure l'interopérabilité avec l'écosystème JSON Resume

### Public cible et parties prenantes

**Public cible**:

- Développeurs souhaitant maintenir leur CV au format JSON Resume standard
- Demandeurs d'emploi à l'aise avec les outils numériques
- Professionnels souhaitant un CV au format structuré et portable
- Utilisateurs de l'écosystème JSON Resume cherchant un éditeur visuel

#### Personas détaillés

1. **Alex, développeur front-end (28 ans)**

   - Souhaite maintenir son CV dans un format structuré et versionné
   - Préfère travailler avec des formats ouverts comme JSON
   - A besoin d'exporter en PDF pour postuler à des offres
   - Valeur principale: contrôle technique et portabilité des données

2. **Sophie, chercheuse d'emploi (35 ans)**

   - Postule régulièrement à des offres via des plateformes en ligne
   - A besoin de conseils pour que son CV passe les filtres ATS
   - Souhaite une interface simple mais complète
   - Valeur principale: optimisation ATS et facilité d'utilisation

3. **Marc, freelance multi-profil (42 ans)**
   - Maintient plusieurs versions de son CV pour différents types de missions
   - A besoin de pouvoir facilement modifier et adapter son CV
   - Préfère travailler hors ligne sur ses documents
   - Valeur principale: flexibilité et personnalisation

**Parties prenantes**:

- Utilisateurs finaux
- Communauté JSON Resume
- Équipe de développement
- Mainteneurs du standard JSON Resume

### Problématique adressée

Malgré l'existence du format JSON Resume, plusieurs problèmes persistent:

1. L'édition directe de JSON est fastidieuse et sujette aux erreurs
2. Les outils existants sont souvent complexes ou nécessitent un compte en ligne
3. La validation du format peut être difficile sans connaissance technique
4. Les CV ne sont pas optimisés pour les systèmes ATS qui filtrent les candidatures
5. Les utilisateurs ont besoin de formats d'export variés (pas seulement JSON)
6. L'interopérabilité entre outils de l'écosystème JSON Resume est limitée par le manque d'interfaces conviviales

CV Generator résout ces problèmes en proposant une solution simple, locale et directe pour éditer et exporter des CV au format JSON Resume standard avec des conseils d'optimisation ATS.

## Objectifs

### Objectifs principaux

- Créer une application permettant l'édition facile de CV au format JSON Resume standard en moins de 10 minutes
- Offrir une validation complète en temps réel des données saisies selon le schéma JSON Resume
- Permettre la sauvegarde locale via localStorage avec garantie d'intégrité des données
- Permettre l'exportation en plusieurs formats (JSON conforme au standard, HTML, PDF)
- Fournir des conseils simples pour l'optimisation ATS des CV
- Assurer la compatibilité complète avec le standard JSON Resume pour l'interopérabilité

### Critères de succès

- 90% des utilisateurs peuvent créer un CV complet sans assistance
- Temps moyen pour créer un CV inférieur à 15 minutes
- Validation complète avec feedback immédiat sur les erreurs
- Persistance fiable des données dans localStorage
- Tous les formats d'export fonctionnent correctement (JSON conforme au standard, HTML, PDF)
- Les conseils ATS sont compréhensibles et utiles pour les utilisateurs (satisfaction > 80%)
- Compatibilité vérifiée avec d'autres outils de l'écosystème JSON Resume

### Indicateurs de performance (KPIs)

- Temps moyen pour compléter un CV (cible: < 15 minutes)
- Taux d'erreurs de validation rencontrées (cible: < 5% des champs remplis)
- Temps de réponse de l'application (cible: < 500ms pour toutes les interactions)
- Taux d'utilisation des différents formats d'export
- Taux de satisfaction concernant les conseils ATS (via feedback utilisateur)
- Nombre de CV créés par utilisateur (cible: > 1,5)
- Taux de rétention à 30 jours (cible: > 40%)
- Taux de conversion des exports (proportion d'utilisateurs qui exportent après création)
- Taux de succès d'interopérabilité (imports/exports sans erreur avec d'autres outils)

### Méthode de mesure des KPIs

- Tracking anonymisé des actions utilisateur avec localStorage
- Mesures de performance via les outils de développement du navigateur
- Formulaire de feedback optionnel après utilisation
- Analyse des erreurs les plus fréquentes pour amélioration continue
- Dashboard de suivi des métriques avec rapports hebdomadaires
- Tests d'utilisabilité trimestriels avec 5-7 utilisateurs représentatifs
- Tests d'interopérabilité avec d'autres outils de l'écosystème JSON Resume

## Parcours utilisateur

### Parcours principal: Création d'un nouveau CV

1. L'utilisateur arrive sur la page d'accueil
2. Il clique sur "Créer un nouveau CV"
3. Il remplit les informations de base (nom, coordonnées, résumé)
4. Il ajoute ses expériences professionnelles une par une
5. Il ajoute ses formations
6. Il ajoute ses compétences et autres sections
7. Il reçoit des conseils d'optimisation ATS au fur et à mesure
8. Il prévisualise son CV
9. Il exporte son CV dans le format souhaité (JSON standard, HTML, PDF)

### Parcours secondaire: Modification d'un CV existant

1. L'utilisateur arrive sur la page d'accueil
2. Il voit son CV précédemment créé et clique dessus
3. Il modifie les sections souhaitées
4. Il reçoit des conseils d'optimisation ATS sur ses modifications
5. Il prévisualise son CV
6. Il exporte son CV mis à jour

### Parcours secondaire: Import d'un CV existant

1. L'utilisateur arrive sur la page d'accueil
2. Il clique sur "Importer un CV"
3. Il sélectionne un fichier JSON au format JSON Resume standard
4. Le système valide le fichier et charge les données
5. L'utilisateur peut modifier les sections
6. Il reçoit des conseils d'optimisation ATS
7. Il prévisualise et exporte son CV

### Écrans principaux et flux utilisateur

1. **Page d'accueil** - Liste des CV existants et options de création/import

   - Transition vers → Création de CV ou Modification de CV

2. **Éditeur de CV** - Interface principale avec navigation par sections

   - Navigation entre → Différentes sections du CV (Informations personnelles, Expérience, etc.)
   - Transition vers → Prévisualisation ou Export

3. **Prévisualisation du CV** - Affichage du CV tel qu'il sera exporté

   - Transition vers → Éditeur de CV ou Export

4. **Page d'export** - Options et configuration d'export
   - Transition vers → Téléchargement de fichier ou Retour à l'éditeur

## Exigences et Fonctionnalités

### Classification des fonctionnalités (MoSCoW)

#### Must Have (Indispensable)

- Formulaire complet pour édition de données JSON Resume standard
- Validation des données selon le schéma JSON Resume officiel
- Sauvegarde automatique dans localStorage
- Export au format JSON conforme au standard
- Interface responsive pour desktop et tablette
- Interopérabilité avec d'autres outils JSON Resume

#### Should Have (Importante)

- Export au format PDF
- Export au format HTML
- Prévisualisation du CV
- Conseils basiques d'optimisation ATS
- Import d'un fichier JSON Resume existant
- Validation à plusieurs niveaux (UI et domaine)

#### Could Have (Souhaitée)

- Templates multiples pour l'export
- Suggestions de mots-clés pour l'optimisation ATS
- Score d'optimisation ATS
- Mode sombre / clair
- PWA pour un fonctionnement hors ligne amélioré

#### Won't Have (Exclue de cette version)

- Authentification et comptes utilisateurs
- Génération automatique de CV avec IA
- Stockage cloud et synchronisation
- Intégration directe avec les plateformes d'emploi
- Backend propriétaire

### Exigences fonctionnelles

1. **Création et édition de CV**

   - Formulaires pour toutes les sections du format JSON Resume standard
   - Validation en temps réel des données saisies
   - Sauvegarde automatique dans localStorage
   - Prévisualisation du CV
   - Support complet de toutes les sections définies dans le standard JSON Resume

2. **Exportation**

   - Export au format JSON strictement conforme au standard
   - Export au format HTML
   - Export au format PDF
   - Possibilité de copier le JSON dans le presse-papier
   - Téléchargement des fichiers générés
   - Validation de la conformité avant export

3. **Gestion des données**

   - Sauvegarde automatique dans localStorage
   - Restauration du CV à la réouverture de l'application
   - Possibilité de réinitialiser le CV
   - Stratégie de migration de données en cas d'évolution du schéma
   - Compression des données pour optimiser l'utilisation du localStorage

4. **Optimisation ATS**
   - Conseils simples pour améliorer la visibilité du CV par les systèmes ATS
   - Suggestions de mots-clés basées sur le contenu du CV
   - Indication de la "lisibilité ATS" du CV
   - Analyse du contenu en temps réel

### Exigences non-fonctionnelles

1. **Performance**

   - Application légère avec temps de réponse < 500ms
   - Temps de chargement initial < 2 secondes
   - Sauvegarde locale sans impact sur l'UX
   - Bundle JS initial < 200KB (gzippé)
   - Performance optimisée même sur des appareils de puissance moyenne

2. **Compatibilité**

   - Support des navigateurs modernes (Chrome, Firefox, Safari, Edge)
   - Fonctionnement hors ligne complet
   - Compatibilité avec le standard JSON Resume
   - Interopérabilité avec les autres outils de l'écosystème

3. **Securité**

   - Données stockées uniquement côté client
   - Pas de transmission de données sensibles
   - Protection contre les injections lors de l'import de fichiers

4. **Conformité**
   - Respect des normes d'accessibilité WCAG 2.1 niveau AA
   - Conformité au RGPD pour la gestion des données personnelles dans localStorage
   - Respect des bonnes pratiques de confidentialité pour les données stockées localement
   - Adhérence stricte aux spécifications du format JSON Resume standard

### Exigences UX/UI

1. **Interface utilisateur**

   - Design responsive pour desktop et tablette
   - Interface intuitive et minimaliste
   - Formulaires organisés par sections logiques (informations personnelles, expérience, éducation, etc.)
   - Palette de couleurs cohérente et accessible (contraste WCAG AA)
   - Typographie lisible (minimum 16px pour le texte principal)
   - Composants UI cohérents à travers l'application
   - Navigation facilitée entre les sections du CV

2. **Expérience utilisateur**
   - Validation en temps réel avec messages d'erreur clairs
   - Navigation simple entre les sections du CV
   - Feedback visuel pour les actions (sauvegarde, export)
   - Prévisualisation du CV
   - Temps de réponse < 500ms pour toutes les interactions
   - États de chargement explicites pour les actions longues
   - Annulation possible des actions critiques
   - Progression visuelle dans le processus de création
   - Feedback sur la conformité au standard JSON Resume

### Principes UI/UX

1. **Simplicité**

   - Éliminer toute complexité non nécessaire
   - Un écran = une tâche principale
   - Réduire la charge cognitive
   - Approche minimaliste favorisant la facilité d'utilisation

2. **Feedback**

   - Chaque action utilisateur reçoit un feedback visuel
   - Messages d'erreur constructifs et spécifiques
   - Confirmation des actions importantes
   - Validation progressive des formulaires

3. **Efficacité**

   - Minimiser le nombre de clics pour les actions fréquentes
   - Raccourcis clavier pour les actions principales
   - Auto-sauvegarde pour éviter la perte de données
   - Navigation intuitive entre sections

4. **Accessibilité**
   - Contraste suffisant pour tous les éléments visuels
   - Support de la navigation au clavier
   - Compatibilité avec les lecteurs d'écran
   - Textes alternatifs pour les éléments visuels
   - Respect des normes WCAG 2.1 AA

### Exigences d'intégration

1. **Compatibilité de format**
   - Respect strict du format JSON Resume standard
   - Validation conforme au schéma JSON Resume officiel
   - Interopérabilité avec d'autres outils de l'écosystème JSON Resume
   - Support complet de toutes les propriétés définies dans le standard

## Fonctionnalités explicitement exclues

Les fonctionnalités suivantes ont été considérées mais sont explicitement exclues du périmètre initial:

1. **Authentification et comptes utilisateurs**

   - Justification: Application entièrement locale sans backend
   - À reconsidérer dans une version future avec backend

2. **Génération automatique de CV avec IA**

   - Justification: Complexité technique et éthique
   - À reconsidérer dans une version future

3. **Stockage cloud et synchronisation**

   - Justification: Application locale sans backend dans sa première version
   - À reconsidérer lors de l'ajout d'un backend

4. **Intégration directe avec les plateformes d'emploi**
   - Justification: Nécessiterait des APIs et des accords avec les plateformes
   - À reconsidérer après établissement de partenariats

## Structure des Epics

### Epic-1: Fondation du système (Status: Complété)

**Description**: Mise en place de l'architecture technique et des composants fondamentaux de l'application conformément aux principes de Clean Architecture.

**Stories principales**:

- ✅ Configurer l'architecture simplifiée Clean Architecture avec structure en packages
- ✅ Créer les modèles de données basés sur le format JSON Resume standard
- ✅ Développer l'interface utilisateur de base et la navigation
- ✅ Mettre en place la validation Zod et la sauvegarde localStorage
- ✅ Implémenter les entités de domaine avec validation multi-niveaux

**Critères d'acceptation**:

- Architecture modulaire conforme aux principes Clean Architecture
- Tests unitaires couvrant les entités du domaine (couverture > 80%)
- Persistance fonctionnelle dans localStorage
- Interface de base réactive et accessible
- Validation conforme au schéma JSON Resume

### Epic-2: Édition de CV (Status: En cours, 60% complété)

**Description**: Développement des formulaires d'édition pour toutes les sections du CV conformes au standard JSON Resume.

**Stories principales**:

- ✅ Créer les formulaires pour les informations de base (basics)
- ✅ Développer les formulaires pour l'expérience professionnelle (work)
- 🔄 Implémenter les formulaires pour l'éducation (education)
- ⏳ Créer les formulaires pour les compétences (skills) et autres sections
- ⏳ Ajouter le support pour toutes les sections optionnelles du standard JSON Resume

**Critères d'acceptation**:

- Formulaires complets pour toutes les sections du JSON Resume standard
- Validation en temps réel avec feedback utilisateur
- Navigation facile entre les sections
- Auto-sauvegarde après chaque modification
- Support de toutes les propriétés définies dans le standard

### Epic-3: Prévisualisation et exportation (Status: Planifié)

**Description**: Fonctionnalités de prévisualisation et d'exportation du CV conformes au standard JSON Resume.

**Stories principales**:

- ⏳ Développer la prévisualisation du CV
- ⏳ Implémenter l'exportation JSON conforme au standard
- ⏳ Implémenter l'exportation HTML et PDF
- ⏳ Créer la fonction de copie dans le presse-papier
- ⏳ Mettre en place le téléchargement des fichiers
- ⏳ Ajouter la validation de conformité au standard avant export

**Critères d'acceptation**:

- Prévisualisation fidèle aux formats d'export
- Export JSON strictement conforme au standard JSON Resume
- Export fonctionnel dans les trois formats (JSON, HTML, PDF)
- Téléchargement direct des fichiers générés
- Performance acceptable sur tous les navigateurs cibles
- Interopérabilité vérifiée avec d'autres outils de l'écosystème

### Epic-4: Optimisation ATS (Status: Planifié)

**Description**: Conseils et outils pour améliorer la visibilité du CV par les systèmes ATS.

**Stories principales**:

- ⏳ Développer la logique d'analyse du contenu du CV
- ⏳ Créer les algorithmes de suggestions de mots-clés
- ⏳ Implémenter l'interface pour afficher les conseils ATS
- ⏳ Mettre en place le score d'optimisation ATS
- ⏳ Développer des recommandations basées sur les meilleures pratiques

**Critères d'acceptation**:

- Conseils ATS pertinents et compréhensibles
- Suggestions de mots-clés contextuelles
- Score ATS calculé en temps réel
- Interface intuitive pour l'affichage des conseils
- Impact mesurable sur la qualité des CV produits

## État actuel d'implémentation

### Composants implémentés (✅)

- Architecture Clean Architecture (packages core, ui, infrastructure, shared)
- Structure de données basée sur JSON Resume standard
- Validation avec Zod conforme au schéma officiel
- Persistance localStorage
- Formulaires pour informations de base et expérience professionnelle
- Tests unitaires pour le domaine core (couverture actuelle: 83%)
- Entités de domaine avec validation multi-niveaux

### Composants en cours (🔄)

- Formulaires d'éducation
- Composants UI réutilisables
- Tests E2E des formulaires
- Support complet de toutes les sections du standard JSON Resume

### Dettes techniques identifiées

- Optimisation de la performance des formulaires complexes
- Gestion complète des erreurs
- Couverture de tests pour les composants UI
- Documentation complète des interfaces JSON Resume

## Questions ouvertes

1. **Évolution vers stockage cloud**: Faut-il prévoir une architecture extensible pour ajouter un backend ultérieurement?

   - Statut: À discuter lors de la validation du MVP
   - Impact: Conception des interfaces de repository
   - Options: Rester local ou préparer l'extension vers IndexedDB ou backend

2. **Formats d'exportation additionnels**: Quels formats prioritaires à ajouter après le JSON, HTML et PDF?

   - Statut: À déterminer après retours utilisateurs sur le MVP
   - Impact: Structure du module d'exportation
   - Options: DOCX, LaTeX, Markdown

3. **Amélioration des conseils ATS**: Comment améliorer la pertinence des conseils ATS sans utiliser d'IA complexe?
   - Statut: Recherche en cours
   - Impact: Qualité de l'optimisation ATS
   - Options: Base de données de règles, analyse statistique, heuristiques

## Aspects Techniques

### Stack technologique

La stack technologique a été sélectionnée pour garantir la simplicité, la performance et le fonctionnement hors ligne:

| Technologie  | Version | Description                          | Justification                              |
| ------------ | ------- | ------------------------------------ | ------------------------------------------ |
| TypeScript   | 5.7+    | Langage principal avec typage strict | Robustesse et maintenabilité du code       |
| Vue.js       | 3.4+    | Framework UI avec Composition API    | Performances et ergonomie du développement |
| Vite         | 6.0+    | Build tool et dev server             | Vitesse de développement et de compilation |
| Pinia        | 2.1+    | State management                     | Gestion d'état type-safe et performante    |
| Tailwind CSS | 3.x     | Framework CSS utilitaire             | Développement rapide et cohérence visuelle |
| Zod          | 3.22+   | Validation de schéma                 | Validation robuste avec inférence de types |
| Vitest       | 3.0+    | Framework de test                    | Tests rapides et intégrés                  |
| jsPDF        | 2.5+    | Génération de PDF côté client        | Export PDF sans backend                    |

### Contraintes techniques

1. **Fonctionnement hors ligne**

   - L'application doit fonctionner intégralement sans connexion internet
   - Toutes les données doivent être persistées dans localStorage
   - Support potentiel de PWA pour améliorer l'expérience hors ligne

2. **Performance**

   - Le bundle JS initial doit être < 200KB (gzippé)
   - L'application doit fonctionner correctement sur des appareils de milieu de gamme
   - Temps de réponse < 500ms pour toutes les interactions
   - Optimisation du rendu pour les exports

3. **Compatibilité**
   - Support des navigateurs modernes (dernières versions de Chrome, Firefox, Safari, Edge)
   - Application responsive fonctionnant sur desktop et tablette
   - Compatibilité stricte avec le standard JSON Resume
   - Interopérabilité avec les autres outils de l'écosystème

### Considérations d'architecture

L'architecture suit une version simplifiée des principes de Clean Architecture:

1. **Organisation du code**

   - Structure en packages distincts suivant Clean Architecture simplifiée
     - Core: Entités de domaine et cas d'utilisation
     - UI: Composants et stores
     - Infrastructure: Implémentations concrètes (localStorage, exports)
     - Shared: Types et utilitaires partagés
   - Séparation du domaine, de l'application, de l'infrastructure et de la présentation
   - Monorepo avec structure en packages

2. **Patterns de conception**

   - Entités du domaine pour la validation et la logique métier
   - Repository pattern pour l'abstraction de localStorage
   - Observer pattern via la réactivité Vue/Pinia
   - Principes SOLID appliqués systématiquement
   - Séparation des préoccupations entre couches

3. **Persistence des données**

   - Stockage exclusif dans localStorage
   - Sauvegarde automatique après modifications
   - Validation à plusieurs niveaux (UI et domaine)
   - Stratégie de migration pour l'évolution du schéma

4. **Stratégie d'export**
   - Export JSON via conversion directe des objets avec validation de conformité
   - Export HTML via templates Vue rendus côté client
   - Export PDF via conversion HTML en utilisant jsPDF
   - Validation de la conformité au standard JSON Resume

## Plan et Timeline

### Phases de développement

1. **Phase 1: MVP (1-2 semaines)**

   - Implémentation complète du schéma JSON Resume standard
   - Formulaires basiques d'édition
   - Stockage localStorage
   - Export JSON conforme au standard
   - Validation complète du schéma

2. **Phase 2: Améliorations UX et formats d'export (2-3 semaines)**

   - Amélioration de l'interface utilisateur
   - Validation complète des formulaires
   - Prévisualisation du CV
   - Export HTML et PDF
   - Conseils ATS de base
   - Import de fichiers JSON Resume existants

3. **Phase 3: Perfectionnement (2 semaines)**
   - Améliorations basées sur les retours utilisateurs
   - Optimisation des performances
   - Améliorations des conseils ATS
   - Tests utilisateurs et ajustements finaux
   - Compatibilité renforcée avec les autres outils de l'écosystème JSON Resume

### Priorités d'implémentation

1. **Priorité Haute**:

   - Structure core conforme au JSON Resume standard
   - Validation complète du schéma officiel
   - Stockage dans localStorage
   - Export au format JSON conforme au standard
   - Interopérabilité avec d'autres outils JSON Resume

2. **Priorité Moyenne**:

   - Amélioration UX des formulaires
   - Prévisualisation du CV
   - Export HTML et PDF
   - Conseils ATS de base
   - Import de fichiers JSON Resume existants
   - Tests unitaires essentiels

3. **Priorité Basse**:
   - Animations et transitions UI
   - Personnalisation avancée des templates
   - Statistiques d'utilisation anonymisées
   - PWA pour fonctionnement hors ligne amélioré

### Jalons clés

| Jalon          | Description                                    | Date cible   | État        |
| -------------- | ---------------------------------------------- | ------------ | ----------- |
| Structure      | Architecture de base et modèles de données     | T+1 semaine  | ✅ Complété |
| Édition        | Formulaires d'édition pour toutes les sections | T+2 semaines | 🔄 60%      |
| MVP            | Version minimale avec export JSON fonctionnel  | T+3 semaines | ⏳ Planifié |
| Export complet | Version avec exports HTML et PDF fonctionnels  | T+4 semaines | ⏳ Planifié |
| Conseils ATS   | Intégration des conseils d'optimisation ATS    | T+5 semaines | ⏳ Planifié |
| V1.0           | Version complète avec UX améliorée             | T+6 semaines | ⏳ Planifié |

### Dépendances

1. **Dépendances internes**:

   - L'exportation dépend de la validation complète des données
   - L'export PDF dépend de l'export HTML
   - Les conseils ATS dépendent de l'implémentation des formulaires complets
   - La compatibilité avec le standard JSON Resume dépend de la validation Zod

2. **Dépendances externes**:
   - Suivi des évolutions du standard JSON Resume
   - Compatibilité avec les navigateurs modernes
   - Limitations du localStorage (5MB max)

## Annexes et Références

### Documents liés

- [Architecture technique](./arch.md)
- [Document de fondation du projet](../project-foundation.md)
- [Spécification JSON Resume](https://jsonresume.org/schema/)
- [Guide de développement](../docs/development-guide.md)

### Ressources complémentaires

- [Exemple de CV au format JSON Resume](../source/RESUME.JSON)
- [Meilleures pratiques ATS](https://www.jobscan.co/blog/ats-friendly-resume/)
- [Bibliotheque jsPDF](https://github.com/parallax/jsPDF)
- [Outils de l'écosystème JSON Resume](https://jsonresume.org/getting-started/)

### Glossaire

- **JSON Resume**: Format standardisé de CV basé sur JSON
- **localStorage**: API web permettant le stockage persistant côté client
- **Clean Architecture**: Approche architecturale séparant les préoccupations en couches distinctes
- **Entity**: Objet avec une identité qui persiste dans le temps
- **Repository**: Abstraction pour l'accès et la persistance des données
- **ATS (Applicant Tracking System)**: Système utilisé par les recruteurs pour filtrer automatiquement les CV
- **Optimisation ATS**: Techniques pour améliorer la visibilité d'un CV dans les systèmes ATS
- **MoSCoW**: Méthode de priorisation (Must have, Should have, Could have, Won't have)
- **Interopérabilité**: Capacité des systèmes à fonctionner ensemble sans restriction d'accès ou de mise en œuvre
