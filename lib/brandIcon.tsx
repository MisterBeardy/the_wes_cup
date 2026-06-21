// Shared artwork for the generated app icons (favicon, apple-icon, manifest
// icons). Rendered by next/og's ImageResponse — satori doesn't support full CSS
// or SVG path elements directly, so the artwork is a self-contained SVG embedded
// as a data URI in an <img>. Keep everything inline; no external fetches.
//
// The mark: a soccer ball next to a half-full glass, on the brand green.

const BG = '#1a3a1a'

// A 512x512 SVG with a transparent background (the surrounding green div shows
// through). Content is kept toward the center so it survives maskable cropping.
const ART = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <g transform="translate(20,0)">
    <!-- Soccer ball -->
    <circle cx="175" cy="235" r="118" fill="#f6f5f1" stroke="#14241b" stroke-width="6"/>
    <polygon points="175,205 203.5,225.7 192.6,259.3 157.4,259.3 146.5,225.7" fill="#14241b"/>
    <g stroke="#14241b" stroke-width="6" stroke-linecap="round">
      <line x1="175" y1="205" x2="175" y2="117"/>
      <line x1="203.5" y1="225.7" x2="287.2" y2="198.5"/>
      <line x1="192.6" y1="259.3" x2="244.4" y2="330.5"/>
      <line x1="157.4" y1="259.3" x2="105.6" y2="330.5"/>
      <line x1="146.5" y1="225.7" x2="62.8" y2="198.5"/>
    </g>
    <!-- Half-full glass -->
    <polygon points="306,250 386,250 380,368 312,368" fill="#f59e0b"/>
    <ellipse cx="346" cy="250" rx="40" ry="7" fill="#fbbf24"/>
    <polygon points="300,128 392,128 380,372 312,372" fill="rgba(255,255,255,0.10)"
      stroke="#f0ede6" stroke-width="7" stroke-linejoin="round"/>
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
