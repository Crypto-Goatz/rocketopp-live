export default function CssGridBackground() {
  return (
    <>
      {/* Grid overlay that fades from outside to inside */}
      <div
        className="absolute inset-0 pointer-events-none z-[-1] grid-background"
        style={{
          // CSS variables will handle the color change via globals.css
          maskImage: "radial-gradient(circle at center, transparent 20%, black 70%)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 20%, black 70%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[-2] grid-gradient"
        style={
          {
            // CSS variables will handle the color change via globals.css
          }
        }
        aria-hidden="true"
      />
    </>
  )
}
