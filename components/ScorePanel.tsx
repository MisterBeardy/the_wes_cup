'use client'
import { useState } from 'react'
import { Game, Mode, Team } from '@/lib/types'
import { TODAY, DAY_LABELS, teamByAbbr } from '@/lib/teams'
import DrinkLink from './DrinkLink'

interface Props {
  games: Game[]
  mode: Mode
  drankSet: Set<string>
  fetchedAt: string
}

export default function ScorePanel({ games, mode, drankSet, fetchedAt }: Props) {
  const [tab, setTab] = useState<'today' | 'upcoming'>('today')

  const todayGames = games.filter(g => g.date === TODAY)
  const liveGames = todayGames.filter(g => g.status === 'live')
  const todayFinal = todayGames.filter(g => g.status === 'final')
  const todayWinners = todayFinal.filter(g => g.hs !== g.as).map(g => {
    const winAbbr = g.hs > g.as ? g.home : g.away
    const loseAbbr = g.hs > g.as ? g.away : g.home
    const ws = Math.max(g.hs, g.as), ls = Math.min(g.hs, g.as)
    return { team: teamByAbbr(winAbbr), opp: teamByAbbr(loseAbbr), ws, ls, winAbbr }
  }).filter(x => x.team)
  const todayScheduled = todayGames.filter(g => g.status === 'scheduled')

  const upcomingGames = games.filter(g => g.status === 'scheduled' && g.date !== TODAY)
  const byDay: Record<string, Game[]> = {}
  upcomingGames.forEach(g => { if (!byDay[g.date]) byDay[g.date] = []; byDay[g.date].push(g) })

  const fmtTime = new Date(fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const hasContent = todayGames.length > 0

  const DrinkPair = ({ homeAbbr, awayAbbr }: { homeAbbr: string, awayAbbr: string }) => {
    const ht = teamByAbbr(homeAbbr), at = teamByAbbr(awayAbbr)
    if (!ht || !at) return null
    const hd = ht[mode], ad = at[mode]
    const cls = mode === 'auth' ? 'text-emerald-400' : 'text-sky-300'
    return (
      <div className="flex items-center gap-2 flex-wrap mt-1">
        <span className="text-white/70 text-xs">{ht.flag} <span className={`font-bold ${cls}`}><DrinkLink drink={hd} /></span></span>
        <span className="text-white/25 text-[10px]">vs</span>
        <span className="text-white/70 text-xs">{at.flag} <span className={`font-bold ${cls}`}><DrinkLink drink={ad} /></span></span>
      </div>
    )
  }

  return (
    <div className="bg-[#0d1f0d] border-b border-white/10">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {(['today', 'upcoming'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors relative',
              tab === t ? 'text-white' : 'text-white/35 hover:text-white/60',
            ].join(' ')}
          >
            {t === 'today' ? `📅 Today · ${TODAY.slice(5).replace('-', '/')}` : '🔮 Upcoming Games'}
            {tab === t && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${t === 'today' ? 'bg-yellow-400' : 'bg-purple-400'}`} />
            )}
          </button>
        ))}
      </div>

      {/* Today tab */}
      {tab === 'today' && (
        <div className="p-4 text-center space-y-4">
          {!hasContent && (
            <p className="text-white/40 text-sm">No games today — check Upcoming for the next matchday.</p>
          )}

          {/* Live */}
          {liveGames.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">🔴 Live Now</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {liveGames.map(g => {
                  const ht = teamByAbbr(g.home), at = teamByAbbr(g.away)
                  return (
                    <div key={`${g.home}-${g.away}`} className="bg-red-500/15 border border-red-500/50 rounded-lg px-3 py-2 flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {ht?.flag} {ht?.name}
                        <span className="font-['Bebas_Neue'] text-xl">{g.hs}–{g.as}</span>
                        {at?.name} {at?.flag}
                        {g.min && <span className="text-red-400 text-[10px] font-bold">{g.min}&apos;</span>}
                      </div>
                      <DrinkPair homeAbbr={g.home} awayAbbr={g.away} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Winners */}
          {todayWinners.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">🥃 Winners — Drink Up</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {todayWinners.map(({ team, opp, ws, ls, winAbbr }) => (
                  <div
                    key={winAbbr}
                    className={[
                      'bg-yellow-400/15 border border-yellow-400/40 rounded-lg px-3 py-2 flex items-center gap-2 text-left transition-opacity',
                      drankSet.has(winAbbr) ? 'opacity-30' : '',
                    ].join(' ')}
                  >
                    <span className="text-2xl">{team!.flag}</span>
                    <div>
                      <div className="font-['Bebas_Neue'] text-base text-white leading-none">{team!.name}</div>
                      <div className={`text-xs font-bold mt-0.5 ${mode === 'auth' ? 'text-emerald-400' : 'text-sky-300'}`}>
                        🥃 <DrinkLink drink={team![mode]} />
                      </div>
                      <div className="text-[10px] font-['Bebas_Neue'] text-white/50 mt-0.5">
                        {ws}–{ls} vs {opp?.flag} {opp?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Still to play */}
          {todayScheduled.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">⏰ Still to Play Today</div>
              <div className="flex flex-col gap-2 items-center">
                {todayScheduled.map(g => {
                  const ht = teamByAbbr(g.home), at = teamByAbbr(g.away)
                  const favAbbr = g.prob && g.prob[g.home] >= (g.prob[g.away] ?? 0) ? g.home : g.away
                  const favT = teamByAbbr(favAbbr)
                  const favPct = g.prob ? Math.max(g.prob[g.home] ?? 0, g.prob[g.away] ?? 0) : 0
                  return (
                    <div key={`${g.home}-${g.away}`} className="bg-white/8 border border-white/15 rounded-lg px-3 py-2 w-full max-w-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-purple-300 font-bold text-xs tracking-wide min-w-[80px]">{g.time} EDT</span>
                        <span className="text-white font-bold text-sm">{ht?.flag} {ht?.name}</span>
                        <span className="text-white/30 text-xs">vs</span>
                        <span className="text-white font-bold text-sm">{at?.name} {at?.flag}</span>
                        {favPct > 50 && <span className="text-white/40 text-[10px] ml-auto">{favT?.flag} {favPct}% fav</span>}
                      </div>
                      <DrinkPair homeAbbr={g.home} awayAbbr={g.away} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <p className="text-white/25 text-[10px]">✓ Updated {fmtTime} · auto-refreshes every 60s</p>
        </div>
      )}

      {/* Upcoming tab */}
      {tab === 'upcoming' && (
        <div className="p-4 text-center space-y-5">
          {Object.keys(byDay).sort().map(date => (
            <div key={date}>
              <div className="font-['Bebas_Neue'] text-base tracking-widest text-purple-300 mb-2">
                {DAY_LABELS[date] ?? date}
              </div>
              <div className="flex flex-col gap-2 items-center">
                {byDay[date].map(g => {
                  const ht = teamByAbbr(g.home), at = teamByAbbr(g.away)
                  const favAbbr = g.prob && g.prob[g.home] >= (g.prob[g.away] ?? 0) ? g.home : g.away
                  const favT = teamByAbbr(favAbbr)
                  const favPct = g.prob ? Math.max(g.prob[g.home] ?? 0, g.prob[g.away] ?? 0) : 0
                  return (
                    <div key={`${g.home}-${g.away}`} className="w-full max-w-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-purple-300 font-bold text-xs tracking-wide min-w-[88px]">{g.time} EDT</span>
                        <span className="text-white font-bold text-sm">{ht?.flag} {ht?.name}</span>
                        <span className="text-white/30 text-xs">vs</span>
                        <span className="text-white font-bold text-sm">{at?.name} {at?.flag}</span>
                        {favPct > 50 && <span className="text-white/40 text-[10px] ml-auto">{favT?.flag} {favPct}%</span>}
                      </div>
                      <DrinkPair homeAbbr={g.home} awayAbbr={g.away} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          {Object.keys(byDay).length === 0 && (
            <p className="text-white/40 text-sm">No upcoming games loaded yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
