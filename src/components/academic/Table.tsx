import React, { useId } from 'react';

interface TableProps {
  id: string;
  caption: string;
  children: React.ReactNode;
}

// Keep track of table numbers
let tableCounter = 0;

export default function Table({ id, caption, children }: TableProps) {
  const tableId = useId();
  const tableNumber = ++tableCounter;

  return (
    <div
      id={`table:${id}`}
      aria-labelledby={tableId}
      className="table-wrapper"
      data-table-number={tableNumber}
    >
      <table className="academic-table">
        {children}
      </table>
      <caption id={tableId} className="table-caption">
        <strong>Table {tableNumber}:</strong> {caption}
      </caption>
    </div>
  );
}

// Reset counter for each page load
if (typeof window !== 'undefined') {
  tableCounter = 0;
}