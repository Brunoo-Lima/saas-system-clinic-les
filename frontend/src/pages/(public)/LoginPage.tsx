import { LoginForm } from './_components/login-form';
import { useEffect } from 'react';

export const LoginPage = () => {
  useEffect(() => {
    document.title = 'Login';
  }, []);

  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <LoginForm />
    </section>
  );
};
