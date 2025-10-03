import { useMemo, useState } from 'react';
import { create } from 'zustand';
import playgroundData from '../../data/precomputed/playground-data.json';

type Candidate = {
  id: string;
  text: string;
  prob: number;
  theme?: string;
  isNovel?: boolean;
};

type Dataset = {
  direct: Candidate[];
  vs: Candidate[];
};

type TaskType = 'joke' | 'story' | 'poem';
type Mode = 'VS Only' | 'VS vs Direct' | 'Show Math';

interface PlaygroundStore {
  mode: Mode;
  tau: number;
  task: TaskType;
  setMode: (mode: Mode) => void;
  setTau: (tau: number) => void;
  setTask: (task: TaskType) => void;
}

const usePlaygroundStore = create<PlaygroundStore>((set) => ({
  mode: 'VS vs Direct',
  tau: 0.15,
  task: 'joke',
  setMode: (mode) => set({ mode }),
  setTau: (tau) => set({ tau }),
  setTask: (task) => set({ task }),
}));

function diversityProxy(candidates: Candidate[]): number {
  const sumSquaredProbs = candidates.reduce((acc, c) => acc + c.prob ** 2, 0);
  return sumSquaredProbs === 0 ? 0 : 1 / sumSquaredProbs;
}

function calculateMetrics(candidates: Candidate[]) {
  const uniqueThemes = new Set(candidates.map(c => c.theme).filter(Boolean));
  const novelCount = candidates.filter(c => c.isNovel).length;

  return {
    included: candidates.length,
    diversity: diversityProxy(candidates),
    themes: uniqueThemes.size,
    novelty: candidates.length > 0 ? (novelCount / candidates.length) * 100 : 0
  };
}

export default function VSPlayground() {
  const { mode, tau, task, setMode, setTau, setTask } = usePlaygroundStore();
  const [animating, setAnimating] = useState(false);

  const dataset = playgroundData[task] as Dataset;

  const includedVS = useMemo(() =>
    dataset.vs.filter(c => c.prob >= tau),
    [dataset.vs, tau]
  );

  const includedDirect = useMemo(() =>
    dataset.direct.filter(c => c.prob >= tau),
    [dataset.direct, tau]
  );

  const vsMetrics = useMemo(() => calculateMetrics(includedVS), [includedVS]);
  const directMetrics = useMemo(() => calculateMetrics(includedDirect), [includedDirect]);

  const handleTauChange = (value: number) => {
    setAnimating(true);
    setTau(value);
    setTimeout(() => setAnimating(false), 300);
  };

  const taskLabels = {
    joke: '🎭 Jokes',
    story: '📖 Stories',
    poem: '📝 Poems'
  };

  return (
    <section className="vs-playground" aria-label="Verbalized Sampling Interactive Playground">
      <header className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h3 className="text-2xl font-semibold">Try Diversity Tuning</h3>
        <div className="flex gap-2">
          {Object.entries(taskLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTask(key as TaskType)}
              className={`px-4 py-2 rounded-lg transition-all ${
                task === key
                  ? 'bg-accent text-background'
                  : 'bg-muted hover:bg-border'
              }`}
              aria-pressed={task === key}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="col-span-2">
          <label className="block">
            <span className="text-sm font-medium mb-2 block">
              Probability threshold (τ): <output className="font-mono ml-2">{tau.toFixed(2)}</output>
            </span>
            <input
              type="range"
              min={0.03}
              max={0.5}
              step={0.01}
              value={tau}
              onChange={(e) => handleTauChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg cursor-pointer"
              aria-valuetext={`Threshold ${tau.toFixed(2)}`}
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>More diverse</span>
              <span>Less diverse</span>
            </div>
          </label>
        </div>

        <div>
          <label className="block">
            <span className="text-sm font-medium mb-2 block">View Mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="w-full px-3 py-2 rounded-lg border bg-background"
              aria-label="Select viewing mode"
            >
              <option>VS Only</option>
              <option>VS vs Direct</option>
              <option>Show Math</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {mode === 'VS vs Direct' && (
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Direct Prompting</h4>
            {includedDirect.map((c) => (
              <article
                key={c.id}
                className={`vs-card ${c.prob < tau ? 'excluded' : ''} ${
                  animating ? 'transition-all duration-300' : ''
                }`}
              >
                <p className="whitespace-pre-line">{c.text}</p>
                <div className="flex justify-between items-center mt-2">
                  <small className={`probability ${
                    c.prob >= 0.3 ? 'high' : c.prob >= 0.15 ? 'mid' : 'low'
                  }`}>
                    p = {c.prob.toFixed(2)}
                  </small>
                  {c.theme && (
                    <span className="text-xs px-2 py-1 bg-muted rounded">
                      {c.theme}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-semibold text-lg">
            {mode === 'VS vs Direct' ? 'Verbalized Sampling' : 'VS Responses'}
          </h4>
          {includedVS.map((c) => (
            <article
              key={c.id}
              className={`vs-card ${c.prob < tau ? 'excluded' : ''} ${
                animating ? 'transition-all duration-300' : ''
              }`}
            >
              <p className="whitespace-pre-line">{c.text}</p>
              <div className="flex justify-between items-center mt-2">
                <small className={`probability ${
                  c.prob >= 0.15 ? 'high' : c.prob >= 0.08 ? 'mid' : 'low'
                }`}>
                  p = {c.prob.toFixed(2)}
                </small>
                <div className="flex gap-2">
                  {c.isNovel && (
                    <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                      novel
                    </span>
                  )}
                  {c.theme && (
                    <span className="text-xs px-2 py-1 bg-muted rounded">
                      {c.theme}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
        {mode === 'VS vs Direct' ? (
          <>
            <MetricCard label="Direct Included" value={directMetrics.included} />
            <MetricCard label="Direct Diversity" value={directMetrics.diversity.toFixed(2)} />
            <MetricCard label="VS Included" value={vsMetrics.included} />
            <MetricCard label="VS Diversity" value={vsMetrics.diversity.toFixed(2)} />
          </>
        ) : (
          <>
            <MetricCard label="Included" value={vsMetrics.included} />
            <MetricCard label="Diversity" value={vsMetrics.diversity.toFixed(2)} />
            <MetricCard label="Themes" value={vsMetrics.themes} />
            <MetricCard label="Novelty" value={`${vsMetrics.novelty.toFixed(0)}%`} />
          </>
        )}
      </div>

      {mode === 'Show Math' && (
        <div className="mt-6 p-6 bg-muted/20 rounded-lg">
          <h4 className="font-semibold mb-3">Mathematical Intuition</h4>
          <p className="mb-3">
            The sharpening effect under typicality bias (Equation 3 from the paper):
          </p>
          <div className="katex-display text-center my-4">
            <code className="text-lg">ρ = 1 + ε/β {'>'} 1</code>
          </div>
          <p className="text-sm">
            Where ρ {'>'} 1 increases concentration on typical completions. Verbalized Sampling
            asks for a distribution to approximate the pretraining diversity, recovering what
            was lost during alignment. The threshold τ allows you to tune this diversity by
            filtering the verbalized probability distribution.
          </p>
          <p className="text-sm mt-3">
            Notice how Direct Prompting produces multiple identical responses with high
            probability (mode collapse), while VS generates diverse responses with a more
            spread-out probability distribution.
          </p>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setTau(0.15)}
          className="copy-button"
          aria-label="Reset threshold to default"
        >
          Reset to Default
        </button>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <dt className="text-xs uppercase tracking-wide opacity-70">{label}</dt>
      <dd className="text-xl font-semibold mt-1">{value}</dd>
    </div>
  );
}