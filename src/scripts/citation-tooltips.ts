// Add tooltips to citation links
document.addEventListener('DOMContentLoaded', () => {
  // Citation data mapping
  const citations: Record<string, string> = {
    'zhang2025vs': 'Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity (Zhang et al., 2025)',
    'rafailov2024': 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model (Rafailov et al., 2024)',
    'ouyang2022': 'Training language models to follow instructions with human feedback (Ouyang et al., 2022)',
    'christiano2017': 'Deep reinforcement learning from human preferences (Christiano et al., 2017)',
    'padmakumar2024': 'What\'s the Message? Does Preference Alignment Necessarily Harm Creative Capabilities? (Padmakumar & He, 2024)',
    'west2025': 'Personalization, Alignment, and Evaluation of Conversational AI Systems (West & Potts, 2025)',
    'lu2025a': 'Measuring and Improving LLM Creative Capabilities (Lu et al., 2025)',
    'chakraborty2024': 'Reward Model Limitations in Mode Collapse (Chakraborty et al., 2024)',
    'xiao2024': 'KL-Regularized Optimization and Majority Favoring in RLHF (Xiao et al., 2024)',
    'zhu2025a': 'Synthetic Data Generation with Diversity Considerations (Zhu et al., 2025)',
    'zajonc1968': 'Attitudinal effects of mere exposure (Zajonc, 1968)',
    'tversky1973': 'Availability: A heuristic for judging frequency and probability (Tversky & Kahneman, 1973)',
    'alter2009': 'Uniting the tribes of fluency to form a metacognitive nation (Alter & Oppenheimer, 2009)',
    'reber2004': 'Processing fluency and aesthetic pleasure: Is beauty in the perceiver\'s processing experience? (Reber et al., 2004)',
    'mandler2014': 'Mind and body: Psychology of emotion and stress (Mandler, 2014)',
    'bradley1952': 'Rank analysis of incomplete block designs: I. The method of paired comparisons (Bradley & Terry, 1952)',
    'wang2023b': 'HelpSteer: Multi-attribute helpfulness prompting for open-source AI datasets (Wang et al., 2023)',
    'kirk2024': 'Understanding the Effects of RLHF on LLM Generalisation and Diversity (Kirk et al., 2024)',
    'murthy2025': 'One fish, two fish, but not the whole sea: Alignment reduces language models\' conceptual diversity (Murthy et al., 2025)',
  };

  // Find all citation links and add title attributes
  const citationLinks = document.querySelectorAll('a[href^="#bib-"]');

  citationLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Extract citation key from href (e.g., "#bib-zhang2025vs" -> "zhang2025vs")
    const citationKey = href.replace('#bib-', '');

    if (citations[citationKey]) {
      link.setAttribute('data-citation', citationKey);
      link.setAttribute('title', citations[citationKey]);
    }
  });
});
