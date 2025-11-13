import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';
import { AddInsuranceButton } from './_components/actions/add-insurance-button';
import { DataTable } from '@/components/ui/data-table';
import { insurancesTableColumns } from './_components/table/table-columns';
import { useEffect } from 'react';
import { InputSearch } from '@/components/ui/input-search';
import { PaginationComponent } from '@/components/pagination-component';
import { useInsurance } from '@/hooks/use-insurance';
import { Dropdown } from './_components/actions/dropdown';

export const InsurancePage = () => {
  const {
    searchTerm,
    handleSearch,
    selectedSpecialty,
    setSelectedSpecialty,
    paginatedData,
    page,
    handlePage,
    totalPages,
  } = useInsurance();

  useEffect(() => {
    document.title = 'Convênios';
  }, []);

  const handleChangeSpecialty = (checked: string | null) => {
    setSelectedSpecialty(checked);
    handlePage(1);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Convênios</PageTitle>
          <PageDescription>
            Gerencie os convênios da sua clínica
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddInsuranceButton />
        </PageActions>
      </PageHeader>

      <PageContent classNameCustom="flex flex-col gap-y-4">
        <div className="flex md:justify-between justify-start header__custom__appointment gap-4">
          <InputSearch
            className="sm:w-96 w-full"
            placeholder="Buscar convênio"
            value={searchTerm}
            onChange={handleSearch}
          />

          <Dropdown
            selectedSpecialty={selectedSpecialty}
            onChangeSpecialty={handleChangeSpecialty}
          />
        </div>

        <DataTable columns={insurancesTableColumns} data={paginatedData} />

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
