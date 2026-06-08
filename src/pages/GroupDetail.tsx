import { useParams, Link } from 'react-router-dom'
import { useStandings, useGroupMatches } from '../hooks/useData'
import { GroupTable } from '../components/GroupTable'
import { MatchCard } from '../components/MatchCard'
import { groups } from '../data/groups'
import { TeamBadge } from '../components/TeamBadge'
import { useT } from '../i18n/LanguageContext'

export function GroupDetail() {
  const t = useT()
  const { id } = useParams<{ id: string }>()
  const groupId = id?.toUpperCase() || 'A'
  const standings = useStandings(groupId)
  const groupMatches = useGroupMatches(groupId)
  const groupInfo = groups.find(g => g.id === groupId)

  if (!groupInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{t('No matches found')}</p>
        <Link to="/groups" className="text-blue-500 text-sm mt-2 inline-block">&larr; {t('Groups')}</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Link to="/groups" className="text-sm text-blue-500 inline-block">&larr; {t('Groups')}</Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">{groupInfo.name} {groupInfo.nameZh}</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {groupInfo.teams.map(tid => (
            <TeamBadge key={tid} teamId={tid} size="sm" />
          ))}
        </div>

        {standings.length > 0 ? (
          <GroupTable standings={standings} />
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">
            <p>Standings will appear after matches begin</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {t('Fixtures')} &amp; {t('Results')}
        </h3>
        <div className="space-y-2">
          {groupMatches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      </div>
    </div>
  )
}
