import dayjs from "dayjs";
import {
  CanonicalDate,
  CanonicalDateFormat,
} from "../../core/brokey/models/canonical-date";
import { DateService } from "../../domain/ports/date.service";

export class DayjsDateService implements DateService {
  get currentDate(): CanonicalDate {
    return dayjs().format("YYYY-MM-DD");
  }

  format(date: Date): string {
    return dayjs(date).format("YYYY-MM-DD");
  }

  duration(startDate: CanonicalDate, endDate: CanonicalDate): number {
    if (dayjs(startDate, CanonicalDateFormat).isAfter(endDate, "day")) {
      return 0;
    }

    return (
      1 +
      dayjs(endDate, CanonicalDateFormat)
        .endOf("day")
        .diff(dayjs(startDate, CanonicalDateFormat).startOf("day"), "day")
    );
  }
}
