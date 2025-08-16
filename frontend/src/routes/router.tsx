import { DefaultLayout } from "@/components/default-layout/default-layout";
import AppointmentPage from "@/pages/(protected)/agendamentos/AppointmentPage";
import HistoricAppointmentPage from "@/pages/(protected)/agendamentos/historico-de-agendamentos/HistoricAppointmentPage";
import { DashboardPage } from "@/pages/(protected)/dashboard/DashboardPage";
import HistoricPage from "@/pages/(protected)/historico/HistoricPage";
import { DoctorsPage } from "@/pages/(protected)/medicos/DoctorsPage";
import { PatientsPage } from "@/pages/(protected)/pacientes/PatientsPage";
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
        path: "historico",
        element: <HistoricPage />,
      },
      {
        path: "agendamentos/historico",
        element: <HistoricAppointmentPage />,
      },
    ],
  },
]);
