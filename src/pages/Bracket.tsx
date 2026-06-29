import { useMemo } from 'react'
import { useMatches } from '../hooks/useData'
import { Link } from 'react-router-dom'
import { utcToHkt } from '../utils/hkTime'
import { stadiums } from '../data/stadiums'
import { useT } from '../i18n/LanguageContext'
import { resolveTeamId } from '../utils/resolveKnockout'
import { TeamBadge } from '../components/TeamBadge'

const BRACKET_ORDER: Record<string, number[]> = {
  r32: [74, 77, 73, 75, 76, 78, 79, 80, 83, 84, 81, 82, 86, 88, 85, 87],
  r16: [89, 90, 93, 94, 91, 92, 95, 96],
  qf: [97, 98, 99, 100],
  sf: [101, 102],
  third: [103],
  final: [104],
}

export function Bracket() {
  const t = useT()
  const matches = useMatches()
  const knockout = matches.filter(m => m.stage !== 'group')
  const allGroupMatches = matches.filter(m => m.stage === 'group')

  const resolvedIds = useMemo(() => {
    const map = new Map<number, { team1Id: string; team2Id: string }>()
    for (const m of knockout) {
      map.set(m.id, {
        team1Id: resolveTeamId(m.team1Id, allGroupMatches),
        team2Id: resolveTeamId(m.team2Id, allGroupMatches),
      })
    }
    return map
  }, [knockout, allGroupMatches])

  const grouped = useMemo(() => {
    const groups = knockout.reduce<Record<string, typeof matches>>((acc, m) => {
      if (!acc[m.stage]) acc[m.stage] = []
      acc[m.stage].push(m)
      return acc
    }, {})

    for (const [stage, ms] of Object.entries(groups)) {
      const order = BRACKET_ORDER[stage]
      if (order) {
        const idx = new Map(order.map((id, i) => [id, i]))
        ms.sort((a, b) => (idx.get(a.id) ?? 99) - (idx.get(b.id) ?? 99))
      }
    }

    return groups
  }, [knockout])

  const order = ['r32', 'r16', 'qf', 'sf', 'third', 'final']

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('Bracket')}</h2>

      {order.map(stage => {
        const ms = grouped[stage]
        if (!ms) return null
        return (
          <div key={stage}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {stage === 'r32' ? t('Round of 32')
                : stage === 'r16' ? t('Round of 16')
                : stage === 'qf' ? t('Quarter-final')
                : stage === 'sf' ? t('Semi-final')
                : stage === 'third' ? t('Third Place')
                : t('Final')}
            </h3>
            <div className="space-y-2">
              {ms.map(m => (
                <Link key={m.id} to={`/match/${m.id}`} className="block">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 active:scale-[0.98] transition-transform">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{(m.timeUtc ? utcToHkt(m.timeUtc, m.date).date : m.date).slice(5)}</span>
                      <span>{(m.timeUtc ? utcToHkt(m.timeUtc, m.date).time : m.time)} {t('HKT')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 text-right">
                        <TeamBadge teamId={resolvedIds.get(m.id)?.team1Id || m.team1Id} size="md" />
                      </div>
                      <span className="text-sm font-bold tabular-nums min-w-[40px] text-center">
                        {m.score1 !== undefined ? `${m.penalty1 !== undefined ? `(${m.penalty1}) ` : ''}${m.score1} - ${m.score2}${m.penalty2 !== undefined ? ` (${m.penalty2})` : ''}` : t('vs')}
                      </span>
                      <div className="flex-1 text-left">
                        <TeamBadge teamId={resolvedIds.get(m.id)?.team2Id || m.team2Id} size="md" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{stadiums.find(s => s.id === m.groundId)?.name ?? m.groundId}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
