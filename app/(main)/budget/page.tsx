'use client'

import { useState } from 'react'
import { Plus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import BudgetItemCard from '@/components/budget/BudgetItemCard'
import BudgetFormModal from '@/components/budget/BudgetFormModal'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { dummyBudgetItems, BudgetItem } from '@/lib/dummyData'

export default function BudgetPage() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(dummyBudgetItems)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)

  // Calculate totals
  const activeItems = budgetItems.filter((item) => item.is_active)
  const totalEstimated = activeItems.reduce((sum, item) => sum + item.estimated_cost, 0)
  const totalActual = activeItems.reduce((sum, item) => sum + item.actual_cost, 0)
  const remaining = totalEstimated - totalActual
  const percentSpent = totalEstimated > 0 ? Math.round((totalActual / totalEstimated) * 100) : 0
  const isOverBudget = totalActual > totalEstimated

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEditItem = (item: BudgetItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this budget item?')) {
      setBudgetItems(budgetItems.filter((item) => item.id !== itemId))
    }
  }

  const handleTogglePaid = (itemId: string, isPaid: boolean) => {
    setBudgetItems(
      budgetItems.map((item) =>
        item.id === itemId ? { ...item, is_paid: isPaid } : item
      )
    )
  }

  const handleSaveItem = (itemData: Partial<BudgetItem>) => {
    if (editingItem) {
      // Update existing item
      setBudgetItems(
        budgetItems.map((item) =>
          item.id === editingItem.id ? { ...item, ...itemData } : item
        )
      )
    } else {
      // Add new item
      const newItem: BudgetItem = {
        id: `budget-${Date.now()}`,
        wedding_id: 'wedding-1',
        category_name: itemData.category_name || '',
        estimated_cost: itemData.estimated_cost || 0,
        actual_cost: itemData.actual_cost || 0,
        is_paid: itemData.is_paid || false,
        is_active: itemData.is_active !== false,
        is_custom: true,
        sort_order: budgetItems.length + 1,
      }
      setBudgetItems([...budgetItems, newItem])
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-pink-primary">
            Budget
          </h1>
          <p className="text-pink-primary/60 mt-1">
            {activeItems.length} categories
          </p>
        </div>
        <Button onClick={handleAddItem} size="lg">
          <Plus size={20} />
          Add Category
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-pink-primary" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-pink-primary/60">Total Budget</div>
              <div className="text-2xl font-black text-pink-primary">
                {formatCurrency(totalEstimated)}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isOverBudget ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {isOverBudget ? (
                <TrendingUp size={24} className="text-red-600" />
              ) : (
                <TrendingDown size={24} className="text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-xs text-pink-primary/60">Amount Spent</div>
              <div className={`text-2xl font-black ${
                isOverBudget ? 'text-red-600' : 'text-pink-primary'
              }`}>
                {formatCurrency(totalActual)}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isOverBudget ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <DollarSign size={24} className={isOverBudget ? 'text-red-600' : 'text-green-600'} />
            </div>
            <div className="flex-1">
              <div className="text-xs text-pink-primary/60">
                {isOverBudget ? 'Over Budget' : 'Remaining'}
              </div>
              <div className={`text-2xl font-black ${
                isOverBudget ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatCurrency(Math.abs(remaining))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-pink-primary">
              Overall Progress
            </h3>
            <span className="text-sm text-pink-primary/60">
              {percentSpent}% spent
            </span>
          </div>
          <div className="h-4 bg-pink-light rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverBudget ? 'bg-red-500' : 'bg-pink-primary'
              }`}
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            />
          </div>
          <div className="text-sm text-center text-pink-primary/60">
            {formatCurrency(totalActual)} of {formatCurrency(totalEstimated)}
          </div>
        </div>
      </Card>

      {/* Budget Items Grid */}
      {activeItems.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-pink-primary/60 mb-4">No budget categories yet</p>
          <Button onClick={handleAddItem}>
            Add Your First Category
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeItems.map((item) => (
            <BudgetItemCard
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onTogglePaid={handleTogglePaid}
            />
          ))}
        </div>
      )}

      {/* Budget Form Modal */}
      <BudgetFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />
    </div>
  )
}
