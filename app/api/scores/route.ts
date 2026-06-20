import { NextResponse } from 'next/server'
import { Game, ScoresResponse } from '@/lib/types'

const SOURCE_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

// Team name → our abbreviation
const NAME_MAP: Record<string, string> = {
  'Mexico': 'MEX', 'South Africa': 'RSA', 'South Korea': 'KOR',
  'Czech Republic': 'CZE', 'Czechia': 'CZE', 'Switzerland': 'SUI',
  'Canada': 'CAN', 'Qatar': 'QAT', 'Bosnia and Herzegovina': 'BIH',
  'Bosnia & Herzegovina': 'BIH', 'Brazil': 'BRA', 'Morocco': 'MAR',
  'Scotland': 'SCO', 'DR Congo': 'COD', 'Congo DR': 'COD',
  'Democratic Republic of the Congo': 'COD', 'USA': 'USA',
  'United States': 'USA', 'Australia': 'AUS', 'Türkiye': 'TUR',
  'Turkey': 'TUR', 'Ghana': 'GHA', 'Germany': 'GER',
  "Côte d'Ivoire": 'CIV', 'Ivory Coast': 'CIV', 'Ecuador': 'ECU',
  'Curaçao': 'CUW', 'Curacao': 'CUW', 'Netherlands': 'NED',
  'Japan': 'JPN', 'Sweden': 'SWE', 'Tunisia': 'TUN', 'Belgium': 'BEL',
  'Iran': 'IRN', 'IR Iran': 'IRN', 'Egypt': 'EGY', 'Uzbekistan': 'UZB',
  'Spain': 'ESP', 'Uruguay': 'URU', 'Cape Verde': 'CPV',
  'Saudi Arabia': 'KSA', 'France': 'FRA', 'Senegal': 'SEN',
  'Norway': 'NOR', 'New Zealand': 'NZL', 'Argentina': 'ARG',
  'Austria': 'AUT', 'Algeria': 'ALG', 'Jordan': 'JOR',
  'Portugal': 'POR', 'Colombia': 'COL', 'Iraq': 'IRQ',
  'Paraguay': 'PAR', 'England': 'ENG', 'Croatia': 'CRO',
  'Kazakhstan': 'KAZ', 'Haiti': 'HTI', 'Panama': 'PAN',
}

const toAbbr = (name: string) => NAME_MAP[name] ?? name.substring(0, 3).toUpperCase()

// Convert "2026-06-19" + "19:00 UTC-4" → local EDT date string + 12h time
function parseDateTime(date: string, time: string): { date: string; time: string } {
  // Extract UTC offset from time string e.g. "19:00 UTC-4" → -4
  const offsetMatch = time.match(/UTC([+-]\d+)/)
  const offsetHours = offsetMatch ? parseInt(offsetMatch[1]) : -4
  const [h, m] = time.split(' ')[0].split(':').map(Number)

  // Build a UTC date from the local kickoff time
  const utcMs = Date.parse(`${date}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00Z`) - offsetHours * 3600000

  // Convert to EDT (UTC-4)
  const edt = new Date(utcMs - 4 * 3600000)
  const edtDate = edt.toISOString().split('T')[0]

  // Format as 12h time
  const edtH = edt.getUTCHours()
  const edtM = edt.getUTCMinutes()
  const ampm = edtH >= 12 ? 'PM' : 'AM'
  const h12 = edtH % 12 || 12
  const edtTime = `${h12}:${String(edtM).padStart(2,'0')} ${ampm}`

  return { date: edtDate, time: edtTime }
}

interface RawMatch {
  date: string
  time?: string
  team1: string
  team2: string
  score?: { ft?: number[]; ht?: number[] }
  group?: string
}

export async function GET() {
  try {
    const res = await fetch(SOURCE_URL, {
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)

    const data = await res.json()
    const rawMatches: RawMatch[] = data.matches ?? []

    const games: Game[] = rawMatches.map((m) => {
      const home = toAbbr(m.team1)
      const away = toAbbr(m.team2)
      const hasFT = Array.isArray(m.score?.ft)
      const hs = hasFT ? (m.score!.ft![0] ?? 0) : 0
      const as_ = hasFT ? (m.score!.ft![1] ?? 0) : 0
      const status: Game['status'] = hasFT ? 'final' : 'scheduled'
      const { date, time } = parseDateTime(m.date, m.time ?? '20:00 UTC-4')

      return { home, away, hs, as: as_, status, date, time }
    })

    const response: ScoresResponse = {
      games,
      fetchedAt: new Date().toISOString(),
    }

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    })
  } catch (err) {
    console.error('Score fetch failed:', err)
    // Return minimal fallback so the UI still works
    return NextResponse.json(
      { games: [], fetchedAt: new Date().toISOString(), error: 'fetch_failed' },
      { status: 200 }
    )
  }
}
