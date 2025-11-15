import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';
import { Suspense, useEffect } from 'react';
import { AddSpecialtyButton } from './_components/add-specialty-button';
import { InputSearch } from '@/components/ui/input-search';
import { DataTable } from '@/components/ui/data-table';
import { specialtyTableColumns } from './_components/table/table-columns';
import { PaginationComponent } from '@/components/pagination-component';
import { useSpecialty } from '@/hooks/use-specialty';
import { Dropdown } from '../medicos/_components/actions/dropdown';
import { medicalSpecialties } from '../medicos/_constants';

export default function SpecialtiesPage() {
  const {
    searchTerm,
    handleSearch,
    paginatedData,
    page,
    handlePage,
    totalPages,
    selectedSpecialty,
    setSelectedSpecialty,
  } = useSpecialty();

  useEffect(() => {
    document.title = 'Especialidades';
  }, []);

  console.log(paginatedData);

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
        <div className="flex md:justify-between justify-start header__custom__appointment gap-4">
          <InputSearch
            className="sm:w-96 w-full"
            placeholder="Buscar especialidade"
            value={searchTerm}
            onChange={handleSearch}
          />

          <Dropdown
            label="Especialidade"
            items={medicalSpecialties}
            value={selectedSpecialty}
            onChange={setSelectedSpecialty}
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
