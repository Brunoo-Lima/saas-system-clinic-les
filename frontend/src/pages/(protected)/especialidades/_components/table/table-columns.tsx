import type { ISpecialty } from "@/@types/ISpecialty";
import { type ColumnDef } from "@tanstack/react-table";
import { ActionsSpecialty } from "./actions-specialty";
import { formatCurrencyInCents } from "@/utils/format-currency-in-cents";

type Specialty = ISpecialty;

export const specialtyTableColumns: ColumnDef<Specialty>[] = [
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
    id: "price",
    accessorKey: "price",
    header: "Valor",
    cell: (params) => {
      const price = params.row.original.price;
      return formatCurrencyInCents(price ?? 0);
    },
  },

  {
    id: "actions",
    header: "Ações",
    cell: (params) => {
      const specialty = params.row.original;
      return <ActionsSpecialty specialty={specialty} />;
    },
  },
];
