import type { CircleMetrics, DrawPoint, LiveScore } from '../../types/drawing'
import { fitCircleKasa } from '../geometry/circleFit'

const zeroMetrics: CircleMetrics = {
  radiusConsistency: 0,
  regressionAccuracy: 0,
  closurePrecision: 0,
  smoothness: 0,
  velocityStability: 0,
  wobbleControl: 0,
  angularContinuity: 0,
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

function std(values: number[]): number {
  if (!values.length) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function unwrapAngles(angles: number[]): number[] {
  if (angles.length === 0) return []
  const unwrapped = [angles[0]]
  for (let i = 1; i < angles.length; i += 1) {
    let delta = angles[i] - angles[i - 1]
    if (delta > Math.PI) delta -= Math.PI * 2
    if (delta < -Math.PI) delta += Math.PI * 2
    unwrapped.push(unwrapped[i - 1] + delta)
  }
  return unwrapped
}

export function calculateLiveScore(points: DrawPoint[]): LiveScore {
  if (points.length < 12) {
    return { score: 0, metrics: zeroMetrics, fit: null, sampleCount: points.length }
  }

  const fit = fitCircleKasa(points)
  if (!fit || !Number.isFinite(fit.r) || fit.r < 8) {
    return { score: 0, metrics: zeroMetrics, fit: null, sampleCount: points.length }
  }

  const radii = points.map((p) => Math.hypot(p.x - fit.cx, p.y - fit.cy))
  const meanRadius = radii.reduce((a, b) => a + b, 0) / radii.length
  const radiusStd = std(radii)
  const radiusCv = radiusStd / Math.max(meanRadius, 1)
  const radiusConsistency = clamp01(1 - radiusCv / 0.22)

  const regressionAccuracy = clamp01(1 - fit.rmse / Math.max(meanRadius * 0.26, 1))

  const first = points[0]
  const last = points[points.length - 1]
  const closureDistance = Math.hypot(last.x - first.x, last.y - first.y)
  const closurePrecision = clamp01(1 - closureDistance / Math.max(meanRadius * 1.2, 1))

  const angles = points.map((p) => Math.atan2(p.y - fit.cy, p.x - fit.cx))
  const unwrapped = unwrapAngles(angles)
  const angularSweep = Math.abs(unwrapped[unwrapped.length - 1] - unwrapped[0])
  const angularCoverage = clamp01(angularSweep / (Math.PI * 2))

  const angularDeltas: number[] = []
  for (let i = 1; i < unwrapped.length; i += 1) {
    angularDeltas.push(unwrapped[i] - unwrapped[i - 1])
  }
  const directionConsistency = clamp01(1 - std(angularDeltas) / 0.18)
  const angularContinuity = clamp01(angularCoverage * 0.75 + directionConsistency * 0.25)

  const segmentAngles: number[] = []
  for (let i = 1; i < points.length; i += 1) {
    segmentAngles.push(Math.atan2(points[i].y - points[i - 1].y, points[i].x - points[i - 1].x))
  }
  const headingChange: number[] = []
  for (let i = 1; i < segmentAngles.length; i += 1) {
    let d = segmentAngles[i] - segmentAngles[i - 1]
    if (d > Math.PI) d -= Math.PI * 2
    if (d < -Math.PI) d += Math.PI * 2
    headingChange.push(d)
  }
  const smoothness = clamp01(1 - std(headingChange) / 0.55)

  const velocities: number[] = []
  for (let i = 1; i < points.length; i += 1) {
    const dt = Math.max(points[i].t - points[i - 1].t, 1)
    const d = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
    velocities.push(d / dt)
  }
  const vMean = velocities.reduce((a, b) => a + b, 0) / Math.max(velocities.length, 1)
  const velocityStability = clamp01(1 - std(velocities) / Math.max(vMean * 1.2, 0.001))

  const radialNoise: number[] = []
  for (let i = 1; i < radii.length; i += 1) {
    radialNoise.push(Math.abs(radii[i] - radii[i - 1]))
  }
  const wobbleControl = clamp01(1 - std(radialNoise) / Math.max(meanRadius * 0.05, 0.001))

  const metrics: CircleMetrics = {
    radiusConsistency,
    regressionAccuracy,
    closurePrecision,
    smoothness,
    velocityStability,
    wobbleControl,
    angularContinuity,
  }

  const weightedScore =
    radiusConsistency * 0.2 +
    regressionAccuracy * 0.23 +
    closurePrecision * 0.13 +
    smoothness * 0.12 +
    velocityStability * 0.11 +
    wobbleControl * 0.1 +
    angularContinuity * 0.11

  return {
    score: Math.round(clamp01(weightedScore) * 100),
    metrics,
    fit,
    sampleCount: points.length,
  }
}
