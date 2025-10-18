import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';

import { AddDoctorButton } from './_components/actions/add-doctor-button';
import { CardDoctor } from './_components/card-doctor';
import { Suspense, useEffect } from 'react';
import { useDoctor } from '@/hooks/use-doctor';
import { InputSearch } from '@/components/ui/input-search';
import { PaginationComponent } from '@/components/pagination-component';
import { medicalSpecialties } from './_constants';
import { Dropdown } from './_components/actions/dropdown';

export const DoctorsPage = () => {
  const {
    paginatedData,
    page,
    totalPages,
    handlePage,
    handleSearch,
    selectedGender,
    setSelectedGender,
    selectedSpecialty,
    setSelectedSpecialty,
    searchTerm,
  } = useDoctor();

  useEffect(() => {
    document.title = 'Médicos';
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>

      <PageContent classNameCustom="flex flex-col gap-y-4 ">
        <div className="flex justify-between">
          <InputSearch
            className="w-96"
            placeholder="Buscar médico"
            value={searchTerm}
            onChange={handleSearch}
          />

          <div className="flex items-center gap-4">
            <Dropdown
              label="Gênero"
              items={[
                { value: 'male', label: 'Masculino' },
                { value: 'female', label: 'Feminino' },
              ]}
              value={selectedGender}
              onChange={setSelectedGender}
            />

            <Dropdown
              label="Especialidade"
              items={medicalSpecialties}
              value={selectedSpecialty}
              onChange={setSelectedSpecialty}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <div className="flex flex-wrap gap-6 flex-1">
            <Suspense fallback={<p>Carregando...</p>}>
              {paginatedData.map((doctor) => (
                <CardDoctor key={doctor.id} doctor={doctor as any} />
              ))}
            </Suspense>

            {paginatedData.length === 0 && <p>Nenhum médico encontrado.</p>}
          </div>

          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePage}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
};
