/**
 * Blog hero graphic — "one article, many citations".
 *
 * A source document at the centre, pulsing signal rings, and six AI/search
 * engines drawing from it. This is the blog's actual thesis rendered as a
 * picture: we publish so the answer engines quote us.
 *
 * Pure inline SVG + CSS keyframes — no runtime, no dependency, no image
 * request. Server-renderable, so crawlers get the <title>/<desc> text too.
 * All motion is disabled under prefers-reduced-motion.
 */
export default function BlogHeroGraphic() {
  // Six consumers arranged on a ring around the source node.
  const NODES = [
    { label: "ChatGPT", x: 250, y: 44, delay: "0s" },
    { label: "Claude", x: 380, y: 118, delay: "0.5s" },
    { label: "Perplexity", x: 380, y: 268, delay: "1s" },
    { label: "AI Overviews", x: 250, y: 342, delay: "1.5s" },
    { label: "Gemini", x: 120, y: 268, delay: "2s" },
    { label: "Copilot", x: 120, y: 118, delay: "2.5s" },
  ]

  const CX = 250
  const CY = 193

  return (
    <div className="relative w-full">
      {/* Scoped so this lives with the component rather than growing globals.css. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.bhg-pulse { transform-origin: 250px 193px; animation: bhgPulse 4.2s ease-out infinite; opacity: 0 }
@keyframes bhgPulse {
  0%   { transform: scale(1);   opacity: .55 }
  70%  { opacity: .06 }
  100% { transform: scale(2.9); opacity: 0 }
}
.bhg-ring { animation: bhgRing 4.2s ease-out infinite; opacity: 0 }
@keyframes bhgRing {
  0%, 55% { opacity: 0 }
  70%     { opacity: .9 }
  100%    { opacity: 0 }
}
.bhg-packet { offset-distance: 0%; animation: bhgPacket 4.2s ease-in-out infinite; opacity: 0 }
@keyframes bhgPacket {
  0%   { offset-distance: 12%; opacity: 0 }
  12%  { opacity: 1 }
  62%  { opacity: 1 }
  70%  { offset-distance: 100%; opacity: 0 }
  100% { offset-distance: 100%; opacity: 0 }
}
@media (prefers-reduced-motion: reduce) {
  .bhg-pulse, .bhg-ring, .bhg-packet { animation: none }
  .bhg-pulse { opacity: .18 }
  .bhg-ring  { opacity: .5 }
  .bhg-packet { opacity: 0 }
}`,
        }}
      />
      <svg
        viewBox="0 0 500 386"
        role="img"
        aria-labelledby="blogGraphicTitle blogGraphicDesc"
        className="h-auto w-full overflow-visible"
      >
        <title id="blogGraphicTitle">
          How RocketOpp content reaches AI answer engines
        </title>
        <desc id="blogGraphicDesc">
          A single sourced article at the centre, cited outward by ChatGPT,
          Claude, Perplexity, Google AI Overviews, Gemini and Copilot.
        </desc>

        <defs>
          <linearGradient id="bhgCore" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff6b35" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="bhgLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="bhgGlow">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
          </radialGradient>
          <filter id="bhgSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Ambient glow behind the source */}
        <circle cx={CX} cy={CY} r="150" fill="url(#bhgGlow)" />

        {/* Orbit guides */}
        <circle
          cx={CX}
          cy={CY}
          r="150"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeDasharray="3 7"
        />
        <circle
          cx={CX}
          cy={CY}
          r="104"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
        />

        {/* Expanding citation pulses */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r="52"
            fill="none"
            stroke="#ff6b35"
            strokeWidth="1.5"
            className="bhg-pulse"
            style={{ animationDelay: `${i * 1.4}s` }}
          />
        ))}

        {/* Connections + engine nodes */}
        {NODES.map((n) => (
          <g key={n.label}>
            <line
              x1={CX}
              y1={CY}
              x2={n.x}
              y2={n.y}
              stroke="url(#bhgLine)"
              strokeWidth="1.25"
            />
            {/* Packet travelling outward along the link */}
            <circle
              r="3"
              fill="#ff6b35"
              className="bhg-packet"
              style={{ animationDelay: n.delay, offsetPath: `path('M ${CX} ${CY} L ${n.x} ${n.y}')` }}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r="27"
              fill="#12121a"
              stroke="rgba(255,255,255,0.14)"
            />
            <circle
              cx={n.x}
              cy={n.y}
              r="27"
              fill="none"
              stroke="#a78bfa"
              strokeOpacity="0.3"
              className="bhg-ring"
              style={{ animationDelay: n.delay }}
            />
            <text
              x={n.x}
              y={n.y + 3.5}
              textAnchor="middle"
              className="fill-zinc-300"
              style={{ fontSize: "9px", fontWeight: 600 }}
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* The source document */}
        <g>
          <circle
            cx={CX}
            cy={CY}
            r="54"
            fill="url(#bhgCore)"
            opacity="0.22"
            filter="url(#bhgSoft)"
          />
          <circle
            cx={CX}
            cy={CY}
            r="46"
            fill="#0d0d13"
            stroke="url(#bhgCore)"
            strokeWidth="2"
          />
          {/* Document glyph */}
          <g transform={`translate(${CX - 13}, ${CY - 19})`}>
            <path
              d="M4 0h13l9 9v25a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3Z"
              fill="none"
              stroke="url(#bhgCore)"
              strokeWidth="1.8"
            />
            <path d="M17 0v9h9" fill="none" stroke="url(#bhgCore)" strokeWidth="1.8" />
            <path
              d="M7 17h13M7 23h13M7 29h8"
              stroke="#ff6b35"
              strokeOpacity="0.75"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
          <text
            x={CX}
            y={CY + 68}
            textAnchor="middle"
            className="fill-zinc-500"
            style={{ fontSize: "9.5px", letterSpacing: "0.14em", fontWeight: 700 }}
          >
            ONE SOURCED ARTICLE
          </text>
        </g>
      </svg>
    </div>
  )
}
