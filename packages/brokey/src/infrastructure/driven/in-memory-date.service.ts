import { CanonicalDate } from '../../core/brokey/models/canonical-date'
import { DateService } from '../../domain/ports/date.service'

type Config = {
  currentDate: CanonicalDate
  length: number
  formattedDate: CanonicalDate
}

export class InMemoryDateService implements DateService {
  constructor(public readonly config: Partial<Config> = {}) {
    this.config = {
      currentDate: '2000-01-01',
      length: 1,
      formattedDate: '2000-01-01',
      ...config,
    }
  }

  get currentDate(): CanonicalDate {
    return this.config.currentDate!
  }

  format(_date: Date): string {
    return this.config.formattedDate!
  }

  duration(_from: CanonicalDate, _to: CanonicalDate): number {
    return this.config.length!
  }
}
