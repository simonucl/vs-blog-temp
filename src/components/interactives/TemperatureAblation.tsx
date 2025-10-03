import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  Dot,
} from 'recharts';
import ChartWrapper from '../ui/ChartWrapper';

// Data from Figure 5 in the paper
const temperatureData = {
  'GPT-4.1': {
    Direct: [
      { temp: 0.4, diversity: 10, quality: 72 },
      { temp: 0.6, diversity: 11, quality: 70 },
      { temp: 0.8, diversity: 12, quality: 68 },
      { temp: 1.0, diversity: 14, quality: 66 },
      { temp: 1.2, diversity: 16, quality: 64 },
      { temp: 1.4, diversity: 18, quality: 60 },
    ],
    Sequence: [
      { temp: 0.4, diversity: 14, quality: 68 },
      { temp: 0.6, diversity: 15, quality: 67 },
      { temp: 0.8, diversity: 16, quality: 66 },
      { temp: 1.0, diversity: 17, quality: 64 },
      { temp: 1.2, diversity: 18, quality: 62 },
      { temp: 1.4, diversity: 20, quality: 58 },
    ],
    'VS-Standard': [
      { temp: 0.4, diversity: 18, quality: 70 },
      { temp: 0.6, diversity: 19, quality: 69 },
      { temp: 0.8, diversity: 20, quality: 68 },
      { temp: 1.0, diversity: 22, quality: 66 },
      { temp: 1.2, diversity: 24, quality: 64 },
      { temp: 1.4, diversity: 26, quality: 61 },
    ],
  },
  'Gemini-2.5-Flash': {
    Direct: [
      { temp: 0.4, diversity: 10, quality: 64 },
      { temp: 0.6, diversity: 11, quality: 63.8 },
      { temp: 0.8, diversity: 12, quality: 63.6 },
      { temp: 1.0, diversity: 13, quality: 63.4 },
      { temp: 1.2, diversity: 14, quality: 63.2 },
      { temp: 1.4, diversity: 16, quality: 63 },
    ],
    Sequence: [
      { temp: 0.4, diversity: 12, quality: 64 },
      { temp: 0.6, diversity: 13, quality: 63.8 },
      { temp: 0.8, diversity: 14, quality: 63.6 },
      { temp: 1.0, diversity: 15, quality: 63.4 },
      { temp: 1.2, diversity: 16, quality: 63.2 },
      { temp: 1.4, diversity: 17, quality: 63 },
    ],
    'VS-Standard': [
      { temp: 0.4, diversity: 16, quality: 64.2 },
      { temp: 0.6, diversity: 17, quality: 64 },
      { temp: 0.8, diversity: 18, quality: 63.8 },
      { temp: 1.0, diversity: 19, quality: 63.6 },
      { temp: 1.2, diversity: 20, quality: 63.4 },
      { temp: 1.4, diversity: 22, quality: 63.2 },
    ],
  },
};

interface TemperatureAblationProps {
  className?: string;
}

export default function TemperatureAblation({ className = '' }: TemperatureAblationProps) {
  const [selectedModel, setSelectedModel] = useState<'GPT-4.1' | 'Gemini-2.5-Flash'>('GPT-4.1');
  const [selectedTemp, setSelectedTemp] = useState(1.0);
  const [showVS, setShowVS] = useState(true);
  const [showDirect, setShowDirect] = useState(true);
  const [showSequence, setShowSequence] = useState(false);

  const chartData = useMemo(() => {
    const modelData = temperatureData[selectedModel];
    const combined = [];

    // Create Pareto front data
    for (let i = 0; i < modelData.Direct.length; i++) {
      combined.push({
        diversity: modelData.Direct[i].diversity,
        qualityDirect: modelData.Direct[i].quality,
        qualitySequence: modelData.Sequence[i].quality,
        qualityVS: modelData['VS-Standard'][i].quality,
        temp: modelData.Direct[i].temp,
      });
    }

    return combined;
  }, [selectedModel]);

  const selectedData = useMemo(() => {
    const modelData = temperatureData[selectedModel];
    const tempIndex = modelData.Direct.findIndex(d => d.temp === selectedTemp);

    if (tempIndex === -1) return null;

    return {
      Direct: modelData.Direct[tempIndex],
      Sequence: modelData.Sequence[tempIndex],
      'VS-Standard': modelData['VS-Standard'][tempIndex],
    };
  }, [selectedModel, selectedTemp]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Temperature vs. VS: Orthogonal Benefits</h3>
        <p className="text-gray-600">
          VS performance gains are independent of temperature - they can be combined for even better results
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Model selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Model</label>
            <div className="flex gap-2">
              {(['GPT-4.1', 'Gemini-2.5-Flash'] as const).map(model => (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedModel === model
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature slider */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Temperature: <span className="font-mono font-bold">{selectedTemp.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min={0.4}
              max={1.4}
              step={0.2}
              value={selectedTemp}
              onChange={(e) => setSelectedTemp(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.4</span>
              <span>0.8</span>
              <span>1.2</span>
            </div>
          </div>
        </div>

        {/* Method toggles */}
        <div>
          <label className="block text-sm font-medium mb-2">Show Methods</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDirect}
                onChange={(e) => setShowDirect(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Direct</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showSequence}
                onChange={(e) => setShowSequence(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Sequence</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showVS}
                onChange={(e) => setShowVS(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-semibold text-blue-600">VS-Standard</span>
            </label>
          </div>
        </div>
      </div>

      {/* Pareto Front Chart */}
      <ChartWrapper>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold mb-4">Diversity-Quality Trade-off</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="diversity"
                label={{ value: 'Diversity Score', position: 'insideBottom', offset: -5 }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <YAxis
                label={{ value: 'Quality Score', angle: -90, position: 'insideLeft' }}
                domain={[55, 75]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="text-sm font-semibold mb-1">Temperature: {data.temp}</p>
                        <p className="text-sm">Diversity: {data.diversity}</p>
                        {showDirect && <p className="text-sm text-gray-600">Direct Quality: {data.qualityDirect}</p>}
                        {showSequence && <p className="text-sm text-blue-600">Sequence Quality: {data.qualitySequence}</p>}
                        {showVS && <p className="text-sm text-green-600">VS Quality: {data.qualityVS}</p>}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />

              {showDirect && (
                <Line
                  type="monotone"
                  dataKey="qualityDirect"
                  stroke="#6b7280"
                  strokeWidth={2}
                  name="Direct"
                  dot={{ r: 4 }}
                />
              )}

              {showSequence && (
                <Line
                  type="monotone"
                  dataKey="qualitySequence"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Sequence"
                  dot={{ r: 4 }}
                />
              )}

              {showVS && (
                <Line
                  type="monotone"
                  dataKey="qualityVS"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="VS-Standard"
                  dot={{ r: 5, fill: '#10b981' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>

      {/* Comparison Cards */}
      {selectedData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showDirect ? 1 : 0.5, y: 0 }}
            className={`bg-white rounded-lg p-4 border ${showDirect ? 'border-gray-300' : 'border-gray-200 opacity-50'}`}
          >
            <h5 className="font-semibold text-gray-900 mb-2">Direct</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Diversity:</span>
                <span className="font-mono font-semibold">{selectedData.Direct.diversity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quality:</span>
                <span className="font-mono font-semibold">{selectedData.Direct.quality}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showSequence ? 1 : 0.5, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white rounded-lg p-4 border ${showSequence ? 'border-blue-300' : 'border-gray-200 opacity-50'}`}
          >
            <h5 className="font-semibold text-blue-900 mb-2">Sequence</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Diversity:</span>
                <span className="font-mono font-semibold">{selectedData.Sequence.diversity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quality:</span>
                <span className="font-mono font-semibold">{selectedData.Sequence.quality}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showVS ? 1 : 0.5, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white rounded-lg p-4 border-2 ${showVS ? 'border-green-400 shadow-lg' : 'border-gray-200 opacity-50'}`}
          >
            <h5 className="font-semibold text-green-900 mb-2">VS-Standard ✨</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Diversity:</span>
                <span className="font-mono font-semibold text-green-600">
                  {selectedData['VS-Standard'].diversity}
                  <span className="text-xs text-green-500 ml-1">
                    (+{((selectedData['VS-Standard'].diversity / selectedData.Direct.diversity - 1) * 100).toFixed(0)}%)
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quality:</span>
                <span className="font-mono font-semibold">{selectedData['VS-Standard'].quality}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Key Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm font-semibold text-blue-900 mb-1">Key Insight</p>
            <p className="text-sm text-blue-800">
              VS consistently outperforms baseline methods across all temperature settings.
              Combining VS with temperature tuning (e.g., VS at t=1.2) pushes the Pareto frontier
              further than either technique alone, proving they are orthogonal improvements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}