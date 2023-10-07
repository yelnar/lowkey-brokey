import { Storage } from './storage'

export class LocalStorage implements Storage {
  get<T>(key: string): T | null {
    const value = globalThis.localStorage.getItem(key)
    if (value === null) return null

    try {
      return JSON.parse(value) as T
    } catch (error) {
      console.error('Failed to parse value from storage', error)
    }

    return null
  }

  set(key: string, value: unknown): void {
    globalThis.localStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    )
  }
}
