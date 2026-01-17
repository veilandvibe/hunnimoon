'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LandingFAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Who is Hunnimoon for?",
      answer: "Hunnimoon is for any couple planning a wedding who wants to stay organized without the stress. Whether you are planning a big celebration or something intimate, Hunnimoon helps you keep track of guests, budget, vendors, and RSVPs all in one place."
    },
    {
      question: "How does the free trial work?",
      answer: "Sign up with your email and get instant access to everything for 7 days. No credit card required. Try all the features, add your wedding details, and see if Hunnimoon is right for you. If you love it, upgrade to keep going. If not, no charge."
    },
    {
      question: "What happens after my trial ends?",
      answer: "After 7 days, you can choose to subscribe and keep using Hunnimoon with all your data intact. If you decide not to continue, your account stays active but read-only, so you can still access your information."
    },
    {
      question: "Can my partner access the same account?",
      answer: "Yes. Accounts are created with one email, but you can share your login with your partner so both of you can manage your wedding planning together. Changes sync in real-time, so you are always on the same page."
    },
    {
      question: "Do I need a credit card to start?",
      answer: "No. The free trial does not require a credit card. Just sign up with your email and start planning immediately."
    },
    {
      question: "Can I import my guest list from a spreadsheet?",
      answer: "Yes. Hunnimoon lets you upload a CSV file with your guest list using our simple template with easy steps to follow. You can also add guests one by one if you prefer. Both options work great."
    },
    {
      question: "How does the RSVP feature work?",
      answer: "You get a custom RSVP link to share with guests. They visit the link, search for their name, and submit their response. Your guest list updates automatically. No more tracking RSVPs by text or email."
    },
    {
      question: "Is my wedding data private and secure?",
      answer: "Yes. Your data is encrypted and stored securely. Only you and people you share access with can see your wedding details. We never share your information with anyone."
    },
    {
      question: "What if I need help using Hunnimoon?",
      answer: "We are here to help. Reach out to us at hunnimoon@veilandvibe.com and we will get back to you quickly. Most questions are answered within a few hours."
    },
    {
      question: "Can I use Hunnimoon on my phone?",
      answer: "Yes. Hunnimoon works on any device with a web browser. Use it on your phone, tablet, or computer. Everything syncs automatically so you can plan from anywhere."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-pink-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-pink-primary/70">
            Everything you need to know about Hunnimoon.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-pink-light border-2 border-pink-primary/10 rounded-2xl overflow-hidden hover:border-pink-primary/30 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-bold text-pink-primary pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={20} className="text-pink-primary" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5">
                      <p className="text-pink-primary/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
