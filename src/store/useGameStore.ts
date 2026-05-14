import { create } from 'zustand'
import type { GameState, LeaderboardEntry } from '../types/game'
import type { CircleMetrics } from '../types/drawing'
import { commentaryForScore, precisionStatus } from '../utils/labels'

const metricsZero: CircleMetrics = {
  radiusConsistency: 0,
  regressionAccuracy: 0,
  closurePrecision: 0,
  smoothness: 0,
  velocityStability: 0,
  wobbleControl: 0,
  angularContinuity: 0,
}

const seedLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'Astra', score: 96, mode: 'solo', dateISO: new Date().toISOString() },
  { id: '2', name: 'Nova', score: 91, mode: 'timeAttack', dateISO: new Date().toISOString() },
  { id: '3', name: 'Orion', score: 88, mode: 'solo', dateISO: new Date().toISOString() },
]

export const useGameStore = create<GameState>((set) => ({
  screen: 'landing',
  mode: 'solo',
  live: {
    accuracy: 0,
    stability: 0,
    smoothness: 0,
    speed: 0,
    precisionStatus: 'Unstable',
    commentary: 'Draw one continuous loop to begin.',
    metrics: metricsZero,
  },
  isDrawing: false,
  attemptStartedAt: null,
  result: null,
  thresholdHits: [],
  leaderboard: seedLeaderboard,
  setScreen: (screen) => set({ screen }),
  startAttempt: (mode) =>
    set({
      screen: mode,
      mode,
      result: null,
      attemptStartedAt: Date.now(),
      thresholdHits: [],
      live: {
        accuracy: 0,
        stability: 0,
        smoothness: 0,
        speed: 0,
        precisionStatus: 'Unstable',
        commentary: 'Trace a confident orbit.',
        metrics: metricsZero,
      },
    }),
  updateLive: (score, speed, commentary) =>
    set(() => ({
      live: {
        accuracy: score.score,
        stability: Math.round(
          (score.metrics.velocityStability * 0.5 + score.metrics.wobbleControl * 0.5) * 100,
        ),
        smoothness: Math.round(score.metrics.smoothness * 100),
        speed,
        precisionStatus: precisionStatus(score.score),
        commentary: commentary || commentaryForScore(score.score),
        metrics: score.metrics,
      },
    })),
  markDrawing: (drawing) => set({ isDrawing: drawing }),
  hitThreshold: (v) =>
    set((state) =>
      state.thresholdHits.includes(v)
        ? state
        : { thresholdHits: [...state.thresholdHits, v].sort((a, b) => a - b) },
    ),
  completeAttempt: (result) =>
    set((state) => {
      const entry: LeaderboardEntry = {
        id: crypto.randomUUID(),
        name: 'You',
        score: result.score,
        mode: result.mode,
        dateISO: new Date().toISOString(),
      }
      const leaderboard = [...state.leaderboard, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)

      return {
        screen: 'result',
        isDrawing: false,
        result,
        leaderboard,
      }
    }),
  resetAttempt: () =>
    set({
      isDrawing: false,
      attemptStartedAt: null,
      thresholdHits: [],
      live: {
        accuracy: 0,
        stability: 0,
        smoothness: 0,
        speed: 0,
        precisionStatus: 'Unstable',
        commentary: 'Draw one continuous loop to begin.',
        metrics: metricsZero,
      },
    }),
}))
