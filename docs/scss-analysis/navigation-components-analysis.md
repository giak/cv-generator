# Analyse des composants de navigation (\_navigation.scss)

## Aperçu

Ce document analyse les styles de navigation définis dans `_navigation.scss` pour planifier leur migration vers des composants Vue utilisant Tailwind CSS. L'objectif est d'identifier clairement les composants distincts, leurs caractéristiques et les priorités de migration.

## Composants identifiés

### 1. Menu de navigation principal (`nav-menu`)

- Composé de groupes de navigation avec titres
- Éléments avec icônes, texte et badges
- États actifs avec indicateur visuel
- Styles de survol

### 2. Menu horizontal pour header (`horizontal-nav`)

- Version horizontale du menu principal
- Optimisé pour les éléments d'en-tête
- Navigation plus compacte

### 3. Fil d'Ariane (`breadcrumbs`)

- Affichage du chemin de navigation
- Séparateurs entre éléments
- Styles distinct pour l'élément actif/courant

### 4. Sidebar technique

- Conteneur latéral avec état rétractable
- Logo et branding
- Menu de navigation avec sections
- Sous-menus déroulants
- Footer avec profil utilisateur
- Bouton de basculement sidebar

### 5. Header (topbar)

- Barre horizontale supérieure
- Breadcrumb intégré
- Actions et notifications
- Menu utilisateur dropdown

### 6. Composants à créer mais non présents dans le CSS actuel

- **TabNav** (à développer en priorité)
- Dropdowns
- Pagination
- Steps

## Priorités de migration

1. **TabNav** (Première priorité selon la demande)
2. Sidebar et composants associés
3. Header/topbar
4. Breadcrumbs
5. Menus de navigation (vertical et horizontal)
6. Composants secondaires (Dropdowns, Pagination, Steps)

## Plan pour TabNav.vue

Bien que TabNav ne soit pas explicitement présent dans le CSS actuel, nous allons créer ce composant en s'inspirant du style général et des principes des autres éléments de navigation.

### Caractéristiques à implémenter

- Design cohérent avec le thème sombre existant
- Tabs avec états actifs/inactifs
- Support pour icônes dans les tabs
- Indicateur visuel pour l'onglet actif
- Animations fluides lors des transitions
- Version horizontale et verticale
- Support pour désactiver certains onglets
- Accessibilité (ARIA roles, keyboard navigation)

### Structure proposée

- `TabNav.vue` - Conteneur principal
- `TabNavItem.vue` - Élément individuel d'onglet
- `TabContent.vue` - Contenu associé à chaque onglet

## Éléments de design communs

Plusieurs motifs de design récurrents ont été identifiés:

1. **Couleurs**

   - Fond sombre (neutral-950, neutral-900)
   - Texte clair (white, neutral-300)
   - Accent primaire pour éléments actifs (primary-400, primary-500)
   - Bordures subtiles (neutral-800)

2. **Interactions**

   - Transitions fluides (transition-all duration-200)
   - Effets de survol avec changement de luminosité
   - Indicateurs visuels pour états actifs

3. **Typographie**

   - Texte principal: text-sm
   - Titres de section: text-xs, uppercase
   - Badges et info secondaire: text-xs

4. **Espacements**
   - Padding: py-2, px-3 (typique pour éléments de navigation)
   - Marge entre sections: mb-6
   - Marge entre éléments: mb-1

## Points techniques à considérer

1. **Gestion des états**

   - Communication parent-enfant via props et events
   - Utilisation de provide/inject pour contexte

2. **Accessibilité**

   - Rôles ARIA appropriés
   - Support clavier
   - Contraste suffisant

3. **Responsive design**
   - Support mobile et desktop
   - Comportement adaptatif

## Prochaines étapes

1. Développer TabNav.vue et composants associés
2. Créer des tests unitaires
3. Documentation d'usage
4. Déprécier progressivement les classes SCSS
