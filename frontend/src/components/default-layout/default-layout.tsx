import { Outlet } from "react-router-dom";
import { AppSidebar } from "../app-sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

export const DefaultLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
