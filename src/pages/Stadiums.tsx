import { useStadiums } from '../hooks/useData'
import { useT, useLang } from '../i18n/LanguageContext'

export function StadiumsPage() {
  const t = useT()
  const lang = useLang()
  const stadiums = useStadiums()

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('Stadiums')}</h2>
      <div className="grid gap-3">
        {stadiums.map(s => (
          <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold">{s.name}</h3>
              <span className="text-xs text-gray-400">{s.capacity.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500">
              {lang === 'zh' ? s.cityZh : s.city}, {s.country}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {s.cityZh} · {s.nameZh}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
