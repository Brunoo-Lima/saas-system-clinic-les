import { DefaultLayout } from "@/components/default-layout/default-layout";
import AppointmentPage from "@/pages/(protected)/agendamentos/AppointmentPage";
import HistoricAppointmentPage from "@/pages/(protected)/agendamentos/historico-de-agendamentos/HistoricAppointmentPage";
import { AgreementsPage } from "@/pages/(protected)/convenios/AgreementsPage";
import { DashboardPage } from "@/pages/(protected)/dashboard/DashboardPage";
import SpecialtiesPage from "@/pages/(protected)/especialidades/SpecialtiesPage";
import HistoricPage from "@/pages/(protected)/historico/HistoricPage";
import { DoctorsPage } from "@/pages/(protected)/medicos/DoctorsPage";
import { PatientsPage } from "@/pages/(protected)/pacientes/PatientsPage";
import ProfilePage from "@/pages/(protected)/perfil/ProfilePage";
import { LoginPage } from "@/pages/(public)/LoginPage";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    index: true,
  },
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "agendamentos",
        element: <AppointmentPage />,
      },
      {
        path: "medicos",
        element: <DoctorsPage />,
      },
      {
        path: "pacientes",
        element: <PatientsPage />,
      },
      {
        path: "convenios",
        element: <AgreementsPage />,
      },
      {
        path: "historico",
        element: <HistoricPage />,
      },
      {
        path: "agendamentos/historico",
        element: <HistoricAppointmentPage />,
      },
      {
        path: "perfil",
        element: <ProfilePage />,
      },
      {
        path: "especialidades",
        element: <SpecialtiesPage />,
      },
    ],
  },
]);
