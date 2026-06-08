import { useState } from 'react'
import { useMatches } from '../hooks/useData'
import { MatchCard } from '../components/MatchCard'
import { t } from '../i18n'

const stages = [
  { key: 'all', label: 'All' },
  { key: 'group', label: 'Group' },
  { key: 'r32', label: 'R32' },
  { key: 'r16', label: 'R16' },
  { key: 'qf', label: 'QF' },
  { key: 'sf', label: 'SF' },
  { key: 'final', label: 'Final' },
]

export function Fixtures() {
  const matches = useMatches()
  const [stageFilter, setStageFilter] = useState('all')

  const filtered = stageFilter === 'all'
    ? matches
    : matches.filter(m => m.stage === stageFilter || (stageFilter === 'final' && (m.stage === 'third' || m.stage === 'final')))

  const grouped = filtered.reduce<Record<string, typeof matches>>((acc, m) => {
    if (!acc[m.date]) acc[m.date] = []
    acc[m.date].push(m)
    return acc
  }, {})

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {stages.map(s => (
          <button
            key={s.key}
            onClick={() => setStageFilter(s.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              stageFilter === s.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {s.key === 'all' ? t('All') : s.label}
          </button>
        ))}
      </div>

      {Object.entries(grouped).length === 0 ? (
        <p className="text-center text-gray-400 py-8">{t('No matches found')}</p>
      ) : (
        Object.entries(grouped).map(([date, ms]) => (
          <div key={date}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {date.slice(5)}
            </h3>
            <div className="space-y-2">
              {ms.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
