import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { AddPatientButton } from "./_components/add-patient-button";
import { DataTable } from "@/components/ui/data-table";
import { pacientsList } from "@/mocks/pacients-list";
import { patientsTableColumns } from "./_components/table-columns";

export const PatientsPage = () => {
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

      <PageContent>
        <DataTable columns={patientsTableColumns} data={pacientsList} />
      </PageContent>
    </PageContainer>
  );
};
