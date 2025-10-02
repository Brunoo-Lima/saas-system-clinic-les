import styles from './styles';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { LoginFormSchema, loginSchema } from '@/validation/login-form-schema';
import { useRouter } from 'expo-router';

interface ILoginFormProps {
  role: 'paciente' | 'medico';
}

export const LoginForm = ({ role }: ILoginFormProps) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: LoginFormSchema) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      console.log('Login:', { role, ...data });

      if (role === 'paciente') {
        router.push('/paciente/agendamentos');
      } else {
        router.push('/medico/painel');
      }
    }, 1200);
  };

  return (
    <>
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={`Email do ${role}`}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            editable={!loading}
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <Text style={[styles.label, { marginTop: 12 }]}>Senha</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Sua senha"
            secureTextEntry
            style={styles.input}
            editable={!loading}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>
            Entrar como {role === 'medico' ? 'Médico' : 'Paciente'}
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};
