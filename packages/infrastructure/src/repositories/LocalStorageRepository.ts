import type { StorageRepositoryInterface } from './types'

export class LocalStorageRepository implements StorageRepositoryInterface {
  async save(key: string, data: unknown): Promise<void> {
    localStorage.setItem(key, JSON.stringify(data))
  }

  async load<T>(key: string): Promise<T | null> {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
} 