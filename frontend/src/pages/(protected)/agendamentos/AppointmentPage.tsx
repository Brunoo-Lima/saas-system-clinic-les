import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';
import { AddAppointmentButton } from './_components/actions/add-appointment-button';
import { Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HistoryIcon, RectangleEllipsisIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardAppointment } from './_components/card-appointment';
import { PaginationComponent } from '@/components/pagination-component';
import { useAppointment } from '@/hooks/use-appointment';
import { useGetDoctors } from '@/services/doctor-service';

export default function AppointmentPage() {
  const { paginatedData, page, totalPages, handlePage } = useAppointment();
  const navigate = useNavigate();

  const { data: doctors } = useGetDoctors();

  const filtered = paginatedData?.filter(
    (ap) => ap.status !== 'CANCEL_PENDING',
  );

  useEffect(() => {
    document.title = 'Agendamentos';
  }, []);

  return (
    <PageContainer>
      <PageHeader className="header__custom__appointment gap-x-3">
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>

        <PageActions className="md:flex-nowrap flex-wrap md:items-end items-start">
          <AddAppointmentButton doctors={doctors} />
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/agendamentos/solicitacoes')}
          >
            <RectangleEllipsisIcon /> Solicitações
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/agendamentos/historico-de-agendamentos')}
          >
            <HistoryIcon /> Histórico de agendamentos
          </Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-wrap gap-6 flex-1">
            <Suspense fallback={<p>Carregando...</p>}>
              {filtered?.map((appointment) => (
                <CardAppointment
                  key={appointment.id}
                  appointment={appointment}
                  doctors={doctors}
                />
              ))}
            </Suspense>

            {filtered?.length === 0 && <p>Nenhum agendamento encontrado.</p>}
          </div>

          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePage}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
}
