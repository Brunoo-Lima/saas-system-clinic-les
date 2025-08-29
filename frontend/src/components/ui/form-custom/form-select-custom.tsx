import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Control, FieldValues, Path } from "react-hook-form";

interface IFormSelectProps<T extends FieldValues> {
  name: Path<T>; // chave válida do formulário
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  control: Control<T>;
}

const FormSelectCustom = <T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  control,
}: IFormSelectProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={placeholder ?? "Selecione"} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormSelectCustom;
