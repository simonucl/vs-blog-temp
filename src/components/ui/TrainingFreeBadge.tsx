import { motion } from 'framer-motion';
import { Zap, Sparkles, Rocket } from 'lucide-react';

interface TrainingFreeBadgeProps {
  variant?: 'inline' | 'hero' | 'callout';
  showIcon?: boolean;
  animated?: boolean;
}

export function TrainingFreeBadge({
  variant = 'inline',
  showIcon = true,
  animated = true
}: TrainingFreeBadgeProps) {

  const baseClasses = "font-semibold flex items-center gap-2";

  const variants = {
    inline: {
      wrapper: "inline-flex px-3 py-1 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800",
      text: "text-sm text-green-900 dark:text-green-100",
      icon: "w-4 h-4 text-green-600 dark:text-green-400"
    },
    hero: {
      wrapper: "inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25",
      text: "text-lg text-white font-bold",
      icon: "w-6 h-6 text-white"
    },
    callout: {
      wrapper: "flex px-4 py-2 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300 dark:border-green-700",
      text: "text-base text-green-900 dark:text-green-100 font-medium",
      icon: "w-5 h-5 text-green-600 dark:text-green-400"
    }
  };

  const currentVariant = variants[variant];
  const Icon = variant === 'hero' ? Rocket : Zap;

  const content = (
    <div className={`${baseClasses} ${currentVariant.wrapper}`}>
      {showIcon && <Icon className={currentVariant.icon} />}
      <span className={currentVariant.text}>
        Training-Free
      </span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        className="inline-block"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

export function TrainingFreeCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-8 p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-green-900 dark:text-green-100">
            No Training Required
          </h3>
          <p className="text-green-800 dark:text-green-200 mb-3">
            Verbalized Sampling works immediately with any LLM—GPT-4, Claude, Gemini, or open models like Llama.
            No fine-tuning, no special access, no waiting. Just update your prompts and see instant improvements.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-green-700 dark:text-green-300">Works with closed APIs</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-green-700 dark:text-green-300">Zero setup time</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-green-700 dark:text-green-300">Instant adoption</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function VSBeatsFineTuningCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-8 p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-indigo-200 dark:from-purple-800 dark:to-indigo-800 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 text-purple-900 dark:text-purple-100">
              VS Matches Fine-Tuned Performance
            </h3>
            <p className="text-purple-800 dark:text-purple-200 mb-4">
              <strong>Remarkable Finding:</strong> GPT-4.1 with Verbalized Sampling achieves the same performance
              as a fine-tuned Llama-3.1-8B model on dialogue simulation tasks (Figure 6, p. 11).
            </p>

            <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Traditional Approach</h4>
                  <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                    <li>• Collect training data</li>
                    <li>• Fine-tune for hours/days</li>
                    <li>• Deploy custom model</li>
                    <li className="font-semibold">Total time: Days to weeks</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">With VS</h4>
                  <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                    <li>• Update your prompt</li>
                    <li>• Use existing API</li>
                    <li>• Get results immediately</li>
                    <li className="font-semibold text-green-600">Total time: &lt; 1 minute</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-sm text-purple-600 dark:text-purple-400 mt-3 font-medium">
              💡 This means you can achieve fine-tuning-level improvements without any training infrastructure.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}