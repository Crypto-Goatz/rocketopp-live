/**
 * SectionBg — drop into a `<section className="relative">` as the first child.
 * Each variant occludes (or tints) the global SpaceBackground in different ways
 * so the page reads as a sequence of moods, not one continuous animation.
 *
 * Usage:
 *   <section className="relative overflow-hidden py-20">
 *     <SectionBg variant="mesh" />
 *     <div className="container relative z-10">…</div>
 *   </section>
 */

type Variant =
  | "solid-deep"      // pure deep blue-black, fully opaque
  | "solid-card"      // slightly elevated card surface, fully opaque
  | "lava"            // orange/red brand gradient, fully opaque
  | "nebula-violet"   // semi-transparent violet wash — tints the stars
  | "nebula-cyan"     // semi-transparent cyan/teal wash
  | "mesh"            // animated aurora gradient sweep
  | "grid-glow"       // solid dark + grid pattern + primary radial glow
  | "spotlight"       // radial primary spot, edges fade to transparent
  | "seam"            // top + bottom glowing seam, transparent middle
  | "dot-grid"        // solid + dot pattern

export function SectionBg({ variant }: { variant: Variant }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-[1] overflow-hidden pointer-events-none"
    >
      {variant === "solid-deep" && (
        <div className="absolute inset-0 bg-[#070912]" />
      )}

      {variant === "solid-card" && (
        <div className="absolute inset-0 bg-[#0e1320]" />
      )}

      {variant === "lava" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-orange-700" />
          <div
            className="absolute inset-0 mix-blend-overlay opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 100% 60% at 30% 20%, rgba(255,180,80,0.5) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 80% 80%, rgba(180,20,40,0.6) 0%, transparent 60%)",
            }}
          />
        </>
      )}

      {variant === "nebula-violet" && (
        <>
          <div className="absolute inset-0 bg-[rgba(8,6,20,0.65)]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 25% 30%, rgba(140,80,220,0.35) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 85% 80%, rgba(60,30,140,0.4) 0%, transparent 60%)",
            }}
          />
        </>
      )}

      {variant === "nebula-cyan" && (
        <>
          <div className="absolute inset-0 bg-[rgba(4,10,18,0.7)]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 100% 70% at 70% 20%, rgba(40,180,200,0.3) 0%, transparent 60%), radial-gradient(ellipse 90% 60% at 20% 90%, rgba(20,80,140,0.4) 0%, transparent 60%)",
            }}
          />
        </>
      )}

      {variant === "mesh" && (
        <>
          <div className="absolute inset-0 bg-[#080a14]" />
          <div className="section-mesh absolute inset-0 opacity-90" />
          {/* Top + bottom soft fades so it blends into neighbors */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#080a14] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080a14] to-transparent" />
        </>
      )}

      {variant === "grid-glow" && (
        <>
          <div className="absolute inset-0 bg-[#0a0d18]" />
          <div className="absolute inset-0 grid-background opacity-25" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,107,53,0.18) 0%, transparent 70%)",
            }}
          />
        </>
      )}

      {variant === "spotlight" && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(255,107,53,0.18) 0%, rgba(8,10,20,0.85) 55%, rgba(8,10,20,1) 100%)",
          }}
        />
      )}

      {variant === "seam" && (
        <>
          {/* Transparent middle so the global space bg shows through */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/8 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/8 to-transparent" />
        </>
      )}

      {variant === "dot-grid" && (
        <>
          <div className="absolute inset-0 bg-[#0a0d18]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(8,10,20,0.85) 100%)",
            }}
          />
        </>
      )}
    </div>
  )
}
