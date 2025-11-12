import { DefaultLayout } from '@/components/default-layout/default-layout';
import AgendaPage from '@/pages/(protected)/agenda/AgendaPage';
import AppointmentPage from '@/pages/(protected)/agendamentos/AppointmentPage';
import HistoricAppointmentPage from '@/pages/(protected)/agendamentos/historico-de-agendamentos/HistoricAppointmentPage';
import RequestsPage from '@/pages/(protected)/agendamentos/solicitacoes/RequestsPage';
import { ProfileCompletePage } from '@/pages/(protected)/completar-perfil/ProfileCompletePage';
import { InsurancePage } from '@/pages/(protected)/convenios/InsurancePage';
import { DashboardPage } from '@/pages/(protected)/dashboard/DashboardPage';
import SpecialtiesPage from '@/pages/(protected)/especialidades/SpecialtiesPage';
import { DoctorsPage } from '@/pages/(protected)/medicos/DoctorsPage';
import { PatientsPage } from '@/pages/(protected)/pacientes/PatientsPage';
import ProfilePage from '@/pages/(protected)/perfil/ProfilePage';
import { LoginPage } from '@/pages/(public)/LoginPage';
import { Route, Routes } from 'react-router-dom';

export function AppRouter() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/" element={<LoginPage />} />

      {/* Rotas protegidas */}
      <Route element={<DefaultLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/agendamentos" element={<AppointmentPage />} />
        <Route
          path="/agendamentos/historico-de-agendamentos"
          element={<HistoricAppointmentPage />}
        />
        <Route path="/agendamentos/solicitacoes" element={<RequestsPage />} />
        <Route path="/medicos" element={<DoctorsPage />} />
        <Route path="/agenda/medico/:doctorId" element={<AgendaPage />} />

        <Route path="/pacientes" element={<PatientsPage />} />
        <Route path="/convenios" element={<InsurancePage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/completar-perfil" element={<ProfileCompletePage />} />
        <Route path="/especialidades" element={<SpecialtiesPage />} />
      </Route>
    </Routes>
  );
}
