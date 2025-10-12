import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Building2, MapPin } from 'lucide-react';
import {
  registerFormClinicSchema,
  type RegisterFormClinicSchema,
} from '@/validations/signup-form-clinic-schema';
import FormInputPhoneCustom from '@/components/ui/form-custom/form-input-phone-custom';
import FormInputCustom from '@/components/ui/form-custom/form-input-custom';
import { useNavigate } from 'react-router-dom';
import { useCreateClinic } from '@/services/clinic-service';
import type { IClinic } from '@/@types/IClinic';
import { useUpdateStatusProfileCompleted } from '@/services/user-clinic-service';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { formatCNPJ } from '@/utils/format-cnpj';
import type { ChangeEvent } from 'react';
import { formatCEP } from '@/utils/format-cep';

const brazilianStates = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const times = Array.from(
  { length: 24 },
  (_, i) => `${String(i).padStart(2, '0')}:00:00`,
);

export const FormCompleteProfile = () => {
  const navigate = useNavigate();
  const form = useForm<RegisterFormClinicSchema>({
    resolver: zodResolver(
      registerFormClinicSchema,
    ) as Resolver<RegisterFormClinicSchema>,
    defaultValues: {
      name: '',
      cnpj: '',
      phone: '',
      specialties: [],
      insurances: [],
      timeToConfirm: '',
      address: {
        name: '',
        cep: '',
        neighborhood: '',
        street: '',
        number: '',
        state: {
          name: '',
          uf: '',
        },
        city: {
          name: '',
        },
        country: {
          name: 'Brasil',
        },
      },
    },
  });
  const { user, updateUser } = useAuth();
  const { mutate } = useCreateClinic();
  const { mutate: updateStatusProfileCompleted } =
    useUpdateStatusProfileCompleted();

  const handleCNPJChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    form.setValue('cnpj', formatted);
  };

  const handleCEPChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    form.setValue('address.cep', formatted);
  };

  async function onSubmit(data: RegisterFormClinicSchema) {
    if (!user?.id) {
      toast.error('Usuário não encontrado ao completar cadastro.');
      return;
    }

    const payload: IClinic = {
      ...data,
      specialties:
        data.specialties?.map((s) => ({
          id: s.id,
          name: s.name ?? '',
          price: s.price,
        })) ?? [],

      insurances:
        data.insurances?.map((i) => ({
          id: i.id,
          name: i.name ?? '',
        })) ?? [],
    };

    mutate(payload, {
      onSuccess: () => {
        updateStatusProfileCompleted(
          {
            id: user.id ?? '',
            profileCompleted: true,
          },
          {
            onSuccess: () => {
              updateUser({ profileCompleted: true });

              navigate('/dashboard', { replace: true });
            },
            onError: (error) => {
              console.error('Erro ao atualizar status do perfil:', error);
              toast.error('Erro ao completar perfil.');
            },
          },
        );
      },
    });
  }

  return (
    <div className="max-w-[800px] mx-auto pt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Dados da Clínica</CardTitle>
              </div>
              <CardDescription>
                Preencha as informações básicas da clínica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputCustom
                name="name"
                label="Nome da clínica"
                control={form.control}
                placeholder="Nome da clínica"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00.000.000/0000-00"
                          {...field}
                          onChange={handleCNPJChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormInputPhoneCustom
                  control={form.control}
                  name="phone"
                  label="Telefone"
                />

                <FormField
                  control={form.control}
                  name="timeToConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo para confirmação</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {times.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Endereço</CardTitle>
              </div>
              <CardDescription>
                Informe o endereço completo da clínica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address.cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00000-000"
                          {...field}
                          onChange={handleCEPChange}
                          value={field.value}
                          maxLength={9}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormInputCustom
                  control={form.control}
                  name="address.name"
                  label="Nome do endereço"
                  placeholder="Nome do endereço"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormInputCustom
                  control={form.control}
                  name="address.street"
                  label="Rua"
                  placeholder='Rua "Exemplo"'
                />

                <FormInputCustom
                  control={form.control}
                  name="address.neighborhood"
                  label="Bairro"
                  placeholder="Centro"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormInputCustom
                  control={form.control}
                  name="address.number"
                  label="Número"
                  placeholder="123"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <FormInputCustom
                  control={form.control}
                  name="address.city.name"
                  label="Cidade"
                  placeholder="Cidade"
                />

                <FormInputCustom
                  control={form.control}
                  name="address.state.name"
                  label="Estado"
                  placeholder="Estado"
                />

                <FormField
                  control={form.control}
                  name="address.state.uf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brazilianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormInputCustom
                  control={form.control}
                  name="address.country.name"
                  label="Pais"
                  placeholder="Brasil"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Limpar
            </Button>
            <Button type="submit">Cadastrar Clínica</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
