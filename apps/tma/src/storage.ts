export interface Storage {
  get<T>(key: string): T | null
  set(key: string, value: unknown): void
}
