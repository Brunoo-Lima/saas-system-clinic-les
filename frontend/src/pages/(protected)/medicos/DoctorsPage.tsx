import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { AddDoctorButton } from "./_components/add-doctor-button";
import { doctorsList } from "@/mocks/doctors-list";
import { CardDoctor } from "./_components/card-doctor";
import { useEffect } from "react";

export const DoctorsPage = () => {
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

      <PageContent>
        <div className="flex  flex-wrap gap-6">
          {doctorsList.map((doctor) => (
            <CardDoctor key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};
