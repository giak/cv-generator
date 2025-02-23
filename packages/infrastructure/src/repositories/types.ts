export interface StorageRepositoryInterface {
  save(key: string, data: unknown): Promise<void>
  load<T>(key: string): Promise<T | null>
} 