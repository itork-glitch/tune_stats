// components/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Brain, ChartArea, Calendar, Search, Settings } from 'lucide-react';

const menuItems = [
  { url: '/dashboard', icon: Brain },
  { url: '/dashboard/inbox', icon: ChartArea },
  { url: '/dashboard/calendar', icon: Calendar },
  { url: '/dashboard/search', icon: Search },
  { url: '/dashboard/settings', icon: Settings },
];

export default function AppSidebar() {
  return (
    <Sidebar side='left' variant='sidebar' collapsible='offcanvas'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className='flex items-center gap-2'>
                      <item.icon />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
