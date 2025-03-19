# Epic-5: Internationalisation et Multilinguisme

Story-4: Fonctionnalités d'internationalisation et expérience utilisateur

## Description de la Story

**En tant qu'** utilisateur du CV Generator
**Je veux** pouvoir changer la langue de l'interface et avoir une détection automatique de ma langue préférée
**afin de** utiliser l'application dans ma langue maternelle et bénéficier d'une meilleure expérience utilisateur

## Statut

En cours

## Contexte

Cette story fait partie de l'Epic-5 qui vise à internationaliser notre application CV Generator. Elle s'appuie sur les Stories 1, 2 et 3 qui ont établi l'architecture d'internationalisation, centralisé les clés de traduction et adapté les composants existants.

Maintenant que l'infrastructure technique d'internationalisation est en place, cette story se concentre sur les aspects d'expérience utilisateur liés au changement de langue. Elle vise à créer une interface intuitive permettant à l'utilisateur de sélectionner sa langue préférée, avec une détection automatique basée sur la langue du navigateur et une persistance de ce choix.

Cette story est cruciale pour rendre l'internationalisation visible et utile pour l'utilisateur final, et pour assurer une expérience cohérente à travers toute l'application.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur qui ouvre l'application pour la première fois, quand l'application se charge, alors la langue détectée du navigateur est automatiquement utilisée si elle est supportée
2. ✅ Étant donné un utilisateur qui souhaite changer de langue, quand il clique sur le sélecteur de langue, alors il peut choisir parmi les langues disponibles (français, anglais)
3. ✅ Étant donné qu'un utilisateur a choisi une langue, quand il revient sur l'application ultérieurement, alors sa préférence est conservée
4. ✅ Étant donné un utilisateur qui change de langue, quand la langue est modifiée, alors tous les textes de l'interface sont immédiatement mis à jour dans la nouvelle langue
5. ✅ Étant donné un sélecteur de langue, quand il est visible dans l'interface, alors il indique clairement la langue actuellement sélectionnée
6. ✅ Étant donné la nature responsive de l'application, quand le sélecteur de langue est implémenté, alors il est utilisable sur tous les formats d'écran supportés

## Tâches

1. - [x] Implémenter la détection de langue du navigateur

   1. - [x] Créer une fonction d'initialisation qui détecte la langue du navigateur
   2. - [x] Mettre en place la logique de fallback vers la langue par défaut (français)
   3. - [x] Intégrer cette détection au démarrage de l'application

2. - [x] Créer le composant de sélection de langue

   1. - [x] Concevoir le sélecteur de langue avec une UI accessible
   2. - [x] Implémenter la logique de changement de langue
   3. - [x] Ajouter des icônes ou drapeaux pour les langues disponibles
   4. - [x] Tester l'accessibilité du composant (navigation clavier, etc.)

3. - [x] Implémenter la persistance des préférences linguistiques

   1. - [x] Stocker la préférence de langue dans localStorage
   2. - [x] Créer une logique de récupération au démarrage de l'application
   3. - [x] Gérer la synchronisation entre locales et préférences stockées

4. - [x] Ajouter le sélecteur de langue dans l'interface

   1. - [x] Intégrer le sélecteur dans l'en-tête de l'application
   2. - [x] Assurer sa visibilité sur tous les écrans de l'application
   3. - [x] Adapter le design pour les différentes tailles d'écran

5. - [x] Optimiser le chargement des traductions
   1. - [x] Implémenter un mécanisme robuste de chargement des fichiers de traduction
   2. - [x] Ajouter une gestion d'erreurs pour éviter les écrans blancs
   3. - [x] Précharger les traductions par défaut pour garantir un fonctionnement minimal

## Avancement

### 2024-05-13 - Implémentation des fonctionnalités de base

Nous avons implémenté avec succès les fonctionnalités suivantes :

1. **Détection de langue du navigateur** :

   - Création d'une fonction `detectBrowserLanguage()` qui détecte la langue préférée de l'utilisateur parmi les langues supportées
   - Mise en place d'un fallback vers la langue par défaut (français) lorsque la langue du navigateur n'est pas supportée
   - Intégration de cette détection au démarrage de l'application via la fonction `getInitialLocale()`

2. **Composant de sélection de langue** :

   - Création d'un composant `LanguageSelector` accessible avec support clavier
   - Ajout des drapeaux pour chaque langue (🇫🇷, 🇬🇧)
   - Mise en œuvre d'une UI responsive s'adaptant aux différentes tailles d'écran
   - Tests des fonctionnalités et de l'accessibilité

3. **Persistance des préférences linguistiques** :

   - Stockage de la langue sélectionnée dans localStorage
   - Récupération automatique de la préférence de l'utilisateur au démarrage
   - Gestion des cas d'erreur d'accès au localStorage

4. **Intégration dans l'interface** :
   - Ajout du composant `LanguageSelector` dans l'en-tête de l'application
   - Mise en place d'un positionnement adaptatif selon la taille de l'écran

### 2024-05-14 - Optimisation et robustesse

Après avoir rencontré des problèmes d'écran blanc lors du chargement de l'application, nous avons implémenté plusieurs améliorations :

1. **Optimisation du chargement des traductions** :

   - Préchargement des messages par défaut pour assurer un fonctionnement minimal de l'application
   - Mise en place d'une architecture de chargement progressive des traductions
   - Ajout de journalisation détaillée pour faciliter le débogage

2. **Gestion des erreurs robuste** :

   - Restructuration de la logique d'initialisation de l'application pour éviter les écrans blancs
   - Mise en place de mécanismes de fallback pour gérer les échecs de chargement des traductions
   - Montage de l'application même en cas d'erreur pour garantir une expérience utilisateur minimale

3. **Architecture asynchrone améliorée** :
   - Refactorisation du code pour utiliser async/await de manière plus robuste
   - Simplification des promesses chaînées pour éviter les problèmes de double montage de l'application
   - Centralisation des erreurs et amélioration des messages de journalisation

Toutes les exigences d'UX et fonctionnelles pour cette story sont maintenant satisfaites. L'application détecte correctement la langue de l'utilisateur, permet de changer facilement de langue via l'interface, et persiste ce choix entre les sessions.

## Principes de Développement

#### Principes à Suivre

- **UX First**: Concevoir en priorisant l'expérience utilisateur et l'intuitivité
- **Accessibilité**: Respecter les standards WCAG AA pour le sélecteur de langue
- **Performance**: Assurer que le changement de langue est immédiat et fluide
- **Persistance**: Garantir la conservation des préférences utilisateur
- **Feedback visuel**: Fournir un retour clair lors du changement de langue

#### À Éviter

- Une interface de sélection de langue trop complexe ou peu intuitive
- Des incohérences visuelles lors du changement de langue
- Des performances dégradées lors du chargement des fichiers de traduction
- Une détection de langue qui override la préférence explicite de l'utilisateur
- Un sélecteur de langue difficile à trouver dans l'interface

## Risques et Hypothèses

| Risque                                                     | Probabilité | Impact | Mitigation                                                                       |
| ---------------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------- |
| Performance dégradée lors du changement de langue          | Moyenne     | Élevé  | Implémenter un chargement optimisé des fichiers de traduction                    |
| Incohérences visuelles avec textes de longueurs variables  | Élevée      | Moyen  | Concevoir une interface flexible qui s'adapte aux différentes longueurs de texte |
| Problèmes avec la détection de langue du navigateur        | Moyenne     | Faible | Avoir un fallback robuste vers la langue par défaut                              |
| Conflit entre localStorage et préférences de l'utilisateur | Faible      | Moyen  | Prioriser clairement les préférences explicites de l'utilisateur                 |
| Accessibilité réduite pour certains utilisateurs           | Moyenne     | Élevé  | Tester rigoureusement l'accessibilité du sélecteur de langue                     |

## Notes de Développement

### Architecture de chargement des traductions

Pour améliorer la robustesse du chargement des traductions, nous avons implémenté une architecture en plusieurs étapes :

1. **Préchargement des messages par défaut** :

```typescript
export async function preloadDefaultMessages() {
  if (defaultMessagesLoaded) return;

  try {
    console.log(`Preloading default messages for ${DEFAULT_LOCALE}`);
    const defaultMessages = await import(`./locales/${DEFAULT_LOCALE}.json`);
    i18n.global.setLocaleMessage(DEFAULT_LOCALE, defaultMessages.default);
    defaultMessagesLoaded = true;
    console.log("Default messages preloaded successfully");
  } catch (error) {
    console.error(
      `Failed to preload default messages for ${DEFAULT_LOCALE}:`,
      error
    );
    // Définir un objet de messages minimal pour éviter les erreurs
    i18n.global.setLocaleMessage(DEFAULT_LOCALE, {
      common: {
        errors: {
          generic: "Une erreur s'est produite",
        },
        actions: {
          save: "Enregistrer",
          cancel: "Annuler",
        },
      },
    });
  }
}
```

2. **Initialisation sécurisée de l'application** :

```typescript
const initializeApp = async () => {
  console.log("Initializing application...");

  try {
    // 1. Précharger les messages par défaut (pour garantir une fallback)
    await preloadDefaultMessages();

    // 2. Détecter la langue et charger les messages correspondants
    const detectedLocale = getInitialLocale();
    console.log(`Detected locale: ${detectedLocale}`);

    if (detectedLocale !== DEFAULT_LOCALE) {
      try {
        await loadLocaleMessages(detectedLocale);
        console.log(`Successfully loaded messages for ${detectedLocale}`);
      } catch (error) {
        console.error(
          `Failed to load messages for ${detectedLocale}, using default locale`,
          error
        );
        // Pas besoin de charger à nouveau les messages par défaut car ils ont été préchargés
      }
    }

    // 3. Monter l'application
    console.log("Mounting application...");
    app.mount("#app");
    console.log("Application mounted successfully");
  } catch (error) {
    console.error("Critical error during app initialization:", error);

    // En cas d'erreur critique, monter quand même l'application
    // pour permettre à l'utilisateur d'interagir avec l'interface
    console.warn("Mounting application despite initialization errors");
    app.mount("#app");
  }
};
```

### Composant de sélection de langue

Le composant LanguageSelector a été implémenté avec une UI accessible et une expérience utilisateur intuitive. Il affiche les langues disponibles avec leur drapeau et leur nom dans la langue correspondante. Le composant est conçu pour être responsive et s'adapter aux différentes tailles d'écran:

- Sur les écrans larges, il affiche un menu déroulant classique
- Sur les écrans mobiles, il affiche un menu en bas de l'écran, plus facile à utiliser sur tactile

```css
/* Responsive */
@media (max-width: 640px) {
  .language-selector__dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    padding: 0.5rem 0;
  }

  .language-selector__item {
    padding: 0.75rem 1rem;
    justify-content: center;
  }
}
```

## Journal de Communication

- UX Designer: Le sélecteur de langue doit être accessible depuis toutes les pages de l'application
- Dev: Où placer le sélecteur de langue dans l'interface?
- UX Designer: Dans l'en-tête, côté droit, avec une indication visuelle claire
- Dev: Faut-il utiliser des drapeaux pour représenter les langues?
- UX Designer: Oui, les drapeaux combinés avec les noms dans leur propre langue (Français, English) pour plus de clarté
- Dev: Comment gérer le cas où la langue détectée n'est pas supportée?
- Tech Lead: Avoir un fallback sur la langue par défaut (français) et permettre à l'utilisateur de changer facilement
- Dev: Quel comportement adopter si l'utilisateur change de langue en plein formulaire?
- UX Designer: Tous les textes doivent être mis à jour immédiatement, mais les données saisies doivent être préservées
- Dev: Faut-il un message de confirmation lors du changement de langue?
- UX Designer: Non, le changement doit être immédiat avec un feedback visuel clair (le nom de la langue actuelle)
- Dev: Comment éviter les écrans blancs lors du chargement des traductions?
- Tech Lead: Implémenter un mécanisme de préchargement des traductions par défaut et monter l'application même en cas d'erreur
