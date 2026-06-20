export type Mode = 'auth' | 'usa'

export interface Drink {
  drink: string
  desc: string
  wiki: string
}

export interface Team {
  g: string
  flag: string
  name: string
  abbr: string
  conf: string
  auth: Drink
  usa: Drink
}

export type GameStatus = 'final' | 'live' | 'scheduled'

export interface Game {
  home: string
  away: string
  hs: number
  as: number
  status: GameStatus
  date: string
  time: string
  min?: number
  prob?: Record<string, number>
}

export interface ScoresResponse {
  games: Game[]
  fetchedAt: string
}
