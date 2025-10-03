import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { FormControl, FormMessage } from '@/components/ui/form';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  registerFormSchema,
  type RegisterFormSchema,
} from '@/validations/signup-form-schema';
import { InputPassword } from '@/components/ui/input-password';
import { createUserService } from '@/services/create-user-service';

const SignUpForm = () => {
  const navigate = useNavigate();
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      role: 'admin',
    },
  });

  const onSubmit = async (user: RegisterFormSchema) => {
    try {
      const { status } = await createUserService({
        email: user.email,
        username: user.name,
        password: user.password,
        passwordConfirmed: user.confirm_password,
        role: user.role,
        avatar: '',
        emailVerified: false,
        profileCompleted: false,
      });

      if (status === 201) {
        toast.success('Conta criada com sucesso.');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      // form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu e-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <InputPassword
                  placeholder="Digite sua senha"
                  type="password"
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
              <FormLabel>Confirme sua senha</FormLabel>
              <FormControl>
                <InputPassword
                  placeholder="Digite sua senha novamente"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Criar conta'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
