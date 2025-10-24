'use client';

import React, { Suspense, useEffect, useMemo } from 'react';

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';

import { DatePicker } from './_components/date-picker';
import { StatsCards } from './_components/stats-cards';
import { TopDoctors } from './_components/top-doctors';
import { AppointmentNext } from './_components/appointment-next';
import { TopSpecialties } from './_components/top-specialties';

import { dailyAppointmentsData } from '@/mocks/daily-appointments-data';
import { useGetAllPatients } from '@/services/patient-service';
import { useGetDoctors } from '@/services/doctor-service';
import { useGetAppointments } from '@/services/appointment-service';

// ✅ Lazy load apenas o gráfico, que é mais pesado
const AppointmentsChart = React.lazy(
  () => import('./_components/appointments-chart'),
);

export const DashboardPage = () => {
  const { data: patients } = useGetAllPatients();
  const { data: doctors } = useGetDoctors();
  const { data: appointments } = useGetAppointments();

  // ✅ Evita re-render desnecessário
  const stats = useMemo(
    () => ({
      totalRevenue: 6000,
      totalAppointments: appointments?.length || 0,
      totalPatients: patients?.length || 0,
      totalDoctors: doctors?.length || 0,
    }),
    [appointments, patients, doctors],
  );

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  return (
    <PageContainer>
      <PageHeader className="sm:flex-row flex-col gap-y-4 justify-start items-start">
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral da sua clínica
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>

      <PageContent>
        <StatsCards {...stats} />

        <div className="grid md:grid-cols-[2.25fr_1fr] grid-cols-1 gap-4">
          <AppointmentNext appointments={appointments} />

          <TopDoctors doctors={doctors} appointments={appointments} />
        </div>

        <div className="grid md:grid-cols-[2.25fr_1fr] grid-cols-1 gap-4">
          <Suspense
            fallback={
              <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
            }
          >
            <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
          </Suspense>
          <TopSpecialties appointments={appointments} />
        </div>
      </PageContent>
    </PageContainer>
  );
};
