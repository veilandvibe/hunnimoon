import Card from '../ui/Card'

interface MetricCardProps {
  value: string | number
  label: string
  sublabel?: string
}

export default function MetricCard({ value, label, sublabel }: MetricCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center text-center min-h-[120px]">
      <div className="text-4xl md:text-5xl font-black text-pink-primary mb-2">
        {value}
      </div>
      <div className="text-xs md:text-sm text-pink-primary/70 font-medium">
        {label}
      </div>
      {sublabel && (
        <div className="text-xs text-pink-primary/50 mt-1">
          {sublabel}
        </div>
      )}
    </Card>
  )
}
