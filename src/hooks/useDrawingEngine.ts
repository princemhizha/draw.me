import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { renderFrame } from '../engine/rendering/canvasRenderer'
import { useScoringWorker } from './useScoringWorker'
import type { AttemptResult, DrawPoint, LiveScore } from '../types/drawing'
import { commentaryForScore, scoreLabel } from '../utils/labels'

interface UseDrawingEngineParams {
  mode: 'solo' | 'timeAttack'
  onLiveUpdate: (score: LiveScore, speed: number, commentary: string) => void
  onFinish: (result: AttemptResult) => void
}

export function useDrawingEngine({ mode, onLiveUpdate, onFinish }: UseDrawingEngineParams) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pointsRef = useRef<DrawPoint[]>([])
  const drawingRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const scoreThrottleRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const liveScoreRef = useRef<LiveScore | null>(null)
  const lastInkPointRef = useRef<DrawPoint | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [debugEventCount, setDebugEventCount] = useState(0)

  const { liveScore, scorePoints } = useScoringWorker()

  useEffect(() => {
    liveScoreRef.current = liveScore
  }, [liveScore])

  const render = useCallback(() => {
    rafRef.current = requestAnimationFrame(render)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    renderFrame(
      ctx,
      canvas.clientWidth || canvas.width,
      canvas.clientHeight || canvas.height,
      pointsRef.current,
      liveScoreRef.current,
    )
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(render)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [render])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.floor(rect.width * ratio)
      canvas.height = Math.floor(rect.height * ratio)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      }
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!liveScore || pointsRef.current.length < 4) return

    const pts = pointsRef.current
    const n = pts.length
    const p1 = pts[Math.max(0, n - 8)]
    const p2 = pts[n - 1]
    const dt = Math.max(p2.t - p1.t, 1)
    const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y)
    const speed = Math.round((distance / dt) * 1000)
    onLiveUpdate(liveScore, speed, commentaryForScore(liveScore.score))
  }, [liveScore, onLiveUpdate])

  const pointerToPoint = useCallback((event: PointerEvent): DrawPoint => {
    const canvas = canvasRef.current
    if (!canvas) {
      return { x: 0, y: 0, t: performance.now(), pressure: 0.5, pointerType: 'mouse' }
    }

    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      t: performance.now(),
      pressure: Math.max(0.05, event.pressure || 0.5),
      pointerType: (event.pointerType as DrawPoint['pointerType']) || 'mouse',
    }
  }, [])

  const drawImmediateInk = useCallback((from: DrawPoint, to: DrawPoint) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const score = liveScoreRef.current?.score ?? 0
    let stroke = '#f8fafc'
    if (score >= 90) stroke = '#24e0c2'
    else if (score >= 80) stroke = '#8ce87e'
    else if (score >= 70) stroke = '#f8d06f'
    else stroke = '#ff965e'

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 6
    ctx.shadowBlur = 14
    ctx.shadowColor = stroke
    ctx.strokeStyle = stroke
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.restore()
  }, [])

  const finishAttempt = useCallback(() => {
    if (!pointsRef.current.length || !liveScore || !startTimeRef.current) return

    const durationMs = Math.max(1, Math.round(performance.now() - startTimeRef.current))
    onFinish({
      ...liveScore,
      durationMs,
      label: scoreLabel(liveScore.score),
      commentary: commentaryForScore(liveScore.score),
      mode,
      points: pointsRef.current,
    })
  }, [liveScore, mode, onFinish])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onPointerDown = (event: PointerEvent) => {
      setDebugEventCount((c) => c + 1)
      if (pointerIdRef.current !== null) return
      if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId)
      pointerIdRef.current = event.pointerId
      drawingRef.current = true
      setIsDrawing(true)
      pointsRef.current = []
      startTimeRef.current = performance.now()

      const startPoint = pointerToPoint(event)
      pointsRef.current.push(startPoint)
      lastInkPointRef.current = startPoint

      drawImmediateInk(startPoint, startPoint)
      // Force full redraw for fallback
      const ctx = canvas.getContext('2d')
      if (ctx) {
        renderFrame(
          ctx,
          canvas.clientWidth || canvas.width,
          canvas.clientHeight || canvas.height,
          pointsRef.current,
          liveScoreRef.current,
        )
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      setDebugEventCount((c) => c + 1)
      if (!drawingRef.current || pointerIdRef.current !== event.pointerId) return
      const point = pointerToPoint(event)
      pointsRef.current.push(point)

      if (lastInkPointRef.current) {
        drawImmediateInk(lastInkPointRef.current, point)
      }
      lastInkPointRef.current = point

      // Force full redraw for fallback
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          renderFrame(
            ctx,
            canvas.clientWidth || canvas.width,
            canvas.clientHeight || canvas.height,
            pointsRef.current,
            liveScoreRef.current,
          )
        }
      }

      if (point.t - scoreThrottleRef.current > 42 && pointsRef.current.length > 10) {
        scoreThrottleRef.current = point.t
        scorePoints(pointsRef.current.slice())
      }
    }

    const endDrawing = (event: PointerEvent) => {
      setDebugEventCount((c) => c + 1)
      if (pointerIdRef.current !== event.pointerId) return
      if (canvas.releasePointerCapture) canvas.releasePointerCapture(event.pointerId)
      pointerIdRef.current = null
      drawingRef.current = false
      setIsDrawing(false)
      lastInkPointRef.current = null
      scorePoints(pointsRef.current.slice())
      // Show result immediately after drawing ends
      setTimeout(() => {
        if (liveScoreRef.current && pointsRef.current.length > 10 && startTimeRef.current) {
          const durationMs = Math.max(1, Math.round(performance.now() - startTimeRef.current))
          onFinish({
            ...liveScoreRef.current,
            durationMs,
            label: scoreLabel(liveScoreRef.current.score),
            commentary: commentaryForScore(liveScoreRef.current.score),
            mode,
            points: pointsRef.current,
          })
        }
      }, 120)
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', endDrawing)
    canvas.addEventListener('pointercancel', endDrawing)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', endDrawing)
      canvas.removeEventListener('pointercancel', endDrawing)
    }
  }, [drawImmediateInk, pointerToPoint, scorePoints])

  const clearCanvas = useCallback(() => {
    pointsRef.current = []
    startTimeRef.current = null
  }, [])

  const sampledPoints = useMemo(() => pointsRef.current, [isDrawing])

  return {
    containerRef,
    canvasRef,
    isDrawing,
    sampledPoints,
    liveScore,
    finishAttempt,
    clearCanvas,
    debugEventCount,
  }
}
