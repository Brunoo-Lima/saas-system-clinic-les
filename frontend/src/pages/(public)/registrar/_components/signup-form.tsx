import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useNavigate } from 'react-router-dom';
import {
  registerFormUserSchema,
  type RegisterFormUserSchema,
} from '@/validations/signup-form-user-schema';
import { PersonalForm } from './personal-form';
import { AddressForm } from './address-form';

export default function SignupForm() {
  const navigate = useNavigate();
  const form = useForm<RegisterFormUserSchema>({
    resolver: zodResolver(registerFormUserSchema),
    defaultValues: {
      name: '',
      gender: 'Masculino',
      birth_date: new Date(),
      cpf: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormUserSchema> = (data) => {
    // if (address)
    // 	return toast.warning("Preencha ao menos um endereço");

    console.log(data);

    navigate('/dashboard');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-4 *:cursor-pointer">
            <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <PersonalForm form={form} />
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <AddressForm />
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-end space-x-4 *:cursor-pointer">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit">Cadastrar Clinica</Button>
        </div>
      </form>
    </Form>
  );
}
