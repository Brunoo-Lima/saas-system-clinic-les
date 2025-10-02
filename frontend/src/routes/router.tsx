import { DefaultLayout } from '@/components/default-layout/default-layout';
import AppointmentPage from '@/pages/(protected)/agendamentos/AppointmentPage';
import HistoricAppointmentPage from '@/pages/(protected)/agendamentos/historico-de-agendamentos/HistoricAppointmentPage';
import { InsurancePage } from '@/pages/(protected)/convenios/InsurancePage';
import { DashboardPage } from '@/pages/(protected)/dashboard/DashboardPage';
import SpecialtiesPage from '@/pages/(protected)/especialidades/SpecialtiesPage';
import { DoctorsPage } from '@/pages/(protected)/medicos/DoctorsPage';
import { PatientsPage } from '@/pages/(protected)/pacientes/PatientsPage';
import ProfilePage from '@/pages/(protected)/perfil/ProfilePage';
import { LoginPage } from '@/pages/(public)/LoginPage';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/agendamentos',
        element: <AppointmentPage />,
      },
      {
        path: '/medicos',
        element: <DoctorsPage />,
      },
      {
        path: 'pacientes',
        element: <PatientsPage />,
      },
      {
        path: '/convenios',
        element: <InsurancePage />,
      },
      {
        path: '/agendamentos/historico-de-agendamentos',
        element: <HistoricAppointmentPage />,
      },
      {
        path: '/perfil',
        element: <ProfilePage />,
      },
      {
        path: '/especialidades',
        element: <SpecialtiesPage />,
      },
    ],
  },
]);
