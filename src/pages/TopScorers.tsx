import { useMemo } from 'react'
import { matches } from '../data/matches'
import { teams } from '../data/teams'
import { useT } from '../i18n/LanguageContext'

interface ScorerEntry {
  name: string
  teamId: string
  goals: number
}

export function TopScorers() {
  const t = useT()

  const scorers = useMemo(() => {
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
          map.set(key, { name: g.scorer, teamId: g.teamId, goals: 1 })
        }
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
  }, [])

  if (scorers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{t('No goals scored yet')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚽</span>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('Top Scorers')}</h2>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
            <th className="text-left py-3 pl-4 w-8">#</th>
            <th className="text-left pr-2">{t('Player')}</th>
            <th className="text-center w-16 px-2">{t('Team')}</th>
            <th className="text-center w-14 pr-4 font-bold">{t('Goals')}</th>
          </tr>
        </thead>
        <tbody>
          {scorers.map((s, i) => {
            const team = teams.find(t => t.id === s.teamId)
            return (
              <tr key={`${s.name}|${s.teamId}`} className="border-b dark:border-gray-700/50 last:border-0">
                <td className="py-3 pl-4 w-8">
                  <span className={`text-xs font-bold ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-gray-400'}`}>
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                  </span>
                </td>
                <td className="pr-2">
                  <span className="font-medium">{s.name}</span>
                </td>
                <td className="text-center w-16 px-2">
                  <span className="text-base leading-none">{team?.flag || ''}</span>
                </td>
                <td className="text-center w-14 pr-4">
                  <span className="inline-flex items-center justify-center size-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold">
                    {s.goals}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
