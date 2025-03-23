import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface';
import { WorkDate } from '../value-objects/work-date.value-object';
import { TRANSLATION_KEYS } from '@cv-generator/shared';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

/**
 * Clés de traduction spécifiques pour l'entité Work
 */
export const WORK_VALIDATION_KEYS = {
  MISSING_COMPANY: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.MISSING_COMPANY,
  MISSING_POSITION: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.MISSING_POSITION,
  INVALID_URL: TRANSLATION_KEYS.RESUME.VOLUNTEER.VALIDATION.INVALID_URL,
  MISSING_START_DATE: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.MISSING_START_DATE,
  INVALID_START_DATE: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.INVALID_START_DATE,
  INVALID_END_DATE: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.INVALID_END_DATE,
  END_BEFORE_START: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.END_BEFORE_START
};

/**
 * Adaptateur i18n par défaut pour la compatibilité
 */
export class DefaultWorkI18nAdapter implements DomainI18nPortInterface {
  translate(key: string, _params?: Record<string, unknown>): string {
    const defaultMessages: Record<string, string> = {
      [WORK_VALIDATION_KEYS.MISSING_COMPANY]: "Le nom de l'entreprise est requis",
      [WORK_VALIDATION_KEYS.MISSING_POSITION]: "Le poste est requis",
      [WORK_VALIDATION_KEYS.INVALID_URL]: "L'URL fournie n'est pas valide",
      [WORK_VALIDATION_KEYS.MISSING_START_DATE]: "La date de début est requise",
      [WORK_VALIDATION_KEYS.INVALID_START_DATE]: "Date de début invalide",
      [WORK_VALIDATION_KEYS.INVALID_END_DATE]: "Date de fin invalide",
      [WORK_VALIDATION_KEYS.END_BEFORE_START]: "La date de fin doit être postérieure à la date de début"
    };

    return defaultMessages[key] || key;
  }

  exists(_key: string): boolean {
    return true;
  }
}

// Création d'une instance de l'adaptateur par défaut
const defaultI18nAdapter = new DefaultWorkI18nAdapter();

/**
 * Type pour les données de validation de l'entité Work
 */
export type WorkValidationResultType = {
  isValid: boolean
  errors: string[]
  work?: Work
}

/**
 * Entité Work représentant une expérience professionnelle dans un CV
 * Implémente les principes DDD avec une conception riche et immuable
 */
export class Work {
  /**
   * Constructeur privé pour forcer l'utilisation de la méthode factory create()
   */
  private constructor(
    private readonly _name: string,
    private readonly _position: string,
    private readonly _url: string | undefined,
    private readonly _startDate: WorkDate,
    private readonly _endDate: WorkDate | undefined,
    private readonly _summary: string | undefined,
    private readonly _highlights: string[],
    private readonly _i18n: DomainI18nPortInterface
  ) {}

  /**
   * Méthode factory pour créer une instance validée de Work
   * @param data Les données brutes de l'expérience professionnelle
   * @param i18n Interface pour l'internationalisation des messages
   * @returns Un objet contenant le résultat de la validation et éventuellement l'instance de Work
   */
  static create(
    data: Partial<WorkInterface>,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): WorkValidationResultType {

    const errors: string[] = []
    
    // 1. Validation des champs requis
    if (!data.name || data.name.trim().length === 0) {
      errors.push(i18n.translate(WORK_VALIDATION_KEYS.MISSING_COMPANY))
    }
    
    if (!data.position || data.position.trim().length === 0) {
      errors.push(i18n.translate(WORK_VALIDATION_KEYS.MISSING_POSITION))
    }
    
    // 2. Validation de l'URL si fournie
    if (data.url && !this.isValidUrl(data.url)) {
      errors.push(i18n.translate(WORK_VALIDATION_KEYS.INVALID_URL))
    }
    
    // 3. Validation de la date de début (requise)
    let startDate: WorkDate | undefined
    if (!data.startDate) {
      errors.push(i18n.translate(WORK_VALIDATION_KEYS.MISSING_START_DATE))
    } else {
      const startDateResult = WorkDate.create(data.startDate)
      if (startDateResult.isFailure) {
        const errorMessage = i18n.translate(WORK_VALIDATION_KEYS.INVALID_START_DATE)
        errors.push(startDateResult.error ? `${errorMessage}: ${startDateResult.error}` : errorMessage)
      } else if (startDateResult.getValue) {
        startDate = startDateResult.getValue()
      }
    }
    
    // 4. Validation de la date de fin si fournie
    let endDate: WorkDate | undefined
    if (data.endDate) {
      const endDateResult = WorkDate.create(data.endDate)
      if (endDateResult.isFailure) {
        const errorMessage = i18n.translate(WORK_VALIDATION_KEYS.INVALID_END_DATE)
        errors.push(endDateResult.error ? `${errorMessage}: ${endDateResult.error}` : errorMessage)
      } else if (endDateResult.getValue) {
        endDate = endDateResult.getValue()
      }
      
      // 5. Vérification de la cohérence des dates (fin > début)
      if (startDate && endDate && endDate.isBefore(startDate)) {
        errors.push(i18n.translate(WORK_VALIDATION_KEYS.END_BEFORE_START))
      }
    }
    
    // Si des erreurs sont présentes, retourne le résultat d'échec
    if (errors.length > 0) {
      return { isValid: false, errors }
    }
    
    // Création de l'instance avec les données validées
    const work = new Work(
      data.name!,
      data.position!,
      data.url,
      startDate!,
      endDate,
      data.summary,
      data.highlights || [],
      i18n
    )
    
    return {
      isValid: true,
      errors: [],
      work
    }
  }
  
  /**
   * Vérifie si une URL est valide
   * @param url L'URL à valider
   * @returns true si l'URL est valide, false sinon
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }
  
  /**
   * Crée une nouvelle instance avec les propriétés modifiées
   * Pattern immuable pour les modifications
   * @param props Les propriétés à modifier
   * @returns Résultat de la validation avec la nouvelle instance ou des erreurs
   */
  update(props: Partial<WorkInterface>): WorkValidationResultType {
    // Fusion des données actuelles avec les nouvelles propriétés
    const updatedData: Partial<WorkInterface> = {
      name: props.name !== undefined ? props.name : this.name,
      position: props.position !== undefined ? props.position : this.position,
      url: props.url !== undefined ? props.url : this.url,
      startDate: props.startDate !== undefined ? props.startDate : this.startDate.getValue(),
      endDate: props.endDate !== undefined ? props.endDate : this.endDate?.getValue(),
      summary: props.summary !== undefined ? props.summary : this.summary,
      highlights: props.highlights !== undefined ? props.highlights : this.highlights
    }
    
    // Utilisation de la méthode factory pour valider les nouvelles données
    return Work.create(updatedData, this._i18n)
  }
  
  /**
   * Accesseurs pour les propriétés (lecture seule)
   */
  get name(): string {
    return this._name
  }
  
  get position(): string {
    return this._position
  }
  
  get url(): string | undefined {
    return this._url
  }
  
  get startDate(): WorkDate {
    return this._startDate
  }
  
  get endDate(): WorkDate | undefined {
    return this._endDate
  }
  
  get summary(): string | undefined {
    return this._summary
  }
  
  get highlights(): string[] {
    return [...this._highlights] // Copie défensive
  }
  
  /**
   * Convertit l'entité en objet simple conforme à WorkInterface
   * @returns L'objet représentant l'expérience professionnelle
   */
  toJSON(): WorkInterface {

    const json: WorkInterface = {
      name: this.name,
      position: this.position,
      startDate: this.startDate.getValue(),
      ...(this.url && { url: this.url }),
      ...(this.endDate && { endDate: this.endDate.getValue() }),
      ...(this.summary && { summary: this.summary }),
      ...(this.highlights.length > 0 && { highlights: this.highlights })
    }

    return json
  }
}
