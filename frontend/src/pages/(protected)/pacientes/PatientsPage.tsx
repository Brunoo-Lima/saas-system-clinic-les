import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

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

        <PageActions>{/* <AddStudentButton /> */} botao</PageActions>
      </PageHeader>

      <PageContent>
        {/* <DataTable columns={studentsTableColumns} data={[]} /> */}
        lista
      </PageContent>
    </PageContainer>
  );
};
