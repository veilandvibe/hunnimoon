import { Users, DollarSign, Briefcase, CheckCircle } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Users,
      title: "Guest List Management",
      description: "Keep track of every guest with ease. Organize by households, track RSVPs in real-time, and see who is coming at a glance. Import your list from a spreadsheet or add guests one by one."
    },
    {
      icon: CheckCircle,
      title: "RSVP Tracking",
      description: "Create a custom RSVP form guests can fill out online. They search for their name and respond. Your guest list updates automatically. No more text messages or lost paper cards."
    },
    {
      icon: DollarSign,
      title: "Budget Tracking",
      description: "Set your budget, break it down by category, and track what you actually spend. See where your money is going in real-time. Mark items as paid and stay on top of vendor payments."
    },
    {
      icon: Briefcase,
      title: "Vendor Organization",
      description: "Store all your vendor contacts in one place. Track who you hired, what they are doing, and when payments are due. No more digging through emails to find phone numbers."
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-pink-primary mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-lg text-pink-primary/70 max-w-2xl mx-auto">
            No more switching between tabs, apps, and spreadsheets. Hunnimoon keeps your entire wedding organized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index}
                className="bg-pink-light border-2 border-pink-primary/10 rounded-2xl p-8 hover:border-pink-primary/30 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-pink-primary rounded-xl flex items-center justify-center mb-6">
                  <Icon size={28} className="text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-pink-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-pink-primary/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
