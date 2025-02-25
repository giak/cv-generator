// Domain
export { User } from './domain/entities/User';

// Application
export { ManageUserPreferences } from './application/use-cases/ManageUserPreferences';
export type { UpdatePreferenceDTO } from './application/use-cases/ManageUserPreferences';

// Ports
export type { UserRepository } from './ports/repositories/UserRepository'; 