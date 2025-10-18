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
import { useFieldArray, useForm, type Resolver } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useEffect, useState, type ChangeEvent } from 'react';
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
import { formatCPF } from '@/utils/format-cpf';
import { Input } from '@/components/ui/input';
import { formatCRM } from '@/utils/format-crm';
import { useGetSpecialties } from '@/services/specialty-service';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCEP } from '@/utils/format-cep';
import { brazilianStates } from '@/utils/brazilian-states';
import { useCreateDoctor } from '@/services/doctor-service';

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
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const {
    fields: periodFields,
    append: appendPeriod,
    remove: removePeriod,
  } = useFieldArray({
    control: form.control,
    name: 'periodToWork',
  });

  const { mutate, isPending } = useCreateDoctor();
  const { data: specialtiesBackend } = useGetSpecialties();

  const specialties =
    specialtiesBackend?.map((specialty) => ({
      value: specialty.id,
      label: specialty.name,
    })) || [];

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  useEffect(() => {
    if (isOpen) {
      form.reset(getDoctorDefaultValues(doctor) ?? {});
    }
  }, [isOpen, form, doctor]);

  // Adicione este useEffect para sincronizar as especialidades
  useEffect(() => {
    form.setValue(
      'specialties',
      selectedSpecialties.map((id) => ({ id })),
    );
  }, [selectedSpecialties, form]);

  // E este para sincronizar os períodos quando especialidades são removidas
  useEffect(() => {
    const currentPeriods = form.getValues('periodToWork') || [];
    const filteredPeriods = currentPeriods.filter((period) =>
      selectedSpecialties.includes(period.specialty_id),
    );

    if (filteredPeriods.length !== currentPeriods.length) {
      form.setValue('periodToWork', filteredPeriods);
    }
  }, [selectedSpecialties, form]);

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

  const handleCEPformat = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    form.setValue('address.cep', formatted);
  };

  const toggleSpecialty = (specialtyId: string) => {
    setSelectedSpecialties((prev) => {
      const isSelected = prev.includes(specialtyId);
      return isSelected
        ? prev.filter((id) => id !== specialtyId)
        : [...prev, specialtyId];
    });
  };

  const onSubmit = async (data: DoctorFormSchema) => {
    try {
      const payload = {
        name: data.name,
        cpf: data.cpf.replace(/\D/g, ''), // Remove formatação do CPF
        crm: data.crm,
        sex: data.sex,
        phone: data.phone.replace(/\D/g, ''), // Remove formatação do telefone
        dateOfBirth:
          data.dateOfBirth instanceof Date
            ? data.dateOfBirth.toISOString().split('T')[0]
            : data.dateOfBirth,
        percentDistribution: data.percentDistribution || 0.2,
        user: {
          username: data.user.username || data.name, // Fallback para name se username não existir
          email: data.user.email,
          password: data.user.password,
          avatar: data.user.avatar || '',
        },
        specialties: data.specialties, // Já está no formato [{ id }]
        periodToWork: data.periodToWork.map((period) => ({
          ...period,
          dayWeek: +period.dayWeek,
          timeFrom: period.timeFrom.includes(':')
            ? period.timeFrom
            : period.timeFrom + ':00',
          timeTo: period.timeTo.includes(':')
            ? period.timeTo
            : period.timeTo + ':00',
        })),
        address: {
          name: data.address.name,
          street: data.address.street,
          number: data.address.number,
          neighborhood: data.address.neighborhood,
          cep: data.address.cep.replace(/\D/g, ''), // Remove formatação do CEP
          city: {
            name: data.address.city.name,
          },
          state: {
            name: data.address.state.name,
            uf: data.address.state.uf,
          },
          country: {
            name: data.address.country.name,
          },
        },
      };

      mutate(payload as any, {
        onSuccess: () => {
          toast.success('Médico salvo com sucesso.');
          onSuccess();
        },
      });
    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao salvar médico.');
    }
  };

  const addPeriodToSpecialty = (specialtyId: string) => {
    appendPeriod({
      dayWeek: 1,
      timeFrom: '08:00:00',
      timeTo: '12:00:00',
      specialty_id: specialtyId,
    });
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

          <div className="space-y-4">
            <strong className="pb-2 block text-2xl">
              Especialidades e Horários
            </strong>

            <FormField
              control={form.control}
              name="percentDistribution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de repasse</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="120" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialties"
              render={() => (
                <FormItem>
                  <FormLabel className="text-xl">
                    Selecionar Especialidades
                  </FormLabel>
                  <div className="space-y-2 grid grid-cols-2">
                    {specialties.map((specialty) => {
                      const isChecked = selectedSpecialties.includes(
                        specialty.value,
                      );

                      return (
                        <FormItem
                          key={specialty.value}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
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

            {/* Campos de Período para cada especialidade selecionada */}
            {selectedSpecialties.map((specialtyId) => {
              const specialty = specialties.find(
                (s) => s.value === specialtyId,
              );
              const specialtyPeriods = periodFields.filter(
                (period) => period.specialty_id === specialtyId,
              );

              return (
                <div
                  key={specialtyId}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg font-semibold">
                      {specialty?.label} - Horários de Trabalho
                    </FormLabel>
                    <Button
                      type="button"
                      onClick={() => addPeriodToSpecialty(specialtyId)}
                      variant="outline"
                      size="sm"
                    >
                      + Adicionar Período
                    </Button>
                  </div>

                  {specialtyPeriods.map((period) => {
                    // Encontra o índice global do período
                    const globalIndex = periodFields.findIndex(
                      (p) => p.id === period.id,
                    );

                    return (
                      <div
                        key={period.id}
                        className="grid grid-cols-5 gap-2 items-end border p-3 rounded"
                      >
                        <FormField
                          control={form.control}
                          name={`periodToWork.${globalIndex}.dayWeek`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dia</FormLabel>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">Segunda</SelectItem>
                                  <SelectItem value="2">Terça</SelectItem>
                                  <SelectItem value="3">Quarta</SelectItem>
                                  <SelectItem value="4">Quinta</SelectItem>
                                  <SelectItem value="5">Sexta</SelectItem>
                                  <SelectItem value="6">Sábado</SelectItem>
                                  <SelectItem value="7">Domingo</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`periodToWork.${globalIndex}.timeFrom`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Das</FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  value={field.value?.substring(0, 5)}
                                  onChange={(e) =>
                                    field.onChange(e.target.value + ':00')
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`periodToWork.${globalIndex}.timeTo`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Até</FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  value={field.value?.substring(0, 5)}
                                  onChange={(e) =>
                                    field.onChange(e.target.value + ':00')
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removePeriod(globalIndex)}
                        >
                          Remover
                        </Button>
                      </div>
                    );
                  })}

                  {specialtyPeriods.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      Nenhum período cadastrado para esta especialidade
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <strong className="py-2 block text-2xl">Dados pessoais</strong>

          <FormInputCustom
            name="user.username"
            label="Nome do usuário"
            placeholder="Digite o nome do usuário"
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

          <div className="grid grid-cols-3 gap-4">
            <FormInputCustom
              name="address.city.name"
              label="Cidade"
              placeholder="Digite a cidade"
              control={form.control}
            />

            <FormInputCustom
              name="address.state.name"
              label="Estado"
              placeholder="Digite o estado"
              control={form.control}
            />

            <div className="grid grid-cols-2 gap-2">
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
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : doctor ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
