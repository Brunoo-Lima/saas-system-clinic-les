import { LoginForm } from './_components/login-form';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignUpForm from './_components/signup-form';
import { Card, CardContent } from '@/components/ui/card';

export const LoginPage = () => {
  const [tab, setTab] = useState('login');

  useEffect(() => {
    document.title = 'Login';
  }, []);

  return (
    <div className="min-h-screen">
      <header className="h-[80px] w-full border-b-[1px] border-b-gray-500 flex items-center justify-between px-6">
        <div className="flex size-16 items-center justify-center">
          <img
            src="/logo.webp"
            alt="Logo"
            className="w-max h-max object-contain"
            loading="lazy"
          />
        </div>
      </header>

      <section
        className="flex items-center justify-center"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        <Card
          className="min-h-max sm:w-[400px]"
          style={{ width: 'calc(100% - 2rem)' }}
        >
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Criar conta</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <div className="flex flex-col pb-8">
                  <strong className="text-base font-bold">Login</strong>
                  <small className="text-sm text-gray-400">
                    Faça login para continuar
                  </small>
                </div>
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <div className="flex flex-col pb-8">
                  <strong className="text-base font-bold">Criar conta</strong>
                  <small className="text-sm text-gray-400">
                    Crie uma conta para continuar
                  </small>
                </div>

                <SignUpForm setTab={setTab} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
