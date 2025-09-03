import { Row } from '@/components/ui/row';

import FormInputCustom from '@/components/ui/form-custom/form-input-custom';
import { useForm } from 'react-hook-form';
import {
  addressFormSchema,
  type AddressFormSchema,
} from '@/validations/address-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

export const AddressForm = () => {
  const form = useForm<AddressFormSchema>({
    resolver: zodResolver(addressFormSchema),
  });

  const onSubmit = () => {};

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <FormInputCustom
            name="zipCode"
            label="CEP"
            placeholder="Digite o CEP"
            control={form.control}
          />
          <FormInputCustom
            name="neighborhood"
            label="Bairro"
            placeholder="Digite o bairro"
            control={form.control}
          />
          <FormInputCustom
            name="street"
            label="Rua"
            placeholder="Digite a rua"
            control={form.control}
          />
          <Row variant="row">
            <FormInputCustom
              name="number"
              label="Número"
              placeholder="Digite o número"
              control={form.control}
            />
          </Row>
          <div className="grid grid-cols-3 gap-3">
            <FormInputCustom
              name="city"
              label="Cidade"
              placeholder="Digite a cidade"
              control={form.control}
            />
            <FormInputCustom
              name="state"
              label="Estado"
              placeholder="Digite o estado"
              control={form.control}
            />
            <FormInputCustom
              name="country"
              label="País"
              placeholder="Digite o país"
              control={form.control}
            />
          </div>

          <Button
            type="submit"
            className="bg-green-700 hover:bg-green-500 mt-auto max-w-[190px] w-full"
          >
            Salvar endereço
          </Button>
        </form>
      </Form>
    </div>
  );
};
