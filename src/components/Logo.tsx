/**
 * Monograma "CV" (Camarote VIP). Usa a cor da marca (--color-accent) —
 * muda junto com o tema. O ícone da aba (src/app/icon.svg) é o mesmo desenho.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="16" className="fill-accent" />
      <g
        className="stroke-accent-fg"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* C */}
        <path d="M30.9 24.3A10 10 0 1 0 30.9 39.7" />
        {/* V */}
        <path d="M36.5 23 43 41l6.5-18" />
      </g>
    </svg>
  );
}
