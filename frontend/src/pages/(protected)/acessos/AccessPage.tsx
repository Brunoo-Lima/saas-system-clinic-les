import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { useEffect } from "react";
import { AccountAppForm } from "./_components/account-app-form";

export const AccessPage = () => {
  useEffect(() => {
    document.title = "Criar Acessos";
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Contas de acesso ao App Mobile</PageTitle>
          <PageDescription>
            Gerenciar as contas de acesso ao App Mobile
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent classNameCustom="w-[900px] mx-auto pt-8">
        <AccountAppForm />
      </PageContent>
    </PageContainer>
  );
};
