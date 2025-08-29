import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { IDoctor } from "@/@types/IDoctor";

dayjs.extend(utc);
dayjs.locale("pt-br");

export const getAvailability = (doctor: IDoctor) => {
  const intervals = doctor.availableWeekDay.flatMap((dayAvailability) =>
    dayAvailability.intervals.map((interval) => {
      const [fromHour, fromMinute] = interval.from.split(":").map(Number);
      const [toHour, toMinute] = interval.to.split(":").map(Number);

      const from = dayjs()
        .utc()
        .day(Number(dayAvailability.day))
        .set("hour", fromHour)
        .set("minute", fromMinute)
        .set("second", 0)
        .local();

      const to = dayjs()
        .utc()
        .day(Number(dayAvailability.day))
        .set("hour", toHour)
        .set("minute", toMinute)
        .set("second", 0)
        .local();

      return { from, to };
    })
  );

  return intervals;
};
