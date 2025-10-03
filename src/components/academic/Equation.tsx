import React, { useId } from 'react';

interface EquationProps {
  id: string;
  children: string; // LaTeX string
  displayMode?: boolean;
}

// Keep track of equation numbers
let equationCounter = 0;

export default function Equation({ id, children, displayMode = true }: EquationProps) {
  const eqId = useId();
  const equationNumber = ++equationCounter;

  return (
    <div
      id={`eq:${id}`}
      aria-labelledby={eqId}
      className="equation-wrapper"
      data-equation-number={equationNumber}
    >
      <div className="equation-content">
        {displayMode ? (
          <div className="katex-display">
            {`$$${children}$$`}
          </div>
        ) : (
          <span className="katex-inline">
            {`$${children}$`}
          </span>
        )}
      </div>
      <span id={eqId} className="equation-number">
        ({equationNumber})
      </span>
    </div>
  );
}

// Reset counter for each page load
if (typeof window !== 'undefined') {
  equationCounter = 0;
}