import { useMatches } from '../hooks/useData'
import { Link } from 'react-router-dom'
import { utcToHkt } from '../utils/hkTime'
import { stadiums } from '../data/stadiums'
import { useT } from '../i18n/LanguageContext'

export function Bracket() {
  const t = useT()
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
                      <span className="flex-1 text-right text-sm font-medium truncate">{m.team1Id}</span>
                      <span className="text-sm font-bold tabular-nums min-w-[40px] text-center">
                        {m.score1 !== undefined ? `${m.score1}–${m.score2}` : t('vs')}
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
