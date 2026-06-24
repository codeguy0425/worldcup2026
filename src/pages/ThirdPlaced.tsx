import { useMemo } from 'react'
import { useGroups } from '../hooks/useData'
import { matches } from '../data/matches'
import { teamByName } from '../data/teams'
import { computeStandings } from '../utils/standings'
import { useT, useLang } from '../i18n/LanguageContext'

interface ThirdPlaceEntry {
  groupId: string
  groupName: string
  team: string
  teamZh: string
  flag: string
  played: number
  pts: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
}

export function ThirdPlaced() {
  const t = useT()
  const lang = useLang()
  const groupList = useGroups()

  const entries: ThirdPlaceEntry[] = useMemo(() => {
    const result: ThirdPlaceEntry[] = []
    for (const g of groupList) {
      const groupMatches = matches.filter(m => m.stage === 'group' && m.group === `Group ${g.id}`)
      const { standings } = computeStandings(`Group ${g.id}`, groupMatches)
      if (standings.length < 3) continue
      const third = standings[2]
      const teamInfo = teamByName.get(third.team)
      result.push({
        groupId: g.id,
        groupName: lang === 'zh' ? g.nameZh : g.name,
        team: third.team,
        teamZh: third.teamZh,
        flag: teamInfo?.flag || '',
        played: third.played,
        pts: third.pts,
        won: third.won,
        drawn: third.drawn,
        lost: third.lost,
        gf: third.gf,
        ga: third.ga,
        gd: third.gd,
      })
    }
    result.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts
      if (b.gd !== a.gd) return b.gd - a.gd
      if (b.gf !== a.gf) return b.gf - a.gf
      return a.team.localeCompare(b.team)
    })
    return result
  }, [groupList, lang])

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {t('Third-Placed Ranking')}
      </h2>
      <p className="text-xs text-gray-400">
        {t('Top 8 third-placed teams advance to Round of 32')}
      </p>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="text-left py-3 pl-4">#</th>
              <th className="text-left py-3 pr-2">{t('Team')}</th>
              <th className="text-center w-10 px-1">{t('Group')}</th>
              <th className="text-center w-7 px-0.5">{t('PL')}</th>
              <th className="text-center w-7 px-0.5">{t('W')}</th>
              <th className="text-center w-7 px-0.5">{t('D')}</th>
              <th className="text-center w-7 px-0.5">{t('L')}</th>
              <th className="text-center w-8 px-0.5">{t('GF')}</th>
              <th className="text-center w-8 px-0.5">{t('GA')}</th>
              <th className="text-center w-8 px-0.5">{t('GD')}</th>
              <th className="text-center w-8 px-0.5 font-bold">{t('PTS')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr
                key={e.groupId}
                className={`border-b dark:border-gray-700/50 ${
                  i < 8
                    ? 'bg-green-50 dark:bg-green-900/10'
                    : 'opacity-60'
                }`}
              >
                <td className="py-2.5 pl-4">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    i < 8
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {i + 1}
                  </span>
                </td>
                <td className="pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{e.flag}</span>
                    <span className="truncate max-w-[90px] font-medium">
                      {lang === 'zh' ? e.teamZh : e.team}
                    </span>
                    {i < 8 ? (
                      <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                        {t('Q')}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
                        {t('OUT')}
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-center w-10 px-1 font-mono text-xs text-gray-400">
                  {e.groupName}
                </td>
                <td className="text-center w-7 px-0.5">{e.played}</td>
                <td className="text-center w-7 px-0.5 text-green-600">{e.won}</td>
                <td className="text-center w-7 px-0.5 text-yellow-600">{e.drawn}</td>
                <td className="text-center w-7 px-0.5 text-red-500">{e.lost}</td>
                <td className="text-center w-8 px-0.5">{e.gf}</td>
                <td className="text-center w-8 px-0.5">{e.ga}</td>
                <td className="text-center w-8 px-0.5 font-mono">{e.gd > 0 ? '+' : ''}{e.gd}</td>
                <td className="text-center w-8 px-0.5 font-bold">{e.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          {t('Qualifying (top 8)')}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 inline-block"></span>
          {t('Currently out')}
        </span>
      </div>
    </div>
  )
}
