import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { DatePicker } from "./_components/date-picker";
import { StatsCards } from "./_components/stats-cards";
import { AppointmentsChart } from "./_components/appointments-chart";
import { TopDoctors } from "./_components/top-doctors";
import { AppointmentToday } from "./_components/appointment-today";
import { TopSpecialties } from "./_components/top-specialties";
import { topDoctors } from "@/mocks/top-doctors";
import { doctorsList } from "@/mocks/doctors-list";
import { patientsList } from "@/mocks/patients-list";
import { appointmentList } from "@/mocks/appointment-list";
import { topSpecialties } from "@/mocks/top-specialties";
import { dailyAppointmentsData } from "@/mocks/daily-appointments-data";

export const DashboardPage = () => {
  return (
    <PageContainer>
      <PageHeader className="sm:flex-row flex-col gap-y-4 justify-start items-start">
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral da sua clinica
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>

      <PageContent>
        <StatsCards
          totalRevenue={6000}
          totalAppointments={appointmentList.length}
          totalPatients={patientsList.length}
          totalDoctors={doctorsList.length}
        />

        <div className="grid md:grid-cols-[2.25fr_1fr] grid-cols-1 gap-4">
          <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctors doctors={topDoctors} />
        </div>
        <div className="grid md:grid-cols-[2.25fr_1fr] grid-cols-1 gap-4">
          <AppointmentToday />
          <TopSpecialties topSpecialties={topSpecialties} />
        </div>
      </PageContent>
    </PageContainer>
  );
};
