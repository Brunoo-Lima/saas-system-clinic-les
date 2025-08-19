import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { Row } from "@/components/ui/row";
import { SaveIcon, SquarePenIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ProfilePage() {
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [isEditingData, setIsEditingData] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    document.title = "Perfil";
  }, []);

  const handleChangeFile = () => {
    fileInputRef.current?.click();
  };

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
              src={previewImage ? previewImage : "/logo.png"}
              alt=""
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
                <Input placeholder="Clinica" disabled={!isEditingData} />
              </Row>

              <Row>
                <Label>Email</Label>
                <Input
                  placeholder="clinica@example.com"
                  disabled={!isEditingData}
                />
              </Row>

              <Row>
                <Label>Telefone</Label>
                <Input
                  placeholder="(11) 99999-9999"
                  disabled={!isEditingData}
                />
              </Row>

              <div className="flex md:items-end items-start md:flex-row flex-col gap-4">
                <Row>
                  <Label>Senha</Label>
                  <Input type="password" placeholder="Senha" />
                </Row>

                <Button>Alterar senha</Button>
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
                  <Input placeholder="00000-000" disabled={!isEditingAddress} />
                </Row>

                <Row>
                  <Label>Número</Label>
                  <Input placeholder="120" disabled={!isEditingAddress} />
                </Row>
              </Row>

              <Row>
                <Label>Rua</Label>
                <Input
                  placeholder="Rua dos Bobos"
                  disabled={!isEditingAddress}
                />
              </Row>

              <Row>
                <Label>Bairro</Label>
                <Input placeholder="Bairro" disabled={!isEditingAddress} />
              </Row>

              <Row variant="row">
                <Row>
                  <Label>Cidade</Label>
                  <Input placeholder="São Paulo" disabled={!isEditingAddress} />
                </Row>

                <Row>
                  <Label>Estado/UF</Label>
                  <Input placeholder="SP" disabled={!isEditingAddress} />
                </Row>
              </Row>

              <Row variant="row">
                <Row>
                  <Label>País</Label>
                  <Input placeholder="Brasil" disabled={!isEditingAddress} />
                </Row>

                <Row>
                  <Label>Complemento</Label>
                  <Input
                    placeholder="Complemento"
                    disabled={!isEditingAddress}
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
