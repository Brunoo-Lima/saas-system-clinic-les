import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormInputCustom from '@/components/ui/form-custom/form-input-custom';
import { InputPassword } from '@/components/ui/input-password';
import { loginService } from '@/services/login-service';
import { loginSchema, type LoginSchema } from '@/validations/login-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const LoginForm = () => {
  const navigate = useNavigate();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'admin',
    },
  });

  const onSubmit = async (user: LoginSchema) => {
    try {
      const { token } = await loginService({
        email: user.email,
        password: user.password,
        role: 'admin',
      });

      localStorage.setItem('@user:token', token);

      navigate('/dashboard');
    } catch (error: any) {
      toast.error(
        error.message === 'User not found'
          ? 'Usuário não encontrado'
          : error.message,
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-3">
        <FormInputCustom
          control={form.control}
          name="email"
          label="E-mail"
          placeholder="E-mail"
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

        <Button
          type="submit"
          className="w-full text-foreground mt-4"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Entrar'
          )}
        </Button>
      </form>
    </Form>
  );
};
