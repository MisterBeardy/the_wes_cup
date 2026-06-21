// Shared artwork for the generated app icons (favicon, apple-icon, and manifest
// 192/512 icons all render from this). next/og's JSX layer (satori) doesn't
// support SVG paths, so the mark is built as a self-contained SVG and embedded
// as a data URI in an <img> — the SVG itself is rasterized by next/og's image
// pipeline, which does support paths/gradients. No external fetches.
//
// The mark: a soccer ball beside a half-full pint of beer, on the brand green.

const BG = '#1a3a1a'

// --- Soccer ball geometry (classic truncated-icosahedron pattern) -----------
// A central pentagon ringed by five pentagons, joined by hexagonal seams.
function pent(cx: number, cy: number, r: number, startDeg: number): [number, number][] {
  const p: [number, number][] = []
  for (let k = 0; k < 5; k++) {
    const t = ((startDeg + 72 * k) * Math.PI) / 180
    p.push([cx + r * Math.cos(t), cy + r * Math.sin(t)])
  }
  return p
}
const f = (n: number) => n.toFixed(1)
const poly = (p: [number, number][]) => p.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')

const BX = 192
const BY = 300
const R = 122
const central = pent(BX, BY, 32, -90)
// One outer pentagon radially out from each central vertex, oriented with a
// vertex pointing back toward the centre (index 0). Centre, that inner vertex,
// and the central vertex are all colinear, so the connecting seam is radial.
const outers: [number, number][][] = []
for (let k = 0; k < 5; k++) {
  const ang = -90 + 72 * k
  const t = (ang * Math.PI) / 180
  outers.push(pent(BX + 84 * Math.cos(t), BY + 84 * Math.sin(t), 23, ang + 180))
}
const seams: [[number, number], [number, number]][] = []
// Radial seam from each central vertex to its outer pentagon's inner vertex.
for (let k = 0; k < 5; k++) {
  seams.push([central[k], outers[k][0]])
}
// Rim seams between neighbouring outer pentagons (nearest vertex pair) — these
// close the white hexagons around the ball.
for (let k = 0; k < 5; k++) {
  const a = outers[k]
  const b = outers[(k + 1) % 5]
  let pair: [[number, number], [number, number]] = [a[0], b[0]]
  let bd = Infinity
  for (const u of a)
    for (const v of b) {
      const d = (u[0] - v[0]) ** 2 + (u[1] - v[1]) ** 2
      if (d < bd) {
        bd = d
        pair = [u, v]
      }
    }
  seams.push(pair)
}
const seamSvg = seams
  .map(([a, b]) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`)
  .join('')
const pentSvg = [central, ...outers].map((p) => `<polygon points="${poly(p)}"/>`).join('')

// --- Self-contained SVG (transparent bg; the green div shows through) --------
const ART = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="ball" cx="0.38" cy="0.32" r="0.8">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#d7d7d2"/>
    </radialGradient>
    <linearGradient id="beer" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fcd34d"/>
      <stop offset="0.55" stop-color="#f59e0b"/>
      <stop offset="1" stop-color="#c2740a"/>
    </linearGradient>
  </defs>
  <g transform="translate(2,-8)">
    <!-- ground shadows -->
    <ellipse cx="192" cy="436" rx="120" ry="20" fill="rgba(0,0,0,0.20)"/>
    <ellipse cx="381" cy="424" rx="58" ry="13" fill="rgba(0,0,0,0.20)"/>

    <!-- soccer ball -->
    <circle cx="${BX}" cy="${BY}" r="${R}" fill="url(#ball)" stroke="#14241b" stroke-width="6"/>
    <g stroke="#14241b" stroke-width="6" stroke-linecap="round">${seamSvg}</g>
    <g fill="#14241b">${pentSvg}</g>

    <!-- half-full pint: amber beer + foam head -->
    <path d="M344.3,262 L417.7,262 L406,384 Q406,398 392,398 L370,398 Q356,398 356,384 Z" fill="url(#beer)"/>
    <path d="M344.3,262 L417.7,262 L419.7,238 Q381,226 342.3,238 Z" fill="#fbf6e8"/>
    <!-- glass highlight -->
    <path d="M344,142 L353,142 L368,372 L359,372 Z" fill="#ffffff" opacity="0.22"/>
    <!-- rim + glass outline drawn last so it reads as glass over the contents -->
    <ellipse cx="381" cy="118" rx="49" ry="8" fill="rgba(255,255,255,0.06)" stroke="#f0ede6" stroke-width="6"/>
    <path d="M332,118 L430,118 L406,384 Q406,398 392,398 L370,398 Q356,398 356,384 Z"
      fill="none" stroke="#f0ede6" stroke-width="8" stroke-linejoin="round"/>
  </g>
</svg>`

const SRC = `data:image/svg+xml;base64,${Buffer.from(ART).toString('base64')}`

export function BrandIcon({ size }: { size: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: BG,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={SRC} width={size} height={size} alt="" />
    </div>
  )
}
