export interface Location {
  address?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  region?: string;
}

export interface Profile {
  network: string;
  username: string;
  url: string;
}

export interface Basics {
  name: string;
  label?: string;
  image?: string;
  email: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: Location;
  profiles?: Profile[];
}

export interface WorkExperience {
  name: string;
  position: string;
  url?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  summary?: string;
  highlights?: string[];
}

export interface Education {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface Skill {
  name: string;
  level?: string;
  keywords?: string[];
}

export interface Resume {
  basics: Basics;
  work?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
}

// Types utilitaires
export type ResumeSection = keyof Resume;
export type ValidationResult = { isValid: boolean; errors?: string[] };

export interface ResumeType {
  basics: {
    name: string;
    email: string;
    phone?: string;
    location?: {
      address?: string;
      city?: string;
      countryCode?: string;
    };
    summary?: string;
  };
  work: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    summary?: string;
  }>;
  education: Array<{
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate?: string;
  }>;
  skills: Array<{
    name: string;
    level?: string;
    keywords?: string[];
  }>;
}
