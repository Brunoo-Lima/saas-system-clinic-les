import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

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

        <PageActions>{/* <AddStudentButton /> */} botao</PageActions>
      </PageHeader>

      <PageContent>
        {/* <DataTable columns={studentsTableColumns} data={[]} /> */}
        lista
      </PageContent>
    </PageContainer>
  );
};
