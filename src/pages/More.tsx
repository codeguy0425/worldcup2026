import { Link } from 'react-router-dom'
import { useT, useToggleLang, useLang } from '../i18n/LanguageContext'

const links = [
  { to: '/teams', label: 'Teams', desc: '48 teams, groups & rankings' },
  { to: '/stadiums', label: 'Stadiums', desc: '16 venues across 3 countries' },
  { to: '/top-scorers', label: 'Top Scorers', desc: 'Golden boot ranking' },
  { to: '/bracket', label: 'Knockout Bracket', desc: 'Round of 32 to the Final' },
  { to: '/viutv', label: 'ViuTV Free Matches', desc: '25 free matches schedule' },
]

export function More() {
  const t = useT()
  const toggleLang = useToggleLang()
  const lang = useLang()

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('More')}</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">{t('Language')}</p>
            <p className="text-xs text-gray-400">{lang === 'zh' ? '中文' : 'English'}</p>
          </div>
          <button
            onClick={toggleLang}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            {t('Switch to 中文')}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {links.map(link => {
            const icons: Record<string, string> = { '/teams': '👥', '/stadiums': '🏟️', '/top-scorers': '⚽', '/bracket': '🔀', '/viutv': '📺' }
          return (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 active:scale-[0.98] transition-transform"
            >
              <span className="text-2xl">{icons[link.to]}</span>
              <div>
                <p className="font-semibold text-sm">{t(link.label)}</p>
                <p className="text-xs text-gray-400">{t(link.desc)}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="text-center text-xs text-gray-400 pt-4 pb-2">
        <p>{t('FIFA World Cup 2026™')}</p>
        <p>{t('Data: openfootball · Not affiliated with FIFA')}</p>
      </div>
    </div>
  )
}
