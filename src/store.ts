import { useCallback, useEffect, useState } from 'react'
import type { AppData, Drip, DripInput, Session, SessionInput } from './types'
import { uid } from './utils'

const STORAGE_KEY = 'pour-over-dial-in:v1'

const emptyData = (): AppData => ({ version: 1, sessions: [], drips: [] })

export function isAppData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false
  const v = value as Partial<AppData>
  return v.version === 1 && Array.isArray(v.sessions) && Array.isArray(v.drips)
}

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyData()
    const parsed: unknown = JSON.parse(raw)
    return isAppData(parsed) ? parsed : emptyData()
  } catch {
    return emptyData()
  }
}

function save(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // storage full or blocked; keep working in memory
  }
}

/** Most recent of the session's creation and its newest drip. */
export function lastActivity(session: Session, drips: Drip[]): number {
  return drips.reduce(
    (latest, d) => (d.sessionId === session.id && d.createdAt > latest ? d.createdAt : latest),
    session.createdAt,
  )
}

export function sortSessions(data: AppData): Session[] {
  return [...data.sessions].sort(
    (a, b) => lastActivity(b, data.drips) - lastActivity(a, data.drips),
  )
}

export function useAppData() {
  const [data, setData] = useState<AppData>(load)

  useEffect(() => save(data), [data])

  const addSession = useCallback((input: SessionInput): Session => {
    const session: Session = { ...input, id: uid(), createdAt: Date.now() }
    setData((d) => ({ ...d, sessions: [...d.sessions, session] }))
    return session
  }, [])

  const updateSession = useCallback((id: string, input: SessionInput) => {
    setData((d) => ({
      ...d,
      sessions: d.sessions.map((s) => (s.id === id ? { ...s, ...input } : s)),
    }))
  }, [])

  const deleteSession = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      sessions: d.sessions.filter((s) => s.id !== id),
      drips: d.drips.filter((dr) => dr.sessionId !== id),
    }))
  }, [])

  const addDrip = useCallback((sessionId: string, input: DripInput) => {
    const drip: Drip = { ...input, id: uid(), sessionId, createdAt: Date.now() }
    setData((d) => ({ ...d, drips: [...d.drips, drip] }))
  }, [])

  const updateDrip = useCallback((id: string, input: DripInput) => {
    setData((d) => ({
      ...d,
      drips: d.drips.map((dr) => (dr.id === id ? { ...dr, ...input } : dr)),
    }))
  }, [])

  const deleteDrip = useCallback((id: string) => {
    setData((d) => ({ ...d, drips: d.drips.filter((dr) => dr.id !== id) }))
  }, [])

  const replaceAll = useCallback((next: AppData) => setData(next), [])

  return {
    data,
    addSession,
    updateSession,
    deleteSession,
    addDrip,
    updateDrip,
    deleteDrip,
    replaceAll,
  }
}
