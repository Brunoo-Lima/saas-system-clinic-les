"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface IDatePickerCustomProps {
  selected: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export const DatePickerCustom = ({
  selected,
  onChange,
}: IDatePickerCustomProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${
            !selected ? "text-muted-foreground" : ""
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "dd/MM/yyyy") : "Selecionar data"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2 ml-right">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date);
          }}
          captionLayout="dropdown"
          fromYear={1925}
          toYear={2050}
          showOutsideDays
          animate
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
};
