import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Wes Cup — World Cup 2026 Drinking Game',
  description: 'Live World Cup 2026 drinking game. Every time a team wins, drink their national shot.',
  openGraph: {
    title: 'The Wes Cup 🍺⚽',
    description: 'Every time a team wins, drink their national shot. 48 teams. 48 drinks.',
    url: 'https://wescupworldcupdrinks.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
