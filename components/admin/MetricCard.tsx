'use client';

import Card from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: MetricCardProps) {
  return (
    <Card className="space-y-3">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {Icon && <Icon className="h-4 w-4 text-gray-500" />}
      </div>
      <div>
        <div className="text-2xl font-bold text-pink-primary">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {trend && (
          <p
            className={`text-xs mt-1 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.value}
          </p>
        )}
      </div>
    </Card>
  );
}
