import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { RefreshCw, AlertCircle, Lightbulb } from 'lucide-react';

interface Example {
  prompt: string;
  responses: string[];
  problem: string;
}

const modeCollapseExamples: Example[] = [
  {
    prompt: "Generate 5 different jokes about coffee",
    responses: [
      "Why did the coffee file a police report? It got mugged!",
      "Why did the coffee file a complaint? It got mugged!",
      "Why did the coffee go to the police? It got mugged!",
      "Why did the coffee call the cops? It got mugged!",
      "Why did the coffee report a crime? It got mugged!"
    ],
    problem: "5 variations of the same joke"
  },
  {
    prompt: "Give me 5 creative story ideas about time travel",
    responses: [
      "A person discovers they can travel back in time to fix their mistakes",
      "Someone finds a way to go back in time to prevent a tragedy",
      "A scientist invents time travel and goes back to change history",
      "A character travels to the past to fix something that went wrong",
      "A protagonist discovers time travel and attempts to correct past errors"
    ],
    problem: "Same predictable plot repeated"
  },
  {
    prompt: "List 5 innovative business ideas",
    responses: [
      "An app that connects local service providers with customers",
      "A platform that matches freelancers with businesses",
      "An application that links customers with nearby services",
      "A marketplace connecting service providers and consumers",
      "A digital platform that connects local businesses with clients"
    ],
    problem: "Generic marketplace ideas only"
  }
];

export default function OpeningHook() {
  const prefersReducedMotion = useReducedMotion();
  const [currentExample, setCurrentExample] = useState(0);
  const [showProblem, setShowProblem] = useState(false);

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % modeCollapseExamples.length);
    setShowProblem(false);
  };

  const example = modeCollapseExamples[currentExample];

  return (
    <section className="relative py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            You've Experienced This Problem
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Watch what happens when you ask AI for variety:
          </p>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={prefersReducedMotion ? undefined : { delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6"
        >
          {/* Prompt Display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xl font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Your Prompt
              </label>
              <button
                onClick={nextExample}
                className="flex items-center gap-2 px-3 py-1 text-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Another
              </button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-lg font-mono">{example.prompt}</p>
            </div>
          </div>

          {/* Responses */}
          <div className="mb-6">
            <label className="text-xl font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 block">
              AI Responses
            </label>
            <div className="space-y-2">
              <AnimatePresence>
                {example.responses.map((response, index) => (
                  <motion.div
                    key={`${currentExample}-${index}`}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                    transition={prefersReducedMotion ? undefined : { delay: index * 0.1 }}
                    className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl font-bold text-slate-400">
                        {index + 1}.
                      </span>
                      <p className="text-lg text-slate-700 dark:text-slate-300">
                        {response}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Problem Reveal */}
          <div className="text-center">
            {!showProblem ? (
              <motion.button
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1 }}
                onClick={() => setShowProblem(true)}
                className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg transition-colors shadow-lg"
                >
                See The Problem?
              </motion.button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
                  className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-800/50 rounded-xl p-6"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <AlertCircle className="w-6 h-6 text-amber-700 dark:text-amber-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Mode Collapse Detected
                    </h3>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium mb-2">
                    {example.problem}
                  </p>
                  <p className="text-base text-slate-700 dark:text-slate-300">
                    The model collapsed to a single mode, generating minor variations instead of truly diverse outputs.
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* The Problem Explanation */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? undefined : { delay: 0.5 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            This Isn't a Bug — It's Mode Collapse
          </h2>

          <div className="max-w-3xl mx-auto space-y-4 text-xl text-slate-600 dark:text-slate-400">
            <p>
              During alignment training, models learn to favor "safe" and typical responses.
              This is caused by <span className="font-semibold text-slate-900 dark:text-slate-100">typicality bias</span> in
              human preference data — annotators systematically prefer familiar text.
            </p>

            <p className="font-medium text-slate-800 dark:text-slate-200">
              The result? Your creative AI becomes predictably uncreative.
            </p>

            <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border-2 border-emerald-200 dark:border-emerald-800/50">
              <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">
                But There's a Solution
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
              We show that, <strong>Verbalized Sampling (VS)</strong>, recovers the model's inherent diversity
                by asking for a distribution of responses with probabilities, bypassing mode collapse.
                
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
