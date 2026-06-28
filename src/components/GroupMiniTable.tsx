import type { GroupStanding } from '../types'
import { teamByName } from '../data/teams'
import { useT } from '../i18n/LanguageContext'

function StatusBadge({ status }: { status?: 'advanced' | 'eliminated' }) {
  if (!status) return null
  return (
    <span className={`inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-bold rounded ml-0.5 ${
      status === 'advanced'
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white'
    }`}>
      {status === 'advanced' ? 'A' : 'E'}
    </span>
  )
}

export function GroupMiniTable({ standings }: { standings: GroupStanding[] }) {
  const t = useT()
  return (
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
            <th className="text-left py-1.5 pl-3 w-5">#</th>
            <th className="text-left pr-2 w-full">{t('Team')}</th>
            <th className="text-center w-7 px-0.5">{t('PL')}</th>
            <th className="text-center w-7 px-0.5">{t('W')}</th>
            <th className="text-center w-7 px-0.5">{t('D')}</th>
            <th className="text-center w-7 px-0.5">{t('L')}</th>
            <th className="text-center w-8 px-0.5 font-bold">{t('PTS')}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const flag = teamByName.get(s.team)?.flag || ''
            return (
              <tr key={s.team} className={`border-b dark:border-gray-700/50 ${
                s.status === 'advanced' ? 'bg-green-50 dark:bg-green-900/10' :
                s.status === 'eliminated' ? 'bg-red-50 dark:bg-red-900/10 opacity-60' :
                i < 2 ? 'bg-green-50/50 dark:bg-green-900/5' : ''
              }`}>
                <td className="py-1.5 pl-3 w-5 text-gray-400">{i + 1}</td>
                <td className="pr-2 w-full">
                  <div className="flex items-center gap-1">
                    <span className="text-sm leading-none">{flag}</span>
                    <span className="truncate max-w-[70px] font-medium">{s.team}</span>
                    <StatusBadge status={s.status} />
                  </div>
                </td>
                <td className="text-center w-7 px-0.5">{s.played}</td>
                <td className="text-center w-7 px-0.5 text-green-600">{s.won}</td>
                <td className="text-center w-7 px-0.5 text-yellow-600">{s.drawn}</td>
                <td className="text-center w-7 px-0.5 text-red-500">{s.lost}</td>
                <td className="text-center w-8 px-0.5 font-bold">{s.pts}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
  )
}
