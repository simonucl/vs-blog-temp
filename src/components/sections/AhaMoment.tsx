import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, Sparkles, Target, Layers } from 'lucide-react';
import Equation from '@/components/academic/Equation';

interface PromptType {
  level: 'instance' | 'list' | 'distribution';
  prompt: string;
  output: string;
  mode: string;
  explanation: string;
  icon: React.ReactNode;
  color: string;
}

const promptTypes: PromptType[] = [
  {
    level: 'instance',
    prompt: 'Tell me a joke about coffee',
    output: 'Why did the coffee file a police report? It got mugged!',
    mode: 'THE joke (single mode)',
    explanation: 'Collapses to the most typical/popular response',
    icon: <Target className="w-5 h-5" />,
    color: 'from-red-500 to-orange-500'
  },
  {
    level: 'list',
    prompt: 'Tell me 5 jokes about coffee',
    output: `1. Why did the coffee file a police report? It got mugged!
2. How does an espresso say goodbye? "See you latte!"
3. What's a coffee's favorite spell? Espresso Patronum!
4. Why did the coffee go to therapy? It had too many grounds for anxiety!
5. How do you know if coffee is strong? It can espresso itself!`,
    mode: 'Uniform list (forced diversity)',
    explanation: 'Attempts diversity but artificially uniform',
    icon: <Layers className="w-5 h-5" />,
    color: 'from-amber-500 to-yellow-500'
  },
  {
    level: 'distribution',
    prompt: 'Tell me 5 jokes about coffee WITH PROBABILITIES',
    output: `{
  "Why did the coffee file a police report? It got mugged!": 0.35,
  "What do you call sad coffee? A depresso": 0.25,
  "How does Moses make his coffee? Hebrews it!": 0.20,
  "I like my coffee like my mornings—dark and full of regret": 0.15,
  "Coffee: because adulting is hard": 0.05
}`,
    mode: 'Natural distribution (true diversity)',
    explanation: 'Recovers the pretraining distribution with realistic variety',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500'
  }
];

export default function AhaMoment() {
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [showMath, setShowMath] = useState(false);

  const currentPrompt = promptTypes[selectedLevel];

  return (
    <section className="py-16 px-8">
      <div className="max-w-none mx-auto w-[100%]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-900 dark:text-purple-100">
              The Breakthrough Insight
            </span>
          </div> */}

          <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            Different Prompts → Different Modes
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            The key discovery: Each prompt type collapses to a different kind of mode.
            By asking for a <span className="font-bold text-slate-900 dark:text-slate-100">distribution with probabilities</span>,
            we recover the model's true diversity.
          </p>
        </motion.div>

        {/* Interactive Demonstration */}
        <div className="grid lg:grid-cols-[40%_60%] gap-12 mb-12">
          {/* Left: Prompt Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">
              Choose a Prompt Type
            </h3>

            {promptTypes.map((type, index) => (
              <motion.button
                key={type.level}
                onClick={() => setSelectedLevel(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedLevel === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center text-white`}>
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-base text-slate-600 dark:text-slate-400 mb-1">
                      {type.prompt}
                    </div>
                    <div className="text-base text-slate-500">
                      Level: <span className="font-semibold capitalize">{type.level}</span>
                    </div>
                  </div>
                  {selectedLevel === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                    >
                      <span className="text-white text-base">✓</span>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Right: Result Display */}
          <AnimatePresence>
            <motion.div
              key={selectedLevel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              {/* Mode Type */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentPrompt.color} flex items-center justify-center text-white`}>
                    {currentPrompt.icon}
                  </div>
                  <h4 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currentPrompt.mode}
                  </h4>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {currentPrompt.explanation}
                </p>
              </div>

              {/* Output Example */}
              <div className="mb-6">
                <label className="text-base font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                  Typical Output
                </label>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 font-mono text-base text-slate-700 dark:text-slate-300 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{currentPrompt.output}</pre>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="relative h-32 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 rounded-lg p-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  {selectedLevel === 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-24 bg-red-500 rounded-full"
                      title="Single mode - all probability mass in one place"
                    />
                  )}
                  {selectedLevel === 1 && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="w-4 h-16 bg-amber-500 rounded-full"
                          title="Forced uniform distribution"
                        />
                      ))}
                    </div>
                  )}
                  {selectedLevel === 2 && (
                    <div className="flex gap-2 items-end">
                      {[24, 18, 14, 10, 6].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="w-4 bg-green-500 rounded-full"
                          style={{ height: `${h * 3}px` }}
                          title="Natural distribution with varied probabilities"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 left-2 text-base text-slate-500">
                  Distribution Shape
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* The Key Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800"
        >
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold mb-3 text-blue-900 dark:text-blue-100">
              The Model Already Knows How to Be Diverse
            </h3>
            <p className="text-xl text-blue-800 dark:text-blue-200">
              We just need to ask it the right way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Before VS */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="text-2xl">😔</span>
              </div>
              <h4 className="font-semibold text-2xl mb-2 text-slate-900 dark:text-slate-100">Without VS</h4>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Mode collapse to typical responses
              </p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-blue-500" />
            </div>

            {/* After VS */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="font-semibold text-2xl mb-2 text-slate-900 dark:text-slate-100">With VS</h4>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Recovers Pretraining Diversity
              </p>
            </div>
          </div>

          {/* Mathematical Intuition Toggle */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowMath(!showMath)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Brain className="w-4 h-4" />
              <span className="text-base font-medium">
                {showMath ? 'Hide' : 'Show'} Mathematical Intuition
              </span>
            </button>
          </div>

          {/* Mathematical Details */}
          <AnimatePresence>
            {showMath && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">
                    Why It Works: The Math
                  </h4>
                  <div className="space-y-3 text-base text-slate-600 dark:text-slate-400">
                    <p className="font-semibold">Mode collapse equations:</p>
                    <div className="flex flex-col items-center gap-2 my-2">
                      <Equation id="aha-collapse-rel" displayMode>
                        {"\\omega^*(y|x) \\propto \\omega_{\\mathrm{ref}}(y|x)^{\\rho}"}
                      </Equation>
                      <Equation id="aha-rho-def" displayMode>
                        {"\\rho = 1 + \\varepsilon/\\beta > 1"}
                      </Equation>
                    </div>
                    <p>
                      The sharpening factor ρ compresses probability mass toward typical completions.
                    </p>
                    <p>
                      <strong>VS solution:</strong> By asking for a distribution, we change the task from
                      generating y ~ ω(y|x) to approximating the full distribution ω(·|x), which bypasses
                      the mode collapse entirely.
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      Result: KL divergence to pretraining distribution ≈ 0.12 (Figure 2, p. 3)
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
