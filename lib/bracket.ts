// World Cup 2026 knockout bracket structure
// R16 pairings are official FIFA bracket assignments

export interface BracketSlot {
  id: string          // e.g. "r16_1"
  label: string       // e.g. "1A vs 2B" — shown when no team confirmed
  homeTeam?: string   // abbr if known
  awayTeam?: string
  homeScore?: number
  awayScore?: number
  status?: 'scheduled' | 'live' | 'final'
  date?: string
  winnerId?: string   // abbr of winner, feeds next round
  nextSlotId?: string // which QF slot this winner feeds
  nextSlotSide?: 'home' | 'away'
}

export interface BracketRound {
  id: string
  label: string
  slots: BracketSlot[]
}

// Official R16 pairings per FIFA 2026 bracket
// Left half feeds SF1, right half feeds SF2
export const R16_DEFINITIONS = [
  // Left side — feeds QF1 and QF2
  { id: 'r16_1',  label: '1A vs 2C', nextSlotId: 'qf_1', nextSlotSide: 'home' as const },
  { id: 'r16_2',  label: '1C vs 2A', nextSlotId: 'qf_1', nextSlotSide: 'away' as const },
  { id: 'r16_3',  label: '1E vs 2G', nextSlotId: 'qf_2', nextSlotSide: 'home' as const },
  { id: 'r16_4',  label: '1G vs 2E', nextSlotId: 'qf_2', nextSlotSide: 'away' as const },
  // Left side — feeds QF3 and QF4
  { id: 'r16_5',  label: '1I vs 2K', nextSlotId: 'qf_3', nextSlotSide: 'home' as const },
  { id: 'r16_6',  label: '1K vs 2I', nextSlotId: 'qf_3', nextSlotSide: 'away' as const },
  { id: 'r16_7',  label: '1B vs 2D', nextSlotId: 'qf_4', nextSlotSide: 'home' as const },
  { id: 'r16_8',  label: '1D vs 2B', nextSlotId: 'qf_4', nextSlotSide: 'away' as const },
  // Right side — feeds QF5 and QF6
  { id: 'r16_9',  label: '1F vs 2H', nextSlotId: 'qf_5', nextSlotSide: 'home' as const },
  { id: 'r16_10', label: '1H vs 2F', nextSlotId: 'qf_5', nextSlotSide: 'away' as const },
  { id: 'r16_11', label: '1J vs 2L', nextSlotId: 'qf_6', nextSlotSide: 'home' as const },
  { id: 'r16_12', label: '1L vs 2J', nextSlotId: 'qf_6', nextSlotSide: 'away' as const },
  // Right side — feeds QF7 and QF8
  { id: 'r16_13', label: 'Best 3rd vs 1st', nextSlotId: 'qf_7', nextSlotSide: 'home' as const },
  { id: 'r16_14', label: 'Best 3rd vs 1st', nextSlotId: 'qf_7', nextSlotSide: 'away' as const },
  { id: 'r16_15', label: 'Best 3rd vs 1st', nextSlotId: 'qf_8', nextSlotSide: 'home' as const },
  { id: 'r16_16', label: 'Best 3rd vs 1st', nextSlotId: 'qf_8', nextSlotSide: 'away' as const },
]

export const QF_DEFINITIONS = [
  { id: 'qf_1', label: 'QF 1', nextSlotId: 'sf_1', nextSlotSide: 'home' as const },
  { id: 'qf_2', label: 'QF 2', nextSlotId: 'sf_1', nextSlotSide: 'away' as const },
  { id: 'qf_3', label: 'QF 3', nextSlotId: 'sf_2', nextSlotSide: 'home' as const },
  { id: 'qf_4', label: 'QF 4', nextSlotId: 'sf_2', nextSlotSide: 'away' as const },
  { id: 'qf_5', label: 'QF 5', nextSlotId: 'sf_3', nextSlotSide: 'home' as const },
  { id: 'qf_6', label: 'QF 6', nextSlotId: 'sf_3', nextSlotSide: 'away' as const },
  { id: 'qf_7', label: 'QF 7', nextSlotId: 'sf_4', nextSlotSide: 'home' as const },
  { id: 'qf_8', label: 'QF 8', nextSlotId: 'sf_4', nextSlotSide: 'away' as const },
]

export const SF_DEFINITIONS = [
  { id: 'sf_1', label: 'Semi-Final 1', nextSlotId: 'final', nextSlotSide: 'home' as const },
  { id: 'sf_2', label: 'Semi-Final 2', nextSlotId: 'final', nextSlotSide: 'away' as const },
  { id: 'sf_3', label: 'Semi-Final 3', nextSlotId: 'final_2', nextSlotSide: 'home' as const },
  { id: 'sf_4', label: 'Semi-Final 4', nextSlotId: 'final_2', nextSlotSide: 'away' as const },
]
