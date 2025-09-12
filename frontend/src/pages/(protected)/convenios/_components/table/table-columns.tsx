import { type ColumnDef } from '@tanstack/react-table';
import type { IInsurance } from '@/@types/IInsurance';
import { ActionsInsurance } from './actions-insurance';
import { DialogSpecialties } from '../dialog-specialties';

type Insurance = IInsurance;

export const insurancesTableColumns: ColumnDef<Insurance>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Descrição',
  },
  {
    id: 'specialties',
    accessorKey: 'specialties',
    header: 'Especialidades',
    cell: (params) => {
      const specialties = params.row.original.specialties;
      return <DialogSpecialties specialties={specialties} />;
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: (params) => {
      const insurance = params.row.original;
      return <ActionsInsurance insurance={insurance} />;
    },
  },
];
