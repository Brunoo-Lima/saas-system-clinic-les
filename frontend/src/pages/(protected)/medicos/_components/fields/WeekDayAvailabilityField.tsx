import type { DayAvailability } from "@/@types/IDoctor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormItem, FormLabel } from "@/components/ui/form";
import { useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";

interface WeekDay {
  label: string;
  value: string;
}

interface Interval {
  from: string;
  to: string;
}

interface IWeekDayAvailabilityFieldProps {
  field: ControllerRenderProps<any, "availableWeekDay">;
  weekDays: WeekDay[];
  timeOptions: string[];
}

export const WeekDayAvailabilityField = ({
  field,
  weekDays,
  timeOptions,
}: IWeekDayAvailabilityFieldProps) => {
  const [showIntervals, setShowIntervals] = useState<boolean>(false);
  const updateIntervals = (
    day: string,
    updater: (intervals: Interval[]) => Interval[]
  ) => {
    const newDays = field.value.map((d: DayAvailability) =>
      d.day === day ? { ...d, intervals: updater(d.intervals) } : d
    );
    field.onChange(newDays);
  };

  return (
    <FormItem>
      <FormLabel>Disponibilidade por dia</FormLabel>

      <Button
        type="button"
        className="w-max"
        onClick={() => setShowIntervals(!showIntervals)}
      >
        Selecionar dias
      </Button>

      {showIntervals && (
        <div className="flex flex-col gap-y-3">
          {weekDays.map((day) => {
            const currentDay = field.value.find(
              (d: DayAvailability) => d.day === day.value
            );

            return (
              <div key={day.value} className="border rounded p-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={!!currentDay}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([
                          ...field.value,
                          { day: day.value, intervals: [] },
                        ]);
                      } else {
                        field.onChange(
                          field.value.filter(
                            (d: DayAvailability) => d.day !== day.value
                          )
                        );
                      }
                    }}
                  />
                  <span className="font-semibold">{day.label}</span>
                </div>

                {currentDay && (
                  <div className="mt-2 space-y-2">
                    {currentDay.intervals.map(
                      (interval: Interval, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          {/* Select From */}
                          <select
                            className="border p-1"
                            value={interval.from}
                            onChange={(e) =>
                              updateIntervals(day.value, (intervals) =>
                                intervals.map((i, iIdx) =>
                                  iIdx === index
                                    ? { ...i, from: e.target.value }
                                    : i
                                )
                              )
                            }
                          >
                            {timeOptions.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>

                          <span>às</span>

                          {/* Select To */}
                          <select
                            className="border p-1"
                            value={interval.to}
                            onChange={(e) =>
                              updateIntervals(day.value, (intervals) =>
                                intervals.map((i, iIdx) =>
                                  iIdx === index
                                    ? { ...i, to: e.target.value }
                                    : i
                                )
                              )
                            }
                          >
                            {timeOptions.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>

                          {/* Remove interval */}
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() =>
                              updateIntervals(day.value, (intervals) =>
                                intervals.filter((_, iIdx) => iIdx !== index)
                              )
                            }
                          >
                            ❌
                          </button>
                        </div>
                      )
                    )}

                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        updateIntervals(day.value, (intervals) => [
                          ...intervals,
                          { from: "09:00", to: "10:00" },
                        ])
                      }
                    >
                      + Adicionar intervalo
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </FormItem>
  );
};
