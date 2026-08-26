/** Logo-assinatura do Aera: explosão radial de traços em V. */
export function Estrela({ className }: { className?: string }) {
  const traços = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      {traços.map((angulo) => (
        <g key={angulo} transform={`rotate(${angulo} 50 50)`}>
          <path
            d="M50 6 L46.5 26 M50 6 L53.5 26"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ))}
    </svg>
  );
}
