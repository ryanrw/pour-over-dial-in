import { useEffect, useState, useSyncExternalStore } from 'react'

/** Chromium's install prompt event (not in the DOM typings). */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type Platform = 'ios' | 'android' | 'other'

const DISMISS_KEY = 'pour-over-dial-in:install-dismissed-at'
const DISMISS_DAYS = 7
const SHOW_DELAY_MS = 2000

// Captured at module load: Chrome may fire this before React has mounted.
let deferred: BeforeInstallPromptEvent | null = null
let installed = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault() // use our own popup instead of Chrome's mini-infobar
  deferred = e as BeforeInstallPromptEvent
  notify()
})

window.addEventListener('appinstalled', () => {
  deferred = null
  installed = true
  notify()
})

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

function detectPlatform(): Platform {
  const ua = navigator.userAgent
  // iPadOS reports itself as a Mac
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'other'
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function recentlyDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY))
    return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export function useInstall() {
  const canPrompt = useSyncExternalStore(subscribe, () => deferred != null)
  const justInstalled = useSyncExternalStore(subscribe, () => installed)
  const [platform] = useState(detectPlatform)
  const [standalone] = useState(isStandalone)
  const [open, setOpen] = useState(false)

  /** Whether installing is possible/meaningful on this device at all. */
  const available = !standalone && !justInstalled && (platform !== 'other' || canPrompt)

  // pop up once on phones after a short delay, unless dismissed recently
  useEffect(() => {
    if (!available || platform === 'other' || recentlyDismissed()) return
    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS)
    return () => clearTimeout(t)
  }, [available, platform])

  const dismiss = () => {
    setOpen(false)
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      // ignore
    }
  }

  const install = async () => {
    if (!deferred) return
    const event = deferred
    await event.prompt()
    const { outcome } = await event.userChoice
    // an event can only prompt once; Chrome fires a fresh one if it's still installable
    deferred = null
    notify()
    if (outcome === 'dismissed') dismiss()
    else setOpen(false)
  }

  return { platform, available, canPrompt, open: open && available, show: () => setOpen(true), dismiss, install }
}
