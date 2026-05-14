import type { CircleFit, DrawPoint } from '../../types/drawing'

export function fitCircleKasa(points: DrawPoint[]): CircleFit | null {
  if (points.length < 3) return null

  let sumX = 0
  let sumY = 0
  let sumX2 = 0
  let sumY2 = 0
  let sumXY = 0
  let sumX3 = 0
  let sumY3 = 0
  let sumX1Y2 = 0
  let sumX2Y1 = 0

  for (const p of points) {
    const x = p.x
    const y = p.y
    const x2 = x * x
    const y2 = y * y

    sumX += x
    sumY += y
    sumX2 += x2
    sumY2 += y2
    sumXY += x * y
    sumX3 += x2 * x
    sumY3 += y2 * y
    sumX1Y2 += x * y2
    sumX2Y1 += x2 * y
  }

  const n = points.length
  const c = n * sumX2 - sumX * sumX
  const d = n * sumXY - sumX * sumY
  const e = n * (sumX3 + sumX1Y2) - (sumX2 + sumY2) * sumX
  const g = n * sumY2 - sumY * sumY
  const h = n * (sumX2Y1 + sumY3) - (sumX2 + sumY2) * sumY

  const denominator = 2 * (c * g - d * d)
  if (Math.abs(denominator) < 1e-9) return null

  const cx = (g * e - d * h) / denominator
  const cy = (c * h - d * e) / denominator

  let rSum = 0
  for (const p of points) {
    const dx = p.x - cx
    const dy = p.y - cy
    rSum += Math.hypot(dx, dy)
  }
  const r = rSum / n

  let sqErr = 0
  for (const p of points) {
    const dist = Math.hypot(p.x - cx, p.y - cy)
    const err = dist - r
    sqErr += err * err
  }

  return { cx, cy, r, rmse: Math.sqrt(sqErr / n) }
}
