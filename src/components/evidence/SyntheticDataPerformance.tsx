import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Legend
} from 'recharts';
import { Database, Award, ArrowUpRight } from 'lucide-react';

// Data from Table 4 in the paper
const performanceData = [
  {
    method: 'Baseline',
    accuracy: 32.8,
    description: 'No synthetic data',
    color: '#94a3b8'
  },
  {
    method: 'Direct',
    accuracy: 30.6,
    description: 'Mode-collapsed synthetic data',
    color: '#ef4444'
  },
  {
    method: 'CoT',
    accuracy: 33.7,
    description: 'Chain-of-thought generation',
    color: '#f59e0b'
  },
  {
    method: 'Sequence',
    accuracy: 34.3,
    description: 'List-based generation',
    color: '#eab308'
  },
  {
    method: 'Multi-Turn',
    accuracy: 33.2,
    description: 'Multi-turn conversation',
    color: '#84cc16'
  },
  {
    method: 'VS-Standard',
    accuracy: 36.1,
    description: 'Basic VS with probabilities',
    color: '#10b981'
  },
  {
    method: 'VS-CoT',
    accuracy: 36.9,
    description: 'VS with reasoning',
    color: '#06b6d4'
  },
  {
    method: 'VS-Multi',
    accuracy: 37.5,
    description: 'Multi-turn VS',
    color: '#3b82f6'
  }
];

const benchmarkData = [
  { name: 'MATH500', baseline: 27.2, vsMulti: 34.8, improvement: 27.9 },
  { name: 'OlympiadBench', baseline: 30.5, vsMulti: 34.9, improvement: 14.4 },
  { name: 'Minerva Math', baseline: 40.7, vsMulti: 45.0, improvement: 10.6 }
];

const modelComparison = [
  { model: 'Qwen2.5-7B', baseline: 27.2, direct: 26.1, vs: 34.8 },
  { model: 'Q3-1.7B-Base', baseline: 30.5, direct: 31.4, vs: 34.9 },
  { model: 'Q3-4B-Base', baseline: 40.7, direct: 34.5, vs: 45.0 }
];

export default function SyntheticDataPerformance() {
  const [viewMode, setViewMode] = useState<'overview' | 'benchmarks' | 'models'>('overview');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-sm">{label || data.method}</p>
          <p className="text-sm mt-1">
            Accuracy: <span className="font-bold text-blue-600">{payload[0].value}%</span>
          </p>
          {data.description && (
            <p className="text-xs text-slate-500 mt-1">{data.description}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="my-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full">
            <Database className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-900 dark:text-purple-100">
              Real-World Impact
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-slate-100">
            VS Improves Synthetic Data Quality
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Diverse synthetic data generated with VS improves downstream math performance
            from <span className="font-bold text-red-600">32.8%</span> to <span className="font-bold text-blue-600">37.5%</span> accuracy
          </p>
        </motion.div>

        {/* View mode tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            {(['overview', 'benchmarks', 'models'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                  viewMode === mode
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {mode === 'overview' ? 'Overall Impact' : mode}
              </button>
            ))}
          </div>
        </div>

        {viewMode === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Main performance chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold mb-4 text-center">
                Downstream Math Accuracy with Different Synthetic Data Generation Methods
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="method"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    domain={[25, 40]}
                    label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <ReferenceLine y={32.8} stroke="#666" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center mt-2 text-slate-500">
                Dashed line shows baseline performance without synthetic data
              </p>
            </div>

            {/* Key findings */}
            <div className="grid md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-5 border border-red-200 dark:border-red-800"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="font-semibold mb-1 text-red-900 dark:text-red-100">
                      Mode Collapse Hurts
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      Direct prompting creates repetitive data, actually <strong>decreasing</strong> performance to 30.6%
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-5 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h4 className="font-semibold mb-1 text-green-900 dark:text-green-100">
                      VS Creates Quality Data
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      All VS variants improve performance, with VS-Multi reaching <strong>37.5%</strong> accuracy
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <h4 className="font-semibold mb-1 text-blue-900 dark:text-blue-100">
                      14.3% Improvement
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      VS-Multi achieves <strong>4.7 percentage points</strong> higher accuracy than baseline
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {viewMode === 'benchmarks' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <h3 className="font-semibold mb-4 text-center">Performance Across Math Benchmarks</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={benchmarkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" fill="#94a3b8" name="Baseline" />
                <Bar dataKey="vsMulti" fill="#3b82f6" name="VS-Multi" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              {benchmarkData.map((bench) => (
                <div key={bench.name} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <h5 className="font-medium text-sm text-slate-700 dark:text-slate-300">
                    {bench.name}
                  </h5>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                    <span className="text-lg font-bold text-green-600">
                      +{bench.improvement.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {viewMode === 'models' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <h3 className="font-semibold mb-4 text-center">Impact Across Different Model Sizes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="model" />
                <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" fill="#94a3b8" name="Baseline" />
                <Bar dataKey="direct" fill="#ef4444" name="Direct (Mode Collapsed)" />
                <Bar dataKey="vs" fill="#3b82f6" name="VS-Multi" />
              </BarChart>
            </ResponsiveContainer>

            <p className="text-sm text-center mt-4 text-slate-600 dark:text-slate-400">
              VS consistently outperforms both baseline and direct prompting across all model sizes
            </p>
          </motion.div>
        )}

        {/* Implications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800"
        >
          <div className="flex items-start gap-3">
            <Award className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">
                Why This Matters
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                This demonstrates that VS has real downstream benefits beyond just creative tasks.
                The diversity of synthetic training data directly impacts model performance.
              </p>
              <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                <li>• Use VS when generating synthetic training data</li>
                <li>• Diversity in data leads to better generalization</li>
                <li>• Mode-collapsed data can actually harm performance</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}