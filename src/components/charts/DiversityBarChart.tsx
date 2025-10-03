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
  Cell,
} from 'recharts';

interface DataPoint {
  method: string;
  value: number;
  category: string;
}

interface DiversityBarChartProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  yAxisLabel?: string;
  height?: number;
  showLegend?: boolean;
}

const METHOD_COLORS: Record<string, string> = {
  direct: '#94a3b8',      // slate-400
  cot: '#64748b',         // slate-500
  sequence: '#475569',    // slate-600
  multiturn: '#334155',   // slate-700
  vs_standard: '#dc2626', // red-600 (primary VS)
  vs_cot: '#b91c1c',      // red-700
  vs_multi: '#991b1b',    // red-800
};

const METHOD_LABELS: Record<string, string> = {
  direct: 'Direct',
  cot: 'CoT',
  sequence: 'Sequence',
  multiturn: 'Multi-turn',
  vs_standard: 'VS-Standard',
  vs_cot: 'VS-CoT',
  vs_multi: 'VS-Multi',
};

export default function DiversityBarChart({
  data,
  title,
  subtitle,
  yAxisLabel = 'Diversity Score (%)',
  height = 400,
  showLegend = true,
}: DiversityBarChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900">
            {METHOD_LABELS[payload[0].payload.method] || payload[0].payload.method}
          </p>
          <p className="text-sm text-slate-600">
            {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
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
            tickFormatter={(value) => METHOD_LABELS[value] || value}
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
              formatter={(value) => METHOD_LABELS[value] || value}
            />
          )}
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={METHOD_COLORS[entry.method] || '#64748b'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-slate-500 italic">
        Higher values indicate greater diversity
      </div>
    </motion.div>
  );
}
