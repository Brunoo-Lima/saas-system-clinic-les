import type { ISpecialty } from '@/@types/ISpecialty';
import { type ColumnDef } from '@tanstack/react-table';
import { ActionsSpecialty } from './actions-specialty';

type Specialty = ISpecialty;

export const specialtyTableColumns: ColumnDef<Specialty>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    size: 50,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nome',
    size: 200,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Criado em',
    size: 200,
    cell: (params) => {
      const specialty = params.row.original;
      return new Date(specialty.createdAt as Date).toLocaleString();
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    size: 120,
    cell: (params) => {
      const specialty = params.row.original;
      return <ActionsSpecialty specialty={specialty} />;
    },
  },
];
