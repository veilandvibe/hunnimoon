'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import Card from '../ui/Card'

interface RSVPChartProps {
  yesCount: number
  noCount: number
  pendingCount: number
}

export default function RSVPChart({ yesCount, noCount, pendingCount }: RSVPChartProps) {
  const data = [
    { name: 'Yes', value: yesCount, color: '#10b981' },
    { name: 'No', value: noCount, color: '#ef4444' },
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
  ]

  const total = yesCount + noCount + pendingCount

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-pink-primary">
            RSVP Status
          </h3>
          <p className="text-sm text-pink-primary/60 mt-1">
            Total responses: {total}
          </p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm text-pink-primary">
                  {value}: {entry.payload.value} ({Math.round((entry.payload.value / total) * 100)}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-pink-primary/10">
          <div className="text-center">
            <div className="text-2xl font-black text-green-600">{yesCount}</div>
            <div className="text-xs text-pink-primary/60">Confirmed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-red-600">{noCount}</div>
            <div className="text-xs text-pink-primary/60">Declined</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
            <div className="text-xs text-pink-primary/60">Awaiting</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
