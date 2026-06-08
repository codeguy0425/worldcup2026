import { useParams, Link } from 'react-router-dom'
import { useMatches, useTeamByName } from '../hooks/useData'
import { MatchCard } from '../components/MatchCard'
import { t } from '../i18n'

export function TeamDetail() {
  const { name } = useParams<{ name: string }>()
  const team = useTeamByName(name || '')
  const allMatches = useMatches()

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{t('No matches found')}</p>
        <Link to="/teams" className="text-blue-500 text-sm mt-2 inline-block">&larr; {t('Teams')}</Link>
      </div>
    )
  }

  const teamMatches = allMatches.filter(m => m.team1Id === team.name || m.team2Id === team.name)

  return (
    <div className="space-y-4">
      <Link to="/teams" className="text-sm text-blue-500 inline-block">&larr; {t('Teams')}</Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 text-center">
        <span className="text-5xl block mb-2">{team.flag}</span>
        <h2 className="text-xl font-bold">{team.name}</h2>
        <p className="text-sm text-gray-500">{team.nameZh}</p>
        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-400">
          <span>{t('Group')} {team.group}</span>
          <span>•</span>
          <span>FIFA #{team.ranking}</span>
          <span>•</span>
          <span>{team.continent}</span>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {t('Fixtures')}
        </h3>
        <div className="space-y-2">
          {teamMatches.length > 0
            ? teamMatches.map(m => <MatchCard key={m.id} match={m} />)
            : <p className="text-center text-gray-400 text-sm py-4">{t('No matches found')}</p>
          }
        </div>
      </div>
    </div>
  )
}
