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
    images: [
      {
        url: '/Social Preview.png',
        width: 1200,
        height: 630,
        alt: 'Hunnimoon Wedding Planning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | Hunnimoon',
    description: 'Simple, transparent pricing for Hunnimoon. Start with a 7-day free trial. Choose monthly or yearly plans.',
    images: ['/Social Preview.png'],
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
