export type SupportedPointerType = 'mouse' | 'touch' | 'pen'

export interface DrawPoint {
  x: number
  y: number
  t: number
  pressure: number
  pointerType: SupportedPointerType
}

export interface CircleFit {
  cx: number
  cy: number
  r: number
  rmse: number
}

export interface CircleMetrics {
  radiusConsistency: number
  regressionAccuracy: number
  closurePrecision: number
  smoothness: number
  velocityStability: number
  wobbleControl: number
  angularContinuity: number
}

export interface LiveScore {
  score: number
  metrics: CircleMetrics
  fit: CircleFit | null
  sampleCount: number
}

export interface AttemptResult extends LiveScore {
  durationMs: number
  label: string
  commentary: string
  mode: 'solo' | 'timeAttack'
  points: DrawPoint[]
}

export interface WorkerRequest {
  type: 'score'
  points: DrawPoint[]
}

export interface WorkerResponse {
  type: 'score'
  payload: LiveScore
}
