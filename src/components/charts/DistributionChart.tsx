import { motion } from 'framer-motion';
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

interface DistributionDataPoint {
  name: string;
  pretraining?: number;
  direct?: number;
  vs?: number;
}

interface DistributionChartProps {
  data: DistributionDataPoint[];
  title: string;
  subtitle?: string;
  klDivergence?: {
    direct: number;
    vs: number;
  };
  height?: number;
}

type ViewMode = 'all' | 'pretraining' | 'direct' | 'vs';

export default function DistributionChart({
  data,
  title,
  subtitle,
  klDivergence,
  height = 500,
}: DistributionChartProps) {
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600 capitalize">
                  {entry.name === 'pretraining' ? 'Reference' : entry.name}:
                </span>
              </div>
              <span className="font-medium text-slate-900">
                {(entry.value * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
        )}
      </div>

      {/* View Mode Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'pretraining', 'direct', 'vs'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              viewMode === mode
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            {mode === 'all' && 'Compare All'}
            {mode === 'pretraining' && 'Pretraining Only'}
            {mode === 'direct' && 'Direct vs Reference'}
            {mode === 'vs' && 'VS vs Reference'}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: '#475569', fontSize: 10 }}
            interval={0}
          />
          <YAxis
            label={{
              value: 'Probability',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#475569', fontSize: 12 },
            }}
            tick={{ fill: '#475569', fontSize: 12 }}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) => {
              if (value === 'pretraining') return 'Reference (RedPajama)';
              if (value === 'direct') return 'Direct Prompting';
              if (value === 'vs') return 'VS';
              return value;
            }}
          />
          {viewMode !== 'direct' && viewMode !== 'vs' && (
            <Bar dataKey="pretraining" fill="#10b981" radius={[4, 4, 0, 0]} />
          )}
          {(viewMode === 'all' || viewMode === 'direct') && (
            <Bar dataKey="direct" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          )}
          {(viewMode === 'all' || viewMode === 'vs') && (
            <Bar dataKey="vs" fill="#dc2626" radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>

      {/* KL Divergence Display */}
      {klDivergence && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Direct Prompting</div>
            <div className="text-2xl font-bold text-slate-700">
              KL = {klDivergence.direct.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              High divergence → mode collapse
            </div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-sm text-red-600 mb-1">VS</div>
            <div className="text-2xl font-bold text-red-700">
              KL = {klDivergence.vs.toFixed(2)}
            </div>
            <div className="text-xs text-red-600 mt-1">
              Low divergence → close alignment with pretraining
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-slate-500 italic">
        Lower KL divergence indicates better alignment with the reference distribution (RedPajama corpus)
      </div>
    </motion.div>
  );
}
