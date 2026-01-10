import Card from '../ui/Card'

interface BudgetOverviewProps {
  totalBudget: number
  allocated: number
  actualSpent: number
  unallocated: number
  percentSpent: number
  isOverBudget: boolean
  isOverAllocated: boolean
}

export default function BudgetOverview({
  totalBudget,
  allocated,
  actualSpent,
  unallocated,
  percentSpent,
  isOverBudget,
  isOverAllocated,
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
              {formatCurrency(actualSpent)} / {formatCurrency(totalBudget > 0 ? totalBudget : allocated)}
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

        {/* Stats Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-pink-light rounded-2xl">
            <div className="text-xl md:text-2xl font-black text-pink-primary">
              {totalBudget > 0 ? formatCurrency(totalBudget) : 'Not set'}
            </div>
            <div className="text-xs text-pink-primary/60 mt-1">Total Budget</div>
          </div>

          <div className={`text-center p-3 rounded-2xl ${
            isOverAllocated ? 'bg-orange-50' : 'bg-blue-50'
          }`}>
            <div className={`text-xl md:text-2xl font-black ${
              isOverAllocated ? 'text-orange-600' : 'text-blue-600'
            }`}>
              {formatCurrency(allocated)}
            </div>
            <div className="text-xs text-pink-primary/60 mt-1">Allocated</div>
          </div>

          <div className={`text-center p-3 rounded-2xl ${
            isOverBudget ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <div className={`text-xl md:text-2xl font-black ${
              isOverBudget ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatCurrency(actualSpent)}
            </div>
            <div className="text-xs text-pink-primary/60 mt-1">Actual Spent</div>
          </div>

          <div className={`text-center p-3 rounded-2xl ${
            unallocated < 0 ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <div className={`text-xl md:text-2xl font-black ${
              unallocated < 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatCurrency(Math.abs(unallocated))}
            </div>
            <div className="text-xs text-pink-primary/60 mt-1">
              {unallocated < 0 ? 'Over Allocated' : 'Unallocated'}
            </div>
          </div>
        </div>

        {isOverBudget && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
            ⚠️ You are over budget by {formatCurrency(Math.abs(allocated - actualSpent))}
          </div>
        )}
        
        {isOverAllocated && !isOverBudget && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700 text-center">
            ⚠️ You've allocated more than your total budget by {formatCurrency(Math.abs(unallocated))}
          </div>
        )}
      </div>
    </Card>
  )
}
