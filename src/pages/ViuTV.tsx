import { useViuTVMatches } from '../hooks/useData'
import { TeamBadge } from '../components/TeamBadge'
import { ViuTVBadge } from '../components/ViuTVBadge'
import { CountdownTimer } from '../components/CountdownTimer'
import { stadiums } from '../data/stadiums'
import { useT, useLang } from '../i18n/LanguageContext'

function matchTypeLabel(stage: string, group: string | undefined, t: (k: string) => string, lang: 'en' | 'zh'): string {
  if (stage === 'group') {
    return `${t('Group Stage')} ${group}${lang === 'zh' ? '組' : ''}`
  }
  const labels: Record<string, string> = {
    r32: t('Round of 32'),
    r16: t('Round of 16'),
    qf: t('Quarter-final'),
    sf: t('Semi-final'),
    third: t('Third Place'),
    final: t('Final'),
  }
  return labels[stage] || stage
}

export function ViuTV() {
  const t = useT()
  const lang = useLang()
  const matches = useViuTVMatches()

  const grouped = matches.reduce<Record<string, typeof matches>>((acc, m) => {
    if (!acc[m.hkDate]) acc[m.hkDate] = []
    acc[m.hkDate].push(m)
    return acc
  }, {})

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 17.25c-1.5 1.5-3.75 2-6 2H6.5c-2.25 0-4.5-.5-6-2L0 12l.5-5.25c1.5-1.5 3.75-2 6-2h11c2.25 0 4.5.5 6 2L24 12l-.5 5.25zM10 8.5v7l6-3.5-6-3.5z"/>
          </svg>
          <h2 className="text-lg font-bold">{t('ViuTV Free Broadcast')}</h2>
        </div>
        <p className="text-red-200 text-sm">{t('25 matches free on ViuTV 99台')}</p>
        <p className="text-red-300 text-xs mt-1">{t('All times in Hong Kong Time (HKT)')}</p>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        {t('ViuTV 99台 will broadcast 25 selected matches for free including the opening match, both semi-finals and the final. All times below are in HKT (UTC+8).')}
      </p>

      {Object.entries(grouped).map(([date, ms]) => {
        const d = new Date(date + 'T00:00:00')
        const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()]
        const days = ['日','一','二','三','四','五','六']
        const dayCn = days[d.getDay()]

        return (
          <div key={date}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {dayName} {date.slice(5)} (星期{dayCn})
            </h3>
            <div className="space-y-2">
              {ms.map(m => (
                <div key={m.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">{matchTypeLabel(m.stage, m.group, t, lang)}</span>
                    <ViuTVBadge size="sm" />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex-1 text-right">
                      <TeamBadge teamId={m.team1Id} />
                    </div>
                    <div className="text-center min-w-[80px]">
                      <span className="text-lg font-bold text-red-500">{m.hkTime}</span>
                      <p className="text-xs text-gray-400">HKT</p>
                    </div>
                    <div className="flex-1 text-left">
                      <TeamBadge teamId={m.team2Id} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{stadiums.find(s => s.id === m.groundId)?.name ?? m.groundId}</span>
                    <CountdownTimer target={`${date}T${m.hkTime}:00+08:00`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
