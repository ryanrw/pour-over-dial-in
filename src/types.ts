export const SCORE_KEYS = ['sweetness', 'acidity', 'aroma', 'body', 'bitterness', 'aftertaste'] as const

export type ScoreKey = (typeof SCORE_KEYS)[number]

export type Scores = Record<ScoreKey, number | null>

/** One coffee being dialed in: the things that stay the same across brews. */
export interface Session {
  id: string
  createdAt: number
  /** free-form name, e.g. roaster + lot; may be empty when the bean details say enough */
  coffee: string
  origin: string
  farm: string
  variety: string
  process: string
  /** key into the photo store (IndexedDB), or null */
  photoId: string | null
  dripper: string
  grinder: string
  /** Water TDS in ppm */
  waterTds: number | null
}

export type SessionInput = Omit<Session, 'id' | 'createdAt'>

/** A single brew within a session. */
export interface Drip {
  id: string
  sessionId: string
  createdAt: number
  /** grams of coffee */
  dose: number | null
  /** the X in 1:X */
  ratio: number | null
  /** grams of water */
  water: number | null
  grind: string
  /** °C */
  temp: number | null
  recipe: string
  /** mm:ss */
  finishTime: string
  scores: Scores
  dry: boolean
  comment: string
  adjustment: string
}

export type DripInput = Omit<Drip, 'id' | 'sessionId' | 'createdAt'>

export interface AppData {
  version: 1
  sessions: Session[]
  drips: Drip[]
  /** only present in exported backups: photoId -> data URL */
  photos?: Record<string, string>
}

export const emptyScores = (): Scores => ({
  sweetness: null,
  acidity: null,
  aroma: null,
  body: null,
  bitterness: null,
  aftertaste: null,
})

/** Fill in fields added after the first release so older data keeps working. */
export function normalizeData(data: AppData): AppData {
  return {
    version: 1,
    sessions: data.sessions.map((s) => ({
      ...s,
      coffee: s.coffee ?? '',
      origin: s.origin ?? '',
      farm: s.farm ?? '',
      variety: s.variety ?? '',
      process: s.process ?? '',
      photoId: s.photoId ?? null,
    })),
    drips: data.drips.map((d) => ({ ...d, scores: { ...emptyScores(), ...d.scores } })),
  }
}

/** Name to show for a coffee: its own name, else origin + farm. */
export function sessionTitle(s: Session): string {
  return s.coffee || [s.origin, s.farm].filter(Boolean).join(' ')
}

/** "Rwanda · West Akagera · Red Bourbon · Natural", skipping empty parts. */
export function beanDetails(s: Session): string {
  return [s.origin, s.farm, s.variety, s.process].filter(Boolean).join(' · ')
}
