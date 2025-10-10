import { useId, useMemo, type ReactNode, Children } from 'react';
import katex from 'katex';

interface EquationProps {
  id: string;
  children: ReactNode; // LaTeX string or React node
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
    // Handle different types of children
    let s = '';

    if (typeof children === 'string') {
      s = children;
    } else if (typeof children === 'number') {
      s = String(children);
    } else if (Array.isArray(children)) {
      // Handle array of children
      s = children.map(child =>
        typeof child === 'string' || typeof child === 'number' ? String(child) : ''
      ).join('');
    } else if (children && typeof children === 'object') {
      // Try to extract text from React elements (including Astro's StaticHtml)
      Children.forEach(children, (child: any) => {
        if (typeof child === 'string' || typeof child === 'number') {
          s += String(child);
        } else if (child && typeof child === 'object' && child.props && child.props.value) {
          // Handle Astro StaticHtml component with SlotString
          const value = child.props.value;
          s += String(value);
        }
      });
    }

    s = s.trim();
    // Decode HTML entities (&gt; -> >)
    s = s.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
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
