import type { Drip, Session } from '../types'
import { DripCard } from './DripCard'
import { EditIcon, PlusIcon, TrashIcon } from './Icons'

interface Props {
  session: Session
  /** oldest first */
  drips: Drip[]
  onEditSession: () => void
  onDeleteSession: () => void
  onNewDrip: (base?: Drip) => void
  onEditDrip: (drip: Drip) => void
  onDeleteDrip: (drip: Drip) => void
}

export function SessionView({
  session,
  drips,
  onEditSession,
  onDeleteSession,
  onNewDrip,
  onEditDrip,
  onDeleteDrip,
}: Props) {
  const details = [
    { label: 'ดริปเปอร์', value: session.dripper },
    { label: 'Grinder', value: session.grinder },
    { label: 'TDS น้ำ', value: session.waterTds != null ? `${session.waterTds} ppm` : '' },
  ]

  return (
    <div className="session-view">
      <header className="session-header">
        <div className="session-title-row">
          <h1>{session.coffee}</h1>
          <div className="session-actions">
            <button type="button" className="icon-btn" onClick={onEditSession} aria-label="แก้ไขกาแฟ">
              <EditIcon />
            </button>
            <button type="button" className="icon-btn danger" onClick={onDeleteSession} aria-label="ลบกาแฟ">
              <TrashIcon />
            </button>
          </div>
        </div>
        <dl className="session-details">
          {details.map((d) => (
            <div key={d.label}>
              <dt>{d.label}</dt>
              <dd>{d.value || '—'}</dd>
            </div>
          ))}
        </dl>
      </header>

      <button type="button" className="new-note" onClick={() => onNewDrip()}>
        <span className="new-note-icon">
          <PlusIcon width={22} height={22} />
        </span>
        New note
      </button>

      <div className="drip-list">
        {drips
          .map((drip, i) => (
            <DripCard
              key={drip.id}
              drip={drip}
              index={i + 1}
              previous={drips[i - 1]}
              isLatest={i === drips.length - 1}
              onEdit={() => onEditDrip(drip)}
              onUseAsBase={() => onNewDrip(drip)}
              onDelete={() => onDeleteDrip(drip)}
            />
          ))
          .reverse()}
      </div>

      {drips.length === 0 && (
        <p className="empty-hint">ยังไม่มีโน้ต กด New note เพื่อจดการดริปครั้งแรก</p>
      )}
    </div>
  )
}
