# Verbalized Sampling Blog — Implementation Plan (v7)

This document is a standalone, end‑to‑end plan to launch an "academic paper meets interactive explainer" for **Verbalized Sampling (VS)**.

**Last updated**: October 3, 2025
**Status**: Week 2, Day 3 — Ready for enhanced evidence implementation

## 1) Objectives, audience, and success metrics

**Primary objective.** Make *distribution‑level prompting* (VS) intuitive and reproducible in ≤60 seconds; demonstrate evidence for *why* it works.

**Audiences & routes**

* **Applied practitioners** → Quick start, copy buttons, τ playground.
* **Researchers** → Three‑panel causal story, equation callouts, citations.
* **Creatives** → Side‑by‑side outputs, VS demo presets.

**Outcomes to track (30 days)**

* Reader: “aha” in <30s; ≥60% interact; ≥40% complete.
* Impact: ≥100 social shares; ≥10 blog citations; ≥5 external implementations.
* Team: content edit → deploy <10 min; new interactive scaffold <2h.

*Evidence anchors for claims in the post (match the paper’s figures/tables):*

* **Diversity gains in creative writing**: **+1.6–2.1×** (Figure 3a–c, pp. 7–8). 
* **Retained diversity after alignment**: **66.8%** of base model (Figure 4, p. 9). 
* **Human preference lift**: **+25.7%** (Table 3, p. 8). 
* **Scaling trend**: larger models gain **~1.5–2×** more (Figure 3e–f, p. 7). 
* **Diversity tuning via probability threshold** (Figure 3g–i, p. 7). 
* **US states demo**: VS distribution aligns with pretraining (KL≈0.12) (Figure 2, p. 3). 
* **Temperature ablation is orthogonal** (Figure 5, p. 9). 
* **Dialogue simulation**: distributions closer to human (Figure 6, p. 11). 
* **Open‑ended QA**: lower KL, higher coverage‑N, precision ≈ 1.0 (Figure 7, p. 12). 
* **Synthetic data → math accuracy**: **37.5% vs 32.8%** avg (Table 4, pp. 12–13). 
* **Factuality & safety maintained** (Appx. G.7, G.8—summarized in Intro p. 2). 

---

## 2) Information architecture (top → bottom)

1. **Hero (visual first)**
   A two‑column hero showing *Direct* vs *VS* outputs for the same prompt (e.g., “jokes about coffee”), with an immediate **Copy VS Prompt** button.
   *Caption:* “Ask for a **distribution**, not a single answer.”

2. **TL;DR (3 bullets)**
   Typicality bias in preference data sharpens aligned models (ρ=1+ε/β>1), VS recovers base‑model diversity, τ threshold tunes variety. (Equation/intuition panel links below.) 

3. **Three‑panel ‘Why it works’**

   * *Hidden bias (intuition):* Apple effect → typicality bias (ε>0).
   * *Mathematical collapse:* sharpening (ρ=1+ε/β>1) with flat utility ties → mode collapse. (Eq. 3, p. 4.) 
   * *VS recovery:* distribution‑level prompt approximates the pretraining distribution; US states KL≈0.12 (p. 3). 

4. **Try it: τ‑threshold playground**
   *Preset tasks:* jokes/stories/poems; toggle *Direct vs VS*; slider = inclusion threshold.

5. **Evidence sections (enhanced)**
   * **Primary evidence cards**: Diversity gains (1.6–2.1×), human preference (+25.7%), diversity retention (66.8%)
   * **Scaling visualization**: Interactive chart showing 1.5–2× greater gains for larger models
   * **Temperature synergy**: Interactive showing VS + temperature combinations
   * **Application evidence**: Dialogue simulation distributions, open-ended QA metrics, synthetic data performance

6. **Decision tree:** “Is VS right for you?” (fast scroller).

7. **Recipes (progressive with variant comparison)**
   * **VS‑Standard**: Basic distribution request using "probability"
   * **VS‑CoT**: Enhanced with reasoning, also uses "probability"
   * **VS‑Multi**: Multi-turn generation using "confidence" (per Appendix H.3)
   * **Comparison table**: When to use each variant, performance characteristics

8. **FAQ, troubleshooting, and technical details**
   * **Why probabilities vs. confidence?** Different prompt formats perform differently (Appendix H.3)
   * **Does VS hurt correctness/safety?** No, maintained per paper (Appx G.7-G.8)
   * **What is semantic diversity?** 1 - mean pairwise cosine similarity explanation
   * **Implementation tips**: k=5 typically optimal, larger k may degrade quality 

9. **References & citation tools**
   BibTeX download; CSL style switcher.

---

## 3) Visual system & typography

* **Fonts**: Crimson Pro (prose), Inter (UI).
* **Measure & rhythm**: `max-width: ~66ch; line-height: 1.65; paragraph-spacing: 1.4–1.6rem;` generous white space; figures can extend into margins.
* **Sidenotes**: Tufte‑style margin notes with narrow right column (desktop) and inline footnotes (mobile).
* **Color**: muted academic palette; high contrast ≥4.5:1; no color‑only reliance for status.

**CSS tokens (excerpt)**

```css
:root {
  --playground-bg: hsl(210 20% 98%);
  --card-included: #fff;
  --card-excluded: hsl(210 10% 95%);
  --prob-high: hsl(120 40% 40%);
  --prob-mid: hsl(45 60% 45%);
  --prob-low: hsl(0 40% 45%);
  --ease-quick: 150ms ease-out;
  --ease-smooth: 300ms cubic-bezier(.4,0,.2,1);
}
```

**Article layout (excerpt)**

```css
.article {
  max-width: 680px; /* ~6.5in at 96dpi */
  margin: 4rem auto;
  line-height: 1.65;
  padding-right: clamp(0px, 5vw, 300px); /* sidenotes lane */
}
.figure { margin: 2rem -60px; padding: 1rem; border-block: 2px solid var(--slate-200); }
.figure-caption { margin-top: .75rem; font-size: .9rem; color: var(--muted); font-style: italic; }
```

---

## 4) Tech stack & configuration

**Base**

* **Astro Paper** template (Astro 4, MDX).
* **React islands** (`client:visible` for the playground; `client:idle` for secondary UI like copy buttons).
* **Tailwind CSS** (utilities & typography plugin), **CSS Modules** for bespoke components.
* **Tufte CSS** (imported and lightly adapted to Tailwind tokens).

**Content pipeline**

* **MDX** with:

  * `remark-math` + `rehype-katex` (display/inline math).
  * `rehype-citation` with `references.bib` and user‑selectable CSL (e.g., `apa.csl`).
  * Custom **Figure**, **Table**, **Equation** components with counters + cross‑refs (`See @fig:states`).
* **Code**: Shiki for highlighting; small plugin to add **Copy** buttons post‑hydrate (`client:idle`).

**astro.config.mjs (sketch)**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react(), mdx()],
  markdown: {
    syntaxHighlight: 'shiki',
    remarkPlugins: [['remark-math']],
    rehypePlugins: [
      ['rehype-katex'],
      ['rehype-citation', { bibliography: 'src/references.bib', linkCitations: true }]
    ]
  },
  vite: { build: { sourcemap: true } }
});
```

**Directory layout**

```
src/
  components/
    interactives/VSPlayground.tsx
    ui/{Metric.tsx, Slider.tsx, Sidenote.tsx}
  content/blog/verbalized-sampling/index.mdx
  styles/{globals.css, tufte.css}
  references.bib
```

---

## 5) Interactives: Enhanced implementations

### 5a) τ‑threshold playground (existing, enhanced)

**Behavior**

* Loads on visibility.
* Uses precomputed outputs for **Direct** and **VS** variants per task (to avoid live API calls).
* Slider sets an inclusion threshold `τ` (0.05–0.5).
* Cards animate in/out with reduced‑motion respect.
* Metrics: Included count; **diversity proxy** `1 / Σ p_i²` (Herfindahl‑based); coverage of unique themes (pre‑tagged in dataset).
* **Enhancement**: Add temperature combination slider to show VS + temperature synergy
* **Enhancement**: Model size selector to demonstrate scaling effects

**TypeScript + React (island) — simplified**

```tsx
// src/components/interactives/VSPlayground.tsx
import { useMemo } from 'react';
import { create } from 'zustand';

type Candidate = { id: string; text: string; prob: number; theme?: string; isNovel?: boolean };
type Dataset = Record<'direct' | 'vs', Candidate[]>;
type Mode = 'VS Only' | 'VS vs Direct' | 'Show Math';

interface Store {
  mode: Mode; tau: number; dataset: Dataset; task: 'joke' | 'story' | 'poem';
  setTau: (v: number) => void; setMode: (m: Mode) => void; setTask: (t: Store['task']) => void;
}
const useStore = create<Store>((set) => ({
  mode: 'VS vs Direct', tau: 0.15, task: 'joke', dataset: { direct: [], vs: [] },
  setTau: (tau) => set({ tau }), setMode: (mode) => set({ mode }), setTask: (task) => set({ task })
}));

function diversityProxy(cands: Candidate[]) {
  const s = cands.reduce((acc, c) => acc + c.prob ** 2, 0);
  return s === 0 ? 0 : 1 / s;
}

export default function VSPlayground({ data }: { data: Record<string, Dataset> }) {
  const { tau, mode, task, setTau, setMode, setTask } = useStore();
  // Load precomputed by task on mount or task change
  const ds = data[task];

  const includedVS = useMemo(() => ds.vs.filter(c => c.prob >= tau), [ds, tau]);
  const includedDirect = useMemo(() => ds.direct.filter(c => c.prob >= tau), [ds, tau]);

  const metrics = useMemo(() => ({
    included: includedVS.length,
    diversity: diversityProxy(includedVS),
    themes: new Set(includedVS.map(c => c.theme).filter(Boolean)).size
  }), [includedVS]);

  return (
    <section aria-label="Diversity Tuning Playground">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Try Diversity Tuning</h3>
        <button onClick={() => setTau(0.15)} aria-label="Reset">Reset</button>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="col-span-2">
          Probability threshold (τ): <output>{tau.toFixed(2)}</output>
          <input type="range" min={0.05} max={0.5} step={0.05}
            value={tau} onChange={(e) => setTau(parseFloat(e.currentTarget.value))}
            aria-valuetext={`Threshold ${tau.toFixed(2)}`} />
        </label>
        <select value={mode} onChange={(e) => setMode(e.currentTarget.value as Mode)} aria-label="Mode">
          <option>VS Only</option><option>VS vs Direct</option><option>Show Math</option>
        </select>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(mode !== 'VS vs Direct' ? includedVS : includedDirect).map(c => (
          <article key={c.id} className={`rounded border p-3 ${c.prob >= tau ? 'bg-white' : 'bg-slate-100'}`}>
            <p>{c.text}</p>
            <small>p={c.prob.toFixed(2)}{c.isNovel ? ' • novel' : ''}</small>
          </article>
        ))}
        {mode === 'VS vs Direct' && includedVS.map(c => (
          <article key={`vs-${c.id}`} className="rounded border p-3">
            <p>{c.text}</p>
            <small>p={c.prob.toFixed(2)}{c.isNovel ? ' • novel' : ''}</small>
          </article>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2">
        <div><dt className="text-xs uppercase">Included</dt><dd>{metrics.included}</dd></div>
        <div><dt className="text-xs uppercase">Diversity</dt><dd>{metrics.diversity.toFixed(2)}</dd></div>
        <div><dt className="text-xs uppercase">Coverage</dt><dd>{metrics.themes} themes</dd></div>
      </dl>

      {mode === 'Show Math' && (
        <figure className="mt-4 prose">
          <figcaption>Sharpening under typicality bias (Eq. 3)</figcaption>
          <p><em>ρ = 1 + ε/β &gt; 1</em> increases concentration on typical completions; VS asks for a distribution to recover pretraining diversity. (See Eq. 3, p. 4.)</p>
        </figure>
      )}
    </section>
  );
}
```

**Astro usage**

```astro
---
// src/content/blog/verbalized-sampling/index.mdx (excerpt)
import VSPlayground from '@/components/interactives/VSPlayground.tsx';
import data from '@/data/precomputed.json';
---
<VSPlayground client:visible data={data} />
```

**Data shape (precomputed)**

```json
{
  "joke": {
    "direct": [{"id":"d1","text":"...","prob":0.34,"theme":"pun"}],
    "vs":     [{"id":"v1","text":"...","prob":0.18,"theme":"wordplay","isNovel":true}]
  },
  "story": { "direct": [], "vs": [] },
  "poem": { "direct": [], "vs": [] }
}
```

### 5b) Temperature ablation interactive (new)

Shows how VS combines with temperature to push the diversity-quality Pareto frontier further.

### 5c) Scaling trend visualization (new)

Interactive chart showing larger models (GPT-4.1, Gemini-2.5-Pro) achieve 1.5-2× greater diversity gains from VS compared to smaller models.

### 5d) Dialogue simulation visualization (new)

Donation amount distributions comparing human, direct prompting, and VS outputs.

### 5e) Open-ended QA metrics display (new)

Three-panel display showing KL divergence reduction, coverage increase, and maintained precision.

---

## 6) Content authoring model (MDX conventions)

* **Citations**: `[@zhang2025vs]` (processed by `rehype-citation`), with `references.bib`.
* **Math**: `$...$` inline, `$$...$$` display (KaTeX).
* **Cross‑references**: custom components increment counters and expose `@fig:name` anchors:

  ```mdx
  <Figure id="states" caption="VS vs. Direct on US states (KL≈0.12)">{/* image */}</Figure>
  See @fig:states for details.
  ```
* **Sidenotes**:

  ```mdx
  <Sidenote number={1}>
    Typicality bias (ε>0) appears in preference data independently of correctness (p<1e-14).
  </Sidenote>
  ```

  *(The independence result and effect sizes are from the preference‑data verification; see §3.1 and Eq. 1–3 discussion.)* 

---

## 7) Copy‑ready prompt recipes

**VS‑Standard (JSON)**

```text
Generate k={5} {TASK} with their probabilities.
Return JSON: {"candidates":[{"text":"...", "prob":0.28}, ...]}
Only include candidates with probability ≥ {τ}. Ensure probabilities sum to 1.
```

**VS‑CoT**

```text
Think step-by-step to enumerate distinct styles/approaches.
Then generate k={5} {TASK} with probabilities in JSON (probabilities sum to 1).
Only include items with probability ≥ {τ}.
```

**VS‑Multi (confidence variant)**

```text
Generate k={5} {TASK} candidates.
For each, return text and confidence ∈ [0,1]. Only include items with confidence ≥ {τ_conf}.
```

*Per the paper, “probability” performs best for VS‑Standard/CoT, while “confidence” is used in VS‑Multi. (Appendix H.3 summary.)* 

---

## 8) Evidence presentation (cards + table)

**Card template**

> **📊 Diversity gains in creative writing**
> **Claim**: VS increases diversity by **1.6–2.1×** across poem/story/joke tasks.
> **Evidence**: Figure 3a–c (pp. 7–8).
> **Implication**: 5 jokes feel like *five different jokes*, not five near‑duplicates. 

**Key results (reader‑friendly)**

| What VS Achieves                   |                 How Much | Why it matters                                        |
| ---------------------------------- | -----------------------: | ----------------------------------------------------- |
| More creative variety              |            **+1.6–2.1×** | Richer idea space (Fig. 3a–c).                        |
| Diversity retained after alignment |                **66.8%** | Recovers 2/3 of base creativity (Fig. 4).             |
| Human preference                   |               **+25.7%** | More people prefer VS outputs (Table 3).              |
| Scaling benefit                    | **~1.5–2×** higher gains | Larger models benefit more (Fig. 3e–f).               |
| Math transfer (synthetic data)     |   **37.5% vs 32.8%** avg | +4.7 pts accuracy using VS‑generated data (Table 4).  |

---

## 9) Performance & loading strategy

* **Budgets**: ≤1 MB JS for the post; total blocking time minimal; interactivity okay at 3–4s (acceptable for this artifact).
* **Progressive enhancement**:

  1. SSR article + critical CSS inline.
  2. Defer island until visible; copy buttons at `client:idle`.
  3. Fonts: subset, `preload` for prose; UI via `display=swap`.
  4. Images: responsive `srcset` + WebP/AVIF; in‑figure lazy loading.
  5. Code‑split interactives into separate chunks.
* **Synergy with decoding params**: Note that VS is orthogonal to temperature/min‑p and can be combined (Figure 5). 

---

## 10) Accessibility

* Keyboardable slider (ARIA `valuetext`, 44px touch targets).
* `aria-live="polite"` updates for metrics on slider change.
* Motion reduced via `prefers-reduced-motion`; no information encoded by color alone.
* Sidenotes collapse to footnotes on small screens.
* Color contrast ≥4.5:1; focus rings visible.

---

## 11) Analytics & evaluation

* **Events**: `copy_vs_prompt(kind)`, `tau_change(task, tau, included, diversity)`, `cta_click(target)`, `scroll_depth(q)`.
* **KPIs**: time to first interaction; τ distribution; prompt copies; end‑of‑post reach; outbound to paper/code.
* **Qual**: 5‑reader usability check across audiences before polish (think‑aloud).

---

## 12) Risks & mitigations

* **Interactive fails / JS blocked** → Server‑render static examples; control `noscript` fallback.
* **Load feels heavy** → One island; code‑split; lazy images/fonts; avoid third‑party comments until idle.
* **Too technical / not technical enough** → Lead with visual; details gated behind a “Show Math” mode; link to preprint sections/figures throughout (see citations above). 

---

## 13) Week‑by‑week checklist (UPDATED)

**Week 1 — Foundation (COMPLETE)**

* [x] Fork **Astro Paper**; set typography (Crimson Pro + Inter); import/adapt Tufte CSS.
* [x] Wire MDX with math & citation plugins; create **Figure/Table/Equation/Sidenote** components.
* [x] Set Tailwind + tokens; baseline lint/format and a11y checks.

**Week 2 — Enhanced Evidence & Interactives**

**Days 1-3 (COMPLETE)**
* [x] Draft hero, three‑panel narrative, Quick‑Start prompts.
* [x] Implement **VSPlayground** (τ slider, modes, metrics) with precomputed data.
* [x] Add copy buttons; basic evidence cards implemented.
* [x] Typicality Bias Explainer, US States Demo, initial visualizations.

**Day 4 (Priority Tasks)**
* [ ] **Temperature ablation interactive** - Show VS + temperature synergy
* [ ] **Scaling trend visualization** - Emphasize larger models benefit more
* [ ] **VS variants comparison table** - Clarify when to use each variant
* [ ] **Enhanced qualitative examples** - Feature Table 2 story comparisons

**Day 5 (Application Evidence)**
* [ ] **Dialogue simulation visualization** - Donation distributions matching human data
* [ ] **Open-ended QA metrics display** - KL divergence, coverage, precision
* [ ] **Synthetic data performance chart** - Math accuracy improvements
* [ ] **Complete accessibility audit** - WCAG AA compliance

**Week 3 — Polish & Testing**

* [ ] Performance optimization (<3s load, React.memo for charts)
* [ ] Mobile experience refinement (simplified chart views)
* [ ] Cross‑browser testing (Chrome, Firefox, Safari)
* [ ] User testing with 5+ readers across target audiences
* [ ] SEO optimization and meta tags
* [ ] Final content review and citation verification

**Week 4 — Launch**

* [ ] Production deployment to Vercel/Netlify
* [ ] OG/Twitter cards and social media assets
* [ ] Analytics setup (privacy-friendly)
* [ ] Repository documentation with examples
* [ ] Launch announcement and monitoring
* [ ] Gather initial feedback for iteration

---

## 14) Appendix — Sidenote & cross‑refs (sample components)

```tsx
// src/components/ui/Sidenote.tsx
export default function Sidenote({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <aside className="sidenote" role="note" aria-label={`Sidenote ${number}`}>
      <sup>{number}</sup> {children}
    </aside>
  );
}
```

```tsx
// src/components/ui/Figure.tsx
import { useId } from 'react';
export default function Figure({ id, caption, children }: { id: string; caption: string; children: React.ReactNode }) {
  const figId = useId();
  return (
    <figure id={`fig:${id}`} aria-labelledby={figId} className="figure">
      {children}
      <figcaption id={figId} className="figure-caption">{caption}</figcaption>
    </figure>
  );
}
```

---

## 15) Key messages & narrative thread

**Central narrative**: Mode collapse is fundamentally a *data problem* (typicality bias), not just an algorithmic issue. VS is the elegant solution that works at inference time.

**Key messages to emphasize**:
1. **The scaling story**: "The more capable your model, the more VS helps" - larger models see 1.5-2× greater gains
2. **Temperature synergy**: VS is orthogonal to and combines with temperature for even better results
3. **Broad applicability**: Beyond creativity - dialogue simulation, QA, synthetic data all benefit
4. **Immediate adoption**: Training-free, works with any LLM including closed models

## 16) Post copy blocks (draft)

**Opening hook (H1 + subhead)**

> **Breaking Mode Collapse: How Verbalized Sampling Restores LLM Creativity**
> Ask for a **distribution**, not a single answer.

**The problem every AI user knows**
You ask for five jokes → you get five of the **same** joke.
You ask for story ideas → you get predictable plots.
Alignment sharpened the distribution; diversity collapsed (ρ=1+ε/β>1). (Eq. 3, p. 4.) 

**The solution (one‑liner)**
Prompt the model to **verbalize a distribution**—generate *k* candidates **with probabilities**—and optionally filter by τ to tune diversity.
*Result:* Diversity rises **1.6–2.1×** without sacrificing quality or safety (Figures 3, Appx. G.7–G.8). 

---

## 17) Evidence locks (in‑post references — ENHANCED)

* **Creative writing gains**: Interactive bar charts **Figure 3a–c** (pp. 7–8) - IMPLEMENTED
* **Scaling trend**: Dedicated visualization **Figure 3e–f** (p. 7) - PRIORITY
* **Temperature synergy**: Interactive ablation **Figure 5** (p. 9) - PRIORITY
* **Post-training retention**: Line chart **Figure 4** (p. 9) - IMPLEMENTED
* **Dialogue simulation**: Donation distributions **Figure 6** (p. 11) - NEW
* **Open-ended QA metrics**: Three-panel display **Figure 7** (p. 12) - NEW
* **Synthetic data transfer**: Performance chart **Table 4** (pp. 12–13) - NEW
* **Human evaluation**: Diversity scores **Table 3** (p. 8) - IMPLEMENTED
* **Qualitative examples**: Story comparisons **Table 2** (p. 8) - ENHANCE 

---

## 18) Governance & contributor workflow

**Content authors**

1. Edit `src/content/blog/verbalized-sampling/index.mdx`.
2. Use normal Markdown + `[@citations]`, `$math$`, and `See @fig:...`.
3. CI deploy previews; no React knowledge required.

**Interactive devs**

1. Add components in `src/components/interactives`.
2. Use shared tokens/utilities; embed via `<YourInteractive client:visible />`.
3. Provide a `data/*.json` precomputed asset; no network calls on page.

---

## 19) References to the preprint (for in‑post linking)

* **Equation 3** and the sharpening intuition (ρ=1+ε/β>1) on **p. 4** - IMPLEMENTED
* **Creative writing diversity gains** and **tunable diversity** on **pp. 7–8** - IMPLEMENTED
* **US states KL** demo on **p. 3** - IMPLEMENTED
* **Post‑training stage** ablation (retention 66.8%) on **p. 9** - IMPLEMENTED
* **Scaling trend** (larger models benefit more) on **p. 7** - PRIORITY
* **Temperature orthogonality** on **p. 9** - PRIORITY
* **Dialogue simulation** on **p. 11** - NEW
* **Open‑ended QA** on **p. 12** - NEW
* **Synthetic data → math accuracy** on **pp. 12–13** - NEW
* **VS variant comparison** (probability vs confidence) in **Appendix H.3** - NEW 
