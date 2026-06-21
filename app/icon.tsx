import { ImageResponse } from 'next/og'
import { BrandIcon } from '@/lib/brandIcon'

// Generate the favicon/tab icon at two sizes; these URLs (/icon/192, /icon/512)
// are also referenced by the web manifest for installability.
export function generateImageMetadata() {
  return [
    { id: '192', size: { width: 192, height: 192 }, contentType: 'image/png' },
    { id: '512', size: { width: 512, height: 512 }, contentType: 'image/png' },
  ]
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const px = (await id) === '512' ? 512 : 192
  return new ImageResponse(<BrandIcon size={px} />, { width: px, height: px })
}
