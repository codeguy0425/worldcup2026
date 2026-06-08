import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { zh, type Lang } from './index'

type TFunc = (key: string) => string

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: TFunc
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
    return stored === 'en' || stored === 'zh' ? stored : 'zh'
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'zh' ? 'en' : 'zh')
  }, [lang, setLang])

  const t: TFunc = useCallback((key: string) => {
    return lang === 'zh' ? (zh[key] || key) : key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang(): Lang {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx.lang
}

export function useT(): TFunc {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useT must be used within LanguageProvider')
  return ctx.t
}

export function useToggleLang(): () => void {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useToggleLang must be used within LanguageProvider')
  return ctx.toggleLang
}
