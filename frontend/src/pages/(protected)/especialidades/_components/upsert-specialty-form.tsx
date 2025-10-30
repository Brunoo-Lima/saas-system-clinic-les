import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import {
  specialtyFormSchema,
  type SpecialtyFormSchema,
} from '@/validations/specialty-form-schema';
import type { ISpecialty } from '@/@types/ISpecialty';
import FormInputCustom from '@/components/ui/form-custom/form-input-custom';
import {
  useCreateSpecialty,
  useUpdateSpecialty,
} from '@/services/specialty-service';
import FormInputPriceCustom from '@/components/ui/form-custom/form-input-price-custom';
import { useGetClinic } from '@/services/clinic-service';
import { toast } from 'sonner';

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
    resolver: zodResolver(specialtyFormSchema) as Resolver<SpecialtyFormSchema>,
    defaultValues: {
      name: specialty?.name ?? '',
      price: specialty?.price ?? 0,
    },
  });
  const createMutation = useCreateSpecialty();
  const updateMutation = useUpdateSpecialty();
  const { data: clinic } = useGetClinic();

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: specialty?.name ?? '',
        price: specialty?.price ?? 0,
      });
    }
  }, [isOpen, form, specialty]);

  const onSubmit = (data: SpecialtyFormSchema) => {
    if (!clinic?.id) {
      toast.error('ID da clínica não encontrado');
      return;
    }

    if (specialty?.id) {
      // Edição
      updateMutation.mutate(
        {
          id: specialty.id,
          name: data.name,
          price: data.price,
          clinicId: clinic.id,
        },
        {
          onSuccess: () => {
            onSuccess();
            form.reset();
          },
        },
      );
    } else {
      // Criação
      createMutation.mutate(
        {
          name: data.name,
          price: data.price,
          clinicId: clinic.id,
        },
        {
          onSuccess: () => {
            onSuccess();
            form.reset();
          },
        },
      );
    }
  };

  return (
    <DialogContent className="w-full sm:max-w-lg max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>
          {specialty ? specialty.name : 'Adicionar especialidade'}
        </DialogTitle>
        <DialogDescription>
          {specialty
            ? 'Edite as informações dessa especialidade.'
            : 'Adicione uma nova especialidade.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInputCustom name="name" label="Nome" control={form.control} />

          <FormInputPriceCustom
            name="price"
            label="Preço"
            control={form.control}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full mt-4"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Salvando...'
                : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
