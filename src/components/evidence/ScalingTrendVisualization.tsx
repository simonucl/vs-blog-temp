import React, { useState } from 'react';
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
  LabelList,
} from 'recharts';
import ChartWrapper from '../ui/ChartWrapper';

// Data from Figure 3e-f in the paper
const scalingData = {
  diversity: [
    {
      model: 'GPT-4.1-Mini',
      size: 'Small',
      Direct: 11.4,
      Sequence: 12.8,
      'Multi-turn': 13.2,
      'VS-Standard': 18.3,
      'VS-CoT': 19.2,
      'VS-Multi': 20.1,
    },
    {
      model: 'GPT-4.1',
      size: 'Large',
      Direct: 11.4,
      Sequence: 15.8,
      'Multi-turn': 16.2,
      'VS-Standard': 24.9,
      'VS-CoT': 26.2,
      'VS-Multi': 27.8,
    },
    {
      model: 'Gemini-2.5-Flash',
      size: 'Small',
      Direct: 12.0,
      Sequence: 13.5,
      'Multi-turn': 14.0,
      'VS-Standard': 19.0,
      'VS-CoT': 20.5,
      'VS-Multi': 21.3,
    },
    {
      model: 'Gemini-2.5-Pro',
      size: 'Large',
      Direct: 12.0,
      Sequence: 16.2,
      'Multi-turn': 17.0,
      'VS-Standard': 25.8,
      'VS-CoT': 27.3,
      'VS-Multi': 28.9,
    },
  ],
  quality: [
    {
      model: 'GPT-4.1-Mini',
      size: 'Small',
      Direct: 62.0,
      'VS-Standard': 60.5,
      'VS-CoT': 61.2,
      'VS-Multi': 61.8,
    },
    {
      model: 'GPT-4.1',
      size: 'Large',
      Direct: 65.0,
      'VS-Standard': 64.8,
      'VS-CoT': 66.2,
      'VS-Multi': 67.1,
    },
    {
      model: 'Gemini-2.5-Flash',
      size: 'Small',
      Direct: 60.0,
      'VS-Standard': 59.5,
      'VS-CoT': 60.8,
      'VS-Multi': 61.2,
    },
    {
      model: 'Gemini-2.5-Pro',
      size: 'Large',
      Direct: 63.0,
      'VS-Standard': 63.2,
      'VS-CoT': 65.1,
      'VS-Multi': 66.3,
    },
  ],
};

interface ScalingTrendVisualizationProps {
  className?: string;
}

export default function ScalingTrendVisualization({ className = '' }: ScalingTrendVisualizationProps) {
  const [selectedMetric, setSelectedMetric] = useState<'diversity' | 'quality'>('diversity');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Calculate gains for small vs large models
  const calculateGains = () => {
    const data = scalingData.diversity;
    const gains = {
      'VS-Standard': {
        small: ((data[0]['VS-Standard'] / data[0].Direct - 1) + (data[2]['VS-Standard'] / data[2].Direct - 1)) / 2,
        large: ((data[1]['VS-Standard'] / data[1].Direct - 1) + (data[3]['VS-Standard'] / data[3].Direct - 1)) / 2,
      },
      'VS-CoT': {
        small: ((data[0]['VS-CoT'] / data[0].Direct - 1) + (data[2]['VS-CoT'] / data[2].Direct - 1)) / 2,
        large: ((data[1]['VS-CoT'] / data[1].Direct - 1) + (data[3]['VS-CoT'] / data[3].Direct - 1)) / 2,
      },
      'VS-Multi': {
        small: ((data[0]['VS-Multi'] / data[0].Direct - 1) + (data[2]['VS-Multi'] / data[2].Direct - 1)) / 2,
        large: ((data[1]['VS-Multi'] / data[1].Direct - 1) + (data[3]['VS-Multi'] / data[3].Direct - 1)) / 2,
      },
    };
    return gains;
  };

  const gains = calculateGains();

  const methodColors = {
    Direct: '#6b7280',
    Sequence: '#3b82f6',
    'Multi-turn': '#8b5cf6',
    'VS-Standard': '#10b981',
    'VS-CoT': '#f59e0b',
    'VS-Multi': '#ef4444',
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">{entry.name}:</span>
              <span className="font-mono font-semibold text-sm">
                {selectedMetric === 'diversity'
                  ? `${entry.value.toFixed(1)}%`
                  : entry.value.toFixed(1)
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Emergent Scaling Trend</h3>
        <p className="text-gray-600">
          Larger models benefit disproportionately more from VS - up to 2× greater gains
        </p>
      </div>

      {/* Metric Selector */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setSelectedMetric('diversity')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === 'diversity'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Diversity Gains
        </button>
        <button
          onClick={() => setSelectedMetric('quality')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === 'quality'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Quality Impact
        </button>
      </div>

      {/* Main Chart */}
      <ChartWrapper>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={scalingData[selectedMetric]}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="model"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{
                  value: selectedMetric === 'diversity' ? 'Diversity Score (%)' : 'Quality Score',
                  angle: -90,
                  position: 'insideLeft',
                }}
                domain={selectedMetric === 'diversity' ? [0, 35] : [55, 70]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />

              {selectedMetric === 'diversity' ? (
                <>
                  <Bar dataKey="Direct" fill={methodColors.Direct} />
                  <Bar dataKey="Sequence" fill={methodColors.Sequence} />
                  <Bar dataKey="Multi-turn" fill={methodColors['Multi-turn']} />
                  <Bar dataKey="VS-Standard" fill={methodColors['VS-Standard']} />
                  <Bar dataKey="VS-CoT" fill={methodColors['VS-CoT']} />
                  <Bar dataKey="VS-Multi" fill={methodColors['VS-Multi']} />
                </>
              ) : (
                <>
                  <Bar dataKey="Direct" fill={methodColors.Direct} />
                  <Bar dataKey="VS-Standard" fill={methodColors['VS-Standard']} />
                  <Bar dataKey="VS-CoT" fill={methodColors['VS-CoT']} />
                  <Bar dataKey="VS-Multi" fill={methodColors['VS-Multi']} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>

      {/* Gain Comparison Cards */}
      {selectedMetric === 'diversity' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(gains).map(([method, values], index) => (
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <h4 className="font-semibold text-lg mb-4" style={{ color: methodColors[method as keyof typeof methodColors] }}>
                {method}
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Small Models</p>
                  <p className="text-2xl font-bold">+{(values.small * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Large Models</p>
                  <p className="text-2xl font-bold text-green-600">+{(values.large * 100).toFixed(0)}%</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Scaling Factor</p>
                  <p className="text-xl font-bold text-blue-600">
                    {(values.large / values.small).toFixed(1)}×
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
          <p className="text-sm font-semibold text-green-900 mb-1">Emergent Capability</p>
          <p className="text-sm text-green-800">
            Larger models (GPT-4, Gemini-Pro) achieve 1.5-2× greater diversity gains from VS
            compared to their smaller counterparts, suggesting VS better leverages advanced model capabilities.
          </p>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
          <p className="text-sm font-semibold text-purple-900 mb-1">Cognitive Burden Reversal</p>
          <p className="text-sm text-purple-800">
            Unlike typical "cognitive burden" where complex prompts hurt performance, VS shows
            the opposite: complexity helps larger models more, turning it into a benefit.
          </p>
        </div>
      </div>
    </div>
  );
}