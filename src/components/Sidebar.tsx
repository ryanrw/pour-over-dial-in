import { useRef, type ChangeEvent } from 'react'
import { buildBackup, parseBackup, restoreBackup } from '../backup'
import { usePhotoUrl } from '../photos'
import { beanDetails, sessionTitle, type AppData, type Session } from '../types'
import { useI18n } from '../i18n'
import { CloseIcon, DownloadIcon, DripperIcon, PhoneIcon, PlusIcon, UploadIcon } from './Icons'
import { LangSwitch } from './LangSwitch'

interface Props {
  open: boolean
  sessions: Session[]
  dripCounts: Map<string, number>
  currentId: string | null
  data: AppData
  onSelect: (id: string) => void
  onNew: () => void
  onClose: () => void
  onImport: (data: AppData) => void
  /** shown only when the app can be added to the home screen */
  onInstallApp?: () => void
}

export function Sidebar({
  open,
  sessions,
  dripCounts,
  currentId,
  data,
  onSelect,
  onNew,
  onClose,
  onImport,
  onInstallApp,
}: Props) {
  const { t, formatDay } = useI18n()
  const fileRef = useRef<HTMLInputElement>(null)

  const exportData = async () => {
    const blob = new Blob([await buildBackup(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dial-in-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const backup = parseBackup(await file.text())
    if (!backup) {
      alert(t.invalidFile)
      return
    }
    if (confirm(t.confirmImport(backup.sessions.length, backup.drips.length))) {
      onImport(await restoreBackup(backup))
    }
  }

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label={t.coffees}>
        <div className="sidebar-header">
          <div className="brand">
            <DripperIcon width={22} height={22} />
            <span>Dial-in</span>
          </div>
          <button type="button" className="icon-btn sidebar-close" onClick={onClose} aria-label={t.close}>
            <CloseIcon />
          </button>
        </div>

        <button type="button" className="btn primary block" onClick={onNew}>
          <PlusIcon /> {t.newCoffee}
        </button>

        <nav className="session-list">
          {sessions.map((s) => (
            <SessionItem
              key={s.id}
              session={s}
              active={s.id === currentId}
              foot={[t.brews(dripCounts.get(s.id) ?? 0), formatDay(s.createdAt)]}
              onSelect={() => onSelect(s.id)}
            />
          ))}
        </nav>

        <div className="sidebar-footer">
          {onInstallApp && (
            <button type="button" className="btn ghost sm block" onClick={onInstallApp}>
              <PhoneIcon width={16} height={16} /> {t.addToHome}
            </button>
          )}
          <p>{t.storageNote}</p>
          <div className="sidebar-footer-actions">
            <button type="button" className="btn ghost sm" onClick={exportData}>
              <DownloadIcon width={16} height={16} /> Export
            </button>
            <button type="button" className="btn ghost sm" onClick={() => fileRef.current?.click()}>
              <UploadIcon width={16} height={16} /> Import
            </button>
          </div>
          <LangSwitch />
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importData} />
        </div>
      </aside>
    </>
  )
}

interface SessionItemProps {
  session: Session
  active: boolean
  foot: [string, string]
  onSelect: () => void
}

function SessionItem({ session, active, foot, onSelect }: SessionItemProps) {
  const photoUrl = usePhotoUrl(session.photoId)
  const meta = beanDetails(session) || [session.dripper, session.grinder].filter(Boolean).join(' · ')

  return (
    <button type="button" className={`session-item ${active ? 'active' : ''}`} onClick={onSelect}>
      {photoUrl && <img className="session-item-photo" src={photoUrl} alt="" />}
      <span className="session-item-text">
        <span className="session-item-title">{sessionTitle(session)}</span>
        <span className="session-item-meta">{meta || '—'}</span>
        <span className="session-item-foot">
          <span>{foot[0]}</span>
          <span>{foot[1]}</span>
        </span>
      </span>
    </button>
  )
}
