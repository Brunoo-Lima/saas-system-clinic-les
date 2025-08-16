import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

export const DashboardPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral da sua clinica
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
