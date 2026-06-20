'use client'
import { Mode, Game } from '@/lib/types'
import { TEAMS } from '@/lib/teams'
import { R16_DEFINITIONS, QF_DEFINITIONS, SF_DEFINITIONS } from '@/lib/bracket'
import DrinkLink from './DrinkLink'

interface Props {
  mode: Mode
  knockoutGames: Game[]
  drankSet: Set<string>
  onToggle: (abbr: string) => void
}

interface MatchSlot {
  id: string
  roundLabel?: string
  homeAbbr?: string
  awayAbbr?: string
  homeScore?: number
  awayScore?: number
  status?: 'scheduled' | 'live' | 'final'
  label: string       // placeholder text when no teams confirmed
  winnerAbbr?: string
}

const teamByAbbr = (abbr?: string) => TEAMS.find(t => t.abbr === abbr)

function MatchCard({
  slot,
  mode,
  drankSet,
  onToggle,
  size = 'md',
}: {
  slot: MatchSlot
  mode: Mode
  drankSet: Set<string>
  onToggle: (abbr: string) => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const home = teamByAbbr(slot.homeAbbr)
  const away = teamByAbbr(slot.awayAbbr)
  const isFinal = slot.status === 'final'
  const isLive  = slot.status === 'live'
  const isEmpty = !home && !away

  const homeWon = isFinal && slot.homeScore !== undefined && slot.awayScore !== undefined && slot.homeScore > slot.awayScore
  const awayWon = isFinal && slot.homeScore !== undefined && slot.awayScore !== undefined && slot.awayScore > slot.homeScore

  const widths = { sm: 'w-36', md: 'w-44', lg: 'w-52' }
  const w = widths[size]

  if (isEmpty) {
    return (
      <div className={`${w} border border-white/10 rounded-lg bg-white/3 overflow-hidden`}>
        <div className="px-2.5 py-2 flex items-center gap-2 border-b border-white/8">
          <span className="text-white/20 text-[10px] font-bold uppercase tracking-wider leading-tight">{slot.label}</span>
        </div>
        <div className="px-2.5 py-2 flex items-center gap-2">
          <span className="text-white/20 text-[10px] font-bold uppercase tracking-wider leading-tight">TBD</span>
        </div>
      </div>
    )
  }

  const TeamRow = ({
    team,
    abbr,
    score,
    won,
  }: {
    team: ReturnType<typeof teamByAbbr>
    abbr?: string
    score?: number
    won: boolean
  }) => {
    const drink = team ? team[mode] : null
    const hasDrank = abbr ? drankSet.has(abbr) : false

    return (
      <div className={[
        'px-2.5 py-1.5 flex items-center gap-1.5 group',
        won ? 'bg-yellow-400/10' : '',
        hasDrank ? 'opacity-50' : '',
      ].join(' ')}>
        {team ? (
          <>
            <span className="text-base leading-none flex-shrink-0">{team.flag}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-bold leading-none truncate ${won ? 'text-yellow-300' : 'text-white/80'}`}>
                {team.name}
              </div>
              {drink && (
                <div className={`text-[9px] leading-tight mt-0.5 truncate ${mode === 'auth' ? 'text-emerald-400/80' : 'text-sky-300/80'}`}>
                  <DrinkLink drink={drink} />
                </div>
              )}
            </div>
            {score !== undefined && (
              <span className={`font-['Bebas_Neue'] text-base leading-none flex-shrink-0 ${won ? 'text-yellow-300' : 'text-white/60'}`}>
                {score}
              </span>
            )}
            {won && abbr && !hasDrank && (
              <button
                onClick={() => onToggle(abbr)}
                title="Mark as drank"
                className="text-[9px] bg-yellow-400/20 hover:bg-yellow-400/40 border border-yellow-400/40 text-yellow-300 rounded px-1 py-0.5 leading-none flex-shrink-0 transition-colors"
              >
                🥃
              </button>
            )}
            {hasDrank && (
              <button
                onClick={() => abbr && onToggle(abbr)}
                title="Undo"
                className="text-[9px] text-orange-400 flex-shrink-0"
              >
                ✓
              </button>
            )}
          </>
        ) : (
          <span className="text-white/20 text-[10px] uppercase tracking-wide">TBD</span>
        )}
      </div>
    )
  }

  return (
    <div className={[
      `${w} border rounded-lg overflow-hidden`,
      isLive  ? 'border-red-500/50 bg-red-950/20' :
      isFinal ? 'border-yellow-400/30 bg-yellow-950/10' :
                'border-white/15 bg-white/4',
    ].join(' ')}>
      {isLive && (
        <div className="px-2 py-0.5 bg-red-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-[9px] font-bold uppercase tracking-widest">Live</span>
        </div>
      )}
      <TeamRow team={home} abbr={slot.homeAbbr} score={slot.homeScore} won={homeWon} />
      <div className="border-t border-white/8" />
      <TeamRow team={away} abbr={slot.awayAbbr} score={slot.awayScore} won={awayWon} />
    </div>
  )
}

// Connector line between rounds
function Connector({ count }: { count: number }) {
  return (
    <div className="flex flex-col" style={{ gap: `${(count - 1) * 4}rem` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center h-16">
          <div className="w-4 border-t border-white/15" />
          <div className="h-full border-r border-white/15" style={{ marginTop: i === 0 ? '50%' : undefined, marginBottom: i === count - 1 ? '50%' : undefined }} />
        </div>
      ))}
    </div>
  )
}

// A single column of match cards with a label
function RoundColumn({
  label,
  slots,
  mode,
  drankSet,
  onToggle,
  size,
  gap,
}: {
  label: string
  slots: MatchSlot[]
  mode: Mode
  drankSet: Set<string>
  onToggle: (abbr: string) => void
  size?: 'sm' | 'md' | 'lg'
  gap: string
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-400/70 mb-3 text-center whitespace-nowrap">
        {label}
      </div>
      <div className="flex flex-col" style={{ gap }}>
        {slots.map(slot => (
          <MatchCard
            key={slot.id}
            slot={slot}
            mode={mode}
            drankSet={drankSet}
            onToggle={onToggle}
            size={size}
          />
        ))}
      </div>
    </div>
  )
}

export default function Bracket({ mode, knockoutGames, drankSet, onToggle }: Props) {
  // Build slot map from knockout games (we'll match by team abbrs when available)
  const gameMap = new Map<string, Game>()
  knockoutGames.forEach(g => gameMap.set(`${g.home}-${g.away}`, g))

  function buildSlots(defs: typeof R16_DEFINITIONS): MatchSlot[] {
    return defs.map(def => {
      // Try to find a matching game
      const game = knockoutGames.find(g =>
        (def.id.includes('r16') && false) // placeholder — will match when R16 data comes in
      )
      return {
        id: def.id,
        label: def.label,
        homeAbbr: undefined,
        awayAbbr: undefined,
        homeScore: undefined,
        awayScore: undefined,
        status: undefined,
        winnerAbbr: undefined,
      }
    })
  }

  const r16Slots = buildSlots(R16_DEFINITIONS)
  const qfSlots  = buildSlots(QF_DEFINITIONS)
  const sfSlots  = buildSlots(SF_DEFINITIONS)

  // Overlay any actual knockout game data
  knockoutGames.forEach(g => {
    const allSlots = [...r16Slots, ...qfSlots, ...sfSlots]
    const match = allSlots.find(s =>
      (s.homeAbbr === g.home && s.awayAbbr === g.away) ||
      (!s.homeAbbr && !s.awayAbbr && false) // future: match by round number
    )
    if (match) {
      match.homeScore = g.hs
      match.awayScore = g.as
      match.status = g.status
      match.winnerAbbr = g.status === 'final'
        ? (g.hs > g.as ? g.home : g.as > g.hs ? g.away : undefined)
        : undefined
    }
  })

  const finalSlot: MatchSlot = {
    id: 'final',
    label: 'FINAL',
    homeAbbr: undefined,
    awayAbbr: undefined,
  }

  // Split into left and right halves for display
  const r16Left  = r16Slots.slice(0, 8)
  const r16Right = r16Slots.slice(8, 16)
  const qfLeft   = qfSlots.slice(0, 4)
  const qfRight  = qfSlots.slice(4, 8)
  const sfLeft   = sfSlots.slice(0, 2)
  const sfRight  = sfSlots.slice(2, 4)

  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="min-w-[900px] px-4 py-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="font-['Bebas_Neue'] text-3xl tracking-widest text-yellow-400">
            ⚽ Knockout Bracket
          </h2>
          <p className="text-white/30 text-xs mt-1">
            Slots fill in as group stage completes · Jul 4 – Jul 19
          </p>
        </div>

        {/* Bracket layout: R16 → QF → SF → Final → SF → QF → R16 */}
        <div className="flex items-center justify-center gap-0">

          {/* LEFT: R16 */}
          <RoundColumn
            label="Round of 16"
            slots={r16Left}
            mode={mode}
            drankSet={drankSet}
            onToggle={onToggle}
            size="sm"
            gap="0.75rem"
          />

          {/* Connector R16 → QF left */}
          <svg width="32" className="flex-shrink-0" style={{ height: `${r16Left.length * 4.5}rem` }}>
            {[0, 1, 2, 3].map(i => {
              const pairTop  = i * 2 * 72 + 36
              const pairBot  = pairTop + 72
              const midY     = (pairTop + pairBot) / 2
              return (
                <g key={i}>
                  <line x1="0" y1={pairTop} x2="16" y2={pairTop} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="0" y1={pairBot} x2="16" y2={pairBot} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={pairTop} x2="16" y2={pairBot} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={midY} x2="32" y2={midY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </g>
              )
            })}
          </svg>

          {/* LEFT: QF */}
          <RoundColumn
            label="Quarter-Finals"
            slots={qfLeft}
            mode={mode}
            drankSet={drankSet}
            onToggle={onToggle}
            size="sm"
            gap="2.5rem"
          />

          {/* Connector QF → SF left */}
          <svg width="32" className="flex-shrink-0" style={{ height: `${qfLeft.length * 8}rem` }}>
            {[0, 1].map(i => {
              const pairTop = i * 2 * 128 + 64
              const pairBot = pairTop + 128
              const midY    = (pairTop + pairBot) / 2
              return (
                <g key={i}>
                  <line x1="0" y1={pairTop} x2="16" y2={pairTop} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="0" y1={pairBot} x2="16" y2={pairBot} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={pairTop} x2="16" y2={pairBot} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={midY} x2="32" y2={midY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </g>
              )
            })}
          </svg>

          {/* LEFT: SF */}
          <RoundColumn
            label="Semi-Finals"
            slots={sfLeft}
            mode={mode}
            drankSet={drankSet}
            onToggle={onToggle}
            size="md"
            gap="6rem"
          />

          {/* Connector SF → Final left */}
          <svg width="32" className="flex-shrink-0" style={{ height: `${sfLeft.length * 16}rem` }}>
            {[0, 1].map(i => {
              const y = i === 0 ? 64 : (sfLeft.length * 256) - 64
              const midY = (sfLeft.length * 256) / 2
              return (
                <g key={i}>
                  <line x1="0" y1={y} x2="16" y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={i === 0 ? y : midY} x2="16" y2={i === 0 ? midY : y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  {i === 1 && <line x1="16" y1={midY} x2="32" y2={midY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />}
                </g>
              )
            })}
          </svg>

          {/* FINAL */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-400/70 mb-3 text-center">
              🏆 Final · Jul 19
            </div>
            <MatchCard
              slot={finalSlot}
              mode={mode}
              drankSet={drankSet}
              onToggle={onToggle}
              size="lg"
            />
            <div className="mt-4 text-center">
              <div className="font-['Bebas_Neue'] text-yellow-400 text-lg tracking-wider">
                MetLife Stadium
              </div>
              <div className="text-white/30 text-[10px]">East Rutherford, NJ</div>
            </div>
          </div>

          {/* Connector Final → SF right */}
          <svg width="32" className="flex-shrink-0" style={{ height: `${sfRight.length * 16}rem` }}>
            {[0, 1].map(i => {
              const y = i === 0 ? 64 : (sfRight.length * 256) - 64
              const midY = (sfRight.length * 256) / 2
              return (
                <g key={i}>
                  {i === 0 && <line x1="0" y1={midY} x2="16" y2={midY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />}
                  <line x1="16" y1={i === 0 ? midY : y} x2="16" y2={i === 0 ? y : midY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={y} x2="32" y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </g>
              )
            })}
          </svg>

          {/* RIGHT: SF */}
          <RoundColumn
            label="Semi-Finals"
            slots={sfRight}
            mode={mode}
            drankSet={drankSet}
            onToggle={onToggle}
            size="md"
            gap="6rem"
          />

          {/* Connector SF → QF right */}
          <svg width="32" className="flex-shrink-0" style={{ height: `${qfRight.length * 8}rem` }}>
            {[0, 1].map(i => {
              const pairTop = i * 2 * 128 + 64
              const pairBot = pairTop + 128
              const midY    = (pairTop + pairBot) / 2
              return (
                <g key={i}>
                  <line x1="0" y1={midY} x2="16" y2={midY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={pairTop} x2="16" y2={pairBot} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={pairTop} x2="32" y2={pairTop} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={pairBot} x2="32" y2={pairBot} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </g>
              )
            })}
          </svg>

          {/* RIGHT: QF */}
          <RoundColumn
            label="Quarter-Finals"
            slots={qfRight}
            mode={mode}
            drankSet={drankSet}
            onToggle={onToggle}
            size="sm"
            gap="2.5rem"
          />

          {/* Connector QF → R16 right */}
          <svg width="32" className="flex-shrink-0" style={{ height: `${r16Right.length * 4.5}rem` }}>
            {[0, 1, 2, 3].map(i => {
              const pairTop  = i * 2 * 72 + 36
              const pairBot  = pairTop + 72
              const midY     = (pairTop + pairBot) / 2
              return (
                <g key={i}>
                  <line x1="0" y1={midY} x2="16" y2={midY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={pairTop} x2="16" y2={pairBot} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={pairTop} x2="32" y2={pairTop} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="16" y1={pairBot} x2="32" y2={pairBot} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </g>
              )
            })}
          </svg>

          {/* RIGHT: R16 */}
          <RoundColumn
            label="Round of 16"
            slots={r16Right}
            mode={mode}
            drankSet={drankSet}
            onToggle={onToggle}
            size="sm"
            gap="0.75rem"
          />

        </div>

        {/* Key */}
        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] text-white/30">
            <div className="w-3 h-3 border border-yellow-400/40 rounded bg-yellow-950/20" />
            Final result
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/30">
            <div className="w-3 h-3 border border-red-500/40 rounded bg-red-950/20" />
            Live
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/30">
            <div className="w-3 h-3 border border-white/15 rounded bg-white/3" />
            TBD — group stage in progress
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/30">
            <span>🥃</span>
            Tap to mark drink
          </div>
        </div>
      </div>
    </div>
  )
}
