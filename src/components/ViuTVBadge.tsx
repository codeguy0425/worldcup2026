import { useT } from '../i18n/LanguageContext'

export function ViuTVBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const t = useT()
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'
  return (
    <span className={`inline-flex items-center gap-1 rounded font-bold text-white ${sizeClass}`}
      style={{ background: 'linear-gradient(135deg, #e63946, #ff6b6b)' }}>
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 17.25c-1.5 1.5-3.75 2-6 2H6.5c-2.25 0-4.5-.5-6-2L0 12l.5-5.25c1.5-1.5 3.75-2 6-2h11c2.25 0 4.5.5 6 2L24 12l-.5 5.25zM10 8.5v7l6-3.5-6-3.5z"/>
      </svg>
      ViuTV {t('Free')}
    </span>
  )
}
