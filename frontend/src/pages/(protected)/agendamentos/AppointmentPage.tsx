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
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HistoryIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { IDoctor } from "@/@types/IDoctor";

export default function AppointmentPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Agendamentos";
  }, []);

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
          <AddAppointmentButton
            patients={patientsList}
            doctors={doctorsList as IDoctor[]}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/agendamentos/historico")}
          >
            <HistoryIcon /> Histórico de agendamentos
          </Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <DataTable columns={appointmentsTableColumns} data={[]} />
      </PageContent>
    </PageContainer>
  );
}
