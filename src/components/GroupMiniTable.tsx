import type { GroupStanding } from '../types'
import { teamByName } from '../data/teams'
import { useT } from '../i18n/LanguageContext'

export function GroupMiniTable({ standings }: { standings: GroupStanding[] }) {
  const t = useT()
  return (
    <div className="-mx-4">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
            <th className="text-left py-1.5 pl-4 w-5">#</th>
            <th className="text-left pr-2">{t('Team')}</th>
            <th className="text-center w-7 px-1">{t('PL')}</th>
            <th className="text-center w-7 px-1">{t('W')}</th>
            <th className="text-center w-7 px-1">{t('D')}</th>
            <th className="text-center w-7 px-1">{t('L')}</th>
            <th className="text-center w-8 px-1 font-bold">{t('PTS')}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const flag = teamByName.get(s.team)?.flag || ''
            return (
              <tr key={s.team} className={`border-b dark:border-gray-700/50 ${i < 2 ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                <td className="py-1.5 pl-4 w-5 text-gray-400">{i + 1}</td>
                <td className="pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm leading-none">{flag}</span>
                    <span className="truncate max-w-[100px] font-medium">{s.team}</span>
                  </div>
                </td>
                <td className="text-center w-7 px-1">{s.played}</td>
                <td className="text-center w-7 px-1 text-green-600">{s.won}</td>
                <td className="text-center w-7 px-1 text-yellow-600">{s.drawn}</td>
                <td className="text-center w-7 px-1 text-red-500">{s.lost}</td>
                <td className="text-center w-8 px-1 font-bold">{s.pts}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
