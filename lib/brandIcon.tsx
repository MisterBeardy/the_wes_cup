// Shared artwork for the generated app icons (favicon, apple-icon, and manifest
// 192/512 icons all render from this). next/og's JSX layer (satori) doesn't
// support SVG paths, so the mark is built as a self-contained SVG embedded as a
// data URI in an <img> — the SVG itself is rasterized by next/og's image
// pipeline, which supports paths/gradients/clipPaths/<use>. No external fetches.
//
// The mark: a soccer ball beside a half-full pint of beer, on the brand green.
// The ball is the public-domain Wikipedia "Soccer_ball.svg" (r=100 about the
// origin), embedded here verbatim and placed via a transform; the pint glass is
// drawn alongside it.

const BG = '#1a3a1a'

// Self-contained SVG (transparent bg; the green div shows through).
const ART = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
  <defs>
    <clipPath id="ball"><circle r="100" stroke-width="0"/></clipPath>
    <radialGradient id="shadow1" cx=".4" cy=".3" r=".8">
      <stop offset="0" stop-color="white" stop-opacity="1"/>
      <stop offset=".4" stop-color="white" stop-opacity="1"/>
      <stop offset=".8" stop-color="#EEEEEE" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="shadow2" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="white" stop-opacity="0"/>
      <stop offset=".8" stop-color="white" stop-opacity="0"/>
      <stop offset=".99" stop-color="black" stop-opacity=".3"/>
      <stop offset="1" stop-color="black" stop-opacity="1"/>
    </radialGradient>
    <g id="black_stuff" stroke-linejoin="round" clip-path="url(#ball)">
      <g fill="black">
        <path d="M 6,-32 Q 26,-28 46,-19 Q 57,-35 64,-47 Q 50,-68 37,-76 Q 17,-75 1,-68 Q 4,-51 6,-32"/>
        <path d="M -26,-2 Q -45,-8 -62,-11 Q -74,5 -76,22 Q -69,40 -50,54 Q -32,47 -17,39 Q -23,15 -26,-2"/>
        <path d="M -95,22 Q -102,12 -102,-8 V 80 H -85 Q -95,45 -95,22"/>
        <path d="M 55,24 Q 41,41 24,52 Q 28,65 31,79 Q 55,78 68,67 Q 78,50 80,35 Q 65,28 55,24"/>
        <path d="M 0,120 L -3,95 Q -25,93 -42,82 Q -50,84 -60,81"/>
        <path d="M -90,-48 Q -80,-52 -68,-49 Q -52,-71 -35,-77 Q -35,-100 -40,-100 H -100"/>
        <path d="M 100,-55 L 87,-37 Q 98,-10 97,5 L 100,6"/>
      </g>
      <g fill="none">
        <path d="M 6,-32 Q -18,-12 -26,-2
                 M 46,-19 Q 54,5 55,24
                 M 64,-47 Q 77,-44 87,-37
                 M 37,-76 Q 39,-90 36,-100
                 M 1,-68 Q -13,-77 -35,-77
                 M -62,-11 Q -67,-25 -68,-49
                 M -76,22 Q -85,24 -95,22
                 M -50,54 Q -49,70 -42,82
                 M -17,39 Q 0,48 24,52
                 M 31,79 Q 20,92 -3,95
                 M 68,67 L 80,80
                 M 80,35 Q 90,25 97,5"/>
      </g>
    </g>
    <linearGradient id="beer" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fcd34d"/>
      <stop offset="0.55" stop-color="#f59e0b"/>
      <stop offset="1" stop-color="#c2740a"/>
    </linearGradient>
  </defs>

  <g transform="translate(2,-8)">
    <!-- ground shadows -->
    <ellipse cx="184" cy="436" rx="120" ry="20" fill="rgba(0,0,0,0.20)"/>
    <ellipse cx="381" cy="424" rx="58" ry="13" fill="rgba(0,0,0,0.20)"/>

    <!-- soccer ball (Wikipedia artwork), scaled/positioned -->
    <g transform="translate(184,300) scale(1.18)">
      <circle r="100" fill="white" stroke="none"/>
      <circle r="100" fill="url(#shadow1)" stroke="none"/>
      <use xlink:href="#black_stuff" stroke="#EEE" stroke-width="7"/>
      <use xlink:href="#black_stuff" stroke="#DDD" stroke-width="4"/>
      <use xlink:href="#black_stuff" stroke="#999" stroke-width="2"/>
      <use xlink:href="#black_stuff" stroke="black" stroke-width="1"/>
      <circle r="100" fill="url(#shadow2)" stroke="none"/>
    </g>

    <!-- half-full pint: amber beer + foam head -->
    <path d="M344.3,262 L417.7,262 L406,384 Q406,398 392,398 L370,398 Q356,398 356,384 Z" fill="url(#beer)"/>
    <path d="M344.3,262 L417.7,262 L419.7,238 Q381,226 342.3,238 Z" fill="#fbf6e8"/>
    <path d="M344,142 L353,142 L368,372 L359,372 Z" fill="#ffffff" opacity="0.22"/>
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
