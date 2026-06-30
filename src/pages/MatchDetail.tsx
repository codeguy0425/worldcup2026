import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMatchById } from '../hooks/useData'
import { TeamBadge } from '../components/TeamBadge'
import { ViuTVBadge } from '../components/ViuTVBadge'
import { teams } from '../data/teams'
import { matches } from '../data/matches'
import { resolveTeamId } from '../utils/resolveKnockout'
import { utcToHkt, hkDisplay } from '../utils/hkTime'
import { stadiums } from '../data/stadiums'
import { useT, useLang } from '../i18n/LanguageContext'

function minuteLabel(minute: number, stoppageTime?: number) {
  return stoppageTime ? `${minute}+${stoppageTime}'` : `${minute}'`
}

export function MatchDetail() {
  const t = useT()
  const lang = useLang()
  const { id } = useParams()
  const match = useMatchById(Number(id))

  const goalsWithScore = useMemo(() => {
    if (!match?.goals?.length) return []
    const sorted = [...match.goals].sort((a, b) => {
      const ma = a.minute * 60 + (a.stoppageTime ?? 0)
      const mb = b.minute * 60 + (b.stoppageTime ?? 0)
      return ma - mb
    })
    let s1 = 0, s2 = 0
    return sorted.map(g => {
      if (g.teamId === match.team1Id) s1++; else s2++
      return { ...g, score1: s1, score2: s2 }
    })
  }, [match])

  if (!match) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{t('No matches found')}</p>
        <Link to="/fixtures" className="text-blue-500 text-sm mt-2 inline-block">&larr; {t('Fixtures')}</Link>
      </div>
    )
  }

  const allGroupMatches = matches.filter(m => m.stage === 'group')
  const resolvedTeam1Id = match.stage !== 'group' ? resolveTeamId(match.team1Id, allGroupMatches) : match.team1Id
  const resolvedTeam2Id = match.stage !== 'group' ? resolveTeamId(match.team2Id, allGroupMatches) : match.team2Id

  const hkt = match.timeUtc ? utcToHkt(match.timeUtc, match.date) : { date: match.date, time: match.time }
  const stadium = stadiums.find(s => s.id === match.groundId)
  const stageLabel = match.stage === 'group' && match.group
    ? `${t('Group Stage')} ${match.group.replace('Group ', '')}${lang === 'zh' ? '組' : ''}`
    : t(match.stage === 'r32' ? 'Round of 32'
      : match.stage === 'r16' ? 'Round of 16'
      : match.stage === 'qf' ? 'Quarter-final'
      : match.stage === 'sf' ? 'Semi-final'
      : match.stage === 'third' ? 'Third Place'
      : 'Final')

  return (
    <div className="space-y-4">
      <Link to="/fixtures" className="text-sm text-blue-500 inline-block">&larr; {t('Fixtures')}</Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{stageLabel}</p>

        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex flex-col items-center gap-2">
            <TeamBadge teamId={resolvedTeam1Id} size="lg" />
            <div className="flex items-center gap-1">
              {match.penalty1 !== undefined && (
                <span className="text-lg font-bold text-gray-400">({match.penalty1})</span>
              )}
              <span className="text-3xl font-bold tabular-nums">
                {match.score1 ?? '–'}
              </span>
            </div>
          </div>
          <span className="text-gray-300 text-sm font-medium">
            {match.score1 !== undefined ? '-' : t('VS')}
          </span>
          <div className="flex flex-col items-center gap-2">
            <TeamBadge teamId={resolvedTeam2Id} size="lg" />
            <div className="flex items-center gap-1">
              <span className="text-3xl font-bold tabular-nums">
                {match.score2 ?? '–'}
              </span>
              {match.penalty2 !== undefined && (
                <span className="text-lg font-bold text-gray-400">({match.penalty2})</span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500">{hkDisplay(hkt.date, hkt.time)}</p>
        <p className="text-xs text-gray-400">{match.date} {match.timeUtc} {t('UTC')}</p>

        {match.viutv && (
          <div className="mt-3 flex justify-center">
            <ViuTVBadge size="md" />
          </div>
        )}
      </div>

      {match.penaltyShootout && (() => {
        const t1 = match.team1Id
        const t2 = match.team2Id
        const rounds = []
        for (let i = 0; i < match.penaltyShootout.length; i += 2) {
          rounds.push({
            t1: match.penaltyShootout[i],
            t2: match.penaltyShootout[i + 1]
          })
        }
        const t1Scored = match.penaltyShootout.filter(k => k.teamId === t1 && k.scored).length
        const t2Scored = match.penaltyShootout.filter(k => k.teamId === t2 && k.scored).length
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 text-center">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t('Penalties')}</h3>
            <div className="max-w-xs mx-auto space-y-1.5">
              {rounds.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className={r.t1.scored ? 'text-green-600' : 'text-red-500'}>{r.t1.scored ? '✓' : '✕'}</span>
                    <span className={`${r.t1.scored ? '' : 'text-gray-400 line-through'}`}>{r.t1.taker}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    {r.t2 && <>
                      <span className={r.t2.scored ? 'text-green-600' : 'text-red-500'}>{r.t2.scored ? '✓' : '✕'}</span>
                      <span className={`${r.t2.scored ? '' : 'text-gray-400 line-through'}`}>{r.t2.taker}</span>
                    </>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm font-bold tabular-nums">
              <span>{t1Scored}</span>
              <span className="text-gray-300">–</span>
              <span>{t2Scored}</span>
            </div>
          </div>
        )
      })()}

      {goalsWithScore.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('Goals')}</h3>

          {/* Scoreboard progression */}
          <div className="flex items-center gap-1.5 text-sm font-mono mb-3 px-1">
            <span className="tabular-nums font-bold">0-0</span>
            {goalsWithScore.map((g, i) => (
              <span key={i} className="flex items-center gap-1 text-gray-500">
                <span className="text-gray-300">→</span>
                <span className="tabular-nums font-bold text-gray-800 dark:text-gray-100">
                  {g.score1}-{g.score2}
                </span>
              </span>
            ))}
          </div>

          <div className="space-y-2">
            {goalsWithScore.map((g, i) => {
              const teamInfo = teams.find(t => t.id === g.teamId)
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center mt-1">
                    <div className="size-2.5 rounded-full bg-amber-400" />
                    {i < goalsWithScore.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 min-h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-500 w-14 shrink-0">{minuteLabel(g.minute, g.stoppageTime)}</span>
                      <span className="text-sm font-medium truncate">{g.scorer}</span>
                      {g.ownGoal && <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-medium">{t('Own Goal')}</span>}
                      {g.penalty && <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-medium">{t('Penalty')}</span>}
                    </div>
                    {g.assist && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 w-14 shrink-0 text-right">{t('Assist')}</span>
                        <span className="text-xs text-gray-500">{g.assist}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs">{teamInfo?.flag}</span>
                    <span className="text-xs font-mono font-bold tabular-nums text-gray-500 dark:text-gray-400">{g.score1}-{g.score2}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {stadium && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('Venue')}</h3>
          <p className="font-medium">{stadium.name}</p>
          <p className="text-sm text-gray-500">{stadium.city}, {stadium.country}</p>
          <p className="text-xs text-gray-400">{t('Capacity')}: {stadium.capacity.toLocaleString()}</p>
        </div>
      )}
    </div>
  )
}
