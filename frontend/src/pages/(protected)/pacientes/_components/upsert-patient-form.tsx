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

import { RefreshCcwIcon } from 'lucide-react';
import { InputPassword } from '@/components/ui/input-password';
import type { IPatient } from '@/@types/IPatient';
import { getPatientDefaultValues } from '../_helpers/get-patient-default-values';
import {
  useCreatePatient,
  useUpdatePatient,
  type IPatientPayload,
} from '@/services/patient-service';
import { formatCPF } from '@/utils/format-cpf';
import { brazilianStates } from '@/utils/brazilian-states';
import { formatCEP } from '@/utils/format-cep';
import InputDate from '@/components/ui/input-date';
import { useGetAllInsurances } from '@/services/insurance-service';

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

  const { mutate: createPatient, isPending: isCreating } = useCreatePatient();
  const { mutate: updatePatient, isPending: isUpdating } = useUpdatePatient();
  const { data: insurances } = useGetAllInsurances();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen && patient) {
      form.reset(getPatientDefaultValues(patient));
    }
  }, [isOpen, patient, form]);

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

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

    // Para criação, envia todos os dados
    if (!patient) {
      const payload: IPatientPayload = {
        ...values,
        dateOfBirth: dateOfBirthString,
        cardInsurances,
      };

      createPatient(payload, {
        onSuccess: () => {
          onSuccess();
          form.reset();
        },
      });
    } else {
      // Para atualização, usar dirtyFields para pegar apenas campos modificados
      const dirtyFields = form.formState.dirtyFields;

      const payload: any = {
        id: patient.id,
      };

      // Função para construir o payload apenas com campos modificados
      const buildDirtyPayload = (
        dirtyFields: any,
        values: any,
        basePath: string = '',
      ) => {
        Object.keys(dirtyFields).forEach((key) => {
          const fullPath = basePath ? `${basePath}.${key}` : key;
          const isDirty = dirtyFields[key];

          if (isDirty === true) {
            // Campo primitivo sujo - adicionar ao payload
            const pathParts = fullPath.split('.');
            let current = payload;

            for (let i = 0; i < pathParts.length - 1; i++) {
              const part = pathParts[i];
              if (!current[part]) {
                current[part] = {};
              }
              current = current[part];
            }

            current[pathParts[pathParts.length - 1]] = getNestedValue(
              values,
              fullPath,
            );
          } else if (typeof isDirty === 'object') {
            // Objeto nested - processar recursivamente
            buildDirtyPayload(isDirty, values, fullPath);
          }
        });
      };

      // Função auxiliar para pegar valores nested
      const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
      };

      // Construir payload apenas com campos sujos
      buildDirtyPayload(dirtyFields, values);

      if (payload.user) {
        // Se algum campo do user foi modificado, garantir que venha como objeto completo
        payload.user = {
          ...(patient.user || {}), // Manter dados existentes
          ...payload.user, // Sobrescrever com campos modificados
        };
      }

      // Garantir que o ID do endereço seja incluído se houver mudanças no address
      if (payload.address) {
        payload.address = {
          id: patient.address.id,
          ...(patient.address || {}), // Manter dados existentes do endereço
          ...payload.address, // Sobrescrever com campos modificados
        };
      }

      // Campos que precisam de formatação especial
      if (dirtyFields.dateOfBirth) {
        payload.dateOfBirth = dateOfBirthString;
      }

      if (dirtyFields.cardInsurances) {
        payload.cardInsurances = cardInsurances;
      }

      console.log(
        'Payload PATCH para atualização:',
        JSON.stringify(payload, null, 2),
      );

      updatePatient(
        { id: patient.id, patient: payload },
        {
          onSuccess: () => {
            onSuccess();
            console.log('Paciente atualizado com sucesso');
            form.reset(values);
          },
        },
      );
    }
  };

  return (
    <DialogContent className="w-full sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {patient ? `Editar ${patient.name}` : 'Adicionar paciente'}
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
                  <FormControl>
                    <InputDate
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date)}
                      placeholder="DD/MM/AAAA"
                    />
                  </FormControl>
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
                          {insurances?.map((ins) => (
                            <SelectItem key={ins.id} value={ins.id.toString()}>
                              {ins.type}
                            </SelectItem>
                          ))}

                          {!insurances?.length && (
                            <SelectItem value="null">
                              Nenhum convênio
                            </SelectItem>
                          )}
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
              name="address.city"
              label="Cidade"
              placeholder="Digite o nome da cidade"
              control={form.control}
            />

            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="Estado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.uf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <FormField
              control={form.control}
              name="address.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input placeholder="País" {...field} value="Brasil" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full mt-4">
              {isPending
                ? 'Salvando...'
                : patient
                ? 'Atualizar paciente'
                : 'Salvar paciente'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
