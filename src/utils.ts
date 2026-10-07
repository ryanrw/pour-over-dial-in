export function uid(): string {
  // randomUUID is unavailable on plain-http origins (e.g. testing on a phone over LAN)
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

export function parseNum(value: string): number | null {
  const n = parseFloat(value.replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export function numToStr(n: number | null | undefined): string {
  return n == null ? '' : String(n)
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10
}

/** Turns "245" into "2:45" and "2:5" into "2:05"; leaves anything else as typed. */
export function normalizeTime(value: string): string {
  const v = value.trim()
  const withColon = v.match(/^(\d{1,2})[:.](\d{1,2})$/)
  if (withColon) return `${Number(withColon[1])}:${withColon[2].padStart(2, '0')}`
  if (/^\d{1,4}$/.test(v)) {
    const secs = v.slice(-2)
    const mins = v.length > 2 ? Number(v.slice(0, -2)) : 0
    return `${mins}:${secs.padStart(2, '0')}`
  }
  return v
}

const dateFmt = new Intl.DateTimeFormat('th-TH', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const dayFmt = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short' })

export const formatDateTime = (ts: number) => dateFmt.format(ts)
export const formatDay = (ts: number) => dayFmt.format(ts)
