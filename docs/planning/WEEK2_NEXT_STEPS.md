# Week 2 Next Steps - Immediate Action Plan

## 🎯 Day 3 Priority Tasks (October 4, 2025)

### 1. Copy Functionality (CRITICAL)
```javascript
// Add to all code blocks and prompt examples
- [ ] Install copy-to-clipboard library
- [ ] Create CopyButton component
- [ ] Add to VS prompt recipes
- [ ] Add to playground outputs
- [ ] Test on mobile devices
```

### 2. Qualitative Examples Section
```markdown
- [ ] Create story comparison component
- [ ] Add Table 2 examples (Direct vs VS)
- [ ] Implement side-by-side view
- [ ] Add "Why this is better" annotations
```

### 3. Quick Start Section
```markdown
## Quick Start (Try in <30 seconds)

### For Jokes:
[Copy] Generate 5 jokes about coffee with their probabilities.
Return JSON: {"candidates":[{"text":"...", "prob":0.28}, ...]}
Only include candidates with probability ≥ 0.1.

### For Stories:
[Copy] Generate 5 story openings about "Without a goodbye" with probabilities.
Focus on diverse themes and styles. Return with prob ≥ 0.15.

### For Poems:
[Copy] Generate 5 poem continuations with diverse styles and probabilities.
Return candidates with prob ≥ 0.1 in JSON format.
```

## 📊 Day 4 Focus Areas

### Temperature Ablation Interactive
- Show VS + Temperature combination benefits
- Interactive sliders for both parameters
- Real examples showing orthogonal improvements

### Model Comparison Table
| Model | Direct Diversity | VS Diversity | Improvement | Best For |
|-------|-----------------|--------------|-------------|----------|
| GPT-4 | 15.2% | 28.4% | 1.87× | Creative writing |
| Claude | 18.1% | 31.2% | 1.72× | Dialogue |
| Gemini | 16.5% | 29.8% | 1.81× | Stories |

## 🔧 Technical Debt to Address

1. **Performance Issues**
   - Chart components need React.memo
   - Lazy load heavy visualizations
   - Optimize bundle size

2. **Mobile Experience**
   - Responsive charts
   - Touch-friendly sliders
   - Simplified mobile layouts

3. **Error Handling**
   - Add error boundaries
   - Fallback content for failures
   - Loading states for all async operations

## 📈 Metrics to Track

```javascript
// Add analytics events
- copy_prompt_clicked(prompt_type)
- threshold_adjusted(value)
- mode_switched(mode_type)
- evidence_viewed(chart_name)
- scroll_depth(percentage)
```

## 🚨 Blockers to Resolve

1. **Copy functionality** - Without this, adoption will be limited
2. **Mobile performance** - Charts may be slow on mobile
3. **Content length** - Need collapsible sections to manage

## ✅ Definition of Done for Week 2

- [ ] All code blocks have copy buttons
- [ ] Qualitative examples are showcased
- [ ] Temperature ablation is interactive
- [ ] Mobile experience is smooth
- [ ] Page loads in <3 seconds
- [ ] Accessibility audit passes
- [ ] All evidence from paper is represented
- [ ] Quick start section is prominent
- [ ] Social sharing is enabled

---

**Next Action:** Start with copy functionality implementation as it's the highest impact feature for user adoption.