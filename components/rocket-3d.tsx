import type { CSSProperties } from "react"

/**
 * A real 3D rocket in pure CSS (preserve-3d) — no three.js, no client JS, no canvas.
 * Body and nozzle are cylinders of N strips, the nose cone is N tilted triangles,
 * fins are radial planes. The flame sits outside the spinning group so it always
 * faces the viewer. Styles live in app/globals.css under "3D footer rocket".
 * Mike, 2026-11-05 (0n3 desk): "Add a 3D rocket in the footer".
 */
const SEGMENTS = 16
const BODY_R = 18
const NOZZLE_R = 11
const CONE_H = 34 // slant height; vertical rise ≈ 29px
const CONE_TILT = Math.atan(BODY_R / Math.sqrt(CONE_H * CONE_H - BODY_R * BODY_R)) * (180 / Math.PI)

const stripWidth = (r: number) => +((2 * Math.PI * r) / SEGMENTS + 0.6).toFixed(2)
const angles = Array.from({ length: SEGMENTS }, (_, i) => (360 / SEGMENTS) * i)
// Painted-on shading so the cylinder reads as round at any angle of the spin.
const shade = (deg: number) => Math.round(62 + 30 * Math.cos(((deg - 300) * Math.PI) / 180))

export function Rocket3D({ className = "" }: { className?: string }) {
  const bodyW = stripWidth(BODY_R)
  const nozzleW = stripWidth(NOZZLE_R)

  return (
    <div className={`r3d-scene ${className}`} aria-hidden="true">
      <div className="r3d-bob">
        <div className="r3d-rocket">
          {/* Body: two-tone cylinder, white hull with an orange band */}
          {angles.map((a) => (
            <span
              key={`b${a}`}
              className="r3d-face r3d-body"
              style={{ width: bodyW, marginLeft: -bodyW / 2, transform: `rotateY(${a}deg) translateZ(${BODY_R}px)`, "--l": `${shade(a)}%` } as CSSProperties}
            />
          ))}

          {/* Window — rides on the front of the hull */}
          <span className="r3d-window" style={{ transform: `translateZ(${BODY_R + 0.5}px)` }} />

          {/* Nose cone */}
          {angles.map((a) => (
            <span
              key={`c${a}`}
              className="r3d-face r3d-cone"
              style={{
                width: bodyW + 0.4,
                height: CONE_H,
                marginLeft: -(bodyW + 0.4) / 2,
                transform: `rotateY(${a}deg) translateZ(${BODY_R}px) rotateX(${CONE_TILT.toFixed(2)}deg)`,
                "--l": `${shade(a) - 6}%`,
              } as CSSProperties}
            />
          ))}

          {/* Nozzle */}
          {angles.map((a) => (
            <span
              key={`n${a}`}
              className="r3d-face r3d-nozzle"
              style={{ width: nozzleW, marginLeft: -nozzleW / 2, transform: `rotateY(${a}deg) translateZ(${NOZZLE_R}px)`, "--l": `${Math.round(shade(a) * 0.45)}%` } as CSSProperties}
            />
          ))}

          {/* Fins — four radial planes */}
          {[45, 135, 225, 315].map((a) => (
            <span key={`f${a}`} className="r3d-fin" style={{ transform: `rotateY(${a}deg)` }} />
          ))}
        </div>
        <span className="r3d-flame" />
      </div>
    </div>
  )
}

export default Rocket3D
