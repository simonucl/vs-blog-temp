import { motion, useReducedMotion } from 'framer-motion';
import { useRechartsResizeFix } from './useRechartsResizeFix';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type {
  PostTrainingLineChartProps,
  PostTrainingStageData,
  ChartTooltipProps,
} from '@/types/charts';

const METHOD_COLORS = {
  direct: '#94a3b8',    // slate-400
  sequence: '#475569',  // slate-600
  multiturn: '#334155', // slate-700
  vs: '#dc2626',        // red-600 (VS primary)
};

const METHOD_LABELS = {
  direct: 'Direct',
  sequence: 'Sequence',
  multiturn: 'Multi-turn',
  vs: 'VS',
};

export default function PostTrainingLineChart({
  data,
  title,
  subtitle,
  baselineDiversity,
  height = 400,
}: PostTrainingLineChartProps) {
  useRechartsResizeFix();
  const prefersReducedMotion = useReducedMotion();
  const CustomTooltip = ({ active, payload, label }: ChartTooltipProps<PostTrainingStageData>) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600">
                {METHOD_LABELS[entry.name as keyof typeof METHOD_LABELS]}:
              </span>
              <span className="font-medium text-slate-900">
                {entry.value?.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const descId = `${title?.replace(/\s+/g, '-').toLowerCase() || 'line'}-desc`;
  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.5, delay: 0.2 }}
      className="w-full"
      role="img"
      aria-label={`${title} line chart`}
      aria-describedby={descId}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="stage"
            tick={{ fill: '#475569', fontSize: 12 }}
          />
          <YAxis
            label={{
              value: 'Diversity (%)',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#475569', fontSize: 12 },
            }}
            tick={{ fill: '#475569', fontSize: 12 }}
            domain={[0, 50]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => METHOD_LABELS[value as keyof typeof METHOD_LABELS] || value}
          />

          {baselineDiversity && (
            <ReferenceLine
              y={baselineDiversity}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{
                value: 'Base Model',
                position: 'right',
                fill: '#10b981',
                fontSize: 11,
              }}
            />
          )}

          <Line
            type="monotone"
            dataKey="direct"
            stroke={METHOD_COLORS.direct}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="sequence"
            stroke={METHOD_COLORS.sequence}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="multiturn"
            stroke={METHOD_COLORS.multiturn}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="vs"
            stroke={METHOD_COLORS.vs}
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-semibold text-slate-700">Direct retention:</span>
            <span className="ml-2 text-slate-600">23.8% of base diversity</span>
          </div>
          <div>
            <span className="font-semibold text-red-700">VS retention:</span>
            <span className="ml-2 text-red-600 font-medium">66.8% of base diversity</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500 italic">
          VS retains 2.81× more diversity than Direct prompting across post-training stages
        </p>
      </div>
      <p id={descId} className="sr-only">
        This chart shows diversity across training stages for multiple methods. A dashed reference line indicates base model diversity. Higher percentages indicate greater diversity.
      </p>
    </motion.div>
  );
}
