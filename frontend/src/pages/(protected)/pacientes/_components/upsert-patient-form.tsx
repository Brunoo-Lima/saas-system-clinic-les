import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  patientFormSchema,
  type PatientFormSchema,
} from "@/validations/patient-form-schema";
import { toast } from "sonner";
import { agreementsList } from "@/mocks/agreements-list";
import { Switch } from "@/components/ui/switch";
import FormInputCustom from "@/components/ui/form-custom/form-input-custom";
import FormSelectCustom from "@/components/ui/form-custom/form-select-custom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface IUpsertPatientFormProps {
  isOpen: boolean;
  patient?: any;
  onSuccess: () => void;
}

export const UpsertPatientForm = ({
  patient,
  isOpen,
  onSuccess,
}: IUpsertPatientFormProps) => {
  const [hasAgreement, setHasAgreement] = useState<boolean>(false);
  const form = useForm<PatientFormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phoneNumber: patient?.phoneNumber ?? "",
      gender: patient?.gender ?? undefined,
      agreement: patient?.agreement ?? "",
      cpf: patient?.document ?? "",
      dateOfBirth: patient?.dateOfBirth ?? "",
      address: patient?.address ?? {
        zipCode: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(patient);
    }
  }, [isOpen, form, patient]);

  // const upsertPatientAction = useAction(upsertPatient, {
  //   onSuccess: () => {
  //     toast.success("Paciente salvo com sucesso.");
  //     onSuccess?.();
  //   },
  //   onError: () => {
  //     toast.error("Erro ao salvar paciente.");
  //   },
  // });

  const onSubmit = (_values: PatientFormSchema) => {
    // upsertPatientAction.execute({
    //   ...values,
    //   id: patient?.id,
    // });

    onSuccess();
    toast.success("Paciente salvo com sucesso.");
  };

  return (
    <DialogContent className="w-full sm:max-w-lg lg:max-w-2xl max-h-[90vh]  overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {patient ? patient.name : "Adicionar paciente"}
        </DialogTitle>
        <DialogDescription>
          {patient
            ? "Edite as informações desse paciente."
            : "Adicione um novo paciente."}
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

          <FormInputCustom
            name="email"
            label="Email"
            placeholder="exemplo@email.com"
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
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
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
                          date > new Date() || date < new Date("1900-01-01")
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
                { value: "male", label: "Masculino" },
                { value: "female", label: "Feminino" },
              ]}
              control={form.control}
            />
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4">
              <p>Tem convênio?</p>{" "}
              <Switch
                checked={hasAgreement}
                onCheckedChange={setHasAgreement}
              />
            </div>

            {hasAgreement && (
              <FormField
                control={form.control}
                name="agreement"
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
                        {agreementsList.map((agreement) => (
                          <SelectItem key={agreement.id} value={agreement.name}>
                            {agreement.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full mt-4"
            >
              {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
