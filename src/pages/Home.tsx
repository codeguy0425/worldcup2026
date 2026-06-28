import { Link } from 'react-router-dom'
import { useMatches } from '../hooks/useData'
import { MatchCard } from '../components/MatchCard'
import { CountdownTimer } from '../components/CountdownTimer'
import { utcToHkt } from '../utils/hkTime'
import { useT } from '../i18n/LanguageContext'

function hkDateStr(m: { date: string; timeUtc?: string }) {
  return m.timeUtc ? utcToHkt(m.timeUtc, m.date).date : m.date
}

export function Home() {
  const t = useT()
  const allMatches = useMatches()

  const withResult = allMatches.filter(m => m.score1 !== undefined)
  const withoutResult = allMatches.filter(m => m.score1 === undefined)

  const latest = [...withResult].sort((a, b) => {
    const ha = hkDateStr(a), hb = hkDateStr(b)
    if (ha !== hb) return hb.localeCompare(ha)
    return b.time.localeCompare(a.time)
  }).slice(0, 6)

  const upcoming = [...withoutResult].sort((a, b) => {
    const ha = hkDateStr(a), hb = hkDateStr(b)
    if (ha !== hb) return ha.localeCompare(hb)
    return a.time.localeCompare(b.time)
  }).slice(0, 6)

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

      {latest.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t('Latest Results')}
          </h2>
          <div className="space-y-2">
            {latest.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t('Upcoming')}
          </h2>
          <div className="space-y-2">
            {upcoming.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </>
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
