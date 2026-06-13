import type { GroupStanding } from '../types'
import { useT } from '../i18n/LanguageContext'

export function GroupTable({ standings }: { standings: GroupStanding[] }) {
  const t = useT()
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
            <th className="text-left py-2 pr-2">{t('Team')}</th>
            <th className="text-center w-8 px-1">{t('PL')}</th>
            <th className="text-center w-8 px-1">{t('W')}</th>
            <th className="text-center w-8 px-1">{t('D')}</th>
            <th className="text-center w-8 px-1">{t('L')}</th>
            <th className="text-center w-8 px-1">{t('GF')}</th>
            <th className="text-center w-8 px-1">{t('GA')}</th>
            <th className="text-center w-8 px-1">{t('GD')}</th>
            <th className="text-center w-8 px-1 font-bold">{t('PTS')}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr key={s.team} className={`border-b dark:border-gray-700/50 ${i < 2 ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
              <td className="py-2 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                  <span className="truncate max-w-[100px]">{s.team}</span>
                </div>
              </td>
              <td className="text-center w-8 px-1">{s.played}</td>
              <td className="text-center w-8 px-1 text-green-600">{s.won}</td>
              <td className="text-center w-8 px-1 text-yellow-600">{s.drawn}</td>
              <td className="text-center w-8 px-1 text-red-500">{s.lost}</td>
              <td className="text-center w-8 px-1">{s.gf}</td>
              <td className="text-center w-8 px-1">{s.ga}</td>
              <td className="text-center w-8 px-1 font-mono">{s.gd > 0 ? '+' : ''}{s.gd}</td>
              <td className="text-center w-8 px-1 font-bold">{s.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
