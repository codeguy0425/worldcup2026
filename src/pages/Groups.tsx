import { Link } from 'react-router-dom'
import { useGroups } from '../hooks/useData'
import { t } from '../i18n'

export function Groups() {
  const groups = useGroups()

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('Groups')}</h2>
      <div className="grid gap-3">
        {groups.map(g => (
          <Link
            key={g.id}
            to={`/groups/${g.id}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{g.name} {g.nameZh}</h3>
              <span className="text-xs text-gray-400">{g.teams.length} teams</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.teams.map(tid => (
                <span key={tid} className="text-xs bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                  {tid}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
