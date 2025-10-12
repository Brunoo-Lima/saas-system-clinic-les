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

import {
  doctorFormSchema,
  type DoctorFormSchema,
} from '@/validations/doctor-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { medicalSpecialties } from '../_constants';
import { Button } from '@/components/ui/button';
import { useEffect, type ChangeEvent } from 'react';
import type { IDoctor } from '@/@types/IDoctor';
import { toast } from 'sonner';
import FormInputCustom from '@/components/ui/form-custom/form-input-custom';

import { getDoctorDefaultValues } from '../_helpers/get-doctor-default-values';
import FormSelectCustom from '@/components/ui/form-custom/form-select-custom';
import FormInputPhoneCustom from '@/components/ui/form-custom/form-input-phone-custom';
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
import { Checkbox } from '@/components/ui/checkbox';
import { formatCPF } from '@/utils/format-cpf';
import { Input } from '@/components/ui/input';
import { formatCRM } from '@/utils/format-crm';

interface IUpsertDoctorFormProps {
  doctor?: IDoctor;
  onSuccess: () => void;
  isOpen: boolean;
}

export const UpsertDoctorForm = ({
  doctor,
  onSuccess,
  isOpen,
}: IUpsertDoctorFormProps) => {
  const form = useForm<DoctorFormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(doctorFormSchema) as Resolver<DoctorFormSchema>,
    defaultValues: getDoctorDefaultValues(doctor),
  });

  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: 'specialties', // precisa bater com o schema
  // });

  useEffect(() => {
    if (isOpen) {
      form.reset(getDoctorDefaultValues(doctor) ?? {});
    }
  }, [isOpen, form, doctor]);

  const handleNewPasswordRandom = (length: number = 8) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    form.setValue('user.password', password, { shouldValidate: true });
  };

  const handleCPFformat = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    form.setValue('cpf', formatted);
  };

  const handleCRMformat = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCRM(e.target.value);
    form.setValue('crm', formatted);
  };

  const toggleSpecialty = (_specialtyValue: string) => {
    // const index = fields.findIndex((f) => f.specialty === specialtyValue);
    // if (index >= 0) {
    //   remove(index);
    // } else {
    //   append({
    //     specialty: specialtyValue,
    //     availableWeekDay: [], // começa vazio
    //   });
    // }
  };

  const onSubmit = (data: DoctorFormSchema) => {
    const payload = {
      ...data,
    };

    console.log(payload);

    onSuccess();
    toast.success('Médico salvo com sucesso.');
  };

  return (
    <DialogContent className="w-full sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{doctor ? doctor.name : 'Adicionar médico'}</DialogTitle>
        <DialogDescription>
          {doctor
            ? 'Edite as informações desse médico.'
            : 'Adicione um novo médico.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <strong className="pb-2 block text-2xl">Dados profissionais</strong>

          <FormInputCustom
            name="name"
            label="Nome"
            placeholder="Digite o nome"
            control={form.control}
          />

          <div className="grid grid-cols-2 gap-x-6">
            <FormField
              control={form.control}
              name="crm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRM</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: SP-123456"
                      {...field}
                      onChange={handleCRMformat}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="specialties"
            render={() => (
              <FormItem>
                <FormLabel>Especialidades</FormLabel>
                <div className="space-y-2 grid grid-cols-2">
                  {medicalSpecialties.map((specialty) => {
                    // const isChecked = fields.some(
                    //   (f) => f.specialty === specialty.value,
                    // );

                    return (
                      <FormItem
                        key={specialty.value}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <Checkbox
                            // checked={isChecked}
                            onCheckedChange={() =>
                              toggleSpecialty(specialty.value)
                            }
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {specialty.label}
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {fields.map((field, index) => (
            <>
              <strong key={field.id} className="py-2 block text-2xl">
                {field.specialty}
              </strong>
              <FormField
                key={field.id}
                control={form.control}
                name={`specialties.${index}.availableWeekDay`}
                render={({ field }) => (
                  <WeekDayAvailabilityField
                    field={field}
                    weekDays={WEEK_DAYS}
                    timeOptions={timeOptions}
                  />
                )}
              />
            </>
          ))} */}

          <strong className="py-2 block text-2xl">Dados pessoais</strong>

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

          <div className="grid grid-cols-2 gap-x-6">
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

            <FormInputPhoneCustom
              name="phone"
              label="Telefone"
              control={form.control}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-6">
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

          <strong className="py-2 block text-2xl">Endereço</strong>

          <div className="grid grid-cols-2 gap-x-6">
            <FormInputCustom
              name="address.cep"
              label="CEP"
              placeholder="Digite o cep"
              control={form.control}
            />

            <FormInputCustom
              name="address.number"
              label="Número da residência"
              placeholder="Digite o número"
              type="number"
              min={0}
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

            <FormInputCustom
              name="address.state.uf"
              label="UF"
              placeholder="Digite o UF"
              control={form.control}
            />

            <FormInputCustom
              name="address.country.name"
              label="País"
              placeholder="Digite o país"
              control={form.control}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? 'Salvando...'
                : doctor
                ? 'Salvar'
                : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
