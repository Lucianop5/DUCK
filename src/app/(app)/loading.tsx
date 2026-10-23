export default function Loading() {
  return <div role="status" aria-live="polite" className="paper-sheet px-7 py-12"><p className="print-label">Preparando tu cinta…</p><div aria-hidden="true" className="mt-6 space-y-5 motion-safe:animate-pulse">{[1, 2, 3].map((line) => <div key={line} className="h-3 bg-ink/10" />)}</div></div>;
}
