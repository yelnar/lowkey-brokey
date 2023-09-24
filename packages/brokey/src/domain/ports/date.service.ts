import { CanonicalDate } from '../../core/brokey/models/canonical-date'

export interface DateService {
  get currentDate(): CanonicalDate

  format(date: Date): CanonicalDate

  duration(from: CanonicalDate, to: CanonicalDate): number
}
