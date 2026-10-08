import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useI18n } from '../i18n'
import { resizeImage, usePhotoUrl } from '../photos'
import { CameraIcon } from './Icons'

interface Props {
  /** photo already saved for this coffee */
  storedId: string | null
  /** pending change: new image, null = removed, undefined = unchanged */
  value: Blob | null | undefined
  onChange: (value: Blob | null | undefined) => void
}

export function PhotoPicker({ storedId, value, onChange }: Props) {
  const { t } = useI18n()
  const inputRef = useRef<HTMLInputElement>(null)
  const storedUrl = usePhotoUrl(storedId)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // revoke the previous preview when it's replaced, and on unmount
  useEffect(() => {
    if (!pendingUrl) return
    return () => URL.revokeObjectURL(pendingUrl)
  }, [pendingUrl])

  const shownUrl = value === undefined ? storedUrl : value === null ? null : pendingUrl

  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const blob = await resizeImage(file)
      setPendingUrl(URL.createObjectURL(blob))
      onChange(blob)
    } catch {
      alert(t.photoFailed)
    } finally {
      setBusy(false)
    }
  }

  const open = () => inputRef.current?.click()

  return (
    <div className="photo-picker">
      {/* no `capture` attribute, so phones offer both camera and photo library */}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={pick} />
      {shownUrl ? (
        <div className="photo-preview">
          <img src={shownUrl} alt="" />
          <div className="photo-actions">
            <button type="button" className="btn sm photo-btn" onClick={open} disabled={busy}>
              {t.changePhoto}
            </button>
            <button type="button" className="btn sm photo-btn" onClick={() => onChange(null)}>
              {t.removePhoto}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="photo-empty" onClick={open} disabled={busy}>
          <CameraIcon width={26} height={26} />
          <span>{busy ? '…' : t.addPhoto}</span>
          <small>{t.optional}</small>
        </button>
      )}
    </div>
  )
}
