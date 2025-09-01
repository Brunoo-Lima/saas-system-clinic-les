import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  doctorFormSchema,
  type DoctorFormSchema,
} from "@/validations/doctor-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { medicalSpecialties } from "../_constants";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import type { IDoctor } from "@/@types/IDoctor";
import { toast } from "sonner";
import FormInputCustom from "@/components/ui/form-custom/form-input-custom";

import { timeOptions } from "@/utils/generate-time";
import { getDoctorDefaultValues } from "../_helpers/get-doctor-default-values";
import { WEEK_DAYS } from "../_constants/WEEK-DAYS";
import { WeekDayAvailabilityField } from "./fields/WeekDayAvailabilityField";
import FormSelectCustom from "@/components/ui/form-custom/form-select-custom";
import FormInputPhoneCustom from "@/components/ui/form-custom/form-input-phone-custom";
import { DatePickerCustom } from "@/components/ui/date-picker-custom";

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

  useEffect(() => {
    if (isOpen) {
      form.reset(getDoctorDefaultValues(doctor));
    }
  }, [isOpen, form, doctor]);

  // const upsertDoctorAction = useAction(upsertDoctor, {
  //   onSuccess: () => {
  //     toast.success("Médico adicionado com sucesso.");
  //     onSuccess?.();
  //   },
  //   onError: () => {
  //     toast.error("Erro ao adicionar médico.");
  //   },
  // });

  const onSubmit = (data: DoctorFormSchema) => {
    // upsertDoctorAction.execute({
    //   ...values,
    //   id: doctor?.id,
    //   availableFromWeekDay: Number(values.availableFromWeekDay),
    //   availableToWeekDay: Number(values.availableToWeekDay),
    //   appointmentPriceInCents: values.appointmentPrice * 100,
    // });
    console.log(data);

    onSuccess();
    toast.success("Médico salvo com sucesso.");
  };

  return (
    <DialogContent className="w-full sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{doctor ? doctor.name : "Adicionar médico"}</DialogTitle>
        <DialogDescription>
          {doctor
            ? "Edite as informações desse médico."
            : "Adicione um novo médico."}
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
            <FormInputCustom
              name="crm"
              label="CRM"
              placeholder="Digite o CRM"
              control={form.control}
            />
          </div>

          <FormField
            control={form.control}
            name="specialty"
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
                    {medicalSpecialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
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
            name="availableWeekDay"
            render={({ field }) => (
              <WeekDayAvailabilityField
                field={field}
                weekDays={WEEK_DAYS}
                timeOptions={timeOptions}
              />
            )}
          />

          <strong className="py-2 block text-2xl">Dados pessoais</strong>

          <FormInputCustom
            name="email"
            label="Email"
            placeholder="Digite o email"
            control={form.control}
          />

          <div className="grid grid-cols-2 gap-x-6">
            <FormInputCustom
              name="cpf"
              label="CPF"
              placeholder="Digite o CPF"
              control={form.control}
            />

            <FormInputPhoneCustom
              name="phoneNumber"
              label="Telefone"
              control={form.control}
            />
          </div>

          <FormSelectCustom
            name="gender"
            label="Sexo"
            control={form.control}
            options={[
              { value: "male", label: "Masculino" },
              { value: "female", label: "Feminino" },
            ]}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de nascimento</FormLabel>
                <FormControl>
                  <DatePickerCustom
                    selected={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <strong className="py-2 block text-2xl">Endereço</strong>

          <div className="grid grid-cols-2 gap-x-6">
            <FormInputCustom
              name="address.zipCode"
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

          <FormInputCustom
            name="address.street"
            label="Rua"
            placeholder="Digite a rua"
            control={form.control}
          />

          <div className="grid grid-cols-2 gap-x-6">
            <FormInputCustom
              name="address.city"
              label="Cidade"
              placeholder="Digite a cidade"
              control={form.control}
            />

            <FormInputCustom
              name="address.state"
              label="Estado"
              placeholder="Digite o estado"
              control={form.control}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Salvando..."
                : doctor
                ? "Salvar"
                : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
