import { useId, useMemo } from 'react';
import katex from 'katex';

interface EquationProps {
  id: string;
  children: string; // LaTeX string
  displayMode?: boolean;
}

// Keep track of equation numbers (stable per id within a session)
let equationCounter = 0;
const equationNumbers = new Map<string, number>();

export default function Equation({ id, children, displayMode = true }: EquationProps) {
  const eqId = useId();
  let equationNumber = equationNumbers.get(id);
  if (!equationNumber) {
    equationNumber = ++equationCounter;
    equationNumbers.set(id, equationNumber);
  }

  const latex = useMemo(() => {
    let s = (children || '').trim();
    if (s.startsWith('$$') && s.endsWith('$$')) s = s.slice(2, -2).trim();
    else if (s.startsWith('$') && s.endsWith('$')) s = s.slice(1, -1).trim();
    return s;
  }, [children]);

  const html = useMemo(() => {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: 'warn',
      output: 'html',
    });
  }, [latex, displayMode]);

  return (
    <div
      id={`eq:${id}`}
      aria-labelledby={eqId}
      className="equation-wrapper"
      data-equation-number={equationNumber}
    >
      <div
        className="equation-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <span id={eqId} className="equation-number">
        ({equationNumber})
      </span>
    </div>
  );
}

// Reset counter for each page load
if (typeof window !== 'undefined') {
  // Reset on client load; numbers are reassigned in DOM order deterministically
  equationCounter = 0;
  equationNumbers.clear();
}
