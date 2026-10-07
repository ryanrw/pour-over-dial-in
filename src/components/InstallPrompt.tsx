import type { Platform } from '../install'
import { AddSquareIcon, MoreIcon, ShareIcon } from './Icons'
import { Modal } from './Modal'

interface Props {
  platform: Platform
  canPrompt: boolean
  onInstall: () => void
  onClose: () => void
}

export function InstallPrompt({ platform, canPrompt, onInstall, onClose }: Props) {
  return (
    <Modal
      title="เพิ่มลงหน้าโฮม"
      onClose={onClose}
      footer={
        canPrompt ? (
          <div className="install-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              ไว้ทีหลัง
            </button>
            <button type="button" className="btn primary" onClick={onInstall}>
              ติดตั้ง
            </button>
          </div>
        ) : (
          <button type="button" className="btn primary block" onClick={onClose}>
            เข้าใจแล้ว
          </button>
        )
      }
    >
      <div className="install">
        <div className="install-hero">
          <img src="/icon-192.png" alt="" width={64} height={64} />
          <div>
            <strong>Pour-over Dial-in</strong>
            <p>เปิดจากหน้าโฮมได้ทันที เต็มจอเหมือนแอป ไม่ต้องพิมพ์ลิงก์</p>
          </div>
        </div>

        {canPrompt ? null : platform === 'ios' ? (
          <ol className="install-steps">
            <li>
              <span className="install-step-icon">
                <ShareIcon />
              </span>
              <span>
                แตะปุ่ม <b>แชร์</b> ใน Safari
                <small>ถ้าไม่เห็น ให้แตะ ⋯ ก่อน</small>
              </span>
            </li>
            <li>
              <span className="install-step-icon">
                <AddSquareIcon />
              </span>
              <span>
                เลือก <b>เพิ่มไปยังหน้าจอโฮม</b>
                <small>Add to Home Screen · อาจต้องเลื่อนลงไปหา</small>
              </span>
            </li>
            <li>
              <span className="install-step-icon text">เพิ่ม</span>
              <span>
                แตะ <b>เพิ่ม</b> มุมขวาบน
              </span>
            </li>
          </ol>
        ) : (
          <ol className="install-steps">
            <li>
              <span className="install-step-icon">
                <MoreIcon />
              </span>
              <span>
                แตะเมนู <b>⋮</b> ของเบราว์เซอร์
              </span>
            </li>
            <li>
              <span className="install-step-icon">
                <AddSquareIcon />
              </span>
              <span>
                เลือก <b>ติดตั้งแอป</b> หรือ <b>เพิ่มลงในหน้าจอหลัก</b>
              </span>
            </li>
          </ol>
        )}
      </div>
    </Modal>
  )
}
