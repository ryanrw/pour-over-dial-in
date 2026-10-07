import { useI18n } from '../i18n'
import type { Platform } from '../install'
import { AddSquareIcon, MoreIcon, ShareIcon } from './Icons'
import { Modal } from './Modal'

interface Props {
  platform: Platform
  canPrompt: boolean
  onInstall: () => void
  onClose: () => void
}

const b = (s: string) => <b>{s}</b>

export function InstallPrompt({ platform, canPrompt, onInstall, onClose }: Props) {
  const { t } = useI18n()
  const i = t.install

  return (
    <Modal
      title={i.title}
      onClose={onClose}
      footer={
        canPrompt ? (
          <div className="install-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              {i.later}
            </button>
            <button type="button" className="btn primary" onClick={onInstall}>
              {i.install}
            </button>
          </div>
        ) : (
          <button type="button" className="btn primary block" onClick={onClose}>
            {i.gotIt}
          </button>
        )
      }
    >
      <div className="install">
        <div className="install-hero">
          <img src="/icon-192.png" alt="" width={64} height={64} />
          <div>
            <strong>{t.appName}</strong>
            <p>{i.pitch}</p>
          </div>
        </div>

        {canPrompt ? null : platform === 'ios' ? (
          <ol className="install-steps">
            <li>
              <span className="install-step-icon">
                <ShareIcon />
              </span>
              <span>
                {i.iosShare(b)}
                <small>{i.iosShareHint}</small>
              </span>
            </li>
            <li>
              <span className="install-step-icon">
                <AddSquareIcon />
              </span>
              <span>
                {i.iosAdd(b)}
                <small>{i.iosAddHint}</small>
              </span>
            </li>
            <li>
              <span className="install-step-icon text">{i.iosConfirmIcon}</span>
              <span>{i.iosConfirm(b)}</span>
            </li>
          </ol>
        ) : (
          <ol className="install-steps">
            <li>
              <span className="install-step-icon">
                <MoreIcon />
              </span>
              <span>{i.androidMenu(b)}</span>
            </li>
            <li>
              <span className="install-step-icon">
                <AddSquareIcon />
              </span>
              <span>{i.androidAdd(b)}</span>
            </li>
          </ol>
        )}
      </div>
    </Modal>
  )
}
