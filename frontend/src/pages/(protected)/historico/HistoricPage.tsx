import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { useEffect } from "react";

export default function HistoricPage() {
  useEffect(() => {
    document.title = "Histórico";
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Histórico</PageTitle>
          <PageDescription>Histórico da clinica</PageDescription>
        </PageHeaderContent>

        {/* <PageActions>
            <AddPatientButton />
          </PageActions> */}
      </PageHeader>

      <PageContent>
        {/* <DataTable columns={patientsTableColumns} data={patientsList} /> */}
        em construção: consultas realizadas, canceladas, agendadas e perdidas, e
        outras funcionalidades.
      </PageContent>
    </PageContainer>
  );
}
