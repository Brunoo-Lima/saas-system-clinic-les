import { NumericFormat } from "react-number-format";
import { FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Input } from "../input";
import type { Control, FieldValues, Path } from "react-hook-form";

interface IFormInputPriceCustomProps<T extends FieldValues> {
  name: Path<T>; // só aceita chaves válidas do formulário
  label: string;
  control: Control<T>;
}

const FormInputPriceCustom = <T extends FieldValues>({
  name,
  label,
  control,
}: IFormInputPriceCustomProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <NumericFormat
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value.floatValue);
            }}
            decimalScale={2}
            fixedDecimalScale
            decimalSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            thousandSeparator="."
            customInput={Input}
            prefix="R$"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInputPriceCustom;
