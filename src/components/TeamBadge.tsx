import { teams, teamByName } from '../data/teams'
import { getLang } from '../i18n'

export function TeamBadge({ teamId, size = 'md' }: { teamId: string; size?: 'sm' | 'md' | 'lg' }) {
  const team = teams.find(t => t.id === teamId) || teamByName.get(teamId)
  if (!team) {
    return <span className="text-gray-400 text-sm">{teamId}</span>
  }
  const sizeClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'
  const flagSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
  const name = getLang() === 'zh' ? team.nameZh : team.name

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${sizeClass}`}>
      <span className={flagSize}>{team.flag}</span>
      <span>{name}</span>
    </span>
  )
}
