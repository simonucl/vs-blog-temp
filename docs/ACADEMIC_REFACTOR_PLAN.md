# Academic Refactor Plan - Verbalized Sampling Blog

**Created:** October 3, 2025
**Status:** Ready to Execute (aligned with PROJECT_PLAN v7)
**Estimated Time:** 75–90 minutes
**Goal:** Transform the MDX post into academically rigorous content using LaTeX, citations, sidenotes, and cross‑refs — while matching the IA, evidence, and authoring conventions defined in PROJECT_PLAN.md (v7)

---

## 🎯 Objective

Convert `src/data/blog/verbalized-sampling.mdx` from a blog‑style post into an **academic explainer** using:
- LaTeX math rendering (KaTeX)
- BibTeX citations (rehype-citation)
- Tufte-style sidenotes
- Proper academic components (Figure, Equation, Table)
- Clean Markdown prose

---

## 📊 Current State vs. Target State

### Current Issues

1. **Math is plain text in code tags** instead of LaTeX
   - Current: `<code>ρ=1+ε/β>1</code>`
   - Should be: `$\rho = 1 + \varepsilon/\beta > 1$`

2. **No citations** - manual references instead of BibTeX
   - Current: `"Figure 3a-c, pp. 7-8"`
   - Should be: `[@zhang2025vs]`

3. **No sidenotes** - scholarly context missing
   - Component exists at `src/components/academic/Sidenote.tsx`
   - Not used anywhere in content

4. **Too much HTML/JSX** - not prose-first
   - Tons of `<div className="...">` wrappers
   - Should be clean Markdown

5. **No academic structure**
   - No figure numbering/cross-references
   - No proper bibliography section

### What's Already Working

✅ KaTeX configured in `astro.config.ts` (remarkMath + rehypeKatex)
✅ rehype-citation configured with `src/references.bib`
✅ Sidenote component exists
✅ Figure, Table, Equation components exist
✅ Interactive components work well

Note: KaTeX renders Markdown/MDX `$...$/$$...$$` via `remark-math` + `rehype-katex`. Inside React islands, raw `$...$` is not transformed at build time. Prefer Markdown math in MDX prose; if you need math inside an island, render via `katex.renderToString(...)` or keep it as plain text.

---

## 📋 Execution Plan

### Phase 0: Align structure with PROJECT_PLAN IA (5 min)

Ensure the MDX follows the top→bottom IA in PROJECT_PLAN §2:
- Hero/Opening Hook → TL;DR → Three‑panel Why → τ Playground → Evidence → Decision Tree → Recipes → FAQ → References.
- Move any Quick Start/copy‑ready prompts down into the Recipes section (don’t place above Why/Playground).
- Use existing sections/components where available: `OpeningHook`, `AhaMoment`, `VSPlayground`, evidence visuals, `VSVariantsComparison`.

Outcome: A consistent section order and headings matching the v7 plan.

### Phase 1: Setup & Imports (5 min)

**Task:** Import academic components into MDX

```mdx
import { Sidenote, Figure, Table /* Equation (optional) */ } from "@/components/academic";
```

Tip: Prefer Markdown math in MDX (`$...$`, `$$...$$`). Only use `<Equation>` if you later enhance it to call KaTeX at runtime. Cross‑refer display equations by wrapping them with an anchor id (see Phase 6).

**Validation:** Components import without errors

---

### Phase 2: Convert Math to LaTeX (15 min)

**Task:** Replace all math notation with proper LaTeX

#### Inline Math Examples

**Before:**
```mdx
<code className="text-sm">ρ=1+ε/β>1</code>
```

**After (Markdown math):**
```mdx
$\rho = 1 + \varepsilon/\beta > 1$
```

#### Display Math Examples

**Before:**
```mdx
<div className="bg-gray-50 rounded p-3">
  <code>r(x,y) = r_true(x,y) + ε·log(p_base)</code>
</div>
```

**After (Markdown display math):**
```mdx
$$r(x,y) = r_{\text{true}}(x,y) + \varepsilon \cdot \log p_{\text{base}}(y|x)$$
```

#### Complete Conversion List

| Current | LaTeX |
|---------|-------|
| `ε` | `\varepsilon` |
| `ρ` | `\rho` |
| `τ` | `\tau` |
| `β` | `\beta` |
| `π` | `\pi` |
| `≈` | `\approx` |
| `≥` | `\geq` |
| `→` | `\rightarrow` |

If you must render math inside a React island, either:
- Render with KaTeX in the component: `katex.renderToString(formula, { displayMode: true })`, or
- Keep as plain text (not ideal), or relocate the formula to MDX prose.

**Validation:** All MDX math renders with KaTeX styling; no `<code>` tags remain for formulas.

---

### Phase 3: Add BibTeX Citations (10 min)

**Task:** Replace manual references with proper citations

#### Main Paper Citation

**Before:**
```mdx
This approach demonstrates (Figure 3a-c, pp. 7-8)
```

**After:**
```mdx
This approach [@zhang2025vs] demonstrates...
```

#### Multiple Citations

**Before:**
```mdx
Previous work has shown (various sources)
```

**After:**
```mdx
Previous work [@padmakumar2024; @west2025; @lu2025a] has shown...
```

#### Paper Sections

**Before:**
```mdx
See the appendix (Appx. G.7, G.8)
```

**After:**
```mdx
See [@zhang2025vs, Appendix G.7-G.8]
```

Replace the bottom “Citation” code block with a proper References section (Phase 6). Do not inline BibTeX.

**Validation:** Citations render as links; bibliography appears under “References”.

---

### Phase 4: Add Sidenotes (20 min)

**Task:** Add scholarly context and technical details as margin notes

#### Use Cases for Sidenotes

1. **Technical details** that would interrupt flow
2. **Statistical evidence** supporting claims
3. **Paper appendix references**
4. **Related work** context
5. **Implementation notes**

#### Example Placements

**Location 1: Typicality Bias**
```mdx
Human annotators prefer familiar, typical text<Sidenote number={1}>
This mere-exposure effect and processing fluency bias is well-documented in cognitive psychology.
Statistical analysis shows $\varepsilon > 0$ independent of correctness ($p < 10^{-14}$). See [@zhang2025vs, Section 3.1].
</Sidenote>.
```

**Location 2: Mathematical Derivation**
```mdx
The sharpening parameter $\rho = 1 + \varepsilon/\beta$<Sidenote number={2}>
Derived from the DPO objective with typicality-biased rewards. Full derivation in [@zhang2025vs, Equation 3, p. 4].
</Sidenote> controls distribution concentration.
```

**Location 3: Implementation Details**
```mdx
We recommend $k=5$ candidates<Sidenote number={3}>
Empirical analysis shows diminishing returns beyond $k=5$, with quality degradation for $k>10$. See [@zhang2025vs, Appendix H.1].
</Sidenote> for most use cases.
```

**Location 4: US States Demo**
```mdx
VS recovers the pretraining distribution with $\text{KL} \approx 0.12$<Sidenote number={4}>
This KL divergence is measured against the actual population distribution of US states in the training corpus [@zhang2025vs, Figure 2, p. 3].
</Sidenote>.
```

**Location 5: Safety Claims**
```mdx
VS maintains factual accuracy and safety<Sidenote number={5}>
Comprehensive evaluations show no degradation in safety scores (ToxiGen, AdvBench) or factual accuracy (TriviaQA, NaturalQuestions). See [@zhang2025vs, Appendix G.7-G.8].
</Sidenote>.

**Location 6: Temperature Synergy**
```mdx
VS combines with temperature without redundancy<Sidenote number={6}>
VS changes the requested distribution; temperature changes sampling from it. Effects are complementary [@zhang2025vs, Figure 5].
</Sidenote>.
```

**Location 7: Scaling Trend**
```mdx
Larger models show stronger gains<Sidenote number={7}>
~1.5–2× larger diversity gains for higher‑capacity models [@zhang2025vs, Figure 3e–f, p. 7].
</Sidenote>.
```
```

**Validation:** Sidenotes appear in margin on desktop, inline on mobile

---

### Phase 5: Clean Up HTML/JSX (15 min)

**Task:** Replace HTML divs with clean Markdown

#### Remove Unnecessary Wrappers

**Before:**
```mdx
<div className="not-prose bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-12">
  <h3 className="text-2xl font-bold mb-4">TL;DR</h3>
  <ul className="space-y-2">
    <li className="flex items-start gap-2">
      <span className="text-blue-500 mt-1">•</span>
      <span>RLHF creates <strong>typicality bias</strong></span>
    </li>
  </ul>
</div>
```

**After:**
```mdx
## TL;DR

- RLHF creates **typicality bias** ($\varepsilon > 0$) leading to mode collapse ($\rho = 1 + \varepsilon/\beta > 1$)
- VS recovers diversity by prompting for **probability distributions**
- Threshold $\tau$ enables **diversity tuning** without retraining
```

#### Keep HTML Only For:
- Interactive component wrappers (`<div className="not-prose">`)
- Special callout boxes that need styling
- Training-free badges (visual emphasis)
- Replace marketing‑style gradient callouts (e.g., “VS Matches Fine‑Tuned Models”) with normal Markdown sections using academic tone + citations.

#### Convert to Markdown:
- Headings: Use `##` instead of `<h2>`
- Lists: Use `-` instead of `<li>`
- Emphasis: Use `**bold**` and `*italic*`
- Code: Use backticks instead of `<code>`

**Validation:** Content reads like prose with embedded interactives

---

### Phase 6: Add Academic Structure (15 min)

**Task:** Add proper academic formatting

#### Figure Components

**Before:**
```mdx
<div className="not-prose mb-12">
  <DiversityGainsVisual client:visible />
</div>
```

**After:**
```mdx
<Figure id="diversity-gains" caption="Diversity gains across creative writing tasks. VS-CoT achieves 1.6-2.1× improvement over direct prompting in poem, story, and joke generation [@zhang2025vs, Figure 3a-c].">
  <DiversityGainsVisual client:visible />
</Figure>
```

#### Cross-References (anchor links, per PROJECT_PLAN §6)

The `Figure`/`Equation` components expose ids like `fig:states` and `eq:sharpening`.

Use standard anchor links for cross‑refs:

```mdx
See [Figure @fig:diversity-gains](#fig:diversity-gains) for details.
Sharpening is defined in [Eq. @eq:sharpening](#eq:sharpening).
Human preference results: [Table @table:human-pref](#table:human-pref).
```

For display equations authored in Markdown, create an anchor above the formula to enable cross‑refs without the `<Equation>` component, and add a short cross‑ref sentence near first mention:

```mdx
<a id="eq:sharpening" />
$$\pi^*(y|x) \propto \pi_{\text{ref}}(y|x)^\rho,\quad \rho = 1 + \varepsilon/\beta > 1$$
```

Also add one‑liners near sections to reinforce cross‑refs:

```mdx
See [Figure @fig:diversity-gains](#fig:diversity-gains) for creative writing results.
See [Figure @fig:temperature-ablation](#fig:temperature-ablation) for the Pareto frontier.
See [Figure @fig:scaling-trend](#fig:scaling-trend) for scaling effects.
```

#### Bibliography Section

Let `rehype-citation` render the bibliography from `src/references.bib`. At the end of the MDX, add a References heading and an empty section anchor the plugin can target:

```mdx
## References

<section id="references" />
```

Do not inline BibTeX as code in the article body. Remove any “Citation” code blocks in favor of this section.

Optional polish:

- Add a direct download link for BibTeX near the References heading. Place a copy of `references.bib` in `public/` and link with the site base URL or explicit base path (e.g., `/vs-blog-temp/references.bib`).

- Use Chicago Author‑Date CSL for this explainer. Add the CSL at `src/styles/chicago-author-date.csl` and pass it to `rehype-citation` in `astro.config.ts`:

```ts
['rehype-citation', {
  bibliography: 'src/references.bib',
  csl: 'src/styles/chicago-author-date.csl',
  linkCitations: true
}]
```

**Validation:** Figures/equations numbered; cross‑refs link to anchors; bibliography renders under “References”.

---

### Phase 7: Evidence Locks & Mapping (5 min)

Ensure every claim in “Evidence” maps to the paper, mirroring PROJECT_PLAN §17:

- Creative writing diversity: [@zhang2025vs, Figure 3a–c]
- Post‑training retention: [@zhang2025vs, Figure 4]
- Temperature orthogonality: [@zhang2025vs, Figure 5]
- Scaling trend: [@zhang2025vs, Figure 3e–f]
- Dialogue simulation: [@zhang2025vs, Figure 6]
- Open‑ended QA: [@zhang2025vs, Figure 7]
- Synthetic data → math accuracy: [@zhang2025vs, Table 4]

Add these citations or footnotes at the point of each claim.

Minimal visuals for stubs (optional but recommended):

```mdx
<Table id="openqa" caption="Open‑ended QA metrics summary [@zhang2025vs, Figure 7].">{/* rows */}</Table>
<Table id="synthetic-math" caption="Synthetic data → downstream math accuracy [@zhang2025vs, Table 4].">{/* rows */}</Table>
```

---

### Phase 8: Opening Hook and Aha Moment (5–10 min)

Integrate sections called out in PROJECT_PLAN §13 (Day 4 completed items):

- Add `OpeningHook` near the top as the hero/attention grabber.
- Add `AhaMoment` after the three‑panel “Why it works” to reinforce the core insight.

```mdx
import OpeningHook from "@/components/sections/OpeningHook";
import AhaMoment from "@/components/sections/AhaMoment";

<div className="not-prose mb-10">
  <OpeningHook client:visible />
</div>

{/* After Why It Works */}
<div className="not-prose mb-10">
  <AhaMoment client:visible />
</div>
```

Validation: Both render correctly; headings remain prose‑first.

### Phase 9: Prompt Recipes (copy‑ready) (5–10 min)

Replace any ad‑hoc prompt text with the three recipes from PROJECT_PLAN §7 and §17. Use `CodeBlock` with copy buttons if desired.

```mdx
import CodeBlock from "@/components/ui/CodeBlock";

### VS‑Standard (JSON)
<CodeBlock code={`Generate k={5} {TASK} with their probabilities.\nReturn JSON: {"candidates":[{"text":"...","prob":0.28}, ...]}\nOnly include candidates with probability ≥ {τ}. Ensure probabilities sum to 1.`} language="text" client:idle />

### VS‑CoT
<CodeBlock code={`Think step-by-step to enumerate distinct styles.\nThen generate k={5} {TASK} with probabilities (sum to 1).\nOnly include items with probability ≥ {τ}.`} language="text" client:idle />

### VS‑Multi (confidence)
<CodeBlock code={`Generate k={5} {TASK} candidates.\nFor each, return text and confidence ∈ [0,1].\nOnly include items with confidence ≥ {τ_conf}.`} language="text" client:idle />
```

Add a short comparison sentence linking to the variants table.

### Phase 10: Decision Tree (Is VS right for you?) (5 min)

Recast the current UI block as concise prose + list (academic tone), keeping any visuals as optional wrappers. Ensure claims are citation‑backed where applicable.

---

## 📝 Specific Conversion Examples

### Example 1: Three‑Panel "Why It Works"

**Before:**
```mdx
<div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <h3 className="font-semibold text-lg mb-3">1. Hidden Bias</h3>
    <p className="text-gray-600 mb-4">
      Human annotators prefer familiar, typical text
    </p>
    <div className="bg-gray-50 rounded p-3">
      <code className="text-sm">r(x,y) = r_true(x,y) + ε·log(p_base)</code>
    </div>
  </div>
  <!-- ... more panels -->
</div>
```

**After:**
```mdx
### Three-Step Mechanism

**1. Hidden Bias in Preference Data**

Human annotators exhibit systematic preference for familiar, typical text<Sidenote number={1}>This bias is statistically independent of correctness ($p < 10^{-14}$), suggesting a cognitive rather than quality-based effect [@zhang2025vs, Section 3.1].</Sidenote>:

$$r(x,y) = r_{\text{true}}(x,y) + \varepsilon \cdot \log p_{\text{base}}(y|x)$$

where $\varepsilon > 0$ represents typicality bias.

**2. Mathematical Collapse**

This bias induces sharpening in the aligned distribution:

$$\pi^*(y|x) \propto \pi_{\text{ref}}(y|x)^\rho$$

where $\rho = 1 + \varepsilon/\beta > 1$<Sidenote number={2}>Derived from the DPO objective. When utility is flat across valid completions, sharpening concentrates probability mass on typical outputs [@zhang2025vs, Equation 3, p. 4].</Sidenote>.

**3. Distribution‑Level Recovery**

VS prompts for probability distributions rather than single samples, recovering pretraining diversity ($\text{KL} \approx 0.12$ for US states task).

<Figure id="us-states" caption="Distribution recovery on US states task [@zhang2025vs, Figure 2].">
  <USStatesDemo client:visible />
</Figure>
```

### Example 2: Evidence Section

**Before:**
```mdx
<div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  <div className="bg-white rounded-lg p-6 border-2 border-green-200">
    <div className="text-4xl font-bold text-green-600 mb-2">1.6-2.1×</div>
    <div className="font-semibold mb-1">Diversity Gains</div>
    <div className="text-sm text-gray-600">Creative writing tasks</div>
    <div className="text-xs text-gray-500 mt-2">Figure 3a-c, pp. 7-8</div>
  </div>
  <!-- ... -->
</div>
```

**After:**
```mdx
## Empirical Evidence

### Creative Writing Diversity

VS demonstrates **1.6-2.1× diversity improvement** across poem, story, and joke generation tasks [@zhang2025vs, Figure 3a-c]. The semantic diversity metric<Sidenote number={6}>Defined as $1 - \text{mean}(\text{cosine\_similarity})$ over embedding pairs. Measures semantic, not just lexical, variety.</Sidenote> shows consistent gains with VS-CoT achieving the highest scores.

<Figure id="diversity-gains" caption="Diversity gains across creative writing tasks.">
  <DiversityGainsVisual client:visible />
</Figure>

### Human Preference

Human evaluators prefer VS outputs **+25.7%** more frequently than direct prompting [@zhang2025vs, Table 3], indicating that increased diversity aligns with human preferences for creative tasks.

### Post-Training Retention

After alignment, base models retain only **33.2%** of their original diversity. VS recovers this to **66.8%**<Sidenote number={7}>Measured across the Llama-2 → Llama-2-Chat training pipeline. See [@zhang2025vs, Figure 4, p. 9] for full ablation across training stages.</Sidenote>, recovering approximately two-thirds of the lost diversity.

<Figure id="post-training" caption="Diversity retention through training stages.">
  <PostTrainingVisual client:visible />
</Figure>
```

---

## ✅ Validation Checklist

After refactor, verify:

- [ ] All math renders with KaTeX (no plain text equations)
- [ ] Citations are clickable links to bibliography
- [ ] Sidenotes appear in margin (desktop) / inline (mobile)
- [ ] No unnecessary HTML/JSX (prose-first)
- [ ] Figures have proper captions and numbers
- [ ] Cross-references work (e.g., "Figure @fig:diversity-gains")
- [ ] Bibliography section at end with BibTeX
- [ ] Evidence locks map 1:1 to paper figures/tables (PROJECT_PLAN §17)
- [ ] Interactive components still work
- [ ] Page loads without console errors
- [ ] Academic tone maintained while staying accessible
- [ ] OpeningHook and AhaMoment used per IA
- [ ] Prompt recipes (VS‑Standard/CoT/Multi) included and copy‑ready
- [ ] Decision tree section is prose‑first, not UI‑heavy

Edge‑case: If any React island displays math, prefer moving the formula to MDX prose or render with KaTeX in the component.

---

## ♿ Accessibility & ⚡ Performance (PROJECT_PLAN §§9–10)

- A11y
  - Slider is keyboardable with ARIA `valuetext`; focus rings visible.
  - `aria-live="polite"` for metric updates in interactives.
  - Sidenotes collapse to inline on mobile; no color‑only semantics; contrast ≥ 4.5:1.
- Performance
  - Keep ≤ ~1 MB JS for the post; islands load `client:visible`, copy buttons on `client:idle`.
  - Code‑split interactives; responsive images; `prefers-reduced-motion` honored.

Add spot checks during review; do not regress budgets.

---

## 📈 Analytics (Optional, PROJECT_PLAN §11)

If analytics are enabled, emit events from interactives and key CTAs:

- `copy_vs_prompt(kind)` when copying prompt recipes
- `tau_change(task, tau, included, diversity)` from the playground
- `cta_click(target)` for primary buttons (e.g., “Copy VS Prompt”)
- `scroll_depth(q)` to gauge engagement

---

## 🎨 Style Guidelines

### Academic Voice
- Use passive constructions where appropriate: "is demonstrated" vs "we show"
- Precise terminology: "exhibits typicality bias" vs "has bias"
- Citations support every claim
- Sidenotes for technical depth

### Math Notation
- Always use LaTeX for math
- Display equations for key results: `$$...$$`
- Inline for references: `$\tau$`
- Proper subscripts/superscripts: `p_{\text{base}}` not `p_base`

### Citations
- Inline: `[@author2025]`
- Multiple: `[@author1; @author2]`
- With pages: `[@author2025, pp. 7-8]`
- With sections: `[@author2025, Section 3.1]`

### Sidenotes
- Number sequentially
- Keep focused (2-4 sentences)
- Provide evidence/references
- Don't repeat main text

---

## 📦 Deliverables

1. **Updated MDX file** (`src/data/blog/verbalized-sampling.mdx`)
   - LaTeX math throughout
   - BibTeX citations
   - 5-7 strategically placed sidenotes
   - Clean Markdown prose
   - Proper Figure components
   - Cross‑ref links `[Figure @fig:id](#fig:id)`, `[Eq. @eq:id](#eq:id)`, `[Table @table:id](#table:id)`
   - OpeningHook + AhaMoment integrated
   - Prompt recipes section added
   - Decision tree is prose‑first

2. **Verified bibliography** (`src/references.bib`)
   - All cited works present
   - Proper BibTeX formatting
   - Optional CSL style file wired (e.g., `apa.csl`) if switching styles is desired

3. **Evidence locks**
   - Each claim in “Evidence” cites its corresponding figure/table per PROJECT_PLAN §17

4. **Visual verification**
   - Screenshot showing KaTeX rendering
   - Screenshot showing sidenotes in margin
   - Screenshot showing citations

5. **Git commit**
   - Clear commit message
   - All changes staged
   - No breaking changes

---

## 🧭 Authoring & Governance (PROJECT_PLAN §18)

- Authors edit `src/data/blog/verbalized-sampling.mdx` using:
  - Citations: `[@key]`, pages/sections as needed (`[@key, p. 7]`)
  - Math: `$inline$` and `$$display$$`
  - Cross‑refs: `[Figure @fig:id](#fig:id)`, `[Eq. @eq:id](#eq:id)`
- Interactive devs
  - Add islands under `src/components/interactives` with precomputed data in `src/data/**`.
  - Embed via `<YourInteractive client:visible />`; no network calls on page.

---

## 🚀 Execution Order

1. Start dev server (`npm run dev`)
2. Open `src/data/blog/verbalized-sampling.mdx`
3. Phase 1: Add component imports
4. Phase 2: Convert math section-by-section (test after each)
5. Phase 3: Add citations (verify bibliography renders)
6. Phase 4: Add sidenotes (verify margin placement)
7. Phase 5: Clean up HTML (maintain visual parity)
8. Phase 6: Add Figure components (test cross-refs)
9. Final validation checklist
10. Commit changes

**Estimated Total Time:** 75 minutes
**Recommended Approach:** One phase at a time with validation

---

## 📚 Reference Documentation

- **KaTeX syntax:** https://katex.org/docs/supported.html
- **rehype-citation:** https://github.com/timlrx/rehype-citation
- **Tufte CSS:** https://edwardtufte.github.io/tufte-css/
- **PROJECT_PLAN.md:** Section 6 (Content authoring model)

---

*This plan aligns with PROJECT_PLAN.md Section 6 (Content authoring model) and implements the academic standards defined for the "Researchers" audience.*
