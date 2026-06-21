import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Wes Cup — World Cup 2026 Drinking Game',
    short_name: 'Wes Cup',
    description: 'Every time a team wins, drink their national shot. 48 teams, 48 drinks.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a3a1a',
    theme_color: '#1a3a1a',
    orientation: 'portrait',
    icons: [
      { src: '/icon/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon/512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
