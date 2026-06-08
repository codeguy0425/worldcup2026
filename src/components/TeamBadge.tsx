import { teams, teamByName } from '../data/teams'
import { useLang } from '../i18n/LanguageContext'

export function TeamBadge({ teamId, size = 'md' }: { teamId: string; size?: 'sm' | 'md' | 'lg' }) {
  const lang = useLang()
  const team = teams.find(t => t.id === teamId) || teamByName.get(teamId)
  if (!team) {
    return <span className="text-gray-400 text-sm">{teamId}</span>
  }
  const sizeClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'
  const flagSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
  const name = lang === 'zh' ? team.nameZh : team.name

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${sizeClass}`}>
      <span className={flagSize}>{team.flag}</span>
      <span>{name}</span>
    </span>
  )
}
