'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

interface TimelineTask {
  month: string
  tasks: string[]
}

export default function WeddingTimelineGenerator() {
  const [weddingDate, setWeddingDate] = useState('')
  const [engagementDate, setEngagementDate] = useState('')
  const [planningStyle, setPlanningStyle] = useState('standard')
  const [timeline, setTimeline] = useState<TimelineTask[]>([])
  const [showResults, setShowResults] = useState(false)

  const generateTimeline = () => {
    if (!weddingDate) return

    const wedding = new Date(weddingDate)
    const engagement = engagementDate ? new Date(engagementDate) : new Date()
    
    // Calculate months until wedding
    const monthsUntil = Math.ceil((wedding.getTime() - engagement.getTime()) / (1000 * 60 * 60 * 24 * 30))

    const generatedTimeline: TimelineTask[] = []

    // 12+ months before
    if (monthsUntil >= 12) {
      generatedTimeline.push({
        month: '12+ Months Before',
        tasks: [
          'Set your budget and start a wedding fund',
          'Create your guest list (rough estimate)',
          'Start researching venues and vendors',
          'Choose your wedding party',
          'Begin looking at wedding inspiration'
        ]
      })
    }

    // 9-11 months before
    if (monthsUntil >= 9) {
      generatedTimeline.push({
        month: '9-11 Months Before',
        tasks: [
          'Book your ceremony and reception venues',
          'Hire your photographer and videographer',
          'Book your caterer or reception venue with catering',
          'Choose and order your wedding dress',
          'Reserve hotel room blocks for guests'
        ]
      })
    }

    // 6-8 months before
    if (monthsUntil >= 6) {
      generatedTimeline.push({
        month: '6-8 Months Before',
        tasks: [
          'Book your florist',
          'Hire your DJ or band',
          'Order bridesmaid dresses',
          'Book hair and makeup artists',
          'Start planning your honeymoon'
        ]
      })
    }

    // 4-5 months before
    if (monthsUntil >= 4) {
      generatedTimeline.push({
        month: '4-5 Months Before',
        tasks: [
          'Send save-the-dates',
          'Order wedding invitations',
          'Book transportation',
          'Start dress fittings',
          'Plan rehearsal dinner'
        ]
      })
    }

    // 2-3 months before
    if (monthsUntil >= 2) {
      generatedTimeline.push({
        month: '2-3 Months Before',
        tasks: [
          'Mail wedding invitations',
          'Finalize ceremony and reception details',
          'Order wedding cake',
          'Purchase wedding rings',
          'Schedule final dress fitting'
        ]
      })
    }

    // 1 month before
    generatedTimeline.push({
      month: '1 Month Before',
      tasks: [
        'Confirm final guest count',
        'Create seating chart',
        'Finalize timeline with vendors',
        'Get marriage license',
        'Break in your wedding shoes'
      ]
    })

    // 1-2 weeks before
    generatedTimeline.push({
      month: '1-2 Weeks Before',
      tasks: [
        'Confirm details with all vendors',
        'Pack for honeymoon',
        'Prepare vendor payments and tips',
        'Do a final walk-through at venue',
        'Attend rehearsal and rehearsal dinner'
      ]
    })

    // Wedding day
    generatedTimeline.push({
      month: 'Wedding Day',
      tasks: [
        'Eat a good breakfast',
        'Stay hydrated',
        'Give yourself extra time for getting ready',
        'Enjoy every moment',
        'Trust your vendors and wedding party'
      ]
    })

    setTimeline(generatedTimeline)
    setShowResults(true)
  }

  const handleReset = () => {
    setWeddingDate('')
    setEngagementDate('')
    setPlanningStyle('standard')
    setTimeline([])
    setShowResults(false)
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-pink-primary/10 max-w-4xl mx-auto">
      {!showResults ? (
        <div className="space-y-6">
          <Input
            label="Wedding Date"
            type="date"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
            required
          />

          <Input
            label="Engagement Date (Optional)"
            type="date"
            value={engagementDate}
            onChange={(e) => setEngagementDate(e.target.value)}
          />

          <Select
            label="Planning Style"
            value={planningStyle}
            onChange={(e) => setPlanningStyle(e.target.value)}
          >
            <option value="relaxed">Relaxed (Take your time)</option>
            <option value="standard">Standard (Balanced pace)</option>
            <option value="fast">Fast (Quick timeline)</option>
          </Select>

          <p className="text-sm text-pink-primary/60">
            Get a month-by-month timeline with all the tasks you need to complete before your big day
          </p>

          <div className="flex gap-3">
            <Button 
              onClick={generateTimeline}
              disabled={!weddingDate}
              fullWidth
            >
              Generate Timeline
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-pink-primary">
              Your Wedding Planning Timeline
            </h3>
            <Button onClick={handleReset} variant="outline" size="sm">
              Reset
            </Button>
          </div>

          <div className="space-y-6">
            {timeline.map((period, index) => (
              <div key={index} className="border-l-4 border-pink-primary pl-6 pb-6">
                <h4 className="text-lg font-bold text-pink-primary mb-3">
                  {period.month}
                </h4>
                <ul className="space-y-2">
                  {period.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start gap-2 text-pink-primary/70">
                      <span className="text-pink-primary mt-1">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-pink-primary/10">
            <Button onClick={handleReset} variant="outline" fullWidth>
              Create Another Timeline
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
