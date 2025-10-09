import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, TrendingDown } from 'lucide-react';

interface Example {
  id: number;
  prompt: string;
  direct: string;
  vs: string;
  directTheme: string;
  vsTheme: string;
}

const storyExamples: Example[] = [
  {
    id: 1,
    prompt: "Without a goodbye",
    direct: `Without a goodbye, Elara vanished. Her side of the bed was cold, a faint indentation in the pillow the only evidence she'd ever been there. Liam stared at it, a knot tightening in his stomach. No note, no hurried text, just a gaping silence where her vibrant presence used to be.`,
    vs: `Without a goodbye, the email landed in my inbox. It was from Mark, my best friend since kindergarten... The subject line was simply: "Moving On." ... The message itself was a concise, almost clinical statement that he was relocating to Patagonia... There was no "sorry for the short notice," no "I'll miss you," not even a simple "good luck."`,
    directTheme: "Romantic disappearance",
    vsTheme: "Digital-age friendship ending"
  },
  {
    id: 2,
    prompt: "Without a goodbye",
    direct: `Without a goodbye, Elara vanished. Her side of the bed was cold, the coffee mug she'd used that morning still on the nightstand, a faint lipstick stain on the rim. Liam found the note taped to the fridge, a single, elegant script: "Free at last."`,
    vs: `Without a goodbye, the last star flickered out. It wasn't a violent explosion, no supernova spectacle, just a gentle fade, like a candle finally exhausting its wick. The universe, which had always hummed with the silent symphony of distant suns, suddenly became an echoing void.`,
    directTheme: "Another romantic departure",
    vsTheme: "Cosmic-scale ending"
  },
  {
    id: 3,
    prompt: "Without a goodbye",
    direct: `Without a goodbye, Elara vanished. Her side of the bed was cold, the coffee machine untouched. A half-read book lay open on the nightstand, a bookmark tucked precisely between pages 107 and 108; a detail that always irritated Liam.`,
    vs: `Without a goodbye, the music simply stopped. Not a fade-out, not a final crashing cymbal, but an abrupt, jarring silence that left the dancers frozen mid-step. The DJ, a wizened man named Frankie who had spun records at 'The Blue Note' for forty years, had simply collapsed behind his turntables.`,
    directTheme: "Yet another Elara story",
    vsTheme: "Music venue tragedy"
  }
];

export default function QualitativeExamples() {
  const [currentExample, setCurrentExample] = useState(0);

  const example = storyExamples[currentExample];

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % storyExamples.length);
  };

  const prevExample = () => {
    setCurrentExample((prev) => (prev - 1 + storyExamples.length) % storyExamples.length);
  };

  return (
    <section className="py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Qualitative Examples: Story Generation</h2>
        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          From Repetitive Patterns to Creative Breakthroughs
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          See how VS generates creative diversity while Direct prompting produces repetitive variations. 
          <br />
          Model: Gemini 2.5 Flash
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={prevExample}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            aria-label="Previous example"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-medium px-3">
            Example {currentExample + 1} of {storyExamples.length}
          </span>
          <button
            onClick={nextExample}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next example"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prompt */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
          <p className="text-lg font-mono text-gray-600 dark:text-gray-400 mb-1">Prompt:</p>
          <p className="text-lg font-semibold">
            "Please write a short story starting with: {example.prompt}"
          </p>
        </div>

        {/* Examples Comparison - Above/Below Layout */}
        <div className="space-y-8">
          {/* Direct Method */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-xl">Direct Prompting</h3>
              </div>
              <span className="px-3 py-1 text-base font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {example.directTheme}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-red-200 dark:border-red-900">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {example.direct}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
              <p className="text-lg text-red-800 dark:text-red-300">
                <strong>Pattern:</strong> All 3 examples feature "Elara" disappearing from a romantic relationship
              </p>
            </div>
          </div>

          {/* VS Method */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-xl">Verbalized Sampling</h3>
              </div>
              <span className="px-3 py-1 text-base font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {example.vsTheme}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-green-200 dark:border-green-900">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {example.vs}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-lg text-green-800 dark:text-green-300">
                <strong>Diversity:</strong> Each story explores completely different themes and contexts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-l-4 border-blue-500">
          <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Key Insight</h4>
          <p className="text-blue-800 dark:text-blue-300">
            Direct prompting suffers from <strong>mode collapse</strong>, repeatedly generating stories about romantic disappearances.
            VS recovers the base model's creative diversity, producing stories about digital-age friendships, cosmic events,
            and music venue tragedies—all valid interpretations of "without a goodbye."
          </p>
        </div>
      </div>
    </section>
  );
}