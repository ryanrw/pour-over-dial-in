import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n'
import type { Session, SessionInput } from '../types'
import { numToStr, parseNum } from '../utils'
import { Field } from './Fields'

interface Props {
  id: string
  initial: Partial<SessionInput>
  /** previous sessions, used for autocomplete suggestions */
  sessions: Session[]
  onSubmit: (input: SessionInput) => void
}

const unique = (values: string[]) => [...new Set(values.map((v) => v.trim()).filter(Boolean))]

export function SessionForm({ id, initial, sessions, onSubmit }: Props) {
  const { t } = useI18n()
  const [coffee, setCoffee] = useState(initial.coffee ?? '')
  const [dripper, setDripper] = useState(initial.dripper ?? '')
  const [grinder, setGrinder] = useState(initial.grinder ?? '')
  const [tds, setTds] = useState(numToStr(initial.waterTds))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!coffee.trim()) return
    onSubmit({
      coffee: coffee.trim(),
      dripper: dripper.trim(),
      grinder: grinder.trim(),
      waterTds: parseNum(tds),
    })
  }

  return (
    <form id={id} className="form-stack" onSubmit={submit}>
      <Field
        label={t.coffee}
        value={coffee}
        onChange={setCoffee}
        placeholder={t.coffeePlaceholder}
        required
        autoFocus={!initial.coffee}
      />
      <Field
        label={t.dripper}
        value={dripper}
        onChange={setDripper}
        placeholder={t.dripperPlaceholder}
        list="dl-drippers"
      />
      <Field
        label={t.grinder}
        value={grinder}
        onChange={setGrinder}
        placeholder={t.grinderPlaceholder}
        list="dl-grinders"
      />
      <Field
        label={t.waterTds}
        value={tds}
        onChange={setTds}
        inputMode="decimal"
        placeholder={t.tdsPlaceholder}
        suffix="ppm"
      />
      <datalist id="dl-drippers">
        {unique(sessions.map((s) => s.dripper)).map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
      <datalist id="dl-grinders">
        {unique(sessions.map((s) => s.grinder)).map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
    </form>
  )
}
