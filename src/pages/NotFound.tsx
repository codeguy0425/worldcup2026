import { Link } from 'react-router-dom'
import { useT } from '../i18n/LanguageContext'

export function NotFound() {
  const t = useT()
  return (
    <div className="text-center py-16">
      <span className="text-6xl block mb-4">⚽</span>
      <h2 className="text-xl font-bold mb-2">{t('Page Not Found')}</h2>
      <p className="text-gray-400 text-sm mb-4">{t("This page doesn't exist")}</p>
      <Link to="/" className="text-blue-500 text-sm">{t('Back to Home')}</Link>
    </div>
  )
}
