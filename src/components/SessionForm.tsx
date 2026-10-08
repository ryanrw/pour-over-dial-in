import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n'
import type { Session, SessionInput } from '../types'
import { numToStr, parseNum } from '../utils'
import { Field } from './Fields'
import { PhotoPicker } from './PhotoPicker'

interface Props {
  id: string
  initial: Partial<SessionInput>
  /** previous sessions, used for autocomplete suggestions */
  sessions: Session[]
  /** photo is a new image to store, null to remove it, undefined to keep the current one */
  onSubmit: (input: SessionInput, photo: Blob | null | undefined) => void
}

const COMMON_PROCESSES = ['Washed', 'Natural', 'Honey', 'Anaerobic', 'Carbonic Maceration']

const unique = (values: string[]) => [...new Set(values.map((v) => v.trim()).filter(Boolean))]

export function SessionForm({ id, initial, sessions, onSubmit }: Props) {
  const { t } = useI18n()
  const [coffee, setCoffee] = useState(initial.coffee ?? '')
  const [origin, setOrigin] = useState(initial.origin ?? '')
  const [farm, setFarm] = useState(initial.farm ?? '')
  const [variety, setVariety] = useState(initial.variety ?? '')
  const [process, setProcess] = useState(initial.process ?? '')
  const [dripper, setDripper] = useState(initial.dripper ?? '')
  const [grinder, setGrinder] = useState(initial.grinder ?? '')
  const [tds, setTds] = useState(numToStr(initial.waterTds))
  const [photo, setPhoto] = useState<Blob | null | undefined>(undefined)

  // a name isn't needed when origin or farm already identify the coffee
  const nameRequired = !origin.trim() && !farm.trim()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (nameRequired && !coffee.trim()) return
    onSubmit(
      {
        coffee: coffee.trim(),
        origin: origin.trim(),
        farm: farm.trim(),
        variety: variety.trim(),
        process: process.trim(),
        photoId: initial.photoId ?? null,
        dripper: dripper.trim(),
        grinder: grinder.trim(),
        waterTds: parseNum(tds),
      },
      photo,
    )
  }

  const suggestions = (pick: (s: Session) => string, extra: string[] = []) =>
    unique([...sessions.map(pick), ...extra]).map((v) => <option key={v} value={v} />)

  return (
    <form id={id} className="form-stack" onSubmit={submit}>
      <PhotoPicker storedId={initial.photoId ?? null} value={photo} onChange={setPhoto} />

      <Field
        label={t.coffeeName}
        value={coffee}
        onChange={setCoffee}
        placeholder={t.coffeeNamePlaceholder}
        required={nameRequired}
      />
      <div className="form-grid">
        <Field
          label={t.origin}
          value={origin}
          onChange={setOrigin}
          placeholder={t.originPlaceholder}
          list="dl-origins"
        />
        <Field label={t.farm} value={farm} onChange={setFarm} placeholder={t.farmPlaceholder} />
        <Field
          label={t.variety}
          value={variety}
          onChange={setVariety}
          placeholder={t.varietyPlaceholder}
          list="dl-varieties"
        />
        <Field
          label={t.process}
          value={process}
          onChange={setProcess}
          placeholder={t.processPlaceholder}
          list="dl-processes"
        />
      </div>

      <section className="form-section">
        <h3>{t.setupSection}</h3>
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
      </section>

      <datalist id="dl-origins">{suggestions((s) => s.origin)}</datalist>
      <datalist id="dl-varieties">{suggestions((s) => s.variety)}</datalist>
      <datalist id="dl-processes">{suggestions((s) => s.process, COMMON_PROCESSES)}</datalist>
      <datalist id="dl-drippers">{suggestions((s) => s.dripper)}</datalist>
      <datalist id="dl-grinders">{suggestions((s) => s.grinder)}</datalist>
    </form>
  )
}
