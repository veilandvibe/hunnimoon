'use client'

import Link from 'next/link'
import { getAllTools } from '@/lib/tools-data'

export default function PublicFooter() {
  const tools = getAllTools()

  return (
    <footer className="bg-pink-light border-t border-pink-primary/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tools */}
          <div>
            <h3 className="font-bold text-pink-primary mb-4">Free Tools</h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.slug}>
                  <Link 
                    href={`/tools/${tool.slug}`}
                    className="text-pink-primary/70 hover:text-pink-primary transition-colors text-sm"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-pink-primary mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-pink-primary/70 hover:text-pink-primary transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-pink-primary/70 hover:text-pink-primary transition-colors text-sm">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-pink-primary mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-pink-primary/70 hover:text-pink-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-pink-primary/70 hover:text-pink-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="text-pink-primary/70 hover:text-pink-primary transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-pink-primary/10 text-center">
          <p className="text-pink-primary/60 text-sm">
            © {new Date().getFullYear()} Hunnimoon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
