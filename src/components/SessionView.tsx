import { useI18n } from '../i18n'
import { useState } from 'react'
import { usePhotoUrl } from '../photos'
import { sessionSubtitle, sessionTitle, type Drip, type Session } from '../types'
import { DripCard } from './DripCard'
import { EditIcon, PlusIcon, TrashIcon } from './Icons'
import { Modal } from './Modal'

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
  const { t } = useI18n()
  const photoUrl = usePhotoUrl(session.photoId)
  const [photoOpen, setPhotoOpen] = useState(false)
  const beans = sessionSubtitle(session)
  const details = [
    { label: t.dripper, value: session.dripper },
    { label: t.grinder, value: session.grinder },
    { label: t.waterTds, value: session.waterTds != null ? `${session.waterTds} ppm` : '' },
  ]

  return (
    <div className="session-view">
      <header className="session-header">
        <div className="session-title-row">
          {photoUrl && (
            <button type="button" className="session-photo" onClick={() => setPhotoOpen(true)}>
              <img src={photoUrl} alt="" />
            </button>
          )}
          <div className="session-title">
            <h1>{sessionTitle(session)}</h1>
            {beans && <p className="session-beans">{beans}</p>}
          </div>
          <div className="session-actions">
            <button type="button" className="icon-btn" onClick={onEditSession} aria-label={t.editCoffee}>
              <EditIcon />
            </button>
            <button
              type="button"
              className="icon-btn danger"
              onClick={onDeleteSession}
              aria-label={t.deleteCoffee}
            >
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
        {t.newNote}
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

      {drips.length === 0 && <p className="empty-hint">{t.noNotes}</p>}

      {photoOpen && photoUrl && (
        <Modal title={sessionTitle(session)} onClose={() => setPhotoOpen(false)}>
          <img className="photo-full" src={photoUrl} alt="" />
        </Modal>
      )}
    </div>
  )
}
