import { ImageResponse } from 'next/og'
import { BrandIcon } from '@/lib/brandIcon'

// Home-screen icon for iOS when the site is added to the home screen.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(<BrandIcon size={size.width} />, { ...size })
}
