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
    explanation: 'Recovers the pretraining distribution with realistic variety, see the how the results with more variety.',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500'
  }
];

export default function AhaMoment() {
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [showMath, setShowMath] = useState(false);

  const currentPrompt = promptTypes[selectedLevel];

  return (
    <section className="py-8 px-4">
      <div className="max-w-none mx-auto w-[100%]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          {/* <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-900 dark:text-purple-100">
              The Breakthrough Insight
            </span>
          </div> */}

          <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
            Different Prompts → Different Modes
          </h2>

          <p className="text-base text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            The key discovery: Each prompt type collapses to a different kind of mode.
            By asking for a <span className="font-bold text-slate-900 dark:text-slate-100">distribution with probabilities</span>,
            we recover the model's true diversity.
          </p>
        </motion.div>

        {/* Interactive Demonstration */}
        <div className="grid lg:grid-cols-[40%_55%] gap-6 mb-6">
          {/* Left: Prompt Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <h3 className="text-base font-semibold mb-3 text-slate-700 dark:text-slate-300">
              Choose a Prompt Type
            </h3>

            {promptTypes.map((type, index) => (
              <motion.button
                key={type.level}
                onClick={() => setSelectedLevel(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedLevel === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center text-white`}>
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-sm text-slate-600 dark:text-slate-400 mb-0.5">
                      {type.prompt}
                    </div>
                    <div className="text-xs text-slate-500">
                      Level: <span className="font-semibold capitalize">{type.level}</span>
                    </div>
                  </div>
                  {selectedLevel === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                    >
                      <span className="text-white text-sm">✓</span>
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
              className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              {/* Mode Type */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${currentPrompt.color} flex items-center justify-center text-white`}>
                    {currentPrompt.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {currentPrompt.mode}
                  </h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentPrompt.explanation}
                </p>
              </div>

              {/* Output Example */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">
                  Typical Output
                </label>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{currentPrompt.output}</pre>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="relative h-20 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 rounded-lg p-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  {selectedLevel === 0 && (
                    <div
                      className="w-3 h-16 bg-red-500 rounded-full"
                      title="Single mode - all probability mass in one place"
                    />
                  )}
                  {selectedLevel === 1 && (
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-12 bg-amber-500 rounded-full"
                          title="Forced uniform distribution"
                        />
                      ))}
                    </div>
                  )}
                  {selectedLevel === 2 && (
                    <div className="flex gap-1.5 items-end">
                      {[18, 14, 11, 8, 5].map((h, i) => (
                        <div
                          key={i}
                          className="w-3 bg-green-500 rounded-full"
                          style={{ height: `${h * 3}px` }}
                          title="Natural distribution with varied probabilities"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 left-2 text-xs text-slate-500">
                  Distribution Shape
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
