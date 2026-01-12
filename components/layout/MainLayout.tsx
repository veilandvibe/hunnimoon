'use client'

import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import MobileHeader from './MobileHeader'
import PageTransition from './PageTransition'
import { SidebarProvider, useSidebar } from './SidebarContext'

function MainLayoutContent({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  const { isExpanded } = useSidebar()

  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileHeader title={title} />
      
      <main 
        className={`pb-20 md:pb-8 transition-[margin] duration-300 ease-out ${
          isExpanded ? 'md:ml-[240px]' : 'md:ml-[69px]'
        }`}
      >
        <div className="min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-32px)] rounded-t-[24px] bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to p-4 md:p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default function MainLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <SidebarProvider>
      <MainLayoutContent title={title}>
        {children}
      </MainLayoutContent>
    </SidebarProvider>
  )
}
