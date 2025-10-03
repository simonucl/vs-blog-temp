import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category?: 'core' | 'technical' | 'practical';
}

const faqData: FAQItem[] = [
  {
    question: "Does VS sacrifice accuracy or safety?",
    answer: "No. Extensive testing (Appendix G.7-G.8) shows that VS maintains factual accuracy and safety standards while improving diversity. The method generates varied responses without compromising correctness—precision remains near 1.0 across all evaluated tasks.",
    category: 'core'
  },
  {
    question: "Why use 'probability' instead of 'confidence'?",
    answer: "Empirical testing (Appendix H.3) shows that 'probability' performs best for VS-Standard and VS-CoT, while 'confidence' works better for VS-Multi. The model interprets these terms differently—'probability' elicits a more calibrated distribution that better approximates the pretraining distribution.",
    category: 'technical'
  },
  {
    question: "What is semantic diversity?",
    answer: "Semantic diversity measures how different responses are in meaning, calculated as 1 minus the mean pairwise cosine similarity of response embeddings. A score of 100% means completely different meanings, while 0% means identical. VS typically improves semantic diversity by 1.6-2.1× over direct prompting.",
    category: 'technical'
  },
  {
    question: "How do I choose the optimal k (number of candidates)?",
    answer: "k=5 is typically optimal for most tasks, balancing diversity with quality. Larger k values (10-20) can increase diversity but may degrade quality for complex tasks. For creative writing, k=5-7 works well. For synthetic data generation, use smaller k=3-5 to maintain quality.",
    category: 'practical'
  },
  {
    question: "Does VS work with all LLMs?",
    answer: "Yes! VS is training-free and works with any LLM—closed models (GPT-4, Claude, Gemini) and open models (Llama, Qwen). Importantly, larger models benefit MORE from VS, with diversity gains 1.5-2× greater than smaller models. No special access or fine-tuning required.",
    category: 'core'
  },
  {
    question: "When should I NOT use VS?",
    answer: "Avoid VS for tasks requiring a single definitive answer (math calculations, factual lookups) or when you need deterministic outputs. VS excels when multiple valid responses exist—creative writing, brainstorming, synthetic data generation, or modeling distributions.",
    category: 'practical'
  },
  {
    question: "How does VS compare to fine-tuning?",
    answer: "Remarkably, GPT-4.1 with VS matches the performance of fine-tuned Llama-3.1-8B on dialogue simulation tasks. This means you can achieve fine-tuning-level diversity improvements instantly, without any training, using VS with capable models.",
    category: 'core'
  },
  {
    question: "Can I combine VS with temperature sampling?",
    answer: "Absolutely! VS and temperature are orthogonal techniques that work synergistically. VS changes what distribution you're sampling from (recovering pretraining diversity), while temperature controls how you sample from it. Combined, they push the diversity-quality trade-off even further.",
    category: 'technical'
  },
  {
    question: "What's the difference between VS-Standard, VS-CoT, and VS-Multi?",
    answer: "VS-Standard: Basic distribution request, fastest and simplest. VS-CoT: Adds reasoning step for better quality with high diversity. VS-Multi: Multi-turn generation for maximum diversity when you need many samples. Use Standard for quick results, CoT for quality+diversity, Multi for large-scale generation.",
    category: 'practical'
  },
  {
    question: "Why does mode collapse happen in the first place?",
    answer: "Our research reveals it's fundamentally a data problem: typicality bias in human preference data. Annotators systematically prefer familiar, conventional text (proven with p<10^-14 significance). This bias sharpens the distribution during alignment, causing mode collapse even with perfect algorithms.",
    category: 'core'
  }
];

const FAQAccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle
}) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={onToggle}
        className="w-full py-4 px-2 flex justify-between items-start text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-slate-900 dark:text-slate-100 pr-4">
          {item.question}
        </span>
        <span className="flex-shrink-0 ml-2 text-slate-500">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      {isOpen && (
        <div className="px-2 pb-4 text-slate-600 dark:text-slate-400 prose prose-sm dark:prose-invert max-w-none">
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
};

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0, 4])); // Open first and fifth by default

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const coreQuestions = faqData.filter(q => q.category === 'core');
  const technicalQuestions = faqData.filter(q => q.category === 'technical');
  const practicalQuestions = faqData.filter(q => q.category === 'practical');

  return (
    <section className="my-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>

        <div className="space-y-8">
          {/* Core Questions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
              Core Concepts
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              {coreQuestions.map((item, index) => (
                <FAQAccordionItem
                  key={`core-${index}`}
                  item={item}
                  isOpen={openItems.has(faqData.indexOf(item))}
                  onToggle={() => toggleItem(faqData.indexOf(item))}
                />
              ))}
            </div>
          </div>

          {/* Technical Questions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
              Technical Details
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              {technicalQuestions.map((item, index) => (
                <FAQAccordionItem
                  key={`tech-${index}`}
                  item={item}
                  isOpen={openItems.has(faqData.indexOf(item))}
                  onToggle={() => toggleItem(faqData.indexOf(item))}
                />
              ))}
            </div>
          </div>

          {/* Practical Questions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
              Practical Usage
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              {practicalQuestions.map((item, index) => (
                <FAQAccordionItem
                  key={`practical-${index}`}
                  item={item}
                  isOpen={openItems.has(faqData.indexOf(item))}
                  onToggle={() => toggleItem(faqData.indexOf(item))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}