'use client'

import { useState } from 'react'
import { Plus, DollarSign, TrendingUp, TrendingDown, Loader2, Edit2 } from 'lucide-react'
import BudgetItemCard from '@/components/budget/BudgetItemCard'
import BudgetFormModal from '@/components/budget/BudgetFormModal'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useWedding } from '@/components/providers/WeddingProvider'
import db from '@/lib/instant'
import { id } from '@instantdb/react'
import toast from 'react-hot-toast'
import { useReadOnly } from '@/lib/use-read-only'

export default function BudgetPage() {
  const { user, isLoading: authLoading } = db.useAuth()
  const { wedding, isLoading: weddingLoading } = useWedding()
  const { isReadOnly } = useReadOnly()
  
  // Query only budget items
  const { data, isLoading: dataLoading, error } = db.useQuery(
    wedding?.id ? {
      budgetItems: {
        $: {
          where: {
            wedding: wedding.id
          }
        }
      }
    } : null
  )
  
  const budgetItems = data?.budgetItems || []
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [budgetInputValue, setBudgetInputValue] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string; itemName: string }>({
    isOpen: false,
    itemId: '',
    itemName: ''
  })

  // Calculate totals
  const activeItems = budgetItems.filter((item) => item.is_active)
  const totalBudget = wedding?.total_budget || 0
  const allocated = activeItems.reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0)
  const actualSpent = activeItems.reduce((sum, item) => sum + Number(item.actual_cost || 0), 0)
  const unallocated = totalBudget - allocated
  const percentSpent = totalBudget > 0 ? Math.round((actualSpent / totalBudget) * 100) : 0
  const isOverBudget = actualSpent > totalBudget
  const isOverAllocated = allocated > totalBudget

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

  const handleEditItem = (item: any) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDeleteItem = async (itemId: string) => {
    const item = budgetItems.find(i => i.id === itemId)
    setDeleteConfirm({
      isOpen: true,
      itemId,
      itemName: item?.category_name || 'this budget item'
    })
  }

  const confirmDelete = async () => {
    try {
      await db.transact([db.tx.budgetItems[deleteConfirm.itemId].delete()])
      toast.success('Budget item deleted')
    } catch (error) {
      console.error('Error deleting budget item:', error)
      toast.error('Failed to delete budget item. Please try again.')
    }
  }

  const handleTogglePaid = async (itemId: string, isPaid: boolean) => {
    try {
      // Find the item to get its estimated_cost
      const item = budgetItems.find(i => i.id === itemId)
      if (!item) return

      // When marking as paid, set actual_cost to estimated_cost
      // When unmarking, set actual_cost to 0
      await db.transact([
        db.tx.budgetItems[itemId].update({
          is_paid: isPaid,
          actual_cost: isPaid ? (item.estimated_cost || 0) : 0,
        }),
      ])
      
      toast.success(isPaid ? 'Marked as paid' : 'Unmarked as paid')
    } catch (error) {
      console.error('Error updating budget item:', error)
      toast.error('Failed to update budget item. Please try again.')
    }
  }

  const handleUpdateTotalBudget = async () => {
    if (!wedding?.id) return
    
    const newBudget = parseFloat(budgetInputValue) || 0
    if (newBudget < 0) {
      toast.error('Budget must be a positive number')
      return
    }
    
    try {
      await db.transact([
        db.tx.weddings[wedding.id].update({
          total_budget: newBudget,
        }),
      ])
      setIsEditingBudget(false)
      toast.success('Budget saved!')
    } catch (error) {
      console.error('Error updating budget:', error)
      toast.error('Failed to update budget. Please try again.')
    }
  }

  const handleSaveItem = async (itemData: any) => {
    if (!wedding?.id) {
      toast.error('Wedding not found. Please refresh the page.')
      return
    }
    
    try {
      if (editingItem) {
        // Update existing item
        await db.transact([
          db.tx.budgetItems[editingItem.id].update({
            ...itemData,
          }),
        ])
        toast.success('Budget item updated!')
      } else {
        // Add new item
        const itemId = id()
        await db.transact([
          db.tx.budgetItems[itemId]
            .update({
              category_name: itemData.category_name || '',
              estimated_cost: itemData.estimated_cost || 0,
              actual_cost: itemData.actual_cost || 0,
              is_paid: itemData.is_paid || false,
              is_active: itemData.is_active !== false,
              is_custom: true,
              sort_order: budgetItems.length + 1,
            })
            .link({ wedding: wedding.id }),
        ])
        toast.success('Budget item added!')
      }
    } catch (error) {
      console.error('Error saving budget item:', error)
      toast.error('Failed to save budget item. Please try again.')
    }
  }

  // Loading state
  if (authLoading || weddingLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-pink-primary mx-auto" />
          <p className="text-pink-primary/60">Loading budget...</p>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <p className="text-pink-primary/70">
              Error loading budget. Please refresh the page.
            </p>
          </div>
        </Card>
      </div>
    )
  }
  
  // No wedding found
  if (!wedding) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <p className="text-pink-primary/70">
              No wedding found. Please complete onboarding first.
            </p>
          </div>
        </Card>
      </div>
    )
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
        <Button 
          onClick={handleAddItem} 
          size="lg" 
          data-tour="add-category"
          disabled={isReadOnly}
          title={isReadOnly ? 'Upgrade to add budget categories' : undefined}
        >
          <Plus size={20} />
          Add Category
        </Button>
      </div>

      {/* Total Wedding Budget Card */}
      <Card data-tour="total-budget">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm text-pink-primary/60 mb-2">Total Wedding Budget</div>
            {isEditingBudget ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-primary text-xl font-bold">$</span>
                  <input
                    type="number"
                    value={budgetInputValue}
                    onChange={(e) => setBudgetInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateTotalBudget()
                      if (e.key === 'Escape') setIsEditingBudget(false)
                    }}
                    className="pl-8 pr-4 py-2 text-2xl font-black text-pink-primary border-2 border-pink-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-primary/20 w-48"
                    placeholder="50000"
                    autoFocus
                  />
                </div>
                <Button onClick={handleUpdateTotalBudget} size="sm">Save</Button>
                <Button onClick={() => setIsEditingBudget(false)} variant="outline" size="sm">Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-pink-primary">
                  {totalBudget > 0 ? formatCurrency(totalBudget) : 'Not set'}
                </div>
                <button
                  onClick={() => {
                    setBudgetInputValue(totalBudget.toString())
                    setIsEditingBudget(true)
                  }}
                  className="p-2 hover:bg-pink-light rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Edit total budget"
                  disabled={isReadOnly}
                  title={isReadOnly ? 'Upgrade to edit budget' : undefined}
                >
                  <Edit2 size={18} className="text-pink-primary" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isOverAllocated ? 'bg-orange-100' : 'bg-blue-100'
            }`}>
              <DollarSign size={24} className={isOverAllocated ? 'text-orange-600' : 'text-blue-600'} />
            </div>
            <div className="flex-1">
              <div className="text-xs text-pink-primary/60">Allocated</div>
              <div className={`text-2xl font-black ${
                isOverAllocated ? 'text-orange-600' : 'text-pink-primary'
              }`}>
                {formatCurrency(allocated)}
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
              <div className="text-xs text-pink-primary/60">Actual Spent</div>
              <div className={`text-2xl font-black ${
                isOverBudget ? 'text-red-600' : 'text-pink-primary'
              }`}>
                {formatCurrency(actualSpent)}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              unallocated < 0 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <DollarSign size={24} className={unallocated < 0 ? 'text-red-600' : 'text-green-600'} />
            </div>
            <div className="flex-1">
              <div className="text-xs text-pink-primary/60">
                {unallocated < 0 ? 'Over Allocated' : 'Unallocated'}
              </div>
              <div className={`text-2xl font-black ${
                unallocated < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatCurrency(Math.abs(unallocated))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card data-tour="spending-metrics">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-pink-primary">
              Spending Progress
            </h3>
            <span className="text-sm text-pink-primary/60">
              {percentSpent}% of total budget spent
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
            {formatCurrency(actualSpent)} of {formatCurrency(totalBudget)} total budget
          </div>
        </div>
      </Card>

      {/* Budget Items Grid */}
      {activeItems.length === 0 ? (
        <Card padding="lg" className="text-center" data-tour="budget-list">
          <p className="text-pink-primary/60 mb-4">No budget categories yet</p>
          <Button 
            onClick={handleAddItem}
            disabled={isReadOnly}
            title={isReadOnly ? 'Upgrade to add budget categories' : undefined}
          >
            <Plus size={20} />
            Add Your First Category
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-tour="budget-list">
          {activeItems.map((item) => (
            <BudgetItemCard
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onTogglePaid={handleTogglePaid}
              isReadOnly={isReadOnly}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, itemId: '', itemName: '' })}
        onConfirm={confirmDelete}
        title="Delete Budget Item?"
        message={`This will permanently delete ${deleteConfirm.itemName}. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
