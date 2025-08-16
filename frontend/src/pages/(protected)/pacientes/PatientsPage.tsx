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
import { patientsList } from "@/mocks/patients-list";
import { patientsTableColumns } from "./_components/table-columns";
import { useEffect } from "react";
import { InputSearch } from "@/components/ui/input-search";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

export const PatientsPage = () => {
  useEffect(() => {
    document.title = "Pacientes";
  }, []);

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
        <div className="flex justify-between">
          <InputSearch className="w-96" placeholder="Buscar paciente" />

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Gênero <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {patientsList
        
                .map((patient) => (
                  <DropdownMenuCheckboxItem
                    key={patient.id}
                    checked={patient.sex === "Masculino"}
                  >
                    {patient.sex}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        <DataTable columns={patientsTableColumns} data={patientsList} />
      </PageContent>
    </PageContainer>
  );
};
