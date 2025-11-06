import styles from './styles';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { LoginFormSchema, loginSchema } from '@/validation/login-form-schema';
import { useRouter } from 'expo-router';
import { loginService } from '../../../services/login-service';
import { InputPassword } from '@/components/ui/input/input-password';
import { useAuth } from '@/contexts/(doctor)/user-context';

interface ILoginFormProps {
  role: 'paciente' | 'medico';
}

const roleMapping = {
  paciente: 'patient',
  medico: 'doctor',
} as const;

export const LoginForm = ({ role }: ILoginFormProps) => {
  const { login } = useAuth();
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

  const onSubmit = async (data: LoginFormSchema) => {
    setLoading(true);

    try {
      // Converte o role para o formato do back-end
      const backendRole = roleMapping[role];

      const { token, user } = await loginService({
        email: data.email,
        password: data.password,
        role: backendRole,
      });

      await login(token, user);

      // Redireciona baseado no role
      router.push(
        role === 'paciente' ? '/paciente/agendamentos' : '/medico/painel',
      );
    } catch (error: any) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
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
          <InputPassword value={value} onChange={onChange} onBlur={onBlur} />
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
