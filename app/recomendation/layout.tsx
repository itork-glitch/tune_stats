import React from 'react';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';

interface RecomendationLayoutProps {
  children: React.ReactNode;
}

export default function RecomendationLayout({
  children,
}: RecomendationLayoutProps) {
  return (
    // SidebarProvider zapewnia kontekst dla komponentów sidebar (np. sterowanie otwieraniem/zamywaniem)
    <SidebarProvider>
      {/* Własny komponent sidebar - implementacja oparta na dokumentacji shadcn/ui */}
      <AppSidebar />
      {/* SidebarInset opakowuje treść strony, umożliwiając dostosowanie przestrzeni obok sidebara */}
      <SidebarInset>
        <header className='flex items-center gap-4 p-4 border-b'>
          {/* SidebarTrigger umożliwia przełączanie widoczności sidebara (przydatne na urządzeniach mobilnych) */}
          <SidebarTrigger className='-ml-2' />
          <h1 className='text-lg font-bold'>Dashboard</h1>
        </header>
        <main className='p-4'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
