import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import { useLocation, Outlet } from "react-router-dom";
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
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Ticket,
  FolderOpen,
  User,
  Building2,
  Users,
  LogOut,
  BarChart3,
} from "lucide-react";
import logoSbi from "@/assets/logo-solutionsinbi-3-sidebar.png";
import iconeSbi from "@/assets/icone-solutionsinbi.png";

const clientMenu = [
  { title: "Dashboard", url: "/portal", icon: LayoutDashboard },
  { title: "Serviços", url: "/portal/servicos", icon: BarChart3 },
  { title: "Chamados", url: "/portal/chamados", icon: Ticket },
  { title: "Documentos", url: "/portal/documentos", icon: FolderOpen },
  { title: "Perfil", url: "/portal/perfil", icon: User },
];

const adminMenu = [
  { title: "Serviços", url: "/portal/admin/servicos", icon: BarChart3 },
  { title: "Empresas", url: "/portal/admin/empresas", icon: Building2 },
  { title: "Usuários", url: "/portal/admin/usuarios", icon: Users },
];



function PortalSidebar() {
  const { isAdmin, signOut, profile } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) =>
    path === "/portal"
      ? location.pathname === "/portal"
      : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center p-2">
        <img
          src={collapsed ? iconeSbi : logoSbi}
          alt="Solutions in BI"
          className={collapsed ? "h-6 w-6 object-contain" : "h-20 w-auto"}
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clientMenu.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end={item.url === "/portal"}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenu.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>

      <SidebarFooter>
        {!collapsed && (
          <p className="text-xs text-muted-foreground truncate px-2">
            {profile?.full_name || profile?.email}
          </p>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              tooltip="Sair"
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function PortalLayout({ children }: { children?: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PortalSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 bg-background">
            <SidebarTrigger className="mr-4" />
            <h2 className="font-display font-semibold text-foreground">Portal do Cliente</h2>
          </header>
          <main className="flex-1 p-6 bg-muted/30">{children ?? <Outlet />}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
