import type { AttemptResult, CircleMetrics, LiveScore } from './drawing'

export type AppScreen =
  | 'landing'
  | 'solo'
  | 'timeAttack'
  | 'result'
  | 'leaderboard'
  | 'settings'

export interface LiveHudState {
  accuracy: number
  stability: number
  smoothness: number
  speed: number
  precisionStatus: string
  commentary: string
  metrics: CircleMetrics
}

export interface LeaderboardEntry {
  id: string
  name: string
  score: number
  mode: 'solo' | 'timeAttack'
  dateISO: string
}

export interface GameState {
  screen: AppScreen
  mode: 'solo' | 'timeAttack'
  live: LiveHudState
  isDrawing: boolean
  attemptStartedAt: number | null
  result: AttemptResult | null
  leaderboard: LeaderboardEntry[]
  thresholdHits: number[]
  setScreen: (screen: AppScreen) => void
  startAttempt: (mode: 'solo' | 'timeAttack') => void
  updateLive: (score: LiveScore, speed: number, commentary: string) => void
  markDrawing: (drawing: boolean) => void
  hitThreshold: (v: number) => void
  completeAttempt: (result: AttemptResult) => void
  resetAttempt: () => void
}
