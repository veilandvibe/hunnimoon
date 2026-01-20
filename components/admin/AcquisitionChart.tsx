'use client';

import Card from '@/components/ui/Card';

interface AcquisitionData {
  etsy: number;
  regular: number;
  total: number;
}

interface AcquisitionChartProps {
  data: AcquisitionData;
}

export function AcquisitionChart({ data }: AcquisitionChartProps) {
  const etsyPercentage = data.total > 0 
    ? Math.round((data.etsy / data.total) * 100) 
    : 0;
  const regularPercentage = data.total > 0 
    ? Math.round((data.regular / data.total) * 100) 
    : 0;

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-pink-primary">Acquisition Sources</h3>
      <div className="space-y-4">
        {/* Etsy bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Etsy</span>
            <span className="text-sm text-gray-500">
              {data.etsy} users ({etsyPercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-pink-600 h-2.5 rounded-full transition-all"
              style={{ width: `${etsyPercentage}%` }}
            />
          </div>
        </div>

        {/* Regular bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Direct</span>
            <span className="text-sm text-gray-500">
              {data.regular} users ({regularPercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${regularPercentage}%` }}
            />
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total Users</span>
            <span className="text-sm font-semibold">{data.total}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
