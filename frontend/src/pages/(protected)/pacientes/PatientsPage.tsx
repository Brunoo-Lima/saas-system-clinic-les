import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';
import { AddPatientButton } from './_components/actions/add-patient-button';
import { DataTable } from '@/components/ui/data-table';
import { patientsTableColumns } from './_components/table/table-columns';
import { Suspense, useEffect } from 'react';
import { InputSearch } from '@/components/ui/input-search';
import { usePatient } from '@/hooks/use-patient';
import { PaginationComponent } from '@/components/pagination-component';
import { Dropdown } from './_components/actions/dropdown';

export const PatientsPage = () => {
  const {
    searchTerm,
    handleSearch,
    selectedGender,
    setSelectedGender,
    paginatedData,
    page,
    handlePage,
    totalPages,
  } = usePatient();

  useEffect(() => {
    document.title = 'Pacientes';
  }, []);

  const handleChangeGender = (gender: string | null) => {
    setSelectedGender(gender);
    handlePage(1);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>

      <PageContent classNameCustom="flex flex-col gap-y-4">
        <div className="flex md:justify-between justify-start header__custom__appointment gap-4  ">
          <InputSearch
            className="sm:w-96 w-full"
            placeholder="Buscar paciente"
            value={searchTerm}
            onChange={handleSearch}
          />

          <Dropdown
            selectedGender={selectedGender}
            onChangeGender={handleChangeGender}
          />
        </div>

        <Suspense fallback={<div>Carregando...</div>}>
          <DataTable columns={patientsTableColumns} data={paginatedData} />
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
};
