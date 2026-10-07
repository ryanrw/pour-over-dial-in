import { useRef, type ChangeEvent } from 'react'
import { isAppData } from '../store'
import type { AppData, Session } from '../types'
import { formatDay } from '../utils'
import { CloseIcon, DownloadIcon, DripperIcon, PhoneIcon, PlusIcon, UploadIcon } from './Icons'

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
  const fileRef = useRef<HTMLInputElement>(null)

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
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
    try {
      const parsed: unknown = JSON.parse(await file.text())
      if (!isAppData(parsed)) throw new Error('invalid')
      if (confirm(`นำเข้า ${parsed.sessions.length} กาแฟ / ${parsed.drips.length} โน้ต? ข้อมูลปัจจุบันจะถูกแทนที่`)) {
        onImport(parsed)
      }
    } catch {
      alert('ไฟล์ไม่ถูกต้อง')
    }
  }

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="รายการกาแฟ">
        <div className="sidebar-header">
          <div className="brand">
            <DripperIcon width={22} height={22} />
            <span>Dial-in</span>
          </div>
          <button type="button" className="icon-btn sidebar-close" onClick={onClose} aria-label="ปิด">
            <CloseIcon />
          </button>
        </div>

        <button type="button" className="btn primary block" onClick={onNew}>
          <PlusIcon /> กาแฟตัวใหม่
        </button>

        <nav className="session-list">
          {sessions.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`session-item ${s.id === currentId ? 'active' : ''}`}
              onClick={() => onSelect(s.id)}
            >
              <span className="session-item-title">{s.coffee}</span>
              <span className="session-item-meta">
                {[s.dripper, s.grinder].filter(Boolean).join(' · ') || '—'}
              </span>
              <span className="session-item-foot">
                <span>{dripCounts.get(s.id) ?? 0} ครั้ง</span>
                <span>{formatDay(s.createdAt)}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {onInstallApp && (
            <button type="button" className="btn ghost sm block" onClick={onInstallApp}>
              <PhoneIcon width={16} height={16} /> เพิ่มลงหน้าโฮม
            </button>
          )}
          <p>ข้อมูลเก็บไว้ในเครื่องนี้ · สำรองไว้เป็นไฟล์ได้</p>
          <div className="sidebar-footer-actions">
            <button type="button" className="btn ghost sm" onClick={exportData}>
              <DownloadIcon width={16} height={16} /> Export
            </button>
            <button type="button" className="btn ghost sm" onClick={() => fileRef.current?.click()}>
              <UploadIcon width={16} height={16} /> Import
            </button>
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importData} />
        </div>
      </aside>
    </>
  )
}
