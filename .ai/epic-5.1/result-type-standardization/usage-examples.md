# Exemples d'utilisation du ResultType standardisé

Ce document présente des exemples pratiques d'utilisation du pattern ResultType standardisé dans différents contextes de l'application.

## Table des matières

- [Création de Value Objects](#création-de-value-objects)
- [Validation d'entités](#validation-dentités)
- [Chaînage d'opérations](#chaînage-dopérations)
- [Gestion de cas d'erreur](#gestion-de-cas-derreur)
- [Utilisation avec des bibliothèques de validation](#utilisation-avec-des-bibliothèques-de-validation)
- [Traitement conditionnel](#traitement-conditionnel)
- [Utilisation dans les composants UI](#utilisation-dans-les-composants-ui)
- [Intégration avec les APIs](#intégration-avec-les-apis)
- [Tests unitaires](#tests-unitaires)

## Création de Value Objects

### Exemple simple - Email

```typescript
import {
  ResultTypeInterface,
  createSuccess,
  createFailure,
  ValidationErrorInterface,
} from "@cv-generator/shared";

// Définition du Value Object
class Email {
  private constructor(private readonly value: string) {}

  // Méthode factory avec ResultType
  public static create(email: string): ResultTypeInterface<Email> {
    // Validation avec expression régulière
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return createFailure<Email>([
        {
          code: "INVALID_EMAIL_FORMAT",
          message: "Format email invalide",
          field: "email",
          severity: "error",
          layer: "DOMAIN",
        },
      ]);
    }

    return createSuccess(new Email(email));
  }

  public getValue(): string {
    return this.value;
  }
}

// Utilisation
const emailResult = Email.create("user@example.com");

if (emailResult.isSuccess()) {
  const email = emailResult.getValue();
  console.log(`Email valide: ${email.getValue()}`);
} else {
  const errors = emailResult.getErrors();
  console.error("Erreurs de validation:", errors);
}
```

### Exemple avec avertissements - URL

```typescript
import {
  ResultTypeInterface,
  createSuccess,
  createFailure,
  createSuccessWithWarnings
} from '@cv-generator/shared';

// Méthode factory avec succès ET avertissements
public static create(url: string): ResultTypeInterface<Url> {
  // Validation de base
  if (!url) {
    return createFailure<Url>([{
      code: 'MISSING_URL',
      message: 'URL manquante',
      field: 'url',
      severity: 'error',
      layer: 'DOMAIN'
    }]);
  }

  // Normalisation
  let normalizedUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    normalizedUrl = 'https://' + url;
  }

  // Détection d'avertissements
  if (normalizedUrl.startsWith('http://')) {
    return createSuccessWithWarnings(
      new Url(normalizedUrl),
      [{
        code: 'INSECURE_URL',
        message: 'URL non sécurisée (HTTP)',
        field: 'url',
        severity: 'warning',
        layer: 'DOMAIN',
        suggestion: 'Utilisez HTTPS pour une meilleure sécurité'
      }]
    );
  }

  return createSuccess(new Url(normalizedUrl));
}

// Utilisation avec gestion des avertissements
const urlResult = Url.create('example.com');

if (urlResult.isSuccess()) {
  const url = urlResult.getValue();
  console.log(`URL valide: ${url.getValue()}`);

  if (urlResult.hasWarnings()) {
    console.warn('Avertissements:', urlResult.getWarnings());
  }
} else {
  console.error('Erreurs:', urlResult.getErrors());
}
```

## Validation d'entités

### Validation avec dépendances de Value Objects

```typescript
import {
  ResultTypeInterface,
  createSuccess,
  createFailure,
  flatMap,
} from "@cv-generator/shared";

// Entité User avec validation
class User {
  private constructor(
    private readonly id: string,
    private readonly email: Email,
    private readonly name: string
  ) {}

  // Factory method avec ResultType
  public static create(
    id: string,
    emailStr: string,
    name: string
  ): ResultTypeInterface<User> {
    // Valider l'email d'abord
    const emailResult = Email.create(emailStr);

    // Si la validation de l'email échoue, retourner l'erreur
    if (emailResult.isFailure()) {
      return emailResult as ResultTypeInterface<User>; // Cast sécurisé car on retourne juste les erreurs
    }

    // Valider le nom
    if (!name || name.trim().length < 2) {
      return createFailure<User>([
        {
          code: "INVALID_NAME",
          message: "Le nom doit contenir au moins 2 caractères",
          field: "name",
          severity: "error",
          layer: "DOMAIN",
        },
      ]);
    }

    // Si tout est valide, créer l'utilisateur
    return createSuccess(new User(id, emailResult.getValue(), name));
  }

  // Alternative avec flatMap (plus élégant)
  public static createAlt(
    id: string,
    emailStr: string,
    name: string
  ): ResultTypeInterface<User> {
    return flatMap(Email.create(emailStr), (email) => {
      if (!name || name.trim().length < 2) {
        return createFailure<User>([
          {
            code: "INVALID_NAME",
            message: "Le nom doit contenir au moins 2 caractères",
            field: "name",
            severity: "error",
            layer: "DOMAIN",
          },
        ]);
      }

      return createSuccess(new User(id, email, name));
    });
  }
}
```

### Validation complexe avec agrégation d'erreurs

```typescript
import {
  ResultTypeInterface,
  ValidationErrorInterface,
  createSuccess,
  createFailure
} from '@cv-generator/shared';

// Factory method pour une entité Resume
public static create(data: Partial<ResumeInterface>): ResultTypeInterface<Resume> {
  const errors: ValidationErrorInterface[] = [];

  // Valider les basics (requis)
  if (!data.basics || !data.basics.name) {
    errors.push({
      code: 'MISSING_NAME',
      message: 'Le nom est requis',
      field: 'basics.name',
      severity: 'error',
      layer: 'DOMAIN'
    });
  }

  // Valider l'email
  if (data.basics?.email) {
    const emailResult = Email.create(data.basics.email);
    if (emailResult.isFailure()) {
      // Ajouter les erreurs d'email avec le chemin du champ ajusté
      emailResult.getErrors().forEach(error => {
        errors.push({
          ...error,
          field: `basics.${error.field}` // Préfixer avec le chemin parent
        });
      });
    }
  } else {
    errors.push({
      code: 'MISSING_EMAIL',
      message: 'L\'email est requis',
      field: 'basics.email',
      severity: 'error',
      layer: 'DOMAIN'
    });
  }

  // Valider les expériences professionnelles (work)
  if (data.work && Array.isArray(data.work)) {
    data.work.forEach((work, index) => {
      if (!work.name) {
        errors.push({
          code: 'MISSING_WORK_NAME',
          message: 'Le nom de l\'entreprise est requis',
          field: `work[${index}].name`,
          severity: 'error',
          layer: 'DOMAIN'
        });
      }
      // Autres validations...
    });
  }

  // Si des erreurs sont détectées, retourner un échec
  if (errors.length > 0) {
    return createFailure<Resume>(errors);
  }

  // Sinon, créer l'objet Resume
  return createSuccess(new Resume(data as Required<ResumeInterface>));
}
```

## Chaînage d'opérations

### Utilisation de flatMap pour enchaîner les validations

```typescript
import { ResultTypeInterface, flatMap } from "@cv-generator/shared";

// Service pour créer un profil utilisateur complet
function createUserProfile(
  userData: UserData,
  resumeData: ResumeData
): ResultTypeInterface<UserProfile> {
  // Étape 1: Créer l'utilisateur
  return flatMap(
    User.create(userData.id, userData.email, userData.name),
    (user) => {
      // Étape 2: Créer le CV
      return flatMap(Resume.create(resumeData), (resume) => {
        // Étape 3: Associer les deux
        return UserProfile.create(user, resume);
      });
    }
  );
}

// Utilisation
const result = createUserProfile(userData, resumeData);
if (result.isSuccess()) {
  const profile = result.getValue();
  // Traiter le profil...
} else {
  // Gérer les erreurs...
}
```

### Utilisation de map pour transformer des résultats

```typescript
import { ResultTypeInterface, map } from "@cv-generator/shared";

// Transformer un résultat Email en DisplayEmail
function getDisplayEmail(emailStr: string): ResultTypeInterface<string> {
  // Créer l'email
  const emailResult = Email.create(emailStr);

  // Transformer en format d'affichage
  return map(emailResult, (email) => {
    const value = email.getValue();
    const [username, domain] = value.split("@");

    // Masquer partiellement l'email pour la confidentialité
    return `${username.substring(0, 3)}***@${domain}`;
  });
}

// Utilisation
const displayEmailResult = getDisplayEmail("john.doe@example.com");
if (displayEmailResult.isSuccess()) {
  console.log(displayEmailResult.getValue()); // "joh***@example.com"
}
```

## Gestion de cas d'erreur

### Extraction des erreurs par champ

```typescript
import { ResultTypeInterface, getErrorsForField } from "@cv-generator/shared";

// Composant de formulaire
function FormField({ name, result, children }: FormFieldProps) {
  // Extraire uniquement les erreurs concernant ce champ
  const fieldErrors = getErrorsForField(result, name);

  return (
    <div className={`form-field ${fieldErrors.length > 0 ? "has-error" : ""}`}>
      {children}

      {fieldErrors.length > 0 && (
        <div className="error-messages">
          {fieldErrors.map((error, index) => (
            <p key={index} className="error-message">
              {error.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Gestion différenciée des erreurs et avertissements

```typescript
function handleValidationResult<T>(result: ResultTypeInterface<T>): void {
  if (result.isSuccess()) {
    const value = result.getValue();
    processData(value);

    // Vérifier s'il y a des avertissements à afficher
    if (result.hasWarnings()) {
      const warnings = result.getWarnings();
      displayWarnings(warnings); // Affiche les avertissements sans bloquer
    }
  } else {
    const errors = result.getErrors();

    // Trier les erreurs par sévérité
    const criticalErrors = errors.filter((e) => e.severity === "error");
    const minorErrors = errors.filter((e) => e.severity === "warning");

    // Gérer les erreurs critiques en priorité
    if (criticalErrors.length > 0) {
      showErrorModal(criticalErrors);
    } else {
      displayInlineErrors(minorErrors);
    }
  }
}
```

## Utilisation avec des bibliothèques de validation

### Intégration avec Zod

```typescript
import { z } from "zod";
import {
  ResultTypeInterface,
  ValidationErrorInterface,
  ValidationLayerType,
  createSuccess,
  createFailure,
} from "@cv-generator/shared";

// Schéma de validation Zod
const userSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  age: z.number().min(18, "Doit être majeur").optional(),
});

// Fonction pour convertir un résultat Zod en ResultType
function zodToResult<T>(
  validationResult: z.SafeParseReturnType<unknown, T>,
  layer: ValidationLayerType = ValidationLayerType.DOMAIN
): ResultTypeInterface<T> {
  if (validationResult.success) {
    return createSuccess(validationResult.data);
  }

  // Convertir les erreurs Zod en format standard
  const errors: ValidationErrorInterface[] = validationResult.error.errors.map(
    (err) => ({
      code: "VALIDATION_ERROR",
      message: err.message,
      field: err.path.join("."),
      severity: "error",
      layer,
      i18nKey: `validation.${err.code}`,
    })
  );

  return createFailure<T>(errors);
}

// Utilisation
function validateUserData(data: unknown): ResultTypeInterface<User> {
  // Validation avec Zod
  const validationResult = userSchema.safeParse(data);

  // Conversion en ResultType
  const result = zodToResult<z.infer<typeof userSchema>>(validationResult);

  // Si la validation échoue, retourner les erreurs
  if (result.isFailure()) {
    return result as ResultTypeInterface<User>;
  }

  // Sinon, créer l'utilisateur
  const validData = result.getValue();
  return User.create(generateId(), validData.email, validData.name);
}
```

## Traitement conditionnel

### Combinaison de plusieurs résultats

```typescript
import {
  ResultTypeInterface,
  combineValidationResults,
} from "@cv-generator/shared";

// Valider un formulaire complet
function validateForm(formData: FormData): ResultTypeInterface<ValidFormData> {
  // Valider chaque champ indépendamment
  const nameResult = validateName(formData.name);
  const emailResult = Email.create(formData.email);
  const passwordResult = validatePassword(formData.password);
  const birthDateResult = validateBirthDate(formData.birthDate);

  // Combiner tous les résultats
  return combineValidationResults({
    name: nameResult,
    email: emailResult,
    password: passwordResult,
    birthDate: birthDateResult,
  });
}

// Utilisation
const validationResult = validateForm(formData);
if (validationResult.isSuccess()) {
  const validData = validationResult.getValue();
  submitForm(validData);
} else {
  displayErrors(validationResult.getErrors());
}
```

## Utilisation dans les composants UI

### Hook React pour gérer les résultats de validation

```typescript
import { useState } from "react";
import {
  ResultTypeInterface,
  ValidationErrorInterface,
} from "@cv-generator/shared";

// Hook personnalisé pour gérer un résultat de validation
function useValidationResult<T>(initialValue?: T) {
  const [value, setValue] = useState<T | undefined>(initialValue);
  const [errors, setErrors] = useState<ValidationErrorInterface[]>([]);
  const [warnings, setWarnings] = useState<ValidationErrorInterface[]>([]);
  const [isValid, setIsValid] = useState(true);

  // Fonction pour mettre à jour l'état à partir d'un ResultType
  const setResult = (result: ResultTypeInterface<T>) => {
    if (result.isSuccess()) {
      setValue(result.getValue());
      setErrors([]);
      setIsValid(true);

      if (result.hasWarnings()) {
        setWarnings(result.getWarnings());
      } else {
        setWarnings([]);
      }
    } else {
      setErrors(result.getErrors());
      setIsValid(false);
      setWarnings([]);
    }
  };

  // Helper pour obtenir les erreurs d'un champ spécifique
  const getFieldErrors = (fieldName: string) => {
    return errors.filter((error) => error.field === fieldName);
  };

  return {
    value,
    errors,
    warnings,
    isValid,
    setResult,
    getFieldErrors,
  };
}

// Utilisation dans un composant
function RegistrationForm() {
  const {
    value: formData,
    errors,
    warnings,
    isValid,
    setResult,
    getFieldErrors,
  } = useValidationResult<UserFormData>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    // Valider les données
    const result = validateUserData(data);
    setResult(result);

    // Si valide, soumettre le formulaire
    if (result.isSuccess()) {
      await registerUser(result.getValue());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Email</label>
        <input type="email" name="email" />
        {getFieldErrors("email").map((error, i) => (
          <p key={i} className="error">
            {error.message}
          </p>
        ))}
      </div>

      {/* Autres champs... */}

      {warnings.length > 0 && (
        <div className="warnings">
          {warnings.map((warning, i) => (
            <p key={i} className="warning">
              {warning.message}
            </p>
          ))}
        </div>
      )}

      <button type="submit" disabled={!isValid}>
        S'inscrire
      </button>
    </form>
  );
}
```

## Intégration avec les APIs

### Service API avec ResultType

```typescript
import {
  ResultTypeInterface,
  createSuccess,
  createFailure,
} from "@cv-generator/shared";

// Service API
class UserApiService {
  // Méthode pour récupérer un utilisateur
  async getUser(id: string): Promise<ResultTypeInterface<User>> {
    try {
      const response = await fetch(`/api/users/${id}`);

      if (!response.ok) {
        // Gérer les différentes erreurs HTTP
        if (response.status === 404) {
          return createFailure([
            {
              code: "USER_NOT_FOUND",
              message: `Utilisateur #${id} non trouvé`,
              field: "id",
              severity: "error",
              layer: "INFRASTRUCTURE",
            },
          ]);
        }

        return createFailure([
          {
            code: "API_ERROR",
            message: `Erreur API: ${response.statusText}`,
            severity: "error",
            layer: "INFRASTRUCTURE",
          },
        ]);
      }

      const userData = await response.json();

      // Valider les données reçues
      return User.create(userData.id, userData.email, userData.name);
    } catch (error) {
      // Gérer les erreurs réseau ou de parsing
      return createFailure([
        {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Erreur réseau",
          severity: "error",
          layer: "INFRASTRUCTURE",
        },
      ]);
    }
  }

  // Méthode pour créer un utilisateur
  async createUser(
    userData: UserCreateDto
  ): Promise<ResultTypeInterface<User>> {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Gestion des erreurs de validation côté serveur
        if (response.status === 400) {
          const errorData = await response.json();

          return createFailure(
            errorData.errors.map((err: any) => ({
              code: err.code || "VALIDATION_ERROR",
              message: err.message,
              field: err.field,
              severity: "error",
              layer: "INFRASTRUCTURE",
            }))
          );
        }

        // Autres erreurs HTTP
        return createFailure([
          {
            code: "API_ERROR",
            message: `Erreur API: ${response.statusText}`,
            severity: "error",
            layer: "INFRASTRUCTURE",
          },
        ]);
      }

      const createdUser = await response.json();

      // Créer une entité User à partir des données reçues
      return createSuccess(
        new User(createdUser.id, createdUser.email, createdUser.name)
      );
    } catch (error) {
      // Gérer les erreurs réseau ou de parsing
      return createFailure([
        {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Erreur réseau",
          severity: "error",
          layer: "INFRASTRUCTURE",
        },
      ]);
    }
  }
}
```

### Conversion de ResultType en réponse HTTP

```typescript
import { ResultTypeInterface } from "@cv-generator/shared";
import { Request, Response } from "express";

// Middleware pour convertir un ResultType en réponse HTTP
function resultToResponse<T>(
  result: ResultTypeInterface<T>,
  res: Response
): void {
  if (result.isSuccess()) {
    const data = result.getValue();

    // Ajouter les avertissements si présents
    const response: any = { data };
    if (result.hasWarnings()) {
      response.warnings = result.getWarnings();
    }

    res.status(200).json(response);
  } else {
    const errors = result.getErrors();

    // Déterminer le code HTTP approprié
    let statusCode = 400; // Bad Request par défaut

    // Vérifier s'il s'agit d'une erreur "non trouvé"
    const isNotFound = errors.some(
      (err) =>
        err.code === "NOT_FOUND" ||
        err.code === "USER_NOT_FOUND" ||
        err.message.toLowerCase().includes("not found")
    );

    if (isNotFound) {
      statusCode = 404;
    }

    // Vérifier s'il s'agit d'une erreur serveur
    const isServerError = errors.some(
      (err) => err.layer === "INFRASTRUCTURE" || err.code === "SERVER_ERROR"
    );

    if (isServerError) {
      statusCode = 500;
    }

    res.status(statusCode).json({ errors });
  }
}

// Utilisation dans un contrôleur Express
async function getUserController(req: Request, res: Response) {
  const userId = req.params.id;
  const userService = new UserService();

  const result = await userService.getUser(userId);
  resultToResponse(result, res);
}
```

## Tests unitaires

### Tests de succès et d'échec

```typescript
import { isSuccess, isFailure } from "@cv-generator/shared";

describe("Email Value Object", () => {
  it("should create a valid email", () => {
    // Arrange
    const validEmail = "test@example.com";

    // Act
    const result = Email.create(validEmail);

    // Assert
    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.getValue().getValue()).toBe(validEmail);
    }
  });

  it("should fail for invalid email format", () => {
    // Arrange
    const invalidEmail = "invalid-email";

    // Act
    const result = Email.create(invalidEmail);

    // Assert
    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      const errors = result.getErrors();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].code).toBe("INVALID_EMAIL_FORMAT");
      expect(errors[0].field).toBe("email");
    }
  });

  it("should detect and return warnings for personal email domains", () => {
    // Arrange
    const personalEmail = "user@gmail.com";

    // Act
    const result = Email.create(personalEmail);

    // Assert
    expect(isSuccess(result)).toBe(true);
    expect(result.hasWarnings()).toBe(true);

    const warnings = result.getWarnings();
    expect(warnings.length).toBe(1);
    expect(warnings[0].code).toBe("PERSONAL_EMAIL");
    expect(warnings[0].severity).toBe("warning");
  });
});
```

### Tests des fonctions utilitaires

```typescript
describe("ResultType utilities", () => {
  it("should map a success result", () => {
    // Arrange
    const emailResult = Email.create("test@example.com");

    // Act
    const lengthResult = map(emailResult, (email) => email.getValue().length);

    // Assert
    expect(isSuccess(lengthResult)).toBe(true);
    if (isSuccess(lengthResult)) {
      expect(lengthResult.getValue()).toBe(15); // Longueur de 'test@example.com'
    }
  });

  it("should propagate errors when mapping a failure result", () => {
    // Arrange
    const emailResult = Email.create("invalid");

    // Act
    const lengthResult = map(emailResult, (email) => email.getValue().length);

    // Assert
    expect(isFailure(lengthResult)).toBe(true);
    if (isFailure(lengthResult)) {
      expect(lengthResult.getErrors()).toEqual(emailResult.getErrors());
    }
  });

  it("should chain validations with flatMap", () => {
    // Arrange
    const validEmail = "test@example.com";

    // Act - Créer un utilisateur à partir d'un email
    const result = flatMap(Email.create(validEmail), (email) =>
      User.create("user-1", email.getValue(), "Test User")
    );

    // Assert
    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      const user = result.getValue();
      expect(user.getEmail()).toBe(validEmail);
      expect(user.getName()).toBe("Test User");
    }
  });

  it("should combine multiple validation results", () => {
    // Arrange
    const emailResult = Email.create("test@example.com");
    const nameResult = createSuccess("Test User");
    const passwordResult = createFailure([
      {
        code: "WEAK_PASSWORD",
        message: "Le mot de passe est trop faible",
        field: "password",
        severity: "error",
        layer: "DOMAIN",
      },
    ]);

    // Act
    const combinedResult = combineValidationResults({
      email: emailResult,
      name: nameResult,
      password: passwordResult,
    });

    // Assert
    expect(isFailure(combinedResult)).toBe(true);
    if (isFailure(combinedResult)) {
      const errors = combinedResult.getErrors();
      expect(errors.length).toBe(1);
      expect(errors[0].field).toBe("password");
    }
  });
});
```

## Conclusion

L'utilisation standardisée du pattern ResultType offre une approche cohérente et typée pour la gestion des résultats d'opération à travers toute l'application. Les exemples ci-dessus montrent comment l'utiliser de manière efficace dans différents contextes, de la validation de données à l'intégration API en passant par les interfaces utilisateur.

En suivant ces patterns, vous obtiendrez un code plus maintenable, plus prévisible et moins sujet aux erreurs, tout en améliorant l'expérience de développement grâce au support de TypeScript.
