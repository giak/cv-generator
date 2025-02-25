import { User } from "../../domain/entities/User";
import { UserRepository } from "../../ports/repositories/UserRepository";

/**
 * DTO for updating user preferences
 */
export interface UpdatePreferenceDTO {
  userId: string;
  key: string;
  value: unknown;
}

/**
 * Use case for managing user preferences
 */
export class ManageUserPreferences {
  constructor(private readonly userRepository: UserRepository) {}
  
  /**
   * Get a user preference
   * 
   * @param userId The ID of the user
   * @param key The preference key
   * @param defaultValue The default value if the preference is not set
   * @returns The preference value
   */
  async getPreference<T>(userId: string, key: string, defaultValue: T): Promise<T> {
    const user = await this.findUserOrThrow(userId);
    return user.getPreference(key, defaultValue);
  }
  
  /**
   * Update a user preference
   * 
   * @param dto The update preference DTO
   */
  async updatePreference(dto: UpdatePreferenceDTO): Promise<void> {
    const user = await this.findUserOrThrow(dto.userId);
    user.setPreference(dto.key, dto.value);
    await this.userRepository.save(user);
  }
  
  /**
   * Get all preferences for a user
   * 
   * @param userId The ID of the user
   * @returns The user's preferences
   */
  async getAllPreferences(userId: string): Promise<Record<string, unknown>> {
    const user = await this.findUserOrThrow(userId);
    return user.getPreferences();
  }
  
  /**
   * Find a user or throw an error if not found
   * 
   * @param userId The ID of the user to find
   * @returns The user
   * @throws Error if the user is not found
   */
  private async findUserOrThrow(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    return user;
  }
} 