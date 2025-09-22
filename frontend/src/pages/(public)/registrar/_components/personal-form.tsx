import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Row } from '@/components/ui/row';

import FormInputCustom from '@/components/ui/form-custom/form-input-custom';
import { InputPassword } from '@/components/ui/input-password';
import type { RegisterFormClinicSchema } from '@/validations/signup-form-clinic-schema';

interface IPersonalFormProps {
  form: UseFormReturn<RegisterFormClinicSchema>;
}

export const PersonalForm = ({ form }: IPersonalFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormInputCustom
        type="text"
        name="name"
        label="Nome"
        placeholder="Digite seu nome"
        control={form.control}
      />

      <FormInputCustom
        type="text"
        name="cnpj"
        label="CNPJ"
        placeholder="Digite seu CNPJ"
        control={form.control}
      />

      <FormInputCustom
        type="email"
        name="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        control={form.control}
      />

      <Row variant="row">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <InputPassword
                  type="password"
                  placeholder="Digite sua senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <InputPassword
                  type="password"
                  placeholder="Confirme sua senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Row>
    </div>
  );
};
