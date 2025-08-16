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
import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LogOut,
  MoonIcon,
  StethoscopeIcon,
  SunIcon,
  UsersRoundIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../ui/theme-provider";
import { Button } from "../ui/button";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },

  {
    title: "Agendamentos",
    url: "/agendamentos",
    icon: CalendarDaysIcon,
  },
  {
    title: "Médicos",
    url: "/medicos",
    icon: StethoscopeIcon,
  },
  {
    title: "Pacientes",
    url: "/pacientes",
    icon: UsersRoundIcon,
  },
];

export const AppSidebar = () => {
  const { setTheme, theme } = useTheme();
  // const router = useRouter();
  // const session = authClient.useSession();
  // const pathname = usePathname();

  const handleSignOut = async () => {
    // await authClient.signOut({
    //   fetchOptions: { onSuccess: () => router.push("/login") },
    // });
  };

  const handleChangeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <img src="/logo.png" alt="Logo" className="w-max h-12 object-contain" />
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

        <SidebarGroup>
          <SidebarGroupLabel>Outros</SidebarGroupLabel>
          <SidebarGroupContent className="ml-2">
            <Button variant="outline" size="icon" onClick={handleChangeTheme}>
              <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
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
