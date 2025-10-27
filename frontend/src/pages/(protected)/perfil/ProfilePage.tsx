import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';
import { Row } from '@/components/ui/row';
import { SaveIcon, SquarePenIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonChangePassword } from './_components/button-change-password';
import { useGetClinic } from '@/services/clinic-service';

export default function ProfilePage() {
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [isEditingData, setIsEditingData] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useGetClinic();

  const [formData, setFormData] = useState({
    name: data?.name,
    phone: data?.phone,
    email: data?.user.email,
    cnpj: data?.cnpj,
    address: {
      cep: data?.address?.cep || '',
      name: data?.address?.name,
      street: data?.address?.street || '',
      number: data?.address?.number || '',
      neighborhood: data?.address?.neighborhood || '',
      city: data?.address?.city || '',
      state: data?.address?.state || '',
      country: data?.address?.country || '',
      uf: data?.address?.uf || '',
    },
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        email: data.user?.email || '',
        cnpj: data.cnpj || '',
        address: {
          cep: data.address?.cep || '',
          name: data?.address?.name,
          street: data.address?.street || '',
          number: data.address?.number || '',
          neighborhood: data.address?.neighborhood || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          country: data.address?.country || '',
          uf: data.address?.uf || '',
        },
      });
    }
  }, [data]);

  useEffect(() => {
    document.title = 'Perfil';
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Meu perfil</PageTitle>
            <PageDescription>Carregando...</PageDescription>
          </PageHeaderContent>
        </PageHeader>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Meu perfil</PageTitle>
          <PageDescription>Informações da sua conta</PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent classNameCustom="flex flex-col gap-4">
        <div className="mx-auto">
          <div className="w-32 h-32 rounded-full border-2 border-border overflow-hidden">
            <img
              src={previewImage ? previewImage : '/logo.webp'}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex items-center justify-center gap-2 mt-2">
            <label className="text-sm text-muted-foreground cursor-pointer hover:opacity-80">
              Alterar foto de perfil
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) =>
                  setPreviewImage(URL.createObjectURL(e.target.files![0]))
                }
                hidden
              />
            </label>
          </div>
        </div>

        <div className="lg:min-w-[600px] min-w-full max-w-[800px] mx-auto space-y-10">
          <div className="flex flex-col gap-4 dark:bg-sidebar rounded-md py-4 px-6 border border-border">
            <strong>Informações pessoais</strong>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <Row>
                <Label>Nome</Label>
                <Input
                  placeholder="Nome da clinica"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditingData}
                />
              </Row>

              <Row>
                <Label>Email</Label>
                <Input
                  placeholder="clinica@example.com"
                  disabled={!isEditingData}
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Row>

              <Row>
                <Label>Telefone</Label>
                <Input
                  placeholder="(11) 99999-9999"
                  disabled={!isEditingData}
                  value={data?.phone}
                />
              </Row>

              <div className="flex md:items-end items-start md:flex-row flex-col gap-4">
                <Row>
                  <Label>Senha</Label>
                  <Input type="password" placeholder="Senha" disabled />
                </Row>

                <ButtonChangePassword />
              </div>
            </div>

            <div className="flex md:flex-row flex-col items-center gap-4 mt-4">
              <Button
                variant="default"
                className="w-[190px]"
                onClick={() => setIsEditingData(!isEditingData)}
                disabled={!!isEditingData}
              >
                <SquarePenIcon /> Editar dados
              </Button>

              {!!isEditingData && (
                <Button
                  variant="secondary"
                  className="w-[190px] bg-green-500 text-green-100 dark:bg-green-600 dark:text-green-200 hover:bg-green-500"
                  onClick={() => setIsEditingData(!isEditingData)}
                >
                  <SaveIcon /> Salvar dados
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 dark:bg-sidebar rounded-md py-4 px-6 border border-border">
            <strong>Endereço</strong>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <Row variant="row" className="grid-cols-1">
                <Row>
                  <Label>CEP</Label>
                  <Input
                    placeholder="00000-000"
                    disabled={!isEditingAddress}
                    value={formData.address?.cep}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          cep: e.target.value,
                        },
                      })
                    }
                  />
                </Row>

                <Row>
                  <Label>Número</Label>
                  <Input
                    placeholder="120"
                    disabled={!isEditingAddress}
                    value={formData.address?.number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          number: e.target.value,
                        },
                      })
                    }
                  />
                </Row>
              </Row>

              <Row>
                <Label>Rua</Label>
                <Input
                  placeholder="Rua dos Bobos"
                  disabled={!isEditingAddress}
                  value={formData.address?.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        street: e.target.value,
                      },
                    })
                  }
                />
              </Row>

              <Row>
                <Label>Bairro</Label>
                <Input
                  placeholder="Bairro"
                  disabled={!isEditingAddress}
                  value={formData.address?.neighborhood}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        neighborhood: e.target.value,
                      },
                    })
                  }
                />
              </Row>
              <Row>
                <Label>Nome/identificação do endereço</Label>
                <Input
                  placeholder="Casa"
                  disabled={!isEditingAddress}
                  value={formData.address?.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        name: e.target.value,
                      },
                    })
                  }
                />
              </Row>

              <Row variant="row">
                <Row>
                  <Label>Cidade</Label>
                  <Input
                    placeholder="São Paulo"
                    disabled={!isEditingAddress}
                    value={formData.address?.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          city: e.target.value,
                        },
                      })
                    }
                  />
                </Row>

                <Row>
                  <Label>Estado/UF</Label>
                  <Input
                    placeholder="SP"
                    disabled={!isEditingAddress}
                    value={formData.address?.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          state: e.target.value,
                        },
                      })
                    }
                  />
                </Row>
              </Row>

              <Row variant="row">
                <Row>
                  <Label>País</Label>
                  <Input
                    placeholder="Brasil"
                    disabled={!isEditingAddress}
                    value={formData.address?.country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          country: e.target.value,
                        },
                      })
                    }
                  />
                </Row>
              </Row>
            </div>

            <div className="flex md:flex-row flex-col items-center gap-4 mt-4">
              <Button
                variant="default"
                className="w-[190px]"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                disabled={!!isEditingAddress}
              >
                <SquarePenIcon /> Editar
              </Button>

              {!!isEditingAddress && (
                <Button
                  variant="secondary"
                  className="w-[190px] bg-green-500 text-green-100 dark:bg-green-600 dark:text-green-200 hover:bg-green-500"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                >
                  <SaveIcon /> Salvar
                </Button>
              )}
            </div>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
}
