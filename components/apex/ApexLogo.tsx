/** Minimal APEX wordmark — SVG, no external assets. */

export function ApexLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-label="APEX">
      <defs>
        <linearGradient id="apex-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      <polygon points="100,20 180,170 20,170" fill="none" stroke="url(#apex-grad)" strokeWidth="6" strokeLinejoin="round" />
      <polygon points="100,60 150,160 50,160" fill="url(#apex-grad)" opacity="0.15" />
      <circle cx="100" cy="100" r="6" fill="url(#apex-grad)" />
    </svg>
  )
}
