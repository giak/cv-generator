import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface'
import { Result } from '../../../modules/cv/domain/shared/Result'
import { WorkDate } from '../value-objects/work-date.value-object'

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
    private readonly _highlights: string[]
  ) {}

  /**
   * Méthode factory pour créer une instance validée de Work
   * @param data Les données brutes de l'expérience professionnelle
   * @returns Un objet contenant le résultat de la validation et éventuellement l'instance de Work
   */
  static create(data: Partial<WorkInterface>): WorkValidationResultType {

    const errors: string[] = []
    
    // 1. Validation des champs requis
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Le nom de l\'entreprise est requis')
    }
    
    if (!data.position || data.position.trim().length === 0) {
      errors.push('Le poste est requis')
    }
    
    // 2. Validation de l'URL si fournie
    if (data.url && !this.isValidUrl(data.url)) {
      errors.push('L\'URL fournie n\'est pas valide')
    }
    
    // 3. Validation de la date de début (requise)
    let startDate: WorkDate | undefined
    if (!data.startDate) {
      errors.push('La date de début est requise')
    } else {
      const startDateResult = WorkDate.create(data.startDate)
      if (startDateResult.isFailure) {
        errors.push(`Date de début invalide: ${startDateResult.error}`)
      } else {
        startDate = startDateResult.getValue()
      }
    }
    
    // 4. Validation de la date de fin si fournie
    let endDate: WorkDate | undefined
    if (data.endDate) {
      const endDateResult = WorkDate.create(data.endDate)
      if (endDateResult.isFailure) {
        errors.push(`Date de fin invalide: ${endDateResult.error}`)
      } else {
        endDate = endDateResult.getValue()
      }
      
      // 5. Vérification de la cohérence des dates (fin > début)
      if (startDate && endDate && endDate.isBefore(startDate)) {
        errors.push('La date de fin doit être postérieure à la date de début')
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
      data.highlights || []
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
    return Work.create(updatedData)
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
