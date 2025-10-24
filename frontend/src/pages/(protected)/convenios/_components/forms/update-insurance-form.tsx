/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  type Resolver,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
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
import { CheckIcon, XIcon } from 'lucide-react';
import type { IInsurance } from '@/@types/IInsurance';
import FormInputCustom from '@/components/ui/form-custom/form-input-custom';
import { useUpdateInsurance } from '@/services/insurance-service';
import { useGetSpecialties } from '@/services/specialty-service';
import { Input } from '@/components/ui/input';

interface ISpecialty {
  id: string;
  name: string;
}

interface IUpdateInsuranceFormProps {
  isOpen: boolean;
  insurance?: IInsurance;
  onSuccess: () => void;
}

export const UpdateInsuranceForm = ({
  insurance,
  isOpen,
  onSuccess,
}: IUpdateInsuranceFormProps) => {
  const form = useForm<InsuranceFormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(insuranceFormSchema) as Resolver<InsuranceFormSchema>,
    defaultValues: {
      type: insurance?.type ?? '',
      modalities: [
        ...(insurance?.modalities?.map((m) => ({ name: m.name })) ?? []),
      ],
      specialties: [
        ...(insurance?.specialties?.map((s) => ({
          id: s.id,
          price: s.price,
          amountTransferred: s.amountTransferred,
        })) ?? []),
      ],
    },
  });
  const { data: specialtiesData = [] } = useGetSpecialties({
    limit: 10,
    offset: 0,
  });
  const [filteredSpecialties, setFilteredSpecialties] = useState<ISpecialty[]>(
    [],
  );
  const [editingName, setEditingName] = useState(false);
  const [editingModalities, setEditingModalities] = useState(false);
  const [editingSpecialties, setEditingSpecialties] = useState(false);

  const {
    fields: modalityFields,
    append: appendModality,
    remove: removeModality,
  } = useFieldArray({
    control: form.control,
    name: 'modalities',
  });

  const { mutate, isPending } = useUpdateInsurance();

  useEffect(() => {
    if (isOpen) {
      form.reset(insurance ?? {});
      setEditingName(false);
      setEditingModalities(false);
      setEditingSpecialties(false);
    }
  }, [isOpen, insurance?.id]);

  useEffect(() => {
    setFilteredSpecialties(specialtiesData);
  }, [specialtiesData]);

  const saveName = () => {
    if (!insurance?.id) return;
    // mutate(
    //   // { id: insurance.id, insurance: { name: form.getValues().type } },
    //   {
    //     onSuccess: () => setEditingName(false),
    //   },
    // );
  };
  const saveModalities = () => {
    if (!insurance?.id) return;
    mutate(
      {
        id: insurance.id,
        insurance: { modalities: form.getValues().modalities } as any,
      },
      {
        onSuccess: () => {
          setEditingModalities(false);
          onSuccess();
        },
      },
    );

    console.log(insurance);
  };

  const saveSpecialties = (specialties: any) => {
    if (!insurance?.id) return;

    mutate(
      { id: insurance.id, insurance: { specialties } },
      {
        onSuccess: () => setEditingSpecialties(false),
      },
    );

    console.log(mutate);
  };

  return (
    <DialogContent className="w-full sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{insurance && insurance.type}</DialogTitle>
        <DialogDescription>
          Edite as informações desse convênio
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-4">
          <FormInputCustom
            name="type"
            label="Convênio"
            control={form.control}
            disabled={!editingName}
          />

          <Button
            type="button"
            onClick={editingName ? saveName : () => setEditingName(true)}
            disabled={isPending}
            className="w-max self-end"
          >
            {editingName
              ? isPending
                ? 'Salvando...'
                : 'Salvar nome'
              : 'Editar nome'}
          </Button>

          {/* ---------- Modalidades ---------- */}
          <div className="flex flex-col gap-y-2">
            <FormLabel>Modalidades</FormLabel>
            {modalityFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-2">
                <FormInputCustom
                  name={`modalities.${index}.name`}
                  label="Nome"
                  placeholder="Ex: Modalidade"
                  control={form.control}
                  disabled={!editingModalities}
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="self-end"
                  disabled={!editingModalities}
                  onClick={() => removeModality(index)}
                >
                  Remover
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendModality({ name: '' })}
              disabled={!editingModalities}
              className="w-max"
            >
              Adicionar modalidade
            </Button>

            <div className="grid grid-cols-2 gap-2 items-center">
              <Button
                type="button"
                onClick={saveModalities}
                disabled={!editingModalities || isPending}
                className="w-full mt-2 bg-green-700 hover:bg-green-900"
              >
                {isPending ? 'Salvando...' : 'Salvar Modalidades'}
              </Button>

              {!editingModalities && (
                <Button
                  type="button"
                  onClick={() => setEditingModalities(true)}
                  className="w-full mt-1"
                >
                  Editar Modalidades
                </Button>
              )}
            </div>
          </div>

          {/* ---------- Especialidades ---------- */}
          <FormField
            control={form.control}
            name="specialties"
            defaultValue={insurance?.specialties ?? []}
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
                      disabled={!editingSpecialties}
                    />
                    <CommandList>
                      <CommandEmpty>
                        Nenhuma especialidade encontrada
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredSpecialties.length > 0 &&
                          filteredSpecialties.map((spec: any) => {
                            const isSelected = (field.value ?? []).some(
                              (s) => s.id === spec.id,
                            );

                            return (
                              <CommandItem
                                key={spec.id}
                                onSelect={() => {
                                  if (!editingSpecialties) return;
                                  const newValue = isSelected
                                    ? (field.value ?? []).filter(
                                        (s) => s.id !== spec.id,
                                      )
                                    : [
                                        ...(field.value ?? []),
                                        {
                                          id: spec.id,
                                          name: spec.name,
                                          price: 0,
                                          amountTransferred: 0,
                                        },
                                      ];
                                  field.onChange(newValue);
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
                  {(field.value ?? []).map((s, index) => (
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
                            editingSpecialties &&
                            field.onChange(
                              (field.value ?? []).filter(
                                (item) => item.id !== s.id,
                              ),
                            )
                          }
                          disabled={!editingSpecialties}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XIcon />
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
                                disabled={!editingSpecialties}
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
                                disabled={!editingSpecialties}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 items-center">
                  <Button
                    type="button"
                    onClick={() => saveSpecialties(field.value)}
                    disabled={!editingSpecialties || isPending}
                    className="w-full mt-2 bg-green-700 hover:bg-green-900"
                  >
                    {isPending ? 'Salvando...' : 'Salvar Especialidades'}
                  </Button>
                  {!editingSpecialties && (
                    <Button
                      type="button"
                      onClick={() => setEditingSpecialties(true)}
                      className="w-full mt-1"
                    >
                      Editar Especialidades
                    </Button>
                  )}
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DialogContent>
  );
};
