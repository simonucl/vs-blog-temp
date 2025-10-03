import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Equation from '@/components/academic/Equation';

export default function TypicalityBiasExplainer() {
  const [epsilon, setEpsilon] = useState(0.3);
  const [beta, setBeta] = useState(0.15);

  // Calculate rho
  const rho = 1 + epsilon / beta;

  // Generate sample distribution data for visualization
  const generateDistribution = (sharpness: number) => {
    const items = ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Other'];
    const baseProbs = [0.20, 0.15, 0.12, 0.18, 0.08, 0.09, 0.08, 0.10];

    // Apply sharpening: raise to power of sharpness and renormalize
    const sharpenedProbs = baseProbs.map(p => Math.pow(p, sharpness));
    const sum = sharpenedProbs.reduce((a, b) => a + b, 0);
    const normalized = sharpenedProbs.map(p => p / sum);

    return items.map((item, i) => ({
      name: item,
      before: baseProbs[i] * 100,
      after: normalized[i] * 100,
    }));
  };

  const distributionData = generateDistribution(rho);

  const getSharpnessLevel = () => {
    if (rho < 1.5) return { label: 'Minimal', color: 'text-green-700', bg: 'bg-green-50' };
    if (rho < 2.5) return { label: 'Moderate', color: 'text-yellow-700', bg: 'bg-yellow-50' };
    if (rho < 4) return { label: 'High', color: 'text-orange-700', bg: 'bg-orange-50' };
    return { label: 'Extreme', color: 'text-red-700', bg: 'bg-red-50' };
  };

  const sharpness = getSharpnessLevel();

  const dynamicLatex = useMemo(() => {
    return `\\rho = 1 + ${epsilon.toFixed(2)} / ${beta.toFixed(2)} = ${rho.toFixed(2)}`;
  }, [epsilon, beta, rho]);

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Understanding Typicality Bias
        </h2>
        <p className="text-slate-600">
          The core mechanism behind VS: aligned models sharpen distributions through{' '}
          <span className="font-semibold text-red-600">ρ = 1 + ε/β</span>, where ε is the typicality bias
          and β is the KL penalty coefficient.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md border border-slate-200">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-slate-700">
                  ε (Typicality Bias)
                </label>
                <span className="text-2xl font-mono font-bold text-blue-600">
                  {epsilon.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={epsilon}
                onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <p className="text-sm text-slate-600 mt-2">
                How much the model prefers "typical" outputs. Higher ε = stronger preference
                for common patterns.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-slate-700">
                  β (KL Coefficient)
                </label>
                <span className="text-2xl font-mono font-bold text-green-600">
                  {beta.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-full h-3 bg-green-100 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <p className="text-sm text-slate-600 mt-2">
                Regularization strength during alignment. Lower β = less constraint on
                staying close to base model.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md border border-slate-200">
          <div className="text-center mb-4">
            <div className="text-sm font-semibold text-slate-600 mb-2">
              Distribution Sharpening Factor
            </div>
            <motion.div
              key={rho}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`inline-block px-6 py-3 rounded-lg ${sharpness.bg}`}
            >
              <div className="text-5xl font-bold text-slate-900 font-mono">
                ρ = {rho.toFixed(2)}
              </div>
            </motion.div>
            <div className={`mt-3 text-lg font-semibold ${sharpness.color}`}>
              {sharpness.label} Sharpening
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2 text-sm">
              The Equation
            </h4>
            <div className="text-center py-3">
              <Equation id="typicality-dynamic" displayMode>
                {dynamicLatex}
              </Equation>
            </div>
            <p className="text-xs text-slate-600 mt-3">
              When ρ &gt; 1, the model's distribution is sharpened (mode collapse).
              VS exploits this by verbalizing to access the less-sharpened base model.
            </p>
          </div>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Distribution Impact: Before vs After Alignment
        </h3>

        <div className="space-y-3">
          {distributionData.map((item, idx) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 w-24 text-right">
                  {item.name}
                </span>
                <div className="flex-1 flex gap-2 items-center">
                  {/* Before bar */}
                  <div className="flex-1 max-w-xs">
                    <div className="h-8 bg-slate-100 rounded relative overflow-hidden">
                      <motion.div
                        className="h-full bg-slate-400 flex items-center justify-end pr-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.before, 100)}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                      >
                        {item.before > 5 && (
                          <span className="text-xs font-semibold text-white">
                            {item.before.toFixed(1)}%
                          </span>
                        )}
                      </motion.div>
                    </div>
                    {item.before <= 5 && (
                      <span className="text-xs text-slate-600 ml-1">
                        {item.before.toFixed(1)}%
                      </span>
                    )}
                  </div>

                  <div className="text-slate-400 px-2">→</div>

                  {/* After bar */}
                  <div className="flex-1 max-w-xs">
                    <div className="h-8 bg-red-50 rounded relative overflow-hidden">
                      <motion.div
                        className="h-full bg-red-600 flex items-center justify-end pr-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.after, 100)}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                      >
                        {item.after > 5 && (
                          <span className="text-xs font-semibold text-white">
                            {item.after.toFixed(1)}%
                          </span>
                        )}
                      </motion.div>
                    </div>
                    {item.after <= 5 && (
                      <span className="text-xs text-red-600 ml-1">
                        {item.after.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-400 rounded"></div>
            <span className="text-slate-600">Base Model (ρ = 1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-slate-600">After Alignment (ρ = {rho.toFixed(2)})</span>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <svg
              className="flex-shrink-0 text-blue-600 mt-0.5"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Why This Matters
              </h4>
              <p className="text-sm text-blue-800">
                Higher ρ means more mode collapse. Alignment (RLHF/DPO) introduces typicality
                bias ε while using small KL penalties β, leading to ρ &gt; 1. This explains
                why aligned models produce less diverse outputs.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start gap-3">
            <svg
              className="flex-shrink-0 text-red-600 mt-0.5"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-red-900 mb-1">
                VS Solution
              </h4>
              <p className="text-sm text-red-800">
                VS bypasses this sharpening by prompting the model to verbalize reasoning
                <em> before</em> committing to an answer. This accesses the base model's
                broader distribution (ρ ≈ 1) instead of the sharpened aligned distribution.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm text-slate-700">
          <strong>Source:</strong> §3.1 and Theorem 1 of the preprint (pp. 4-5).
          Try adjusting the sliders to see how different ε and β values affect the sharpening
          factor ρ and the resulting distribution.
        </p>
      </div>
    </div>
  );
}
