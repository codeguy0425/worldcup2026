import { NavLink, Outlet } from 'react-router-dom'
import { useT, useToggleLang } from '../i18n/LanguageContext'

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/fixtures', label: 'Fixtures', icon: '⚽' },
  { to: '/groups', label: 'Groups', icon: '🏆' },
  { to: '/viutv', label: 'ViuTV', icon: '📺' },
  { to: '/more', label: 'More', icon: '⋯' },
]

export function Layout() {
  const t = useT()
  const toggleLang = useToggleLang()
  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🏆</span>
            <span>{t('World Cup 2026')}</span>
          </h1>
          <button
            onClick={toggleLang}
            className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded-full transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            中文/EN
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 z-10">
        <div className="max-w-lg mx-auto flex">
          {tabs.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                  isActive ? 'text-red-500 font-semibold' : 'text-gray-400'
                }`
              }
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{t(tab.label)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
