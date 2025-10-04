import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import {
  insuranceFormSchema,
  type InsuranceFormSchema,
} from '@/validations/insurance-form-schema';
import { medicalSpecialties } from '../../medicos/_constants';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CheckIcon } from 'lucide-react';
import type { IInsurance } from '@/@types/IInsurance';
import FormInputCustom from '@/components/ui/form-custom/form-input-custom';
import { useCreateInsurance } from '@/services/insurance-service';

interface IUpsertInsuranceFormProps {
  isOpen: boolean;
  insurance?: IInsurance;
  onSuccess: () => void;
}

export const UpsertInsuranceForm = ({
  insurance,
  isOpen,
  onSuccess,
}: IUpsertInsuranceFormProps) => {
  const form = useForm<InsuranceFormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: {
      name: '',
      modalities: [{ name: '' }],
      specialties: [{ price: 0, amountTransferred: 0 }],
    },
  });

  const {
    fields: modalityFields,
    append: appendModality,
    remove: removeModality,
  } = useFieldArray({
    control: form.control,
    name: 'modalities',
  });

  const {
    fields: specialtyFields,
    append: appendSpecialty,
    remove: removeSpecialty,
  } = useFieldArray({
    control: form.control,
    name: 'specialties',
  });

  const { mutate, isPending } = useCreateInsurance();

  useEffect(() => {
    if (isOpen) {
      form.reset(insurance ?? {});
    }
  }, [isOpen, form, insurance]);

  const onSubmit = (data: InsuranceFormSchema) => {
    mutate(
      {
        name: data.name,
        modalities: data.modalities,
        specialties: data.specialties,
      },
      {
        onSuccess: () => {
          onSuccess();
          form.reset();
        },
      },
    );
  };

  return (
    <DialogContent className="w-full sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {insurance ? insurance.name : 'Adicionar Convênio'}
        </DialogTitle>
        <DialogDescription>
          {insurance
            ? 'Edite as informações desse convênio.'
            : 'Adicione um novo convênio.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInputCustom
            name="name"
            label="Convênio"
            control={form.control}
          />

          <div>
            <FormLabel>Modalidades</FormLabel>
            {modalityFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <FormInputCustom
                  name={`modalities.${index}.name`}
                  label="Nome"
                  control={form.control}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeModality(index)}
                >
                  Remover
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendModality({ id: '', name: '' })}
            >
              Adicionar modalidade
            </Button>
          </div>

          {/* Especialidades */}
          <div>
            <FormLabel>Especialidades</FormLabel>
            {specialtyFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-3 gap-2 mb-2">
                <FormInputCustom
                  name={`specialties.${index}.id`}
                  label="ID da especialidade"
                  control={form.control}
                />
                <FormInputCustom
                  name={`specialties.${index}.price`}
                  label="Preço"
                  type="number"
                  control={form.control}
                />
                <FormInputCustom
                  name={`specialties.${index}.amountTransferred`}
                  label="Repasse"
                  type="number"
                  control={form.control}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeSpecialty(index)}
                >
                  Remover
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                appendSpecialty({ id: '', price: 0, amountTransferred: 0 })
              }
            >
              Adicionar especialidade
            </Button>
          </div>

          {/* <FormField
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
  {specialties.map((spec) => {
    const isSelected = field.value.some((s) => s.id === spec.id);

    return (
      <CommandItem
        key={spec.id}
        onSelect={() => {
          if (isSelected) {
            field.onChange(field.value.filter((s) => s.id !== spec.id));
          } else {
            field.onChange([
              ...field.value,
              { id: spec.id, name: spec.name },
            ]);
          }
        }}
        className="flex items-center justify-between"
      >
        {spec.name}
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
                            field.value.filter((item) => item.slug !== s.slug),
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
          /> */}

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full mt-4">
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
