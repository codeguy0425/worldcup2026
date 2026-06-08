import { Link } from 'react-router-dom'
import { t } from '../i18n'

const links = [
  { to: '/teams', label: 'Teams', icon: '👥', desc: '48 teams, groups & rankings' },
  { to: '/stadiums', label: 'Stadiums', icon: '🏟️', desc: '16 venues across 3 countries' },
  { to: '/bracket', label: 'Knockout Bracket', icon: '🔀', desc: 'Round of 32 to the Final' },
  { to: '/viutv', label: 'ViuTV Free Matches', icon: '📺', desc: '25 free matches schedule' },
]

export function More() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('More')}</h2>
      <div className="space-y-2">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 active:scale-[0.98] transition-transform"
          >
            <span className="text-2xl">{link.icon}</span>
            <div>
              <p className="font-semibold text-sm">{link.label}</p>
              <p className="text-xs text-gray-400">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center text-xs text-gray-400 pt-4 pb-2">
        <p>FIFA World Cup 2026™</p>
        <p>Data: openfootball · Not affiliated with FIFA</p>
      </div>
    </div>
  )
}
