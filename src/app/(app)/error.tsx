"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section role="alert" className="paper-sheet p-8"><h1 className="text-2xl font-bold">No pudimos cargar tu cinta.</h1><p className="mt-3 text-sm">Tus datos no se han modificado. Revisa la conexión e intenta de nuevo.</p><button type="button" onClick={reset} className="focus-ring mt-6 rounded bg-stamp px-5 py-3 text-tape">Volver a intentar</button></section>;
}
