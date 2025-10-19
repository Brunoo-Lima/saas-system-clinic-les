import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
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
import type { IPatient } from '@/@types/IPatient';
import type { IDoctor } from '@/@types/IDoctor';
import type { IAppointment } from '@/@types/IAppointment';
import { availableTimes } from '@/mocks/available-times';
import { specialtyList } from '@/mocks/specialty-list';
import { toast } from 'sonner';

interface IAddAppointmentFormProps {
  isOpen: boolean;
  patients: IPatient[];
  doctors: IDoctor[];
  appointment?: IAppointment;
  onSuccess: () => void;
}

export const AddAppointmentForm = ({
  appointment,
  patients,
  doctors,
  onSuccess,
  isOpen,
}: IAddAppointmentFormProps) => {
  const form = useForm<AppointmentFormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: appointment?.patient.id ?? '',
      doctorId: appointment?.doctor.id ?? '',
      specialtyId: appointment?.specialty.id ?? '',
      insuranceId: appointment?.insurance.id ?? '',
      priceOfConsultation: appointment?.priceOfConsultation ?? 0,
      date: appointment?.date ?? undefined,
      hour: appointment?.hour ?? '',
      isReturn: appointment?.isReturn ?? false,
    },
  });

  const selectedDoctorId = form.watch('doctorId');

  // Atualizar o preço quando o médico for selecionado
  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor.id.toString() === selectedDoctorId,
      );
      if (selectedDoctor) {
        // form.setValue(
        //   'appointmentPrice',
        //   selectedDoctor.servicePriceInCents / 100,
        // );
      }
    }
  }, [selectedDoctorId, doctors, form]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: appointment?.patient.id ?? '',
        doctorId: appointment?.doctor.id ?? '',
        specialtyId: appointment?.specialty.id ?? '',
        insuranceId: appointment?.insurance.id ?? '',
        priceOfConsultation: appointment?.priceOfConsultation ?? 0,
        date: appointment?.date ?? undefined,
        hour: appointment?.hour ?? '',
        isReturn: appointment?.isReturn ?? false,
      });
    }
  }, [isOpen, form, appointment]);

  const onSubmit = (_values: AppointmentFormSchema) => {
    onSuccess();
    toast.success('Agendamento salvo com sucesso.');
  };

  // const isDateAvailable = (date: Date) => {
  //   if (!selectedDoctorId) return false;

  //   const selectedDoctor = doctors.find(
  //     (doctor) => doctor.id.toString() === selectedDoctorId
  //   );
  //   if (!selectedDoctor) return false;

  //   const dayOfWeek = date.getDay();

  //   return (
  //     dayOfWeek >= selectedDoctor?.availableFromWeekDay &&
  //     dayOfWeek <= selectedDoctor?.availableToWeekDay
  //   );
  // };

  // const isDateTimeEnabled = selectedPatientId && selectedDoctorId;

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
                    {specialtyList.map((specialty) => (
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
                    {patients.map((patient) => (
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
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} -{' '}
                        {/* {doctor.specialties.map((s) => s.specialty).join(', ')} */}
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
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
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

          <FormField
            control={form.control}
            name="hour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  // disabled={!isDateTimeEnabled || !selectedDate}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTimes?.map((time) => (
                      <SelectItem
                        key={time.value}
                        value={time.value}
                        disabled={!time.isAvailable}
                      >
                        {time.label} {!time.isAvailable && '(Indisponível)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
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
