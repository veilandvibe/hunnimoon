import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | Hunnimoon',
  description: 'Simple, transparent pricing for Hunnimoon. Start with a 7-day free trial. Choose monthly or yearly plans.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Pricing | Hunnimoon',
    description: 'Simple, transparent pricing for Hunnimoon. Start with a 7-day free trial. Choose monthly or yearly plans.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://hunnimoon.app'}/pricing`,
  }
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
