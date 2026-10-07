import { SCORE_KEYS, SCORE_LABELS, type Drip } from '../types'
import { formatDateTime } from '../utils'
import { CopyIcon, EditIcon, TrashIcon } from './Icons'

interface Props {
  drip: Drip
  index: number
  /** the brew right before this one, to highlight what was changed */
  previous?: Drip
  isLatest: boolean
  onEdit: () => void
  onUseAsBase: () => void
  onDelete: () => void
}

interface Param {
  key: keyof Drip
  label: string
  value: string
}

function params(d: Drip): Param[] {
  const list: Param[] = [
    { key: 'dose', label: 'กาแฟ', value: d.dose != null ? `${d.dose}g` : '' },
    { key: 'ratio', label: 'ratio', value: d.ratio != null ? `1:${d.ratio}` : '' },
    { key: 'water', label: 'น้ำ', value: d.water != null ? `${d.water}g` : '' },
    { key: 'grind', label: 'บด', value: d.grind },
    { key: 'temp', label: 'temp', value: d.temp != null ? `${d.temp}°C` : '' },
    { key: 'finishTime', label: 'เวลา', value: d.finishTime },
  ]
  return list.filter((p) => p.value)
}

export function DripCard({ drip, index, previous, isLatest, onEdit, onUseAsBase, onDelete }: Props) {
  const hasScores = SCORE_KEYS.some((k) => drip.scores[k] != null)
  const recipeChanged = previous != null && previous.recipe !== drip.recipe

  return (
    <article className="drip-card">
      <header className="drip-header">
        <div>
          <span className="drip-index">#{index}</span>
          <time className="drip-time">{formatDateTime(drip.createdAt)}</time>
        </div>
        <div className="drip-actions">
          {!isLatest && (
            <button type="button" className="icon-btn sm" onClick={onUseAsBase} title="ใช้เป็นฐานของโน้ตใหม่">
              <CopyIcon />
            </button>
          )}
          <button type="button" className="icon-btn sm" onClick={onEdit} aria-label="แก้ไข">
            <EditIcon />
          </button>
          <button type="button" className="icon-btn sm danger" onClick={onDelete} aria-label="ลบ">
            <TrashIcon />
          </button>
        </div>
      </header>

      <div className="chips">
        {params(drip).map((p) => (
          <span
            key={p.key}
            className={`chip ${previous && previous[p.key] !== drip[p.key] ? 'changed' : ''}`}
          >
            <small>{p.label}</small>
            {p.value}
          </span>
        ))}
      </div>

      {drip.recipe && (
        <p className={`drip-recipe ${recipeChanged ? 'changed' : ''}`}>{drip.recipe}</p>
      )}

      {(hasScores || drip.dry) && (
        <div className="score-tiles">
          {SCORE_KEYS.map((k) => {
            const v = drip.scores[k]
            return (
              <div key={k} className="score-tile">
                <span className="score-value">{v ?? '–'}</span>
                <span className="score-label">{SCORE_LABELS[k].th}</span>
                <span className="score-bar">
                  <span style={{ width: `${((v ?? 0) / 4) * 100}%` }} />
                </span>
              </div>
            )
          })}
          <div className={`score-tile dry ${drip.dry ? 'is-dry' : ''}`}>
            <span className="score-value">{drip.dry ? 'Yes' : 'No'}</span>
            <span className="score-label">Dry</span>
          </div>
        </div>
      )}

      {drip.comment && (
        <div className="note">
          <span className="note-label">Comment</span>
          <p>{drip.comment}</p>
        </div>
      )}
      {drip.adjustment && (
        <div className="note adjust">
          <span className="note-label">แนวทางปรับ</span>
          <p>{drip.adjustment}</p>
        </div>
      )}
    </article>
  )
}
