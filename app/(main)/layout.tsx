import MainLayout from '@/components/layout/MainLayout'
import { WeddingProvider } from '@/components/providers/WeddingProvider'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WeddingProvider>
      <MainLayout>{children}</MainLayout>
    </WeddingProvider>
  )
}
