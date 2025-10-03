import React, { useId } from 'react';

interface FigureProps {
  id: string;
  caption: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

// Keep track of figure numbers
let figureCounter = 0;

export default function Figure({ id, caption, children, fullWidth = false }: FigureProps) {
  const figId = useId();
  const figureNumber = ++figureCounter;

  return (
    <figure
      id={`fig:${id}`}
      aria-labelledby={figId}
      className={`figure ${fullWidth ? 'figure-full' : ''}`}
      data-figure-number={figureNumber}
    >
      {children}
      <figcaption id={figId} className="figure-caption">
        <strong>Figure {figureNumber}:</strong> {caption}
      </figcaption>
    </figure>
  );
}

// Reset counter for each page load
if (typeof window !== 'undefined') {
  figureCounter = 0;
}