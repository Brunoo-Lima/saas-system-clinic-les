import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

export const DoctorsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
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
