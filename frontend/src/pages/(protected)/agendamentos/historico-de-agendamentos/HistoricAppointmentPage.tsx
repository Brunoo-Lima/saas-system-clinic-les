import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { useEffect } from "react";

export default function HistoricAppointmentPage() {
  useEffect(() => {
    document.title = "Histórico de agendamentos";
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Histórico de agendamentos</PageTitle>
          <PageDescription>
            Histórico de agendamentos da clínica
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>em breve: realizadas, canceladas e agendadas</PageContent>
    </PageContainer>
  );
}
