import { UserPlus, ListChecks, Users, PartyPopper } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up Free",
      description: "Create your account in 30 seconds. No credit card needed, no complicated setup. Just your email and you are in."
    },
    {
      icon: ListChecks,
      title: "Add Your Details",
      description: "Enter your couple names and wedding date. Add your vendors and upload your guest list or add guests one by one. Everything syncs instantly."
    },
    {
      icon: Users,
      title: "Manage Everything",
      description: "Track RSVPs, manage your budget, organize vendors, and keep your guest list updated. All in one place, no spreadsheets required."
    },
    {
      icon: PartyPopper,
      title: "Enjoy Your Big Day",
      description: "Show up stress-free knowing every detail is handled. Nothing forgotten, nothing missed, just you celebrating."
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-pink-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-pink-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-pink-primary/70 max-w-2xl mx-auto">
            No complicated setup. No learning curve. Just a simple way to plan your wedding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="text-center">
                {/* Step number & icon */}
                <div className="relative mb-6 inline-block">
                  <div className="w-20 h-20 bg-pink-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon size={32} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-pink-primary rounded-full flex items-center justify-center">
                    <span className="text-pink-primary font-black text-sm">{index + 1}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-pink-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-pink-primary/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
