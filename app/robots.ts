import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard-a8f3k2',
          '/budget',
          '/guests',
          '/vendors',
          '/rsvp-manager',
          '/settings',
          '/api/',
          '/checkout/success',
          '/checkout/canceled',
          '/onboarding',
          '/login',
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://hunnimoon.app'}/sitemap.xml`,
  }
}
