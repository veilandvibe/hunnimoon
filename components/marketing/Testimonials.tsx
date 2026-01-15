'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const currentTestimonial = testimonials[currentIndex]

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

        {/* Slider Container */}
        <div className="max-w-3xl mx-auto relative">
          {/* Testimonial Card */}
          <div className="bg-white border-2 border-pink-primary/10 rounded-2xl p-8 md:p-12 shadow-lg">
            <p className="text-pink-primary/80 text-xl md:text-2xl leading-relaxed mb-8 italic text-center">
              &ldquo;{currentTestimonial.quote}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 bg-pink-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">{currentTestimonial.initial}</span>
              </div>
              <div>
                <p className="font-bold text-pink-primary text-lg">{currentTestimonial.author}</p>
                <p className="text-pink-primary/60">{currentTestimonial.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border-2 border-pink-primary text-pink-primary hover:bg-pink-light transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-pink-primary w-8' 
                      : 'bg-pink-primary/30 hover:bg-pink-primary/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full border-2 border-pink-primary text-pink-primary hover:bg-pink-light transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
