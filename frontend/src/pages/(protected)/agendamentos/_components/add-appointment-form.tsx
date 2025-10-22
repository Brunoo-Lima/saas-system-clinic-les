import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  appointmentFormSchema,
  type AppointmentFormSchema,
} from '@/validations/appointment-form-schema';
import type { IDoctor } from '@/@types/IDoctor';
import type { IAppointment } from '@/@types/IAppointment';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { getAppointmentDefaultValues } from './_helpers/get-appointment-default-values';
import { useGetSpecialties } from '@/services/specialty-service';
import { useGetAllPatients } from '@/services/patient-service';
import { useGetAllInsurances } from '@/services/insurance-service';
import { useCreateAppointment } from '@/services/appointment-service';
import { formatDateToBackend } from '../../agenda/utilities/utilities';
import { useGetAgenda } from '@/services/agenda-service';

interface IAddAppointmentFormProps {
  isOpen: boolean;
  doctors: IDoctor[];
  appointment?: IAppointment;
  onSuccess: () => void;
}

export const AddAppointmentForm = ({
  appointment,
  doctors,
  onSuccess,
  isOpen,
}: IAddAppointmentFormProps) => {
  const [hasInsurance, setHasInsurance] = useState<boolean>(false);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const form = useForm<AppointmentFormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: getAppointmentDefaultValues(appointment),
  });

  const selectedDoctorId = form.watch('doctorId');
  const selectedSpecialtyId = form.watch('specialtyId');
  const selectedDate = form.watch('date');

  const { data: specialties } = useGetSpecialties();
  const { data: patients } = useGetAllPatients();
  const { data: insurances } = useGetAllInsurances();
  const { mutate, isPending } = useCreateAppointment();
  const { data: agenda } = useGetAgenda(selectedDoctorId);

  const doctorsFiltered = useMemo(() => {
    if (!selectedSpecialtyId) return doctors;

    return doctors.filter((doctor) =>
      doctor.specialties?.some((s) => s.id.toString() === selectedSpecialtyId),
    );
  }, [selectedSpecialtyId, doctors]);

  // Busca o médico selecionado
  const selectedDoctor = useMemo(() => {
    if (!selectedDoctorId) return undefined;
    return doctors.find((d) => d.id.toString() === selectedDoctorId);
  }, [selectedDoctorId, doctors]);

  // Determina dias e horários disponíveis conforme o médico e especialidade
  const doctorPeriods = useMemo(() => {
    if (!selectedDoctor || !selectedSpecialtyId) return [];
    return (
      selectedDoctor.periodToWork?.filter(
        (p) => p.specialty_id === selectedSpecialtyId,
      ) || []
    );
  }, [selectedDoctor, selectedSpecialtyId]);

  useEffect(() => {
    if (isOpen) {
      form.reset(getAppointmentDefaultValues(appointment));
    }
  }, [isOpen, form, appointment]);

  // useEffect para resetar o médico quando a especialidade mudar
  useEffect(() => {
    if (selectedSpecialtyId && form.getValues('doctorId')) {
      const currentDoctorId = form.getValues('doctorId');
      const doctorStillAvailable = doctorsFiltered.some(
        (doctor) => doctor.id.toString() === currentDoctorId,
      );

      if (!doctorStillAvailable) {
        form.setValue('doctorId', '');
        form.setValue('priceOfConsultation', 0);
      }
    }
  }, [selectedSpecialtyId, doctorsFiltered, form]);

  // Atualiza horários disponíveis quando a data mudar
  useEffect(() => {
    if (!selectedDate || doctorPeriods.length === 0) {
      setAvailableHours([]);
      form.setValue('hour', '');
      return;
    }

    const dateObj =
      typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate;

    const dayOfWeek = dateObj.getDay(); // 0 (domingo) → 6 (sábado)

    // Encontra o período do dia específico
    const period = doctorPeriods.find((p) => p.dayWeek === dayOfWeek);

    if (period) {
      const startHour = parseInt(period.timeFrom.split(':')[0], 10);
      const startMinute = parseInt(period.timeFrom.split(':')[1], 10);
      const endHour = parseInt(period.timeTo.split(':')[0], 10);
      const endMinute = parseInt(period.timeTo.split(':')[1], 10);

      // Convertendo para minutos totais para facilitar os cálculos
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;

      // Gera horários disponíveis de hora em hora
      const hours: string[] = [];
      for (
        let minutes = startTotalMinutes;
        minutes < endTotalMinutes;
        minutes += 30
      ) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        hours.push(
          `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        );
      }

      setAvailableHours(hours);

      // Se o horário atual não estiver mais disponível, limpa o campo
      const currentHour = form.getValues('hour');
      if (currentHour && !hours.includes(currentHour)) {
        form.setValue('hour', '');
      }
    } else {
      setAvailableHours([]);
      form.setValue('hour', '');
    }
  }, [selectedDate, doctorPeriods, form]);

  //  Bloqueia datas que não fazem parte do período de trabalho do médico
  const isDateDisabled = (date: Date) => {
    if (!doctorPeriods.length) return true; // Se não há períodos, desabilita todas as datas

    const dayOfWeek = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Desabilita datas passadas
    if (date < today) return true;

    // Verifica se há algum período para este dia da semana
    return !doctorPeriods.some((p) => p.dayWeek === dayOfWeek);
  };

  const onSubmit = (values: AppointmentFormSchema) => {
    try {
      const payload = {
        date: formatDateToBackend(values.date as Date),
        hour: `${values.hour}:00`, // Adiciona os segundos
        priceOfConsultation: values.priceOfConsultation,
        isReturn: values.isReturn || false,
        status: 'PENDING', // Valor padrão
        doctor: {
          id: values.doctorId,
        },
        patient: {
          id: values.patientId,
        },
        specialty: {
          id: values.specialtyId,
        },
        insurance: {
          id: values.insuranceId,
        },
      };

      mutate(payload, {
        onSuccess: () => {
          onSuccess();
        },
      });
    } catch (error) {
      toast.error('Erro ao criar agendamento.');
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {appointment ? 'Editar agendamento' : 'Novo agendamento'}
        </DialogTitle>
        <DialogDescription>
          {appointment
            ? 'Edite as informações deste agendamento.'
            : 'Crie um novo agendamento.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="specialtyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specialties?.map((specialty) => (
                      <SelectItem
                        key={specialty.id}
                        value={specialty.id.toString()}
                      >
                        {specialty.name}
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
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients?.map((patient) => (
                      <SelectItem
                        key={patient.id}
                        value={patient.id.toString()}
                      >
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-x-2">
            <p>Convênio?</p>
            <Switch
              checked={hasInsurance}
              onCheckedChange={() => setHasInsurance(!hasInsurance)}
            />
          </div>

          {hasInsurance && (
            <FormField
              control={form.control}
              name="insuranceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convênio</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um convênio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {insurances?.map((insurance) => (
                        <SelectItem
                          key={insurance.id}
                          value={insurance.id.toString()}
                        >
                          {insurance.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctorsFiltered.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} -{' '}
                        {doctor.specialties?.map((s) => s.name).join(', ')}
                      </SelectItem>
                    ))}
                    {doctorsFiltered.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground">
                        Nenhum médico disponível para esta especialidade
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceOfConsultation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue);
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  thousandSeparator="."
                  prefix="R$ "
                  allowNegative={false}
                  disabled={!selectedDoctorId}
                  customInput={Input}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start',
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
                  <PopoverContent align="start" className="p-0">
                    <Calendar
                      mode="single"
                      selected={field.value as Date}
                      onSelect={field.onChange}
                      disabled={isDateDisabled}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          {/* HORÁRIO */}
          <FormField
            control={form.control}
            name="hour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={availableHours.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableHours.length > 0 ? (
                      availableHours.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))
                    ) : (
                      <p className="p-2 text-sm text-muted-foreground">
                        Nenhum horário disponível
                      </p>
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="flex items-center gap-x-3">
            <Checkbox id="isReturn" {...form.register('isReturn')} />
            <label htmlFor="isReturn">Retorno?</label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? 'Salvando...'
                : appointment
                ? 'Salvar alterações'
                : 'Criar agendamento'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
