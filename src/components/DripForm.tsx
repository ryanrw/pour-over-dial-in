import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n'
import { SCORE_KEYS, type DripInput, type Scores } from '../types'
import { normalizeTime, numToStr, parseNum, round1 } from '../utils'
import { Field, ScoreInput, Switch, TextArea } from './Fields'

interface Props {
  id: string
  initial: DripInput
  /** "next time try..." note from the previous brew, shown as a reminder */
  previousAdjustment?: string
  onSubmit: (input: DripInput) => void
}

const calcWater = (dose: string, ratio: string): number | null => {
  const d = parseNum(dose)
  const r = parseNum(ratio)
  return d != null && r != null ? round1(d * r) : null
}

export function DripForm({ id, initial, previousAdjustment, onSubmit }: Props) {
  const { t, en, lang } = useI18n()
  const [dose, setDose] = useState(numToStr(initial.dose))
  const [ratio, setRatio] = useState(numToStr(initial.ratio))
  const [water, setWater] = useState(numToStr(initial.water))
  // water follows dose × ratio until the user types their own value
  const [waterAuto, setWaterAuto] = useState(
    initial.water == null || initial.water === calcWater(numToStr(initial.dose), numToStr(initial.ratio)),
  )
  const [grind, setGrind] = useState(initial.grind)
  const [temp, setTemp] = useState(numToStr(initial.temp))
  const [recipe, setRecipe] = useState(initial.recipe)
  const [finishTime, setFinishTime] = useState(initial.finishTime)
  const [scores, setScores] = useState<Scores>(initial.scores)
  const [dry, setDry] = useState(initial.dry)
  const [comment, setComment] = useState(initial.comment)
  const [adjustment, setAdjustment] = useState(initial.adjustment)

  const computed = calcWater(dose, ratio)

  const changeDoseOrRatio = (nextDose: string, nextRatio: string) => {
    setDose(nextDose)
    setRatio(nextRatio)
    if (waterAuto) setWater(numToStr(calcWater(nextDose, nextRatio)))
  }

  const changeWater = (value: string) => {
    setWater(value)
    setWaterAuto(false)
  }

  const resetWater = () => {
    setWater(numToStr(computed))
    setWaterAuto(true)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      dose: parseNum(dose),
      ratio: parseNum(ratio),
      water: parseNum(water),
      grind: grind.trim(),
      temp: parseNum(temp),
      recipe: recipe.trim(),
      finishTime: normalizeTime(finishTime),
      scores,
      dry,
      comment: comment.trim(),
      adjustment: adjustment.trim(),
    })
  }

  return (
    <form id={id} className="form-stack" onSubmit={submit}>
      {previousAdjustment && (
        <div className="reminder">
          <span className="reminder-label">{t.lastTimeAdjust}</span>
          <p>{previousAdjustment}</p>
        </div>
      )}

      <div className="form-grid">
        <Field
          label={t.dose}
          value={dose}
          onChange={(v) => changeDoseOrRatio(v, ratio)}
          inputMode="decimal"
          suffix="g"
        />
        <Field
          label={t.ratio}
          value={ratio}
          onChange={(v) => changeDoseOrRatio(dose, v)}
          inputMode="decimal"
          prefix="1 :"
        />
        <Field
          label={t.water}
          value={water}
          onChange={changeWater}
          inputMode="decimal"
          suffix="g"
          hint={
            !waterAuto && computed != null && parseNum(water) !== computed ? (
              <button type="button" className="link-btn" onClick={resetWater}>
                {t.useComputedWater(computed)}
              </button>
            ) : null
          }
        />
        <Field
          label={t.grind}
          value={grind}
          onChange={setGrind}
          inputMode="decimal"
          placeholder={t.grindPlaceholder}
        />
        <Field
          label={t.temp}
          value={temp}
          onChange={setTemp}
          inputMode="decimal"
          suffix="°C"
        />
        <Field
          label={t.finishTime}
          value={finishTime}
          onChange={setFinishTime}
          onBlur={() => setFinishTime(normalizeTime(finishTime))}
          inputMode="numeric"
          placeholder="2:45"
        />
      </div>

      <TextArea
        label={t.recipe}
        value={recipe}
        onChange={setRecipe}
        placeholder={t.recipePlaceholder}
      />

      <section className="form-section">
        <h3>{t.evaluation}</h3>
        <div className="score-list">
          {SCORE_KEYS.map((key) => (
            <ScoreInput
              key={key}
              label={t.scores[key]}
              sublabel={lang === 'th' ? en.scores[key] : undefined}
              value={scores[key]}
              onChange={(v) => setScores((s) => ({ ...s, [key]: v }))}
            />
          ))}
          <Switch label={t.dry} checked={dry} onChange={setDry} />
        </div>
      </section>

      <TextArea
        label={t.comment}
        value={comment}
        onChange={setComment}
        placeholder={t.commentPlaceholder}
      />
      <TextArea
        label={t.adjustment}
        value={adjustment}
        onChange={setAdjustment}
        placeholder={t.adjustmentPlaceholder}
      />
    </form>
  )
}
