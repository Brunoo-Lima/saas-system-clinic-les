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
import { loginService } from '../../../../services/login-service';
import { StorageService } from '../../../../services/storage-service';

interface ILoginFormProps {
  role: 'paciente' | 'medico';
}

const roleMapping = {
  paciente: 'patient',
  medico: 'doctor',
} as const;

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

      // Salva o token no SecureStore
      await StorageService.setItem('userToken', token);
      await StorageService.setItem('userRole', backendRole);
      await StorageService.setItem('userData', JSON.stringify(user));

      console.log('Login realizado com sucesso:', user);

      // Redireciona baseado no role
      if (role === 'paciente') {
        router.push('/paciente/agendamentos');
      } else {
        router.push('/medico/painel');
      }
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
