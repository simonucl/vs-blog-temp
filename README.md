# Verbalized Sampling Academic Blogpost

An interactive academic blogpost explaining **Verbalized Sampling (VS)** - a training-free method to restore diversity in LLMs by prompting for probability distributions.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:4321 to view the blogpost.

## 📁 Project Structure

```
vs-blogpost/
├── src/
│   ├── components/
│   │   ├── academic/          # Academic components (Figure, Table, Equation, Sidenote)
│   │   ├── charts/            # Data visualizations (Recharts)
│   │   ├── evidence/          # Evidence visualizations
│   │   ├── interactives/      # VS Playground & Typicality Bias Explainer
│   │   ├── sections/          # QuickStart, QualitativeExamples
│   │   └── ui/                # CopyButton, CodeBlock, PromptCard
│   ├── data/
│   │   ├── blog/              # Main blog post (MDX)
│   │   ├── paper-evidence/    # JSON data from paper
│   │   └── precomputed/       # Playground examples (30 per task)
│   ├── pages/                 # Additional pages and demos
│   ├── styles/                # Global and academic CSS
│   └── references.bib         # Bibliography
├── docs/
│   ├── planning/              # Project planning documents
│   └── implementation/        # Implementation status and notes
└── paper/
    └── preprint.pdf          # Original research paper
```

## ✨ Key Features

### Interactive Components
- **VS Playground**: Try different thresholds and view modes
- **Typicality Bias Explainer**: Interactive visualization of ρ = 1 + ε/β
- **Quick Start**: Copy VS prompts in <30 seconds
- **Qualitative Examples**: Side-by-side comparison of Direct vs VS

### Evidence Visualizations
- Diversity gains (1.6-2.1×)
- Post-training retention (66.8%)
- US states distribution (KL=0.12)
- Human preference improvement (+25.7%)

### User Experience
- Copy buttons on all code/prompts
- Responsive design
- Academic typography (Crimson Pro + Inter)
- Math rendering (KaTeX)
- Citations (BibTeX)

## 📊 Implementation Status

**Current Status: Week 2, Day 3 Complete**

### Week 1: Foundation ✅
- Astro + MDX + React setup
- Academic component library
- VS Playground (30 examples/task)
- Typography and citations

### Week 2: Evidence & Interactivity
- ✅ Days 1-2: Chart infrastructure, evidence data
- ✅ Day 3: Copy functionality, Quick Start, qualitative examples
- ⏳ Day 4: Temperature ablation, model comparisons
- ⏳ Day 5: Testing and optimization

### Week 3: Polish & Testing
- Cross-browser testing
- Accessibility audit
- Performance optimization
- User testing

### Week 4: Launch
- Production deployment
- Social media assets
- Monitoring setup

## 🔧 Technologies

- **Framework**: Astro 5.14 + MDX
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + CSS Modules
- **Charts**: Recharts + Framer Motion
- **Math**: KaTeX
- **Citations**: rehype-citation
- **Copy**: copy-to-clipboard

## 📚 Documentation

- [Project Plan](docs/PROJECT_PLAN.md) - Comprehensive planning document
- [Project Status](docs/PROJECT_STATUS.md) - Current implementation status and progress

## 🎯 Key Evidence from Paper

| Metric | Value | Source |
|--------|-------|--------|
| Diversity Gain | 1.6-2.1× | Figure 3a-c |
| Human Preference | +25.7% | Table 3 |
| Diversity Retained | 66.8% | Figure 4 |
| KL Divergence | 0.12 | Figure 2 |
| Math Accuracy | 37.5% vs 32.8% | Table 4 |

## 📝 Citation

```bibtex
@article{zhang2025vs,
  title={Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity},
  author={Zhang, Jiayi and Yu, Simon and Chong, Derek and others},
  journal={Preprint},
  year={2025}
}
```

## 🚦 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Test components
http://localhost:4321/test-copy-components
http://localhost:4321/test-charts
```

## 📄 License

MIT

---

Built with Astro Paper theme | Paper: [preprint.pdf](paper/preprint.pdf)