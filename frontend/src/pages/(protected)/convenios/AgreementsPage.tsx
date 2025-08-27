import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { AddAgreementButton } from "./_components/add-agreement-button";
import { DataTable } from "@/components/ui/data-table";
import { agreementsTableColumns } from "./_components/table-columns";
import { useEffect } from "react";
import { InputSearch } from "@/components/ui/input-search";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { PaginationComponent } from "@/components/pagination-component";
import { useAgreement } from "@/hooks/use-agreement";
import { medicalSpecialties } from "../medicos/_constants";

export const AgreementsPage = () => {
  const {
    searchTerm,
    handleSearch,
    selectedSpecialty,
    setSelectedSpecialty,
    paginatedData,
    page,
    handlePage,
    totalPages,
  } = useAgreement();

  useEffect(() => {
    document.title = "Convênios";
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Convênios</PageTitle>
          <PageDescription>
            Gerencie os convênios da sua clínica
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddAgreementButton />
        </PageActions>
      </PageHeader>

      <PageContent classNameCustom="flex flex-col gap-y-4">
        <div className="flex md:justify-between justify-start gap-2  flex-wrap md:flex-nowrap ">
          <InputSearch
            className="md:w-96 w-full"
            placeholder="Buscar convênio"
            value={searchTerm}
            onChange={handleSearch}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="md:ml-auto ml-0">
                Especialidade <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="left-0">
              {medicalSpecialties.map((specialty) => (
                <DropdownMenuCheckboxItem
                  key={specialty.value}
                  checked={selectedSpecialty === specialty.value}
                  onCheckedChange={(checked) =>
                    setSelectedSpecialty(checked ? specialty.value : null)
                  }
                >
                  {specialty.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DataTable columns={agreementsTableColumns} data={paginatedData} />

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
