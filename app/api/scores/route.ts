import { NextResponse } from 'next/server'
import { Game, ScoresResponse } from '@/lib/types'

const SOURCE_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

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

// Clean up venue strings from openfootball
function cleanVenue(ground: string): { stadium: string; city: string } {
  const MAP: Record<string, { stadium: string; city: string }> = {
    'Mexico City':                           { stadium: 'Estadio Azteca',         city: 'Mexico City, MEX' },
    'Guadalajara (Zapopan)':                 { stadium: 'Estadio Akron',           city: 'Guadalajara, MEX' },
    'Monterrey (Guadalupe)':                 { stadium: 'Estadio BBVA',            city: 'Monterrey, MEX' },
    'Vancouver':                             { stadium: 'BC Place',                city: 'Vancouver, CAN' },
    'Toronto':                               { stadium: 'BMO Field',               city: 'Toronto, CAN' },
    'Seattle':                               { stadium: 'Lumen Field',             city: 'Seattle, WA' },
    'San Francisco Bay Area (Santa Clara)':  { stadium: "Levi's Stadium",          city: 'Santa Clara, CA' },
    'Los Angeles (Inglewood)':               { stadium: 'SoFi Stadium',            city: 'Los Angeles, CA' },
    'Dallas (Arlington)':                    { stadium: 'AT&T Stadium',            city: 'Dallas, TX' },
    'Kansas City':                           { stadium: 'Arrowhead Stadium',       city: 'Kansas City, MO' },
    'Houston':                               { stadium: 'NRG Stadium',             city: 'Houston, TX' },
    'Atlanta':                               { stadium: 'Mercedes-Benz Stadium',   city: 'Atlanta, GA' },
    'Miami (Miami Gardens)':                 { stadium: 'Hard Rock Stadium',       city: 'Miami, FL' },
    'Philadelphia':                          { stadium: 'Lincoln Financial Field', city: 'Philadelphia, PA' },
    'Boston (Foxborough)':                   { stadium: 'Gillette Stadium',        city: 'Boston, MA' },
    'New York/New Jersey (East Rutherford)': { stadium: 'MetLife Stadium',         city: 'East Rutherford, NJ' },
  }
  return MAP[ground] ?? { stadium: ground, city: '' }
}

// Is this a placeholder team string like "1A", "2B", "3A/B/C", "W74" etc?
function isPlaceholder(name: string): boolean {
  return /^[123][A-L]|^W\d+|^L\d+/.test(name)
}

function toAbbr(name: string): string | undefined {
  if (isPlaceholder(name)) return undefined
  return NAME_MAP[name] ?? name.substring(0, 3).toUpperCase()
}

// Parse "2026-06-19" + "19:00 UTC-4" → canonical kickoff instant as a UTC ISO string.
// The viewer's local date/time are derived from this on the client, so the same
// instant renders correctly in whatever timezone the browser is in.
function parseKickoff(date: string, time: string): string {
  const offsetMatch = time.match(/UTC([+-]\d+)/)
  const offsetHours = offsetMatch ? parseInt(offsetMatch[1]) : -4
  const [h, m] = time.split(' ')[0].split(':').map(Number)
  const utcMs = Date.parse(`${date}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00Z`) - offsetHours * 3600000
  return new Date(utcMs).toISOString()
}

interface RawMatch {
  date: string
  time?: string
  team1: string
  team2: string
  score?: { ft?: number[] }
  group?: string
  round?: string
  ground?: string
}

export async function GET() {
  try {
    const res = await fetch(SOURCE_URL, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    const data = await res.json()
    const rawMatches: RawMatch[] = data.matches ?? []

    const games: Game[] = rawMatches.map((m) => {
      const hasFT = Array.isArray(m.score?.ft)
      const kickoff = parseKickoff(m.date, m.time ?? '20:00 UTC-4')
      const venue = m.ground ? cleanVenue(m.ground) : undefined

      return {
        home:          toAbbr(m.team1),
        away:          toAbbr(m.team2),
        homePlaceholder: isPlaceholder(m.team1) ? m.team1 : undefined,
        awayPlaceholder: isPlaceholder(m.team2) ? m.team2 : undefined,
        hs:            hasFT ? (m.score!.ft![0] ?? 0) : 0,
        as:            hasFT ? (m.score!.ft![1] ?? 0) : 0,
        status:        hasFT ? 'final' : 'scheduled',
        kickoff,
        // date/time are placeholders; the client overwrites them with values
        // localized to the viewer's timezone (see GamePage.localizeGames).
        date:          kickoff.slice(0, 10),
        time:          '',
        round:         m.round,
        group:         m.group ?? undefined,
        stadium:       venue?.stadium,
        city:          venue?.city,
      }
    })

    // Sort chronologically by the canonical kickoff instant (UTC ISO sorts lexically).
    games.sort((a, b) => a.kickoff.localeCompare(b.kickoff))

    const response: ScoresResponse = { games, fetchedAt: new Date().toISOString() }
    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    })
  } catch (err) {
    console.error('Score fetch failed:', err)
    return NextResponse.json(
      { games: [], fetchedAt: new Date().toISOString(), error: 'fetch_failed' },
      { status: 200 }
    )
  }
}
