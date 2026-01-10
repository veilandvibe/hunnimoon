'use client'

import CountdownTimer from '@/components/dashboard/CountdownTimer'
import MetricCard from '@/components/dashboard/MetricCard'
import RSVPChart from '@/components/dashboard/RSVPChart'
import BudgetOverview from '@/components/dashboard/BudgetOverview'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import db from '@/lib/instant'
import { Users, ClipboardList } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data, isLoading } = db.useQuery({
    weddings: {
      guests: {},
      budgetItems: {},
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const wedding = data?.weddings?.[0]
  const guests = wedding?.guests || []
  const budgetItems = wedding?.budgetItems?.filter((item: any) => item.is_active) || []

  // Calculate metrics
  const totalGuests = guests.length
  const invitesSent = guests.filter((g: any) => g.invite_sent).length
  const invitesSentPercent = totalGuests > 0 ? Math.round((invitesSent / totalGuests) * 100) : 0
  const yesCount = guests.filter((g: any) => g.rsvp_status === 'Yes').length
  const noCount = guests.filter((g: any) => g.rsvp_status === 'No').length
  const pendingCount = guests.filter((g: any) => g.rsvp_status === 'Pending').length
  const projectedAttendance = yesCount + Math.floor(pendingCount * 0.5)

  const totalBudget = wedding?.total_budget || 0
  const allocated = budgetItems.reduce((sum: number, item: any) => sum + item.estimated_cost, 0)
  const actualSpent = budgetItems.reduce((sum: number, item: any) => sum + item.actual_cost, 0)
  const unallocated = totalBudget - allocated
  const percentSpent = totalBudget > 0 ? Math.round((actualSpent / totalBudget) * 100) : 0
  const isOverBudget = actualSpent > allocated
  const isOverAllocated = allocated > totalBudget

  if (!wedding) {
    return (
      <div className="text-center py-12">
        <p className="text-pink-primary/70">No wedding found. Please complete onboarding.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Countdown Timer */}
      <CountdownTimer
        weddingDate={wedding.wedding_date}
        partner1Name={wedding.partner1_name}
        partner2Name={wedding.partner2_name}
      />

      {/* Guest Metrics - Mobile: 2 cols, Tablet+: 4 cols */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          value={totalGuests}
          label="Total Guests"
        />
        <MetricCard
          value={invitesSent}
          label="Invites Sent"
          sublabel={`${invitesSentPercent}%`}
        />
        <MetricCard
          value={yesCount}
          label="RSVP'd Yes"
        />
        <MetricCard
          value={projectedAttendance}
          label="Projected"
        />
      </div>

      {/* Guest List Section */}
      <Card>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-pink-primary" />
            </div>
            <div>
              <p className="text-sm text-pink-primary/60">Manage</p>
              <h3 className="text-xl md:text-2xl font-black text-pink-primary">
                Guest List
              </h3>
            </div>
          </div>
          <Link href="/guests">
            <Button>
              Manage guests →
            </Button>
          </Link>
        </div>
      </Card>

      {/* RSVP & Budget Grid - Mobile: Stack, Desktop: 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RSVPChart
          yesCount={yesCount}
          noCount={noCount}
          pendingCount={pendingCount}
        />
        <BudgetOverview
          totalBudget={totalBudget}
          allocated={allocated}
          actualSpent={actualSpent}
          unallocated={unallocated}
          percentSpent={percentSpent}
          isOverBudget={isOverBudget}
          isOverAllocated={isOverAllocated}
        />
      </div>

      {/* RSVP Manager Link */}
      <Card>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <ClipboardList size={24} className="text-pink-primary" />
            </div>
            <div>
              <p className="text-sm text-pink-primary/60">Share</p>
              <h3 className="text-xl md:text-2xl font-black text-pink-primary">
                RSVP Link
              </h3>
            </div>
          </div>
          <Link href="/rsvp-manager">
            <Button variant="secondary">
              View RSVP Manager →
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
