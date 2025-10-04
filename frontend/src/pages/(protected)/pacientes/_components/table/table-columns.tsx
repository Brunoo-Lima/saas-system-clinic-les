import { type ColumnDef } from '@tanstack/react-table';
import { ActionsPatient } from './actions-patient';
import type { IPatient } from '@/@types/IPatient';

type Patient = IPatient;

export const patientsTableColumns: ColumnDef<Patient>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    id: 'email',
    header: 'Email',
    accessorFn: (row) => row.user?.email || '',
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: 'Telefone',

    cell: (params) => {
      const patient = params.row.original;
      const phoneNumber = patient.phone;
      if (!phoneNumber) return '';
      const formatted = phoneNumber.replace(
        /(\d{2})(\d{5})(\d{4})/,
        '($1) $2-$3',
      );
      return formatted;
    },
  },
  {
    id: 'sex',
    accessorKey: 'sex',
    header: 'Sexo',
    cell: (params) => {
      const patient = params.row.original;
      return patient.sex === 'male' ? 'Masculino' : 'Feminino';
    },
  },
  {
    id: 'actions',
    cell: (params) => {
      const patient = params.row.original;
      return <ActionsPatient patient={patient} />;
    },
  },
];
