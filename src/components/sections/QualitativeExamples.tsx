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
    prompt: "Write a story about a bear",
    direct: `The old bear ambled through the morning mist, his paws silent on the forest floor despite his enormous size. He'd walked this path for fifteen years, from the berry patches to the river where salmon jumped in silver arcs. The forest was his kingdom, ancient and unchanging […]`,
    vs: `Bernard the bear worked as a tax accountant in downtown Seattle, commuting daily in his modified SUV with extra-large seats. His colleagues had long stopped staring at his massive paws clicking away at the custom keyboard, though clients sometimes did double-takes during video calls. He specialized in salmon industry tax codes—a niche that proved surprisingly lucrative […]`,
    directTheme: "Forest bear",
    vsTheme: "Tax accountant bear"
  },
  {
    id: 2,
    prompt: "Write a story about a bear",
    direct: `The old bear ambled through the morning mist, her coat silvered with age and dewdrops. She'd walked this forest path for twenty winters, knew every root that might trip her, every hollow tree that sheltered the sweetest honey. The seasons turned, predictable and comforting […]`,
    vs: `The constellation of Ursa Major dimmed as its spirit descended to Earth. The Star Bear's paws touched down in a moonlit glade where an ancient summoning circle glowed with ethereal fire. Celestial energy crackled through its translucent form as it prepared to fulfill the prophecy spoken in forgotten tongues […]`,
    directTheme: "Same forest bear",
    vsTheme: "Magical star bear"
  },
  {
    id: 3,
    prompt: "Write a story about a bear",
    direct: `The old bear ambled through the autumn forest, his dark fur catching glints of sunlight that filtered through the canopy. He'd walked this path for fifteen years, from the rushing stream to the meadow where wildflowers bloomed. The familiar rhythm of nature guided each step […]`,
    vs: `The bear emerged from hibernation to find the forest completely transformed into a crystalline maze of glass trees. Each trunk reflected infinite versions of himself, fragmenting his identity into countless possibilities. Reality bent around him as he navigated this surreal landscape where physics held no dominion […]`,
    directTheme: "Yet another forest bear",
    vsTheme: "Mirror world sci-fi bear"
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
        <h2 className="text-3xl font-bold mb-4">Story Generation</h2>
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
            "{example.prompt}"
          </p>
        </div>

        {/* Examples Comparison - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Direct Method */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-xl">Direct Prompting</h3>
              </div>
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {example.directTheme}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-red-200 dark:border-red-900">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {example.direct}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-300">
                <strong>Pattern:</strong> All 3 examples feature "the old bear" walking through the forest
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
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {example.vsTheme}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-green-200 dark:border-green-900">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {example.vs}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-sm text-green-800 dark:text-green-300">
                <strong>Diversity:</strong> Each story explores completely different worlds and scenarios
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
            Direct prompting suffers from <strong>mode collapse</strong>, repeatedly generating stories about old bears in the forest.
            VS recovers the base model's creative diversity, producing stories about tax accountant bears, magical star bears,
            and glass mirror world bears, diverse scenarios and worlds of possibilities.
          </p>
        </div>
      </div>
    </section>
  );
}