/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
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
import {
  insuranceFormSchema,
  type InsuranceFormSchema,
} from '@/validations/insurance-form-schema';
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
import { useGetSpecialties } from '@/services/specialty-service';
import { Input } from '@/components/ui/input';

interface ISpecialty {
  id: string;
  name: string;
}

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
    resolver: zodResolver(insuranceFormSchema) as Resolver<InsuranceFormSchema>,
    defaultValues: {
      name: '',
      modalities: [],
      specialties: [],
    },
  });
  const { data: specialtiesData = [] } = useGetSpecialties({
    limit: 10,
    offset: 0,
  });

  const [filteredSpecialties, setFilteredSpecialties] = useState<ISpecialty[]>(
    [],
  );

  const {
    fields: modalityFields,
    append: appendModality,
    remove: removeModality,
  } = useFieldArray({
    control: form.control,
    name: 'modalities',
  });

  const { mutate, isPending } = useCreateInsurance();

  useEffect(() => {
    if (isOpen) {
      form.reset(insurance ?? {});
    }
  }, [isOpen, insurance?.id]);

  useEffect(() => {
    setFilteredSpecialties(specialtiesData);
  }, [specialtiesData]);

  const onSubmit: SubmitHandler<InsuranceFormSchema> = (data) => {
    mutate(
      {
        name: data.name,
        modalities: data.modalities.map((modality) => {
          return {
            name: modality.name,
          };
        }),
        specialties: data.specialties.map((specialty) => {
          return {
            id: specialty.id,
            price: specialty.price,
            amountTransferred: specialty.amountTransferred,
          };
        }),
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

          <div className="flex flex-col gap-y-2 items-start">
            <FormLabel>Modalidades</FormLabel>
            {modalityFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-2">
                <FormInputCustom
                  name={`modalities.${index}.name`}
                  label="Nome"
                  placeholder="Ex: Modalidade"
                  control={form.control}
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="self-end"
                  onClick={() => removeModality(index)}
                >
                  Remover
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => appendModality({ name: '' })}>
              Adicionar modalidade
            </Button>
          </div>

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
                      placeholder="Buscar especialidade..."
                      onValueChange={(value) => {
                        setFilteredSpecialties(
                          specialtiesData.filter((s: any) =>
                            s.name.toLowerCase().includes(value.toLowerCase()),
                          ),
                        );
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>
                        Nenhuma especialidade encontrada
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredSpecialties.map((spec: any) => {
                          const isSelected = field.value.some(
                            (s) => s.id === spec.id,
                          );

                          return (
                            <CommandItem
                              key={spec.id}
                              onSelect={() => {
                                if (isSelected) {
                                  field.onChange(
                                    field.value.filter((s) => s.id !== spec.id),
                                  );
                                } else {
                                  field.onChange([
                                    ...field.value,
                                    {
                                      id: spec.id,
                                      name: spec.name,
                                      price: 0,
                                      amountTransferred: 0,
                                    },
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

                <div className="flex flex-col gap-2 mt-2">
                  {field.value.map((s, index) => (
                    <div
                      key={s.id}
                      className="flex flex-col gap-1 border p-2 rounded"
                    >
                      <div className="flex items-center justify-between">
                        <span>
                          {
                            specialtiesData.find((spec) => spec.id === s.id)
                              ?.name
                          }
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(
                              field.value.filter((item) => item.id !== s.id),
                            )
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>

                      {/* Inputs de price e amountTransferred */}
                      <div className="flex gap-2">
                        <div className="flex flex-col gap-2">
                          <FormLabel>Preço</FormLabel>
                          <Controller
                            control={form.control}
                            name={`specialties.${index}.price`}
                            render={({ field: priceField }) => (
                              <Input
                                type="number"
                                placeholder="Preço"
                                {...priceField}
                              />
                            )}
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <FormLabel>Valor Transferido</FormLabel>
                          <Controller
                            control={form.control}
                            name={`specialties.${index}.amountTransferred`}
                            render={({ field: amountField }) => (
                              <Input
                                type="number"
                                placeholder="Valor Transferido"
                                {...amountField}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FormItem>
            )}
          />

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
