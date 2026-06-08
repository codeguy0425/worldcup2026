import { Link } from 'react-router-dom'
import { useGroups, useStandings } from '../hooks/useData'
import { GroupMiniTable } from '../components/GroupMiniTable'
import { useT } from '../i18n/LanguageContext'

function GroupCard({ groupId }: { groupId: string }) {
  const g = useGroups().find(x => x.id === groupId)!
  const standings = useStandings(groupId)
  return (
    <Link
      to={`/groups/${groupId}`}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-transform overflow-hidden"
    >
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{g.name} {g.nameZh}</h3>
        </div>
      </div>
      <GroupMiniTable standings={standings} />
    </Link>
  )
}

export function Groups() {
  const t = useT()
  const groups = useGroups()

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('Groups')}</h2>
      <div className="grid gap-3">
        {groups.map(g => (
          <GroupCard key={g.id} groupId={g.id} />
        ))}
      </div>
    </div>
  )
}
