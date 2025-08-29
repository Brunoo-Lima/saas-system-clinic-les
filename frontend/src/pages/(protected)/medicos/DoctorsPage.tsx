import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddDoctorButton } from "./_components/add-doctor-button";
import { CardDoctor } from "./_components/card-doctor";
import { Suspense, useEffect } from "react";
import { useDoctor } from "@/hooks/use-doctor";
import { InputSearch } from "@/components/ui/input-search";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { PaginationComponent } from "@/components/pagination-component";
import { medicalSpecialties } from "./_constants";

export const DoctorsPage = () => {
  const {
    paginatedData,
    page,
    totalPages,
    handlePage,
    handleSearch,
    selectedGender,
    setSelectedGender,
    selectedSpecialty,
    setSelectedSpecialty,
    searchTerm,
  } = useDoctor();

  useEffect(() => {
    document.title = "Médicos";
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>

      <PageContent classNameCustom="flex flex-col gap-y-4 ">
        <div className="flex justify-between">
          <InputSearch
            className="w-96"
            placeholder="Buscar médico"
            value={searchTerm}
            onChange={handleSearch}
          />

          <div className="flex items-center gap-4">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
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
        </div>

        <div className="flex flex-wrap gap-6">
          <Suspense fallback={<p>Carregando...</p>}>
            {paginatedData.map((doctor) => (
              <CardDoctor key={doctor.id} doctor={doctor} />
            ))}
          </Suspense>

          {paginatedData.length === 0 && <p>Nenhum médico encontrado.</p>}
        </div>

        <PaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePage}
        />
      </PageContent>
    </PageContainer>
  );
};
