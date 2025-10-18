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
import { HistoryIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardAppointment } from './_components/card-appointment';
import { PaginationComponent } from '@/components/pagination-component';
import { useAppointment } from '@/hooks/use-appointment';

export default function AppointmentPage() {
  const { paginatedData, page, totalPages, handlePage } = useAppointment();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Agendamentos';
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddAppointmentButton patients={[]} doctors={[]} />
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
              {paginatedData?.map((doctor) => (
                <CardAppointment key={doctor.id} appointment={doctor} />
              ))}
            </Suspense>

            {paginatedData?.length === 0 && (
              <p>Nenhum agendamento encontrado.</p>
            )}
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
