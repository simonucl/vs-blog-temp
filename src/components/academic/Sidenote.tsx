import React from 'react';

interface SidenoteProps {
  number: number;
  children: React.ReactNode;
}

export default function Sidenote({ number, children }: SidenoteProps) {
  return (
    <>
      <sup className="sidenote-number">{number}</sup>
      <aside
        className="sidenote"
        role="note"
        aria-label={`Sidenote ${number}`}
      >
        <sup className="sidenote-number">{number}</sup> {children}
      </aside>
    </>
  );
}