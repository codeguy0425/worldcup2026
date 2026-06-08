import { useParams, Link } from 'react-router-dom'
import { useMatchById } from '../hooks/useData'
import { TeamBadge } from '../components/TeamBadge'
import { ViuTVBadge } from '../components/ViuTVBadge'
import { hkDisplay } from '../utils/hkTime'
import { stadiums } from '../data/stadiums'
import { useT, useLang } from '../i18n/LanguageContext'

export function MatchDetail() {
  const t = useT()
  const lang = useLang()
  const { id } = useParams()
  const match = useMatchById(Number(id))

  if (!match) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{t('No matches found')}</p>
        <Link to="/fixtures" className="text-blue-500 text-sm mt-2 inline-block">&larr; {t('Fixtures')}</Link>
      </div>
    )
  }

  const stadium = stadiums.find(s => s.id === match.groundId)
  const stageLabel = match.stage === 'group' && match.group
    ? `${t('Group Stage')} ${match.group.replace('Group ', '')}${lang === 'zh' ? '組' : ''}`
    : t(match.stage === 'r32' ? 'Round of 32'
      : match.stage === 'r16' ? 'Round of 16'
      : match.stage === 'qf' ? 'Quarter-final'
      : match.stage === 'sf' ? 'Semi-final'
      : match.stage === 'third' ? 'Third Place'
      : 'Final')

  return (
    <div className="space-y-4">
      <Link to="/fixtures" className="text-sm text-blue-500 inline-block">&larr; {t('Fixtures')}</Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{stageLabel}</p>

        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex flex-col items-center gap-2">
            <TeamBadge teamId={match.team1Id} size="lg" />
            <span className="text-3xl font-bold tabular-nums">
              {match.score1 ?? '–'}
            </span>
          </div>
          <span className="text-gray-300 text-sm font-medium">{t('VS')}</span>
          <div className="flex flex-col items-center gap-2">
            <TeamBadge teamId={match.team2Id} size="lg" />
            <span className="text-3xl font-bold tabular-nums">
              {match.score2 ?? '–'}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500">{hkDisplay(match.date, match.time)}</p>
        <p className="text-xs text-gray-400">{match.date} {match.timeUtc} {t('UTC')}</p>

        {match.viutv && (
          <div className="mt-3 flex justify-center">
            <ViuTVBadge size="md" />
          </div>
        )}
      </div>

      {stadium && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('Venue')}</h3>
          <p className="font-medium">{stadium.name}</p>
          <p className="text-sm text-gray-500">{stadium.city}, {stadium.country}</p>
          <p className="text-xs text-gray-400">{t('Capacity')}: {stadium.capacity.toLocaleString()}</p>
        </div>
      )}
    </div>
  )
}
