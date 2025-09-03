import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormInputCustom from "@/components/ui/form-custom/form-input-custom";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsList } from "@/mocks/doctors-list";
import { patientsList } from "@/mocks/patients-list";
import {
  registerFormSchema,
  type RegisterFormSchema,
} from "@/validations/signup-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const AccountAppForm = () => {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "patient",
    },
  });

  const [selectedTypeUser, setSelectedTypeUser] = useState<
    "doctor" | "patient"
  >("patient");

  const handleNewPasswordRandom = (length: number = 8) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    form.setValue("password", password, { shouldValidate: true });
  };

  const onSubmit = (data: RegisterFormSchema) => {
    console.log(data);
    form.reset();
    toast.success("Conta criada com sucesso. Verifique seu email.");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 border-[1px] border-border p-8 rounded-md"
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de usuário</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedTypeUser(value as "doctor" | "patient");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="patient">Paciente</SelectItem>
                  <SelectItem value="doctor">Médico</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedTypeUser === "patient" ? (
          <Select>
            <Label>Paciente</Label>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o paciente" />
            </SelectTrigger>
            <SelectContent>
              {patientsList.map((patient) => (
                <SelectItem key={patient.id} value={patient.name}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Select>
            <Label>Médico</Label>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o médico" />
            </SelectTrigger>
            <SelectContent>
              {doctorsList.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.name}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <FormInputCustom
          name="name"
          label="Nome"
          placeholder="Digite seu nome"
          control={form.control}
        />
        <FormInputCustom
          name="email"
          label="Email"
          placeholder="Digite seu email"
          control={form.control}
        />

        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <InputPassword {...field} placeholder="Digite sua senha" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <p className="text-sm">Gerar senha aleatória: </p>
            <Button
              className="size-8"
              variant={"ghost"}
              type="button"
              onClick={() => handleNewPasswordRandom()}
            >
              <RefreshCcwIcon />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Atenção: A senha gerada será enviada para o email cadastrado e será
          usada para primeiro acesso, recomendamos alterar a senha
          posteriormente!
        </p>

        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
};
