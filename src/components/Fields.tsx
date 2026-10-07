import type { InputHTMLAttributes, ReactNode } from 'react'
import { useI18n } from '../i18n'

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'prefix'> {
  label: string
  value: string
  onChange: (value: string) => void
  prefix?: ReactNode
  suffix?: ReactNode
  hint?: ReactNode
}

export function Field({ label, value, onChange, prefix, suffix, hint, ...rest }: FieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="input-wrap">
        {prefix && <span className="affix">{prefix}</span>}
        <input value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
        {suffix && <span className="affix">{suffix}</span>}
      </span>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

interface TextAreaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function TextArea({ label, value, onChange, placeholder, rows = 3 }: TextAreaProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

interface SwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Switch({ label, checked, onChange }: SwitchProps) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="switch-row"
      onClick={() => onChange(!checked)}
    >
      <span className="switch-label">{label}</span>
      <span className="switch-state">{checked ? t.yes : t.no}</span>
      <span className={`switch ${checked ? 'on' : ''}`}>
        <span className="switch-thumb" />
      </span>
    </button>
  )
}

interface ScoreInputProps {
  label: string
  sublabel?: string
  value: number | null
  onChange: (value: number | null) => void
}

export function ScoreInput({ label, sublabel, value, onChange }: ScoreInputProps) {
  return (
    <div className="score-input" role="radiogroup" aria-label={label}>
      <div className="score-input-label">
        {label}
        {sublabel && <small>{sublabel}</small>}
      </div>
      <div className="score-buttons">
        {[0, 1, 2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            className={value === n ? 'active' : ''}
            // tapping the selected value again clears it
            onClick={() => onChange(value === n ? null : n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
