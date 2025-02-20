import { Result } from '../shared/Result'
import { basicsSchema, type BasicsType, type LocationType, type ProfileType } from '../validators/basicsSchema'

export class Basics {
  private constructor(
    private readonly _name: string,
    private readonly _email: string,
    private readonly _label?: string,
    private readonly _image?: string,
    private readonly _phone?: string,
    private readonly _url?: string,
    private readonly _summary?: string,
    private readonly _location?: LocationType,
    private readonly _profiles: ProfileType[] = []
  ) {}

  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get label(): string | undefined {
    return this._label
  }

  get image(): string | undefined {
    return this._image
  }

  get phone(): string | undefined {
    return this._phone
  }

  get url(): string | undefined {
    return this._url
  }

  get summary(): string | undefined {
    return this._summary
  }

  get location(): LocationType | undefined {
    return this._location
  }

  get profiles(): ProfileType[] {
    return [...this._profiles]
  }

  static create(data: Partial<BasicsType>): Result<Basics> {
    const validation = basicsSchema.safeParse(data)

    if (!validation.success) {
      return Result.fail(validation.error.message)
    }

    return Result.ok(
      new Basics(
        validation.data.name,
        validation.data.email,
        validation.data.label,
        validation.data.image,
        validation.data.phone,
        validation.data.url,
        validation.data.summary,
        validation.data.location,
        validation.data.profiles ?? []
      )
    )
  }

  update(data: Partial<BasicsType>): Result<Basics> {
    const updateData = {
      name: data.name ?? this._name,
      email: data.email ?? this._email,
      label: data.label ?? this._label,
      image: data.image ?? this._image,
      phone: data.phone ?? this._phone,
      url: data.url ?? this._url,
      summary: data.summary ?? this._summary,
      location: data.location ?? this._location,
      profiles: data.profiles ?? this._profiles
    }

    return Basics.create(updateData)
  }

  toJSON(): BasicsType {
    const json: BasicsType = {
      name: this._name,
      email: this._email,
      profiles: this._profiles
    }

    if (this._label) json.label = this._label
    if (this._image) json.image = this._image
    if (this._phone) json.phone = this._phone
    if (this._url) json.url = this._url
    if (this._summary) json.summary = this._summary
    if (this._location) json.location = this._location

    return json
  }
} 