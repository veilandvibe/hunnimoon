import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import MobileHeader from './MobileHeader'

export default function MainLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileHeader title={title} />
      
      <main className="md:ml-[69px] pb-20 md:pb-8">
        <div className="min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-32px)] rounded-t-[24px] bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to p-4 md:p-8">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
