import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';
import { Agenda } from './_components/agenda';
import { useParams } from 'react-router-dom';
import { useGetDoctors } from '@/services/doctor-service';

export default function AgendaPage() {
  const { doctorId } = useParams<{ doctorId: string }>();

  const { data: doctors } = useGetDoctors({ id: doctorId });

  const doctor = doctors?.[0];

  const currentDoctorId = doctor?.id;

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agenda {doctor && `Dr(a). ${doctor.name}`}</PageTitle>
          <PageDescription>
            {doctor
              ? `Gerenciamento da agenda.`
              : 'Carregando informações do médico...'}
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      {doctor && <Agenda doctorId={currentDoctorId} />}
    </PageContainer>
  );
}
