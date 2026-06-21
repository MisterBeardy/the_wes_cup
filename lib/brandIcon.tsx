// Shared artwork for the generated app icons (favicon, apple-icon, manifest
// icons). Rendered by next/og's ImageResponse — keep it to plain divs/spans and
// inline styles (satori doesn't support full CSS / external fonts here).
export function BrandIcon({ size }: { size: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a3a1a',
        fontWeight: 800,
        letterSpacing: '-0.04em',
      }}
    >
      <div style={{ display: 'flex', fontSize: Math.round(size * 0.42), lineHeight: 1, color: '#f0ede6' }}>
        D<span style={{ color: '#facc15' }}>&amp;</span>W
      </div>
    </div>
  )
}
