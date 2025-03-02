export interface LocationInterface {
  address?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  region?: string;
}

export interface ProfileInterface {
  network: string;
  username: string;
  url: string;
}

export interface BasicsInterface {
  name: string;
  label?: string;
  image?: string;
  email: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: LocationInterface;
  profiles?: ProfileInterface[];
}

export interface WorkInterface {
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface VolunteerInterface {
  organization: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface EducationInterface {
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface AwardInterface {
  title: string;
  date: string;
  awarder: string;
  summary?: string;
}

export interface CertificateInterface {
  name: string;
  date: string;
  issuer: string;
  url?: string;
}

export interface PublicationInterface {
  name: string;
  publisher: string;
  releaseDate: string;
  url?: string;
  summary?: string;
}

export interface SkillInterface {
  name: string;
  level?: string;
  keywords?: string[];
}

export interface LanguageInterface {
  language: string;
  fluency: string;
}

export interface InterestInterface {
  name: string;
  keywords?: string[];
}

export interface ReferenceInterface {
  name: string;
  reference: string;
}

export interface ProjectInterface {
  name: string;
  description?: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  roles?: string[];
  entity?: string;
  type?: string;
}

/**
 * Interface representing a Resume according to the JSON Resume schema standard
 * @see https://jsonresume.org/schema/
 */
export interface ResumeInterface {
  basics: BasicsInterface;
  work?: WorkInterface[];
  volunteer?: VolunteerInterface[];
  education?: EducationInterface[];
  awards?: AwardInterface[];
  certificates?: CertificateInterface[];
  publications?: PublicationInterface[];
  skills?: SkillInterface[];
  languages?: LanguageInterface[];
  interests?: InterestInterface[];
  references?: ReferenceInterface[];
  projects?: ProjectInterface[];
} 