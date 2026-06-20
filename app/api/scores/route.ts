import { NextResponse } from 'next/server'
import { Game, ScoresResponse } from '@/lib/types'

// Abbr map to normalise SportRadar names → our abbreviations
const NAME_MAP: Record<string, string> = {
  'Mexico': 'MEX', 'South Africa': 'RSA', 'Korea Republic': 'KOR', 'South Korea': 'KOR',
  'Czech Republic': 'CZE', 'Czechia': 'CZE', 'Switzerland': 'SUI', 'Canada': 'CAN',
  'Qatar': 'QAT', 'Bosnia and Herzegovina': 'BIH', 'Bosnia & Herzegovina': 'BIH',
  'Brazil': 'BRA', 'Morocco': 'MAR', 'Scotland': 'SCO', 'Congo DR': 'COD',
  'DR Congo': 'COD', 'Democratic Republic of the Congo': 'COD',
  'United States': 'USA', 'USA': 'USA', 'Australia': 'AUS', 'Türkiye': 'TUR',
  'Turkey': 'TUR', 'Ghana': 'GHA', 'Germany': 'GER', "Côte d'Ivoire": 'CIV',
  'Ivory Coast': 'CIV', 'Ecuador': 'ECU', 'Curaçao': 'CUW', 'Curacao': 'CUW',
  'Netherlands': 'NED', 'Japan': 'JPN', 'Sweden': 'SWE', 'Tunisia': 'TUN',
  'Belgium': 'BEL', 'Iran': 'IRN', 'IR Iran': 'IRN', 'Egypt': 'EGY',
  'Uzbekistan': 'UZB', 'Spain': 'ESP', 'Uruguay': 'URU', 'Cape Verde': 'CPV',
  'Saudi Arabia': 'KSA', 'France': 'FRA', 'Senegal': 'SEN', 'Norway': 'NOR',
  'New Zealand': 'NZL', 'Argentina': 'ARG', 'Austria': 'AUT', 'Algeria': 'ALG',
  'Jordan': 'JOR', 'Portugal': 'POR', 'Colombia': 'COL', 'Iraq': 'IRQ',
  'Paraguay': 'PAR', 'England': 'ENG', 'Croatia': 'CRO', 'Kazakhstan': 'KAZ',
  'Haiti': 'HTI',
}

// Fallback scores for when no API key is configured
const FALLBACK_SCORES: Game[] = [
  { home:'POR', away:'COD', hs:1, as:1, status:'final', date:'2026-06-17', time:'1:00 PM' },
  { home:'ENG', away:'CRO', hs:4, as:2, status:'final', date:'2026-06-17', time:'4:00 PM' },
  { home:'GHA', away:'PAN', hs:1, as:0, status:'final', date:'2026-06-17', time:'7:00 PM' },
  { home:'UZB', away:'COL', hs:1, as:3, status:'final', date:'2026-06-17', time:'10:00 PM' },
  { home:'CZE', away:'RSA', hs:1, as:1, status:'final', date:'2026-06-18', time:'12:00 PM' },
  { home:'SUI', away:'BIH', hs:4, as:1, status:'final', date:'2026-06-18', time:'3:00 PM' },
  { home:'CAN', away:'QAT', hs:6, as:0, status:'final', date:'2026-06-18', time:'6:00 PM' },
  { home:'MEX', away:'KOR', hs:1, as:0, status:'final', date:'2026-06-18', time:'9:00 PM' },
  { home:'USA', away:'AUS', hs:2, as:0, status:'final', date:'2026-06-19', time:'3:00 PM' },
  { home:'SCO', away:'MAR', hs:0, as:1, status:'final', date:'2026-06-19', time:'6:00 PM' },
  { home:'BRA', away:'HTI', hs:3, as:0, status:'final', date:'2026-06-19', time:'8:30 PM' },
  { home:'TUR', away:'PAR', hs:2, as:1, status:'final', date:'2026-06-19', time:'11:00 PM' },
  { home:'NED', away:'SWE', hs:0, as:0, status:'scheduled', date:'2026-06-20', time:'1:00 PM', prob:{ NED:56, SWE:21, d:23 } },
  { home:'GER', away:'CIV', hs:0, as:0, status:'scheduled', date:'2026-06-20', time:'4:00 PM', prob:{ GER:63, CIV:16, d:21 } },
  { home:'ECU', away:'CUW', hs:0, as:0, status:'scheduled', date:'2026-06-20', time:'8:00 PM', prob:{ ECU:88, CUW:4, d:9 } },
  { home:'TUN', away:'JPN', hs:0, as:0, status:'scheduled', date:'2026-06-20', time:'11:00 PM', prob:{ TUN:14, JPN:63, d:23 } },
  { home:'ESP', away:'KSA', hs:0, as:0, status:'scheduled', date:'2026-06-21', time:'12:00 PM', prob:{ ESP:89, KSA:3, d:8 } },
  { home:'BEL', away:'IRN', hs:0, as:0, status:'scheduled', date:'2026-06-21', time:'3:00 PM', prob:{ BEL:68, IRN:13, d:20 } },
  { home:'URU', away:'CPV', hs:0, as:0, status:'scheduled', date:'2026-06-21', time:'6:00 PM', prob:{ URU:65, CPV:12, d:22 } },
  { home:'NZL', away:'EGY', hs:0, as:0, status:'scheduled', date:'2026-06-21', time:'9:00 PM', prob:{ NZL:17, EGY:60, d:24 } },
]

function toAbbr(name: string): string {
  return NAME_MAP[name] ?? name.substring(0, 3).toUpperCase()
}

function toLocalDate(utcStr: string): string {
  // Convert UTC ISO string to EDT date string (UTC-4)
  const d = new Date(utcStr)
  const edt = new Date(d.getTime() - 4 * 60 * 60 * 1000)
  return edt.toISOString().split('T')[0]
}

function toLocalTime(utcStr: string): string {
  const d = new Date(utcStr)
  const edt = new Date(d.getTime() - 4 * 60 * 60 * 1000)
  const h = edt.getUTCHours()
  const m = edt.getUTCMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

async function fetchFromSportsRadar(): Promise<Game[] | null> {
  const apiKey = process.env.SPORTRADAR_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(
      `https://api.sportradar.com/soccer/trial/v4/en/tournaments/sr:tournament:17/schedules/results.json?api_key=${apiKey}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const data = await res.json()

    const games: Game[] = []
    const sportEvents = data?.results ?? data?.schedules ?? []

    for (const item of sportEvents) {
      const se = item.sport_event ?? item
      const status = item.sport_event_status ?? {}
      const home = toAbbr(se.competitors?.[0]?.name ?? '')
      const away = toAbbr(se.competitors?.[1]?.name ?? '')
      const matchStatus = status.status ?? 'scheduled'
      const gameStatus =
        matchStatus === 'closed' || matchStatus === 'ended' ? 'final'
        : matchStatus === 'live' || matchStatus === 'inprogress' ? 'live'
        : 'scheduled'

      games.push({
        home,
        away,
        hs: status.home_score ?? 0,
        as: status.away_score ?? 0,
        status: gameStatus,
        date: toLocalDate(se.start_time),
        time: toLocalTime(se.start_time),
        min: status.match_time,
      })
    }

    return games.length ? games : null
  } catch {
    return null
  }
}

export async function GET() {
  const live = await fetchFromSportsRadar()
  const games = live ?? FALLBACK_SCORES

  const response: ScoresResponse = {
    games,
    fetchedAt: new Date().toISOString(),
  }

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  })
}
