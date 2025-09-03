import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./_components/login-form";
import { useEffect } from "react";

export const LoginPage = () => {
  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <Card className="w-[400px] h-max">
        <CardHeader className="flex flex-col gap-2 items-center justify-center">
          <div className="h-28 w-28">
            <img
              src="/logo.webp"
              alt="Logo"
              className="w-max h-max object-contain mx-auto"
            />
          </div>

          <CardTitle>Login</CardTitle>
          <CardDescription>Faça login para entrar no sistema.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <LoginForm />
        </CardContent>
      </Card>
    </section>
  );
};
