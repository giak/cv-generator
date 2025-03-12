# Diagramme de flux du système de validation

Ce diagramme illustre le flux de données et les interactions entre les différentes couches du système de validation dans notre architecture monorepo gérée par pnpm.

## Flux de validation complet

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant V as Composant Vue
    participant C as Composable
    participant S as Service de validation
    participant VO as Value Object

    U->>V: Saisie utilisateur
    V->>C: validateField()
    C->>S: validateField()
    S->>VO: create()
    VO-->>S: ResultType<T>
    S-->>C: ResultType<T>
    C-->>V: État de validation (erreurs/warnings)
    V-->>U: Affichage erreur/succès/warning
```

## Architecture en couches

```mermaid
flowchart TD
    subgraph "Présentation (@cv-generator/ui)"
        A[Composant Vue] --> B[Composable]
        B -->|useValidationResult| H[Gestion état UI]
    end

    subgraph "Application (@cv-generator/core)"
        B -->|appel| C[Service de validation]
        C -->|orchestration| D[Entité]
    end

    subgraph "Domaine (@cv-generator/core)"
        D -->|délégation| E[Value Object]
    end

    subgraph "Types communs (@cv-generator/shared)"
        F[ResultType]
        G[ERROR_CODES]
    end

    I[Données utilisateur] --> A
    E --> F
    E --> G
    F --> B
    C --> F
    C --> G
```

## Traitement des erreurs

```mermaid
flowchart LR
    A[Validation] --> B{Résultat}
    B -->|Succès sans warning| C[SuccessType]
    B -->|Succès avec warning| D[SuccessType avec warnings]
    B -->|Échec| E[FailureType]

    C --> F[Valeur validée]
    D --> G[Valeur validée]
    D --> H[Warnings]

    E --> I[Erreurs]

    G --> J[Utiliser valeur]
    H --> K[Afficher warnings]
    J --> L[Continuer flux normal]

    I --> M[Afficher erreurs]
    I --> N[Bloquer soumission]

    F --> O[Continuer flux normal]
```

## Cycle de vie d'une validation

```mermaid
stateDiagram-v2
    [*] --> Idle: Initialisation
    Idle --> Validating: Saisie utilisateur
    Validating --> Success: Valide (sans warning)
    Validating --> WarningState: Valide avec warnings
    Validating --> Error: Invalide

    Success --> Idle: Réinitialiser
    WarningState --> Validating: Modifier
    WarningState --> Success: Résoudre warnings
    Error --> Validating: Modifier

    Success --> [*]: Soumettre
    WarningState --> [*]: Soumettre avec confirmation
```

## Structure des packages monorepo

```mermaid
flowchart TD
    subgraph "Monorepo CV Generator (pnpm workspace)"
        A[package.json racine]

        subgraph "UI (@cv-generator/ui)"
            B[Components]
            C[Composables]
            D[Tests]
        end

        subgraph "Core (@cv-generator/core)"
            E[Domain]
            F[Application]
            G[Tests]
        end

        subgraph "Shared (@cv-generator/shared)"
            H[Types]
            I[Constants]
            J[Utils]
        end

        subgraph "Infrastructure (@cv-generator/infrastructure)"
            K[Repositories]
            L[External Services]
        end
    end

    H --> E
    H --> F
    H --> B
    H --> C
    I --> E
    I --> B
    J --> E
    J --> C
    E --> F
    F --> C
    C --> B
```

## Flux de validation des profils dans BasicsForm

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant B as BasicsForm.vue
    participant CF as useCollectionField
    participant VP as validateProfile
    participant ER as ERROR_CODES.COMMON

    U->>B: Saisie profil (réseau, username, url)
    B->>CF: addItem()
    CF->>VP: validateItem()

    alt Réseau manquant
        VP->>ER: REQUIRED_FIELD
        ER-->>VP: "required_field"
        VP-->>CF: FailureType<ProfileInterface>
        CF-->>B: Afficher erreur
    else Username manquant
        VP->>ER: REQUIRED_FIELD
        ER-->>VP: "required_field"
        VP-->>CF: FailureType<ProfileInterface>
        CF-->>B: Afficher erreur
    else URL invalide
        VP->>ER: INVALID_FORMAT
        ER-->>VP: "invalid_format"
        VP-->>CF: FailureType<ProfileInterface> (warning)
        CF-->>B: Afficher warning
    else Profil valide
        VP-->>CF: SuccessType<ProfileInterface>
        CF-->>B: Ajouter profil
    end

    B-->>U: Feedback visuel (succès/erreur/warning)
```
