import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTeams, useGroups } from '../hooks/useData'
import { useT } from '../i18n/LanguageContext'

export function Teams() {
  const t = useT()
  const teams = useTeams()
  const groups = useGroups()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? teams : teams.filter(t => t.group === filter)

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          {t('All')}
        </button>
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => setFilter(g.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              filter === g.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {g.id}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filtered.map(team => (
          <Link
            key={team.id}
            to={`/teams/${team.name}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{team.flag}</span>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{team.name}</p>
                <p className="text-xs text-gray-400">{team.nameZh}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{t('Group')} {team.group}</span>
              <span>•</span>
              <span>#{team.ranking}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
