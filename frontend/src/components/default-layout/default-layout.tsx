import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../app-sidebar/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import AuthProvider from '@/hooks/use-auth';

export const DefaultLayout = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />

        <main className="w-full">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
};
