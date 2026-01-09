'use client'

import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  weddingDate: string
  partner1Name: string
  partner2Name: string
}

export default function CountdownTimer({ weddingDate, partner1Name, partner2Name }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(weddingDate) - +new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [weddingDate])

  return (
    <div className="bg-gradient-to-r from-pink-primary to-pink-primary/80 rounded-4xl p-6 md:p-8 text-white shadow-lg">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-black">
          {partner1Name} & {partner2Name}
        </h2>
        <p className="text-sm md:text-base font-medium opacity-90">
          Your wedding is in
        </p>
        
        <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-black tabular-nums">
              {timeLeft.days}
            </span>
            <span className="text-sm md:text-base font-medium opacity-90">days</span>
          </div>
          <span className="text-2xl md:text-3xl font-bold opacity-50">:</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-black tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-sm md:text-base font-medium opacity-90">hrs</span>
          </div>
          <span className="text-2xl md:text-3xl font-bold opacity-50">:</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-black tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-sm md:text-base font-medium opacity-90">min</span>
          </div>
          <span className="text-2xl md:text-3xl font-bold opacity-50">:</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-black tabular-nums">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-sm md:text-base font-medium opacity-90">sec</span>
          </div>
        </div>
      </div>
    </div>
  )
}
