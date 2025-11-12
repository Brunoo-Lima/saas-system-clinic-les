import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';

import { Suspense, useEffect, useState } from 'react';
import { PaginationComponent } from '@/components/pagination-component';
import { useAppointment } from '@/hooks/use-appointment';
import { CardRequest } from './card-request';
import { ChevronLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUpdateAppointment } from '@/services/appointment-service';
import { ModalConfirmation } from './modal-confirmation';

export default function RequestsPage() {
  const { paginatedData, page, totalPages, handlePage } = useAppointment();
  const navigate = useNavigate();
  const { mutate, isPending } = useUpdateAppointment();

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = paginatedData?.filter(
    (ap) => ap.status === 'CANCEL_PENDING',
  );

  useEffect(() => {
    document.title = 'Solicitações';
  }, []);

  const handleOpenConfirm = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    mutate({
      id: selectedId,
      appointment: { status: 'CANCELED' },
    });
    setOpen(false);
    setSelectedId(null);
  };

  const handleRecuse = async (id: string) => {
    mutate({
      id,
      appointment: { status: 'PENDING' },
    });
  };

  return (
    <PageContainer>
      <PageHeader className="gap-x-4">
        <Button
          onClick={() => navigate('/agendamentos')}
          type="button"
          variant="outline"
        >
          <ChevronLeftIcon size={32} />
        </Button>
        <PageHeaderContent>
          <PageTitle>Solicitações de cancelamento de agendamentos</PageTitle>
          <PageDescription>
            Gerencie as solicitações de cancelamento
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-wrap gap-6 flex-1">
            <Suspense fallback={<p>Carregando...</p>}>
              {filtered?.map((appointment) => (
                <CardRequest
                  key={appointment.id}
                  appointment={appointment}
                  onOpenConfirmModal={() => handleOpenConfirm(appointment.id)}
                  onRecuse={() => handleRecuse(appointment.id)} // 🔹 recusa direto
                  isPending={isPending}
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

      <ModalConfirmation
        open={open}
        setOpen={setOpen}
        isPending={isPending}
        handleConfirm={handleConfirm}
      />
    </PageContainer>
  );
}
