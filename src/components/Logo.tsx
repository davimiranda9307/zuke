/** Marca do Zuke. Usa a cor da marca (--color-accent) — muda junto com o tema. */
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
      <path
        d="M20 20h24v6L28 44h16v6H20v-6l16-18H20v-6z"
        className="fill-accent-fg"
      />
    </svg>
  );
}
