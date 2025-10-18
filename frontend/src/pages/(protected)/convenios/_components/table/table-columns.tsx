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
    id: 'type',
    accessorKey: 'type',
    header: 'Nome',
  },
  {
    id: 'modalities',
    accessorKey: 'modalities',
    header: 'Modalidade',
    cell: (params) => {
      const modalities = params.row.original.modalities;
      return modalities.map((modality) => modality.name).join(', ');
    },
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
