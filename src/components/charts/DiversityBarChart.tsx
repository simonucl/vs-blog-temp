import { motion, useReducedMotion } from 'framer-motion';
import { memo } from 'react';
import { useRechartsResizeFix } from './useRechartsResizeFix';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type {
  DiversityBarChartProps,
  ChartTooltipProps,
  DiversityDataPoint,
} from '@/types/charts';
import { METHOD_COLORS, METHOD_LABELS } from '@/types/charts';

function DiversityBarChart({
  data,
  title,
  subtitle,
  yAxisLabel = 'Diversity Score (%)',
  height = 400,
  showLegend = true,
}: DiversityBarChartProps) {
  useRechartsResizeFix();
  const prefersReducedMotion = useReducedMotion();
  // Check if data exists
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-500">No data available for chart</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: ChartTooltipProps<DiversityDataPoint>) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      const methodLabels = METHOD_LABELS as Record<string, string>;

      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900">
            {methodLabels[data.method] || data.method}
          </p>
          <p className="text-sm text-slate-600">
            {payload[0].value?.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const descId = `${title?.replace(/\s+/g, '-').toLowerCase() || 'chart'}-desc`;

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.5 }}
      className="w-full"
      role="img"
      aria-label={`${title} bar chart`}
      aria-describedby={descId}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="method"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: '#475569', fontSize: 12 }}
            tickFormatter={(value) => {
              const methodLabels = METHOD_LABELS as Record<string, string>;
              return methodLabels[value] || value;
            }}
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#475569', fontSize: 12 },
            }}
            tick={{ fill: '#475569', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                const methodLabels = METHOD_LABELS as Record<string, string>;
                return methodLabels[value] || value;
              }}
            />
          )}
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => {
              const methodColors = METHOD_COLORS as Record<string, string>;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={methodColors[entry.method] || '#64748b'}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-slate-500 italic">
        Higher values indicate greater diversity
      </div>
      <p id={descId} className="sr-only">
        This chart compares diversity scores across methods. Higher values mean greater diversity. Use the figure caption for context.
      </p>
    </motion.div>
  );
}

export default memo(DiversityBarChart);
