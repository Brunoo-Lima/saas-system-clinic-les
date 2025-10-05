import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';
import { FormCompleteProfile } from './_components/form-complete-profile';

export const ProfileCompletePage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Completar perfil</PageTitle>
          <PageDescription>
            Preencha seus dados para completar seu perfil
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <FormCompleteProfile />
    </PageContainer>
  );
};
