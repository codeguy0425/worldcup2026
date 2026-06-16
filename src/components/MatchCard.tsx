import { Link } from 'react-router-dom'
import { TeamBadge } from './TeamBadge'
import { ViuTVBadge } from './ViuTVBadge'
import { utcToHkt } from '../utils/hkTime'
import { stadiums } from '../data/stadiums'
import { useT } from '../i18n/LanguageContext'
import type { Match } from '../types'

export function MatchCard({ match }: { match: Match }) {
  const t = useT()
  const { date: hkDate, time: hkTime } = match.timeUtc ? utcToHkt(match.timeUtc, match.date) : { date: match.date, time: match.time }
  const dateLabel = hkDate.slice(5)

  return (
    <Link to={`/match/${match.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 active:scale-[0.98] transition-transform">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>{dateLabel}</span>
          <span>{hkTime} HKT</span>
          {match.group && <span className="font-medium">{match.group}</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 text-right">
            <TeamBadge teamId={match.team1Id} size="md" />
          </div>
          <div className="flex items-center gap-2 min-w-[60px] justify-center">
            {match.score1 !== undefined ? (
              <span className="text-lg font-bold tabular-nums">
                {match.score1} – {match.score2}
              </span>
            ) : (
              <span className="text-xs text-gray-400 font-medium">{t('VS')}</span>
            )}
          </div>
          <div className="flex-1 text-left">
            <TeamBadge teamId={match.team2Id} size="md" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400 truncate">{stadiums.find(s => s.id === match.groundId)?.name ?? match.groundId}</span>
          {match.viutv && <ViuTVBadge size="sm" />}
        </div>
      </div>
    </Link>
  )
}
