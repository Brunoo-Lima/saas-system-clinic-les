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
import { patientsTableColumns } from "./_components/table-columns";
import { Suspense, useEffect } from "react";
import { InputSearch } from "@/components/ui/input-search";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { usePatient } from "@/hooks/use-patient";
import { PaginationComponent } from "@/components/pagination-component";

export const PatientsPage = () => {
  const {
    searchTerm,
    handleSearch,
    selectedGender,
    setSelectedGender,
    paginatedData,
    page,
    handlePage,
    totalPages,
  } = usePatient();

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

      <PageContent classNameCustom="flex flex-col gap-y-4">
        <div className="flex justify-between">
          <InputSearch
            className="w-96"
            placeholder="Buscar paciente"
            value={searchTerm}
            onChange={handleSearch}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Gênero <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={selectedGender === "male"}
                onCheckedChange={(checked) =>
                  setSelectedGender(checked ? "male" : null)
                }
              >
                Masculino
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedGender === "female"}
                onCheckedChange={(checked) =>
                  setSelectedGender(checked ? "female" : null)
                }
              >
                Feminino
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Suspense fallback={<div>Carregando...</div>}>
          <DataTable columns={patientsTableColumns} data={paginatedData} />
        </Suspense>

        <div className="flex-1 self-end">
          <PaginationComponent
            currentPage={page}
            onPageChange={handlePage}
            totalPages={totalPages}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
};
