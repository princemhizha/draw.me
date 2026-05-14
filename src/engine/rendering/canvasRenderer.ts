import type { DrawPoint, LiveScore } from '../../types/drawing'

function strokeColor(score: number): string {
  if (score >= 90) return '#18d1b5'
  if (score >= 80) return '#74de73'
  if (score >= 70) return '#e2b44a'
  return '#f26f3a'
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  points: DrawPoint[],
  liveScore: LiveScore | null,
): void {
  ctx.clearRect(0, 0, width, height)

  const gradient = ctx.createRadialGradient(width * 0.5, height * 0.45, 20, width * 0.5, height * 0.45, width * 0.65)
  gradient.addColorStop(0, 'rgba(16, 40, 49, 0.48)')
  gradient.addColorStop(1, 'rgba(5, 10, 16, 0.1)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  const score = liveScore?.score ?? 0
  const color = strokeColor(score)
  const glow = Math.max(6, score / 2)

  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.lineWidth = 5
  ctx.strokeStyle = color
  ctx.shadowBlur = glow + 8
  ctx.shadowColor = color

  if (points.length > 1) {
    // First pass creates a soft halo so the stroke is visible on any display.
    ctx.save()
    ctx.strokeStyle = 'rgba(204, 251, 241, 0.35)'
    ctx.lineWidth = 10
    ctx.shadowBlur = 0
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length - 1; i += 1) {
      const xc = (points[i].x + points[i + 1].x) / 2
      const yc = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
    }
    const outerLast = points[points.length - 1]
    ctx.lineTo(outerLast.x, outerLast.y)
    ctx.stroke()
    ctx.restore()

    // Second pass is the score-colored primary stroke.
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.lineWidth = 5
    ctx.strokeStyle = color
    ctx.shadowBlur = glow + 8
    ctx.shadowColor = color
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length - 1; i += 1) {
      const xc = (points[i].x + points[i + 1].x) / 2
      const yc = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
    }

    const last = points[points.length - 1]
    ctx.lineTo(last.x, last.y)
    ctx.stroke()

    // Endpoint marker reinforces that drawing is actively tracked.
    ctx.save()
    ctx.shadowBlur = 18
    ctx.fillStyle = '#d9fff7'
    ctx.beginPath()
    ctx.arc(last.x, last.y, 3.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  if (liveScore?.fit) {
    ctx.save()
    ctx.setLineDash([7, 8])
    ctx.lineWidth = 1.3
    ctx.strokeStyle = 'rgba(34, 211, 193, 0.45)'
    ctx.shadowBlur = 0
    ctx.beginPath()
    ctx.arc(liveScore.fit.cx, liveScore.fit.cy, liveScore.fit.r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}
