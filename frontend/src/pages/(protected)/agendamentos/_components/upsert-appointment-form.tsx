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
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetSpecialties } from '@/services/specialty-service';
import { useGetAllPatients } from '@/services/patient-service';
import { useGetAllInsurances } from '@/services/insurance-service';
import {
  useCreateAppointment,
  useUpdateAppointment,
} from '@/services/appointment-service';
import {
  formatDateToBackend,
  formatDateToBackendRobust,
} from '../../agenda/utilities/utilities';
import { useGetAgenda } from '@/services/agenda-service';
import type { IAppointment } from '@/@types/IAppointment';
import { getAppointmentDefaultValues } from './_helpers/get-appointment-default-values';

interface IUpsertAppointmentFormProps {
  doctors: IDoctor[];
  appointment?: IAppointment;
  onSuccess: () => void;
}

export const UpsertAppointmentForm = ({
  appointment,
  doctors,
  onSuccess,
}: IUpsertAppointmentFormProps) => {
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
  const { mutate: createAppointment, isPending } = useCreateAppointment();
  const { data: agenda } = useGetAgenda(selectedDoctorId);
  const { mutate: updateAppointment } = useUpdateAppointment();

  const doctorsFiltered = useMemo(() => {
    if (!selectedSpecialtyId) return doctors;

    return doctors.filter((doctor) =>
      doctor.specialties?.some((s) => s.id.toString() === selectedSpecialtyId),
    );
  }, [selectedSpecialtyId, doctors]);

  //A agenda é um array, então pegamos a primeira agenda ativa
  const activeAgenda = useMemo(() => {
    if (!agenda || agenda.length === 0) return null;
    // Pega a primeira agenda ativa ou a primeira disponível
    return agenda.find((agendaItem) => agendaItem.isActivate) || agenda[0];
  }, [agenda]);

  // Os períodos vêm de periodToWork dentro da agenda
  const agendaPeriods = useMemo(() => {
    if (!activeAgenda || !selectedSpecialtyId) return [];

    return (
      activeAgenda.periodToWork?.filter(
        (period) => period.specialty.id === selectedSpecialtyId,
      ) || []
    );
  }, [activeAgenda, selectedSpecialtyId]);

  //  As datas bloqueadas vêm de datesBlocked dentro da agenda
  const blockedDates = useMemo(() => {
    if (!activeAgenda) return [];

    return (
      activeAgenda.datesBlocked?.map((blocked) => ({
        date: blocked.dateBlocked,
        reason: blocked.reason,
      })) || []
    );
  }, [activeAgenda]);

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
    if (!selectedDate || agendaPeriods.length === 0) {
      setAvailableHours([]);

      if (!appointment) {
        form.setValue('hour', '');
      }

      return;
    }

    const dateObj =
      typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate;

    const dayOfWeek = dateObj.getDay(); // 0 (domingo) → 6 (sábado)
    const dateString = format(dateObj, 'yyyy-MM-dd');

    // console.log('Checking date:', dateString, 'Day of week:', dayOfWeek);

    // Verifica se a data está bloqueada
    const isDateBlocked = blockedDates.some(
      (blocked) => blocked.date === dateString,
    );
    if (isDateBlocked) {
      // console.log('Date is blocked');
      setAvailableHours([]);
      form.setValue('hour', '');

      // Mostra toast de aviso
      const blockedInfo = blockedDates.find(
        (blocked) => blocked.date === dateString,
      );
      toast.warning('Data indisponível', {
        description: `Esta data está bloqueada: ${
          blockedInfo?.reason || 'Sem motivo especificado'
        }`,
      });
      return;
    }

    // Encontra o período do dia específico
    const period = agendaPeriods.find((p) => p.dayWeek === dayOfWeek);

    // console.log('Found period for day:', period);

    if (period) {
      // Remove os segundos do timeFrom e timeTo se existirem
      const startTime = period.timeFrom.split(':').slice(0, 2).join(':');
      const endTime = period.timeTo.split(':').slice(0, 2).join(':');

      const startHour = parseInt(startTime.split(':')[0], 10);
      const startMinute = parseInt(startTime.split(':')[1], 10);
      const endHour = parseInt(endTime.split(':')[0], 10);
      const endMinute = parseInt(endTime.split(':')[1], 10);

      // Convertendo para minutos totais para facilitar os cálculos
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;

      // Gera horários disponíveis de 30 em 30 minutos
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

      // console.log('Available hours:', hours);
      setAvailableHours(hours);

      // Se o horário atual não estiver mais disponível, limpa o campo
      const currentHour = form.getValues('hour');
      if (currentHour && !hours.includes(currentHour)) {
        form.setValue('hour', '');
      }
    } else {
      // console.log('No period found for this day');
      setAvailableHours([]);
      form.setValue('hour', '');
    }
  }, [selectedDate, agendaPeriods, blockedDates, form, appointment]);

  // Função para verificar se uma data está bloqueada
  const isDateBlocked = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return blockedDates.some((blocked) => blocked.date === dateString);
  };

  // Bloqueia datas que não fazem parte do período de trabalho do médico
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Desabilita datas passadas
    if (date < today) return true;

    // Se não há períodos, desabilita todas as datas futuras
    if (!agendaPeriods.length) return true;

    const dayOfWeek = date.getDay();

    // Verifica se a data está bloqueada
    if (isDateBlocked(date)) return true;

    // Verifica se há algum período para este dia da semana
    return !agendaPeriods.some((p) => p.dayWeek === dayOfWeek);
  };

  useEffect(() => {
    console.log('errors', form.formState.errors);
  }, [form.formState.errors]);

  const onSubmit = (values: AppointmentFormSchema) => {
    try {
      if (appointment) {
        const updatePayload: any = {};

        // Apenas campos que foram alterados/preenchidos
        if (values.date)
          updatePayload.date = formatDateToBackendRobust(values.date as Date);
        if (values.hour) updatePayload.hour = `${values.hour}:00`;
        if (
          values.priceOfConsultation !== undefined &&
          values.priceOfConsultation !== null
        ) {
          updatePayload.priceOfConsultation = values.priceOfConsultation;
        }
        if (values.isReturn !== undefined)
          updatePayload.isReturn = !!values.isReturn;

        // Para relacionamentos, só envia se tiver valor
        if (values.doctorId) updatePayload.doctor = { id: values.doctorId };
        if (values.patientId) updatePayload.patient = { id: values.patientId };
        if (values.specialtyId)
          updatePayload.specialty = { id: values.specialtyId };

        // Insurance pode ser opcional - trata caso de remoção
        if (values.insuranceId !== undefined) {
          updatePayload.insurance = values.insuranceId
            ? { id: values.insuranceId }
            : null;
        }

        console.log('updatePayload', updatePayload);

        updateAppointment(
          {
            id: appointment.id,
            appointment: updatePayload,
          },
          {
            onSuccess: () => {
              onSuccess();
            },
            onError: (error: any) => {
              console.error('Erro na mutation:', error);
            },
          },
        );
      } else {
        const createPayload = {
          date: formatDateToBackend(values.date as Date),
          hour: `${values.hour}:00`,
          priceOfConsultation: values.priceOfConsultation,
          isReturn: !!values.isReturn || false,
          status: 'PENDING',
          doctor: { id: values.doctorId },
          patient: { id: values.patientId },
          specialty: { id: values.specialtyId },
          insurance: values.insuranceId
            ? { id: values.insuranceId }
            : undefined,
        };

        console.log('createPayload', createPayload);

        createAppointment(createPayload, {
          onSuccess: () => {
            toast.success('Agendamento criado com sucesso!');
            onSuccess();
          },
          onError: (error: any) => {
            console.error('Erro na mutation:', error);
          },
        });
      }
    } catch (error) {
      console.error('Erro no onSubmit:', error);
      toast.error('Erro ao salvar agendamento.');
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

          {/* <div className="flex items-center gap-x-2"> */}
          {/* <p>Convênio?</p> */}
          {/* <Switch
              checked={hasInsurance}
              onCheckedChange={() => setHasInsurance(!hasInsurance)}
            />
          </div> */}

          <FormField
            control={form.control}
            name="insuranceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Convênio (opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ''}
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
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
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
                        {selectedDate && isDateBlocked(selectedDate as Date)
                          ? 'Data bloqueada - escolha outra data'
                          : selectedDate
                          ? 'Nenhum horário disponível para esta data'
                          : 'Selecione uma data primeiro'}
                      </p>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isReturn"
            render={({ field }) => (
              <FormItem className="flex items-center gap-x-3">
                <Checkbox
                  id="isReturn"
                  checked={field.value || false}
                  onCheckedChange={(checked) =>
                    field.onChange(Boolean(checked))
                  }
                />
                <label htmlFor="isReturn">Retorno?</label>
              </FormItem>
            )}
          />

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
