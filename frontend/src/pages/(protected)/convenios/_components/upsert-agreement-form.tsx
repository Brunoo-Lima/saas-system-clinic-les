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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  agreementFormSchema,
  type AgreementFormSchema,
} from "@/validations/agreement-form-schema";
import { medicalSpecialties } from "../../medicos/_constants";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import type { IAgreement } from "@/@types/IAgreement";

interface IUpsertAgreementFormProps {
  isOpen: boolean;
  agreement?: IAgreement;
  onSuccess: () => void;
}

export const UpsertAgreementForm = ({
  agreement,
  isOpen,
  onSuccess,
}: IUpsertAgreementFormProps) => {
  const form = useForm<AgreementFormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(agreementFormSchema),
    defaultValues: {
      name: agreement?.name ?? "",
      description: agreement?.description ?? "",
      specialties: agreement?.specialties ?? [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(agreement ?? {});
    }
  }, [isOpen, form, agreement]);

  // const upsertPatientAction = useAction(upsertPatient, {
  //   onSuccess: () => {
  //     toast.success("Paciente salvo com sucesso.");
  //     onSuccess?.();
  //   },
  //   onError: () => {
  //     toast.error("Erro ao salvar paciente.");
  //   },
  // });

  const onSubmit = (_values: AgreementFormSchema) => {
    // upsertPatientAction.execute({
    //   ...values,
    //   id: patient?.id,
    // });

    onSuccess();
    toast.success("Convênio salvo com sucesso.");
  };

  return (
    <DialogContent className="w-full sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {agreement ? agreement.name : "Adicionar Convênio"}
        </DialogTitle>
        <DialogDescription>
          {agreement
            ? "Edite as informações desse convênio."
            : "Adicione um novo convênio."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do convênio</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do convênio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite a descrição do convênio"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialties"
            defaultValue={[]}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidades</FormLabel>
                <FormControl>
                  <Command>
                    <CommandInput
                      className="px-2 py-0 border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Buscar especialidade..."
                    />
                    <CommandList>
                      <CommandEmpty>Nenhum resultado.</CommandEmpty>
                      <CommandGroup>
                        {medicalSpecialties.map((spec) => {
                          const isSelected = field.value.some(
                            (s) => s.slug === spec.slug
                          );

                          return (
                            <CommandItem
                              key={spec.slug}
                              onSelect={() => {
                                if (isSelected) {
                                  field.onChange(
                                    field.value.filter(
                                      (s) => s.slug !== spec.slug
                                    )
                                  );
                                } else {
                                  field.onChange([
                                    ...field.value,
                                    { slug: spec.slug, name: spec.value },
                                  ]);
                                }
                              }}
                              className="flex items-center justify-between"
                            >
                              {spec.label}
                              {isSelected && <CheckIcon size={16} />}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </FormControl>
                <FormMessage />

                <div className="flex flex-wrap gap-1 mt-2">
                  {field.value.map((s) => (
                    <span
                      key={s.slug}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {s.name}
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(
                            field.value.filter((item) => item.slug !== s.slug)
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </FormItem>
            )}
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
