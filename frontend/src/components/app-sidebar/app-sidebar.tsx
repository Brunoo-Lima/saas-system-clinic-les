import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from '@/components/ui/sidebar';
import {
  CalendarDaysIcon,
  DnaIcon,
  HeartHandshakeIcon,
  LayoutDashboardIcon,
  LogOut,
  MoonIcon,
  StethoscopeIcon,
  SunIcon,
  UsersRoundIcon,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../ui/theme-provider';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/use-auth';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboardIcon,
  },

  {
    title: 'Agendamentos',
    url: '/agendamentos',
    icon: CalendarDaysIcon,
  },
  {
    title: 'Médicos',
    url: '/medicos',
    icon: StethoscopeIcon,
  },
  {
    title: 'Pacientes',
    url: '/pacientes',
    icon: UsersRoundIcon,
  },
  {
    title: 'Convênios',
    url: '/convenios',
    icon: HeartHandshakeIcon,
  },
  {
    title: 'Especialidades',
    url: '/especialidades',
    icon: DnaIcon,
  },
];

export const AppSidebar = () => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleChangeTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <img
          src="/logo.webp"
          alt="Logo"
          className="w-max h-14 object-contain"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    disabled={user?.profileCompleted === false}
                  >
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
              <DropdownMenuContent className="*:cursor-pointer">
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  Sair
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/perfil')}>
                  Perfil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
