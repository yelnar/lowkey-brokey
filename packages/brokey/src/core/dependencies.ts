import { DateService } from '../domain/ports/date.service'
import { DayjsDateService } from '../infrastructure/driven/dayjs-date.service'
import { InMemoryDateService } from '../infrastructure/driven/in-memory-date.service'

export type AppDependencies = {
  dateService: DateService
}

const testDependencies: AppDependencies = {
  dateService: new InMemoryDateService(),
}

const realDependencies: AppDependencies = {
  dateService: new DayjsDateService(),
}

export const dependencies =
  // @ts-ignore
  process.env.NODE_ENV === 'test' ? testDependencies : realDependencies
