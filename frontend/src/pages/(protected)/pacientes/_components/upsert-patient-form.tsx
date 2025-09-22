import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  patientFormSchema,
  type PatientFormSchema,
} from '@/validations/patient-form-schema';
import { toast } from 'sonner';
import { insurancesList } from '@/mocks/insurances-list';
import { Switch } from '@/components/ui/switch';
import FormInputCustom from '@/components/ui/form-custom/form-input-custom';
import FormSelectCustom from '@/components/ui/form-custom/form-select-custom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, RefreshCcwIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { InputPassword } from '@/components/ui/input-password';
import type { IPatient } from '@/@types/IPatient';
import { getPatientDefaultValues } from '../_helpers/get-patient-default-values';

interface IUpsertPatientFormProps {
  isOpen: boolean;
  patient?: IPatient;
  onSuccess: () => void;
}

export const UpsertPatientForm = ({
  patient,
  isOpen,
  onSuccess,
}: IUpsertPatientFormProps) => {
  const form = useForm<PatientFormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(patientFormSchema),
    defaultValues: getPatientDefaultValues(patient),
  });

  useEffect(() => {
    if (isOpen && patient) {
      form.reset({
        ...form.getValues(),
        ...patient,
      });
    }
  }, [isOpen, patient, form]);

  const handleNewPasswordRandom = (length: number = 8) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    form.setValue('password', password, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<PatientFormSchema> = (
    values: PatientFormSchema,
  ) => {
    const payload = {
      ...values,
      user: {
        email: values.email,
        password: values.password,
      },
    };

    console.log(payload);

    onSuccess();
    toast.success('Paciente salvo com sucesso.');
  };

  return (
    <DialogContent className="w-full sm:max-w-lg lg:max-w-2xl max-h-[90vh]  overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {patient ? patient.name : 'Adicionar paciente'}
        </DialogTitle>
        <DialogDescription>
          {patient
            ? 'Edite as informações desse paciente.'
            : 'Adicione um novo paciente.'}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInputCustom
            name="name"
            label="Nome do paciente"
            placeholder="Digite o nome completo do paciente"
            control={form.control}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInputCustom
              name="cpf"
              label="CPF"
              placeholder="Digite o CPF"
              control={form.control}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de telefone</FormLabel>
                  <FormControl>
                    <PatternFormat
                      format="(##) #####-####"
                      mask="_"
                      placeholder="(11) 99999-9999"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value.value);
                      }}
                      customInput={Input}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormInputCustom
            name="email"
            label="Email"
            placeholder="exemplo@email.com"
            control={form.control}
          />

          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <InputPassword {...field} placeholder="Digite sua senha" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <p className="text-sm">Gerar senha aleatória: </p>
              <Button
                className="size-8"
                variant={'ghost'}
                type="button"
                onClick={() => handleNewPasswordRandom()}
              >
                <RefreshCcwIcon />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormSelectCustom
              name="gender"
              label="Sexo"
              options={[
                { value: 'male', label: 'Masculino' },
                { value: 'female', label: 'Feminino' },
              ]}
              control={form.control}
            />
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="hasInsurance"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel>Tem convênio?</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {form.watch('hasInsurance') && (
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="insurance.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Convênio</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o convênio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {insurancesList.map((insurance) => (
                            <SelectItem
                              key={insurance.id}
                              value={insurance.name}
                            >
                              {insurance.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-x-4">
                  <FormInputCustom
                    name="insurance.number"
                    label="Número da carteirinha"
                    placeholder="Digite o número"
                    control={form.control}
                  />

                  <FormInputCustom
                    name="insurance.validate"
                    label="Validade"
                    placeholder="Digite a validade"
                    control={form.control}
                  />
                </div>

                <FormSelectCustom
                  name="insurance.modality"
                  label="Modalidade"
                  options={[
                    { value: 'apartamento', label: 'Apartamento' },
                    { value: 'empresarial', label: 'Empresarial' },
                    { value: 'enfermaria', label: 'Enfermaria' },
                    { value: 'executivo', label: 'Executivo' },
                  ]}
                  control={form.control}
                />
              </div>
            )}
          </div>

          <div className="py-4">
            <strong className="text-2xl">Endereço</strong>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInputCustom
              name="address.zipCode"
              label="CEP"
              placeholder="Digite o cep"
              control={form.control}
            />

            <FormInputCustom
              name="address.number"
              label="Número da residência"
              placeholder="Digite o numero"
              control={form.control}
            />
          </div>

          <FormInputCustom
            name="address.neighborhood"
            label="Bairro"
            placeholder="Digite o bairro"
            control={form.control}
          />

          <FormInputCustom
            name="address.street"
            label="Rua"
            placeholder="Digite o nome da rua"
            control={form.control}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormInputCustom
              name="address.city"
              label="Cidade"
              placeholder="Digite o nome da cidade"
              control={form.control}
            />

            <FormInputCustom
              name="address.state"
              label="Estado"
              placeholder="Digite o nome do estado"
              control={form.control}
            />

            <FormInputCustom
              name="address.country"
              label="País"
              placeholder="Digite o país"
              control={form.control}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full mt-4"
            >
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
