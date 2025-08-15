import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CalendarDays, LayoutDashboard, LogOut, UsersIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Alunos",
    url: "/alunos",
    icon: UsersIcon,
  },
  {
    title: "Agendamentos",
    url: "/agendamentos",
    icon: CalendarDays,
  },
];

export const AppSidebar = () => {
  // const router = useRouter();
  // const session = authClient.useSession();
  // const pathname = usePathname();

  const handleSignOut = async () => {
    // await authClient.signOut({
    //   fetchOptions: { onSuccess: () => router.push("/login") },
    // });
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        {/* <img src="/logo.svg" alt="Logo" className="w-[136px] h-7" /> */}
        Logo
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <SidebarGroup>
          <SidebarGroupLabel>Outros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/assinatura">
                    <GemIcon />
                    <span>Assinatura</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar>
                    <AvatarFallback>B</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      {/* {session.data?.user?.clinic?.name} */}
                      Clínica
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {/* {session.data?.user.email} */}
                      Bruno
                    </p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
