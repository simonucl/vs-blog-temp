import { motion, useReducedMotion } from 'framer-motion';
import { memo, useState } from 'react';
import { useRechartsResizeFix } from './useRechartsResizeFix';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts';
import clsx from 'clsx';
import type { ChartTooltipProps } from '@/types/charts';

const ZERO_THRESH = 1e-5;

type ViewMode = 'all' | 'reference' | 'direct' | 'vs';

interface RankFrequencyDataPoint {
  rank: number;
  stateCode: string;
  stateName: string;
  reference: number;
  direct: number;
  vs: number;
  // Display values (can be threshold for plotting)
  referenceDisplay: number;
  directDisplay: number;
  vsDisplay: number;
}

interface RankFrequencyLineChartProps {
  data: RankFrequencyDataPoint[];
  title: string;
  subtitle?: string;
  height?: number;
  klDivergence?: {
    direct: number;
    vs: number;
  };
}

function RankFrequencyLineChart({
  data,
  title,
  subtitle,
  height = 500,
  klDivergence,
}: RankFrequencyLineChartProps) {
  useRechartsResizeFix();
  const prefersReducedMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  // Apply zero threshold to data - replace zeros with threshold for log scale
  const processedData = data.map((item) => ({
    ...item,
    referenceDisplay: item.reference <= ZERO_THRESH ? ZERO_THRESH : item.reference,
    directDisplay: item.direct <= ZERO_THRESH ? ZERO_THRESH : item.direct,
    vsDisplay: item.vs <= ZERO_THRESH ? ZERO_THRESH : item.vs,
  }));

  const CustomTooltip = ({ active, payload }: ChartTooltipProps<RankFrequencyDataPoint>) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload as RankFrequencyDataPoint;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg max-w-xs pb-2">
          <p className="font-semibold text-slate-900 mb-1">
            #{data.rank} - {data.stateName} ({data.stateCode})
          </p>
          {payload.map((entry, index) => {
            // Get original value for tooltip display
            let originalValue = entry.value ?? 0;
            const dataKey = entry.dataKey as string;
            if (dataKey === 'referenceDisplay' || dataKey === 'reference') originalValue = data.reference;
            if (dataKey === 'directDisplay' || dataKey === 'direct') originalValue = data.direct;
            if (dataKey === 'vsDisplay' || dataKey === 'vs') originalValue = data.vs;
            
            return (
              <div key={index} className="flex items-center justify-between gap-4 text-base">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-600">{entry.name}:</span>
                </div>
                <span className="font-medium text-slate-900">
                  {originalValue === 0 || originalValue < ZERO_THRESH 
                    ? '0' 
                    : (originalValue * 100).toFixed(2) + '%'}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Custom formatter for symlog scale
  const symlogTickFormatter = (value: number) => {
    if (value === 0 || value <= ZERO_THRESH) return "0";
    if (value < 0.001) return value.toExponential(0);
    if (value < 0.01) return value.toFixed(4);
    if (value < 0.1) return value.toFixed(3);
    if (value < 1) return value.toFixed(2);
    return value.toFixed(1);
  };

  // X-axis tick formatter for log scale
  const xTickFormatter = (rank: number) => {
    const item = processedData.find((d) => d.rank === rank);
    return item ? item.stateCode : rank.toString();
  };

  // Show all x ticks (all ranks)
  const xTicks = Array.from({ length: data.length }, (_, i) => i + 1);

  // Y-axis ticks for symlog - now including 1.0
  const yTicks = [ZERO_THRESH, 1e-4, 1e-3, 1e-2, 1e-1, 0.5, 1.0];

  const descId = `${title?.replace(/\s+/g, '-').toLowerCase() || 'rank-frequency'}-desc`;

  // For bar chart (reference only mode)
  const barTickFormatter = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.5, delay: 0.3 }}
      className="w-full"
      role="img"
      aria-label={`${title} ${viewMode === 'reference' ? 'bar' : 'line'} chart`}
      aria-describedby={descId}
    >
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-lg text-slate-600 mt-1">{subtitle}</p>}
      </div>

      {/* View Mode Tabs */}
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="View mode">
        {(['all', 'reference', 'direct', 'vs'] as ViewMode[]).map((mode) => (
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
            {mode === 'reference' && 'Reference Only'}
            {mode === 'direct' && 'Direct - Reference'}
            {mode === 'vs' && 'VS - Reference'}
          </button>
        ))}
      </div>

      {viewMode === 'reference' ? (
        // Bar chart for reference-only mode
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={processedData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            
            <XAxis
              dataKey="stateCode"
              angle={-45}
              textAnchor="end"
              height={65}
              tick={{ fill: '#475569', fontSize: 14 }}
              interval={0}
              tickMargin={10}
            />

            <YAxis
              label={{
                value: 'Probability',
                angle: 0,
                position: 'top',
                offset: 15,
                style: { fill: '#475569', fontSize: 18, textAnchor: 'middle' },
              }}
              tick={{ fill: '#475569', fontSize: 14 }}
              tickFormatter={barTickFormatter}
            />

            <Tooltip content={<CustomTooltip />} />
            
            <Legend
              wrapperStyle={{ paddingTop: '2px', fontSize: '25px' }}
              iconSize={30}
              formatter={(value) => {
                if (value === 'reference') return 'Reference (RedPajama)';
                return value;
              }}
            />

            <Bar 
              dataKey="reference" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
              name="reference"
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        // Line chart for other modes
        <div className="relative">
          {/* KL Divergence Badge */}
          {klDivergence && (viewMode === 'direct' || viewMode === 'vs') && (
            <div className={clsx(
              "absolute -top-12 right-8 z-10 px-4 py-3 rounded-lg shadow-lg border-2",
              viewMode === 'direct' 
                ? "bg-red-50 border-red-300" 
                : "bg-blue-50 border-blue-300"
            )}>
              <div className="text-sm font-medium text-slate-600 mb-1">
                KL Divergence
              </div>
              <div className={clsx(
                "text-3xl font-bold",
                viewMode === 'direct' ? "text-red-700" : "text-blue-700"
              )}>
                {viewMode === 'direct' 
                  ? klDivergence.direct.toFixed(2) 
                  : klDivergence.vs.toFixed(2)}
              </div>
              <div className={clsx(
                "text-xs mt-1",
                viewMode === 'direct' ? "text-red-600" : "text-blue-600"
              )}>
                vs Reference
              </div>
            </div>
          )}
          
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={processedData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              
              {/* Log scale x-axis */}
              <XAxis
                dataKey="rank"
                scale="log"
                domain={[1, data.length]}
                ticks={xTicks}
                tickFormatter={xTickFormatter}
                angle={-45}
                textAnchor="end"
                height={65}
                tick={{ fill: '#475569', fontSize: 18 }}
                type="number"
                interval={0}
                tickMargin={10}
                label={{
                  value: 'US State',
                  position: 'insideBottom',
                  offset: -5,
                  style: { fill: '#475569', fontSize: 25, textAnchor: 'middle' },
                }}
              />

              {/* Log scale y-axis */}
              <YAxis
                scale="log"
                domain={[ZERO_THRESH, 1.2]}
                ticks={yTicks}
                tickFormatter={symlogTickFormatter}
                tick={{ fill: '#475569', fontSize: 18 }}
                type="number"
                allowDataOverflow={false}
                label={{
                  value: 'Predicted Probability (log)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -3,
                  style: { fill: '#475569', fontSize: 20, textAnchor: 'middle' },
                }}
              />

              <Tooltip content={<CustomTooltip />} />
              
              <Legend
                wrapperStyle={{ paddingTop: '4px', fontSize: '25px' }}
                iconSize={40}
                formatter={(value) => {
                  if (value === 'referenceDisplay') return 'Reference (RedPajama)';
                  if (value === 'directDisplay') return 'Direct Prompting';
                  if (value === 'vsDisplay') return 'VS';
                  return value;
                }}
              />

              {/* Vertical line at rank 10 */}
              <ReferenceLine x={10} stroke="#DDDDDD" strokeDasharray="3 3" strokeWidth={1} />

              {/* Line series - using Display values for plotting, matching DistributionChart colors */}
              {(viewMode === 'all' || viewMode === 'direct' || viewMode === 'vs') && (
                <Line
                  type="monotone"
                  dataKey="referenceDisplay"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Reference (RedPajama)"
                  isAnimationActive={false}
                />
              )}
              {(viewMode === 'all' || viewMode === 'direct') && (
                <Line
                  type="monotone"
                  dataKey="directDisplay"
                  stroke="#94a3b8"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Direct Prompting"
                  isAnimationActive={false}
                />
              )}
              {(viewMode === 'all' || viewMode === 'vs') && (
                <Line
                  type="monotone"
                  dataKey="vsDisplay"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="VS"
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p id={descId} className="sr-only">
        {viewMode === 'reference' 
          ? 'Bar chart showing US state reference distribution.'
          : 'Rank-frequency line chart showing US state distributions. X-axis shows ranks on log scale, Y-axis shows probabilities on symlog scale. Three series: Reference (pretraining), Direct (prompting), and VS.'}
      </p>
    </motion.div>
  );
}

export default memo(RankFrequencyLineChart);
