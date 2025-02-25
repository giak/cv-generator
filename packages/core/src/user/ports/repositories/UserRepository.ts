import { User } from "../../domain/entities/User";

/**
 * Repository interface for User persistence operations
 */
export interface UserRepository {
  /**
   * Find a user by ID
   */
  findById(id: string): Promise<User | null>;
  
  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;
  
  /**
   * Save a user
   */
  save(user: User): Promise<void>;
  
  /**
   * Delete a user
   */
  delete(userId: string): Promise<void>;
} 