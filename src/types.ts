export const SCORE_KEYS = ['sweetness', 'acidity', 'aroma', 'body', 'bitterness'] as const

export type ScoreKey = (typeof SCORE_KEYS)[number]

export type Scores = Record<ScoreKey, number | null>

/** One coffee being dialed in: the things that stay the same across brews. */
export interface Session {
  id: string
  createdAt: number
  coffee: string
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
}

export const emptyScores = (): Scores => ({
  sweetness: null,
  acidity: null,
  aroma: null,
  body: null,
  bitterness: null,
})
