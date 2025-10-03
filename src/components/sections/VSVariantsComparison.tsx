import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeBlock from '../ui/CodeBlock';

interface Variant {
  name: string;
  keyword: 'probability' | 'confidence';
  description: string;
  whenToUse: string[];
  performance: {
    diversity: number;
    quality: number;
    complexity: 'Low' | 'Medium' | 'High';
  };
  example: string;
  pros: string[];
  cons: string[];
}

const variants: Variant[] = [
  {
    name: 'VS-Standard',
    keyword: 'probability',
    description: 'Basic distribution request using explicit probability values',
    whenToUse: [
      'Quick diversity boost needed',
      'Simple creative tasks',
      'Baseline VS implementation',
    ],
    performance: {
      diversity: 1.6,
      quality: 0.98,
      complexity: 'Low',
    },
    example: `Generate 5 jokes about coffee with their probabilities.
Return as JSON: {"candidates": [{"text": "...", "prob": 0.3}, ...]}
Ensure probabilities sum to 1.0.`,
    pros: [
      'Simple to implement',
      'Consistent results',
      'Works with all models',
    ],
    cons: [
      'Less diversity than advanced variants',
      'No reasoning process',
    ],
  },
  {
    name: 'VS-CoT',
    keyword: 'probability',
    description: 'Enhanced with Chain-of-Thought reasoning before generation',
    whenToUse: [
      'Complex creative tasks',
      'Need higher quality outputs',
      'When diversity categories matter',
    ],
    performance: {
      diversity: 1.8,
      quality: 1.02,
      complexity: 'Medium',
    },
    example: `Think step-by-step about different styles and approaches for jokes about coffee.
Consider puns, observational humor, absurdist takes, etc.
Then generate 5 jokes with their probabilities.
Return as JSON with probabilities summing to 1.0.`,
    pros: [
      'Better quality outputs',
      'More intentional diversity',
      'Reasoning trace available',
    ],
    cons: [
      'Slightly slower',
      'More tokens consumed',
    ],
  },
  {
    name: 'VS-Multi',
    keyword: 'confidence',
    description: 'Multi-turn generation using confidence scores for maximum diversity',
    whenToUse: [
      'Maximum diversity needed',
      'Large-scale generation',
      'Synthetic data creation',
    ],
    performance: {
      diversity: 2.1,
      quality: 1.0,
      complexity: 'High',
    },
    example: `Turn 1: Generate 5 jokes about coffee with confidence scores [0,1].
Turn 2: Generate 5 MORE different jokes with confidence scores.
Turn 3: Continue with 5 additional unique jokes...
Filter by confidence ≥ 0.2.`,
    pros: [
      'Highest diversity',
      'Avoids repetition across turns',
      'Best for large datasets',
    ],
    cons: [
      'Multiple API calls required',
      'More complex implementation',
    ],
  },
];

export default function VSVariantsComparison({ className = '' }: { className?: string }) {
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [showCode, setShowCode] = useState(false);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">VS Variants: Choose Your Strategy</h3>
        <p className="text-gray-600">
          Different variants optimize for different use cases - all use specific keywords for best results
        </p>
      </div>

      {/* Quick Comparison Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keyword
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diversity Gain
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quality
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Complexity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Best For
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {variants.map((variant, index) => (
              <tr
                key={variant.name}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedVariant === index ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedVariant(index)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{variant.name}</span>
                    {index === 0 && (
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {variant.keyword}
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-green-600">
                    {variant.performance.diversity}×
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm">
                    {(variant.performance.quality * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      variant.performance.complexity === 'Low'
                        ? 'bg-green-100 text-green-800'
                        : variant.performance.complexity === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {variant.performance.complexity}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {variant.whenToUse[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedVariant}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold text-gray-900">
                {variants[selectedVariant].name}
              </h4>
              <p className="text-gray-600 mt-1">
                {variants[selectedVariant].description}
              </p>
            </div>
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {showCode ? 'Hide' : 'Show'} Code
            </button>
          </div>

          {/* When to Use */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">When to Use</h5>
            <ul className="space-y-1">
              {variants[selectedVariant].whenToUse.map((use, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-sm text-gray-600">{use}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Advantages</h5>
              <ul className="space-y-1">
                {variants[selectedVariant].pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">+</span>
                    <span className="text-sm text-gray-600">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Considerations</h5>
              <ul className="space-y-1">
                {variants[selectedVariant].cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">−</span>
                    <span className="text-sm text-gray-600">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Example Code */}
          {showCode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Example Prompt</h5>
              <CodeBlock
                code={variants[selectedVariant].example}
                language="text"
                showLineNumbers={false}
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Important Note */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-yellow-800 mb-1">
              Keyword Choice Matters (Appendix H.3)
            </p>
            <p className="text-sm text-yellow-700">
              The paper found that using "probability" works best for VS-Standard and VS-CoT,
              while "confidence" performs better for VS-Multi. This subtle difference can impact
              performance by up to 15%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}