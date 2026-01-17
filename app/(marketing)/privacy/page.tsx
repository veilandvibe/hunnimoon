export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-pink-primary mb-8">Privacy Policy</h1>
        
        <div className="prose prose-pink max-w-none space-y-6 text-pink-primary/80">
          <p className="text-sm text-pink-primary/60">Last Updated: January 17, 2026</p>
          
          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">1. Introduction</h2>
            <p>
              This Privacy Policy describes how 1497239 B.C. LTD. ("we," "us," or "our"), operating as Veil and Vibe, 
              collects, uses, and protects your personal information when you use Hunnimoon (the "Service").
            </p>
            <p>
              We are committed to protecting your privacy and handling your data in an open and transparent manner. 
              This policy applies to all users of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">2.1 Information You Provide</h3>
            <p>When you use Hunnimoon, you directly provide us with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Email address used for authentication and account management
              </li>
              <li>
                <strong>Wedding Details:</strong> Partner names, wedding date, and custom RSVP URL slug
              </li>
              <li>
                <strong>Guest Information:</strong> Names, contact details, RSVP status, meal preferences, dietary restrictions, 
                and other information you choose to store about your guests
              </li>
              <li>
                <strong>Budget Data:</strong> Budget categories, estimated costs, actual expenses, and payment status
              </li>
              <li>
                <strong>Vendor Information:</strong> Vendor names, contact information, services provided, costs, and notes
              </li>
              <li>
                <strong>RSVP Responses:</strong> Information submitted by your guests through public RSVP forms
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">2.2 Information Collected Automatically</h3>
            <p>When you access the Service, we automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Usage Data:</strong> Pages viewed, features used, and interactions with the Service
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating system, and device identifiers
              </li>
              <li>
                <strong>Log Data:</strong> IP address, access times, and referring URLs
              </li>
              <li>
                <strong>Acquisition Source:</strong> How you found Hunnimoon (e.g., search engine, social media, referral link)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">2.3 Cookies and Tracking</h3>
            <p>
              We use cookies and similar technologies to maintain your session, remember your preferences, and analyze 
              Service usage. You can control cookies through your browser settings, but disabling them may limit functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve the Service</li>
              <li>Create and manage your account</li>
              <li>Send you authentication codes via email</li>
              <li>Process and store your wedding planning data</li>
              <li>Enable public RSVP forms for your guests</li>
              <li>Manage your subscription and billing</li>
              <li>Communicate with you about the Service, including updates and support</li>
              <li>Analyze usage patterns to improve features and user experience</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">4.1 We Do Not Sell Your Data</h3>
            <p>
              We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
            </p>

            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">4.2 Service Providers</h3>
            <p>
              We share information with trusted third-party service providers who assist us in operating the Service, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Database and Hosting:</strong> InstantDB for data storage and real-time synchronization
              </li>
              <li>
                <strong>Email Services:</strong> For sending authentication codes and account notifications
              </li>
              <li>
                <strong>Payment Processing:</strong> Stripe for processing subscription payments
              </li>
            </ul>
            <p>
              These providers are contractually obligated to protect your information and use it only for the services they provide to us.
            </p>

            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">4.3 Public RSVP Forms</h3>
            <p>
              Information submitted through public RSVP forms is visible to you as the wedding organizer. You are responsible 
              for ensuring that your guests understand how their information will be used when they submit an RSVP.
            </p>

            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">4.4 Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in response to valid requests by public 
              authorities, including to meet national security or law enforcement requirements.
            </p>

            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">4.5 Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part 
              of that transaction. We will notify you of any such change and any choices you may have regarding your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information against unauthorized 
              access, alteration, disclosure, or destruction, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit using HTTPS/SSL</li>
              <li>Secure authentication using magic link codes</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls limiting who can view your data</li>
              <li>Regular backups for disaster recovery</li>
            </ul>
            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive 
              to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">6. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide the Service. 
              Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Active Accounts:</strong> Your data is retained for the duration of your subscription
              </li>
              <li>
                <strong>Inactive/Read-Only Accounts:</strong> Your data remains accessible to you indefinitely
              </li>
              <li>
                <strong>Deleted Accounts:</strong> Data is retained for 30 days after deletion, then permanently removed
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may retain certain information as required by law or for legitimate business purposes
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">7. Your Rights and Choices</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information:</p>
            
            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">7.1 Access and Portability</h3>
            <p>
              You can access, download, and export your wedding planning data at any time through the Service.
            </p>

            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">7.2 Correction and Updates</h3>
            <p>
              You can update your wedding details, guest information, budget data, and vendor contacts directly through the Service.
            </p>

            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">7.3 Deletion</h3>
            <p>
              You can request deletion of your account and all associated data by contacting us at hunnimoon@veilandvibe.com. 
              We will process your request within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-pink-primary mt-6 mb-3">7.4 Marketing Communications</h3>
            <p>
              You can opt out of marketing emails by clicking the unsubscribe link in any marketing email. Note that 
              we will still send you essential account-related emails.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">8. Children's Privacy</h2>
            <p>
              The Service is not intended for use by individuals under the age of 18. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on servers located outside of your country of residence. 
              By using the Service, you consent to the transfer of your information to Canada and other countries where we 
              operate, which may have different data protection laws than your country.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">10. Canadian Privacy Laws</h2>
            <p>
              As a Canadian company, we comply with the Personal Information Protection and Electronic Documents Act (PIPEDA) 
              and applicable provincial privacy legislation. We collect, use, and disclose personal information only with your 
              consent and for identified purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email 
              or by posting a notice on the Service before the changes take effect. We encourage you to review this policy 
              periodically for the latest information on our privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-primary mt-8 mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:
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
