import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { Suspense, useEffect } from "react";
import { AddSpecialtyButton } from "./_components/add-specialty-button";
import { InputSearch } from "@/components/ui/input-search";
import { DataTable } from "@/components/ui/data-table";
import { specialtyTableColumns } from "./_components/table/table-columns";
import { PaginationComponent } from "@/components/pagination-component";
import { useSpecialty } from "@/hooks/use-specialty";

export default function SpecialtiesPage() {
  const {
    searchTerm,
    handleSearch,
    paginatedData,
    page,
    handlePage,
    totalPages,
  } = useSpecialty();

  useEffect(() => {
    document.title = "Especialidades";
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Especialidades</PageTitle>
          <PageDescription>
            Gerencie as especialidades da sua clínica
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddSpecialtyButton />
        </PageActions>
      </PageHeader>

      <PageContent classNameCustom="flex flex-col gap-y-4">
        <div className="flex md:justify-between justify-start gap-2  flex-wrap md:flex-nowrap ">
          <InputSearch
            className="md:w-96 w-full"
            placeholder="Buscar convênio"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <Suspense fallback={<div>Carregando...</div>}>
          <DataTable columns={specialtyTableColumns} data={paginatedData} />
        </Suspense>

        <div className="flex-1 self-end">
          <PaginationComponent
            currentPage={page}
            onPageChange={handlePage}
            totalPages={totalPages}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
}
