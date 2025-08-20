import { Building2, Calendar, Home, Settings, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

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
  SidebarSeparator,
} from '@/components/ui/sidebar'

// Menu items
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Propriedades',
    url: '/properties',
    icon: Building2,
  },
  {
    title: 'Inquilinos',
    url: '/tenants',
    icon: Users,
  },
  {
    title: 'Aluguéis',
    url: '/rentals',
    icon: Calendar,
  },
  // {
  //   title: 'Relatórios',
  //   url: '/reports',
  //   icon: Inbox,
  // },
  // {
  //   title: 'Pesquisar',
  //   url: '/search',
  //   icon: Search,
  // },
]

const settingsItems = [
  {
    title: 'Configurações',
    url: '/settings',
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-border border-b p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-purple-600" />
          <span className="font-semibold text-lg text-purple-700">
            RentHouse
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-border border-t p-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
            <span className="font-medium text-purple-600">U</span>
          </div>
          <div>
            <p className="font-medium">Usuário</p>
            <p className="text-gray-500 text-xs">usuario@email.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
