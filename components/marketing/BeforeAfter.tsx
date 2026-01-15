import { X, Check } from 'lucide-react'

export default function BeforeAfter() {
  const painPoints = [
    {
      before: "Spreadsheets scattered across Google Drive, Excel, and your notes app",
      after: "Everything in one organized dashboard you can access anywhere"
    },
    {
      before: "Losing vendor contact information and scrambling to find phone numbers in old emails",
      after: "All vendor details stored in one organized place you can access anytime"
    },
    {
      before: "Guests texting you their RSVPs at random times, losing track of who is coming",
      after: "Custom RSVP form that updates your guest list automatically"
    },
    {
      before: "Budget exploding because you lost track of what you spent where",
      after: "Real-time budget tracker that shows exactly where your money is going"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-pink-primary mb-4">
            Stop Fighting With Spreadsheets
          </h2>
          <p className="text-lg text-pink-primary/70 max-w-2xl mx-auto">
            Wedding planning is stressful enough. Your planning tools should not add to the chaos.
          </p>
        </div>

        <div className="space-y-6">
          {painPoints.map((point, index) => (
            <div 
              key={index}
              className="bg-white border-2 border-pink-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-pink-primary/10">
                {/* Before (Problem) */}
                <div className="p-6 md:p-8" style={{ backgroundColor: '#FFE4E1' }}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-1">
                      <X size={16} className="text-white" strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-red-900 text-sm uppercase tracking-wide mb-2">
                        Before
                      </p>
                      <p className="text-red-800 leading-relaxed">
                        {point.before}
                      </p>
                    </div>
                  </div>
                </div>

                {/* After (Solution) */}
                <div className="bg-pink-light p-6 md:p-8">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-pink-primary rounded-full flex items-center justify-center mt-1">
                      <Check size={16} className="text-white" strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-pink-primary text-sm uppercase tracking-wide mb-2">
                        With Hunnimoon
                      </p>
                      <p className="text-pink-primary/80 leading-relaxed">
                        {point.after}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
