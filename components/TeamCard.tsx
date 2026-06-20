'use client'
import { Team, Mode, Game } from '@/lib/types'
import DrinkLink from './DrinkLink'

interface Props {
  team: Team
  mode: Mode
  game?: Game
  isWinner: boolean
  isLive: boolean
  hasDrank: boolean
  onToggle: (abbr: string) => void
}

export default function TeamCard({ team, mode, game, isWinner, isLive, hasDrank, onToggle }: Props) {
  const drink = team[mode]

  const myScore = game ? (game.home === team.abbr ? game.hs : game.as) : null
  const oppAbbr = game ? (game.home === team.abbr ? game.away : game.home) : null
  const oppScore = game ? (game.home === team.abbr ? game.as : game.hs) : null

  const outcome = game?.status === 'final'
    ? isWinner ? 'won' : myScore === oppScore ? 'draw' : 'lost'
    : null

  const cardClass = [
    'relative rounded-lg p-4 transition-all duration-150 overflow-hidden',
    'border hover:-translate-y-0.5 hover:shadow-xl',
    hasDrank
      ? 'border-orange-500 bg-orange-950/40'
      : isWinner
      ? 'border-yellow-500/60 bg-yellow-950/40'
      : isLive
      ? 'border-red-500/50 bg-[#0f2a0f]'
      : 'border-[#2d5a2d] bg-[#0f2a0f] hover:border-yellow-500/30',
  ].join(' ')

  const topBarClass = [
    'absolute top-0 left-0 right-0 h-0.5',
    hasDrank ? 'bg-orange-500'
    : isWinner ? 'bg-yellow-400'
    : isLive ? 'bg-red-500 animate-pulse'
    : 'bg-[#2d5a2d]',
  ].join(' ')

  const btnClass = [
    'w-full py-2 px-3 rounded text-xs font-bold uppercase tracking-widest transition-all',
    hasDrank
      ? 'bg-orange-500 border-orange-500 text-white'
      : isWinner
      ? 'bg-yellow-400 border-yellow-400 text-black animate-pulse'
      : 'border border-[#2d5a2d] text-[#b8b4aa] hover:bg-orange-500 hover:border-orange-500 hover:text-white',
  ].join(' ')

  return (
    <div className={cardClass}>
      <div className={topBarClass} />

      {/* Corner badge */}
      {(hasDrank || isWinner) && (
        <span className={`absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider ${hasDrank ? 'text-orange-400' : 'text-yellow-400'}`}>
          {hasDrank ? 'DRANK ✓' : 'WIN ⚽'}
        </span>
      )}

      {/* Score badge */}
      {game && game.status !== 'scheduled' && (
        <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 rounded px-2 py-1 mb-3 text-xs w-fit">
          {game.status === 'live' ? (
            <>
              <span className="text-red-400 font-bold text-[10px] uppercase tracking-widest">LIVE</span>
              <span className="font-['Bebas_Neue'] text-base">{myScore}</span>
              <span className="text-[#b8b4aa] text-[10px]">vs {oppAbbr}</span>
              <span className="font-['Bebas_Neue'] text-base">{oppScore}</span>
              {game.min && <span className="text-red-400 text-[10px] font-bold">{game.min}&apos;</span>}
            </>
          ) : (
            <>
              <span className={`font-bold text-[10px] uppercase tracking-widest ${outcome === 'won' ? 'text-yellow-400' : outcome === 'lost' ? 'text-red-400' : 'text-gray-400'}`}>
                {outcome?.toUpperCase()}
              </span>
              <span className="font-['Bebas_Neue'] text-base">{myScore}–{oppScore}</span>
              <span className="text-[#b8b4aa] text-[10px]">vs {oppAbbr}</span>
            </>
          )}
        </div>
      )}

      <span className="text-3xl block mb-1 leading-none">{team.flag}</span>
      <div className="font-['Bebas_Neue'] text-lg tracking-wide mb-0.5 text-[#f0ede6]">{team.name}</div>
      <div className="text-[10px] uppercase tracking-widest text-[#b8b4aa] mb-3">{team.conf} · Group {team.g}</div>

      <div className="mb-3">
        {mode === 'usa' && (
          <div className="text-[9px] uppercase tracking-widest font-bold opacity-60 mb-1">🇺🇸 Bar Sub</div>
        )}
        <div className={`text-[13px] font-semibold mb-0.5 ${mode === 'auth' ? 'text-emerald-400' : 'text-sky-300'}`}>
          {mode === 'auth' ? '🥃' : '🍺'} <DrinkLink drink={drink} />
        </div>
        <div className="text-[11px] text-[#b8b4aa] leading-snug">{drink.desc}</div>
      </div>

      <button className={btnClass} onClick={() => onToggle(team.abbr)}>
        {hasDrank ? '✅ DRANK IT' : isWinner ? '🥃 DRINK NOW!' : '🥃 Mark as Won'}
      </button>
    </div>
  )
}
