import { useMatches } from '../hooks/useData'
import { Link } from 'react-router-dom'
import { stadiums } from '../data/stadiums'
import { t } from '../i18n'

const roundLabels: Record<string, string> = {
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-finals',
  sf: 'Semi-finals',
  third: 'Third Place',
  final: 'Final',
}

export function Bracket() {
  const matches = useMatches()
  const knockout = matches.filter(m => m.stage !== 'group')

  const grouped = knockout.reduce<Record<string, typeof matches>>((acc, m) => {
    if (!acc[m.stage]) acc[m.stage] = []
    acc[m.stage].push(m)
    return acc
  }, {})

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
              {roundLabels[stage]}
            </h3>
            <div className="space-y-2">
              {ms.map(m => (
                <Link key={m.id} to={`/match/${m.id}`} className="block">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 active:scale-[0.98] transition-transform">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{m.date.slice(5)}</span>
                      <span>{m.time} HKT</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-right text-sm font-medium truncate">{m.team1Id}</span>
                      <span className="text-sm font-bold tabular-nums min-w-[40px] text-center">
                        {m.score1 !== undefined ? `${m.score1}–${m.score2}` : 'vs'}
                      </span>
                      <span className="flex-1 text-left text-sm font-medium truncate">{m.team2Id}</span>
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
