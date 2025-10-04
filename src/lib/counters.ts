// Simple per-page counters keyed by a string (e.g., pathname)
const map = new Map<string, number>();

export function nextFigureNumber(key: string) {
  const n = (map.get(key) ?? 0) + 1;
  map.set(key, n);
  return n;
}

export function resetFigureNumber(key: string) {
  map.set(key, 0);
}

