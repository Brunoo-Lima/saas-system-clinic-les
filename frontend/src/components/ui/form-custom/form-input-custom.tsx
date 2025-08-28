import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "../input";

interface IFormInputProps<T extends FieldValues> {
  name: Path<T>; // só aceita chaves válidas do formulário
  label: string;
  placeholder?: string;
  type?: string;
  control: Control<T>;
}

const FormInputCustom = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  control,
}: IFormInputProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input placeholder={placeholder} type={type} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormInputCustom;
