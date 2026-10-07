import { LANGS, useI18n } from '../i18n'

export function LangSwitch() {
  const { lang, setLang, t } = useI18n()
  return (
    <div className="lang-switch" role="radiogroup" aria-label={t.language}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          role="radio"
          aria-checked={lang === l.code}
          className={lang === l.code ? 'active' : ''}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
