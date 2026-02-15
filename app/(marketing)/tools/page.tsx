import Link from 'next/link'
import { Metadata } from 'next'
import { getAllTools } from '@/lib/tools-data'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Free Wedding Planning Tools | Hunnimoon',
  description: 'Free wedding planning tools to help you plan your wedding. No signup required, use them as much as you want.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Free Wedding Planning Tools | Hunnimoon',
    description: 'Free wedding planning tools to help you plan your wedding. No signup required, use them as much as you want.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://hunnimoon.app'}/tools`,
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
    title: 'Free Wedding Planning Tools | Hunnimoon',
    description: 'Free wedding planning tools to help you plan your wedding. No signup required, use them as much as you want.',
    images: ['/Social Preview.png'],
  },
}

export default function ToolsPage() {
  const tools = getAllTools()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-pink-primary mb-4">
          Free Wedding Planning Tools
        </h1>
        <p className="text-lg text-pink-primary/70 max-w-2xl mx-auto">
          Free tools to help you plan your wedding. No signup required, use them as much as you want.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div 
            key={tool.slug}
            className="bg-white rounded-2xl p-6 border-2 border-pink-primary/10 hover:border-pink-primary/30 transition-all hover:shadow-lg"
          >
            {/* Tool Image */}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-4">
              <img 
                src={tool.image} 
                alt={tool.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-pink-light text-pink-primary text-xs font-medium rounded-full mb-3">
              {tool.category}
            </span>

            {/* Tool Info */}
            <h2 className="text-xl font-bold text-pink-primary mb-2">
              {tool.name}
            </h2>
            <p className="text-pink-primary/70 text-sm mb-4">
              {tool.description}
            </p>

            {/* CTA */}
            <Link href={`/tools/${tool.slug}`}>
              <Button variant="outline" fullWidth>
                Try Tool
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
