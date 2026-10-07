import { useEffect, useState, type ReactNode } from 'react'
import { dicts, en, I18nContext, LOCALES, type I18n, type Lang } from '../i18n'

const STORAGE_KEY = 'pour-over-dial-in:lang'
const DEFAULT_LANG: Lang = 'en'

function loadLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'th') return saved
  } catch {
    // ignore
  }
  return DEFAULT_LANG
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }

  const locale = LOCALES[lang]
  const dateTime = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
  const day = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })

  const value: I18n = {
    lang,
    setLang,
    t: dicts[lang],
    en,
    formatDateTime: (ts) => dateTime.format(ts),
    formatDay: (ts) => day.format(ts),
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
