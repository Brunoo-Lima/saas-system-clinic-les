import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import {
  specialtyFormSchema,
  type SpecialtyFormSchema,
} from "@/validations/specialty-form-schema";
import type { ISpecialty } from "@/@types/ISpecialty";
import FormInputPriceCustom from "@/components/ui/form-custom/form-input-price-custom";
import FormInputCustom from "@/components/ui/form-custom/form-input-custom";

interface IUpsertSpecialtyFormProps {
  isOpen: boolean;
  specialty?: ISpecialty;
  onSuccess: () => void;
}

export const UpsertSpecialtyForm = ({
  specialty,
  isOpen,
  onSuccess,
}: IUpsertSpecialtyFormProps) => {
  const form = useForm<SpecialtyFormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(specialtyFormSchema),
    defaultValues: {
      name: specialty?.name ?? "",
      price: specialty?.price ?? 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(specialty ?? {});
    }
  }, [isOpen, form, specialty]);

  // const upsertPatientAction = useAction(upsertPatient, {
  //   onSuccess: () => {
  //     toast.success("Paciente salvo com sucesso.");
  //     onSuccess?.();
  //   },
  //   onError: () => {
  //     toast.error("Erro ao salvar paciente.");
  //   },
  // });

  const onSubmit = (_values: SpecialtyFormSchema) => {
    // upsertPatientAction.execute({
    //   ...values,
    //   id: patient?.id,
    // });

    onSuccess();
    toast.success("Especialidade salva com sucesso.");
  };

  return (
    <DialogContent className="w-full sm:max-w-lg max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>
          {specialty ? specialty.name : "Adicionar especialidade"}
        </DialogTitle>
        <DialogDescription>
          {specialty
            ? "Edite as informações dessa especialidade."
            : "Adicione uma nova especialidade."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInputCustom name="name" label="Nome" control={form.control} />

          <FormInputPriceCustom
            name="price"
            label="Valor da especialidade"
            control={form.control}
          />

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
