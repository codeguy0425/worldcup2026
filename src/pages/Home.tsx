import { Link } from 'react-router-dom'
import { useMatches } from '../hooks/useData'
import { MatchCard } from '../components/MatchCard'
import { CountdownTimer } from '../components/CountdownTimer'
import { useT } from '../i18n/LanguageContext'

export function Home() {
  const t = useT()
  const allMatches = useMatches()

  const now = new Date()
  const today = now.toISOString().slice(0, 10)

  const sorted = [...allMatches].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.time.localeCompare(b.time)
  })

  const todayMatches = sorted.filter(m => m.date === today)
  const upcoming = sorted.filter(m => m.date > today).slice(0, 5)
  const hasMatches = todayMatches.length > 0 || upcoming.length > 0

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
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-blue-200 mb-1">{t('Opening Match')}</p>
          <p className="font-semibold">{t('Mexico')} {t('VS')} {t('South Africa')}</p>
          <div className="flex items-center justify-between mt-1 text-sm">
            <span>{t('12 Jun 03:00 HKT')}</span>
            <CountdownTimer target="2026-06-11T19:00:00Z" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {todayMatches.length > 0 ? t('Today') : t('Upcoming')}
        </h2>
        <span className="text-xs text-gray-400">104 {t('matches')}</span>
      </div>

      {!hasMatches && (
        <p className="text-center text-gray-400 py-8">{t('No matches found')}</p>
      )}

      <div className="space-y-2">
        {(todayMatches.length > 0 ? todayMatches : upcoming).map(m => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>

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
