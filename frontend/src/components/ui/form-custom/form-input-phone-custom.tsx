import { PatternFormat } from "react-number-format";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import type { Control, FieldValues, Path } from "react-hook-form";

interface IFormInputPhoneCustomProps<T extends FieldValues> {
  name: Path<T>; // só aceita chaves válidas do formulário
  label: string;
  control: Control<T>;
}

const FormInputPhoneCustom = <T extends FieldValues>({
  name,
  label,
  control,
}: IFormInputPhoneCustomProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PatternFormat
              format="(##) #####-####"
              mask="_"
              placeholder="(11) 99999-9999"
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value.value);
              }}
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInputPhoneCustom;
