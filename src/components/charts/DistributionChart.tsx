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
} from 'recharts';
import { useState } from 'react';
import clsx from 'clsx';
import type {
  DistributionChartProps,
  DistributionDataPoint,
  ChartTooltipProps,
} from '@/types/charts';

type ViewMode = 'all' | 'pretraining' | 'direct' | 'vs';

function DistributionChart({
  data,
  title,
  subtitle,
  klDivergence,
  height = 500,
}: DistributionChartProps) {
  useRechartsResizeFix();
  const prefersReducedMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const filteredData = data.map((item) => {
    if (viewMode === 'all') return item;
    if (viewMode === 'pretraining') {
      return { name: item.name, pretraining: item.pretraining };
    }
    if (viewMode === 'direct') {
      return { name: item.name, direct: item.direct, pretraining: item.pretraining };
    }
    return { name: item.name, vs: item.vs, pretraining: item.pretraining };
  });

  const CustomTooltip = ({ active, payload, label }: ChartTooltipProps<DistributionDataPoint>) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-base">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600">
                  {entry.name === 'pretraining' ? 'Reference' : entry.name === 'vs' ? 'VS' : entry.name === 'direct' ? 'Direct' : entry.name}:
                </span>
              </div>
              <span className="font-medium text-slate-900">
                {((entry.value ?? 0) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const descId = `${title?.replace(/\s+/g, '-').toLowerCase() || 'distribution'}-desc`;
  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.5, delay: 0.3 }}
      className="w-full"
      role="img"
      aria-label={`${title} bar chart`}
      aria-describedby={descId}
    >
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-lg text-slate-600 mt-1">{subtitle}</p>
        )}
      </div>

      {/* View Mode Tabs */}
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="View mode">
        {(['all', 'pretraining', 'direct', 'vs'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={clsx(
              'px-4 py-2 rounded-lg text-base font-medium transition-all border focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-accent focus-visible:outline-offset-2',
              viewMode === mode
                ? 'bg-red-600 text-white shadow-md border-red-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
            )}
            aria-pressed={viewMode === mode}
          >
            {mode === 'all' && 'Compare All'}
            {mode === 'pretraining' && 'Reference Only'}
            {mode === 'direct' && 'Direct ⚔️ Reference'}
            {mode === 'vs' && 'VS ⚔️ Reference'}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={filteredData}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fill: '#475569', fontSize: 18 }}
            interval={0}
          />
          <YAxis
            label={{
              value: 'Probability',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#475569', fontSize: 22 },
            }}
            tick={{ fill: '#475569', fontSize: 18 }}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '4px' }}
            formatter={(value) => {
              if (value === 'pretraining') return 'Reference (RedPajama)';
              if (value === 'direct') return 'Direct Prompting';
              if (value === 'vs') return 'VS';
              return value;
            }}
          />
          {/* Pretraining (Reference) bar - always first */}
          {(viewMode === 'all' || viewMode === 'pretraining' || viewMode === 'direct' || viewMode === 'vs') && (
            <Bar dataKey="pretraining" fill="#10b981" radius={[4, 4, 0, 0]} />
          )}
          {/* Direct bar - second position */}
          {(viewMode === 'all' || viewMode === 'direct') && (
            <Bar dataKey="direct" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          )}
          {/* VS bar - third position */}
          {(viewMode === 'all' || viewMode === 'vs') && (
            <Bar dataKey="vs" fill="#dc2626" radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>

      {/* KL Divergence Display */}
      {klDivergence && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-lg text-slate-600 mb-1">Direct Prompting</div>
            <div className="text-2xl font-bold text-slate-700">
              KL = {klDivergence.direct.toFixed(2)}
            </div>
            <div className="text-base text-slate-500 mt-1">
              High divergence → mode collapse
            </div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-lg text-red-600 mb-1">VS</div>
            <div className="text-2xl font-bold text-red-700">
              KL = {klDivergence.vs.toFixed(2)}
            </div>
            <div className="text-base text-red-600 mt-1">
              Low divergence → close alignment with pretraining
            </div>
          </div>
        </div>
      )}

      <p id={descId} className="sr-only">
        This chart compares the distribution over US states for pretraining, direct prompting, and VS. Use the tabs to filter series. Lower KL divergence indicates closer match to pretraining.
      </p>
    </motion.div>
  );
}

export default memo(DistributionChart);
