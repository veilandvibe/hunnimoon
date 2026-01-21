'use client';

import { useEffect, useState } from 'react';
import db from '@/lib/instant';
import { useRouter } from 'next/navigation';
import { isAdminEmail } from '@/lib/admin-helpers';
import { MetricCard } from '@/components/admin/MetricCard';
import { AcquisitionChart } from '@/components/admin/AcquisitionChart';
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  UserCheck,
  UserX,
} from 'lucide-react';
import Card from '@/components/ui/Card';

interface AdminMetrics {
  overview: {
    totalUsers: number;
    activeTrials: number;
    paidSubscribers: number;
    monthlySubscribers: number;
    yearlySubscribers: number;
    canceledSubscriptions: number;
  };
  revenue: {
    mrr: string;
    monthlyMRR: string;
    yearlyMRR: string;
    churnRate: string;
  };
  acquisition: {
    etsy: number;
    regular: number;
    total: number;
    etsyConversionRate: string;
    etsyActivated: number;
  };
  activity: {
    recentSignups: Array<{
      id: string;
      email: string;
      firstName: string;
      createdAt: string;
      source?: string;
    }>;
    trialsExpiringSoon: Array<{
      id: string;
      email: string;
      firstName: string;
      trialStartDate: string;
    }>;
    recentUpgrades: Array<{
      id: string;
      email: string;
      firstName: string;
      plan: string;
      upgradedAt: string;
    }>;
    recentCancellations: Array<{
      id: string;
      email: string;
      firstName: string;
      canceledAt: string;
    }>;
  };
}

export default function AdminDashboard() {
  const { user } = db.useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check admin access
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isAdminEmail(user.email)) {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  // Fetch metrics
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/admin/metrics', {
          headers: {
            Authorization: `Bearer ${user?.email}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError('Failed to load metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user && isAdminEmail(user.email)) {
      fetchMetrics();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error || 'Failed to load metrics'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of Hunnimoon metrics and activity
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics.overview.totalUsers}
          icon={Users}
          description="All registered users"
        />
        <MetricCard
          title="Active Trials"
          value={metrics.overview.activeTrials}
          icon={Clock}
          description="Currently in trial period"
        />
        <MetricCard
          title="Paid Subscribers"
          value={metrics.overview.paidSubscribers}
          icon={UserCheck}
          description={`${metrics.overview.monthlySubscribers} monthly, ${metrics.overview.yearlySubscribers} yearly`}
        />
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Monthly Recurring Revenue"
          value={`$${metrics.revenue.mrr}`}
          icon={DollarSign}
          description="Total MRR"
        />
        <MetricCard
          title="Churn Rate"
          value={`${metrics.revenue.churnRate}%`}
          icon={UserX}
          description="Subscription cancellation rate"
        />
        <MetricCard
          title="Canceled Subscriptions"
          value={metrics.overview.canceledSubscriptions}
          icon={UserX}
          description="All-time cancellations"
        />
      </div>

        {/* Acquisition Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AcquisitionChart data={metrics.acquisition} />
          
          <Card className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-primary">Etsy Performance</h3>
            <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Etsy Users</span>
              <span className="text-2xl font-bold">{metrics.acquisition.etsy}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Activated (paid)</span>
              <span className="text-2xl font-bold text-green-600">
                {metrics.acquisition.etsyActivated}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-2xl font-bold text-pink-600">
                {metrics.acquisition.etsyConversionRate}%
              </span>
            </div>
            </div>
          </Card>
        </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-pink-primary">Recent Signups (Last 24h)</h3>
          <div>
            {metrics.activity.recentSignups.length === 0 ? (
              <p className="text-sm text-gray-500">No recent signups</p>
            ) : (
              <div className="space-y-3">
                {metrics.activity.recentSignups.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="text-sm font-medium">{user.firstName || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.source === 'etsy' && (
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                        Etsy
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Trials Expiring Soon */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-pink-primary">Trials Expiring Soon</h3>
          <div>
            {metrics.activity.trialsExpiringSoon.length === 0 ? (
              <p className="text-sm text-gray-500">No trials expiring soon</p>
            ) : (
              <div className="space-y-3">
                {metrics.activity.trialsExpiringSoon.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="text-sm font-medium">{user.firstName || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      Expires soon
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Upgrades */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-pink-primary">Recent Upgrades</h3>
          <div>
            {metrics.activity.recentUpgrades.length === 0 ? (
              <p className="text-sm text-gray-500">No recent upgrades</p>
            ) : (
              <div className="space-y-3">
                {metrics.activity.recentUpgrades.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="text-sm font-medium">{user.firstName || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded capitalize">
                      {user.plan}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Cancellations */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-pink-primary">Recent Cancellations</h3>
          <div>
            {metrics.activity.recentCancellations.length === 0 ? (
              <p className="text-sm text-gray-500">No recent cancellations</p>
            ) : (
              <div className="space-y-3">
                {metrics.activity.recentCancellations.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="text-sm font-medium">{user.firstName || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      Canceled
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
