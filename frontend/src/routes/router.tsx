import { DefaultLayout } from "@/components/default-layout/default-layout";
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
      //     {
      //       path: '/dashboard',
      //       element: <DashboardPage />,
      //     },
      //     {
      //       path: '/alunos',
      //       element: <StudentsPage />,
      //     },
      //     {
      //       path: '/agendamentos',
      //       element: <AppointmentsPage />,
      //     },
    ],
  },
]);
