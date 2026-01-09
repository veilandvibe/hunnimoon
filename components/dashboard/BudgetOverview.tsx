import Card from '../ui/Card'

interface BudgetOverviewProps {
  totalEstimated: number
  totalActual: number
  remaining: number
  percentSpent: number
  isOverBudget: boolean
}

export default function BudgetOverview({
  totalEstimated,
  totalActual,
  remaining,
  percentSpent,
  isOverBudget,
}: BudgetOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card>
      <div className="space-y-6">
        <h3 className="text-xl md:text-2xl font-black text-pink-primary">
          Budget Overview
        </h3>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-pink-primary/70 mb-2">
            <span>Spent: {percentSpent}%</span>
            <span>
              {formatCurrency(totalActual)} / {formatCurrency(totalEstimated)}
            </span>
          </div>
          <div className="h-3 bg-pink-light rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget ? 'bg-red-500' : 'bg-pink-primary'
              }`}
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-pink-light rounded-2xl">
            <div className="text-2xl md:text-3xl font-black text-pink-primary">
              {formatCurrency(totalEstimated)}
            </div>
            <div className="text-xs text-pink-primary/60 mt-1">Total Budget</div>
          </div>

          <div className="text-center p-4 bg-pink-light rounded-2xl">
            <div className={`text-2xl md:text-3xl font-black ${isOverBudget ? 'text-red-600' : 'text-pink-primary'}`}>
              {formatCurrency(totalActual)}
            </div>
            <div className="text-xs text-pink-primary/60 mt-1">Amount Spent</div>
          </div>

          <div className="text-center p-4 bg-pink-light rounded-2xl">
            <div className={`text-2xl md:text-3xl font-black ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(Math.abs(remaining))}
            </div>
            <div className="text-xs text-pink-primary/60 mt-1">
              {isOverBudget ? 'Over Budget' : 'Remaining'}
            </div>
          </div>
        </div>

        {isOverBudget && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
            ⚠️ You are over budget by {formatCurrency(Math.abs(remaining))}
          </div>
        )}
      </div>
    </Card>
  )
}
