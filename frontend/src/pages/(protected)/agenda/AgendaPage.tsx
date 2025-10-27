import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';
import { Agenda } from './_components/agenda';
import { useParams } from 'react-router-dom';
import { useGetDoctorById } from '@/services/doctor-service';

export default function AgendaPage() {
  const { doctorId } = useParams<{ doctorId: string }>();

  const { data: doctor } = useGetDoctorById(doctorId);

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

      {doctor && <Agenda doctor={doctor} doctorId={doctorId} />}
    </PageContainer>
  );
}
