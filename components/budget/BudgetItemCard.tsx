import Card from '../ui/Card'
import Checkbox from '../ui/Checkbox'
import { Edit, Trash2, DollarSign } from 'lucide-react'

interface BudgetItemCardProps {
  item: any
  onEdit: (item: any) => void
  onDelete: (itemId: string) => void
  onTogglePaid: (itemId: string, isPaid: boolean) => void
}

export default function BudgetItemCard({ item, onEdit, onDelete, onTogglePaid }: BudgetItemCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const estimatedCost = item.estimated_cost || 0
  const actualCost = item.actual_cost || 0

  const percentSpent = estimatedCost > 0
    ? Math.round((actualCost / estimatedCost) * 100)
    : 0

  const isOverBudget = actualCost > estimatedCost

  return (
    <Card padding="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-pink-primary truncate">
              {item.category_name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {item.is_custom && (
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                  Custom
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-2 hover:bg-pink-light rounded-lg transition-colors"
              aria-label="Edit budget item"
            >
              <Edit size={16} className="text-pink-primary" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete budget item"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        </div>

        {/* Costs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-pink-light rounded-xl">
            <div className="text-xs text-pink-primary/60 mb-1">Budgeted</div>
            <div className="text-lg font-black text-pink-primary">
              {formatCurrency(estimatedCost)}
            </div>
          </div>
          <div className={`text-center p-3 rounded-xl ${
            isOverBudget ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <div className="text-xs text-pink-primary/60 mb-1">Spent</div>
            <div className={`text-lg font-black ${
              isOverBudget ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatCurrency(actualCost)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-pink-primary/60 mb-1">
            <span>Spent</span>
            <span>{percentSpent}%</span>
          </div>
          <div className="h-2 bg-pink-light rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverBudget ? 'bg-red-500' : 'bg-pink-primary'
              }`}
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            />
          </div>
        </div>

        {/* Paid Checkbox */}
        <div className="pt-3 border-t border-pink-primary/10">
          <Checkbox
            checked={item.is_paid}
            onChange={(checked) => onTogglePaid(item.id, checked)}
            label={item.is_paid ? 'Paid ✓' : 'Mark as paid'}
          />
        </div>
      </div>
    </Card>
  )
}
