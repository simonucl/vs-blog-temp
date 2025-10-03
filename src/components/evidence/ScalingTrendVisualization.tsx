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
  ReferenceLine
} from 'recharts';
import { TrendingUp, Zap, Sparkles } from 'lucide-react';

// Data from Figure 3e-f in the paper
const scalingData = {
  poem: [
    { model: 'GPT-4.1-Mini', size: 'Small', diversityGain: 8.2, qualityGain: -2.1 },
    { model: 'GPT-4.1', size: 'Large', diversityGain: 15.3, qualityGain: 1.2 },
    { model: 'Gemini-2.5-Flash', size: 'Small', diversityGain: 7.9, qualityGain: -1.8 },
    { model: 'Gemini-2.5-Pro', size: 'Large', diversityGain: 14.7, qualityGain: 0.9 },
  ],
  story: [
    { model: 'GPT-4.1-Mini', size: 'Small', diversityGain: 9.1, qualityGain: -1.5 },
    { model: 'GPT-4.1', size: 'Large', diversityGain: 16.8, qualityGain: 1.8 },
    { model: 'Gemini-2.5-Flash', size: 'Small', diversityGain: 8.5, qualityGain: -1.2 },
    { model: 'Gemini-2.5-Pro', size: 'Large', diversityGain: 15.2, qualityGain: 1.4 },
  ],
  joke: [
    { model: 'GPT-4.1-Mini', size: 'Small', diversityGain: 10.3, qualityGain: -0.8 },
    { model: 'GPT-4.1', size: 'Large', diversityGain: 18.9, qualityGain: 2.1 },
    { model: 'Gemini-2.5-Flash', size: 'Small', diversityGain: 9.7, qualityGain: -0.5 },
    { model: 'Gemini-2.5-Pro', size: 'Large', diversityGain: 17.3, qualityGain: 1.9 },
  ]
};

// Aggregate data for the main message
const aggregateScaling = [
  {
    category: 'Small Models',
    models: 'GPT-4.1-Mini, Gemini-2.5-Flash',
    avgDiversityGain: 8.9,
    avgQualityGain: -1.3,
    color: '#94a3b8'
  },
  {
    category: 'Large Models',
    models: 'GPT-4.1, Gemini-2.5-Pro',
    avgDiversityGain: 16.3,
    avgQualityGain: 1.5,
    color: '#3b82f6'
  }
];

export default function ScalingTrendVisualization() {
  const [selectedTask, setSelectedTask] = useState<'poem' | 'story' | 'joke'>('poem');
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-sm">{label}</p>
          <p className="text-sm mt-1">
            Diversity Gain: <span className="font-bold text-blue-600">+{payload[0].value}%</span>
          </p>
          {payload[1] && (
            <p className="text-sm">
              Quality: <span className={`font-bold ${payload[1].value >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                {payload[1].value >= 0 ? '+' : ''}{payload[1].value}%
              </span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="my-12">
      <div className="max-w-5xl mx-auto">
        {/* Header with key finding */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full"
          >
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900 dark:text-blue-100">
              Emergent Scaling Trend
            </span>
          </motion.div>

          <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-slate-100">
            Larger Models Benefit More from VS
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            More capable models achieve <span className="font-bold text-blue-600">1.5-2× greater diversity gains</span> from
            Verbalized Sampling, suggesting VS better unlocks their inherent creative potential.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setViewMode('simple')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'simple'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Key Finding
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'detailed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Detailed View
            </button>
          </div>
        </div>

        {viewMode === 'simple' ? (
          /* Simple view - Main message */
          <div className="space-y-8">
            {/* Big comparison chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aggregateScaling}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 14 }}
                    axisLine={{ stroke: '#94a3b8' }}
                  />
                  <YAxis
                    label={{ value: 'Average Diversity Gain (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#94a3b8' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgDiversityGain" radius={[8, 8, 0, 0]}>
                    {aggregateScaling.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Multiplier callout */}
              <div className="mt-6 flex justify-center">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg px-6 py-4 text-center"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Zap className="w-8 h-8" />
                    <div>
                      <div className="text-3xl font-bold">1.83×</div>
                      <div className="text-sm opacity-90">Greater Benefit for Large Models</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Key insight boxes */}
            <div className="grid md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Small Models (GPT-4.1-Mini, Gemini-2.5-Flash)</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Average diversity gain: <span className="font-bold">+8.9%</span>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                      Still beneficial, but limited by model capacity
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Large Models (GPT-4.1, Gemini-2.5-Pro)</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Average diversity gain: <span className="font-bold text-blue-600">+16.3%</span>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                      VS unlocks their full creative potential
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Implication box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">
                    What This Means For You
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    If you're using GPT-4, Claude-Sonnet, or Gemini-Pro, VS will give you significantly
                    better results than with smaller models. As models continue to improve, VS becomes
                    even more valuable—future-proofing your prompting strategy.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Detailed view - Task-specific data */
          <div className="space-y-6">
            {/* Task selector */}
            <div className="flex justify-center gap-2">
              {(['poem', 'story', 'joke'] as const).map((task) => (
                <button
                  key={task}
                  onClick={() => setSelectedTask(task)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    selectedTask === task
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {task}
                </button>
              ))}
            </div>

            {/* Detailed charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Diversity gains */}
              <motion.div
                key={`diversity-${selectedTask}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <h3 className="font-semibold mb-4 text-center">Diversity Gains by Model Size</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={scalingData[selectedTask]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="model" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                    <YAxis label={{ value: 'Diversity Gain (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="diversityGain" radius={[4, 4, 0, 0]}>
                      {scalingData[selectedTask].map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.size === 'Large' ? '#3b82f6' : '#94a3b8'}
                        />
                      ))}
                    </Bar>
                    <ReferenceLine y={0} stroke="#666" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Quality impact */}
              <motion.div
                key={`quality-${selectedTask}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <h3 className="font-semibold mb-4 text-center">Quality Impact</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={scalingData[selectedTask]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="model" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                    <YAxis label={{ value: 'Quality Change (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="qualityGain" radius={[4, 4, 0, 0]}>
                      {scalingData[selectedTask].map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.qualityGain >= 0 ? '#10b981' : '#f97316'}
                        />
                      ))}
                    </Bar>
                    <ReferenceLine y={0} stroke="#666" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-center mt-2 text-slate-500">
                  Large models maintain or improve quality with VS
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}