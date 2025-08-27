import { type ColumnDef } from "@tanstack/react-table";
import type { IAgreement } from "@/@types/IAgreement";
import { ActionsAgreement } from "./actions-agreement";
import { DialogSpecialties } from "./dialog-specialties";

type Agreement = IAgreement;

export const agreementsTableColumns: ColumnDef<Agreement>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Descrição",
  },
  {
    id: "specialties",
    accessorKey: "specialties",
    header: "Especialidades",
    cell: (params) => {
      const specialties = params.row.original.specialties;
      return <DialogSpecialties specialties={specialties} />;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: (params) => {
      const agreement = params.row.original;
      return <ActionsAgreement agreement={agreement} />;
    },
  },
];
