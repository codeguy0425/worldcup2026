import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { matches } from '../data/matches'
import { TeamBadge } from '../components/TeamBadge'
import { useT } from '../i18n/LanguageContext'

interface ScorerEntry {
  name: string
  teamId: string
  goals: number
  shirtNo?: number
}

const FINAL_RANKING = [
  { teamId: 'ESP', label: 'Champion', medal: '🥇' },
  { teamId: 'ARG', label: 'Runner-up', medal: '🥈' },
  { teamId: 'ENG', label: 'Third Place', medal: '🥉' },
  { teamId: 'FRA', label: 'Fourth Place', medal: '' },
]

export function Home() {
  const t = useT()

  const topScorer = useMemo(() => {
    const map = new Map<string, ScorerEntry>()
    for (const m of matches) {
      if (!m.goals) continue
      for (const g of m.goals) {
        if (g.ownGoal) continue
        const key = `${g.scorer}|${g.teamId}`
        const existing = map.get(key)
        if (existing) {
          existing.goals++
        } else {
          map.set(key, { name: g.scorer, teamId: g.teamId, goals: 1, shirtNo: g.shirtNo })
        }
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))[0] || null
  }, [])

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">{t('FIFA World Cup 2026')}</p>
            <p className="text-2xl font-bold mt-0.5">{t('11 Jun – 19 Jul')}</p>
            <p className="text-blue-200 text-sm">{t('USA · Canada · Mexico')}</p>
          </div>
          <span className="text-5xl">🏆</span>
        </div>
        <div className="bg-yellow-500/20 rounded-xl p-3 text-center">
          <p className="text-lg font-bold">{t('Tournament Completed')}</p>
          <p className="text-sm text-blue-200">{t('Champion')}: <TeamBadge teamId="ESP" /></p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('Final Ranking')}</h2>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {FINAL_RANKING.map((r, i) => (
            <div key={r.teamId} className="flex items-center gap-3 px-4 py-3">
              <span className="text-lg w-8 text-center">{r.medal || i + 1}</span>
              <div className="flex-1 flex items-center gap-2">
                <TeamBadge teamId={r.teamId} />
              </div>
              <span className="text-xs text-gray-400">{t(r.label)}</span>
            </div>
          ))}
        </div>
      </div>

      {topScorer && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚽</span>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('Top Scorer')}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <span className="text-2xl">🥇</span>
            <div className="flex-1">
              <p className="font-semibold text-base">{topScorer.name}</p>
              <TeamBadge teamId={topScorer.teamId} size="sm" />
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5">
                {topScorer.shirtNo && (
                  <span className="inline-flex items-center justify-center size-6 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-bold">
                    #{topScorer.shirtNo}
                  </span>
                )}
                <span className="inline-flex items-center justify-center size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-base font-bold">
                  {topScorer.goals}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{t('Goals')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {[
          { to: '/groups', label: 'Groups', icon: '📊', color: 'bg-emerald-500' },
          { to: '/bracket', label: 'Knockout', icon: '🔀', color: 'bg-amber-500' },
          { to: '/viutv', label: 'Free ViuTV', icon: '📺', color: 'bg-red-500' },
          { to: '/teams', label: 'Teams', icon: '👥', color: 'bg-indigo-500' },
        ].map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`${item.color} rounded-xl p-4 text-white flex items-center gap-3 active:scale-95 transition-transform`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-semibold text-sm">{t(item.label)}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
