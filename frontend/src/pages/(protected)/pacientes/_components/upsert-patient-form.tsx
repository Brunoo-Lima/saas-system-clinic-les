import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type ChangeEvent } from 'react';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
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
import {
  useCreatePatient,
  type IPatientPayload,
} from '@/services/patient-service';
import { formatCPF } from '@/utils/format-cpf';
import { brazilianStates } from '@/utils/brazilian-states';
import { formatCEP } from '@/utils/format-cep';

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'cardInsurances',
  });

  const { mutate, isPending } = useCreatePatient();

  useEffect(() => {
    if (isOpen && patient) {
      form.reset(getPatientDefaultValues(patient));
    }
  }, [isOpen, patient, form]);

  const cardInsurances = form.watch('cardInsurances');
  const hasInsurance = cardInsurances ? cardInsurances.length > 0 : false;

  const handleNewPasswordRandom = (length: number = 8) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    form.setValue('user.password', password, { shouldValidate: true });
    form.setValue('user.confirmPassword', password, { shouldValidate: true });
  };

  const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCPFformat = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    form.setValue('cpf', formatted);
  };

  const handleCEPformat = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    form.setValue('address.cep', formatted);
  };

  const onSubmit: SubmitHandler<PatientFormSchema> = (values) => {
    const dateOfBirthString =
      values.dateOfBirth instanceof Date
        ? formatDateToYYYYMMDD(values.dateOfBirth)
        : values.dateOfBirth;

    const cardInsurances = Array.isArray(values.cardInsurances)
      ? values.cardInsurances
      : [];

    const payload: Omit<IPatientPayload, 'id'> = {
      ...values,

      dateOfBirth: dateOfBirthString,
      cardInsurances,
    };

    mutate(payload, {
      onSuccess: () => {
        onSuccess();
        form.reset();
      },
    });
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
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o CPF"
                      {...field}
                      onChange={handleCPFformat}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
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
            name="user.username"
            label="Nome do usuário do paciente"
            placeholder="Digite o usuário do paciente"
            control={form.control}
          />

          <FormInputCustom
            name="user.email"
            label="Email"
            placeholder="exemplo@email.com"
            control={form.control}
          />

          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="user.password"
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

            <FormField
              control={form.control}
              name="user.confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme sua senha</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      placeholder="Digite sua confirmação de senha"
                    />
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
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            // Converter para Date antes de formatar
                            format(
                              field.value instanceof Date
                                ? field.value
                                : new Date(field.value),
                              'PPP',
                              { locale: ptBR },
                            )
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
                        selected={
                          field.value instanceof Date
                            ? field.value
                            : field.value
                            ? new Date(field.value)
                            : undefined
                        }
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormSelectCustom
              name="sex"
              label="Sexo"
              options={[
                { value: 'Male', label: 'Masculino' },
                { value: 'Female', label: 'Feminino' },
              ]}
              control={form.control}
            />
          </div>

          {/* Convênios */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4">
              <Switch
                checked={hasInsurance}
                onCheckedChange={() =>
                  hasInsurance
                    ? remove(0)
                    : append({
                        insurance: { id: '', name: '' },
                        cardInsuranceNumber: '',
                        validate: '',
                        modality: { id: '' },
                      })
                }
              />
              <span>Tem convênio?</span>
            </div>

            {fields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="flex flex-col gap-4 border p-4 rounded"
              >
                <FormField
                  control={form.control}
                  name={`cardInsurances.${index}.insurance.id`}
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
                          {/* {insurancesList.map((ins) => (
                            <SelectItem key={ins.id} value={ins.id.toString()}>
                              {ins.name}
                            </SelectItem>
                          ))} */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormInputCustom
                  name={`cardInsurances.${index}.cardInsuranceNumber`}
                  label="Número da carteirinha"
                  placeholder="Digite o número"
                  control={form.control}
                />

                <FormInputCustom
                  name={`cardInsurances.${index}.validate`}
                  label="Validade"
                  placeholder="Digite a validade"
                  control={form.control}
                />

                <FormSelectCustom
                  name={`cardInsurances.${index}.modality.id`}
                  label="Modalidade"
                  options={[
                    { value: 'apartamento', label: 'Apartamento' },
                    { value: 'empresarial', label: 'Empresarial' },
                    { value: 'enfermaria', label: 'Enfermaria' },
                    { value: 'executivo', label: 'Executivo' },
                  ]}
                  control={form.control}
                />

                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => remove(index)}
                >
                  Remover convênio
                </Button>
              </div>
            ))}

            <Button
              type="button"
              onClick={() =>
                append({
                  insurance: { id: '', name: '' },
                  cardInsuranceNumber: '',
                  validate: '',
                  modality: { id: '' },
                })
              }
            >
              Adicionar convênio
            </Button>
          </div>

          <div className="py-4">
            <strong className="text-2xl">Endereço</strong>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                      onChange={handleCEPformat}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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

          <div className="grid grid-cols-2 gap-4">
            <FormInputCustom
              name="address.street"
              label="Rua"
              placeholder="Digite o nome da rua"
              control={form.control}
            />

            <FormInputCustom
              name="address.name"
              label="Nome identificador do endereço"
              placeholder="Digite o nome identificador"
              control={form.control}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <FormInputCustom
              name="address.city.name"
              label="Cidade"
              placeholder="Digite o nome da cidade"
              control={form.control}
            />

            <FormInputCustom
              name="address.state.name"
              label="Estado"
              placeholder="Digite o nome do estado"
              control={form.control}
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
              name="address.country.name"
              label="País"
              placeholder="Digite o país"
              control={form.control}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full mt-4">
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
