import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';
import { Agenda } from './_components/agenda';

export default function AgendaPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agenda</PageTitle>
          <PageDescription>Gerencie a agenda do médico tal</PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <Agenda />
    </PageContainer>
  );
}
