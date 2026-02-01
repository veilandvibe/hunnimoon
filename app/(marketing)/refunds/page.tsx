import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | Hunnimoon',
  description: 'Our refund policy for Hunnimoon subscriptions. Learn about our 7-day free trial and cancellation terms.',
  alternates: {
    canonical: '/refunds',
  },
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-pink-primary mb-8">Refund Policy</h1>
        
        <div className="prose prose-pink max-w-none space-y-6 text-pink-primary/80">
          <p className="text-sm text-pink-primary/60">Last Updated: January 17, 2026</p>
          
          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">Our Refund Policy</h2>
            <p>
              At Hunnimoon, we offer a <strong>7-day free trial</strong> with full access to all features. 
              This allows you to thoroughly evaluate the platform before making any financial commitment.
            </p>
            <p>
              <strong>No credit card is required</strong> to start your free trial, ensuring you can explore 
              Hunnimoon risk-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">No Refunds After Trial Period</h2>
            <p>
              Once your free trial ends and you subscribe to a paid plan, <strong>all subscription fees are non-refundable</strong>. 
              This policy applies to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Monthly subscriptions</li>
              <li>Yearly subscriptions</li>
              <li>Any renewal charges</li>
              <li>Partial billing periods (no prorated refunds)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">Why This Policy?</h2>
            <p>
              Our 7-day free trial provides ample time to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Explore all features and functionality</li>
              <li>Add your guest list and test RSVP forms</li>
              <li>Track your budget and manage vendors</li>
              <li>Determine if Hunnimoon meets your wedding planning needs</li>
            </ul>
            <p>
              We believe this trial period is sufficient to make an informed decision about subscribing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">Cancellation Policy</h2>
            <p>
              While we do not offer refunds, you may <strong>cancel your subscription at any time</strong> from your account settings.
            </p>
            <p>
              When you cancel:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You will retain full access until the end of your current billing period</li>
              <li>You will not be charged for subsequent billing periods</li>
              <li>Your account will automatically convert to read-only mode after your subscription ends</li>
              <li>Your data remains accessible in read-only mode, and you can resubscribe at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">Exceptions</h2>
            <p>
              Refunds may be issued at our sole discretion in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Technical issues that prevented you from accessing the Service for an extended period</li>
              <li>Billing errors or duplicate charges</li>
              <li>Circumstances required by applicable law</li>
            </ul>
            <p>
              To request a refund under exceptional circumstances, please contact us at{' '}
              <a href="mailto:hunnimoon@veilandvibe.com" className="text-pink-primary underline">
                hunnimoon@veilandvibe.com
              </a>{' '}
              with details of your situation. We will review each request on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">Billing Disputes</h2>
            <p>
              If you believe you have been charged in error, please contact us within 30 days of the charge at{' '}
              <a href="mailto:hunnimoon@veilandvibe.com" className="text-pink-primary underline">
                hunnimoon@veilandvibe.com
              </a>.
            </p>
            <p>
              Include the following information in your message:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your account email address</li>
              <li>The date and amount of the charge</li>
              <li>A description of why you believe the charge was incorrect</li>
            </ul>
            <p>
              We will investigate all billing disputes promptly and work with you to resolve the issue.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">Questions?</h2>
            <p>
              If you have any questions about our refund policy, please don't hesitate to contact us:
            </p>
            <div className="bg-pink-light p-4 rounded-xl mt-4">
              <p className="font-semibold text-pink-primary">Veil and Vibe</p>
              <p>A product of 1497239 B.C. LTD.</p>
              <p>1220 Seguin Drive, Suite 1015</p>
              <p>Coquitlam, BC V3K 6W8</p>
              <p>Canada</p>
              <p className="mt-2">Email: <a href="mailto:hunnimoon@veilandvibe.com" className="text-pink-primary underline">hunnimoon@veilandvibe.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
