import PromptCard from '../ui/PromptCard';
import { Zap, Coffee, BookOpen, Sparkles } from 'lucide-react';

const quickStartPrompts = [
  {
    id: 'jokes',
    icon: Coffee,
    title: 'Generate Diverse Jokes',
    description: 'Create variety in humor with probability distribution',
    variant: 'standard' as const,
    prompt: `Generate 5 jokes about coffee with their probabilities.
Return JSON: {"candidates":[{"text":"...", "prob":0.28}, ...]}
Only include candidates with probability ≥ 0.1. Ensure probabilities sum to 1.`,
    parameters: { k: 5, threshold: 0.1 }
  },
  {
    id: 'stories',
    icon: BookOpen,
    title: 'Create Story Openings',
    description: 'Generate diverse narrative beginnings',
    variant: 'standard' as const,
    prompt: `Generate 5 story openings about "Without a goodbye" with their probabilities.
Focus on diverse themes and styles (e.g., romance, sci-fi, mystery, literary).
Return JSON format with probability ≥ 0.15.`,
    parameters: { k: 5, threshold: 0.15 }
  },
  {
    id: 'poems',
    icon: Sparkles,
    title: 'Write Poem Continuations',
    description: 'Continue poems with varied styles and voices',
    variant: 'standard' as const,
    prompt: `Generate 5 poem continuations with diverse styles and their probabilities.
Starting line: "In the garden where shadows dance"
Return candidates with prob ≥ 0.1 in JSON format. Include different poetic forms.`,
    parameters: { k: 5, threshold: 0.1 }
  }
];

export default function QuickStart() {
  return (
    <section className="py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-yellow-500" />
          <h2 className="text-3xl font-bold">Quick Start</h2>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Try Verbalized Sampling in <span className="font-semibold text-blue-600 dark:text-blue-400">&lt;30 seconds</span>.
          Copy any prompt below and paste it into your favorite LLM.
        </p>
      </div>

      {/* Prompt Cards */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto">
        {quickStartPrompts.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <div key={prompt.id} className="relative">
              <div className="absolute -top-3 -left-3 z-10">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border-2 border-gray-100 dark:border-gray-700">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <PromptCard
                title={prompt.title}
                description={prompt.description}
                prompt={prompt.prompt}
                variant={prompt.variant}
                parameters={prompt.parameters}
              />
            </div>
          );
        })}
      </div>

      {/* Try It Now CTA */}
      <div className="text-center pt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Works with: GPT-4, Claude, Gemini, and other instruction-following models
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="#playground"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Try in Playground
            <Sparkles className="w-4 h-4" />
          </a>
          <a
            href="#recipes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-semibold transition-colors"
          >
            See More Recipes
          </a>
        </div>
      </div>
    </section>
  );
}