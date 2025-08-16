import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { AddAppointmentButton } from "./_components/add-appointment-button";
import { patientsList } from "@/mocks/patients-list";
import { doctorsList } from "@/mocks/doctors-list";
import { DataTable } from "@/components/ui/data-table";
import { appointmentsTableColumns } from "./_components/table-columns";

export const AppointmentPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddAppointmentButton patients={patientsList} doctors={doctorsList} />
        </PageActions>
      </PageHeader>

      <PageContent>
        <DataTable columns={appointmentsTableColumns} data={[]} />
      </PageContent>
    </PageContainer>
  );
};
