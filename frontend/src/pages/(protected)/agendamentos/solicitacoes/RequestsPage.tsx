import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';

import { Suspense, useEffect } from 'react';
import { PaginationComponent } from '@/components/pagination-component';
import { useAppointment } from '@/hooks/use-appointment';
import { useGetDoctors } from '@/services/doctor-service';
import { CardAppointment } from '../_components/card-appointment';

export default function RequestsPage() {
  const { paginatedData, page, totalPages, handlePage } = useAppointment();

  const { data: doctors } = useGetDoctors();

  const filtered = paginatedData?.filter(
    (ap) => ap.status === 'CANCEL_PENDING',
  );

  useEffect(() => {
    document.title = 'Solicitações';
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Solicitações de agendamentos</PageTitle>
          <PageDescription>
            Gerencie as solicitações de agendamentos
          </PageDescription>
        </PageHeaderContent>
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

            {filtered?.length === 0 && <p>Nenhuma solicitação encontrada.</p>}
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
