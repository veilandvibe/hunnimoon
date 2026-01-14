export default function Testimonials() {
  const testimonials = [
    {
      quote: "We had so many moving parts to track. Hunnimoon made it simple to see what we needed to do each month. Nothing fell through the cracks.",
      author: "Sarah M.",
      role: "Married June 2024",
      initial: "S"
    },
    {
      quote: "I was drowning in spreadsheets before Hunnimoon. Now everything is in one place and I can actually enjoy planning instead of stressing about it.",
      author: "Jessica R.",
      role: "Bride",
      initial: "J"
    },
    {
      quote: "The RSVP feature alone was worth it. Guests filled out the form and our list updated automatically. No more texting back and forth.",
      author: "Emily & Mark",
      role: "Married September 2024",
      initial: "E"
    },
    {
      quote: "Our budget was all over the place until we started using Hunnimoon. Being able to see exactly where our money was going helped us stay on track.",
      author: "Lauren T.",
      role: "Bride",
      initial: "L"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-pink-light/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-pink-primary mb-4">
            Loved by Couples Planning Their Big Day
          </h2>
          <p className="text-lg text-pink-primary/70 max-w-2xl mx-auto">
            Hunnimoon has helped thousands of couples plan stress-free weddings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white border-2 border-pink-primary/10 rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <p className="text-pink-primary/80 text-lg leading-relaxed mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{testimonial.initial}</span>
                </div>
                <div>
                  <p className="font-bold text-pink-primary">{testimonial.author}</p>
                  <p className="text-pink-primary/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
