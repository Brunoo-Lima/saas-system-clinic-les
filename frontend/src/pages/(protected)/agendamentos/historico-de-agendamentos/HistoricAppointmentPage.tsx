import { Button } from '@/components/ui/button';
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGetAppointments } from '@/services/appointment-service';
import {
  BookCheckIcon,
  BookXIcon,
  ChevronLeftIcon,
  ClipboardClockIcon,
  ReceiptTextIcon,
} from 'lucide-react';
import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllAppointments = React.lazy(
  () => import('./_components/all-appointments'),
);
const ScheduledAppointments = React.lazy(
  () => import('./_components/scheduled-appointments'),
);
const FinishedAppointments = React.lazy(
  () => import('./_components/finished-appointments'),
);
const CanceledAppointments = React.lazy(
  () => import('./_components/canceled-appointments'),
);

export default function HistoricAppointmentPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const { data: appointments } = useGetAppointments();

  useEffect(() => {
    document.title = 'Histórico de agendamentos';
  }, []);

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
          <PageTitle>Histórico de agendamentos</PageTitle>
          <PageDescription>
            Histórico de agendamentos da clínica
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 *:cursor-pointer p-0">
            <TabsTrigger value="all">
              <ReceiptTextIcon /> {!isMobile && 'Todos'}
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <ClipboardClockIcon /> {!isMobile && 'Agendadas'}
            </TabsTrigger>
            <TabsTrigger value="finished">
              <BookCheckIcon /> {!isMobile && 'Realizadas'}
            </TabsTrigger>
            <TabsTrigger value="canceled">
              <BookXIcon /> {!isMobile && 'Canceladas'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {activeTab === 'all' && (
              <Suspense fallback={<p>Carregando...</p>}>
                <AllAppointments appointments={appointments} />
              </Suspense>
            )}
          </TabsContent>

          <TabsContent value="scheduled">
            {activeTab === 'scheduled' && (
              <Suspense fallback={<p>Carregando...</p>}>
                <ScheduledAppointments appointments={appointments} />
              </Suspense>
            )}
          </TabsContent>

          <TabsContent value="finished">
            {activeTab === 'finished' && (
              <Suspense fallback={<p>Carregando...</p>}>
                <FinishedAppointments appointments={appointments} />
              </Suspense>
            )}
          </TabsContent>

          <TabsContent value="canceled">
            {activeTab === 'canceled' && (
              <Suspense fallback={<p>Carregando...</p>}>
                <CanceledAppointments appointments={appointments} />
              </Suspense>
            )}
          </TabsContent>
        </Tabs>
      </PageContent>
    </PageContainer>
  );
}
