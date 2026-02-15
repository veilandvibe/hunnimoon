import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { getToolBySlug, getAllTools } from '@/lib/tools-data'
import Breadcrumbs from '@/components/marketing/Breadcrumbs'
import CTABlock from '@/components/marketing/CTABlock'
import ToolSlider from '@/components/marketing/ToolSlider'
import Button from '@/components/ui/Button'
import WeddingTimelineGenerator from '@/components/tools/WeddingTimelineGenerator'
import WeddingDayTimelineGenerator from '@/components/tools/WeddingDayTimelineGenerator'
import WeddingReceptionTimelineGenerator from '@/components/tools/WeddingReceptionTimelineGenerator'
import WeddingVowsWriter from '@/components/tools/WeddingVowsWriter'
import WeddingHashtagsGenerator from '@/components/tools/WeddingHashtagsGenerator'
import WeddingDecorChecklist from '@/components/tools/WeddingDecorChecklist'
import WeddingAlcoholCalculator from '@/components/tools/WeddingAlcoholCalculator'
import LastMinuteWeddingChecklist from '@/components/tools/LastMinuteWeddingChecklist'
import WeddingVenueChecklist from '@/components/tools/WeddingVenueChecklist'
import BridalShowerChecklist from '@/components/tools/BridalShowerChecklist'

// Map component names to actual components
const toolComponents: Record<string, React.ComponentType> = {
  WeddingTimelineGenerator,
  WeddingDayTimelineGenerator,
  WeddingReceptionTimelineGenerator,
  WeddingVowsWriter,
  WeddingHashtagsGenerator,
  WeddingDecorChecklist,
  WeddingAlcoholCalculator,
  LastMinuteWeddingChecklist,
  WeddingVenueChecklist,
  BridalShowerChecklist,
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = getToolBySlug(params.slug)
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.'
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hunnimoon.app'
  const canonicalUrl = `${baseUrl}/tools/${params.slug}`

  return {
    title: `${tool.h1} | Hunnimoon`,
    description: tool.metaDescription || tool.description,
    alternates: {
      canonical: `/tools/${params.slug}`,
    },
    openGraph: {
      title: tool.h1,
      description: tool.metaDescription || tool.description,
      type: 'website',
      url: canonicalUrl,
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
      title: tool.h1,
      description: tool.metaDescription || tool.description,
      images: ['/Social Preview.png'],
    },
  }
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug)
  
  if (!tool) {
    notFound()
  }

  const ToolComponent = toolComponents[tool.component]
  const allTools = getAllTools()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Tools', href: '/tools' },
          { label: tool.name, href: `/tools/${tool.slug}` }
        ]}
      />

      {/* SEO Header Block */}
      <div className="text-center mb-12">
        <p className="text-sm font-medium text-pink-primary/60 mb-2 uppercase tracking-wide">
          TOOLS
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-pink-primary mb-4">
          {tool.h1}
        </h1>
        <p className="text-lg text-pink-primary/70 max-w-3xl mx-auto">
          {tool.description}
        </p>
      </div>

      {/* Tool Embed */}
      {ToolComponent && <ToolComponent />}

      {/* Try Other Tools Slider */}
      <ToolSlider tools={allTools} currentToolSlug={tool.slug} />

      {/* CTA Block - Primary conversion point */}
      <CTABlock />

      {/* Testimonial */}
      <div className="bg-pink-light rounded-3xl p-8 md:p-12 my-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-pink-primary mb-6 italic">
            "We had so many moving parts to track. Hunnimoon made it simple to see what we needed to do each month. Nothing fell through the cracks."
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-pink-primary rounded-full flex items-center justify-center text-white font-bold">
              R
            </div>
            <div className="text-left">
              <p className="font-bold text-pink-primary">Rachel E.</p>
              <p className="text-sm text-pink-primary/70">Bride 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Long-Form SEO Content */}
      <article className="prose prose-pink max-w-4xl mx-auto my-16">
        <h2 className="text-3xl font-black text-pink-primary mb-6">
          {tool.seoContent.h2}
        </h2>
        
        <div 
          className="text-pink-primary/80 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: tool.seoContent.content }}
        />

        {/* FAQs */}
        <div className="mt-16 pt-16 border-t-2 border-pink-primary/10">
          <h2 className="text-3xl font-black text-pink-primary mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {tool.seoContent.faqs.map((faq, index) => (
              <div key={index} className="border-b border-pink-primary/10 pb-6 last:border-0">
                <h3 className="text-xl font-bold text-pink-primary mb-3">
                  {faq.question}
                </h3>
                <p className="text-pink-primary/70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Final CTA */}
      <CTABlock />
    </div>
  )
}

export async function generateStaticParams() {
  const tools = getAllTools()
  return tools.map((tool) => ({
    slug: tool.slug,
  }))
}
